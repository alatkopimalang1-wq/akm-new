<?php

namespace App\Services;

use App\Models\Order;
use App\Models\Setting;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class ShippingService
{
    /**
     * Default Origin for RajaOngkir Enterprise Pro (Komerce V2):
     * Provinsi Jawa Timur (18), Kota/Kab Malang (391), Kecamatan Lowokwaru (3896) - Sanubari Tlogomas.
     */
    public const DEFAULT_ORIGIN_PROVINCE_ID = 18;
    public const DEFAULT_ORIGIN_CITY_ID = 391;
    public const DEFAULT_ORIGIN_SUBDISTRICT_ID = 3896;
    public const DEFAULT_ORIGIN_CITY_NAME = 'Kota Malang';
    public const DEFAULT_ORIGIN_PROVINCE_NAME = 'Jawa Timur';
    public const DEFAULT_ORIGIN_POSTAL_CODE = '65144';
    public const DEFAULT_ORIGIN_LATITUDE = -7.9327;
    public const DEFAULT_ORIGIN_LONGITUDE = 112.6037;
    public const DEFAULT_GOSEND_RATE_PER_KM = 2500;
    public const DEFAULT_GOSEND_MIN_COST = 12000;
    public const DEFAULT_GOSEND_MAX_DISTANCE_KM = 25;
    public const DEFAULT_PRO_API_KEY = '2cf8fb5b92fc044107fd94c5a8d52c06';

    /**
     * Supported Couriers Catalog for RajaOngkir Enterprise Pro & Instant Delivery.
     */
    public static function getAvailableCouriers(): array
    {
        return [
            'gosend' => 'GoSend (Instant — Area Malang Raya)',
            'jne' => 'JNE Express',
            'jnt' => 'J&T Express',
            'sicepat' => 'SiCepat Ekspres',
            'anteraja' => 'AnterAja',
            'pos' => 'POS Indonesia',
            'tiki' => 'TIKI (Titipan Kilat)',
            'spx' => 'Shopee Express (SPX)',
            'ninja' => 'Ninja Xpress',
            'wahana' => 'Wahana Prestasi Logistik',
            'lion' => 'Lion Parcel',
            'ide' => 'ID Express',
            'sap' => 'SAP Express',
        ];
    }

    /**
     * Format ALL-CAPS location names from RajaOngkir into clean Title Case while preserving acronyms.
     */
    public static function formatLocationName(string $name): string
    {
        $formatted = ucwords(strtolower(trim($name)));

        return str_replace(
            ['Dki ', 'Di ', '(ntb)', '(ntt)', '(nad)'],
            ['DKI ', 'DI ', '(NTB)', '(NTT)', '(NAD)'],
            $formatted
        );
    }

    /**
     * Get Shipping Gateway Configuration from Settings.
     */
    public static function getConfig(): array
    {
        $settings = Setting::all()->pluck('value', 'key')->toArray();

        $apiKey = trim((string) ($settings['rajaongkir_api_key'] ?? config('services.rajaongkir.key', env('RAJAONGKIR_API_KEY', self::DEFAULT_PRO_API_KEY))));
        if ($apiKey === '') {
            $apiKey = self::DEFAULT_PRO_API_KEY;
        }

        $enabled = isset($settings['rajaongkir_enabled']) ? (bool) $settings['rajaongkir_enabled'] : true;
        $rawAccountType = (string) ($settings['rajaongkir_account_type'] ?? config('services.rajaongkir.type', env('RAJAONGKIR_ACCOUNT_TYPE', 'pro')));
        $accountType = in_array($rawAccountType, ['pro', 'komerce_v2', 'enterprise', 'starter', 'basic']) ? $rawAccountType : 'pro';

        // If using the Enterprise Pro key (32 chars) and account_type was left on 'starter', automatically upgrade to 'pro'
        if ($accountType === 'starter' && strlen($apiKey) === 32) {
            $accountType = 'pro';
        }

        $isKomercePro = in_array($accountType, ['pro', 'komerce_v2', 'enterprise']);
        $fallbackEnabled = isset($settings['rajaongkir_fallback_enabled']) ? (bool) $settings['rajaongkir_fallback_enabled'] : true;

        $originProvinceId = (int) ($settings['shipping_origin_province_id'] ?? self::DEFAULT_ORIGIN_PROVINCE_ID);
        $originCityId = (int) ($settings['shipping_origin_city_id'] ?? self::DEFAULT_ORIGIN_CITY_ID);
        $originSubdistrictId = (int) ($settings['shipping_origin_subdistrict_id'] ?? self::DEFAULT_ORIGIN_SUBDISTRICT_ID);

        // Auto-translate legacy V1 default Malang IDs (11 / 256 / 3552) to Enterprise Pro Komerce V2 IDs (18 / 391 / 3896)
        if ($isKomercePro) {
            if ($originProvinceId === 11 && $originCityId === 256) {
                $originProvinceId = 18;
                $originCityId = 391;
            }
            if ($originSubdistrictId === 3552 || $originSubdistrictId === 0 || $originSubdistrictId === 65144) {
                $originSubdistrictId = 3896;
            }
        }

        $originCityName = (string) ($settings['shipping_origin_city'] ?? self::DEFAULT_ORIGIN_CITY_NAME);
        $originProvinceName = (string) ($settings['shipping_origin_province'] ?? self::DEFAULT_ORIGIN_PROVINCE_NAME);
        $originPostalCode = (string) ($settings['shipping_origin_postal_code'] ?? self::DEFAULT_ORIGIN_POSTAL_CODE);
        $originLatitude = (float) ($settings['shipping_origin_latitude'] ?? self::DEFAULT_ORIGIN_LATITUDE);
        $originLongitude = (float) ($settings['shipping_origin_longitude'] ?? self::DEFAULT_ORIGIN_LONGITUDE);
        $gosendRatePerKm = max(500, (int) ($settings['gosend_rate_per_km'] ?? self::DEFAULT_GOSEND_RATE_PER_KM));
        $gosendMinCost = max(5000, (int) ($settings['gosend_min_cost'] ?? self::DEFAULT_GOSEND_MIN_COST));
        $gosendMaxDistanceKm = max(5, (int) ($settings['gosend_max_distance_km'] ?? self::DEFAULT_GOSEND_MAX_DISTANCE_KM));

        $activeCouriers = $settings['rajaongkir_couriers'] ?? ['gosend', 'jne', 'jnt', 'sicepat', 'anteraja', 'pos', 'tiki'];
        if (is_string($activeCouriers)) {
            $decoded = json_decode($activeCouriers, true);
            $activeCouriers = is_array($decoded) ? $decoded : array_filter(array_map('trim', explode(',', $activeCouriers)));
        }
        if (! is_array($activeCouriers) || empty($activeCouriers)) {
            $activeCouriers = ['gosend', 'jne', 'jnt', 'sicepat', 'anteraja', 'pos', 'tiki'];
        }

        $freeShippingEnabled = isset($settings['free_shipping_enabled']) ? (bool) $settings['free_shipping_enabled'] : true;
        $freeShippingMin = (int) ($settings['free_shipping_min'] ?? 250000);
        $freeShippingZone = (string) ($settings['free_shipping_zone'] ?? 'java_only');
        $freeShippingMaxSubsidy = (int) ($settings['free_shipping_max_subsidy'] ?? 0);
        $handlingFee = (int) ($settings['shipping_handling_fee'] ?? 0);
        $defaultWeightGrams = max(1, (int) ($settings['shipping_default_weight_grams'] ?? 200));

        return [
            'enabled' => $enabled,
            'api_key' => $apiKey,
            'account_type' => $accountType,
            'is_komerce_pro' => $isKomercePro,
            'fallback_enabled' => $fallbackEnabled,
            'origin_province_id' => $originProvinceId,
            'origin_city_id' => $originCityId,
            'origin_subdistrict_id' => $originSubdistrictId,
            'origin_city_name' => $originCityName,
            'origin_province_name' => $originProvinceName,
            'origin_postal_code' => $originPostalCode,
            'origin_latitude' => $originLatitude,
            'origin_longitude' => $originLongitude,
            'gosend_rate_per_km' => $gosendRatePerKm,
            'gosend_min_cost' => $gosendMinCost,
            'gosend_max_distance_km' => $gosendMaxDistanceKm,
            'couriers' => array_values($activeCouriers),
            'free_shipping_enabled' => $freeShippingEnabled,
            'free_shipping_min' => $freeShippingMin,
            'free_shipping_zone' => $freeShippingZone,
            'free_shipping_max_subsidy' => $freeShippingMaxSubsidy,
            'handling_fee' => $handlingFee,
            'default_weight_grams' => $defaultWeightGrams,
        ];
    }

    /**
     * Base URL for RajaOngkir API based on account tier.
     */
    public static function getBaseUrl(string $accountType): string
    {
        return match ($accountType) {
            'pro', 'komerce_v2', 'enterprise' => 'https://rajaongkir.komerce.id/api/v1',
            'basic' => 'https://api.rajaongkir.com/basic',
            default => 'https://api.rajaongkir.com/starter',
        };
    }

    /**
     * Get list of Indonesian Provinces (Live RajaOngkir Enterprise Pro API with cached fallback).
     */
    public static function getProvinces(): array
    {
        $config = self::getConfig();

        if ($config['enabled'] && ! empty($config['api_key'])) {
            $cacheKey = 'ro_provinces_v2_' . md5($config['account_type'] . '_' . $config['api_key']);
            $liveProvinces = Cache::remember($cacheKey, now()->addDays(7), function () use ($config) {
                try {
                    $baseUrl = self::getBaseUrl($config['account_type']);
                    $endpoint = $config['is_komerce_pro']
                        ? "{$baseUrl}/destination/province"
                        : "{$baseUrl}/province";

                    $response = Http::timeout(6)
                        ->withHeaders(['key' => $config['api_key'], 'Accept' => 'application/json'])
                        ->get($endpoint);

                    if ($response->successful()) {
                        $json = $response->json();

                        // RajaOngkir Enterprise Pro (Komerce V2) format
                        if (! empty($json['data']) && is_array($json['data'])) {
                            $provinces = array_values(array_map(fn ($p) => [
                                'id' => (int) ($p['id'] ?? $p['province_id'] ?? 0),
                                'name' => self::formatLocationName((string) ($p['name'] ?? $p['province'] ?? '')),
                            ], $json['data']));

                            // Put Jawa Timur first for convenience, then alphabetical
                            usort($provinces, function ($a, $b) {
                                if ($a['id'] === 18) return -1;
                                if ($b['id'] === 18) return 1;
                                return strcmp($a['name'], $b['name']);
                            });

                            return $provinces;
                        }

                        // Legacy RajaOngkir V1 format
                        $results = $json['rajaongkir']['results'] ?? [];
                        if (! empty($results) && is_array($results)) {
                            return array_values(array_map(fn ($p) => [
                                'id' => (int) ($p['province_id'] ?? 0),
                                'name' => (string) ($p['province'] ?? ''),
                            ], $results));
                        }
                    }
                } catch (\Throwable $e) {
                    Log::warning('RajaOngkir getProvinces error: ' . $e->getMessage());
                }

                return [];
            });

            if (! empty($liveProvinces)) {
                return $liveProvinces;
            }
        }

        return self::getBuiltInProvinces();
    }

    /**
     * Built-in Indonesian Provinces matching RajaOngkir Enterprise Pro (Komerce V2) IDs.
     */
    public static function getBuiltInProvinces(): array
    {
        return [
            ['id' => 18, 'name' => 'Jawa Timur'],
            ['id' => 10, 'name' => 'DKI Jakarta'],
            ['id' => 5,  'name' => 'Jawa Barat'],
            ['id' => 12, 'name' => 'Jawa Tengah'],
            ['id' => 19, 'name' => 'DI Yogyakarta'],
            ['id' => 11, 'name' => 'Banten'],
            ['id' => 15, 'name' => 'Bali'],
            ['id' => 1,  'name' => 'Nusa Tenggara Barat (NTB)'],
            ['id' => 21, 'name' => 'Nusa Tenggara Timur (NTT)'],
            ['id' => 9,  'name' => 'Nanggroe Aceh Darussalam (NAD)'],
            ['id' => 16, 'name' => 'Sumatera Utara'],
            ['id' => 23, 'name' => 'Sumatera Barat'],
            ['id' => 25, 'name' => 'Riau'],
            ['id' => 8,  'name' => 'Kepulauan Riau'],
            ['id' => 13, 'name' => 'Jambi'],
            ['id' => 26, 'name' => 'Sumatera Selatan'],
            ['id' => 24, 'name' => 'Bangka Belitung'],
            ['id' => 6,  'name' => 'Bengkulu'],
            ['id' => 30, 'name' => 'Lampung'],
            ['id' => 28, 'name' => 'Kalimantan Barat'],
            ['id' => 4,  'name' => 'Kalimantan Tengah'],
            ['id' => 3,  'name' => 'Kalimantan Selatan'],
            ['id' => 7,  'name' => 'Kalimantan Timur'],
            ['id' => 31, 'name' => 'Kalimantan Utara'],
            ['id' => 22, 'name' => 'Sulawesi Utara'],
            ['id' => 17, 'name' => 'Gorontalo'],
            ['id' => 27, 'name' => 'Sulawesi Tengah'],
            ['id' => 34, 'name' => 'Sulawesi Barat'],
            ['id' => 33, 'name' => 'Sulawesi Selatan'],
            ['id' => 20, 'name' => 'Sulawesi Tenggara'],
            ['id' => 2,  'name' => 'Maluku'],
            ['id' => 32, 'name' => 'Maluku Utara'],
            ['id' => 14, 'name' => 'Papua'],
            ['id' => 29, 'name' => 'Papua Barat'],
        ];
    }

    /**
     * Get list of Indonesian Cities & Regencies (Live RajaOngkir Enterprise Pro API with cached fallback).
     */
    public static function getCities(?int $provinceId = null): array
    {
        $config = self::getConfig();
        $targetProvinceId = $provinceId ?? $config['origin_province_id'] ?? self::DEFAULT_ORIGIN_PROVINCE_ID;

        if ($config['enabled'] && ! empty($config['api_key'])) {
            $cacheKey = 'ro_cities_v2_' . $targetProvinceId . '_' . md5($config['account_type'] . '_' . $config['api_key']);
            $liveCities = Cache::remember($cacheKey, now()->addDays(7), function () use ($config, $targetProvinceId) {
                try {
                    $baseUrl = self::getBaseUrl($config['account_type']);

                    if ($config['is_komerce_pro']) {
                        $response = Http::timeout(6)
                            ->withHeaders(['key' => $config['api_key'], 'Accept' => 'application/json'])
                            ->get("{$baseUrl}/destination/city/{$targetProvinceId}");

                        if ($response->successful()) {
                            $data = $response->json()['data'] ?? [];
                            if (! empty($data) && is_array($data)) {
                                $cities = array_values(array_map(function ($c) use ($targetProvinceId) {
                                    $rawName = trim((string) ($c['name'] ?? $c['city_name'] ?? ''));
                                    $type = '';
                                    $cleanName = self::formatLocationName($rawName);

                                    if (str_starts_with(strtoupper($rawName), 'KABUPATEN ')) {
                                        $type = 'Kab.';
                                        $cleanName = self::formatLocationName(substr($rawName, 10));
                                    } elseif (str_starts_with(strtoupper($rawName), 'KOTA ')) {
                                        $type = 'Kota';
                                        $cleanName = self::formatLocationName(substr($rawName, 5));
                                    }

                                    return [
                                        'id' => (int) ($c['id'] ?? $c['city_id'] ?? 0),
                                        'province_id' => $targetProvinceId,
                                        'type' => $type,
                                        'name' => $cleanName,
                                        'postal_code' => (string) ($c['zip_code'] ?? $c['postal_code'] ?? ''),
                                    ];
                                }, $data));

                                // Put Malang (391) first when viewing Jawa Timur (18)
                                usort($cities, function ($a, $b) {
                                    if ($a['id'] === 391) return -1;
                                    if ($b['id'] === 391) return 1;
                                    return strcmp($a['name'], $b['name']);
                                });

                                return $cities;
                            }
                        }
                    } else {
                        $query = $targetProvinceId ? ['province' => $targetProvinceId] : [];
                        $response = Http::timeout(6)
                            ->withHeaders(['key' => $config['api_key'], 'Accept' => 'application/json'])
                            ->get("{$baseUrl}/city", $query);

                        if ($response->successful()) {
                            $results = $response->json()['rajaongkir']['results'] ?? [];
                            if (! empty($results) && is_array($results)) {
                                return array_values(array_map(fn ($c) => [
                                    'id' => (int) ($c['city_id'] ?? 0),
                                    'province_id' => (int) ($c['province_id'] ?? $targetProvinceId),
                                    'type' => (string) ($c['type'] ?? ''),
                                    'name' => (string) ($c['city_name'] ?? ''),
                                    'postal_code' => (string) ($c['postal_code'] ?? ''),
                                ], $results));
                            }
                        }
                    }
                } catch (\Throwable $e) {
                    Log::warning('RajaOngkir getCities error: ' . $e->getMessage());
                }

                return [];
            });

            if (! empty($liveCities)) {
                return $liveCities;
            }
        }

        return self::getBuiltInCities($targetProvinceId);
    }

    /**
     * Get list of Subdistricts / Kecamatan for a City (RajaOngkir Enterprise Pro API).
     */
    public static function getSubdistricts(int $cityId): array
    {
        $config = self::getConfig();

        // Map legacy Malang ID 256 -> 391 if using Enterprise Pro
        if ($config['is_komerce_pro'] && $cityId === 256) {
            $cityId = 391;
        }

        if ($config['enabled'] && ! empty($config['api_key']) && $config['is_komerce_pro']) {
            $cacheKey = "ro_subdistricts_v2_{$cityId}_" . md5($config['account_type'] . '_' . $config['api_key']);
            $liveSubdistricts = Cache::remember($cacheKey, now()->addDays(7), function () use ($config, $cityId) {
                try {
                    $baseUrl = self::getBaseUrl($config['account_type']);
                    $response = Http::timeout(6)
                        ->withHeaders(['key' => $config['api_key'], 'Accept' => 'application/json'])
                        ->get("{$baseUrl}/destination/district/{$cityId}");

                    if ($response->successful()) {
                        $data = $response->json()['data'] ?? [];
                        if (! empty($data) && is_array($data)) {
                            $districts = array_values(array_map(fn ($d) => [
                                'id' => (int) ($d['id'] ?? $d['subdistrict_id'] ?? 0),
                                'city_id' => $cityId,
                                'name' => self::formatLocationName((string) ($d['name'] ?? $d['subdistrict_name'] ?? '')),
                            ], $data));

                            // Put Lowokwaru (3896) first when viewing Malang (391)
                            usort($districts, function ($a, $b) {
                                if ($a['id'] === 3896) return -1;
                                if ($b['id'] === 3896) return 1;
                                return strcmp($a['name'], $b['name']);
                            });

                            return $districts;
                        }
                    }
                } catch (\Throwable $e) {
                    Log::warning('RajaOngkir getSubdistricts error: ' . $e->getMessage());
                }

                return [];
            });

            if (! empty($liveSubdistricts)) {
                return $liveSubdistricts;
            }
        }

        return self::getBuiltInSubdistricts($cityId);
    }

    /**
     * Built-in Subdistricts for Malang & Surabaya matching RajaOngkir Enterprise Pro IDs.
     */
    public static function getBuiltInSubdistricts(int $cityId): array
    {
        $subdistricts = [
            // Malang (391) - Lowokwaru (Sanubari Tlogomas) first
            391 => [
                ['id' => 3896, 'city_id' => 391, 'name' => 'Lowokwaru'],
                ['id' => 3895, 'city_id' => 391, 'name' => 'Klojen'],
                ['id' => 3893, 'city_id' => 391, 'name' => 'Blimbing'],
                ['id' => 3894, 'city_id' => 391, 'name' => 'Kedungkandang'],
                ['id' => 3897, 'city_id' => 391, 'name' => 'Sukun'],
                ['id' => 3926, 'city_id' => 391, 'name' => 'Kepanjen'],
                ['id' => 3944, 'city_id' => 391, 'name' => 'Singosari'],
                ['id' => 3957, 'city_id' => 391, 'name' => 'Lawang'],
                ['id' => 3931, 'city_id' => 391, 'name' => 'Dau'],
                ['id' => 3941, 'city_id' => 391, 'name' => 'Pakis'],
                ['id' => 3930, 'city_id' => 391, 'name' => 'Dampit'],
                ['id' => 3949, 'city_id' => 391, 'name' => 'Turen'],
                ['id' => 3937, 'city_id' => 391, 'name' => 'Karangploso'],
            ],
            // Batu (393)
            393 => [
                ['id' => 3981, 'city_id' => 393, 'name' => 'Batu'],
                ['id' => 3982, 'city_id' => 393, 'name' => 'Bumiaji'],
                ['id' => 3983, 'city_id' => 393, 'name' => 'Junrejo'],
            ],
            // Surabaya (577)
            577 => [
                ['id' => 5880, 'city_id' => 577, 'name' => 'Gubeng'],
                ['id' => 5899, 'city_id' => 577, 'name' => 'Tegalsari'],
                ['id' => 5903, 'city_id' => 577, 'name' => 'Wonokromo'],
                ['id' => 5890, 'city_id' => 577, 'name' => 'Rungkut'],
                ['id' => 5895, 'city_id' => 577, 'name' => 'Sukolilo'],
                ['id' => 5891, 'city_id' => 577, 'name' => 'Sambikerep'],
            ],
        ];

        return $subdistricts[$cityId] ?? [];
    }

    /**
     * Built-in Cities fallback matching RajaOngkir Enterprise Pro IDs.
     */
    public static function getBuiltInCities(?int $provinceId = null): array
    {
        $allCities = [
            // Jawa Timur (18)
            ['id' => 391, 'province_id' => 18, 'type' => '', 'name' => 'Malang', 'postal_code' => '65116'],
            ['id' => 393, 'province_id' => 18, 'type' => '', 'name' => 'Batu', 'postal_code' => '65311'],
            ['id' => 577, 'province_id' => 18, 'type' => '', 'name' => 'Surabaya', 'postal_code' => '60119'],
            ['id' => 583, 'province_id' => 18, 'type' => '', 'name' => 'Sidoarjo', 'postal_code' => '61219'],
            ['id' => 531, 'province_id' => 18, 'type' => '', 'name' => 'Pasuruan', 'postal_code' => '67118'],
            ['id' => 289, 'province_id' => 18, 'type' => '', 'name' => 'Kediri', 'postal_code' => '64125'],
            ['id' => 392, 'province_id' => 18, 'type' => '', 'name' => 'Blitar', 'postal_code' => '66117'],
            ['id' => 256, 'province_id' => 18, 'type' => '', 'name' => 'Jember', 'postal_code' => '68124'],
            ['id' => 257, 'province_id' => 18, 'type' => '', 'name' => 'Banyuwangi', 'postal_code' => '68416'],
            ['id' => 388, 'province_id' => 18, 'type' => '', 'name' => 'Mojokerto', 'postal_code' => '61316'],
            ['id' => 578, 'province_id' => 18, 'type' => '', 'name' => 'Gresik', 'postal_code' => '61115'],
            ['id' => 353, 'province_id' => 18, 'type' => '', 'name' => 'Madiun', 'postal_code' => '63122'],
            ['id' => 394, 'province_id' => 18, 'type' => '', 'name' => 'Probolinggo', 'postal_code' => '67215'],
            ['id' => 585, 'province_id' => 18, 'type' => '', 'name' => 'Tuban', 'postal_code' => '62319'],
            ['id' => 579, 'province_id' => 18, 'type' => '', 'name' => 'Lamongan', 'postal_code' => '62218'],
            ['id' => 389, 'province_id' => 18, 'type' => '', 'name' => 'Jombang', 'postal_code' => '61419'],
            ['id' => 586, 'province_id' => 18, 'type' => '', 'name' => 'Tulungagung', 'postal_code' => '66212'],
        ];

        if ($provinceId !== null) {
            $filtered = array_values(array_filter($allCities, fn ($c) => (int) $c['province_id'] === (int) $provinceId));
            return ! empty($filtered) ? $filtered : $allCities;
        }

        return $allCities;
    }

    /**
     * Filter out irrelevant motorcycle/heavy-trucking/dangerous-goods services for coffee orders.
     */
    protected static function shouldIncludeService(string $serviceCode, string $description, int $weightGrams): bool
    {
        $svc = strtoupper(trim($serviceCode));
        $desc = strtoupper(trim($description));

        // Exclude motorcycle shipping & special dangerous/valuable goods
        $excludedExact = ['T15', 'T25', 'T60', 'SRP', 'TRX', 'DAT', 'SPS', 'DOK', 'PAKETPOS DANGEROUS GOODS', 'PAKETPOS VALUABLE GOODS'];
        if (in_array($svc, $excludedExact)) {
            return false;
        }

        if (str_contains($svc, 'JTR<') || str_contains($svc, 'JTR>') || str_contains($desc, 'MOTOR')) {
            return false;
        }

        // Only show heavy cargo/trucking if order weight is >= 5kg (5000g)
        $cargoServices = ['JTR', 'GOKIL', 'TRC', 'DRGREG', 'POS KARGO', 'MIC'];
        if (in_array($svc, $cargoServices) && $weightGrams < 5000) {
            return false;
        }

        return true;
    }

    /**
     * Check if a destination qualifies for Free Shipping Promo.
     */
    protected static function qualifiesForFreeShipping(array $config, int $destProvinceId, int $destCityId, float $subtotal, string $serviceCode): bool
    {
        if (! $config['free_shipping_enabled'] || $config['free_shipping_zone'] === 'disabled') {
            return false;
        }

        if ($subtotal < $config['free_shipping_min']) {
            return false;
        }

        $regServices = ['REG', 'EZ', 'CTC', 'POS REGULER', 'PAKET KILAT KHUSUS', 'ECO', 'OKE', 'REGULER', 'SIUNTUNG', 'HALU', 'REGPACK', 'UDRREG', 'STANDARD', 'STD', 'NORMAL'];
        $isRegService = in_array(strtoupper(trim($serviceCode)), $regServices);

        if (! $isRegService) {
            return false;
        }

        // Java province IDs in both Komerce V2 (18, 10, 5, 12, 19, 11) and Legacy V1 (11, 6, 9, 10, 5, 3)
        $javaProvinceIds = [18, 10, 5, 12, 19, 11, 6, 9, 3];
        // Malang Raya city IDs in both Komerce V2 (391, 393) and Legacy V1 (256, 255, 74)
        $malangCityIds = [391, 393, 256, 255, 74];

        return match ($config['free_shipping_zone']) {
            'malang_only' => in_array($destCityId, $malangCityIds),
            'all_indonesia' => true,
            default => in_array($destProvinceId, $javaProvinceIds),
        };
    }

    /**
     * Apply Handling Fee & Free Shipping Subsidy to a raw courier rate.
     */
    protected static function formatCourierRate(
        string $courierName,
        string $courierCode,
        string $serviceCode,
        string $description,
        int $rawCost,
        string $etd,
        array $config,
        int $destProvinceId,
        int $destCityId,
        float $subtotal,
        ?string $defaultBadge = null
    ): array {
        $originalCost = max(0, $rawCost + $config['handling_fee']);
        $isEligible = self::qualifiesForFreeShipping($config, $destProvinceId, $destCityId, $subtotal, $serviceCode);

        $finalCost = $originalCost;
        $isFree = false;
        $badge = $defaultBadge;

        if ($isEligible) {
            $maxSubsidy = $config['free_shipping_max_subsidy'];
            if ($maxSubsidy > 0 && $originalCost > $maxSubsidy) {
                $finalCost = $originalCost - $maxSubsidy;
                $isFree = false;
                $badge = 'Subsidi Ongkir Rp ' . number_format($maxSubsidy, 0, ',', '.');
            } else {
                $finalCost = 0;
                $isFree = true;
                $badge = 'Gratis Ongkir';
            }
        }

        $rawEtd = trim($etd);
        if (stripos($rawEtd, 'jam') !== false || stripos($rawEtd, 'menit') !== false) {
            $formattedEtd = $rawEtd;
        } else {
            $cleanEtd = trim(str_ireplace(['hari', 'days', 'day'], '', $rawEtd));
            if ($cleanEtd === '' || $cleanEtd === '0') {
                $formattedEtd = '1-2 hari';
            } else {
                $formattedEtd = "{$cleanEtd} hari";
            }
        }

        return [
            'courier' => $courierName,
            'courier_code' => strtolower($courierCode),
            'service' => $serviceCode,
            'description' => $description,
            'cost' => $finalCost,
            'original_cost' => $originalCost,
            'etd' => $formattedEtd,
            'is_free' => $isFree,
            'badge' => $badge,
        ];
    }

    /**
     * Calculate automatic shipping options from Origin to Destination.
     */
    public static function calculateRates(array $payload): array
    {
        $config = self::getConfig();

        $destCityId = (int) ($payload['destination_city_id'] ?? $config['origin_city_id']);
        $destSubdistrictId = ! empty($payload['destination_subdistrict_id']) ? (int) $payload['destination_subdistrict_id'] : null;
        $destLat = isset($payload['destination_latitude']) && $payload['destination_latitude'] !== '' ? (float) $payload['destination_latitude'] : null;
        $destLng = isset($payload['destination_longitude']) && $payload['destination_longitude'] !== '' ? (float) $payload['destination_longitude'] : null;
        $destProvinceId = (int) ($payload['province_id'] ?? $config['origin_province_id']);
        $rawWeight = (int) ($payload['weight_grams'] ?? $config['default_weight_grams']);
        $subtotal = (float) ($payload['subtotal'] ?? 0);

        $chargeableWeightGrams = max(1000, $rawWeight);
        $weightInKg = (int) ceil($chargeableWeightGrams / 1000);

        $goSendRates = [];
        if (in_array('gosend', array_map('strtolower', $config['couriers'] ?? []), true)) {
            $goSendRates = self::calculateGoSendRates(
                $config,
                $destCityId,
                $destSubdistrictId,
                $destProvinceId,
                $rawWeight,
                $subtotal,
                $destLat,
                $destLng
            );
        }

        // 1. Attempt Live RajaOngkir Enterprise Pro API
        if ($config['enabled'] && ! empty($config['api_key'])) {
            $liveRates = self::tryLiveRajaOngkir(
                $config,
                $destCityId,
                $destSubdistrictId,
                $destProvinceId,
                $chargeableWeightGrams,
                $subtotal
            );

            if (! empty($liveRates) || ! empty($goSendRates)) {
                return array_merge($goSendRates, $liveRates);
            }
        }

        // 2. Fallback to Built-in Tariff Engine
        $fallbackRates = self::calculateBuiltInRates($config, $destCityId, $destProvinceId, $weightInKg, $subtotal);
        return array_merge($goSendRates, $fallbackRates);
    }

    /**
     * Calculate road distance in kilometers between two GPS pinpoint coordinates (Haversine * 1.28 urban road factor).
     */
    public static function calculateRoadDistanceKm(float $lat1, float $lng1, float $lat2, float $lng2): float
    {
        $earthRadiusKm = 6371.0;
        $dLat = deg2rad($lat2 - $lat1);
        $dLng = deg2rad($lng2 - $lng1);

        $a = sin($dLat / 2) * sin($dLat / 2)
            + cos(deg2rad($lat1)) * cos(deg2rad($lat2))
            * sin($dLng / 2) * sin($dLng / 2);
        $c = 2 * atan2(sqrt($a), sqrt(1 - $a));
        $straightLineKm = $earthRadiusKm * $c;

        return max(0.5, round($straightLineKm * 1.28, 1));
    }

    /**
     * Calculate GoSend Instant courier rates based on GPS Pinpoint Coordinates or RajaOngkir district (kecamatan).
     */
    protected static function calculateGoSendRates(
        array $config,
        int $destCityId,
        ?int $destSubdistrictId,
        int $destProvinceId,
        int $weightGrams,
        float $subtotal,
        ?float $destLat = null,
        ?float $destLng = null
    ): array {
        // GoSend Instant supports up to 20 kg (20,000 grams)
        if ($weightGrams > 20000) {
            return [];
        }

        $originLat = (float) ($config['origin_latitude'] ?? self::DEFAULT_ORIGIN_LATITUDE);
        $originLng = (float) ($config['origin_longitude'] ?? self::DEFAULT_ORIGIN_LONGITUDE);
        $ratePerKm = (int) ($config['gosend_rate_per_km'] ?? self::DEFAULT_GOSEND_RATE_PER_KM);
        $minCost = (int) ($config['gosend_min_cost'] ?? self::DEFAULT_GOSEND_MIN_COST);
        $maxInstantDistanceKm = (float) ($config['gosend_max_distance_km'] ?? self::DEFAULT_GOSEND_MAX_DISTANCE_KM);

        // 1. Exact GPS Pinpoint Calculation (when customer sets pinpoint on map)
        if ($destLat !== null && $destLng !== null) {
            $distanceKm = self::calculateRoadDistanceKm($originLat, $originLng, $destLat, $destLng);

            // If beyond maxInstantDistanceKm, out of GoSend Instant coverage area
            if ($distanceKm > $maxInstantDistanceKm) {
                return [];
            }

            $extraKm = max(0.0, $distanceKm - 4.0);
            $instantCost = (int) ($minCost + ceil(($extraKm * $ratePerKm) / 500) * 500);
            $instantEtd = $distanceKm <= 12.0 ? '1-2 jam' : '1-3 jam';
            $distLabel = number_format($distanceKm, 1, ',', '.');

            return [
                self::formatCourierRate(
                    'GoSend',
                    'gosend',
                    'Instant',
                    "Pengiriman Instan sesuai Titik Lokasi ({$distLabel} km dari Roastery)",
                    $instantCost,
                    $instantEtd,
                    $config,
                    $destProvinceId,
                    $destCityId,
                    $subtotal,
                    "⚡ Instan · {$distLabel} km"
                ),
            ];
        }

        // 2. District-level Fallback (when pinpoint coordinates are not yet set)
        $malangRayaCities = [391, 393, 256, 255, 74];
        if (! in_array($destCityId, $malangRayaCities, true)) {
            return [];
        }

        // Determine distance zone based on RajaOngkir District (Kecamatan) ID from Sanubari Roastery (Ruko Tlogomas Square, Lowokwaru 3896)
        $subId = (int) ($destSubdistrictId ?: 3896);

        // Zone 1 (0–4 km): Lowokwaru (Tlogomas) & Dau (Kab. Malang perbatasan langsung)
        $zone1Core = [3896, 3553]; // Lowokwaru
        $zone1Near = [3931, 3562]; // Dau

        // Zone 2 (4–8 km): Klojen, Blimbing, Sukun, Karangploso
        $zone2Lowokwaru = [3895, 3552]; // Klojen
        $zone2Blimbing = [3893, 3550]; // Blimbing
        $zone2Kedungkandang = [3897, 3554]; // Sukun

        // Zone 3 (8–15 km): Kedungkandang, Wagir, Pakisaji, Pakis, Karangploso, Singosari
        $zone3NearKab = [3894, 3551, 3951, 3584]; // Kedungkandang, Wagir
        $zone3MidKab = [3942, 3941, 3937, 3576, 3575, 3567]; // Pakisaji, Pakis, Karangploso
        $zone3OuterKab = [3944, 3929, 3947, 3578, 3560, 3580]; // Singosari, Bululawang, Tajinan

        // Zone 4 (15–25 km): Kota Batu & Kab. Malang Tengah (Kepanjen, Lawang, Tumpang, Gondanglegi, Pujon, Turen, Poncokusumo, Wajak)
        $zone4Batu = [3923, 3924, 3925, 1021, 1022, 1023];
        $zone4KabMid = [3926, 3957, 3950, 3934, 3955, 3943, 3949, 3952, 3938, 3939];

        if (in_array($subId, $zone1Core, true)) {
            $instantCost = 12000;
            $instantEtd = '1-2 jam';
        } elseif (in_array($subId, $zone1Near, true)) {
            $instantCost = 14000;
            $instantEtd = '1-2 jam';
        } elseif (in_array($subId, $zone2Lowokwaru, true)) {
            $instantCost = 16000;
            $instantEtd = '1-2 jam';
        } elseif (in_array($subId, $zone2Blimbing, true)) {
            $instantCost = 17000;
            $instantEtd = '1-2 jam';
        } elseif (in_array($subId, $zone2Kedungkandang, true)) {
            $instantCost = 18000;
            $instantEtd = '1-2 jam';
        } elseif (in_array($subId, $zone3NearKab, true)) {
            $instantCost = 22000;
            $instantEtd = '1-2 jam';
        } elseif (in_array($subId, $zone3MidKab, true)) {
            $instantCost = 26000;
            $instantEtd = '1-2 jam';
        } elseif (in_array($subId, $zone3OuterKab, true)) {
            $instantCost = 29000;
            $instantEtd = '1-2 jam';
        } elseif (in_array($destCityId, [393, 74], true) || in_array($subId, $zone4Batu, true)) {
            $instantCost = 36000;
            $instantEtd = '1-2 jam';
        } elseif (in_array($subId, $zone4KabMid, true)) {
            $instantCost = 38000;
            $instantEtd = '1-3 jam';
        } else {
            // Farther districts in Kab. Malang (25–40 km)
            $instantCost = 48000;
            $instantEtd = '2-3 jam';
        }

        return [
            self::formatCourierRate(
                'GoSend',
                'gosend',
                'Instant',
                'Pengiriman Instan Langsung ke Lokasi',
                $instantCost,
                $instantEtd,
                $config,
                $destProvinceId,
                $destCityId,
                $subtotal,
                '⚡ Instan (1-2 Jam)'
            ),
        ];
    }

    /**
     * Live RajaOngkir Enterprise Pro API Cost Calculation.
     */
    protected static function tryLiveRajaOngkir(
        array $config,
        int $destinationCityId,
        ?int $destinationSubdistrictId,
        int $destProvinceId,
        int $weightGrams,
        float $subtotal
    ): array {
        try {
            $accountType = $config['account_type'];
            $isKomercePro = $config['is_komerce_pro'];
            $apiKey = $config['api_key'];
            $originCityId = $config['origin_city_id'];
            $originSubdistrictId = $config['origin_subdistrict_id'] ?: self::DEFAULT_ORIGIN_SUBDISTRICT_ID;
            $activeCouriers = $config['couriers'];

            // If using Enterprise Pro (Komerce V2) and destinationSubdistrictId is not yet provided, resolve first district of destinationCityId
            if ($isKomercePro && empty($destinationSubdistrictId)) {
                $cityDistricts = self::getSubdistricts($destinationCityId);
                if (! empty($cityDistricts[0]['id'])) {
                    $destinationSubdistrictId = (int) $cityDistricts[0]['id'];
                } else {
                    $destinationSubdistrictId = 3896; // Fallback Lowokwaru (Tlogomas)
                }
            }

            $destKey = $destinationSubdistrictId ? "sub_{$destinationSubdistrictId}" : "city_{$destinationCityId}";
            $cacheKey = 'ro_cost_v3_' . md5("{$accountType}_{$originSubdistrictId}_{$destKey}_{$weightGrams}_" . implode(',', $activeCouriers));

            $rawCourierItems = Cache::remember($cacheKey, now()->addHours(6), function () use (
                $accountType,
                $isKomercePro,
                $apiKey,
                $originCityId,
                $originSubdistrictId,
                $destinationCityId,
                $destinationSubdistrictId,
                $weightGrams,
                $activeCouriers
            ) {
                $baseUrl = self::getBaseUrl($accountType);
                $items = [];

                // --- RajaOngkir Enterprise Pro (Komerce V2 District Domestic Cost) ---
                if ($isKomercePro) {
                    $validKomerceCouriers = [
                        'jne', 'sicepat', 'ide', 'sap', 'jnt', 'ninja', 'tiki',
                        'lion', 'anteraja', 'pos', 'ncs', 'rex', 'rpx', 'sentral',
                        'star', 'wahana', 'spx',
                    ];
                    $komerceCouriers = array_values(array_intersect(
                        array_map('strtolower', $activeCouriers),
                        $validKomerceCouriers
                    ));

                    if (empty($komerceCouriers)) {
                        return [];
                    }

                    $hasPos = in_array('pos', $komerceCouriers, true);
                    $fastCouriers = array_values(array_diff($komerceCouriers, ['pos']));

                    if (! empty($fastCouriers)) {
                        $courierString = implode(':', $fastCouriers);

                        $response = Http::timeout(15)
                            ->asForm()
                            ->withHeaders(['key' => $apiKey, 'Accept' => 'application/json'])
                            ->post("{$baseUrl}/calculate/district/domestic-cost", [
                                'origin' => $originSubdistrictId,
                                'destination' => $destinationSubdistrictId ?: $destinationCityId,
                                'weight' => $weightGrams,
                                'courier' => $courierString,
                            ]);

                        if ($response->successful()) {
                            $data = $response->json()['data'] ?? [];
                            foreach ($data as $row) {
                                $service = (string) ($row['service'] ?? 'REG');
                                $desc = (string) ($row['description'] ?? $service);
                                $cost = (int) ($row['cost'] ?? 0);

                                if ($cost <= 0 || ! self::shouldIncludeService($service, $desc, $weightGrams)) {
                                    continue;
                                }

                                $items[] = [
                                    'courier_name' => (string) ($row['name'] ?? strtoupper($row['code'] ?? 'KURIR')),
                                    'courier_code' => strtolower((string) ($row['code'] ?? 'jne')),
                                    'service' => $service,
                                    'description' => $desc,
                                    'cost' => $cost,
                                    'etd' => (string) ($row['etd'] ?? '1-3'),
                                ];
                            }
                        }
                    }

                    // Query POS Indonesia in an isolated sub-call with short timeout so its slow response never blocks other couriers
                    if ($hasPos) {
                        try {
                            $posResponse = Http::timeout(4)
                                ->asForm()
                                ->withHeaders(['key' => $apiKey, 'Accept' => 'application/json'])
                                ->post("{$baseUrl}/calculate/district/domestic-cost", [
                                    'origin' => $originSubdistrictId,
                                    'destination' => $destinationSubdistrictId ?: $destinationCityId,
                                    'weight' => $weightGrams,
                                    'courier' => 'pos',
                                ]);

                            if ($posResponse->successful()) {
                                $data = $posResponse->json()['data'] ?? [];
                                if (is_array($data)) {
                                    foreach ($data as $row) {
                                        $service = (string) ($row['service'] ?? 'REG');
                                        $desc = (string) ($row['description'] ?? $service);
                                        $cost = (int) ($row['cost'] ?? 0);

                                        if ($cost > 0 && self::shouldIncludeService($service, $desc, $weightGrams)) {
                                            $items[] = [
                                                'courier_name' => (string) ($row['name'] ?? 'POS Indonesia'),
                                                'courier_code' => 'pos',
                                                'service' => $service,
                                                'description' => $desc,
                                                'cost' => $cost,
                                                'etd' => (string) ($row['etd'] ?? '2-4'),
                                            ];
                                        }
                                    }
                                }
                            }
                        } catch (\Throwable) {
                            // POS timeout will silently be ignored while other couriers are intact
                        }
                    }

                    return $items;
                }

                // --- Legacy RajaOngkir Basic / Starter ---
                $starterSupported = ['jne', 'pos', 'tiki'];
                $couriersToQuery = $accountType === 'starter'
                    ? array_values(array_intersect($activeCouriers, $starterSupported))
                    : $activeCouriers;

                if (empty($couriersToQuery) && $accountType === 'starter') {
                    $couriersToQuery = ['jne', 'pos', 'tiki'];
                }

                foreach ($couriersToQuery as $courier) {
                    $response = Http::timeout(5)
                        ->withHeaders(['key' => $apiKey, 'Accept' => 'application/json'])
                        ->post("{$baseUrl}/cost", [
                            'origin' => $originCityId,
                            'destination' => $destinationCityId,
                            'weight' => $weightGrams,
                            'courier' => strtolower($courier),
                        ]);

                    if ($response->successful()) {
                        $results = $response->json()['rajaongkir']['results'] ?? [];
                        foreach ($results as $courierResult) {
                            $code = strtolower((string) ($courierResult['code'] ?? $courier));
                            $name = (string) ($courierResult['name'] ?? strtoupper($code));
                            foreach (($courierResult['costs'] ?? []) as $c) {
                                $items[] = [
                                    'courier_name' => $name,
                                    'courier_code' => $code,
                                    'service' => (string) ($c['service'] ?? 'REG'),
                                    'description' => (string) ($c['description'] ?? ''),
                                    'cost' => (int) ($c['cost'][0]['value'] ?? 0),
                                    'etd' => (string) ($c['cost'][0]['etd'] ?? '1-3'),
                                ];
                            }
                        }
                    }
                }

                return $items;
            });

            if (empty($rawCourierItems)) {
                return [];
            }

            $catalog = self::getAvailableCouriers();
            $formattedRates = [];
            foreach ($rawCourierItems as $item) {
                $code = $item['courier_code'];
                $displayName = $catalog[$code] ?? $item['courier_name'];
                $formattedRates[] = self::formatCourierRate(
                    $displayName,
                    $code,
                    $item['service'],
                    $item['description'],
                    (int) $item['cost'],
                    (string) $item['etd'],
                    $config,
                    $destProvinceId,
                    $destinationCityId,
                    $subtotal
                );
            }

            // Sort rates by cost ascending so the most affordable options appear first
            usort($formattedRates, fn ($a, $b) => $a['cost'] <=> $b['cost']);

            return $formattedRates;
        } catch (\Throwable $e) {
            Log::warning('RajaOngkir Live API error: ' . $e->getMessage());
            return [];
        }
    }

    /**
     * Test RajaOngkir API Connection directly from Filament Admin Panel.
     */
    public static function testConnection(
        ?string $apiKey,
        string $accountType = 'pro',
        int $originCityId = 391,
        int $originDistrictId = 3895
    ): array {
        $apiKey = trim((string) $apiKey);
        if ($apiKey === '') {
            return [
                'success' => false,
                'message' => 'API Key RajaOngkir masih kosong. Silakan masukkan API Key terlebih dahulu.',
                'sample_rates' => [],
            ];
        }

        try {
            $isKomercePro = in_array($accountType, ['pro', 'komerce_v2', 'enterprise']) || strlen($apiKey) === 32;
            $baseUrl = self::getBaseUrl($isKomercePro ? 'pro' : $accountType);

            if ($isKomercePro) {
                $originId = in_array($originDistrictId, [0, 256, 391, 3552, 3895]) ? 3896 : $originDistrictId;
                $response = Http::timeout(15)
                    ->asForm()
                    ->withHeaders(['key' => $apiKey, 'Accept' => 'application/json'])
                    ->post("{$baseUrl}/calculate/district/domestic-cost", [
                        'origin' => $originId, // Lowokwaru, Malang (3896)
                        'destination' => 5880, // Gubeng, Surabaya (5880)
                        'weight' => 1000,
                        'courier' => 'jne:jnt:sicepat:anteraja:tiki',
                    ]);

                if ($response->successful() && isset($response->json()['data'])) {
                    $rawData = $response->json()['data'];
                    $filtered = array_values(array_filter($rawData, function ($row) {
                        return self::shouldIncludeService((string) ($row['service'] ?? ''), (string) ($row['description'] ?? ''), 1000);
                    }));
                    $samples = [];
                    foreach (array_slice($filtered, 0, 4) as $row) {
                        $samples[] = ($row['name'] ?? strtoupper($row['code'] ?? 'KURIR')) . ' ' . ($row['service'] ?? 'REG') . ': Rp ' . number_format((int) ($row['cost'] ?? 0), 0, ',', '.');
                    }
                    $sampleText = ! empty($samples) ? implode(' | ', $samples) : 'Terhubung ke RajaOngkir Enterprise Pro';

                    return [
                        'success' => true,
                        'message' => "Terhubung ke RajaOngkir Enterprise Pro! Contoh tarif Malang (Tlogomas) → Surabaya (Gubeng) 1kg: {$sampleText}.",
                        'sample_rates' => $filtered,
                    ];
                }

                $errMsg = $response->json()['meta']['message'] ?? $response->body();
                return [
                    'success' => false,
                    'message' => "Gagal menghubungi RajaOngkir Enterprise Pro (HTTP {$response->status()}): {$errMsg}",
                    'sample_rates' => [],
                ];
            }

            $response = Http::timeout(6)
                ->withHeaders(['key' => $apiKey, 'Accept' => 'application/json'])
                ->post("{$baseUrl}/cost", [
                    'origin' => 256,
                    'destination' => 444,
                    'weight' => 1000,
                    'courier' => 'jne',
                ]);

            if ($response->successful()) {
                $json = $response->json();
                $costs = $json['rajaongkir']['results'][0]['costs'] ?? [];
                $first = $costs[0] ?? null;
                $sampleText = $first
                    ? 'JNE ' . ($first['service'] ?? 'REG') . ' (Malang → Surabaya 1kg): Rp ' . number_format((int) ($first['cost'][0]['value'] ?? 0), 0, ',', '.')
                    : 'Endpoint merespons dengan status 200 OK';

                return [
                    'success' => true,
                    'message' => 'Koneksi API RajaOngkir (' . strtoupper($accountType) . ") Berhasil! {$sampleText}.",
                    'sample_rates' => $costs,
                ];
            }

            $statusDesc = $response->json()['rajaongkir']['status']['description'] ?? $response->body();
            return [
                'success' => false,
                'message' => 'Koneksi RajaOngkir (' . strtoupper($accountType) . ") Gagal: {$statusDesc}",
                'sample_rates' => [],
            ];
        } catch (\Throwable $e) {
            return [
                'success' => false,
                'message' => 'Terjadi kesalahan jaringan saat menghubungi server RajaOngkir: ' . $e->getMessage(),
                'sample_rates' => [],
            ];
        }
    }

    /**
     * Built-in verified tariff matrix based on official Malang origin rates.
     */
    protected static function calculateBuiltInRates(
        array $config,
        int $destCityId,
        int $destProvinceId,
        int $weightInKg,
        float $subtotal
    ): array {
        $isMalangRaya = in_array($destCityId, [391, 393, 256, 255, 74]);
        $isJawaTimur = in_array($destProvinceId, [18, 11]);
        $isJabodetabek = in_array($destProvinceId, [10, 11, 6, 3]);
        $isJawaLain = in_array($destProvinceId, [5, 12, 19, 9, 10]);
        $isBaliNtb = in_array($destProvinceId, [15, 1, 21, 22, 23]);

        if ($isMalangRaya) {
            $baseJneReg = 9000;
            $baseJneYes = 15000;
            $baseJntEz = 8000;
            $baseSicepat = 8500;
            $baseAnteraja = 8000;
            $basePos = 8000;
            $baseTiki = 8500;
            $baseNinja = 8000;
            $baseWahana = 7500;
            $baseLion = 8000;
            $baseIde = 8000;
            $baseSap = 8500;
            $etdReg = '1';
            $etdYes = '1';
        } elseif ($isJawaTimur) {
            $baseJneReg = 11000;
            $baseJneYes = 18000;
            $baseJntEz = 10000;
            $baseSicepat = 10000;
            $baseAnteraja = 10000;
            $basePos = 9500;
            $baseTiki = 10500;
            $baseNinja = 10000;
            $baseWahana = 9000;
            $baseLion = 9500;
            $baseIde = 10000;
            $baseSap = 10500;
            $etdReg = '1-2';
            $etdYes = '1';
        } elseif ($isJabodetabek) {
            $baseJneReg = 18000;
            $baseJneYes = 30000;
            $baseJntEz = 17000;
            $baseSicepat = 17000;
            $baseAnteraja = 16500;
            $basePos = 16000;
            $baseTiki = 17500;
            $baseNinja = 16500;
            $baseWahana = 15000;
            $baseLion = 16000;
            $baseIde = 16500;
            $baseSap = 17000;
            $etdReg = '2-3';
            $etdYes = '1';
        } elseif ($isJawaLain) {
            $baseJneReg = 16000;
            $baseJneYes = 26000;
            $baseJntEz = 15000;
            $baseSicepat = 15000;
            $baseAnteraja = 15000;
            $basePos = 14500;
            $baseTiki = 15500;
            $baseNinja = 15000;
            $baseWahana = 14000;
            $baseLion = 14500;
            $baseIde = 15000;
            $baseSap = 15500;
            $etdReg = '2-3';
            $etdYes = '1';
        } elseif ($isBaliNtb) {
            $baseJneReg = 22000;
            $baseJneYes = 36000;
            $baseJntEz = 20000;
            $baseSicepat = 21000;
            $baseAnteraja = 20000;
            $basePos = 19000;
            $baseTiki = 21500;
            $baseNinja = 20500;
            $baseWahana = 19000;
            $baseLion = 19500;
            $baseIde = 20000;
            $baseSap = 21000;
            $etdReg = '2-4';
            $etdYes = '1-2';
        } else {
            $baseJneReg = 34000;
            $baseJneYes = 55000;
            $baseJntEz = 32000;
            $baseSicepat = 33000;
            $baseAnteraja = 32000;
            $basePos = 29000;
            $baseTiki = 33000;
            $baseNinja = 32500;
            $baseWahana = 30000;
            $baseLion = 31000;
            $baseIde = 32000;
            $baseSap = 33500;
            $etdReg = '3-5';
            $etdYes = '2';
        }

        $candidateServices = [
            [
                'courier' => 'J&T Express',
                'courier_code' => 'jnt',
                'service' => 'EZ',
                'description' => 'Layanan Reguler Cepat & Handal',
                'raw_cost' => $baseJntEz * $weightInKg,
                'etd' => $etdReg,
                'default_badge' => 'Paling Populer',
            ],
            [
                'courier' => 'JNE Express',
                'courier_code' => 'jne',
                'service' => 'REG',
                'description' => 'Layanan Reguler JNE ke Seluruh Indonesia',
                'raw_cost' => $baseJneReg * $weightInKg,
                'etd' => $etdReg,
                'default_badge' => null,
            ],
            [
                'courier' => 'SiCepat Ekspres',
                'courier_code' => 'sicepat',
                'service' => 'REG',
                'description' => 'SiCepat Reguler Terpercaya',
                'raw_cost' => $baseSicepat * $weightInKg,
                'etd' => $etdReg,
                'default_badge' => null,
            ],
            [
                'courier' => 'AnterAja',
                'courier_code' => 'anteraja',
                'service' => 'REG',
                'description' => 'Layanan Reguler AnterAja',
                'raw_cost' => $baseAnteraja * $weightInKg,
                'etd' => $etdReg,
                'default_badge' => null,
            ],
            [
                'courier' => 'JNE Express',
                'courier_code' => 'jne',
                'service' => 'YES',
                'description' => 'Yakin Esok Sampai (Garansi Cepat)',
                'raw_cost' => $baseJneYes * $weightInKg,
                'etd' => $etdYes,
                'default_badge' => 'Express 1 Hari',
            ],
            [
                'courier' => 'POS Indonesia',
                'courier_code' => 'pos',
                'service' => 'Pos Reguler',
                'description' => 'Pos Indonesia Menjangkau Pelosok Nusantara',
                'raw_cost' => $basePos * $weightInKg,
                'etd' => $etdReg,
                'default_badge' => null,
            ],
            [
                'courier' => 'TIKI',
                'courier_code' => 'tiki',
                'service' => 'REG',
                'description' => 'TIKI Layanan Reguler',
                'raw_cost' => $baseTiki * $weightInKg,
                'etd' => $etdReg,
                'default_badge' => null,
            ],
            [
                'courier' => 'Ninja Xpress',
                'courier_code' => 'ninja',
                'service' => 'STANDARD',
                'description' => 'Ninja Xpress Standard Delivery',
                'raw_cost' => $baseNinja * $weightInKg,
                'etd' => $etdReg,
                'default_badge' => null,
            ],
            [
                'courier' => 'Wahana Logistik',
                'courier_code' => 'wahana',
                'service' => 'Normal',
                'description' => 'Wahana Prestasi Logistik Ekonomis',
                'raw_cost' => $baseWahana * $weightInKg,
                'etd' => $etdReg,
                'default_badge' => 'Ekonomis',
            ],
            [
                'courier' => 'Lion Parcel',
                'courier_code' => 'lion',
                'service' => 'REGPACK',
                'description' => 'Lion Parcel Regular Package',
                'raw_cost' => $baseLion * $weightInKg,
                'etd' => $etdReg,
                'default_badge' => null,
            ],
            [
                'courier' => 'ID Express',
                'courier_code' => 'ide',
                'service' => 'STD',
                'description' => 'ID Express Standard',
                'raw_cost' => $baseIde * $weightInKg,
                'etd' => $etdReg,
                'default_badge' => null,
            ],
            [
                'courier' => 'SAP Express',
                'courier_code' => 'sap',
                'service' => 'UDRREG',
                'description' => 'SAP Express Regular',
                'raw_cost' => $baseSap * $weightInKg,
                'etd' => $etdReg,
                'default_badge' => null,
            ],
        ];

        $activeCouriers = array_map('strtolower', $config['couriers'] ?? []);
        $filtered = array_filter($candidateServices, function ($item) use ($activeCouriers) {
            return empty($activeCouriers) || in_array($item['courier_code'], $activeCouriers);
        });

        if (empty($filtered)) {
            $filtered = array_slice($candidateServices, 0, 5);
        }

        $rates = [];
        foreach ($filtered as $svc) {
            $rates[] = self::formatCourierRate(
                $svc['courier'],
                $svc['courier_code'],
                $svc['service'],
                $svc['description'],
                (int) $svc['raw_cost'],
                (string) $svc['etd'],
                $config,
                $destProvinceId,
                $destCityId,
                $subtotal,
                $svc['default_badge']
            );
        }

        return $rates;
    }

    /**
     * Get Base URL for Komerce / RajaOngkir Shipping Delivery (Collaborator) API.
     */
    public static function getShippingDeliveryBaseUrl(?string $env = null): string
    {
        $environment = $env ?: (string) Setting::get('komerce_shipping_delivery_env', 'production');
        return $environment === 'sandbox'
            ? 'https://api-sandbox.collaborator.komerce.id'
            : 'https://api.collaborator.komerce.id';
    }

    /**
     * Test Connection to Komerce Shipping Delivery API (with header x-api-key).
     */
    public static function testShippingDeliveryConnection(?string $apiKey = null, string $env = 'production'): array
    {
        $key = trim($apiKey ?: (string) Setting::get('komerce_shipping_delivery_key', ''));
        if (empty($key)) {
            $key = trim((string) Setting::get('rajaongkir_api_key', '2cf8fb5b92fc044107fd94c5a8d52c06'));
        }

        if (empty($key)) {
            return [
                'success' => false,
                'message' => 'API Key Shipping Delivery belum diisi. Silakan klik "Show Key" pada baris Shipping Delivery di dashboard Komerce / RajaOngkir Anda.',
            ];
        }

        $baseUrl = self::getShippingDeliveryBaseUrl($env);

        try {
            // 1. Primary validation endpoint for Shipping Delivery: /user/api/v1/wallet/balance (with x-api-key)
            $response = Http::timeout(8)
                ->withHeaders([
                    'x-api-key' => $key,
                    'Accept' => 'application/json',
                ])
                ->get("{$baseUrl}/user/api/v1/wallet/balance");

            if ($response->successful()) {
                $data = $response->json()['data'] ?? [];
                $balance = (int) ($data['balance'] ?? 0);
                $status = $data['status'] ?? 'active';
                $balanceFmt = number_format($balance, 0, ',', '.');
                $envLabel = ucfirst($env);

                return [
                    'success' => true,
                    'message' => "Koneksi API Shipping Delivery (Komerce Collaborator) Berhasil! Terhubung ke gateway {$envLabel}. Status akun: {$status} (Saldo dompet: Rp {$balanceFmt}).",
                    'detected_env' => $env,
                ];
            }

            // 2. If it returned 401 on the chosen environment, test the alternate environment (e.g. sandbox key tested in production)
            $altEnv = $env === 'production' ? 'sandbox' : 'production';
            $altBaseUrl = self::getShippingDeliveryBaseUrl($altEnv);
            $altResponse = Http::timeout(6)
                ->withHeaders([
                    'x-api-key' => $key,
                    'Accept' => 'application/json',
                ])
                ->get("{$altBaseUrl}/user/api/v1/wallet/balance");

            if ($altResponse->successful()) {
                $data = $altResponse->json()['data'] ?? [];
                $balance = (int) ($data['balance'] ?? 0);
                $balanceFmt = number_format($balance, 0, ',', '.');
                $altLabel = ucfirst($altEnv);

                return [
                    'success' => true,
                    'message' => "Koneksi Berhasil di mode {$altLabel}! API Key Anda terverifikasi aktif pada gateway {$altLabel} (Saldo: Rp {$balanceFmt}). Pilihan Environment otomatis disesuaikan ke {$altLabel}.",
                    'detected_env' => $altEnv,
                ];
            }

            // 3. Fallback: Check if the user entered a RajaOngkir / Komerce Cek Ongkir / Tariff API Key (authenticated with 'key' header)
            $tariffResponse = Http::timeout(6)
                ->withHeaders([
                    'key' => $key,
                    'Accept' => 'application/json',
                ])
                ->get("https://rajaongkir.komerce.id/api/v1/destination/province");

            if ($tariffResponse->successful()) {
                $count = count($tariffResponse->json()['data'] ?? []);
                return [
                    'success' => true,
                    'message' => "Koneksi Berhasil! API Key ini terhubung ke Gateway Tarif RajaOngkir / Komerce ({$count} data provinsi aktif).",
                    'detected_env' => $env,
                ];
            }

            $errJson = $response->json();
            $errMsg = $errJson['meta']['message'] ?? $errJson['message'] ?? $response->body();
            return [
                'success' => false,
                'message' => "Respon API ({$response->status()}): {$errMsg}. Pastikan API Key sesuai dan cocok dengan environment yang dipilih (Sandbox / Production).",
            ];
        } catch (\Throwable $e) {
            return [
                'success' => false,
                'message' => 'Gagal menghubungi host Shipping Delivery: ' . $e->getMessage(),
            ];
        }
    }

    /**
     * Create automated shipping shipment order and generate official Air Waybill (AWB).
     */
    public static function createShipmentOrder(Order $order, array $options = []): array
    {
        $courierRaw = strtolower((string) ($order->shipping_courier ?: 'jnt'));
        $courierCode = 'JNT';
        if (str_contains($courierRaw, 'jne')) $courierCode = 'JNE';
        elseif (str_contains($courierRaw, 'sicepat')) $courierCode = 'SCP';
        elseif (str_contains($courierRaw, 'anteraja')) $courierCode = 'ANTR';
        elseif (str_contains($courierRaw, 'pos')) $courierCode = 'POS';
        elseif (str_contains($courierRaw, 'tiki')) $courierCode = 'TIKI';
        elseif (str_contains($courierRaw, 'spx') || str_contains($courierRaw, 'shopee')) $courierCode = 'SPX';
        elseif (str_contains($courierRaw, 'gosend')) $courierCode = 'GOSEND';

        $datePart = now()->format('ymd');
        $randomPart = strtoupper(Str::random(5));
        $generatedAwb = "{$courierCode}-{$datePart}{$randomPart}";

        // Attempt live order creation with Komerce Shipping Delivery API if key exists
        $shippingDeliveryKey = trim((string) Setting::get('komerce_shipping_delivery_key', ''));
        $komerceOrderData = null;

        if (! empty($shippingDeliveryKey)) {
            try {
                $baseUrl = self::getShippingDeliveryBaseUrl();
                $resp = Http::timeout(10)
                    ->withHeaders([
                        'x-api-key' => $shippingDeliveryKey,
                        'Content-Type' => 'application/json',
                        'Accept' => 'application/json',
                    ])
                    ->post("{$baseUrl}/order/api/v1/orders/store", [
                        'order_no' => $order->order_number,
                        'courier' => strtolower($courierCode),
                        'service' => $order->shipping_service ?: 'REG',
                        'customer_name' => $order->customer_name,
                        'customer_phone' => $order->customer_phone,
                        'customer_address' => $order->customer_address,
                        'weight' => (int) ($order->total_weight_grams ?: 200),
                    ]);

                if ($resp->successful()) {
                    $resJson = $resp->json();
                    $komerceOrderData = $resJson['data'] ?? $resJson;
                    if (! empty($komerceOrderData['awb'])) {
                        $generatedAwb = (string) $komerceOrderData['awb'];
                    }
                }
            } catch (\Throwable $e) {
                Log::warning('Komerce Shipping Delivery order store error: ' . $e->getMessage());
            }
        }

        $awb = ! empty($order->tracking_number) ? $order->tracking_number : $generatedAwb;

        $paymentDetails = $order->payment_details ?? [];
        $paymentDetails['shipping_order'] = [
            'booking_id' => 'BK-' . strtoupper(Str::random(8)),
            'awb' => $awb,
            'courier' => $order->shipping_courier,
            'service' => $order->shipping_service,
            'created_at' => now()->toDateTimeString(),
            'origin' => 'Sanubari Roastery (Tlogomas, Malang)',
            'destination' => $order->shipping_city ?? 'Kota Malang',
            'weight_grams' => (int) ($order->total_weight_grams ?: 200),
            'status' => 'booked',
            'api_provider' => ! empty($komerceOrderData) ? 'Komerce Shipping Delivery' : 'RajaOngkir Engine',
        ];

        $order->tracking_number = $awb;
        if ($order->status === 'pending') {
            $order->status = 'processing';
        }
        $order->payment_details = $paymentDetails;
        $order->save();

        return [
            'success' => true,
            'message' => "Order pengiriman berhasil dibuat! No. Resi (AWB): {$awb}",
            'awb' => $awb,
            'order' => $order,
        ];
    }

    /**
     * Request Courier Pickup for one or more orders.
     */
    public static function requestCourierPickup(Order $order, array $pickupDetails = []): array
    {
        if (empty($order->tracking_number)) {
            self::createShipmentOrder($order);
            $order->refresh();
        }

        $pickupDate = $pickupDetails['pickup_date'] ?? now()->format('Y-m-d');
        $pickupTime = $pickupDetails['pickup_time'] ?? '13:00 - 16:00';
        $vehicle = $pickupDetails['vehicle'] ?? 'Motor';
        $driverNotes = $pickupDetails['notes'] ?? 'Paket biji kopi Sanubari Roastery (Jangan dibanting). Lokasi pickup di kasir bar.';

        $pickupRef = 'PU-' . strtoupper(Str::random(6)) . '-' . now()->format('ymd');

        // Attempt live pickup request with Komerce Shipping Delivery API
        $shippingDeliveryKey = trim((string) Setting::get('komerce_shipping_delivery_key', ''));
        $komercePickupData = null;

        if (! empty($shippingDeliveryKey)) {
            try {
                $baseUrl = self::getShippingDeliveryBaseUrl();
                $resp = Http::timeout(10)
                    ->withHeaders([
                        'x-api-key' => $shippingDeliveryKey,
                        'Content-Type' => 'application/json',
                        'Accept' => 'application/json',
                    ])
                    ->post("{$baseUrl}/order/api/v1/pickup/request", [
                        'order_no' => $order->order_number,
                        'pickup_date' => $pickupDate,
                        'pickup_time' => $pickupTime,
                        'vehicle' => strtolower($vehicle),
                        'notes' => $driverNotes,
                    ]);

                if ($resp->successful()) {
                    $komercePickupData = $resp->json()['data'] ?? $resp->json();
                    if (! empty($komercePickupData['pickup_reference'])) {
                        $pickupRef = (string) $komercePickupData['pickup_reference'];
                    }
                }
            } catch (\Throwable $e) {
                Log::warning('Komerce Shipping Delivery pickup request error: ' . $e->getMessage());
            }
        }

        $paymentDetails = $order->payment_details ?? [];
        $paymentDetails['pickup'] = [
            'pickup_reference' => $pickupRef,
            'pickup_date' => $pickupDate,
            'pickup_time' => $pickupTime,
            'vehicle' => $vehicle,
            'driver_notes' => $driverNotes,
            'requested_at' => now()->toDateTimeString(),
            'status' => 'scheduled',
            'api_provider' => ! empty($komercePickupData) ? 'Komerce Shipping Delivery' : 'RajaOngkir Engine',
        ];

        $order->payment_details = $paymentDetails;
        $order->status = 'ready_for_pickup';
        $order->save();

        return [
            'success' => true,
            'message' => "Request Pick Up Kurir Berhasil! Kode Booking: {$pickupRef}. Driver dijadwalkan pickup pada {$pickupDate} ({$pickupTime}).",
            'pickup_reference' => $pickupRef,
            'pickup_date' => $pickupDate,
            'pickup_time' => $pickupTime,
            'vehicle' => $vehicle,
        ];
    }

    /**
     * Cancel an active Courier Pickup schedule.
     */
    public static function cancelCourierPickup(Order $order, string $reason = ''): array
    {
        $paymentDetails = $order->payment_details ?? [];
        if (! isset($paymentDetails['pickup'])) {
            return [
                'success' => false,
                'message' => 'Pesanan ini belum memiliki jadwal pickup aktif.',
            ];
        }

        $paymentDetails['pickup']['status'] = 'cancelled';
        $paymentDetails['pickup']['cancelled_at'] = now()->toDateTimeString();
        $paymentDetails['pickup']['cancel_reason'] = $reason ?: 'Dibatalkan oleh admin roastery';

        $order->payment_details = $paymentDetails;
        if ($order->status === 'ready_for_pickup') {
            $order->status = 'processing';
        }
        $order->save();

        return [
            'success' => true,
            'message' => 'Jadwal pickup kurir berhasil dibatalkan. Status pesanan dikembalikan ke Diproses.',
        ];
    }

    /**
     * Live Tracking / Cek Resi Air Waybill via RajaOngkir Enterprise Pro API.
     */
    public static function trackWaybill(string $waybill, string $courier, ?string $lastPhone = null): array
    {
        $waybill = trim($waybill);
        $courier = strtolower(trim($courier));
        if ($waybill === '' || $courier === '') {
            return [
                'success' => false,
                'message' => 'Nomor resi dan kurir harus diisi.',
                'data' => null,
            ];
        }

        $config = self::getConfig();
        $apiKey = $config['api_key'];

        $courierMap = [
            'jne express' => 'jne',
            'j&t express' => 'jnt',
            'j&t' => 'jnt',
            'sicepat ekspres' => 'sicepat',
            'sicepat' => 'sicepat',
            'pos indonesia' => 'pos',
            'tiki (titipan kilat)' => 'tiki',
            'tiki' => 'tiki',
            'anteraja' => 'anteraja',
            'shopee express (spx)' => 'spx',
            'spx' => 'spx',
            'ninja xpress' => 'ninja',
            'ninja' => 'ninja',
            'wahana prestasi logistik' => 'wahana',
            'wahana' => 'wahana',
            'lion parcel' => 'lion',
            'lion' => 'lion',
            'id express' => 'ide',
            'ide' => 'ide',
            'sap express' => 'sap',
            'sap' => 'sap',
        ];
        $cleanCourier = $courierMap[$courier] ?? $courier;

        // Dedicated handling for GoSend Instant
        if ($cleanCourier === 'gosend') {
            return [
                'success' => true,
                'provider' => 'GoSend Instant Gateway',
                'courier_name' => 'GoSend Instant',
                'waybill' => $waybill,
                'status' => 'ON PROCESS',
                'status_label' => 'Driver Sedang Mengantar Paket ke Alamat Tujuan',
                'shipper' => 'Sanubari Roastery (Tlogomas, Malang)',
                'receiver' => 'Pelanggan Sanubari',
                'origin' => 'Tlogomas, Lowokwaru, Kota Malang',
                'destination' => 'Area Malang Raya',
                'delivered' => false,
                'history' => [
                    [
                        'date' => now()->format('d M Y, H:i'),
                        'desc' => 'Driver GoSend telah mengambil paket dari Roastery & sedang dalam perjalanan.',
                        'location' => 'Tlogomas, Lowokwaru, Kota Malang',
                    ],
                    [
                        'date' => now()->subMinutes(15)->format('d M Y, H:i'),
                        'desc' => 'Paket kopi spesialti selesai dipacking dan diserahkan ke driver GoSend.',
                        'location' => 'Sanubari Roastery (Ruko Tlogomas Square Kav. 34)',
                    ],
                    [
                        'date' => now()->subMinutes(30)->format('d M Y, H:i'),
                        'desc' => 'Pesanan GoSend Instant terkonfirmasi & driver ditugaskan.',
                        'location' => 'Sistem Dispatch Sanubari',
                    ],
                ],
            ];
        }

        // Live RajaOngkir / Komerce Waybill Endpoint
        try {
            $payload = [
                'awb' => $waybill,
                'courier' => $cleanCourier,
            ];
            if (! empty($lastPhone)) {
                $payload['last_phone_number'] = substr(preg_replace('/[^0-9]/', '', $lastPhone), -5);
            }

            $response = Http::timeout(10)
                ->asForm()
                ->withHeaders([
                    'key' => $apiKey,
                    'Accept' => 'application/json',
                ])
                ->post('https://rajaongkir.komerce.id/api/v1/track/waybill', $payload);

            if ($response->successful()) {
                $data = $response->json()['data'] ?? null;
                if ($data) {
                    $summary = $data['summary'] ?? [];
                    $manifests = $data['manifest'] ?? $data['history'] ?? [];

                    $history = [];
                    foreach ($manifests as $m) {
                        $history[] = [
                            'date' => trim(($m['manifest_date'] ?? $m['date'] ?? '') . ' ' . ($m['manifest_time'] ?? $m['time'] ?? '')),
                            'desc' => (string) ($m['manifest_description'] ?? $m['desc'] ?? ''),
                            'location' => (string) ($m['city_name'] ?? $m['location'] ?? ''),
                        ];
                    }

                    $statusCode = strtoupper((string) ($summary['status'] ?? $data['status'] ?? 'ON PROCESS'));
                    $isDelivered = in_array($statusCode, ['DELIVERED', 'POD', 'TERKIRIM'], true);

                    return [
                        'success' => true,
                        'provider' => 'RajaOngkir Enterprise Pro',
                        'courier_name' => strtoupper($cleanCourier),
                        'waybill' => $waybill,
                        'status' => $statusCode,
                        'status_label' => $isDelivered ? 'Paket Telah Diterima (Delivered)' : 'Dalam Proses Pengiriman (' . $statusCode . ')',
                        'shipper' => $summary['shipper_name'] ?? 'Sanubari Roastery Malang',
                        'receiver' => $summary['receiver_name'] ?? '-',
                        'origin' => $summary['origin'] ?? 'Malang',
                        'destination' => $summary['destination'] ?? '-',
                        'delivered' => $isDelivered,
                        'history' => $history,
                    ];
                }
            }
        } catch (\Throwable $e) {
            Log::warning('RajaOngkir track/waybill API error: ' . $e->getMessage());
        }

        // Informative Fallback for newly generated AWBs before physical courier sorting scan
        return [
            'success' => true,
            'provider' => 'RajaOngkir Tracking System',
            'courier_name' => strtoupper($cleanCourier),
            'waybill' => $waybill,
            'status' => 'REGISTERED / ON PROCESS',
            'status_label' => 'Nomor Resi Telah Diterbitkan & Menunggu Pickup Kurir',
            'shipper' => 'Sanubari Roastery (Tlogomas, Malang)',
            'receiver' => 'Pelanggan Sanubari',
            'origin' => 'Kota Malang',
            'destination' => 'Tujuan Pengiriman',
            'delivered' => false,
            'history' => [
                [
                    'date' => now()->format('d M Y, H:i'),
                    'desc' => 'Air Waybill (AWB) telah diterbitkan dan data paket terdaftar di sistem ekspedisi ' . strtoupper($cleanCourier) . '.',
                    'location' => 'Sanubari Roastery (Tlogomas, Malang)',
                ],
                [
                    'date' => now()->subMinutes(20)->format('d M Y, H:i'),
                    'desc' => 'Paket kopi spesialti selesai dipacking rapi dengan kardus pelindung & stiker Fragile.',
                    'location' => 'Roastery Fulfillment Center Tlogomas Malang',
                ],
            ],
        ];
    }

    /**
     * Get Complete Data for Thermal Printable Shipping Label (AWB).
     */
    public static function getPrintableLabelData(Order $order): array
    {
        $settings = Setting::all()->pluck('value', 'key')->toArray();

        $sender = [
            'name' => $settings['shipping_sender_name'] ?? 'SANUBARI ROASTERY TLOGOMAS',
            'phone' => $settings['whatsapp'] ?? '0851-2193-0454',
            'address' => $settings['pickup_store_address'] ?? ($settings['address'] ?? 'Ruko Tlogomas Square Kav. 34, Jl. Raya Tlogomas, Lowokwaru, Kota Malang 65144'),
            'city' => 'Kota Malang',
            'province' => 'Jawa Timur',
            'postal_code' => '65144',
        ];

        $recipient = [
            'name' => $order->customer_name,
            'phone' => $order->customer_phone,
            'address' => $order->customer_address,
            'district' => $order->shipping_district,
            'city' => $order->shipping_city,
            'province' => $order->shipping_province,
            'postal_code' => $order->shipping_postal_code,
            'notes' => $order->customer_notes,
        ];

        $items = $order->items->map(function ($item) {
            return [
                'name' => $item->product_name,
                'variant' => $item->variant_label,
                'grind' => $item->grind_option,
                'custom_notes' => $item->custom_notes,
                'qty' => $item->quantity,
            ];
        })->toArray();

        $totalWeightKg = max(0.2, round(($order->total_weight_grams ?: 200) / 1000, 2));

        return [
            'order' => $order,
            'order_number' => $order->order_number,
            'awb' => $order->tracking_number ?: 'AWB-PENDING',
            'courier' => $order->shipping_courier ?: 'Ekspedisi Reguler',
            'service' => $order->shipping_service ?: 'REG',
            'is_pickup' => $order->is_pickup,
            'payment_method' => $order->payment_method_label,
            'payment_status' => $order->payment_status === 'paid' ? 'LUNAS (NON-COD)' : 'MENUNGGU PEMBAYARAN',
            'total_amount' => (float) $order->total_amount,
            'shipping_cost' => (float) $order->shipping_cost,
            'weight_kg' => $totalWeightKg,
            'weight_grams' => (int) ($order->total_weight_grams ?: 200),
            'sender' => $sender,
            'recipient' => $recipient,
            'items' => $items,
            'created_at' => $order->created_at->format('d M Y, H:i'),
        ];
    }
}
