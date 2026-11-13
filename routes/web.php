<?php

use App\Http\Controllers\AccountController;
use App\Http\Controllers\Auth\GoogleAuthController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\ContentController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\ShippingController;
use App\Http\Controllers\ShopController;
use App\Models\Product;
use App\Models\Setting;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\Route;

// Public Indonesian Routes (Default)
Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/shop', [ShopController::class, 'index'])->name('shop.index');
Route::get('/kategori', [ShopController::class, 'categories'])->name('categories.index');
Route::get('/categories', [ShopController::class, 'categories'])->name('categories.alias');
Route::get('/api/search', [ShopController::class, 'liveSearch'])->name('api.search');
Route::get('/shop/{slug}', [ShopController::class, 'show'])->name('shop.show');
Route::get('/tentang', [ContentController::class, 'about'])->name('about');
Route::get('/kunjungi', [ContentController::class, 'visit'])->name('visit');
Route::get('/kunjungi/{slug}', [ContentController::class, 'customVisit'])->name('visit.custom');
Route::get('/halaman/{slug}', [ContentController::class, 'customVisit'])->name('visit.halaman');
Route::get('/keranjang', [CartController::class, 'index'])->name('cart.index');
Route::post('/cart/quote', [CartController::class, 'quote'])->name('cart.quote');
Route::post('/checkout', [CheckoutController::class, 'process'])->name('checkout.process');
Route::get('/pesanan/{orderNumber}', [CheckoutController::class, 'show'])->name('orders.show');
Route::get('/pesanan/{orderNumber}/invoice', [CheckoutController::class, 'invoice'])->name('orders.invoice');
Route::get('/pesanan/{orderNumber}/shipping-label', [CheckoutController::class, 'shippingLabel'])->name('orders.shipping-label');
Route::post('/pesanan/{orderNumber}/upload-bukti', [CheckoutController::class, 'uploadProof'])->name('orders.upload-proof');
Route::get('/lacak-pesanan', [CheckoutController::class, 'track'])->name('orders.track');

// Automatic Indonesian Courier Shipping API (RajaOngkir Gateway)
Route::get('/api/shipping/provinces', [ShippingController::class, 'provinces'])->name('api.shipping.provinces');
Route::get('/api/shipping/cities', [ShippingController::class, 'cities'])->name('api.shipping.cities');
Route::get('/api/shipping/subdistricts', [ShippingController::class, 'subdistricts'])->name('api.shipping.subdistricts');
Route::post('/api/shipping/calculate', [ShippingController::class, 'calculate'])->name('api.shipping.calculate');
Route::post('/api/shipping/track', [ShippingController::class, 'track'])->name('api.shipping.track');
Route::post('/api/shipping/pickup', [ShippingController::class, 'requestPickup'])->name('api.shipping.pickup');

// Public English Routes (Prefix: /en)
Route::prefix('en')->as('en.')->group(function () {
    Route::get('/', [HomeController::class, 'index'])->name('home');
    Route::get('/shop', [ShopController::class, 'index'])->name('shop.index');
    Route::get('/kategori', [ShopController::class, 'categories'])->name('categories.index');
    Route::get('/categories', [ShopController::class, 'categories'])->name('categories.alias');
    Route::get('/api/search', [ShopController::class, 'liveSearch'])->name('api.search');
    Route::get('/shop/{slug}', [ShopController::class, 'show'])->name('shop.show');
    Route::get('/about', [ContentController::class, 'about'])->name('about');
    Route::get('/visit', [ContentController::class, 'visit'])->name('visit');
    Route::get('/visit/{slug}', [ContentController::class, 'customVisit'])->name('visit.custom');
    Route::get('/cart', [CartController::class, 'index'])->name('cart.index');
    Route::get('/order/{orderNumber}', [CheckoutController::class, 'show'])->name('orders.show');
    Route::get('/order/{orderNumber}/invoice', [CheckoutController::class, 'invoice'])->name('orders.invoice.en');
    Route::get('/track-order', [CheckoutController::class, 'track'])->name('orders.track');
});

// Dynamic Custom Pages (Format /kunjungi) via Direct Slug
Route::get('/{slug}', [ContentController::class, 'customVisit'])
    ->where('slug', '^(?!admin|api|auth|akun|account|dashboard|settings|storage|build|en|shop|kategori|categories|tentang|kunjungi|halaman|keranjang|checkout|pesanan|lacak-pesanan|sitemap\.xml)[a-zA-Z0-9\-_]+$')
    ->name('visit.direct');

// XML Sitemap
Route::get('/sitemap.xml', function () {
    $products = Product::active()->get();

    $xml = '<?xml version="1.0" encoding="UTF-8"?>';
    $xml .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';

    $staticRoutes = [
        '/', '/shop', '/kategori', '/tentang', '/kunjungi', '/keranjang', '/lacak-pesanan',
        '/en', '/en/shop', '/en/categories', '/en/about', '/en/visit', '/en/cart', '/en/track-order',
    ];

    foreach ($staticRoutes as $r) {
        $xml .= '<url><loc>' . url($r) . '</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>';
    }

    $customPages = Setting::get('custom_visit_pages', []);
    if (is_array($customPages)) {
        foreach ($customPages as $cp) {
            if (!empty($cp['slug']) && ($cp['is_active'] ?? true)) {
                $xml .= '<url><loc>' . url('/' . ltrim($cp['slug'], '/')) . '</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>';
            }
        }
    }

    foreach ($products as $p) {
        $xml .= '<url><loc>' . url('/shop/' . $p->slug) . '</loc><lastmod>' . $p->updated_at->toAtomString() . '</lastmod><priority>0.9</priority></url>';
        $xml .= '<url><loc>' . url('/en/shop/' . $p->slug) . '</loc><lastmod>' . $p->updated_at->toAtomString() . '</lastmod><priority>0.9</priority></url>';
    }

    $xml .= '</urlset>';

    return Response::make($xml, 200, ['Content-Type' => 'application/xml']);
});

// Customer Authentication Routes (Google OAuth)
Route::get('/auth/google/redirect', [GoogleAuthController::class, 'redirect'])->name('auth.google.redirect');
Route::get('/auth/google/callback', [GoogleAuthController::class, 'callback'])->name('auth.google.callback');

// Customer Account Portal (Akun Saya, Riwayat Pesanan, Alamat, Profil)
Route::middleware(['auth'])->group(function () {
    Route::get('/akun', [AccountController::class, 'index'])->name('account.index');
    Route::get('/account', [AccountController::class, 'index'])->name('account.alias');
    Route::post('/akun/profile', [AccountController::class, 'updateProfile'])->name('account.profile');
    Route::post('/akun/address', [AccountController::class, 'updateAddress'])->name('account.address');
    Route::post('/akun/password', [AccountController::class, 'updatePassword'])->name('account.password');
});

// Authenticated Starter-kit & Admin routes
Route::middleware(['auth'])->group(function () {
    Route::get('/dashboard', function () {
        return redirect()->route('account.index');
    })->name('dashboard');
});

require __DIR__.'/settings.php';
