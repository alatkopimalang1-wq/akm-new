import React from 'react';
import { Link } from '@inertiajs/react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import { SlidingNumber } from '@animate-ui/react/primitives/texts/sliding-number';
import { transition } from '@animate-ui/react/utils/motion';
import { isCartItemPreOrder, useCart } from '@/context/cart-context';
import { formatRupiah } from '@/lib/trans';
import { getBundlePricingSummary, isBundleOrderItem, parseCustomNotes } from '@/lib/utils';
import { calculateDpBreakdown, PreorderDpSlider } from '@/components/preorder-dp-slider';

export const CartDrawer: React.FC = () => {
    const {
        items,
        itemCount,
        subtotal,
        preOrderSubtotal,
        nonPreOrderSubtotal,
        hasPreOrderItems,
        minDpPercentage,
        dpPercentage,
        setDpPercentage,
        isCartOpen,
        setIsCartOpen,
        updateQuantity,
        removeItem,
    } = useCart();

    const dpBreakdown = calculateDpBreakdown(
        subtotal,
        hasPreOrderItems ? dpPercentage : 100,
        minDpPercentage,
        preOrderSubtotal,
        nonPreOrderSubtotal,
    );

    const totalNormalSubtotal = items.reduce((sum, item) => {
        const pricing = getBundlePricingSummary({
            customNotes: item.customNotes,
            unitPrice: item.variant.price,
            quantity: item.quantity,
            originalUnitPrice: item.variant.original_price,
        });
        return sum + pricing.totalNormalPrice;
    }, 0);

    // Lock body scroll when cart drawer is open on mobile
    React.useEffect(() => {
        if (isCartOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isCartOpen]);

    return (
        <AnimatePresence>
            {isCartOpen && (
                <div className="fixed inset-0 z-[70] flex justify-end">
                    {/* Backdrop with Fade */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 bg-brand-950/60 backdrop-blur-xs"
                        onClick={() => setIsCartOpen(false)}
                    />

                    {/* Slide-over panel with spring physics */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{
                            type: 'spring',
                            damping: 30,
                            stiffness: 300,
                            mass: 0.8,
                        }}
                        className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10"
                    >
                        {/* Header */}
                        <div className="px-6 py-4 border-b border-sand-200 flex items-center justify-between bg-cream-50">
                            <div className="flex items-center gap-2">
                                <ShoppingBag className="w-5 h-5 text-brand-700" />
                                <h2 className="text-lg font-bold text-brand-950 flex items-center gap-1.5">
                                    <span>Keranjang Belanja</span>
                                    <span className="text-accent-copper font-semibold text-base">
                                        (<SlidingNumber number={itemCount} />)
                                    </span>
                                </h2>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsCartOpen(false)}
                                className="p-1.5 rounded-full hover:bg-sand-200/60 text-brand-600 hover:text-brand-950 transition-colors cursor-pointer active:scale-95"
                                aria-label="Tutup keranjang"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Items List with Layout Animations */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-4">
                            {items.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center py-12">
                                    <div className="w-16 h-16 rounded-full bg-cream-100 flex items-center justify-center text-brand-400 mb-3">
                                        <ShoppingBag className="w-8 h-8" />
                                    </div>
                                    <p className="text-base font-semibold text-brand-900 mb-1">
                                        Keranjang Anda masih kosong
                                    </p>
                                    <p className="text-xs text-brand-500 max-w-xs mb-6">
                                        Temukan koleksi biji kopi terbaik dari lereng Gunung Kawi dan lini specialty blend kami.
                                    </p>
                                    <Link
                                        href="/shop"
                                        onClick={() => setIsCartOpen(false)}
                                        className="px-5 py-2.5 bg-brand-700 hover:bg-brand-800 text-white text-xs font-semibold rounded-full shadow-sm active:scale-95 transition-all"
                                    >
                                        Jelajahi Kopi Sekarang
                                    </Link>
                                </div>
                            ) : (
                                <>
                                    <AnimatePresence initial={false}>
                                    {items.map((item, idx) => {
                                        const rawImg = item.variant?.image_url || item.variant?.image || item.product.images?.[0]?.path;
                                        const img = rawImg
                                            ? (rawImg.startsWith('http://') || rawImg.startsWith('https://')
                                                ? rawImg
                                                : `/storage/${rawImg.replace(/^\/?(public\/|storage\/)?/, '')}`)
                                            : '/brand/logo-akm.png?v=20261113b';
                                        const pricing = getBundlePricingSummary({
                                            customNotes: item.customNotes,
                                            unitPrice: item.variant.price,
                                            quantity: item.quantity,
                                            originalUnitPrice: item.variant.original_price,
                                        });
                                        return (
                                            <motion.div
                                                key={`${item.variant.id}-${item.grindOption}-${idx}`}
                                                layout
                                                initial={{ opacity: 0, y: 12 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
                                                transition={{ duration: 0.2 }}
                                                className="flex flex-col gap-3 pb-4 border-b border-sand-200/60 last:border-0"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-cream-50 overflow-hidden flex-shrink-0 border border-sand-200/50">
                                                        <img src={img} alt={item.product.name} className="w-full h-full object-cover" />
                                                    </div>
                                                    <div className="flex-1 min-w-0 flex items-start justify-between gap-2">
                                                        <div className="min-w-0">
                                                            <div className="flex flex-wrap items-center gap-1.5">
                                                                <h4 className="text-sm sm:text-base font-bold text-brand-950 leading-snug">
                                                                    {item.product.name}
                                                                </h4>
                                                                {isCartItemPreOrder(item) && (
                                                                    <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300 text-[10px] font-black uppercase tracking-wider">
                                                                        Pre-Order
                                                                    </span>
                                                                )}
                                                            </div>
                                                            {!isBundleOrderItem({
                                                                isCustomBundle: item.product.is_custom_bundle,
                                                                hasVariants: (item.product as any).has_variants,
                                                                variantLabel: item.variant.label,
                                                                grindOption: item.grindOption,
                                                                customNotes: item.customNotes,
                                                            }) && item.variant?.label && (
                                                                <p className="text-xs text-accent-copper font-semibold mt-0.5">
                                                                    Varian: {item.variant.label}
                                                                </p>
                                                            )}
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => removeItem(item.variant.id, item.grindOption, item.customNotes)}
                                                            className="text-gray-400 hover:text-red-500 p-1 transition-colors cursor-pointer active:scale-95 shrink-0"
                                                            aria-label="Hapus produk"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>

                                                {item.customNotes && (
                                                    <div className="w-full text-xs text-brand-700 font-normal space-y-1.5 leading-snug">
                                                        {pricing.lines.map((line, lineIdx) => (
                                                            <p key={lineIdx}>
                                                                {line.tag && (
                                                                    <strong className="font-extrabold text-brand-950">
                                                                        {line.tag}{' '}
                                                                    </strong>
                                                                )}
                                                                <span>{line.text}</span>
                                                                {line.isPreOrder && (
                                                                    <span className="ml-1 px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-300 text-[9px] font-extrabold uppercase tracking-wider whitespace-nowrap">
                                                                        Pre-Order
                                                                    </span>
                                                                )}
                                                                {line.discountPrice && (
                                                                    <span>
                                                                        {' ('}
                                                                        {line.normalPrice && (line.normalPriceNum || 0) > (line.discountPriceNum || 0) && (
                                                                            <>
                                                                                <span className="text-red-600 line-through font-medium whitespace-nowrap">
                                                                                    {line.normalPrice}
                                                                                </span>{' '}
                                                                            </>
                                                                        )}
                                                                        <span className="font-bold text-brand-950 whitespace-nowrap">
                                                                            {line.discountPrice}
                                                                        </span>
                                                                        {')'}
                                                                    </span>
                                                                )}
                                                            </p>
                                                        ))}
                                                        <div className="pt-2 mt-1.5 border-t border-sand-200 space-y-0.5">
                                                            {pricing.hasDiscount && (
                                                                <div className="flex items-center justify-between text-xs">
                                                                    <span className="text-brand-600">Total Harga Normal:</span>
                                                                    <span className="text-red-600 line-through font-semibold whitespace-nowrap">
                                                                        {formatRupiah(pricing.totalNormalPrice)}
                                                                    </span>
                                                                </div>
                                                            )}
                                                            <div className="flex items-center justify-between text-xs font-bold text-brand-950">
                                                                <span>Total Harga Diskon:</span>
                                                                <span className="text-emerald-700 whitespace-nowrap">
                                                                    {formatRupiah(pricing.totalDiscountPrice)}
                                                                </span>
                                                            </div>
                                                            {pricing.hasPreOrderSubItem && (
                                                                <div className="pt-1 mt-1 border-t border-sand-100 space-y-0.5">
                                                                    <div className="flex items-center justify-between text-[11px] text-amber-800">
                                                                        <span>Total Produk Pre-Order (Berlaku DP):</span>
                                                                        <span className="font-bold whitespace-nowrap">
                                                                            {formatRupiah(pricing.totalPreOrderPrice)}
                                                                        </span>
                                                                    </div>
                                                                    <div className="flex items-center justify-between text-[11px] text-brand-700">
                                                                        <span>Total Produk Non Pre-Order (Lunas):</span>
                                                                        <span className="font-bold text-brand-950 whitespace-nowrap">
                                                                            {formatRupiah(pricing.totalNonPreOrderPrice)}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}

                                                <div className="w-full flex items-center justify-between pt-0.5">
                                                    <div className="flex items-center border border-sand-200 rounded-lg overflow-hidden bg-white">
                                                        <button
                                                            type="button"
                                                            onClick={() => updateQuantity(item.variant.id, item.grindOption, item.quantity - 1, item.customNotes)}
                                                            className="p-1.5 hover:bg-sand-100 text-brand-700 active:scale-95 transition-transform cursor-pointer"
                                                        >
                                                            <Minus className="w-3.5 h-3.5" />
                                                        </button>
                                                        <span className="px-2.5 text-xs font-semibold text-brand-950">
                                                            {item.quantity}
                                                        </span>
                                                        <button
                                                            type="button"
                                                            onClick={() => updateQuantity(item.variant.id, item.grindOption, item.quantity + 1, item.customNotes)}
                                                            className="p-1.5 hover:bg-sand-100 text-brand-700 active:scale-95 transition-transform cursor-pointer"
                                                        >
                                                            <Plus className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>
                                                    <div className="text-right">
                                                        {pricing.hasDiscount && (
                                                            <span className="block text-xs text-red-600 line-through font-semibold leading-tight">
                                                                {formatRupiah(pricing.totalNormalPrice)}
                                                            </span>
                                                        )}
                                                        <span className="text-sm sm:text-base font-extrabold text-brand-950">
                                                            {formatRupiah(pricing.totalDiscountPrice)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </AnimatePresence>
                                {/* Pre-Order DP Slider inside Cart Drawer */}
                                {hasPreOrderItems && items.length > 0 && (
                                    <div className="pt-2">
                                        <PreorderDpSlider
                                            compact
                                            totalAmount={subtotal}
                                            preOrderAmount={preOrderSubtotal}
                                            nonPreOrderAmount={nonPreOrderSubtotal}
                                            dpPercentage={dpPercentage}
                                            minDpPercentage={minDpPercentage}
                                            onChange={setDpPercentage}
                                        />
                                    </div>
                                )}
                                </>
                            )}
                        </div>

                        {/* Footer */}
                        {items.length > 0 && (
                            <div className="p-5 sm:p-6 pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))] border-t border-sand-200 bg-cream-50 space-y-3.5">
                                <div className="space-y-1">
                                    {totalNormalSubtotal > subtotal && (
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="text-brand-600">Total Harga Normal</span>
                                            <span className="text-red-600 line-through font-semibold">
                                                {formatRupiah(totalNormalSubtotal)}
                                            </span>
                                        </div>
                                    )}
                                    {hasPreOrderItems && dpBreakdown.isDp ? (
                                        <>
                                            <div className="flex items-center justify-between text-xs">
                                                <span className="text-brand-600">Total Harga Pesanan (100%)</span>
                                                <span className="font-semibold text-brand-950">
                                                    {formatRupiah(subtotal)}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between text-xs">
                                                <span className="text-amber-800">
                                                    Dikurangi Sisa Pelunasan ({dpBreakdown.remainingPercentage}%)
                                                </span>
                                                <span className="font-bold text-red-600">
                                                    -{formatRupiah(dpBreakdown.remainingBalance)}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between pt-1 border-t border-sand-200">
                                                <span className="text-sm text-brand-900 font-extrabold">
                                                    Total Dibayar Sekarang (DP {dpBreakdown.dpPercentage}%)
                                                </span>
                                                <span className="text-lg font-extrabold text-emerald-700">
                                                    {formatRupiah(dpBreakdown.dpAmount)}
                                                </span>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-brand-700 font-semibold">
                                                {totalNormalSubtotal > subtotal ? 'Total Harga Diskon (Subtotal)' : 'Subtotal'}
                                            </span>
                                            <span className="text-lg font-extrabold text-brand-950">
                                                {formatRupiah(subtotal)}
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <p className="text-[11px] text-brand-500 leading-tight">
                                    Checkout langsung di website dengan <strong>QRIS Semua Bank & E-Wallet</strong> atau <strong>Transfer Bank</strong> resmi.
                                </p>
                                <Link
                                    href="/keranjang"
                                    onClick={() => setIsCartOpen(false)}
                                    className="w-full flex items-center justify-center gap-2 py-3.5 bg-brand-700 hover:bg-brand-800 text-white text-sm font-bold rounded-xl shadow-md transition-all active:scale-[0.98]"
                                >
                                    <span>Lanjut ke Pembayaran &amp; Checkout</span>
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
