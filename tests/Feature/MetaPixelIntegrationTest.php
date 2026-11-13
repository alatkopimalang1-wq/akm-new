<?php

use App\Models\Order;
use App\Models\Product;
use App\Models\ProductVariant;
use Illuminate\Support\Facades\Blade;
use Illuminate\Support\Facades\Config;

test('meta pixel configuration is read from services config', function () {
    Config::set('services.meta_pixel.id', '1728104495548447');
    expect(config('services.meta_pixel.id'))->toBe('1728104495548447');
});

test('meta pixel partial renders base script and noscript when pixel id is set', function () {
    Config::set('services.meta_pixel.id', '1728104495548447');

    $rendered = Blade::render("@include('partials.meta-pixel')");

    expect($rendered)
        ->toContain('https://connect.facebook.net/en_US/fbevents.js')
        ->toContain("fbq('init', '1728104495548447')")
        ->toContain("fbq('track', 'PageView')")
        ->toContain('<noscript>')
        ->toContain('https://www.facebook.com/tr?id=1728104495548447&ev=PageView&noscript=1');
});

test('meta pixel partial renders nothing when pixel id is empty', function () {
    Config::set('services.meta_pixel.id', null);

    $rendered = Blade::render("@include('partials.meta-pixel')");

    expect(trim($rendered))->toBeEmpty();
});

test('public homepage contains meta pixel script in head', function () {
    Config::set('services.meta_pixel.id', '1728104495548447');

    $response = $this->get('/');

    $response->assertStatus(200);
    $response->assertSee('1728104495548447', false);
    $response->assertSee("fbq('init', '1728104495548447')", false);
});

test('checkout show passes order items with sku and product id for meta pixel commerce purchase tracking', function () {
    $product = Product::create([
        'name' => 'Single Origin Ijen Anaerobic',
        'slug' => 'single-origin-ijen-anaerobic',
        'series' => 'single-origin',
        'min_price' => 95000,
        'status' => 'published',
    ]);

    $variant = ProductVariant::create([
        'product_id' => $product->id,
        'label' => '200g',
        'price' => 95000,
        'sku' => 'IJEN-200G',
        'stock_status' => 'in_stock',
    ]);

    $order = Order::create([
        'order_number' => 'ORD-PIXEL-1001',
        'customer_name' => 'Budi Santoso',
        'customer_phone' => '081234567890',
        'customer_address' => 'Jl. Ijen No. 10, Malang',
        'payment_method' => 'qris',
        'payment_status' => 'pending',
        'status' => 'pending',
        'subtotal' => 95000,
        'shipping_cost' => 10000,
        'unique_code' => 123,
        'total_amount' => 105123,
    ]);

    $order->items()->create([
        'product_id' => $product->id,
        'product_variant_id' => $variant->id,
        'product_name' => $product->name,
        'variant_label' => $variant->label,
        'price' => 95000,
        'quantity' => 1,
        'subtotal' => 95000,
    ]);

    $response = $this->get(route('orders.show', ['orderNumber' => $order->order_number]));

    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => $page
        ->component('order/show')
        ->has('order.items', 1)
        ->where('order.items.0.sku', 'IJEN-200G')
        ->where('order.items.0.product_id', $product->id)
        ->where('order.total_amount', 105123)
    );
});
