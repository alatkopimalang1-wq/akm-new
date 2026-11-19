<?php

namespace App\Services;

use App\Models\Order;
use App\Models\Setting;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class BiteshipService
{
    public const BASE_URL = 'https://api.biteship.com/v1';

    /**
     * Get Biteship API Key from Settings or .env.
     */
    public static function getApiKey(): ?string
    {
        $key = Setting::get('biteship_api_key');
        if (! empty($key)) {
            return trim((string) $key);
        }

        return env('BITESHIP_API_KEY');
    }

    /**
     * Check if Biteship integration is enabled.
     */
    public static function isEnabled(): bool
    {
        $enabled = Setting::get('biteship_enabled');
        if ($enabled === null) {
            return ! empty(self::getApiKey());
        }

        return (bool) $enabled && ! empty(self::getApiKey());
    }

    /**
     * Get active Biteship environment (testing or production).
     */
    public static function getEnvironment(): string
    {
        $env = (string) Setting::get('biteship_environment', 'testing');
        return in_array($env, ['testing', 'production'], true) ? $env : 'testing';
    }

    /**
     * Test API connection with current API Key.
     */
    public static function testConnection(?string $apiKey = null): array
    {
        $key = $apiKey ?: self::getApiKey();

        if (empty($key)) {
            return [
                'success' => false,
                'message' => 'API Key Biteship belum diisi. Silakan masukkan API Key Anda.',
            ];
        }

        try {
            $response = Http::timeout(10)
                ->withHeaders([
                    'Authorization' => $key,
                    'Accept' => 'application/json',
                ])
                ->get(self::BASE_URL . '/couriers');

            if ($response->successful()) {
                $couriers = $response->json()['couriers'] ?? [];
                $count = count($couriers);
                $mode = str_starts_with($key, 'biteship_test.') ? 'Testing (Sandbox)' : 'Production (Live)';

                return [
                    'success' => true,
                    'message' => "Koneksi ke Biteship API Berhasil! Mode: {$mode}. Terdeteksi {$count} opsi layanan kurir aktif.",
                    'courier_count' => $count,
                    'mode' => $mode,
                ];
            }

            $errMsg = $response->json()['error'] ?? $response->json()['message'] ?? "HTTP {$response->status()}";
            return [
                'success' => false,
                'message' => "Gagal terhubung ke Biteship API: {$errMsg}",
            ];
        } catch (\Throwable $e) {
            return [
                'success' => false,
                'message' => 'Terjadi kesalahan jaringan saat menghubungi server Biteship: ' . $e->getMessage(),
            ];
        }
    }

    /**
     * Fetch courier rates from Biteship.
     */
    public static function getRates(array $params): array
    {
        $apiKey = self::getApiKey();
        if (empty($apiKey)) {
            return [];
        }

        $originPostalCode = (int) ($params['origin_postal_code'] ?? ShippingService::DEFAULT_ORIGIN_POSTAL_CODE);
        $destPostalCode = ! empty($params['destination_postal_code']) ? (int) $params['destination_postal_code'] : null;

        $destLat = isset($params['destination_latitude']) ? (float) $params['destination_latitude'] : null;
        $destLng = isset($params['destination_longitude']) ? (float) $params['destination_longitude'] : null;
        $originLat = (float) ($params['origin_latitude'] ?? ShippingService::DEFAULT_ORIGIN_LATITUDE);
        $originLng = (float) ($params['origin_longitude'] ?? ShippingService::DEFAULT_ORIGIN_LONGITUDE);

        $weightGrams = max(100, (int) ($params['weight_grams'] ?? 1000));
        $subtotal = (float) ($params['subtotal'] ?? 100000);
        $couriers = $params['couriers'] ?? ['jne', 'jnt', 'sicepat', 'anteraja', 'pos', 'tiki'];

        $payload = [
            'couriers' => is_array($couriers) ? implode(',', $couriers) : (string) $couriers,
            'items' => [
                [
                    'name' => 'Pesanan Alat Kopi Malang',
                    'value' => (int) $subtotal,
                    'weight' => $weightGrams,
                    'quantity' => 1,
                ],
            ],
        ];

        if ($destPostalCode) {
            $payload['origin_postal_code'] = $originPostalCode;
            $payload['destination_postal_code'] = $destPostalCode;
        }

        if ($destLat && $destLng) {
            $payload['origin_latitude'] = $originLat;
            $payload['origin_longitude'] = $originLng;
            $payload['destination_latitude'] = $destLat;
            $payload['destination_longitude'] = $destLng;
        }

        // If neither destination postal code nor GPS coordinates are available, we cannot calculate
        if (! isset($payload['destination_postal_code']) && ! isset($payload['destination_latitude'])) {
            return [];
        }

        try {
            $response = Http::timeout(8)
                ->withHeaders([
                    'Authorization' => $apiKey,
                    'Content-Type' => 'application/json',
                    'Accept' => 'application/json',
                ])
                ->post(self::BASE_URL . '/rates/couriers', $payload);

            if ($response->successful()) {
                $pricing = $response->json()['pricing'] ?? [];
                if (! empty($pricing) && is_array($pricing)) {
                    $results = [];
                    foreach ($pricing as $p) {
                        $cost = (int) ($p['price'] ?? $p['shipping_fee'] ?? 0);
                        if ($cost <= 0) {
                            continue;
                        }

                        $code = strtolower((string) ($p['courier_code'] ?? $p['company'] ?? 'kurir'));
                        $service = strtoupper((string) ($p['courier_service_code'] ?? $p['type'] ?? 'REG'));
                        $courierName = (string) ($p['courier_name'] ?? strtoupper($code));
                        $serviceName = (string) ($p['courier_service_name'] ?? $service);
                        $description = (string) ($p['description'] ?? "{$courierName} {$serviceName}");
                        $duration = (string) ($p['duration'] ?? ($p['shipment_duration_range'] ? "{$p['shipment_duration_range']} {$p['shipment_duration_unit']}" : '1-3 hari'));

                        $badge = null;
                        if (str_contains(strtolower($serviceName), 'yes') || str_contains(strtolower($serviceName), 'instant') || str_contains(strtolower($serviceName), 'next day')) {
                            $badge = 'Express Cepat';
                        } elseif (str_contains(strtolower($serviceName), 'trucking') || str_contains(strtolower($serviceName), 'cargo')) {
                            $badge = 'Kargo Hemat';
                        }

                        $results[] = [
                            'courier' => "{$courierName} ({$serviceName})",
                            'courier_code' => $code,
                            'service' => $service,
                            'description' => $description,
                            'cost' => $cost,
                            'original_cost' => $cost,
                            'etd' => $duration,
                            'is_free' => false,
                            'badge' => $badge,
                            'source' => 'biteship',
                        ];
                    }

                    usort($results, fn ($a, $b) => $a['cost'] <=> $b['cost']);
                    return $results;
                }
            } else {
                Log::warning('Biteship rates API error: ' . $response->body());
            }
        } catch (\Throwable $e) {
            Log::warning('Biteship getRates error: ' . $e->getMessage());
        }

        return [];
    }

    /**
     * Create shipment order and request pickup on Biteship.
     */
    public static function createShipmentOrder(Order $order, ?string $courierCompany = null, ?string $courierType = null): array
    {
        $apiKey = self::getApiKey();
        if (empty($apiKey)) {
            return [
                'success' => false,
                'message' => 'API Key Biteship belum disetel.',
            ];
        }

        $courier = strtolower($courierCompany ?: ($order->shipping_courier ?: 'jne'));
        $service = strtolower($courierType ?: 'reg');

        $senderName = Setting::get('shipping_sender_name', 'Alat Kopi Malang Tlogomas');
        $senderPhone = Setting::get('whatsapp', '082132095241');
        $senderAddress = Setting::get('pickup_store_address', 'Ruko Tlogomas Square Kav. 34, Jl. Raya Tlogomas, Lowokwaru, Kota Malang');
        $senderPostalCode = (int) Setting::get('shipping_origin_postal_code', 65144);

        $order->loadMissing('items');
        $items = [];
        foreach ($order->items as $item) {
            $items[] = [
                'name' => (string) ($item->product_name . ($item->variant_label ? " ({$item->variant_label})" : '')),
                'description' => 'Perlengkapan / Biji Kopi',
                'value' => (int) ($item->price ?? 50000),
                'quantity' => (int) ($item->quantity ?? 1),
                'weight' => max(100, (int) ($item->weight_grams ?? 250)),
            ];
        }

        if (empty($items)) {
            $items[] = [
                'name' => "Pesanan {$order->order_number}",
                'value' => (int) $order->total_amount,
                'quantity' => 1,
                'weight' => max(100, (int) ($order->total_weight_grams ?: 1000)),
            ];
        }

        $payload = [
            'shipper_contact_name' => $senderName,
            'shipper_contact_phone' => $senderPhone,
            'shipper_contact_email' => 'alatkopimalang1@gmail.com',
            'shipper_organization' => 'Alat Kopi Malang',
            'origin_contact_name' => $senderName,
            'origin_contact_phone' => $senderPhone,
            'origin_address' => $senderAddress,
            'origin_postal_code' => $senderPostalCode,
            'destination_contact_name' => (string) ($order->customer_name ?: 'Pelanggan'),
            'destination_contact_phone' => (string) ($order->customer_phone ?: '08123456789'),
            'destination_address' => (string) ($order->shipping_address ?: 'Alamat Penerima'),
            'destination_postal_code' => ! empty($order->shipping_postal_code) ? (int) $order->shipping_postal_code : 65144,
            'courier_company' => $courier,
            'courier_type' => $service,
            'delivery_type' => 'now',
            'order_note' => 'Paket kopi spesialti. Harap tidak dibanting.',
            'items' => $items,
        ];

        try {
            $response = Http::timeout(15)
                ->withHeaders([
                    'Authorization' => $apiKey,
                    'Content-Type' => 'application/json',
                    'Accept' => 'application/json',
                ])
                ->post(self::BASE_URL . '/orders', $payload);

            $data = $response->json();

            if ($response->successful() && ($data['success'] ?? false)) {
                $orderId = $data['id'] ?? null;
                $waybill = $data['courier']['waybill_id'] ?? $data['courier']['tracking_id'] ?? null;
                $labelUrl = $data['courier']['tracking_url'] ?? "https://tracking.biteship.com/{$orderId}";

                $paymentDetails = $order->payment_details ?? [];
                $paymentDetails['biteship'] = [
                    'order_id' => $orderId,
                    'waybill_id' => $waybill,
                    'tracking_id' => $data['courier']['tracking_id'] ?? null,
                    'courier_company' => $courier,
                    'courier_type' => $service,
                    'tracking_url' => $labelUrl,
                    'created_at' => now()->toDateTimeString(),
                    'raw_response' => $data,
                ];

                $order->tracking_number = $waybill ?: $orderId;
                $order->shipping_courier = strtoupper($courier) . " " . strtoupper($service);
                $order->payment_details = $paymentDetails;
                $order->status = 'shipped';
                $order->save();

                return [
                    'success' => true,
                    'message' => "Order Biteship berhasil dibuat! Resi: " . ($waybill ?: $orderId),
                    'order_id' => $orderId,
                    'waybill_id' => $waybill,
                    'tracking_url' => $labelUrl,
                ];
            }

            $errMsg = $data['error'] ?? $data['message'] ?? 'Gagal membuat order pengiriman di Biteship.';
            return [
                'success' => false,
                'message' => "Biteship Error: {$errMsg}",
            ];
        } catch (\Throwable $e) {
            return [
                'success' => false,
                'message' => 'Terjadi kesalahan saat memanggil API Biteship: ' . $e->getMessage(),
            ];
        }
    }

    /**
     * Track package by Biteship Waybill ID and courier code.
     */
    public static function trackWaybill(string $waybill, string $courierCode): array
    {
        $apiKey = self::getApiKey();
        if (empty($apiKey)) {
            return [
                'success' => false,
                'message' => 'API Key Biteship belum disetel.',
            ];
        }

        $courier = strtolower($courierCode);

        try {
            $response = Http::timeout(10)
                ->withHeaders([
                    'Authorization' => $apiKey,
                    'Accept' => 'application/json',
                ])
                ->get(self::BASE_URL . "/trackings/{$waybill}/couriers/{$courier}");

            if ($response->successful()) {
                $data = $response->json();
                $history = [];
                foreach (($data['history'] ?? []) as $h) {
                    $history[] = [
                        'date' => (string) ($h['updated_at'] ?? ''),
                        'desc' => (string) ($h['note'] ?? $h['status'] ?? ''),
                        'location' => (string) ($h['service_type'] ?? ''),
                    ];
                }

                $status = strtoupper((string) ($data['status'] ?? 'ON_PROCESS'));
                $isDelivered = in_array($status, ['DELIVERED', 'COMPLETED'], true);

                return [
                    'success' => true,
                    'provider' => 'Biteship Live Tracking',
                    'courier_name' => strtoupper($courier),
                    'waybill' => $waybill,
                    'status' => $status,
                    'status_label' => $isDelivered ? 'Paket Telah Diterima (Delivered)' : 'Dalam Proses Pengiriman (' . $status . ')',
                    'shipper' => $data['shipper']['name'] ?? 'Alat Kopi Malang',
                    'receiver' => $data['destination']['name'] ?? '-',
                    'origin' => 'Malang',
                    'destination' => $data['destination']['address'] ?? '-',
                    'delivered' => $isDelivered,
                    'history' => $history,
                ];
            }
        } catch (\Throwable $e) {
            Log::warning('Biteship tracking error: ' . $e->getMessage());
        }

        return [
            'success' => false,
            'message' => 'Data resi belum terdaftar atau masih dalam proses pemindaian sistem kurir.',
        ];
    }
}
