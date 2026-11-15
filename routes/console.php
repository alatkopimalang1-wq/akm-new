<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Artisan::command('akm:update-orders-code', function () {
    $updated = \Illuminate\Support\Facades\DB::update("UPDATE orders SET order_number = REPLACE(order_number, 'SNB-', 'AKM-') WHERE order_number LIKE 'SNB-%'");
    $this->info("Updated {$updated} orders from SNB to AKM.");
    \App\Models\Setting::set('invoice_prefix', '#AKM');
    $this->info("Default invoice_prefix set to #AKM.");
})->purpose('Migrate legacy SNB order numbers to AKM');

Artisan::command('akm:setup-promo-banner', function () {
    \App\Models\Setting::set('home_promo_banner_enabled', true);
    \App\Models\Setting::set('home_promo_banner_position', 'both');
    \App\Models\Setting::set('home_promo_banner_image', 'banners/banner-event-komunitas.png');
    \App\Models\Setting::set('home_promo_banner_link', 'https://wa.me/6282132095241?text=' . rawurlencode('Halo Alat Kopi Malang, saya ingin reservasi/booking tempat untuk event komunitas & gathering.'));
    \App\Models\Setting::set('home_promo_banner_alt', 'Book Now! Place For Your Event Komunitas & Gathering — Alat Kopi Malang');
    \Illuminate\Support\Facades\Cache::forget('sanubari_settings');
    $this->info("Home promo banner configured successfully (positioned in both places: below categories and below brands).");
})->purpose('Setup home promo banner settings');

Artisan::command('akm:update-maps-url', function () {
    $newUrl = 'https://maps.app.goo.gl/Hua4AUHyaHLuY9uz7';
    \App\Models\Setting::set('maps_url', $newUrl);
    
    // Also update in page_visit setting if present
    $visit = \App\Models\Setting::get('page_visit');
    if (is_array($visit)) {
        $visit['maps_url'] = $newUrl;
        \App\Models\Setting::set('page_visit', $visit);
    }
    
    \Illuminate\Support\Facades\Cache::forget('sanubari_settings');
    $this->info("Maps URL updated to {$newUrl} in database and cache cleared.");
})->purpose('Update Google Maps URL across database settings');

Artisan::command('akm:setup-partners-slider', function () {
    \App\Models\Setting::set('home_partners_enabled', true);
    \App\Models\Setting::set('home_partners_title', 'Mitra dan Client Langganan AKM');
    \App\Models\Setting::set('home_partners_subtitle', 'Deretan Coffee Shop ternama yang mempercayakan perlengkapan mereka kepada kami.');
    \App\Models\Setting::set('home_partners_slides', [
        [
            'id' => 'gartenhaus',
            'title' => 'Gartenhaus Malang',
            'city' => 'MALANG',
            'image' => 'https://images.unsplash.com/photo-1497636577773-f1231844b336?auto=format&fit=crop&w=800&q=80',
            'href' => 'https://www.instagram.com/gartenhaus_co/',
            'open_in_new_tab' => true,
        ],
        [
            'id' => 'sanubari-roastery',
            'title' => 'Sanubari Roastery',
            'city' => 'MALANG',
            'image' => 'https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&w=800&q=80',
            'href' => 'https://maps.app.goo.gl/Hua4AUHyaHLuY9uz7',
            'open_in_new_tab' => true,
        ],
        [
            'id' => 'bataputih',
            'title' => 'Bataputih Coffee',
            'city' => 'MALANG',
            'image' => 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80',
            'href' => 'https://www.instagram.com/bataputihkopi/',
            'open_in_new_tab' => true,
        ],
        [
            'id' => 'lafayette',
            'title' => 'Lafayette Coffee & Eatery',
            'city' => 'MALANG',
            'image' => 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
            'href' => 'https://www.instagram.com/lafayettecoffee/',
            'open_in_new_tab' => true,
        ],
        [
            'id' => 'coffee-heritage',
            'title' => 'Coffee Heritage',
            'city' => 'MALANG',
            'image' => 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=800&q=80',
            'href' => 'https://www.instagram.com/coffeeheritagemlg/',
            'open_in_new_tab' => true,
        ],
        [
            'id' => 'fee-space',
            'title' => 'Oura Coffee & Space',
            'city' => 'MALANG',
            'image' => 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80',
            'href' => 'https://www.instagram.com/ouraspace/',
            'open_in_new_tab' => true,
        ],
        [
            'id' => 'dialoog',
            'title' => 'Dialoog Coffee',
            'city' => 'MALANG',
            'image' => 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80',
            'href' => 'https://www.instagram.com/dialoog.coffee/',
            'open_in_new_tab' => true,
        ],
    ]);
    \Illuminate\Support\Facades\Cache::forget('sanubari_settings');
    $this->info("Partners slider configured successfully.");
})->purpose('Setup home partners coverflow slider settings');
