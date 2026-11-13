<?php

require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Setting;

$keys = [
    'pickup_store_name',
    'pickup_store_address',
    'shipping_sender_name',
    'shipping_origin_subdistrict_id',
    'shipping_origin_postal_code',
    'shipping_origin_latitude',
    'shipping_origin_longitude',
];

$res = Setting::whereIn('key', $keys)->pluck('value', 'key')->toArray();
echo json_encode($res, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES) . PHP_EOL;
