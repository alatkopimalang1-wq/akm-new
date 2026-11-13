<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Inertia\Response;

class AccountController extends Controller
{
    /**
     * Display the customer account dashboard (Riwayat Pesanan, Alamat, Profil).
     */
    public function index(Request $request): Response
    {
        $user = $request->user();

        $orders = Order::where(function ($q) use ($user) {
            $q->where('user_id', $user->id);
            if (! empty($user->email)) {
                $q->orWhere('customer_email', $user->email);
            }
            if (! empty($user->phone)) {
                $q->orWhere('customer_phone', $user->phone);

                $altPhone = str_starts_with($user->phone, '62')
                    ? ('0' . substr($user->phone, 2))
                    : (str_starts_with($user->phone, '0') ? ('62' . substr($user->phone, 1)) : $user->phone);

                $q->orWhere('customer_phone', $altPhone);
            }
        })
        ->with('items')
        ->latest()
        ->get()
        ->map(function ($order) {
            return [
                'id' => $order->id,
                'order_number' => $order->order_number,
                'created_at' => $order->created_at->format('d M Y, H:i'),
                'total_amount' => (float) $order->total_amount,
                'subtotal' => (float) $order->subtotal,
                'shipping_cost' => (float) $order->shipping_cost,
                'payment_status' => $order->payment_status,
                'status' => $order->status,
                'payment_method' => $order->payment_method,
                'shipping_courier' => $order->shipping_courier,
                'shipping_service' => $order->shipping_service,
                'tracking_number' => $order->tracking_number,
                'customer_name' => $order->customer_name,
                'customer_address' => $order->customer_address,
                'items_count' => $order->items->sum('quantity'),
                'items' => $order->items->map(fn ($item) => [
                    'product_name' => $item->product_name,
                    'variant_label' => $item->variant_label,
                    'grind_option' => $item->grind_option,
                    'custom_notes' => $item->custom_notes,
                    'quantity' => $item->quantity,
                    'price' => (float) $item->price,
                    'subtotal' => (float) $item->subtotal,
                ]),
            ];
        });

        return Inertia::render('account/index', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'address' => $user->address,
                'province' => $user->province,
                'city' => $user->city,
                'district' => $user->district,
                'postal_code' => $user->postal_code,
                'is_wa_account' => str_starts_with((string) $user->email, 'wa_'),
                'has_password' => ! empty($user->password) && empty($user->google_id),
                'has_google' => ! empty($user->google_id),
            ],
            'orders' => $orders,
            'status' => session('status'),
            'defaultTab' => in_array($request->query('tab'), ['orders', 'address', 'profile', 'security'])
                ? $request->query('tab')
                : 'orders',
        ]);
    }

    /**
     * Update customer profile info (Name, Phone, Email).
     */
    public function updateProfile(Request $request): RedirectResponse
    {
        $user = $request->user();

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:25'],
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                Rule::unique('users')->ignore($user->id),
            ],
        ], [
            'name.required' => 'Nama lengkap wajib diisi.',
            'email.required' => 'Alamat email wajib diisi.',
            'email.email' => 'Format email tidak valid.',
            'email.unique' => 'Email ini sudah digunakan oleh akun lain.',
        ]);

        $user->fill($validated);
        $user->save();

        return back()->with('status', 'Profil berhasil disimpan!');
    }

    /**
     * Update customer default shipping address.
     */
    public function updateAddress(Request $request): RedirectResponse
    {
        $user = $request->user();

        $validated = $request->validate([
            'address' => ['required', 'string', 'max:1000'],
            'province' => ['nullable', 'string', 'max:100'],
            'city' => ['nullable', 'string', 'max:100'],
            'district' => ['nullable', 'string', 'max:100'],
            'postal_code' => ['nullable', 'string', 'max:20'],
        ], [
            'address.required' => 'Alamat lengkap wajib diisi.',
        ]);

        $user->fill($validated);
        $user->save();

        return back()->with('status', 'Alamat pengiriman berhasil disimpan!');
    }

    /**
     * Update customer password (if applicable).
     */
    public function updatePassword(Request $request): RedirectResponse
    {
        $user = $request->user();

        $rules = [
            'password' => ['required', Password::defaults(), 'confirmed'],
        ];

        // If the user already has a known standard password (not Google OAuth / random password), require current_password
        $requiresCurrentPassword = ! empty($user->password) && empty($user->google_id);

        if ($requiresCurrentPassword) {
            $rules['current_password'] = ['required', 'current_password'];
        }

        $validated = $request->validate($rules, [
            'current_password.required' => 'Kata sandi saat ini wajib diisi.',
            'current_password.current_password' => 'Kata sandi saat ini tidak cocok.',
            'password.required' => 'Kata sandi baru wajib diisi.',
            'password.confirmed' => 'Konfirmasi kata sandi baru tidak cocok.',
        ]);

        $user->update([
            'password' => Hash::make($validated['password']),
        ]);

        return back()->with('status', 'Kata sandi berhasil diperbarui!');
    }
}

