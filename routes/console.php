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
    \App\Models\Setting::set('home_promo_banner_image', 'banners/banner-event-komunitas.png');
    \App\Models\Setting::set('home_promo_banner_link', 'https://wa.me/6282132095241?text=' . rawurlencode('Halo Alat Kopi Malang, saya ingin reservasi/booking tempat untuk event komunitas & gathering.'));
    \App\Models\Setting::set('home_promo_banner_alt', 'Book Now! Place For Your Event Komunitas & Gathering — Alat Kopi Malang');
    \Illuminate\Support\Facades\Cache::forget('sanubari_settings');
    $this->info("Home promo banner configured successfully.");
})->purpose('Setup home promo banner settings');
