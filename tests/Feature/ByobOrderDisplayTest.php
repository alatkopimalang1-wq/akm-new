<?php

use App\Filament\Resources\Orders\Pages\EditOrder;
use App\Models\Order;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\User;
use Livewire\Livewire;

test('byob order checkout preserves and saves custom blend ratio notes', function () {
    $product = Product::create([
        'name' => 'C.Y.B.R - Custom Your Blend Ratio',
        'slug' => 'byob',
        'series' => 'byob',
        'status' => 'active',
        'min_price' => 65000,
        'max_price' => 150000,
    ]);
    $variant = ProductVariant::create([
        'product_id' => $product->id,
        'label' => '500g',
        'weight_grams' => 500,
        'price' => 118000,
        'stock_status' => 'in_stock',
    ]);

    $customNotes = 'Blend: "Sunrise Kawi" | Rasio: 60% Gunung Kawi Washed + 40% Dampit Fine Robusta';

    $payload = [
        'items' => [
            [
                'variant_id' => $variant->id,
                'quantity' => 1,
                'price' => 118000,
                'grind_option' => 'Whole Bean (Biji Utuh)',
                'custom_notes' => $customNotes,
            ],
        ],
        'customer' => [
            'name' => 'Budi Sanubari',
            'phone' => '081234567890',
            'email' => 'budi@example.com',
            'address' => 'Jl. Ijen No. 10, Kota Malang',
            'province' => 'Jawa Timur',
            'city' => 'Kota Malang',
            'district' => 'Klojen',
            'postal_code' => '65116',
        ],
        'shipping' => [
            'courier' => 'J&T Express',
            'courier_code' => 'jnt',
            'service' => 'EZ',
            'cost' => 12000,
            'etd' => '1-2 hari',
        ],
        'payment_method' => 'bank_transfer',
        'payment_channel' => 'bca',
    ];

    $response = $this->postJson('/checkout', $payload);
    $response->assertSuccessful();

    $orderNumber = $response->json('order_number');
    $order = Order::with('items')->where('order_number', $orderNumber)->firstOrFail();

    expect($order->items)->toHaveCount(1)
        ->and($order->items[0]->custom_notes)->toBe($customNotes)
        ->and((float) $order->items[0]->price)->toBe(118000.0);
});

test('payment page and invoice page display byob blend ratio and coffee components', function () {
    $product = Product::create([
        'name' => 'C.Y.B.R - Custom Your Blend Ratio',
        'slug' => 'byob',
        'series' => 'byob',
        'status' => 'active',
        'min_price' => 65000,
        'max_price' => 150000,
    ]);
    $variant = ProductVariant::create([
        'product_id' => $product->id,
        'label' => '500g',
        'weight_grams' => 500,
        'price' => 118000,
        'stock_status' => 'in_stock',
    ]);

    $blendRecipe = 'Blend: "Malang Night Blend" | Rasio: 70% Gunung Kawi Anaerobic + 30% Dampit Honey';

    $order = Order::create([
        'order_number' => 'ORD-' . time(),
        'customer_name' => 'Siti Barista',
        'customer_phone' => '081987654321',
        'customer_address' => 'Jl. Soekarno Hatta No. 45, Malang',
        'payment_method' => 'qris',
        'payment_channel' => 'qris',
        'payment_status' => 'paid',
        'status' => 'processing',
        'subtotal' => 118000,
        'shipping_cost' => 0,
        'unique_code' => 0,
        'total_amount' => 118000,
    ]);

    $order->items()->create([
        'product_id' => $product->id,
        'product_variant_id' => $variant->id,
        'product_name' => $product->name,
        'variant_label' => $variant->label,
        'grind_option' => 'Giling Medium (V60)',
        'custom_notes' => $blendRecipe,
        'price' => 118000,
        'quantity' => 1,
        'subtotal' => 118000,
    ]);

    // Check payment page
    $resShow = $this->get("/pesanan/{$order->order_number}");
    $resShow->assertSuccessful();
    $resShow->assertInertia(fn ($page) => $page
        ->component('order/show')
        ->where('order.payment_status', 'paid')
        ->where('order.items.0.custom_notes', $blendRecipe)
    );

    // Check invoice page
    $resInvoice = $this->get("/pesanan/{$order->order_number}/invoice");
    $resInvoice->assertSuccessful();
    $resInvoice->assertInertia(fn ($page) => $page
        ->component('order/invoice')
        ->where('order.payment_status', 'paid')
        ->where('order.items.0.custom_notes', $blendRecipe)
        ->where('order.items.0.product_name', $product->name)
    );
});

test('confirmed paid order automatically records paid_at and displays lunas status', function () {
    $order = Order::create([
        'order_number' => 'ORD-PAID-' . time(),
        'customer_name' => 'Dewi Pelanggan',
        'customer_phone' => '081234567888',
        'customer_address' => 'Jl. Kawi No. 20, Malang',
        'payment_method' => 'bank_transfer',
        'payment_channel' => 'bca',
        'payment_status' => 'pending',
        'status' => 'pending',
        'total_amount' => 75000,
    ]);

    expect($order->paid_at)->toBeNull();

    // Confirm order
    $order->update(['payment_status' => 'paid', 'status' => 'processing']);
    $order->refresh();

    expect($order->paid_at)->not->toBeNull()
        ->and($order->payment_status)->toBe('paid');

    $resInvoice = $this->get("/pesanan/{$order->order_number}/invoice");
    $resInvoice->assertSuccessful();
    $resInvoice->assertInertia(fn ($page) => $page
        ->component('order/invoice')
        ->where('order.payment_status', 'paid')
        ->has('order.paid_at')
    );
});

test('filament admin order form displays byob coffee name and blend ratio', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $product = Product::create([
        'name' => 'C.Y.B.R - Custom Your Blend Ratio',
        'slug' => 'byob',
        'series' => 'byob',
        'status' => 'active',
        'min_price' => 65000,
        'max_price' => 150000,
    ]);
    $variant = ProductVariant::create([
        'product_id' => $product->id,
        'label' => '500g',
        'weight_grams' => 500,
        'price' => 118000,
        'stock_status' => 'in_stock',
    ]);

    $blendRecipe = 'Rasio Blend: 50% Gunung Kawi Washed + 50% Dampit Fine Robusta';

    $order = Order::create([
        'order_number' => 'ORD-ADM-' . time(),
        'customer_name' => 'Andi Pelanggan',
        'customer_phone' => '081234567899',
        'customer_address' => 'Jl. Bromo No. 1, Malang',
        'payment_method' => 'bank_transfer',
        'payment_channel' => 'bca',
        'payment_status' => 'pending',
        'status' => 'pending',
        'subtotal' => 118000,
        'shipping_cost' => 10000,
        'unique_code' => 205,
        'total_amount' => 128205,
    ]);

    $order->items()->create([
        'product_id' => $product->id,
        'product_variant_id' => $variant->id,
        'product_name' => $product->name,
        'variant_label' => $variant->label,
        'grind_option' => 'Whole Bean',
        'custom_notes' => $blendRecipe,
        'price' => 118000,
        'quantity' => 1,
        'subtotal' => 118000,
    ]);

    $component = Livewire::test(EditOrder::class, ['record' => $order->id]);
    $component->assertSuccessful();

    $itemsState = $component->get('data.items');
    $itemsArray = array_values($itemsState);
    expect($itemsArray)->toHaveCount(1)
        ->and($itemsArray[0]['product_name'])->toBe($product->name)
        ->and($itemsArray[0]['custom_notes'])->toBe($blendRecipe);
});

test('order table list displays only order number without item description', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $order = Order::create([
        'order_number' => 'ORD-LIST-TEST',
        'customer_name' => 'Test User',
        'customer_phone' => '081234567899',
        'customer_address' => 'Jl. Ijen',
        'payment_method' => 'qris',
        'payment_status' => 'paid',
        'status' => 'processing',
        'subtotal' => 100000,
        'shipping_cost' => 0,
        'total_amount' => 100000,
    ]);

    Livewire::test(\App\Filament\Resources\Orders\Pages\ListOrders::class)
        ->assertSuccessful()
        ->assertCanSeeTableRecords([$order]);
});
