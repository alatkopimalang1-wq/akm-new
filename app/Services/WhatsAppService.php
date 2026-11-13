<?php

namespace App\Services;

use App\Models\Setting;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class WhatsAppService
{
    /**
     * Send OTP verification message to customer's WhatsApp number.
     */
    public static function sendOtp(string $phone, string $otp): bool
    {
        $message = "☕ *Sanubari Roastery*\n\nKode OTP Verifikasi Masuk Anda:\n*{$otp}*\n\nGunakan kode ini untuk masuk ke akun Anda. Kode berlaku selama 10 menit.\n\n_Demi keamanan akun Anda, jangan bagikan kode ini kepada siapa pun._";

        return self::sendMessage($phone, $message);
    }

    /**
     * Send WhatsApp message via configured gateway (Fonnte, Wablas, or fallback log).
     */
    public static function sendMessage(string $phone, string $message): bool
    {
        $cleanPhone = preg_replace('/[^0-9]/', '', $phone);

        if (str_starts_with($cleanPhone, '0')) {
            $cleanPhone = '62' . substr($cleanPhone, 1);
        } elseif (! str_starts_with($cleanPhone, '62') && ! empty($cleanPhone)) {
            $cleanPhone = '62' . $cleanPhone;
        }

        $provider = Setting::get('whatsapp_gateway_provider', env('WHATSAPP_GATEWAY_PROVIDER', 'auto'));
        $token = Setting::get('whatsapp_gateway_token', env('WHATSAPP_GATEWAY_TOKEN', env('FONNTE_TOKEN')));

        // 1. Fonnte Provider (Standard Indonesian WhatsApp Gateway)
        if (! empty($token) && ($provider === 'fonnte' || $provider === 'auto')) {
            try {
                $response = Http::withHeaders([
                    'Authorization' => $token,
                ])->timeout(8)->post('https://api.fonnte.com/send', [
                    'target' => $cleanPhone,
                    'message' => $message,
                    'countryCode' => '62',
                ]);

                if ($response->successful()) {
                    Log::info("WhatsApp OTP sent successfully via Fonnte to +{$cleanPhone}");
                    return true;
                }

                Log::warning("Fonnte WhatsApp API error (status {$response->status()}): " . $response->body());
            } catch (\Throwable $e) {
                Log::error("Fonnte WhatsApp dispatch exception: " . $e->getMessage());
            }
        }

        // 2. Wablas Provider
        $wablasToken = Setting::get('wablas_token', env('WABLAS_TOKEN'));
        $wablasServer = Setting::get('wablas_server', env('WABLAS_SERVER', 'https://bdg.wablas.com'));
        if (! empty($wablasToken) && ($provider === 'wablas' || $provider === 'auto')) {
            try {
                $response = Http::withHeaders([
                    'Authorization' => $wablasToken,
                ])->timeout(8)->post(rtrim($wablasServer, '/') . '/api/send-message', [
                    'phone' => $cleanPhone,
                    'message' => $message,
                ]);

                if ($response->successful()) {
                    Log::info("WhatsApp OTP sent successfully via Wablas to +{$cleanPhone}");
                    return true;
                }

                Log::warning("Wablas WhatsApp API error (status {$response->status()}): " . $response->body());
            } catch (\Throwable $e) {
                Log::error("Wablas WhatsApp dispatch exception: " . $e->getMessage());
            }
        }

        // 3. System Log (for local development or when gateway token is not yet configured)
        Log::info("[WhatsApp Gateway] OTP message sent to +{$cleanPhone}:\n" . $message);

        return true;
    }
}

