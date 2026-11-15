<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;

class GoogleAuthController extends Controller
{
    /**
     * Get configured Google Client ID.
     */
    public static function getClientId(): ?string
    {
        return config('services.google.client_id') ?: Setting::get('google_client_id');
    }

    /**
     * Get configured Google Client Secret.
     */
    public static function getClientSecret(): ?string
    {
        return config('services.google.client_secret') ?: Setting::get('google_client_secret');
    }

    /**
     * Redirect the customer to Google OAuth login.
     */
    public function redirect(Request $request): RedirectResponse
    {
        $clientId = self::getClientId();
        $clientSecret = self::getClientSecret();

        if (empty($clientId) || empty($clientSecret)) {
            return redirect()->route('account.index')->with('status', 'Fitur Login Google belum aktif. Kredensial Google OAuth belum dikonfigurasi.');
        }

        config([
            'services.google.client_id' => $clientId,
            'services.google.client_secret' => $clientSecret,
        ]);

        $intended = $request->input('redirect', route('account.index'));
        session()->put('url.intended', $intended);

        return Socialite::driver('google')->redirect();
    }

    /**
     * Handle Google OAuth callback.
     */
    public function callback(): RedirectResponse
    {
        $clientId = self::getClientId();
        $clientSecret = self::getClientSecret();

        if (! empty($clientId) && ! empty($clientSecret)) {
            config([
                'services.google.client_id' => $clientId,
                'services.google.client_secret' => $clientSecret,
            ]);
        }

        try {
            $googleUser = Socialite::driver('google')->user();
        } catch (\Throwable $e) {
            Log::error('Google OAuth callback error: ' . $e->getMessage());

            return redirect()->route('account.index')->with('status', 'Gagal masuk menggunakan Google. Silakan coba lagi atau gunakan kata sandi.');
        }

        $email = strtolower(trim($googleUser->getEmail() ?? ''));
        $googleId = (string) $googleUser->getId();

        if (empty($email) && empty($googleId)) {
            return redirect()->route('account.index')->with('status', 'Data akun Google tidak lengkap.');
        }

        $user = $this->findOrCreateUser(
            email: $email,
            googleId: $googleId,
            name: $googleUser->getName() ?: ($googleUser->getNickname() ?: 'Pelanggan Alat Kopi Malang'),
            avatar: $googleUser->getAvatar()
        );

        Auth::login($user, remember: true);
        request()->session()->regenerate();

        $redirectUrl = session()->pull('url.intended', route('account.index'));

        return redirect()->to($redirectUrl)->with('status', 'Selamat datang! Berhasil masuk dengan Akun Google.');
    }

    /**
     * Handle Google One Tap / Google Identity Services (GSI) Real-Time Login.
     */
    public function oneTap(Request $request): JsonResponse|RedirectResponse
    {
        $credential = $request->input('credential');

        if (empty($credential)) {
            if ($request->wantsJson()) {
                return response()->json(['success' => false, 'message' => 'Token kredensial Google tidak ditemukan.'], 422);
            }

            return redirect()->route('account.index')->with('status', 'Token kredensial Google tidak ditemukan.');
        }

        $clientId = self::getClientId();

        try {
            // Verify ID token via Google TokenInfo API
            $response = Http::timeout(10)->get('https://oauth2.googleapis.com/tokeninfo', [
                'id_token' => $credential,
            ]);

            if (! $response->successful()) {
                Log::warning('Google One Tap verification failed: ' . $response->body());

                if ($request->wantsJson()) {
                    return response()->json(['success' => false, 'message' => 'Verifikasi token Google gagal.'], 401);
                }

                return redirect()->route('account.index')->with('status', 'Verifikasi login Google gagal.');
            }

            $payload = $response->json();

            // Validate audience if client ID is set
            if (! empty($clientId) && isset($payload['aud']) && $payload['aud'] !== $clientId) {
                Log::warning("Google One Tap aud mismatch: expected {$clientId}, got {$payload['aud']}");

                if ($request->wantsJson()) {
                    return response()->json(['success' => false, 'message' => 'Klien ID Google tidak cocok.'], 401);
                }

                return redirect()->route('account.index')->with('status', 'Kredensial Google tidak valid.');
            }

            $email = strtolower(trim($payload['email'] ?? ''));
            $googleId = (string) ($payload['sub'] ?? '');
            $name = $payload['name'] ?? 'Pelanggan Alat Kopi Malang';
            $avatar = $payload['picture'] ?? null;

            if (empty($email)) {
                if ($request->wantsJson()) {
                    return response()->json(['success' => false, 'message' => 'Email Google tidak ditemukan.'], 422);
                }

                return redirect()->route('account.index')->with('status', 'Email Google tidak ditemukan.');
            }

            $user = $this->findOrCreateUser(
                email: $email,
                googleId: $googleId,
                name: $name,
                avatar: $avatar
            );

            Auth::login($user, remember: true);
            $request->session()->regenerate();

            if ($request->wantsJson()) {
                return response()->json([
                    'success' => true,
                    'message' => 'Berhasil masuk dengan akun Google!',
                    'redirect' => route('account.index'),
                ]);
            }

            return redirect()->route('account.index')->with('status', 'Selamat datang! Berhasil masuk dengan Akun Google.');
        } catch (\Throwable $e) {
            Log::error('Google One Tap exception: ' . $e->getMessage());

            if ($request->wantsJson()) {
                return response()->json(['success' => false, 'message' => 'Terjadi kesalahan sistem saat memverifikasi Google.'], 500);
            }

            return redirect()->route('account.index')->with('status', 'Terjadi kendala saat login Google.');
        }
    }

    /**
     * Unlink Google account from current authenticated user.
     */
    public function unlink(Request $request): RedirectResponse
    {
        /** @var User $user */
        $user = $request->user();

        if (empty($user->password)) {
            return back()->with('status', 'Anda belum memiliki kata sandi mandiri. Silakan buat kata sandi terlebih dahulu sebelum memutuskan akun Google.');
        }

        $user->update(['google_id' => null]);

        return back()->with('status', 'Tautan akun Google berhasil diputuskan.');
    }

    /**
     * Find existing user or create a new one.
     */
    protected function findOrCreateUser(string $email, string $googleId, string $name, ?string $avatar): User
    {
        // 1. Check if user already exists by google_id
        $user = null;
        if (! empty($googleId)) {
            $user = User::where('google_id', $googleId)->first();
        }

        // 2. Check by email
        if (! $user && ! empty($email)) {
            $user = User::where('email', $email)->first();

            if ($user) {
                $user->google_id = $googleId;
                if (! $user->avatar && $avatar) {
                    $user->avatar = $avatar;
                }
                if (! $user->email_verified_at) {
                    $user->email_verified_at = now();
                }
                $user->save();
            }
        }

        // 3. Create new user
        if (! $user) {
            $user = User::create([
                'name' => $name,
                'email' => $email,
                'google_id' => $googleId,
                'avatar' => $avatar,
                'email_verified_at' => now(),
                'password' => Hash::make(Str::random(32)),
            ]);
        }

        return $user;
    }
}
