<?php

use App\Http\Controllers\AccountController;
use App\Http\Controllers\Admin\VideoReelController;
use App\Http\Controllers\Auth\GoogleAuthController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\ContentController;
use App\Http\Controllers\BackInStockController;
use App\Http\Controllers\FlashSaleController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\NewReleaseController;
use App\Http\Controllers\ShippingController;
use App\Http\Controllers\ShopController;
use App\Models\BrewGuide;
use App\Models\Category;
use App\Models\Post;
use App\Models\Product;
use App\Models\Setting;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\Route;

// Public Indonesian Routes (Default)
Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/new-release', [NewReleaseController::class, 'index'])->name('new-release.index');
Route::get('/new-releases', fn () => redirect()->route('new-release.index'));
Route::get('/back-in-stock', [BackInStockController::class, 'index'])->name('back-in-stock.index');
Route::get('/flash-sale', [FlashSaleController::class, 'index'])->name('flash-sale.index');
Route::get('/shop', [ShopController::class, 'index'])->name('shop.index');
Route::get('/kategori', [ShopController::class, 'categories'])->name('categories.index');
Route::get('/categories', [ShopController::class, 'categories'])->name('categories.alias');
Route::get('/api/search', [ShopController::class, 'liveSearch'])->name('api.search');
Route::get('/cybr', [ShopController::class, 'byob'])->name('cybr');
Route::get('/shop/cybr', [ShopController::class, 'byob'])->name('shop.cybr');
Route::get('/shop/byob', [ShopController::class, 'byob'])->name('shop.byob');
Route::get('/byob', [ShopController::class, 'byob'])->name('byob');
Route::get('/shop/{slug}', [ShopController::class, 'show'])->name('shop.show');
Route::get('/tentang', [ContentController::class, 'about'])->name('about');
Route::get('/wholesale', [ContentController::class, 'wholesale'])->name('wholesale');
Route::get('/jasa-roasting', [ContentController::class, 'roasting'])->name('roasting');
Route::get('/roasting', [ContentController::class, 'roasting'])->name('roasting.alias');
Route::get('/training-barista', [ContentController::class, 'baristaTraining'])->name('barista-training');
Route::get('/kursus-barista', [ContentController::class, 'baristaTraining'])->name('barista-training.kursus');
Route::get('/barista-training', [ContentController::class, 'baristaTraining'])->name('barista-training.alias');
Route::get('/kunjungi', [ContentController::class, 'visit'])->name('visit');
Route::get('/booking-tempat', [ContentController::class, 'booking'])->name('booking');
Route::get('/booking', [ContentController::class, 'booking'])->name('booking.alias');
Route::get('/sewa-tempat', [ContentController::class, 'booking'])->name('booking.sewa');
Route::get('/coffee-catering', [ContentController::class, 'coffeeCatering'])->name('coffee-catering');
Route::get('/catering', [ContentController::class, 'coffeeCatering'])->name('coffee-catering.catering');
Route::get('/catering-kopi', [ContentController::class, 'coffeeCatering'])->name('coffee-catering.kopi');
Route::get('/kunjungi/{slug}', [ContentController::class, 'customVisit'])->name('visit.custom');
Route::get('/halaman/{slug}', [ContentController::class, 'customVisit'])->name('visit.halaman');
Route::get('/panduan-seduh', [ContentController::class, 'brewGuides'])->name('brew-guides.index');
Route::get('/resep-seduh', [ContentController::class, 'brewGuides'])->name('brew-guides.resep');
Route::get('/resep-seduh-v60-japanese-ice', [ContentController::class, 'brewGuides'])->name('brew-guides.v60-japanese');
Route::get('/panduan-seduh/{slug}', [ContentController::class, 'brewGuideDetail'])->name('brew-guides.show');
Route::get('/blog', [ContentController::class, 'blog'])->name('blog.index');
Route::get('/blog/{slug}', [ContentController::class, 'blogDetail'])->name('blog.show');
Route::get('/acara', [ContentController::class, 'events'])->name('events.index');
Route::get('/video', [ContentController::class, 'reels'])->name('reels.index');
Route::get('/reels', [ContentController::class, 'reels'])->name('reels.alias');
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

Route::get('/legal/{type?}', [ContentController::class, 'legal'])->name('legal');

// Public English Routes (Prefix: /en)
Route::prefix('en')->as('en.')->group(function () {
    Route::get('/', [HomeController::class, 'index'])->name('home');
    Route::get('/new-release', [NewReleaseController::class, 'index'])->name('new-release.index');
    Route::get('/new-releases', fn () => redirect()->route('en.new-release.index'));
    Route::get('/back-in-stock', [BackInStockController::class, 'index'])->name('back-in-stock.index');
    Route::get('/flash-sale', [FlashSaleController::class, 'index'])->name('flash-sale.index');
    Route::get('/shop', [ShopController::class, 'index'])->name('shop.index');
Route::get('/kategori', [ShopController::class, 'categories'])->name('categories.index');
Route::get('/categories', [ShopController::class, 'categories'])->name('categories.alias');
    Route::get('/api/search', [ShopController::class, 'liveSearch'])->name('api.search');
    Route::get('/cybr', [ShopController::class, 'byob'])->name('cybr');
    Route::get('/shop/cybr', [ShopController::class, 'byob'])->name('shop.cybr');
    Route::get('/shop/byob', [ShopController::class, 'byob'])->name('shop.byob');
    Route::get('/byob', [ShopController::class, 'byob'])->name('byob');
    Route::get('/shop/{slug}', [ShopController::class, 'show'])->name('shop.show');
    Route::get('/about', [ContentController::class, 'about'])->name('about');
    Route::get('/wholesale', [ContentController::class, 'wholesale'])->name('wholesale');
    Route::get('/roasting', [ContentController::class, 'roasting'])->name('roasting');
    Route::get('/jasa-roasting', [ContentController::class, 'roasting'])->name('roasting.alias');
    Route::get('/barista-training', [ContentController::class, 'baristaTraining'])->name('barista-training');
    Route::get('/training-barista', [ContentController::class, 'baristaTraining'])->name('barista-training.alias');
    Route::get('/visit', [ContentController::class, 'visit'])->name('visit');
    Route::get('/booking', [ContentController::class, 'booking'])->name('booking');
    Route::get('/space-booking', [ContentController::class, 'booking'])->name('booking.space');
    Route::get('/venue-rental', [ContentController::class, 'booking'])->name('booking.venue');
    Route::get('/booking-tempat', [ContentController::class, 'booking'])->name('booking.id-alias');
    Route::get('/coffee-catering', [ContentController::class, 'coffeeCatering'])->name('coffee-catering');
    Route::get('/catering', [ContentController::class, 'coffeeCatering'])->name('coffee-catering.alias');
    Route::get('/visit/{slug}', [ContentController::class, 'customVisit'])->name('visit.custom');
    Route::get('/brew-guide', [ContentController::class, 'brewGuides'])->name('brew-guides.index');
    Route::get('/brew-guide/{slug}', [ContentController::class, 'brewGuideDetail'])->name('brew-guides.show');
    Route::get('/blog', [ContentController::class, 'blog'])->name('blog.index');
    Route::get('/blog/{slug}', [ContentController::class, 'blogDetail'])->name('blog.show');
    Route::get('/events', [ContentController::class, 'events'])->name('events.index');
    Route::get('/videos', [ContentController::class, 'reels'])->name('reels.index');
    Route::get('/reels', [ContentController::class, 'reels'])->name('reels.alias');
    Route::get('/cart', [CartController::class, 'index'])->name('cart.index');
    Route::get('/order/{orderNumber}', [CheckoutController::class, 'show'])->name('orders.show');
    Route::get('/order/{orderNumber}/invoice', [CheckoutController::class, 'invoice'])->name('orders.invoice.en');
    Route::get('/track-order', [CheckoutController::class, 'track'])->name('orders.track');
    Route::get('/legal/{type?}', [ContentController::class, 'legal'])->name('legal');
});

// Dynamic Custom Pages (Format /kunjungi) via Direct Slug
Route::get('/{slug}', [ContentController::class, 'customVisit'])
    ->where('slug', '^(?!admin|api|auth|akun|account|dashboard|settings|storage|build|en|shop|cybr|byob|kategori|categories|tentang|wholesale|jasa-roasting|roasting|training-barista|kursus-barista|barista-training|kunjungi|halaman|booking-tempat|booking|sewa-tempat|coffee-catering|catering|catering-kopi|panduan-seduh|resep-seduh-v60-japanese-ice|blog|acara|video|reels|keranjang|checkout|pesanan|lacak-pesanan|legal|sitemap\.xml)[a-zA-Z0-9\-_]+$')
    ->name('visit.direct');

// XML Sitemap
Route::get('/sitemap.xml', function () {
    $products = Product::active()->get();
    $categories = Category::all();
    $posts = Post::published()->get();
    $guides = BrewGuide::all();

    $xml = '<?xml version="1.0" encoding="UTF-8"?>';
    $xml .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';

    $staticRoutes = [
        '/', '/flash-sale', '/shop', '/cybr', '/shop/cybr', '/tentang', '/wholesale', '/jasa-roasting', '/roasting', '/training-barista', '/kunjungi', '/panduan-seduh', '/blog', '/acara', '/video', '/reels', '/keranjang',
        '/en', '/en/flash-sale', '/en/shop', '/en/cybr', '/en/shop/cybr', '/en/about', '/en/wholesale', '/en/roasting', '/en/barista-training', '/en/visit', '/en/brew-guide', '/en/blog', '/en/events', '/en/videos', '/en/reels', '/en/cart',
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

    foreach ($posts as $post) {
        $xml .= '<url><loc>' . url('/blog/' . $post->slug) . '</loc><lastmod>' . $post->updated_at->toAtomString() . '</lastmod><priority>0.7</priority></url>';
        $xml .= '<url><loc>' . url('/en/blog/' . $post->slug) . '</loc><lastmod>' . $post->updated_at->toAtomString() . '</lastmod><priority>0.7</priority></url>';
    }

    foreach ($guides as $guide) {
        $xml .= '<url><loc>' . url('/panduan-seduh/' . $guide->slug) . '</loc><priority>0.7</priority></url>';
        $xml .= '<url><loc>' . url('/en/brew-guide/' . $guide->slug) . '</loc><priority>0.7</priority></url>';
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

// Authenticated Starter-kit & Admin routes (tanpa harus verifikasi email)
Route::middleware(['auth'])->group(function () {
    Route::get('/dashboard', function () {
        return redirect()->route('account.index');
    })->name('dashboard');
    Route::get('/dashboard/reels', [VideoReelController::class, 'index'])->name('dashboard.reels.index');
    Route::post('/dashboard/reels', [VideoReelController::class, 'store'])->name('dashboard.reels.store');
    Route::put('/dashboard/reels/{reel}', [VideoReelController::class, 'update'])->name('dashboard.reels.update');
    Route::delete('/dashboard/reels/{reel}', [VideoReelController::class, 'destroy'])->name('dashboard.reels.destroy');
});

require __DIR__.'/settings.php';
