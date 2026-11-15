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
