<?php

namespace App\Http\Controllers;

use App\Services\ShippingService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ShippingController extends Controller
{
    /**
     * Get list of provinces (RajaOngkir).
     */
    public function provinces(): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => ShippingService::getProvinces(),
        ]);
    }

    /**
     * Get list of cities optionally filtered by province ID (RajaOngkir).
     */
    public function cities(Request $request): JsonResponse
    {
        $provinceId = $request->query('province_id');
        $cities = ShippingService::getCities($provinceId !== null ? (int) $provinceId : null);

        return response()->json([
            'success' => true,
            'data' => $cities,
        ]);
    }

    /**
     * Get list of subdistricts / kecamatan filtered by city ID (RajaOngkir Pro / Komerce V2 / Built-in).
     */
    public function subdistricts(Request $request): JsonResponse
    {
        $cityId = (int) $request->query('city_id', 256);
        $subdistricts = ShippingService::getSubdistricts($cityId);

        return response()->json([
            'success' => true,
            'data' => $subdistricts,
        ]);
    }

    /**
     * Calculate automatic courier shipping rates via RajaOngkir Shipping Gateway.
     */
    public function calculate(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'destination_city_id' => 'required|integer',
            'destination_subdistrict_id' => 'nullable|integer',
            'destination_latitude' => 'nullable|numeric|between:-90,90',
            'destination_longitude' => 'nullable|numeric|between:-180,180',
            'province_id' => 'nullable|integer',
            'weight_grams' => 'required|integer|min:1',
            'subtotal' => 'nullable|numeric|min:0',
        ]);

        $config = ShippingService::getConfig();
        $rates = ShippingService::calculateRates($validated);

        return response()->json([
            'success' => true,
            'gateway' => [
                'provider' => 'RajaOngkir',
                'account_type' => $config['account_type'],
                'live_api' => $config['enabled'] && ! empty($config['api_key']),
            ],
            'origin' => [
                'city' => $config['origin_city_name'],
                'province' => $config['origin_province_name'],
                'postal_code' => $config['origin_postal_code'],
                'latitude' => $config['origin_latitude'],
                'longitude' => $config['origin_longitude'],
            ],
            'rates' => $rates,
        ]);
    }

    /**
     * Live Tracking / Cek Resi (RajaOngkir).
     */
    public function track(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'waybill' => 'required|string|max:100',
            'courier' => 'required|string|max:50',
            'last_phone' => 'nullable|string|max:30',
        ]);

        $result = ShippingService::trackWaybill(
            $validated['waybill'],
            $validated['courier'],
            $validated['last_phone'] ?? null
        );

        return response()->json($result);
    }

    /**
     * Request Courier Pickup for an order.
     */
    public function requestPickup(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'order_id' => 'required|integer|exists:orders,id',
            'pickup_date' => 'nullable|date',
            'pickup_time' => 'nullable|string|max:50',
            'vehicle' => 'nullable|string|in:Motor,Mobil,Truk',
            'notes' => 'nullable|string|max:300',
        ]);

        $order = \App\Models\Order::findOrFail($validated['order_id']);
        $result = ShippingService::requestCourierPickup($order, $validated);

        return response()->json($result);
    }
}
