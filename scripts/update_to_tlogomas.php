<?php

require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Setting;
use Illuminate\Support\Facades\Cache;

$updates = [
    'pickup_store_name' => 'Sanubari Roastery (Tlogomas, Malang)',
    'pickup_store_address' => 'Ruko Tlogomas Square Kav. 34, Jl. Raya Tlogomas, Lowokwaru, Kota Malang, Jawa Timur 65144',
    'address' => 'Ruko Tlogomas Square Kav. 34, Jl. Raya Tlogomas, Lowokwaru, Kota Malang, Jawa Timur 65144',
    'shipping_sender_name' => 'SANUBARI ROASTERY TLOGOMAS',
    'shipping_sender_address' => 'Ruko Tlogomas Square Kav. 34, Jl. Raya Tlogomas, Lowokwaru, Kota Malang 65144',
    'shipping_origin_city' => 'Kota Malang',
    'shipping_origin_province' => 'Jawa Timur',
    'shipping_origin_subdistrict_id' => 3896,
    'shipping_origin_postal_code' => '65144',
    'shipping_origin_latitude' => -7.9327,
    'shipping_origin_longitude' => 112.6037,
    'showroom_address' => 'Ruko Tlogomas Square Kav. 34, Jl. Raya Tlogomas, Lowokwaru, Kota Malang 65144',
];

foreach ($updates as $k => $v) {
    Setting::set($k, $v);
}

Cache::flush();
echo "Database updated to Sanubari Tlogomas successfully!\n";
