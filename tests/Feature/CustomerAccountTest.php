<?php

use App\Models\Order;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

test('guest is redirected to login when accessing customer account page', function () {
    $response = $this->get('/akun');
    $response->assertRedirect('/login');
});

test('authenticated customer can view account page with orders and profile', function () {
    $user = User::factory()->create([
        'name' => 'Budi Sanubari',
        'email' => 'budi@sanubari.id',
        'phone' => '628123456789',
        'address' => 'Jl. Kawi No. 10',
        'city' => 'Kota Malang',
    ]);

    $order = Order::create([
        'user_id' => $user->id,
        'order_number' => 'SNB-TEST-001',
        'customer_name' => $user->name,
        'customer_phone' => $user->phone,
        'customer_email' => $user->email,
        'customer_address' => $user->address,
        'payment_method' => 'qris',
        'payment_status' => 'paid',
        'status' => 'processing',
        'subtotal' => 120000,
        'shipping_cost' => 0,
        'total_amount' => 120000,
    ]);

    $order->items()->create([
        'product_name' => 'Gunung Kawi Washed',
        'variant_label' => '200g',
        'price' => 120000,
        'quantity' => 1,
        'subtotal' => 120000,
    ]);

    $response = $this->actingAs($user)->get('/akun');
    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->component('account/index')
        ->where('user.name', 'Budi Sanubari')
        ->where('user.email', 'budi@sanubari.id')
        ->has('orders', 1)
        ->where('orders.0.order_number', 'SNB-TEST-001')
    );
});

test('customer can update their profile information', function () {
    $user = User::factory()->create([
        'name' => 'Old Name',
        'email' => 'old@sanubari.id',
        'phone' => '0811111111',
    ]);

    $response = $this->actingAs($user)->post('/akun/profile', [
        'name' => 'New Name Updated',
        'phone' => '0822222222',
        'email' => 'new@sanubari.id',
    ]);

    $response->assertRedirect();
    $user->refresh();
    expect($user->name)->toBe('New Name Updated')
        ->and($user->email)->toBe('new@sanubari.id')
        ->and($user->phone)->toBe('0822222222');
});

test('customer can update their default shipping address', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->post('/akun/address', [
        'address' => 'Jl. Soekarno Hatta No. 88, RT 01/RW 02',
        'province' => 'Jawa Timur',
        'city' => 'Kota Malang',
        'district' => 'Lowokwaru',
        'postal_code' => '65141',
    ]);

    $response->assertRedirect();
    $user->refresh();
    expect($user->address)->toBe('Jl. Soekarno Hatta No. 88, RT 01/RW 02')
        ->and($user->city)->toBe('Kota Malang')
        ->and($user->district)->toBe('Lowokwaru')
        ->and($user->postal_code)->toBe('65141');
});

test('settings and settings profile redirect to akun', function () {
    $user = User::factory()->create();

    $this->actingAs($user)->get('/settings')->assertRedirect('/akun');
    $this->actingAs($user)->get('/settings/profile')->assertRedirect('/akun');
});

test('customer can update password from account portal', function () {
    $user = User::factory()->create([
        'password' => Hash::make('old-password-123'),
    ]);

    $response = $this->actingAs($user)->post('/akun/password', [
        'current_password' => 'old-password-123',
        'password' => 'new-secret-password-123',
        'password_confirmation' => 'new-secret-password-123',
    ]);

    $response->assertRedirect();
    $user->refresh();
    expect(Hash::check('new-secret-password-123', $user->password))->toBeTrue();
});

test('customer fails to update password with wrong current password', function () {
    $user = User::factory()->create([
        'password' => Hash::make('correct-password-123'),
    ]);

    $response = $this->actingAs($user)->post('/akun/password', [
        'current_password' => 'wrong-password-123',
        'password' => 'new-secret-password-123',
        'password_confirmation' => 'new-secret-password-123',
    ]);

    $response->assertSessionHasErrors('current_password');
    $user->refresh();
    expect(Hash::check('correct-password-123', $user->password))->toBeTrue();
});

test('google oauth customer can set password without current password', function () {
    $user = User::factory()->create([
        'google_id' => 'google-oauth-12345',
        'password' => Hash::make('random-oauth-pw'),
    ]);

    $response = $this->actingAs($user)->post('/akun/password', [
        'password' => 'brand-new-password-123',
        'password_confirmation' => 'brand-new-password-123',
    ]);

    $response->assertRedirect();
    $user->refresh();
    expect(Hash::check('brand-new-password-123', $user->password))->toBeTrue();
});

test('customer can access account with tab parameter', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->get('/akun?tab=security');
    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->component('account/index')
        ->where('defaultTab', 'security')
    );
});

