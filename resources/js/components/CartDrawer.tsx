import React, { useState } from 'react';
import { CartItem } from '../types';
import { X, Trash2, ShoppingBag, ArrowRight, ShieldCheck, Truck, MessageSquare } from 'lucide-react';

interface CartDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    cartItems: CartItem[];
    onUpdateQuantity: (productId: number, delta: number) => void;
    onRemoveItem: (productId: number) => void;
    onClearCart: () => void;
    whatsappNumber?: string;
}

export default function CartDrawer({
    isOpen,
    onClose,
    cartItems,
    onUpdateQuantity,
    onRemoveItem,
    onClearCart,
    whatsappNumber = '6281234567890',
}: CartDrawerProps) {
    if (!isOpen) return null;

    const [customerNotes, setCustomerNotes] = useState('');
    const [customerName, setCustomerName] = useState('');

    const subtotal = cartItems.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
    );

    const handleCheckoutWhatsApp = () => {
        if (cartItems.length === 0) return;

        let message = `*HALO ALAT KOPI MALANG, SAYA INGIN PESAN PERALATAN BERIKUT:*\n\n`;
        if (customerName.trim()) {
            message += `*Nama Pembeli:* ${customerName.trim()}\n`;
        }
        message += `*Daftar Pesanan:*\n`;

        cartItems.forEach((item, index) => {
            const itemTotal = item.product.price * item.quantity;
            message += `${index + 1}. *${item.product.name}*\n`;
            message += `   - Jumlah: ${item.quantity} unit @ Rp ${item.product.price.toLocaleString('id-ID')}\n`;
            message += `   - Subtotal: Rp ${itemTotal.toLocaleString('id-ID')}\n`;
        });

        message += `\n*TOTAL PESANAN:* Rp ${subtotal.toLocaleString('id-ID')}\n`;
        if (customerNotes.trim()) {
            message += `*Catatan Khusus:* ${customerNotes.trim()}\n`;
        }
        message += `\nMohon info ketersediaan stok & panduan pembayarannya. Terima kasih!`;

        const waUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
        window.open(waUrl, '_blank');
    };

    return (
        <div className="fixed inset-0 z-50 overflow-hidden bg-black/70 backdrop-blur-sm animate-fade-in">
            <div className="absolute inset-0" onClick={onClose} />

            <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
                <div className="w-screen max-w-md bg-[#151821] border-l border-[#232838] shadow-2xl flex flex-col justify-between text-stone-200">
                    {/* Header */}
                    <div className="p-6 border-b border-[#232838] flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                            <ShoppingBag className="w-5 h-5 text-amber-400" />
                            <h3 className="font-extrabold text-lg text-white">Keranjang Belanja</h3>
                            <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 font-bold border border-amber-500/20">
                                {cartItems.reduce((sum, item) => sum + item.quantity, 0)} item
                            </span>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-9 h-9 rounded-lg bg-[#0e1015] hover:bg-[#1a1f2b] text-stone-400 hover:text-white flex items-center justify-center border border-[#232838] transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Cart Items List */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        {cartItems.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-center p-8 text-stone-500">
                                <ShoppingBag className="w-16 h-16 mb-4 opacity-20" />
                                <p className="font-bold text-stone-400 text-base mb-1">Keranjang masih kosong</p>
                                <p className="text-xs text-stone-500 mb-6">
                                    Pilih grinder, dripper, atau mesin espresso favorit Anda dari katalog.
                                </p>
                                <button
                                    onClick={onClose}
                                    className="px-5 py-2.5 rounded-xl bg-[#e69c24] text-black font-bold text-xs"
                                >
                                    Lihat Katalog Alat
                                </button>
                            </div>
                        ) : (
                            cartItems.map((item) => (
                                <div
                                    key={item.product.id}
                                    className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-[#0e1015] border border-[#232838]"
                                >
                                    <div className="w-16 h-16 rounded-xl bg-[#151821] border border-[#232838] overflow-hidden shrink-0 flex items-center justify-center">
                                        {item.product.primary_image_url ? (
                                            <img
                                                src={item.product.primary_image_url}
                                                alt={item.product.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <ShoppingBag className="w-6 h-6 text-stone-600" />
                                        )}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-bold text-xs text-white truncate mb-1">
                                            {item.product.name}
                                        </h4>
                                        <p className="text-xs font-black text-amber-400 mb-2">
                                            Rp {item.product.price.toLocaleString('id-ID')}
                                        </p>

                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center border border-[#232838] rounded-lg bg-[#151821]">
                                                <button
                                                    onClick={() => onUpdateQuantity(item.product.id, -1)}
                                                    className="w-6 h-6 flex items-center justify-center text-xs font-bold text-stone-400 hover:text-white"
                                                >
                                                    -
                                                </button>
                                                <span className="w-6 text-center text-xs font-bold text-white">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() => onUpdateQuantity(item.product.id, 1)}
                                                    className="w-6 h-6 flex items-center justify-center text-xs font-bold text-stone-400 hover:text-white"
                                                >
                                                    +
                                                </button>
                                            </div>

                                            <button
                                                onClick={() => onRemoveItem(item.product.id)}
                                                className="text-stone-500 hover:text-rose-400 p-1"
                                                title="Hapus"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Footer Checkout Summary */}
                    {cartItems.length > 0 && (
                        <div className="p-6 border-t border-[#232838] bg-[#0e1015]/90 space-y-4">
                            <div className="space-y-2">
                                <input
                                    type="text"
                                    value={customerName}
                                    onChange={(e) => setCustomerName(e.target.value)}
                                    placeholder="Nama Anda (opsional)"
                                    className="w-full bg-[#151821] border border-[#232838] rounded-xl px-3.5 py-2 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-amber-500/50"
                                />
                                <input
                                    type="text"
                                    value={customerNotes}
                                    onChange={(e) => setCustomerNotes(e.target.value)}
                                    placeholder="Catatan pesanan / alamat pengiriman..."
                                    className="w-full bg-[#151821] border border-[#232838] rounded-xl px-3.5 py-2 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-amber-500/50"
                                />
                            </div>

                            <div className="flex items-center justify-between text-sm pt-2">
                                <span className="text-stone-400 font-medium">Total Tagihan:</span>
                                <span className="text-xl font-black text-amber-400">
                                    Rp {subtotal.toLocaleString('id-ID')}
                                </span>
                            </div>

                            <button
                                onClick={handleCheckoutWhatsApp}
                                className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#e69c24] to-[#f59e0b] hover:from-[#d98a18] hover:to-[#e69c24] text-black font-extrabold text-sm shadow-xl shadow-amber-500/20 active:scale-95 transition-all flex items-center justify-center gap-2"
                            >
                                <MessageSquare className="w-4 h-4" />
                                Checkout via WhatsApp Concierge &rarr;
                            </button>

                            <p className="text-[11px] text-center text-stone-500">
                                Terhubung langsung ke Barista & CS Alat Kopi Malang
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

