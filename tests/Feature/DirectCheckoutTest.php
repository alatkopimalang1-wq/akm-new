<?php

use App\Filament\Resources\Orders\OrderResource;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\Setting;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

beforeEach(function () {
    // Seed sample product and variant
    $this->product = Product::create([
        'name' => 'Kawi Natural Specialty Test',
        'slug' => 'kawi-natural-specialty-test',
        'series' => 'kawi',
        'status' => 'active',
        'min_price' => 95000,
        'max_price' => 120000,
    ]);

    $this->variant = ProductVariant::create([
        'product_id' => $this->product->id,
        'label' => '200g Whole Bean',
        'weight_grams' => 200,
        'price' => 95000,
        'stock_status' => 'in_stock',
    ]);
});

test('cart page renders with direct checkout payment settings', function () {
    $response = $this->get('/keranjang');
    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->component('cart')
        ->has('paymentSettings')
        ->where('paymentSettings.qris.merchant_name', fn ($val) => !empty($val))
        ->where('paymentSettings.bank_enabled', true)
    );
});

test('customer can checkout directly with QRIS payment method', function () {
    $payload = [
        'items' => [
            [
                'variant_id' => $this->variant->id,
                'quantity' => 2,
                'grind_option' => 'Medium (V60)',
                'custom_notes' => 'Tolong bungkus rapi',
            ],
        ],
        'customer' => [
            'name' => 'Ahmad Roaster',
            'phone' => '081234567890',
            'email' => 'ahmad@example.com',
            'address' => 'Jl. Ijen No. 10, Kota Malang',
            'notes' => 'Titip pos satpam',
        ],
        'payment_method' => 'qris',
        'payment_channel' => 'qris',
    ];

    $response = $this->postJson('/checkout', $payload);

    $response->assertSuccessful();
    $response->assertJson([
        'success' => true,
    ]);

    $orderNumber = $response->json('order_number');
    expect($orderNumber)->toStartWith('SNB-');

    $order = Order::where('order_number', $orderNumber)->first();
    expect($order)->not->toBeNull();
    expect($order->customer_name)->toBe('Ahmad Roaster');
    expect($order->payment_method)->toBe('qris');
    expect($order->payment_status)->toBe('pending');
    expect((float) $order->subtotal)->toBe(190000.0);
    expect($order->items)->toHaveCount(1);
    expect($order->items->first()->product_name)->toBe('Kawi Natural Specialty Test');
});

test('customer can checkout directly with Bank Transfer payment method and unique code', function () {
    $payload = [
        'items' => [
            [
                'variant_id' => $this->variant->id,
                'quantity' => 1,
                'grind_option' => 'Biji Utuh',
            ],
        ],
        'customer' => [
            'name' => 'Siti Nurhaliza',
            'phone' => '08579998881',
            'address' => 'Jl. Merdeka No. 45, Surabaya',
        ],
        'payment_method' => 'bank_transfer',
        'payment_channel' => 'bca',
    ];

    $response = $this->postJson('/checkout', $payload);

    $response->assertSuccessful();
    $orderNumber = $response->json('order_number');

    $order = Order::where('order_number', $orderNumber)->first();
    expect($order)->not->toBeNull();
    expect($order->payment_method)->toBe('bank_transfer');
    expect($order->payment_channel)->toBe('bca');
    expect($order->unique_code)->toBeGreaterThan(0);
    expect((float) $order->total_amount)->toBeGreaterThan(95000.0);
});

test('order confirmation and payment instructions page renders successfully', function () {
    $order = Order::create([
        'order_number' => Order::generateOrderNumber(),
        'customer_name' => 'Budi Santoso',
        'customer_phone' => '081234567890',
        'customer_address' => 'Jl. Kawi No. 12, Malang',
        'payment_method' => 'qris',
        'payment_channel' => 'qris',
        'payment_status' => 'pending',
        'status' => 'pending',
        'subtotal' => 95000,
        'shipping_cost' => 15000,
        'unique_code' => 0,
        'total_amount' => 110000,
    ]);

    $order->items()->create([
        'product_id' => $this->product->id,
        'product_variant_id' => $this->variant->id,
        'product_name' => $this->product->name,
        'variant_label' => $this->variant->label,
        'price' => 95000,
        'quantity' => 1,
        'subtotal' => 95000,
    ]);

    $response = $this->get("/pesanan/{$order->order_number}");
    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->component('order/show')
        ->where('order.order_number', $order->order_number)
        ->where('order.customer_name', 'Budi Santoso')
        ->has('paymentConfig.qris_image_url')
    );
});

test('customer can upload payment proof image', function () {
    Storage::fake('public');

    $order = Order::create([
        'order_number' => Order::generateOrderNumber(),
        'customer_name' => 'Dewi Lestari',
        'customer_phone' => '081333444555',
        'customer_address' => 'Jl. Suhat No. 8, Malang',
        'payment_method' => 'bank_transfer',
        'payment_status' => 'pending',
        'subtotal' => 95000,
        'total_amount' => 95000,
    ]);

    $file = UploadedFile::fake()->image('struk-transfer.jpg');

    $response = $this->post("/pesanan/{$order->order_number}/upload-bukti", [
        'payment_proof' => $file,
    ]);

    $response->assertRedirect();
    $order->refresh();

    expect($order->payment_proof)->not->toBeNull();
    expect($order->payment_status)->toBe('verifying');
    Storage::disk('public')->assertExists($order->payment_proof);
});

test('order tracking page works for existing orders', function () {
    $order = Order::create([
        'order_number' => 'SNB-TEST-TRACK',
        'customer_name' => 'Pelanggan Track',
        'customer_phone' => '0811223344',
        'customer_address' => 'Malang',
        'payment_method' => 'qris',
        'total_amount' => 100000,
    ]);

    // Initial page load
    $this->get('/lacak-pesanan')->assertSuccessful();

    // Query with order number redirects to show page
    $response = $this->get('/lacak-pesanan?order_number=SNB-TEST-TRACK');
    $response->assertRedirect('/pesanan/SNB-TEST-TRACK');
});

test('filament order resource can be rendered by admin', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $order = Order::create([
        'order_number' => Order::generateOrderNumber(),
        'customer_name' => 'Admin Test Customer',
        'customer_phone' => '0812345678',
        'customer_address' => 'Malang',
        'payment_method' => 'qris',
        'total_amount' => 100000,
    ]);

    $this->get('/admin/orders')->assertSuccessful();
    $this->get("/admin/orders/{$order->id}/edit")->assertSuccessful();
});

test('shipping api returns provinces and cities of indonesia', function () {
    $provRes = $this->getJson('/api/shipping/provinces');
    $provRes->assertSuccessful();
    $provRes->assertJsonStructure(['success', 'data' => [['id', 'name']]]);
    expect($provRes->json('data'))->not->toBeEmpty();

    $cityRes = $this->getJson('/api/shipping/cities?province_id=18');
    $cityRes->assertSuccessful();
    $cityRes->assertJsonStructure(['success', 'data' => [['id', 'province_id', 'type', 'name', 'postal_code']]]);
    
    $cityNames = collect($cityRes->json('data'))->pluck('name')->all();
    expect($cityNames)->toContain('Malang');
    expect($cityNames)->toContain('Surabaya');
});

test('shipping calculate api returns automatic courier rates for destinations', function () {
    // 1. Intra Malang
    $resMalang = $this->postJson('/api/shipping/calculate', [
        'destination_city_id' => 391,
        'province_id' => 18,
        'weight_grams' => 400,
        'subtotal' => 95000,
    ]);
    $resMalang->assertSuccessful();
    $ratesMalang = $resMalang->json('rates');
    expect($ratesMalang)->toBeArray()->not->toBeEmpty();
    expect(collect($ratesMalang)->pluck('courier')->all())->toContain('JNE Express');
    expect(collect($ratesMalang)->pluck('courier')->all())->toContain('J&T Express');

    // 2. Jakarta Selatan with promo free shipping above 250k
    $resJakarta = $this->postJson('/api/shipping/calculate', [
        'destination_city_id' => 153, // Jakarta Selatan
        'province_id' => 6,
        'weight_grams' => 600,
        'subtotal' => 285000, // Above 250k promo
    ]);
    $resJakarta->assertSuccessful();
    $ratesJakarta = $resJakarta->json('rates');
    $jntRate = collect($ratesJakarta)->firstWhere('courier', 'J&T Express');
    expect($jntRate['cost'])->toBe(0); // Free shipping qualified
    expect($jntRate['is_free'])->toBeTrue();
});

test('checkout stores courier and location details on order', function () {
    $payload = [
        'items' => [
            [
                'variant_id' => $this->variant->id,
                'quantity' => 1,
                'grind_option' => 'Medium (V60)',
            ],
        ],
        'customer' => [
            'name' => 'Doni Courier Test',
            'phone' => '081299887766',
            'address' => 'Jl. Tebet Raya No. 4',
            'province' => 'DKI Jakarta',
            'city' => 'Kota Jakarta Selatan',
            'postal_code' => '12810',
        ],
        'shipping' => [
            'courier' => 'J&T Express',
            'courier_code' => 'jnt',
            'service' => 'EZ',
            'cost' => 17000,
            'etd' => '2-3 hari',
        ],
        'payment_method' => 'qris',
    ];

    $response = $this->postJson('/checkout', $payload);
    $response->assertSuccessful();

    $orderNumber = $response->json('order_number');
    $order = Order::where('order_number', $orderNumber)->first();

    expect($order->shipping_courier)->toBe('J&T Express');
    expect($order->shipping_service)->toBe('EZ');
    expect($order->shipping_etd)->toBe('2-3 hari');
    expect((float) $order->shipping_cost)->toBe(17000.0);
    expect($order->shipping_city)->toBe('Kota Jakarta Selatan');
    expect($order->shipping_province)->toBe('DKI Jakarta');
    expect($order->total_weight_grams)->toBe(200);
});

test('customer can checkout with Ambil di Toko option with zero shipping cost and pickup details', function () {
    $payload = [
        'items' => [
            [
                'variant_id' => $this->variant->id,
                'quantity' => 2,
                'grind_option' => 'Biji Utuh',
            ],
        ],
        'fulfillment_type' => 'pickup',
        'customer' => [
            'name' => 'Rian Sanubari Pickup',
            'phone' => '081298765432',
            'notes' => 'Diambil sore ini jam 17:00 WIB',
        ],
        'payment_method' => 'qris',
    ];

    $response = $this->postJson('/checkout', $payload);
    $response->assertSuccessful();

    $orderNumber = $response->json('order_number');
    $order = Order::where('order_number', $orderNumber)->first();

    expect($order)->not->toBeNull();
    expect($order->shipping_courier)->toBe('Ambil di Toko');
    expect($order->shipping_service)->toBe('Self Pick Up');
    expect((float) $order->shipping_cost)->toBe(0.0);
    expect($order->is_pickup)->toBeTrue();
    expect($order->status_label)->toBe('Menunggu Konfirmasi');
    expect($order->customer_notes)->toBe('Diambil sore ini jam 17:00 WIB');
    expect((float) $order->total_amount)->toBe(190000.0);

    // Verify order show page displays pickup instructions
    $showRes = $this->get("/pesanan/{$order->order_number}");
    $showRes->assertSuccessful();
    $showRes->assertInertia(fn ($page) => $page
        ->component('order/show')
        ->has('pickupConfig')
        ->where('order.shipping_courier', 'Ambil di Toko')
    );
});


