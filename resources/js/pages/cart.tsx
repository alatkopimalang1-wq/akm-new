import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    Building2,
    Check,
    CheckCircle2,
    ChevronDown,
    ChevronRight,
    CreditCard,
    ExternalLink,
    Lock,
    MapPin,
    MessageCircle,
    Minus,
    Package,
    Plus,
    QrCode,
    RefreshCw,
    ShieldCheck,
    ShoppingBag,
    SlidersHorizontal,
    Sparkles,
    Store,
    Trash2,
    Truck,
} from 'lucide-react';
import { PublicLayout } from '@/layouts/public-layout';
import { useCart } from '@/context/cart-context';
import { formatRupiah } from '@/lib/trans';
import { ShippingMapPicker } from '@/components/shipping-map-picker';
import { getProductContentId, trackInitiateCheckout } from '@/lib/meta-pixel';

export interface BankAccountItem {
    bank_code: string;
    bank_name: string;
    account_number: string;
    account_holder: string;
    branch_info?: string | null;
    bank_logo?: string | null;
    is_active?: boolean;
}

export interface PickupSettingsProps {
    enabled: boolean;
    store_name: string;
    store_address: string;
    store_hours: string;
    notes: string;
    maps_url: string;
}

interface PaymentSettingsProps {
    qris: {
        enabled: boolean;
        merchant_name: string;
        nmid: string;
        image_url: string;
    };
    banks: BankAccountItem[];
    bank_enabled: boolean;
    free_shipping_min: number;
    shipping_flat_rate: number;
    whatsapp: string;
    instructions: string;
}

interface ProvinceItem {
    id: number;
    name: string;
}

interface CityItem {
    id: number;
    province_id: number;
    type: string;
    name: string;
    postal_code: string;
}

interface SubdistrictItem {
    id: number;
    city_id: number;
    name: string;
}

interface CourierRate {
    courier: string;
    courier_code: string;
    service: string;
    description: string;
    cost: number;
    original_cost: number;
    etd: string;
    is_free: boolean;
    badge?: string | null;
}

interface CartPageProps {
    paymentSettings?: PaymentSettingsProps;
    pickupSettings?: PickupSettingsProps;
    deliverySettings?: {
        enabled: boolean;
        gosend_enabled: boolean;
    };
    provinces?: ProvinceItem[];
    initialCities?: CityItem[];
    initialSubdistricts?: SubdistrictItem[];
    origin?: {
        province_id?: number;
        city_id?: number;
        subdistrict_id?: number;
        city: string;
        province: string;
        postal_code: string;
        latitude?: number;
        longitude?: number;
    };
}

export default function CartPage({
    paymentSettings,
    pickupSettings = {
        enabled: true,
        store_name: 'Alat Kopi Malang',
        store_address: 'Malang, Jawa Timur',
        store_hours: 'Buka setiap hari: 09.00 - 21.00 WIB',
        notes: 'Pesanan dapat diambil langsung di kasir Alat Kopi Malang dengan menunjukkan Nomor Pesanan setelah status pesanan Siap.',
        maps_url: 'https://maps.app.goo.gl/PMuxaEtsbEvC4APy7',
    },
    deliverySettings = {
        enabled: true,
        gosend_enabled: true,
    },
    provinces = [],
    initialCities = [],
    initialSubdistricts = [],
    origin = { province_id: 18, city_id: 391, subdistrict_id: 3896, city: 'Kota Malang', province: 'Jawa Timur', postal_code: '65144', latitude: -7.9327, longitude: 112.6037 },
}: CartPageProps) {
    const { items, itemCount, subtotal, updateQuantity, removeItem, clearCart } = useCart();

    // Track Meta Pixel InitiateCheckout on checkout page load
    const hasFiredInitiateCheckout = useRef(false);
    useEffect(() => {
        if (items.length > 0 && !hasFiredInitiateCheckout.current) {
            hasFiredInitiateCheckout.current = true;
            try {
                const contentIds = items.map((i) => getProductContentId(i.product, i.variant)).filter(Boolean);
                trackInitiateCheckout({
                    content_ids: contentIds,
                    content_type: 'product',
                    value: Number(subtotal),
                    currency: 'IDR',
                    num_items: itemCount,
                });
            } catch (e) {
                console.error('Meta Pixel InitiateCheckout error', e);
            }
        }
    }, [items.length, subtotal, itemCount]);

    // Fulfillment method: delivery or store pickup
    const [fulfillmentType, setFulfillmentType] = useState<'delivery' | 'pickup'>(() => {
        return deliverySettings?.enabled !== false ? 'delivery' : 'pickup';
    });
    const isPickup = fulfillmentType === 'pickup';

    // Customer form state
    const [customerName, setCustomerName] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [customerEmail, setCustomerEmail] = useState('');
    const [customerAddress, setCustomerAddress] = useState('');
    const [customerNotes, setCustomerNotes] = useState('');

    // Delivery pinpoint coordinates for GoSend / Instant delivery
    const [destLat, setDestLat] = useState<number | null>(null);
    const [destLng, setDestLng] = useState<number | null>(null);
    const [roadDistanceKm, setRoadDistanceKm] = useState<number | null>(null);

    // Location state (Default: Jawa Timur [18] -> Kota Malang [391] -> Lowokwaru [3896])
    const [selectedProvinceId, setSelectedProvinceId] = useState<number>(origin?.province_id ?? 18);
    const [citiesList, setCitiesList] = useState<CityItem[]>(initialCities);
    const [selectedCityId, setSelectedCityId] = useState<number>(origin?.city_id ?? 391);
    const [subdistrictsList, setSubdistrictsList] = useState<SubdistrictItem[]>(initialSubdistricts);
    const [selectedSubdistrictId, setSelectedSubdistrictId] = useState<number | null>(
        origin?.subdistrict_id ?? initialSubdistricts[0]?.id ?? 3896
    );
    const [postalCode, setPostalCode] = useState(origin?.postal_code || '65144');
    const [district, setDistrict] = useState(() => {
        const defaultSub = initialSubdistricts.find((s) => s.id === (origin?.subdistrict_id ?? 3896));
        return defaultSub?.name ?? initialSubdistricts[0]?.name ?? 'LOWOKWARU';
    });

    // Couriers state
    const [courierRates, setCourierRates] = useState<CourierRate[]>([]);
    const [selectedCourierIndex, setSelectedCourierIndex] = useState<number>(0);
    const [isLoadingRates, setIsLoadingRates] = useState(false);

    // Payment method state
    const banksList = useMemo(() => {
        return Array.isArray(paymentSettings?.banks) ? paymentSettings.banks : [];
    }, [paymentSettings?.banks]);

    const [paymentMethod, setPaymentMethod] = useState<'qris' | 'bank_transfer' | 'whatsapp'>('qris');
    const [selectedBank, setSelectedBank] = useState<string>(() => {
        return banksList[0]?.bank_code || 'bca';
    });

    useEffect(() => {
        if (banksList.length > 0 && !banksList.some((b) => b.bank_code.toLowerCase() === selectedBank.toLowerCase())) {
            setSelectedBank(banksList[0].bank_code);
        }
    }, [banksList]);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    // Calculate total weight in grams
    const totalWeightGrams = useMemo(() => {
        return items.reduce((acc, curr) => {
            const variantWeight = curr.variant?.weight_grams || 200;
            return acc + variantWeight * curr.quantity;
        }, 0);
    }, [items]);

    // Format weight text: e.g. "400g (Dihitung 1 kg)"
    const chargeableWeightKg = Math.max(1, Math.ceil(totalWeightGrams / 1000));

    // When province changes, fetch cities for that province
    useEffect(() => {
        if (!selectedProvinceId) return;

        let isMounted = true;
        const fetchCities = async () => {
            try {
                const res = await fetch(`/api/shipping/cities?province_id=${selectedProvinceId}`);
                const data = await res.json();
                if (isMounted && data.success && data.data.length > 0) {
                    setCitiesList(data.data);
                    setSelectedCityId((prevCityId) => {
                        const existingCity = data.data.find((c: CityItem) => c.id === prevCityId);
                        const chosenCity = existingCity || data.data[0];
                        if (chosenCity?.postal_code) {
                            setPostalCode(chosenCity.postal_code);
                        }
                        return chosenCity.id;
                    });
                }
            } catch (err) {
                console.error('Error fetching cities', err);
            }
        };

        fetchCities();
        return () => {
            isMounted = false;
        };
    }, [selectedProvinceId]);

    // When city changes, update postal code & fetch subdistricts
    const handleCityChange = (cityId: number) => {
        setSelectedCityId(cityId);
        const found = citiesList.find((c) => c.id === cityId);
        if (found && found.postal_code) {
            setPostalCode(found.postal_code);
        }
    };

    useEffect(() => {
        if (!selectedCityId) return;

        let isMounted = true;
        const fetchSubdistricts = async () => {
            try {
                const res = await fetch(`/api/shipping/subdistricts?city_id=${selectedCityId}`);
                const data = await res.json();
                if (isMounted && data.success && Array.isArray(data.data)) {
                    setSubdistrictsList(data.data);
                    if (data.data.length > 0) {
                        setSelectedSubdistrictId((prevSubId) => {
                            const existingSub = data.data.find((s: SubdistrictItem) => s.id === prevSubId);
                            const chosenSub = existingSub || data.data[0];
                            setDistrict(chosenSub.name);
                            return chosenSub.id;
                        });
                    } else {
                        setSelectedSubdistrictId(null);
                    }
                }
            } catch (err) {
                console.error('Error fetching subdistricts', err);
            }
        };

        fetchSubdistricts();
        return () => {
            isMounted = false;
        };
    }, [selectedCityId]);

    // Calculate courier rates automatically via RajaOngkir Gateway
    useEffect(() => {
        if (items.length === 0 || !selectedCityId) {
            setCourierRates([]);
            return;
        }

        let isMounted = true;
        setIsLoadingRates(true);

        const fetchRates = async () => {
            try {
                const res = await fetch('/api/shipping/calculate', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '',
                    },
                    body: JSON.stringify({
                        destination_city_id: selectedCityId,
                        destination_subdistrict_id: selectedSubdistrictId,
                        destination_latitude: destLat,
                        destination_longitude: destLng,
                        province_id: selectedProvinceId,
                        weight_grams: totalWeightGrams,
                        subtotal: subtotal,
                    }),
                });

                const data = await res.json();
                if (isMounted && data.success && data.rates) {
                    setCourierRates(data.rates);
                    setSelectedCourierIndex(0);
                }
            } catch (err) {
                console.error('Error calculating rates', err);
            } finally {
                if (isMounted) {
                    setIsLoadingRates(false);
                }
            }
        };

        const timer = setTimeout(fetchRates, 250);
        return () => {
            isMounted = false;
            clearTimeout(timer);
        };
    }, [selectedCityId, selectedSubdistrictId, selectedProvinceId, totalWeightGrams, subtotal, items.length, destLat, destLng]);

    // Active selected courier
    const activeCourier = courierRates[selectedCourierIndex] || null;
    const shippingCost = items.length === 0 || isPickup ? 0 : (activeCourier ? activeCourier.cost : 15000);

    // Free shipping threshold
    const freeShippingMin = paymentSettings?.free_shipping_min ?? 250000;
    const isFreeShipping = subtotal >= freeShippingMin;
    const shortageForFreeShipping = Math.max(0, freeShippingMin - subtotal);

    // Grand total
    const grandTotal = subtotal + shippingCost;

    // Names of selected province and city
    const currentProvince = provinces.find((p) => p.id === selectedProvinceId);
    const currentCity = citiesList.find((c) => c.id === selectedCityId);

    const handleSubmitOrder = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage('');

        if (items.length === 0) {
            setErrorMessage('Keranjang Anda masih kosong.');
            return;
        }

        if (isPickup) {
            if (!customerName.trim() || !customerPhone.trim()) {
                setErrorMessage('Mohon lengkapi Nama Pengambil dan Nomor WhatsApp aktif.');
                return;
            }
        } else {
            if (!customerName.trim() || !customerPhone.trim() || !customerAddress.trim()) {
                setErrorMessage('Mohon lengkapi Nama Lengkap, Nomor WhatsApp, dan Alamat Pengiriman.');
                return;
            }
        }

        setIsSubmitting(true);

        try {
            const pickupAddrText = `Ambil di Toko: ${pickupSettings.store_name} (${pickupSettings.store_address})`;

            const payload = {
                items: items.map((i) => ({
                    variant_id: i.variant.id,
                    quantity: i.quantity,
                    grind_option: i.grindOption,
                    custom_notes: i.customNotes,
                    price: i.variant.price,
                })),
                fulfillment_type: fulfillmentType,
                customer: {
                    name: customerName,
                    phone: customerPhone,
                    email: customerEmail,
                    address: isPickup ? pickupAddrText : customerAddress,
                    notes: customerNotes,
                    province_id: isPickup ? (origin?.province_id ?? 18) : selectedProvinceId,
                    province: isPickup ? 'Jawa Timur' : (currentProvince?.name || 'Jawa Timur'),
                    city_id: isPickup ? (origin?.city_id ?? 391) : selectedCityId,
                    city: isPickup ? 'Kota Malang' : (currentCity ? `${currentCity.type ? currentCity.type + ' ' : ''}${currentCity.name}`.trim() : 'Kota Malang'),
                    district: isPickup ? 'Lowokwaru' : district,
                    postal_code: isPickup ? '65144' : postalCode,
                    latitude: isPickup ? null : destLat,
                    longitude: isPickup ? null : destLng,
                },
                shipping: {
                    courier: isPickup ? 'Ambil di Toko' : (activeCourier?.courier || 'J&T Express'),
                    courier_code: isPickup ? 'pickup' : (activeCourier?.courier_code || 'jnt'),
                    service: isPickup ? 'Self Pick Up' : (activeCourier?.service || 'EZ'),
                    cost: isPickup ? 0 : shippingCost,
                    etd: isPickup ? 'Siap Diambil di Roastery' : (activeCourier?.etd || '1-2 hari'),
                },
                payment_method: paymentMethod,
                payment_channel: paymentMethod === 'bank_transfer' ? selectedBank : (paymentMethod === 'qris' ? 'qris' : 'whatsapp'),
            };

            const res = await fetch('/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '',
                },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (data.success) {
                // Clear the cart on successful checkout
                clearCart();

                // Save recent order to localStorage for live notification center tracking
                try {
                    const existing = JSON.parse(localStorage.getItem('Alat Kopi Malang_recent_orders') || '[]');
                    const newOrder = {
                        order_number: data.order_number,
                        status: 'pending',
                        status_label: 'Menunggu Pembayaran',
                        payment_method_label: paymentMethod === 'qris' ? 'QRIS Toko' : (paymentMethod === 'bank_transfer' ? 'Transfer Bank' : 'WhatsApp'),
                        payment_status: 'pending',
                        created_at: 'Baru saja',
                        shipping_courier: isPickup ? 'Ambil di Toko' : (activeCourier?.courier || 'J&T Express'),
                    };
                    const updated = [newOrder, ...existing.filter((o: any) => o.order_number !== data.order_number)].slice(0, 5);
                    localStorage.setItem('Alat Kopi Malang_recent_orders', JSON.stringify(updated));
                } catch (e) {
                    console.error(e);
                }

                if (paymentMethod === 'whatsapp' && data.wa_url) {
                    window.location.href = data.wa_url;
                } else if (data.redirect_url) {
                    window.location.href = data.redirect_url;
                }
            } else {
                setErrorMessage(data.message || 'Gagal memproses pesanan. Silakan periksa kembali data Anda.');
            }
        } catch (err) {
            console.error('Checkout error', err);
            setErrorMessage('Terjadi kesalahan jaringan saat memproses pesanan. Silakan coba kembali.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <PublicLayout title="Checkout & Pembayaran">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-32 md:pb-16 space-y-8">
                {/* Header */}
                <div className="space-y-2">
                    <Link href="/shop" className="inline-flex items-center gap-1.5 text-xs text-brand-500 hover:text-brand-900 transition-colors">
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>Kembali Belanja Kopi</span>
                    </Link>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-950">
                        Checkout &amp; Pembayaran
                    </h1>
                </div>

                {items.length === 0 ? (
                    <div className="bg-white rounded-2xl p-12 text-center border border-sand-200 space-y-4 max-w-lg mx-auto shadow-xs">
                        <div className="w-16 h-16 rounded-full bg-cream-100 flex items-center justify-center text-brand-400 mx-auto">
                            <ShoppingBag className="w-8 h-8" />
                        </div>
                        <h2 className="text-lg font-bold text-brand-950">Keranjang Belanja Anda Kosong</h2>
                        <p className="text-xs text-brand-500 leading-relaxed">
                            Pilih biji kopi favorit Anda dari lini Gunung Kawi, Filter Beans, atau blend Espresso kami untuk melanjutkan checkout.
                        </p>
                        <Link
                            href="/shop"
                            className="inline-block px-6 py-3 bg-brand-700 hover:bg-brand-800 text-white text-xs font-bold rounded-full shadow-sm transition-all"
                        >
                            Jelajahi Katalog Kopi
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                        {/* Left: Items List & Cart Breakdown (5 cols) */}
                        <div className="lg:col-span-5 space-y-6">
                            {/* Cart Items Card */}
                            <div className="bg-white rounded-2xl p-6 border border-sand-200/80 shadow-xs space-y-4">
                                <div className="flex items-center justify-between pb-3 border-b border-sand-200">
                                    <div className="space-y-0.5">
                                        <h2 className="text-sm font-bold uppercase tracking-wider text-brand-950 flex items-center gap-2">
                                            <ShoppingBag className="w-4 h-4 text-brand-700" />
                                            <span>Pesanan ({itemCount} item)</span>
                                        </h2>
                                        <p className="text-[11px] text-brand-500">
                                            Total Berat: <strong>{totalWeightGrams} gram</strong> (Dihitung {chargeableWeightKg} kg)
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={clearCart}
                                        className="text-xs text-red-500 hover:text-red-700 font-medium cursor-pointer"
                                    >
                                        Kosongkan
                                    </button>
                                </div>

                                <div className="divide-y divide-sand-200/60 max-h-[400px] overflow-y-auto pr-1">
                                    {items.map((item, idx) => {
                                        const rawImg = item.variant?.image_url || item.variant?.image || item.product.images?.[0]?.path;
                                        const img = rawImg
                                            ? (rawImg.startsWith('http://') || rawImg.startsWith('https://')
                                                ? rawImg
                                                : `/storage/${rawImg.replace(/^\/?(public\/|storage\/)?/, '')}`)
                                            : '/brand/logo-circle.png';
                                        return (
                                            <div key={`${item.variant.id}-${item.grindOption}-${idx}`} className="py-3 flex gap-3">
                                                <div className="w-16 h-16 rounded-xl overflow-hidden bg-cream-50 border border-sand-200 flex-shrink-0">
                                                    <img src={img} alt={item.product.name} className="w-full h-full object-cover" />
                                                </div>

                                                <div className="flex-1 min-w-0 flex flex-col justify-between">
                                                    <div className="flex items-start justify-between gap-2">
                                                        <div>
                                                            <h3 className="text-xs sm:text-sm font-bold text-brand-950 truncate">
                                                                {item.product.name}
                                                            </h3>
                                                            <p className="text-[11px] text-accent-copper font-medium">
                                                                {item.variant.label} · {item.grindOption}
                                                            </p>
                                                            {item.customNotes && (
                                                                <div className="mt-1.5 p-2 rounded-lg bg-amber-50/80 border border-amber-200/70 text-[11px] text-brand-900 leading-snug">
                                                                    <div className="flex items-center gap-1 font-bold text-accent-copper text-[10px] uppercase tracking-wider">
                                                                        <SlidersHorizontal className="w-3 h-3" />
                                                                        <span>Rasio Racikan Blend (C.Y.B.R):</span>
                                                                    </div>
                                                                    <p className="font-semibold text-brand-950 mt-0.5">
                                                                        {item.customNotes}
                                                                    </p>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => removeItem(item.variant.id, item.grindOption, item.customNotes)}
                                                            className="text-gray-400 hover:text-red-500 p-1 cursor-pointer"
                                                            aria-label="Hapus item"
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>

                                                    <div className="flex items-center justify-between mt-1">
                                                        <div className="flex items-center border border-sand-200 rounded-lg bg-white overflow-hidden scale-90 -ml-2">
                                                            <button
                                                                type="button"
                                                                onClick={() => updateQuantity(item.variant.id, item.grindOption, item.quantity - 1, item.customNotes)}
                                                                className="p-1 hover:bg-sand-100 text-brand-700 cursor-pointer"
                                                            >
                                                                <Minus className="w-3 h-3" />
                                                            </button>
                                                            <span className="px-2 text-xs font-bold text-brand-950">
                                                                {item.quantity}
                                                            </span>
                                                            <button
                                                                type="button"
                                                                onClick={() => updateQuantity(item.variant.id, item.grindOption, item.quantity + 1, item.customNotes)}
                                                                className="p-1 hover:bg-sand-100 text-brand-700 cursor-pointer"
                                                            >
                                                                <Plus className="w-3 h-3" />
                                                            </button>
                                                        </div>

                                                        <span className="text-xs font-extrabold text-brand-950">
                                                            {formatRupiah(item.variant.price * item.quantity)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Right: Address & Automatic Courier Selector (7 cols) */}
                        <div className="lg:col-span-7 space-y-6">
                            <form onSubmit={handleSubmitOrder} className="bg-white rounded-2xl p-4 sm:p-6 border border-sand-200/80 shadow-xs space-y-6">
                                {errorMessage && (
                                    <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-medium">
                                        {errorMessage}
                                    </div>
                                )}

                                {/* FULFILLMENT METHOD SELECTOR */}
                                <div className="space-y-3 pb-3 border-b border-sand-200">
                                    <label className="text-sm sm:text-xs font-bold uppercase tracking-wider text-brand-950 flex items-center gap-2">
                                        <span>Metode Pengambilan / Pengiriman Pesanan</span>
                                    </label>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {/* Option A: Kurir Ekspedisi & Instan */}
                                        <button
                                            type="button"
                                            disabled={deliverySettings?.enabled === false}
                                            onClick={() => setFulfillmentType('delivery')}
                                            className={`p-4 sm:p-3.5 rounded-2xl sm:rounded-xl border-2 text-left transition-all cursor-pointer flex items-start gap-3.5 ${
                                                deliverySettings?.enabled === false
                                                    ? 'opacity-40 cursor-not-allowed border-sand-200 bg-sand-50'
                                                    : fulfillmentType === 'delivery'
                                                        ? 'border-brand-700 bg-brand-50/40 shadow-xs'
                                                        : 'border-sand-200 bg-white hover:border-sand-300'
                                            }`}
                                        >
                                            <div className={`p-2.5 sm:p-2 rounded-xl sm:rounded-lg flex-shrink-0 ${fulfillmentType === 'delivery' ? 'bg-brand-700 text-white' : 'bg-sand-100 text-brand-700'}`}>
                                                <Truck className="w-5 h-5 sm:w-4 sm:h-4" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm sm:text-xs font-bold text-brand-950">Kirim via Kurir &amp; Instan</span>
                                                    {fulfillmentType === 'delivery' && <Check className="w-4 h-4 sm:w-3.5 sm:h-3.5 text-brand-700 stroke-[3]" />}
                                                </div>
                                                <p className="text-xs sm:text-[11px] text-brand-600 mt-1 leading-snug">
                                                    GoSend Instan (Malang), J&amp;T, JNE, SiCepat langsung ke alamat Anda.
                                                </p>
                                            </div>
                                        </button>

                                        {/* Option B: Ambil di Toko */}
                                        <button
                                            type="button"
                                            disabled={pickupSettings?.enabled === false}
                                            onClick={() => setFulfillmentType('pickup')}
                                            className={`p-4 sm:p-3.5 rounded-2xl sm:rounded-xl border-2 text-left transition-all cursor-pointer flex items-start gap-3.5 ${
                                                pickupSettings?.enabled === false
                                                    ? 'opacity-40 cursor-not-allowed border-sand-200 bg-sand-50'
                                                    : fulfillmentType === 'pickup'
                                                        ? 'border-brand-700 bg-brand-50/40 shadow-xs'
                                                        : 'border-sand-200 bg-white hover:border-sand-300'
                                            }`}
                                        >
                                            <div className={`p-2.5 sm:p-2 rounded-xl sm:rounded-lg flex-shrink-0 ${fulfillmentType === 'pickup' ? 'bg-brand-700 text-white' : 'bg-sand-100 text-brand-700'}`}>
                                                <Store className="w-5 h-5 sm:w-4 sm:h-4" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm sm:text-xs font-bold text-brand-950">Ambil di Toko</span>
                                                        <span className="px-2 py-0.5 rounded-full text-[10px] sm:text-[9px] font-bold bg-emerald-100 text-emerald-800">
                                                            GRATIS
                                                        </span>
                                                    </div>
                                                    {fulfillmentType === 'pickup' && <Check className="w-4 h-4 sm:w-3.5 sm:h-3.5 text-brand-700 stroke-[3]" />}
                                                </div>
                                                <p className="text-xs sm:text-[11px] text-brand-600 mt-1 leading-snug">
                                                    Ambil sendiri di bar Alat Kopi Malang tanpa ongkir.
                                                </p>
                                            </div>
                                        </button>
                                    </div>
                                </div>

                                {/* STEP 1: DESTINATION OR PICKUP INFO */}
                                {isPickup ? (
                                    /* In-Store Pickup Details */
                                    <div className="space-y-4">
                                        <h2 className="text-sm font-bold uppercase tracking-wider text-brand-950 flex items-center gap-2">
                                            <Store className="w-4 h-4 text-brand-700" />
                                            <span>1. Lokasi Pengambilan Gerai &amp; Data Pengambil</span>
                                        </h2>

                                        {/* Store Pickup Address Card */}
                                        <div className="p-4 rounded-xl bg-sand-100/70 border border-sand-200/80 space-y-2 text-xs">
                                            <div className="flex items-start justify-between gap-3">
                                                <div>
                                                    <span className="text-[10px] font-bold uppercase tracking-wider text-accent-copper block">
                                                        Gerai Alat Kopi Malang
                                                    </span>
                                                    <h3 className="font-extrabold text-brand-950 text-sm mt-0.5">
                                                        {pickupSettings.store_name}
                                                    </h3>
                                                    <p className="text-brand-700 leading-relaxed mt-1">
                                                        {pickupSettings.store_address}
                                                    </p>
                                                    <p className="text-[11px] text-brand-600 font-medium mt-1">
                                                        🕒 {pickupSettings.store_hours}
                                                    </p>
                                                </div>

                                                {pickupSettings.maps_url && (
                                                    <a
                                                        href={pickupSettings.maps_url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white border border-sand-200 text-[11px] font-bold text-brand-800 hover:text-brand-950 shadow-2xs hover:bg-sand-50 transition-colors flex-shrink-0"
                                                    >
                                                        <MapPin className="w-3 h-3 text-accent-copper" />
                                                        <span>Maps</span>
                                                        <ExternalLink className="w-3 h-3" />
                                                    </a>
                                                )}
                                            </div>

                                            <div className="pt-2 border-t border-sand-200/60 text-[11px] text-brand-600">
                                                💡 <strong>Petunjuk:</strong> {pickupSettings.notes}
                                            </div>
                                        </div>

                                        {/* Collector Name and WhatsApp */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                            <div className="space-y-1">
                                                <label className="block text-xs font-semibold text-brand-900">
                                                    Nama Lengkap Pengambil *
                                                </label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={customerName}
                                                    onChange={(e) => setCustomerName(e.target.value)}
                                                    placeholder="Contoh: Dimas Aditya"
                                                    className="w-full px-3.5 py-2.5 rounded-xl bg-cream-50 border border-sand-200 text-xs sm:text-sm text-brand-950 focus:outline-hidden focus:border-brand-700 focus:bg-white transition-colors"
                                                />
                                            </div>

                                            <div className="space-y-1">
                                                <label className="block text-xs font-semibold text-brand-900">
                                                    Nomor WhatsApp / HP Aktif *
                                                </label>
                                                <input
                                                    type="tel"
                                                    required
                                                    value={customerPhone}
                                                    onChange={(e) => setCustomerPhone(e.target.value)}
                                                    placeholder="081234567890"
                                                    className="w-full px-3.5 py-2.5 rounded-xl bg-cream-50 border border-sand-200 text-xs sm:text-sm text-brand-950 focus:outline-hidden focus:border-brand-700 focus:bg-white transition-colors"
                                                />
                                            </div>
                                        </div>

                                        {/* Pickup Notes */}
                                        <div className="space-y-1">
                                            <label className="block text-xs font-semibold text-brand-900">
                                                Perkiraan Waktu / Catatan Pengambilan (Opsional)
                                            </label>
                                            <input
                                                type="text"
                                                value={customerNotes}
                                                onChange={(e) => setCustomerNotes(e.target.value)}
                                                placeholder="Contoh: Rencana diambil hari ini jam 16:30 / Diambil driver ojek online"
                                                className="w-full px-3.5 py-2.5 rounded-xl bg-cream-50 border border-sand-200 text-xs sm:text-sm text-brand-950 focus:outline-hidden focus:border-brand-700 focus:bg-white"
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    /* Delivery Form (Full Address) */
                                    <div className="space-y-4">
                                        <h2 className="text-sm font-bold uppercase tracking-wider text-brand-950 pb-2 border-b border-sand-200 flex items-center gap-2">
                                            <MapPin className="w-4 h-4 text-brand-700" />
                                            <span>1. Tujuan Pengiriman &amp; Penerima</span>
                                        </h2>

                                        {/* Customer Contact Inputs */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                            <div className="space-y-1">
                                                <label className="block text-xs font-semibold text-brand-900">
                                                    Nama Lengkap Penerima *
                                                </label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={customerName}
                                                    onChange={(e) => setCustomerName(e.target.value)}
                                                    placeholder="Budi Santoso"
                                                    className="w-full px-3.5 py-2.5 rounded-xl bg-cream-50 border border-sand-200 text-xs sm:text-sm text-brand-950 focus:outline-hidden focus:border-brand-700 focus:bg-white transition-colors"
                                                />
                                            </div>

                                            <div className="space-y-1">
                                                <label className="block text-xs font-semibold text-brand-900">
                                                    Nomor WhatsApp / HP Aktif *
                                                </label>
                                                <input
                                                    type="tel"
                                                    required
                                                    value={customerPhone}
                                                    onChange={(e) => setCustomerPhone(e.target.value)}
                                                    placeholder="081234567890"
                                                    className="w-full px-3.5 py-2.5 rounded-xl bg-cream-50 border border-sand-200 text-xs sm:text-sm text-brand-950 focus:outline-hidden focus:border-brand-700 focus:bg-white transition-colors"
                                                />
                                            </div>
                                        </div>

                                        {/* Province and City Dropdown */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                            <div className="space-y-1">
                                                <label className="block text-xs font-semibold text-brand-900">
                                                    Provinsi Tujuan *
                                                </label>
                                                <div className="relative">
                                                    <select
                                                        value={selectedProvinceId}
                                                        onChange={(e) => setSelectedProvinceId(Number(e.target.value))}
                                                        className="w-full px-3.5 py-2.5 pr-8 rounded-xl bg-cream-50 border border-sand-200 text-xs sm:text-sm text-brand-950 focus:outline-hidden focus:border-brand-700 focus:bg-white appearance-none cursor-pointer"
                                                    >
                                                        {provinces.map((prov) => (
                                                            <option key={prov.id} value={prov.id}>
                                                                {prov.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    <ChevronDown className="w-4 h-4 text-brand-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                                                </div>
                                            </div>

                                            <div className="space-y-1">
                                                <label className="block text-xs font-semibold text-brand-900">
                                                    Kota / Kabupaten Tujuan *
                                                </label>
                                                <div className="relative">
                                                    <select
                                                        value={selectedCityId}
                                                        onChange={(e) => handleCityChange(Number(e.target.value))}
                                                        className="w-full px-3.5 py-2.5 pr-8 rounded-xl bg-cream-50 border border-sand-200 text-xs sm:text-sm text-brand-950 focus:outline-hidden focus:border-brand-700 focus:bg-white appearance-none cursor-pointer"
                                                    >
                                                        {citiesList.map((city) => (
                                                            <option key={city.id} value={city.id}>
                                                                {city.type ? `${city.type} ${city.name}` : city.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    <ChevronDown className="w-4 h-4 text-brand-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                                                </div>
                                            </div>
                                        </div>

                                        {/* District and Postal Code */}
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                                            <div className="sm:col-span-2 space-y-1">
                                                <label className="block text-xs font-semibold text-brand-900">
                                                    Kecamatan {subdistrictsList.length > 0 ? '*' : '(Opsional)'}
                                                </label>
                                                {subdistrictsList.length > 0 ? (
                                                    <div className="relative">
                                                        <select
                                                            value={selectedSubdistrictId ?? ''}
                                                            onChange={(e) => {
                                                                const subId = Number(e.target.value);
                                                                setSelectedSubdistrictId(subId);
                                                                const subObj = subdistrictsList.find((s) => s.id === subId);
                                                                if (subObj) {
                                                                    setDistrict(subObj.name);
                                                                }
                                                            }}
                                                            className="w-full px-3.5 py-2.5 pr-8 rounded-xl bg-cream-50 border border-sand-200 text-xs sm:text-sm text-brand-950 focus:outline-hidden focus:border-brand-700 focus:bg-white appearance-none cursor-pointer"
                                                        >
                                                            {subdistrictsList.map((sub) => (
                                                                <option key={sub.id} value={sub.id}>
                                                                    Kec. {sub.name}
                                                                </option>
                                                            ))}
                                                        </select>
                                                        <ChevronDown className="w-4 h-4 text-brand-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                                                    </div>
                                                ) : (
                                                    <input
                                                        type="text"
                                                        value={district}
                                                        onChange={(e) => setDistrict(e.target.value)}
                                                        placeholder="Contoh: Lowokwaru / Klojen"
                                                        className="w-full px-3.5 py-2.5 rounded-xl bg-cream-50 border border-sand-200 text-xs sm:text-sm text-brand-950 focus:outline-hidden focus:border-brand-700 focus:bg-white"
                                                    />
                                                )}
                                            </div>

                                            <div className="space-y-1">
                                                <label className="block text-xs font-semibold text-brand-900">
                                                    Kode Pos
                                                </label>
                                                <input
                                                    type="text"
                                                    value={postalCode}
                                                    onChange={(e) => setPostalCode(e.target.value)}
                                                    placeholder="65144"
                                                    className="w-full px-3.5 py-2.5 rounded-xl bg-cream-50 border border-sand-200 text-xs sm:text-sm text-brand-950 focus:outline-hidden focus:border-brand-700 focus:bg-white"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-1">
                                            <label className="block text-xs font-semibold text-brand-900">
                                                Alamat Lengkap (Jalan, Nomor Rumah, RT/RW, Patokan) *
                                            </label>
                                            <textarea
                                                required
                                                rows={2}
                                                value={customerAddress}
                                                onChange={(e) => setCustomerAddress(e.target.value)}
                                                placeholder="Contoh: Jl. Ijen No. 12, RT 02 / RW 05, Kel. Oro-oro Dowo"
                                                className="w-full px-3.5 py-2.5 rounded-xl bg-cream-50 border border-sand-200 text-xs sm:text-sm text-brand-950 focus:outline-hidden focus:border-brand-700 focus:bg-white"
                                            />
                                        </div>

                                        {/* Titik Lokasi Peta Pinpoint (OpenStreetMap / Leaflet) untuk GoSend Instan */}
                                        <ShippingMapPicker
                                            originLat={origin?.latitude ?? -7.9327}
                                            originLng={origin?.longitude ?? 112.6037}
                                            originName="Alat Kopi Malang, Tlogomas"
                                            latitude={destLat}
                                            longitude={destLng}
                                            cityName={currentCity?.name || 'Kota Malang'}
                                            onChange={(lat, lng, dist) => {
                                                setDestLat(lat);
                                                setDestLng(lng);
                                                setRoadDistanceKm(dist);
                                            }}
                                        />
                                    </div>
                                )}

                                {/* STEP 2: COURIER SELECTION (Khusus Pengiriman Ekspedisi) */}
                                {!isPickup && (
                                    <div className="pt-4 border-t border-sand-200 space-y-3">
                                        <div className="flex flex-wrap items-center justify-between gap-2">
                                            <div className="flex items-center gap-2">
                                                <label className="text-sm sm:text-xs font-bold uppercase tracking-wider text-brand-950 flex items-center gap-2">
                                                    <Truck className="w-5 h-5 sm:w-4 sm:h-4 text-brand-700" />
                                                    <span>2. Pilih Layanan Kurir Ekspedisi</span>
                                                </label>
                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-brand-900/10 text-brand-800 text-[10px] font-bold">
                                                    RajaOngkir Enterprise Pro · Asal: {origin.city}
                                                </span>
                                            </div>
                                            {isLoadingRates && (
                                                <span className="text-xs sm:text-[11px] text-brand-500 flex items-center gap-1.5 animate-pulse">
                                                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-brand-700" />
                                                    <span>Menghitung tarif RajaOngkir...</span>
                                                </span>
                                            )}
                                        </div>

                                        {/* Courier Cards Grid */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-2.5">
                                            {courierRates.map((rate, idx) => {
                                                const isSelected = selectedCourierIndex === idx;
                                                return (
                                                    <div
                                                        key={`${rate.courier_code}-${rate.service}-${idx}`}
                                                        onClick={() => setSelectedCourierIndex(idx)}
                                                        className={`p-4 sm:p-3.5 rounded-2xl sm:rounded-xl border-2 transition-all cursor-pointer relative flex flex-col justify-between gap-2.5 sm:gap-2 ${
                                                            isSelected
                                                                ? 'border-brand-700 bg-brand-50/40 shadow-xs'
                                                                : 'border-sand-200 bg-white hover:border-sand-300'
                                                        }`}
                                                    >
                                                        <div className="flex items-start justify-between gap-2">
                                                            <div>
                                                                <div className="flex items-center gap-2 sm:gap-1.5">
                                                                    <span className="text-sm sm:text-xs font-bold text-brand-950">
                                                                        {rate.courier}
                                                                    </span>
                                                                    <span className="px-2 py-0.5 rounded text-[11px] sm:text-[10px] font-bold bg-sand-200/80 text-brand-800">
                                                                        {rate.service}
                                                                    </span>
                                                                </div>
                                                                <p className="text-xs sm:text-[11px] text-brand-500 mt-1 sm:mt-0.5">
                                                                    Estimasi: <strong className="text-brand-800">{rate.etd}</strong>
                                                                </p>
                                                            </div>

                                                            <div className={`w-5 h-5 sm:w-4 sm:h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                                                                isSelected ? 'border-brand-700 bg-brand-700 text-white' : 'border-sand-300 bg-white'
                                                            }`}>
                                                                {isSelected && <Check className="w-3 h-3 sm:w-2.5 sm:h-2.5 stroke-[3]" />}
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center justify-between pt-2 sm:pt-1 border-t border-sand-100">
                                                            {rate.badge && (
                                                                <span className={`text-xs sm:text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                                                    rate.is_free ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                                                                }`}>
                                                                    {rate.badge}
                                                                </span>
                                                            )}
                                                            <div className="text-right ml-auto">
                                                                {rate.is_free ? (
                                                                    <div className="flex items-center gap-2 sm:gap-1.5">
                                                                        <span className="text-xs sm:text-[10px] text-gray-400 line-through">
                                                                            {formatRupiah(rate.original_cost)}
                                                                        </span>
                                                                        <span className="text-sm sm:text-xs font-black text-emerald-700">
                                                                            GRATIS
                                                                        </span>
                                                                    </div>
                                                                ) : (
                                                                    <span className="text-sm sm:text-xs font-black text-brand-950">
                                                                        {formatRupiah(rate.cost)}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {/* PAYMENT METHOD SELECTION */}
                                <div className="pt-4 border-t border-sand-200 space-y-3">
                                    <label className="block text-sm sm:text-xs font-bold uppercase tracking-wider text-brand-950">
                                        {isPickup ? '2. Pilih Metode Pembayaran' : '3. Pilih Metode Pembayaran'}
                                    </label>

                                    {/* Option 1: QRIS Toko Resmi */}
                                    <div
                                        onClick={() => setPaymentMethod('qris')}
                                        className={`p-4 sm:p-3.5 rounded-2xl sm:rounded-xl border-2 transition-all cursor-pointer relative ${
                                            paymentMethod === 'qris'
                                                ? 'border-brand-700 bg-brand-50/40 shadow-xs'
                                                : 'border-sand-200 bg-white hover:border-sand-300'
                                        }`}
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex items-start gap-3.5 sm:gap-3">
                                                <div className={`w-11 h-11 sm:w-8 sm:h-8 rounded-xl sm:rounded-lg flex items-center justify-center flex-shrink-0 ${
                                                    paymentMethod === 'qris' ? 'bg-brand-700 text-white' : 'bg-sand-100 text-brand-700'
                                                }`}>
                                                    <QrCode className="w-5 h-5 sm:w-4 sm:h-4" />
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm sm:text-sm font-bold text-brand-950">QRIS Toko Resmi (Instan)</span>
                                                        <span className="px-2 py-0.5 rounded-full text-[10px] sm:text-[9px] font-bold bg-emerald-100 text-emerald-800">
                                                            Rekomendasi
                                                        </span>
                                                    </div>
                                                    <p className="text-xs sm:text-[11px] text-brand-600 mt-1 sm:mt-0.5 leading-snug">
                                                        Bebas admin via GoPay, OVO, DANA, ShopeePay, BCA Mobile, Livin', BRImo.
                                                    </p>
                                                </div>
                                            </div>
                                            <div className={`w-5 h-5 sm:w-4 sm:h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                                                paymentMethod === 'qris' ? 'border-brand-700 bg-brand-700 text-white' : 'border-sand-300 bg-white'
                                            }`}>
                                                {paymentMethod === 'qris' && <Check className="w-3 h-3 sm:w-2.5 sm:h-2.5 stroke-[3]" />}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Option 2: Transfer Bank */}
                                    <div
                                        onClick={() => setPaymentMethod('bank_transfer')}
                                        className={`p-4 sm:p-3.5 rounded-2xl sm:rounded-xl border-2 transition-all cursor-pointer relative ${
                                            paymentMethod === 'bank_transfer'
                                                ? 'border-brand-700 bg-brand-50/40 shadow-xs'
                                                : 'border-sand-200 bg-white hover:border-sand-300'
                                        }`}
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex items-start gap-3.5 sm:gap-3">
                                                <div className={`w-11 h-11 sm:w-8 sm:h-8 rounded-xl sm:rounded-lg flex items-center justify-center flex-shrink-0 ${
                                                    paymentMethod === 'bank_transfer' ? 'bg-brand-700 text-white' : 'bg-sand-100 text-brand-700'
                                                }`}>
                                                    <Building2 className="w-5 h-5 sm:w-4 sm:h-4" />
                                                </div>
                                                <div className="flex-1">
                                                    <span className="text-sm sm:text-sm font-bold text-brand-950">Transfer Bank Langsung</span>
                                                    <p className="text-xs sm:text-[11px] text-brand-600 mt-1 sm:mt-0.5 leading-snug">
                                                        Transfer manual ke rekening resmi toko dengan kode unik verifikasi.
                                                    </p>

                                                    {paymentMethod === 'bank_transfer' && banksList.length > 0 && (
                                                        <div className="mt-3 pt-2.5 border-t border-brand-200/60 flex flex-wrap gap-2">
                                                            {banksList.map((b) => {
                                                                const isBankActive = selectedBank.toLowerCase() === b.bank_code.toLowerCase();
                                                                return (
                                                                    <button
                                                                        key={b.bank_code}
                                                                        type="button"
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            setSelectedBank(b.bank_code);
                                                                        }}
                                                                        className={`py-2 px-3.5 sm:py-1.5 sm:px-3 rounded-xl sm:rounded-lg text-xs font-bold border transition-all text-center cursor-pointer ${
                                                                            isBankActive
                                                                                ? 'bg-brand-700 text-white border-brand-700 shadow-xs'
                                                                                : 'bg-white text-brand-800 border-sand-200 hover:bg-sand-50'
                                                                        }`}
                                                                    >
                                                                        {b.bank_name}
                                                                    </button>
                                                                );
                                                            })}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className={`w-5 h-5 sm:w-4 sm:h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                                                paymentMethod === 'bank_transfer' ? 'border-brand-700 bg-brand-700 text-white' : 'border-sand-300 bg-white'
                                            }`}>
                                                {paymentMethod === 'bank_transfer' && <Check className="w-3 h-3 sm:w-2.5 sm:h-2.5 stroke-[3]" />}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Option 3: WhatsApp Checkout */}
                                    <div
                                        onClick={() => setPaymentMethod('whatsapp')}
                                        className={`p-4 sm:p-3.5 rounded-2xl sm:rounded-xl border-2 transition-all cursor-pointer relative ${
                                            paymentMethod === 'whatsapp'
                                                ? 'border-[#25D366] bg-emerald-50/40 shadow-xs'
                                                : 'border-sand-200 bg-white hover:border-sand-300'
                                        }`}
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex items-start gap-3.5 sm:gap-3">
                                                <div className={`w-11 h-11 sm:w-8 sm:h-8 rounded-xl sm:rounded-lg flex items-center justify-center flex-shrink-0 ${
                                                    paymentMethod === 'whatsapp' ? 'bg-[#25D366] text-white' : 'bg-sand-100 text-[#25D366]'
                                                }`}>
                                                    <MessageCircle className="w-5 h-5 sm:w-4 sm:h-4" />
                                                </div>
                                                <div>
                                                    <span className="text-sm sm:text-sm font-bold text-brand-950">Pesan via WhatsApp (Chat Roaster)</span>
                                                    <p className="text-xs sm:text-[11px] text-brand-600 mt-1 sm:mt-0.5 leading-snug">
                                                        Untuk Anda yang ingin konsultasi seduhan, custom racikan, atau kargo volume besar.
                                                    </p>
                                                </div>
                                            </div>
                                            <div className={`w-5 h-5 sm:w-4 sm:h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                                                paymentMethod === 'whatsapp' ? 'border-[#25D366] bg-[#25D366] text-white' : 'border-sand-300 bg-white'
                                            }`}>
                                                {paymentMethod === 'whatsapp' && <Check className="w-3 h-3 sm:w-2.5 sm:h-2.5 stroke-[3]" />}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Order Calculation Summary */}
                                <div className="pt-4 border-t border-sand-200 space-y-2">
                                    <div className="flex items-center justify-between text-xs text-brand-600">
                                        <span>Subtotal ({itemCount} item, {totalWeightGrams}g)</span>
                                        <span className="font-semibold text-brand-950">{formatRupiah(subtotal)}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-xs text-brand-600">
                                        <span>
                                            {isPickup ? 'Biaya Pengambilan Toko' : `Ongkir (${activeCourier?.courier || 'Ekspedisi'} - ${activeCourier?.service || 'REG'})`}
                                        </span>
                                        <span className={shippingCost === 0 ? 'text-emerald-700 font-bold' : 'font-semibold text-brand-950'}>
                                            {shippingCost === 0 ? (isPickup ? 'GRATIS (Ambil di Toko)' : 'GRATIS (Promo)') : formatRupiah(shippingCost)}
                                        </span>
                                    </div>
                                    {paymentMethod === 'bank_transfer' && (
                                        <div className="flex items-center justify-between text-[11px] text-brand-500 italic">
                                            <span>Kode Unik Transfer</span>
                                            <span>Otomatis di halaman bayar</span>
                                        </div>
                                    )}
                                    <div className="flex items-center justify-between text-base font-extrabold text-brand-950 pt-2 border-t border-sand-100">
                                        <span>Total Tagihan</span>
                                        <span className="text-brand-700 text-lg">{formatRupiah(grandTotal)}</span>
                                    </div>
                                </div>

                                {/* Action Submit Button */}
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={`w-full flex items-center justify-center gap-2 py-4 rounded-xl text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all cursor-pointer disabled:opacity-50 active:scale-[0.99] ${
                                        paymentMethod === 'whatsapp'
                                            ? 'bg-[#25D366] hover:bg-[#20ba59]'
                                            : 'bg-brand-700 hover:bg-brand-800'
                                    }`}
                                >
                                    {paymentMethod === 'qris' && <QrCode className="w-4 h-4" />}
                                    {paymentMethod === 'bank_transfer' && <Building2 className="w-4 h-4" />}
                                    {paymentMethod === 'whatsapp' && <MessageCircle className="w-4 h-4 fill-white" />}
                                    <span>
                                        {isSubmitting
                                            ? 'Memproses Pesanan...'
                                            : paymentMethod === 'qris'
                                                ? `Bayar dengan QRIS Toko (${formatRupiah(grandTotal)})`
                                                : paymentMethod === 'bank_transfer'
                                                    ? `Buat Pesanan & Bayar Transfer Bank`
                                                    : isPickup
                                                        ? `Konfirmasi Ambil di Toko via WhatsApp`
                                                        : `Kirim Pesanan ke WhatsApp`}
                                    </span>
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </PublicLayout>
    );
}
