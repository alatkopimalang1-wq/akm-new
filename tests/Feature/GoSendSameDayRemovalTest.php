<?php

use App\Services\ShippingService;

test('gosend rates calculation returns only instant and never same day', function () {
    // 1. With exact pinpoint coordinates within Malang (e.g. 5 km away)
    $rates = ShippingService::calculateRates([
        'destination_city_id' => 256,
        'destination_subdistrict_id' => 3896,
        'province_id' => 11,
        'weight_grams' => 500,
        'subtotal' => 100000,
        'destination_latitude' => -7.9400,
        'destination_longitude' => 112.6200,
    ]);

    $services = collect($rates)
        ->where('courier_code', 'gosend')
        ->pluck('service')
        ->all();

    expect($services)->toContain('Instant');
    expect($services)->not->toContain('Same Day');
});

test('gosend district fallback calculation returns only instant and never same day', function () {
    // District fallback (no coordinates) in Lowokwaru (subdistrict 3896)
    $rates = ShippingService::calculateRates([
        'destination_city_id' => 256,
        'destination_subdistrict_id' => 3896,
        'province_id' => 11,
        'weight_grams' => 1000,
        'subtotal' => 150000,
    ]);

    $services = collect($rates)
        ->where('courier_code', 'gosend')
        ->pluck('service')
        ->all();

    expect($services)->toContain('Instant');
    expect($services)->not->toContain('Same Day');
});
