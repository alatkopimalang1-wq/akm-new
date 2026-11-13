<?php

namespace App\Http\Controllers;

use App\Models\ProductVariant;
use App\Models\Setting;
use App\Services\ShippingService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CartController extends Controller
{
    public function index(): Response
    {
        $settings = Setting::all()->pluck('value', 'key')->toArray();

        $qrisImageUrl = !empty($settings['payment_qris_image'])
            ? (str_starts_with($settings['payment_qris_image'], 'http') ? $settings['payment_qris_image'] : '/storage/' . ltrim($settings['payment_qris_image'], '/'))
            : '/brand/qris-Alat Kopi Malang.svg';

        $defaultBanks = [
            [
                'bank_code' => 'bca',
                'bank_name' => 'Bank BCA',
                'account_number' => $settings['payment_bank_bca_number'] ?? '011-829-9102',
                'account_holder' => $settings['payment_bank_bca_holder'] ?? 'ALAT KOPI MALANG',
                'branch_info' => 'KCU Malang Kawi',
                'is_active' => true,
            ],
            [
                'bank_code' => 'mandiri',
                'bank_name' => 'Bank Mandiri',
                'account_number' => $settings['payment_bank_mandiri_number'] ?? '144-00-98213-901',
                'account_holder' => $settings['payment_bank_mandiri_holder'] ?? 'ALAT KOPI MALANG',
                'branch_info' => 'KCP Malang Sutoyo',
                'is_active' => true,
            ],
            [
                'bank_code' => 'bri',
                'bank_name' => 'Bank BRI',
                'account_number' => $settings['payment_bank_bri_number'] ?? '0051-01-00291-532',
                'account_holder' => $settings['payment_bank_bri_holder'] ?? 'ALAT KOPI MALANG',
                'branch_info' => 'KC Malang Martadinata',
                'is_active' => true,
            ],
        ];

        $configuredBanks = $settings['payment_banks'] ?? $defaultBanks;
        if (! is_array($configuredBanks)) {
            $configuredBanks = $defaultBanks;
        }

        $activeBanks = array_values(array_filter($configuredBanks, function ($b) {
            return ($b['is_active'] ?? true) === true;
        }));

        $paymentSettings = [
            'qris' => [
                'enabled' => (bool) ($settings['payment_qris_enabled'] ?? true),
                'merchant_name' => $settings['payment_qris_merchant_name'] ?? 'ALAT KOPI MALANG',
                'nmid' => $settings['payment_qris_nmid'] ?? 'ID1020038829102',
                'image_url' => $qrisImageUrl,
            ],
            'banks' => $activeBanks,
            'bank_enabled' => (bool) ($settings['payment_bank_enabled'] ?? true),
            'free_shipping_min' => (int) ($settings['free_shipping_min'] ?? 250000),
            'shipping_flat_rate' => 15000,
            'whatsapp' => $settings['whatsapp'] ?? '6285121930454',
            'instructions' => $settings['payment_instructions'] ?? 'Silakan lakukan pembayaran sesuai nominal tepat. Pesanan akan otomatis diproses setelah pembayaran terverifikasi.',
        ];

        $pickupSettings = [
            'enabled' => (bool) ($settings['pickup_in_store_enabled'] ?? true),
            'store_name' => $settings['pickup_store_name'] ?? 'Alat Kopi Malang (Tlogomas, Malang)',
            'store_address' => $settings['pickup_store_address'] ?? ($settings['address'] ?? 'Ruko Tlogomas Square Kav. 34, Jl. Raya Tlogomas, Lowokwaru, Kota Malang, Jawa Timur 65144'),
            'store_hours' => $settings['pickup_store_hours'] ?? ($settings['hours'] ?? 'Buka setiap hari: 09.00 - 23.00 WIB'),
            'notes' => $settings['pickup_notes'] ?? 'Pesanan dapat diambil langsung di kasir Alat Kopi Malang dengan menunjukkan Nomor Pesanan setelah status pesanan Siap.',
            'maps_url' => $settings['maps_url'] ?? 'https://maps.app.goo.gl/PMuxaEtsbEvC4APy7',
        ];

        $shippingConfig = ShippingService::getConfig();
        $originProvinceId = (int) ($shippingConfig['origin_province_id'] ?: 18);
        $originCityId = (int) ($shippingConfig['origin_city_id'] ?: 391);
        $originSubdistrictId = (int) ($shippingConfig['origin_subdistrict_id'] ?: 3896);

        return Inertia::render('cart', [
            'paymentSettings' => $paymentSettings,
            'pickupSettings' => $pickupSettings,
            'deliverySettings' => [
                'enabled' => (bool) ($settings['shipping_delivery_enabled'] ?? true),
                'gosend_enabled' => in_array('gosend', $shippingConfig['couriers'] ?? []),
            ],
            'provinces' => ShippingService::getProvinces(),
            'initialCities' => ShippingService::getCities($originProvinceId),
            'initialSubdistricts' => ShippingService::getSubdistricts($originCityId),
            'origin' => [
                'province_id' => $originProvinceId,
                'city_id' => $originCityId,
                'subdistrict_id' => $originSubdistrictId,
                'city' => $shippingConfig['origin_city_name'],
                'province' => $shippingConfig['origin_province_name'],
                'postal_code' => $shippingConfig['origin_postal_code'],
                'latitude' => $shippingConfig['origin_latitude'],
                'longitude' => $shippingConfig['origin_longitude'],
            ],
        ]);
    }

    public function quote(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'items' => 'required|array|min:1',
            'items.*.variant_id' => 'required|integer|exists:product_variants,id',
            'items.*.quantity' => 'required|integer|min:1|max:50',
            'items.*.grind_option' => 'nullable|string|max:100',
            'items.*.custom_notes' => 'nullable|string|max:500',
            'customer.name' => 'required|string|max:100',
            'customer.phone' => 'required|string|max:30',
            'customer.address' => 'required|string|max:500',
            'customer.notes' => 'nullable|string|max:500',
        ]);

        $subtotal = 0;
        $orderLines = [];

        foreach ($validated['items'] as $item) {
            $variant = ProductVariant::with('product')->findOrFail($item['variant_id']);
            $qty = $item['quantity'];
            $lineTotal = $variant->price * $qty;
            $subtotal += $lineTotal;

            $grind = $item['grind_option'] ?? 'Biji Utuh (Whole Bean)';
            $customNotes = $item['custom_notes'] ?? null;

            $orderLines[] = [
                'product_name' => $variant->product->name,
                'variant_label' => $variant->label,
                'grind_option' => $grind,
                'custom_notes' => $customNotes,
                'quantity' => $qty,
                'price' => $variant->price,
                'total' => $lineTotal,
            ];
        }

        // WhatsApp number
        $waNumber = Setting::get('whatsapp', '6285121930454');
        $cust = $validated['customer'];

        // Build message
        $linesText = "";
        foreach ($orderLines as $i => $line) {
            $idx = $i + 1;
            $formattedPrice = "Rp " . number_format($line['total'], 0, ',', '.');
            $linesText .= "{$idx}. *{$line['product_name']}* ({$line['variant_label']})\n";
            if (! empty($line['custom_notes'])) {
                $linesText .= "   Racikan: {$line['custom_notes']}\n";
            }
            $linesText .= "   Gilingan: {$line['grind_option']}\n";
            $linesText .= "   Qty: {$line['quantity']}x — {$formattedPrice}\n\n";
        }

        $formattedSubtotal = "Rp " . number_format($subtotal, 0, ',', '.');

        $message = "Halo Alat Kopi Malang! ☕\n";
        $message .= "Saya ingin melakukan pemesanan melalui website Alat Kopi Malang.test:\n\n";
        $message .= "📋 *DETAIL PESANAN:*\n";
        $message .= $linesText;
        $message .= "💰 *SUBTOTAL:* {$formattedSubtotal}\n\n";
        $message .= "👤 *DATA PEMESAN:*\n";
        $message .= "Nama: {$cust['name']}\n";
        $message .= "WhatsApp: {$cust['phone']}\n";
        $message .= "Alamat: {$cust['address']}\n";
        if (! empty($cust['notes'])) {
            $message .= "Catatan: {$cust['notes']}\n";
        }
        $message .= "\nMohon konfirmasi ketersediaan stok & ongkos kirim. Terima kasih!";

        $encodedText = rawurlencode($message);
        $waUrl = "https://wa.me/{$waNumber}?text={$encodedText}";

        return response()->json([
            'success' => true,
            'wa_url' => $waUrl,
            'subtotal' => $subtotal,
            'items' => $orderLines,
        ]);
    }
}
