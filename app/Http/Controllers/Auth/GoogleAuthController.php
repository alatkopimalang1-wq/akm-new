<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;

class GoogleAuthController extends Controller
{
    /**
     * Redirect the user to the Google authentication page.
     */
    public function redirect(Request $request): RedirectResponse
    {
        $clientId = config('services.google.client_id');
        $clientSecret = config('services.google.client_secret');

        if (empty($clientId) || empty($clientSecret)) {
            return redirect()->route('login')->with('status', 'Fitur Login Google belum aktif karena Kredensial (GOOGLE_CLIENT_ID & GOOGLE_CLIENT_SECRET) belum diisi pada file .env.');
        }

        // Save intended URL if passed via query param
        if ($request->has('redirect')) {
            session()->put('url.intended', $request->input('redirect'));
        }

        return Socialite::driver('google')->redirect();
    }

    /**
     * Obtain the user information from Google and authenticate.
     */
    public function callback(): RedirectResponse
    {
        try {
            $googleUser = Socialite::driver('google')->user();
        } catch (\Throwable $e) {
            Log::error('Google OAuth callback error: ' . $e->getMessage());

            return redirect()->route('login')->with('status', 'Gagal masuk menggunakan Google. Silakan coba lagi atau gunakan metode lain.');
        }

        $email = strtolower(trim($googleUser->getEmail() ?? ''));
        $googleId = (string) $googleUser->getId();

        if (empty($email) && empty($googleId)) {
            return redirect()->route('login')->with('status', 'Data akun Google tidak lengkap.');
        }

        // 1. Try finding by google_id
        $user = null;
        if (! empty($googleId)) {
            $user = User::where('google_id', $googleId)->first();
        }

        // 2. Try finding by email if not found by google_id
        if (! $user && ! empty($email)) {
            $user = User::where('email', $email)->first();

            if ($user) {
                // Link Google ID and update avatar if empty
                $user->google_id = $googleId;
                if (! $user->avatar && $googleUser->getAvatar()) {
                    $user->avatar = $googleUser->getAvatar();
                }
                if (! $user->email_verified_at) {
                    $user->email_verified_at = now();
                }
                $user->save();
            }
        }

        // 3. Create user if still not found
        if (! $user) {
            $name = $googleUser->getName() ?: ($googleUser->getNickname() ?: 'Pelanggan Sanubari');

            $user = User::create([
                'name' => $name,
                'email' => $email,
                'google_id' => $googleId,
                'avatar' => $googleUser->getAvatar(),
                'email_verified_at' => now(),
                'password' => Hash::make(Str::random(32)),
            ]);
        }

        Auth::login($user, remember: true);
        request()->session()->regenerate();

        $redirectUrl = session()->pull('url.intended', route('home'));

        return redirect()->to($redirectUrl)->with('status', 'Berhasil masuk dengan akun Google!');
    }
}

