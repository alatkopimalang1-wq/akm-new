<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\ProductVariant;
use App\Models\Setting;
use App\Services\ShippingService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class CheckoutController extends Controller
{
    /**
     * Process direct checkout on website.
     */
    public function process(Request $request): JsonResponse
    {
        $isPickup = ($request->input('fulfillment_type') === 'pickup')
            || ($request->input('shipping.courier_code') === 'pickup')
            || ($request->input('shipping.courier') === 'Ambil di Toko');

        $validated = $request->validate([
            'items' => 'required|array|min:1',
            'items.*.variant_id' => 'required|integer|exists:product_variants,id',
            'items.*.quantity' => 'required|integer|min:1|max:100',
            'items.*.price' => 'nullable|numeric|min:0',
            'items.*.grind_option' => 'nullable|string|max:100',
            'items.*.custom_notes' => 'nullable|string|max:2000',
            'fulfillment_type' => 'nullable|string|in:delivery,pickup',
            'customer.name' => 'required|string|max:100',
            'customer.phone' => 'required|string|max:30',
            'customer.email' => 'nullable|email|max:100',
            'customer.address' => $isPickup ? 'nullable|string|max:1000' : 'required|string|max:1000',
            'customer.notes' => 'nullable|string|max:500',
            'customer.province' => 'nullable|string|max:100',
            'customer.city' => 'nullable|string|max:100',
            'customer.city_id' => 'nullable|integer',
            'customer.district' => 'nullable|string|max:100',
            'customer.postal_code' => 'nullable|string|max:20',
            'customer.latitude' => 'nullable|numeric|between:-90,90',
            'customer.longitude' => 'nullable|numeric|between:-180,180',
            'shipping.courier' => 'nullable|string|max:100',
            'shipping.courier_code' => 'nullable|string|max:50',
            'shipping.service' => 'nullable|string|max:100',
            'shipping.etd' => 'nullable|string|max:50',
            'shipping.cost' => 'nullable|numeric|min:0',
            'payment_method' => 'required|string|in:qris,bank_transfer,whatsapp',
            'payment_channel' => 'nullable|string|max:50',
        ]);

        $settings = Setting::all()->pluck('value', 'key')->toArray();
        $freeShippingMin = (int) ($settings['free_shipping_min'] ?? 250000);
        $waNumber = $settings['whatsapp'] ?? '6285121930454';
        $storeName = $settings['pickup_store_name'] ?? 'Alat Kopi Malang (Tlogomas, Malang)';
        $storeAddress = $settings['pickup_store_address'] ?? ($settings['address'] ?? 'Ruko Tlogomas Square Kav. 34, Jl. Raya Tlogomas, Lowokwaru, Kota Malang, Jawa Timur 65144');

        $subtotal = 0;
        $totalWeightGrams = 0;
        $orderLines = [];

        foreach ($validated['items'] as $item) {
            $variant = ProductVariant::with('product')->findOrFail($item['variant_id']);

            if ($variant->stock_status === 'out_of_stock' || $variant->product->stock_status === 'out_of_stock') {
                return response()->json([
                    'message' => "Maaf, stok untuk produk '{$variant->product->name}' ({$variant->label}) sedang habis (Sold Out) dan tidak dapat dibeli.",
                    'errors' => [
                        'items' => ["Produk '{$variant->product->name}' ({$variant->label}) habis terjual."],
                    ],
                ], 422);
            }

            $qty = $item['quantity'];
            $unitPrice = (($variant->product->slug === 'byob' || $variant->product->is_custom_bundle) && isset($item['price']) && is_numeric($item['price']))
                ? (float) $item['price']
                : (float) $variant->price;
            $lineTotal = $unitPrice * $qty;
            $subtotal += $lineTotal;
            $totalWeightGrams += ($variant->weight_grams ?: 200) * $qty;

            $orderLines[] = [
                'product_id' => $variant->product_id,
                'product_variant_id' => $variant->id,
                'product_name' => $variant->product->name,
                'variant_label' => $variant->label,
                'grind_option' => $item['grind_option'] ?? 'Biji Utuh (Whole Bean)',
                'custom_notes' => $item['custom_notes'] ?? null,
                'price' => $unitPrice,
                'quantity' => $qty,
                'subtotal' => $lineTotal,
            ];
        }

        // Determine shipping cost and courier details based on fulfillment type
        if ($isPickup) {
            $shippingCost = 0.0;
            $courierName = 'Ambil di Toko';
            $courierService = 'Self Pick Up';
            $courierEtd = 'Siap Diambil di Roastery';
            $customerAddress = !empty($validated['customer']['address'])
                ? $validated['customer']['address']
                : "Ambil di Toko: {$storeName} ({$storeAddress})";
            $shippingProvince = 'Jawa Timur';
            $shippingCity = 'Kota Malang';
            $shippingDistrict = 'Lowokwaru';
            $shippingPostalCode = '65144';
        } else {
            if (isset($validated['shipping']['cost'])) {
                $shippingCost = (float) $validated['shipping']['cost'];
            } else {
                $shippingCost = $subtotal >= $freeShippingMin ? 0 : 15000;
            }

            $courierName = $validated['shipping']['courier'] ?? ($subtotal >= $freeShippingMin ? 'J&T Express' : 'Reguler Ekspedisi');
            $courierService = $validated['shipping']['service'] ?? ($subtotal >= $freeShippingMin ? 'EZ (Promo Gratis Ongkir)' : 'REG');
            $courierEtd = $validated['shipping']['etd'] ?? '1-3 hari';
            $customerAddress = $validated['customer']['address'] ?? '-';
            if (! empty($validated['customer']['latitude']) && ! empty($validated['customer']['longitude'])) {
                $cLat = $validated['customer']['latitude'];
                $cLng = $validated['customer']['longitude'];
                $customerAddress .= " (📍 Titik GPS: https://maps.google.com/?q={$cLat},{$cLng})";
            }
            $shippingProvince = $validated['customer']['province'] ?? null;
            $shippingCity = $validated['customer']['city'] ?? null;
            $shippingDistrict = $validated['customer']['district'] ?? null;
            $shippingPostalCode = $validated['customer']['postal_code'] ?? null;
        }

        // Generate unique code for bank transfers (e.g. 100 - 999) to easily verify mutations
        $uniqueCode = 0;
        if ($validated['payment_method'] === 'bank_transfer') {
            $uniqueCode = rand(101, 899);
        }

        $totalAmount = $subtotal + $shippingCost + $uniqueCode;

        // Payment Channel Info Snapshot
        $channel = $validated['payment_channel'] ?? ($validated['payment_method'] === 'qris' ? 'qris' : 'bca');

        $configuredBanks = $settings['payment_banks'] ?? [
            [
                'bank_code' => 'bca',
                'bank_name' => 'Bank BCA',
                'account_number' => $settings['payment_bank_bca_number'] ?? '011-829-9102',
                'account_holder' => $settings['payment_bank_bca_holder'] ?? 'ALAT KOPI MALANG',
                'branch_info' => 'KCU Malang Kawi',
            ],
            [
                'bank_code' => 'mandiri',
                'bank_name' => 'Bank Mandiri',
                'account_number' => $settings['payment_bank_mandiri_number'] ?? '144-00-98213-901',
                'account_holder' => $settings['payment_bank_mandiri_holder'] ?? 'ALAT KOPI MALANG',
                'branch_info' => 'KCP Malang Sutoyo',
            ],
            [
                'bank_code' => 'bri',
                'bank_name' => 'Bank BRI',
                'account_number' => $settings['payment_bank_bri_number'] ?? '0051-01-00291-532',
                'account_holder' => $settings['payment_bank_bri_holder'] ?? 'ALAT KOPI MALANG',
                'branch_info' => 'KC Malang Martadinata',
            ],
        ];

        $matchedBankInfo = null;
        if (is_array($configuredBanks)) {
            foreach ($configuredBanks as $b) {
                if (strtolower($b['bank_code'] ?? '') === strtolower($channel) || strtolower($b['bank_name'] ?? '') === strtolower($channel)) {
                    $matchedBankInfo = [
                        'bank' => $b['bank_name'],
                        'number' => $b['account_number'],
                        'holder' => $b['account_holder'],
                        'branch' => $b['branch_info'] ?? null,
                    ];
                    break;
                }
            }

            if (! $matchedBankInfo && ! empty($configuredBanks)) {
                $first = $configuredBanks[0];
                $matchedBankInfo = [
                    'bank' => $first['bank_name'] ?? 'Bank BCA',
                    'number' => $first['account_number'] ?? '011-829-9102',
                    'holder' => $first['account_holder'] ?? 'ALAT KOPI MALANG',
                    'branch' => $first['branch_info'] ?? null,
                ];
            }
        }

        $paymentDetails = [
            'method' => $validated['payment_method'],
            'channel' => $channel,
            'qris_merchant' => $settings['payment_qris_merchant_name'] ?? 'ALAT KOPI MALANG',
            'qris_nmid' => $settings['payment_qris_nmid'] ?? 'ID1020038829102',
            'bank_info' => $matchedBankInfo,
        ];

        $order = DB::transaction(function () use (
            $validated,
            $customerAddress,
            $shippingProvince,
            $shippingCity,
            $shippingDistrict,
            $shippingPostalCode,
            $subtotal,
            $shippingCost,
            $courierName,
            $courierService,
            $courierEtd,
            $totalWeightGrams,
            $uniqueCode,
            $totalAmount,
            $channel,
            $paymentDetails,
            $orderLines
        ) {
            $order = Order::create([
                'user_id' => auth()->id(),
                'order_number' => Order::generateOrderNumber(),
                'customer_name' => $validated['customer']['name'],
                'customer_phone' => $validated['customer']['phone'],
                'customer_email' => $validated['customer']['email'] ?? null,
                'customer_address' => $customerAddress,
                'customer_notes' => $validated['customer']['notes'] ?? null,
                'shipping_province' => $shippingProvince,
                'shipping_city' => $shippingCity,
                'shipping_district' => $shippingDistrict,
                'shipping_postal_code' => $shippingPostalCode,
                'shipping_courier' => $courierName,
                'shipping_service' => $courierService,
                'shipping_etd' => $courierEtd,
                'shipping_cost' => $shippingCost,
                'total_weight_grams' => $totalWeightGrams,
                'payment_method' => $validated['payment_method'],
                'payment_channel' => $channel,
                'payment_status' => 'pending',
                'status' => 'pending',
                'subtotal' => $subtotal,
                'unique_code' => $uniqueCode,
                'total_amount' => $totalAmount,
                'payment_details' => $paymentDetails,
            ]);

            foreach ($orderLines as $line) {
                $order->items()->create($line);
            }

            return $order;
        });

        // WhatsApp redirect fallback or message link
        $waMessage = "Halo Alat Kopi Malang! ☕\n";
        $waMessage .= "Saya telah membuat pesanan di website Alat Kopi Malang.co.id:\n\n";
        $waMessage .= "🔖 *No. Pesanan:* #{$order->order_number}\n";
        $waMessage .= "👤 *Pemesan:* {$order->customer_name} ({$order->customer_phone})\n";
        if ($isPickup) {
            $waMessage .= "🏪 *Metode:* Ambil di Toko (Self Pick Up)\n";
            $waMessage .= "📍 *Lokasi Ambil:* {$storeName}\n";
            if (!empty($order->customer_notes)) {
                $waMessage .= "📝 *Catatan Pengambilan:* {$order->customer_notes}\n";
            }
        } else {
            $waMessage .= "📍 *Alamat:* {$order->customer_address}\n";
            $waMessage .= "🚚 *Kurir:* {$order->shipping_courier} ({$order->shipping_service})\n";
        }
        $waMessage .= "💳 *Metode Bayar:* " . strtoupper($order->payment_method) . ($order->payment_channel ? " ({$order->payment_channel})" : "") . "\n";
        $waMessage .= "💰 *Total Tagihan:* Rp " . number_format($order->total_amount, 0, ',', '.') . "\n\n";
        $waMessage .= "☕ *Rincian Kopi Dipesan:*\n";
        foreach ($orderLines as $idx => $line) {
            $num = $idx + 1;
            $waMessage .= "{$num}. {$line['product_name']} ({$line['variant_label']} · {$line['grind_option']}) x{$line['quantity']}\n";
            if (!empty($line['custom_notes'])) {
                $waMessage .= "   ↳ *{$line['custom_notes']}*\n";
            }
        }
        $waMessage .= "\nLihat detail pesanan & invoice: " . url("/pesanan/{$order->order_number}") . "\n";
        $waMessage .= "Terima kasih!";

        $waUrl = "https://wa.me/{$waNumber}?text=" . rawurlencode($waMessage);

        session()->flash('order_placed_token', $order->order_number);

        return response()->json([
            'success' => true,
            'order_number' => $order->order_number,
            'order_id' => $order->id,
            'total_amount' => $order->total_amount,
            'redirect_url' => route('orders.show', ['orderNumber' => $order->order_number]),
            'wa_url' => $waUrl,
        ]);
    }

    /**
     * Show order payment instructions and status page.
     */
    public function show(string $orderNumber): Response
    {
        $order = Order::with(['items.product', 'items.variant'])
            ->where('order_number', $orderNumber)
            ->firstOrFail();

        $settings = Setting::all()->pluck('value', 'key')->toArray();

        $qrisImageUrl = !empty($settings['payment_qris_image'])
            ? (str_starts_with($settings['payment_qris_image'], 'http') ? $settings['payment_qris_image'] : '/storage/' . ltrim($settings['payment_qris_image'], '/'))
            : '/brand/qris-Alat Kopi Malang.svg';

        $waNumber = $settings['whatsapp'] ?? '6285121930454';
        $waConfirmText = "Halo Alat Kopi Malang! Saya sudah melakukan pembayaran untuk Pesanan #{$order->order_number} sebesar Rp " . number_format($order->total_amount, 0, ',', '.') . ". Mohon dicek dan diproses ya. Terima kasih!";
        $waConfirmUrl = "https://wa.me/{$waNumber}?text=" . rawurlencode($waConfirmText);

        $configuredBanks = $settings['payment_banks'] ?? [
            [
                'bank_code' => 'bca',
                'bank_name' => 'Bank BCA',
                'account_number' => $settings['payment_bank_bca_number'] ?? '011-829-9102',
                'account_holder' => $settings['payment_bank_bca_holder'] ?? 'ALAT KOPI MALANG',
                'branch_info' => 'KCU Malang Kawi',
            ],
            [
                'bank_code' => 'mandiri',
                'bank_name' => 'Bank Mandiri',
                'account_number' => $settings['payment_bank_mandiri_number'] ?? '144-00-98213-901',
                'account_holder' => $settings['payment_bank_mandiri_holder'] ?? 'ALAT KOPI MALANG',
                'branch_info' => 'KCP Malang Sutoyo',
            ],
            [
                'bank_code' => 'bri',
                'bank_name' => 'Bank BRI',
                'account_number' => $settings['payment_bank_bri_number'] ?? '0051-01-00291-532',
                'account_holder' => $settings['payment_bank_bri_holder'] ?? 'ALAT KOPI MALANG',
                'branch_info' => 'KC Malang Martadinata',
            ],
        ];

        return Inertia::render('order/show', [
            'order' => [
                'id' => $order->id,
                'order_number' => $order->order_number,
                'customer_name' => $order->customer_name,
                'customer_phone' => $order->customer_phone,
                'customer_email' => $order->customer_email,
                'customer_address' => $order->customer_address,
                'customer_notes' => $order->customer_notes,
                'payment_method' => $order->payment_method,
                'payment_method_label' => $order->payment_method_label,
                'payment_channel' => $order->payment_channel,
                'payment_status' => $order->payment_status,
                'payment_status_label' => $order->payment_status_label,
                'status' => $order->status,
                'status_label' => $order->status_label,
                'subtotal' => (float) $order->subtotal,
                'shipping_cost' => (float) $order->shipping_cost,
                'shipping_courier' => $order->shipping_courier,
                'shipping_service' => $order->shipping_service,
                'shipping_etd' => $order->shipping_etd,
                'shipping_city' => $order->shipping_city,
                'shipping_province' => $order->shipping_province,
                'total_weight_grams' => (int) ($order->total_weight_grams ?: 200),
                'tracking_number' => $order->tracking_number,
                'unique_code' => (int) $order->unique_code,
                'total_amount' => (float) $order->total_amount,
                'is_newly_placed' => session('order_placed_token') === $order->order_number,
                'payment_proof' => $order->payment_proof ? (str_starts_with($order->payment_proof, 'http') ? $order->payment_proof : '/storage/' . ltrim($order->payment_proof, '/')) : null,
                'payment_details' => $order->payment_details,
                'created_at' => $order->created_at->format('d M Y, H:i'),
                'paid_at' => $order->paid_at?->format('d M Y, H:i'),
                'items' => $order->items->map(fn ($item) => [
                    'id' => $item->id,
                    'product_id' => $item->product_id,
                    'variant_id' => $item->product_variant_id,
                    'sku' => $item->variant?->sku ?? ($item->product?->slug ?? (string) $item->product_id),
                    'product_name' => $item->product_name,
                    'variant_label' => $item->variant_label,
                    'grind_option' => $item->grind_option,
                    'custom_notes' => $item->custom_notes,
                    'price' => (float) $item->price,
                    'quantity' => $item->quantity,
                    'subtotal' => (float) $item->subtotal,
                    'image' => $item->variant?->image_url ?? $item->product?->primaryImage?->path,
                ]),
            ],
            'paymentConfig' => [
                'qris_image_url' => $qrisImageUrl,
                'qris_merchant' => $settings['payment_qris_merchant_name'] ?? 'ALAT KOPI MALANG',
                'qris_nmid' => $settings['payment_qris_nmid'] ?? 'ID1020038829102',
                'whatsapp_url' => $waConfirmUrl,
                'banks' => $configuredBanks,
            ],
            'pickupConfig' => [
                'store_name' => $settings['pickup_store_name'] ?? 'Alat Kopi Malang (Tlogomas, Malang)',
                'store_address' => $settings['pickup_store_address'] ?? ($settings['address'] ?? 'Ruko Tlogomas Square Kav. 34, Jl. Raya Tlogomas, Lowokwaru, Kota Malang, Jawa Timur 65144'),
                'store_hours' => $settings['pickup_store_hours'] ?? ($settings['hours'] ?? 'Buka setiap hari: 09.00 - 23.00 WIB'),
                'notes' => $settings['pickup_notes'] ?? 'Pesanan dapat diambil di kasir Alat Kopi Malang dengan menunjukkan Nomor Pesanan.',
                'maps_url' => $settings['maps_url'] ?? 'https://maps.app.goo.gl/PMuxaEtsbEvC4APy7',
            ],
        ]);
    }

    /**
     * Show print-ready official invoice for the order.
     */
    public function invoice(string $orderNumber): Response
    {
        $order = Order::with(['items.product', 'items.variant'])
            ->where('order_number', $orderNumber)
            ->firstOrFail();

        $settings = Setting::all()->pluck('value', 'key')->toArray();

        return Inertia::render('order/invoice', [
            'order' => [
                'id' => $order->id,
                'order_number' => $order->order_number,
                'customer_name' => $order->customer_name,
                'customer_phone' => $order->customer_phone,
                'customer_email' => $order->customer_email,
                'customer_address' => $order->customer_address,
                'customer_notes' => $order->customer_notes,
                'payment_method' => $order->payment_method,
                'payment_method_label' => match ($order->payment_method) {
                    'qris' => 'QRIS Toko (Instant Scan)',
                    'bank_transfer' => 'Transfer Bank ' . strtoupper((string) ($order->payment_channel ?? 'BCA')),
                    'whatsapp' => 'WhatsApp Manual Order',
                    default => ucfirst($order->payment_method),
                },
                'payment_channel' => $order->payment_channel,
                'payment_status' => $order->payment_status,
                'payment_status_label' => match ($order->payment_status) {
                    'paid' => 'Lunas',
                    'verifying' => 'Menunggu Verifikasi',
                    'cancelled' => 'Dibatalkan',
                    default => 'Menunggu Pembayaran',
                },
                'status' => $order->status,
                'status_label' => match ($order->status) {
                    'processing' => 'Diproses Roaster',
                    'ready_for_pickup' => 'Siap Diambil di Roastery',
                    'shipped' => 'Dalam Pengiriman Kurir',
                    'completed' => 'Selesai',
                    'cancelled' => 'Dibatalkan',
                    default => 'Menunggu Konfirmasi',
                },
                'subtotal' => (float) $order->subtotal,
                'shipping_cost' => (float) $order->shipping_cost,
                'unique_code' => (int) $order->unique_code,
                'total_amount' => (float) $order->total_amount,
                'shipping_courier' => $order->shipping_courier,
                'shipping_service' => $order->shipping_service,
                'shipping_etd' => $order->shipping_etd,
                'tracking_number' => $order->tracking_number,
                'total_weight_grams' => (int) ($order->total_weight_grams ?: 0),
                'created_at' => $order->created_at->format('d M Y, H:i'),
                'paid_at' => $order->paid_at?->format('d M Y, H:i'),
                'items' => $order->items->map(fn ($item) => [
                    'id' => $item->id,
                    'product_name' => $item->product_name,
                    'variant_label' => $item->variant_label,
                    'grind_option' => $item->grind_option,
                    'custom_notes' => $item->custom_notes,
                    'price' => (float) $item->price,
                    'quantity' => $item->quantity,
                    'subtotal' => (float) $item->subtotal,
                ]),
            ],
            'settings' => [
                'site_name' => $settings['site_name'] ?? 'Alat Kopi Malang',
                'address' => $settings['address'] ?? 'Ruko Tlogomas Square Kav. 34, Jl. Raya Tlogomas, Lowokwaru, Kota Malang, Jawa Timur 65144',
                'phone' => $settings['phone'] ?? $settings['whatsapp'] ?? '+6285121930454',
                'email' => $settings['email'] ?? 'info@alatkopimalang.co.id',
                'pickup_store_name' => $settings['pickup_store_name'] ?? 'Alat Kopi Malang (Tlogomas, Malang)',
                'pickup_store_address' => $settings['pickup_store_address'] ?? ($settings['address'] ?? 'Ruko Tlogomas Square Kav. 34, Jl. Raya Tlogomas, Lowokwaru, Kota Malang, Jawa Timur 65144'),
                'pickup_store_hours' => $settings['pickup_store_hours'] ?? ($settings['hours'] ?? 'Buka setiap hari: 09.00 - 23.00 WIB'),
            ],
        ]);
    }

    /**
     * Show print-ready thermal shipping label (100x150 mm) with Air Waybill (AWB) barcode.
     */
    public function shippingLabel(string $orderNumber): \Illuminate\Contracts\View\View
    {
        $order = Order::with(['items.product', 'items.variant'])
            ->where('order_number', $orderNumber)
            ->firstOrFail();

        $labelData = ShippingService::getPrintableLabelData($order);

        return view('shipping.label', $labelData);
    }

    /**
     * Upload proof of payment.
     */
    public function uploadProof(Request $request, string $orderNumber): RedirectResponse
    {
        $order = Order::where('order_number', $orderNumber)->firstOrFail();

        $request->validate([
            'payment_proof' => 'required|image|mimes:jpeg,png,jpg,webp|max:5120',
        ]);

        $path = $request->file('payment_proof')->store('payment-proofs', 'public');

        $order->update([
            'payment_proof' => $path,
            'payment_status' => 'verifying',
        ]);

        return back()->with('success', 'Bukti pembayaran berhasil diunggah! Tim roastery kami akan segera memverifikasi pesanan Anda.');
    }

    /**
     * Order lookup / track order page.
     */
    public function track(Request $request): Response|RedirectResponse
    {
        $orderNumber = $request->input('order_number');

        if (! empty($orderNumber)) {
            $cleanNumber = trim(strtoupper($orderNumber));
            $order = Order::where('order_number', $cleanNumber)->first();

            if ($order) {
                return redirect()->route('orders.show', ['orderNumber' => $order->order_number]);
            }

            return Inertia::render('order/track', [
                'error' => "Nomor pesanan '{$cleanNumber}' tidak ditemukan. Mohon periksa kembali nomor pesanan Anda.",
            ]);
        }

        return Inertia::render('order/track');
    }
}

