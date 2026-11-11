import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  ShoppingBag, 
  PhoneCall, 
  ArrowRight, 
  ShieldCheck, 
  Truck, 
  Tag, 
  CheckCircle2,
  FileText
} from 'lucide-react';
import { formatRupiah, generateWhatsAppMessage } from '../utils/format';
import { STORE_INFO } from '../data/products';
import confetti from 'canvas-confetti';

export default function CartDrawer({ 
  isOpen, 
  onClose, 
  cartItems, 
  onUpdateQuantity, 
  onRemoveItem, 
  onClearCart 
}) {
  const [customerNotes, setCustomerNotes] = useState('');
  const [shippingOption, setShippingOption] = useState('ambil-showroom');
  const [couponCode, setCouponCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState('');

  // Online checkout modal state
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [customerData, setCustomerData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: 'Malang',
    courier: 'gosend-malang',
    paymentMethod: 'qris'
  });

  if (!isOpen) return null;

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const shippingCost = shippingOption === 'ambil-showroom' ? 0 : (subtotal >= STORE_INFO.freeShippingThreshold ? 0 : 25000);
  const finalTotal = Math.max(0, subtotal - discountAmount + shippingCost);

  // Free shipping progress calculation
  const freeShippingThreshold = STORE_INFO.freeShippingThreshold;
  const progressPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    setCouponError('');
    if (couponCode.trim().toUpperCase() === 'SANUBARI10' || couponCode.trim().toUpperCase() === 'AKM10') {
      const discount = Math.round(subtotal * 0.1);
      setDiscountAmount(discount);
      setCouponApplied(true);
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    } else {
      setCouponError('Kode voucher tidak valid. Coba: SANUBARI10');
    }
  };

  const handleCheckoutWhatsApp = () => {
    const waUrl = `https://wa.me/${STORE_INFO.whatsappNumber}?text=${generateWhatsAppMessage(cartItems, customerNotes, shippingOption)}`;
    window.open(waUrl, '_blank');
  };

  const handleCompleteOnlineOrder = (e) => {
    e.preventDefault();
    setOrderSuccess(true);
    confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-sm animate-fade-in flex justify-end">
      
      {/* Drawer Container */}
      <div 
        className="w-full max-w-lg bg-[#181615] h-full flex flex-col border-l border-[#292524] shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="p-5 border-b border-[#292524] flex items-center justify-between bg-[#1c1917]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#c2a676]/10 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-[#c2a676]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#f5f5f4]">Keranjang Belanja</h3>
              <span className="text-xs text-[#78716c]">{cartItems.length} macam produk</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#a8a29e] hover:text-[#f5f5f4] hover:bg-[#292524] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free shipping progress bar */}
        <div className="bg-[#1f1c1a] px-5 py-3 border-b border-[#292524]">
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-[#a8a29e] flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-[#c2a676]" />
              {subtotal >= freeShippingThreshold ? (
                <strong className="text-emerald-400">Selamat! Kamu Mendapat Gratis Ongkir se-Jawa 🎉</strong>
              ) : (
                <span>Kurang <strong className="text-[#c2a676]">{formatRupiah(remainingForFreeShipping)}</strong> lagi untuk Gratis Ongkir</span>
              )}
            </span>
            <span className="text-[11px] text-[#78716c] font-bold">{progressPercent}%</span>
          </div>
          <div className="w-full h-1.5 bg-[#292524] rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[#c2a676] to-[#b45309] transition-all duration-500 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {cartItems.length === 0 ? (
            <div className="text-center py-16 space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#292524] flex items-center justify-center mx-auto text-[#78716c]">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-base font-bold text-[#f5f5f4]">Keranjang Masih Kosong</h4>
                <p className="text-xs text-[#78716c] mt-1 max-w-xs mx-auto">
                  Belum ada alat kopi yang ditambahkan. Silakan jelajahi koleksi dripper, grinder, atau paket starter kit kami.
                </p>
              </div>
              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl bg-[#c2a676] text-[#141211] font-bold text-xs hover:brightness-110 transition-all"
              >
                Mulai Belanja Alat Kopi
              </button>
            </div>
          ) : (
            cartItems.map((item, idx) => (
              <div 
                key={`${item.id}-${item.selectedVariant?.id || 'default'}-${idx}`}
                className="flex gap-3.5 p-3.5 rounded-2xl bg-[#1c1917] border border-[#292524] items-center"
              >
                <img
                  src={item.images[0]}
                  alt={item.name}
                  className="w-16 h-16 rounded-xl object-cover shrink-0 bg-[#24201d]"
                />
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] uppercase font-bold text-[#c2a676]">{item.brand}</span>
                  <h4 className="text-xs font-bold text-[#f5f5f4] truncate">{item.name}</h4>
                  {item.selectedVariant && (
                    <span className="text-[10px] text-[#a8a29e] block">
                      Varian: {item.selectedVariant.label}
                    </span>
                  )}
                  <span className="text-xs font-extrabold text-[#f5f5f4] block mt-1">
                    {formatRupiah(item.price)}
                  </span>
                </div>

                {/* Quantity Controls */}
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <div className="flex items-center border border-[#38332f] rounded-lg bg-[#292524]">
                    <button
                      onClick={() => onUpdateQuantity(item.id, item.selectedVariant?.id, item.quantity - 1)}
                      className="px-2 py-1 text-xs text-[#a8a29e] hover:text-[#f5f5f4]"
                    >
                      -
                    </button>
                    <span className="px-2.5 py-1 text-xs font-bold text-[#f5f5f4]">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => onUpdateQuantity(item.id, item.selectedVariant?.id, item.quantity + 1)}
                      className="px-2 py-1 text-xs text-[#a8a29e] hover:text-[#f5f5f4]"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => onRemoveItem(item.id, item.selectedVariant?.id)}
                    className="text-[11px] text-[#ef4444] hover:text-red-300 flex items-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Hapus</span>
                  </button>
                </div>
              </div>
            ))
          )}

          {cartItems.length > 0 && (
            <>
              {/* Shipping Delivery Option */}
              <div className="p-4 rounded-2xl bg-[#1c1917] border border-[#292524] space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#a8a29e] block">
                  Metode Pengambilan / Kirim:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setShippingOption('ambil-showroom')}
                    className={`p-2.5 rounded-xl text-left border transition-all text-xs ${
                      shippingOption === 'ambil-showroom'
                        ? 'bg-[#c2a676]/20 border-[#c2a676] text-[#c2a676] font-bold'
                        : 'bg-[#292524]/50 border-transparent text-[#a8a29e]'
                    }`}
                  >
                    <p className="font-bold">Ambil di Showroom</p>
                    <span className="text-[10px] block opacity-80">Ruko Tlogomas Malang (Gratis)</span>
                  </button>

                  <button
                    onClick={() => setShippingOption('ekspedisi')}
                    className={`p-2.5 rounded-xl text-left border transition-all text-xs ${
                      shippingOption === 'ekspedisi'
                        ? 'bg-[#c2a676]/20 border-[#c2a676] text-[#c2a676] font-bold'
                        : 'bg-[#292524]/50 border-transparent text-[#a8a29e]'
                    }`}
                  >
                    <p className="font-bold">Kirim Kurir / GoSend</p>
                    <span className="text-[10px] block opacity-80">
                      {subtotal >= freeShippingThreshold ? 'Gratis Ongkir' : 'Tarif Rp 25.000'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Coupon Code Input */}
              <div className="p-4 rounded-2xl bg-[#1c1917] border border-[#292524]">
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder="Kode Promo (coba: SANUBARI10)"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      disabled={couponApplied}
                      className="w-full bg-[#292524] border border-[#38332f] text-xs text-[#f5f5f4] rounded-xl px-3 py-2 uppercase placeholder:normal-case focus:outline-none focus:border-[#c2a676]"
                    />
                    <Tag className="w-3.5 h-3.5 text-[#78716c] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                  <button
                    type="submit"
                    disabled={couponApplied || !couponCode}
                    className="px-4 py-2 rounded-xl bg-[#292524] hover:bg-[#38332f] text-xs font-bold text-[#c2a676] border border-[#38332f] disabled:opacity-50"
                  >
                    {couponApplied ? 'Terpasang' : 'Terapkan'}
                  </button>
                </form>
                {couponApplied && (
                  <p className="text-[11px] text-emerald-400 mt-1.5 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Diskon 10% berhasil dipasang! (-{formatRupiah(discountAmount)})</span>
                  </p>
                )}
                {couponError && (
                  <p className="text-[11px] text-red-400 mt-1.5">{couponError}</p>
                )}
              </div>

              {/* Order Notes */}
              <div className="p-4 rounded-2xl bg-[#1c1917] border border-[#292524]">
                <label className="text-xs font-bold uppercase tracking-wider text-[#a8a29e] block mb-1.5">
                  Catatan Pesanan (Opsional):
                </label>
                <textarea
                  rows="2"
                  placeholder="Misal: Request bungkus kado, minta disetting grind size pour over, dll..."
                  value={customerNotes}
                  onChange={(e) => setCustomerNotes(e.target.value)}
                  className="w-full bg-[#292524] border border-[#38332f] text-xs text-[#f5f5f4] rounded-xl p-2.5 focus:outline-none focus:border-[#c2a676]"
                />
              </div>
            </>
          )}
        </div>

        {/* Footer Summary & Checkout Options */}
        {cartItems.length > 0 && (
          <div className="p-5 border-t border-[#292524] bg-[#1c1917] space-y-3">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-[#a8a29e]">
                <span>Subtotal Produk</span>
                <span className="text-[#f5f5f4]">{formatRupiah(subtotal)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-400 font-medium">
                  <span>Diskon Promo</span>
                  <span>-{formatRupiah(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-[#a8a29e]">
                <span>Ongkos Kirim</span>
                <span className="text-[#f5f5f4]">
                  {shippingCost === 0 ? <strong className="text-emerald-400">Gratis</strong> : formatRupiah(shippingCost)}
                </span>
              </div>
              <div className="flex justify-between text-sm sm:text-base font-extrabold text-[#f5f5f4] pt-2 border-t border-[#292524]">
                <span>Total Pembayaran</span>
                <span className="text-[#c2a676]">{formatRupiah(finalTotal)}</span>
              </div>
            </div>

            {/* Two Checkout Methods */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              <button
                onClick={handleCheckoutWhatsApp}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#c2a676] to-[#b45309] hover:brightness-110 text-[#141211] text-xs font-bold flex items-center justify-center gap-2 active:scale-95 transition-all shadow-md"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Checkout via WhatsApp</span>
              </button>

              <button
                onClick={() => setCheckoutModalOpen(true)}
                className="w-full py-3 px-4 rounded-xl bg-[#292524] hover:bg-[#38332f] text-[#f5f5f4] text-xs font-bold border border-[#38332f] hover:border-[#c2a676] flex items-center justify-center gap-2 active:scale-95 transition-all"
              >
                <FileText className="w-4 h-4 text-[#c2a676]" />
                <span>Checkout Online</span>
              </button>
            </div>

            <p className="text-[10px] text-center text-[#78716c]">
              Pembayaran aman via QRIS, Bank Transfer BCA, Mandiri, atau Bayar di Showroom Malang.
            </p>
          </div>
        )}

      </div>

      {/* Online Checkout Simulation Modal */}
      {checkoutModalOpen && (
        <div className="fixed inset-0 z-60 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div 
            className="w-full max-w-lg bg-[#1c1917] rounded-3xl border border-[#38332f] shadow-2xl p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setCheckoutModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full text-[#a8a29e] hover:text-[#f5f5f4] bg-[#292524]"
            >
              <X className="w-4 h-4" />
            </button>

            {!orderSuccess ? (
              <form onSubmit={handleCompleteOnlineOrder} className="space-y-4">
                <div className="border-b border-[#292524] pb-3">
                  <h3 className="text-lg font-bold text-[#f5f5f4]">Formulir Pengiriman &amp; Pembayaran</h3>
                  <p className="text-xs text-[#78716c]">Lengkapi data penerima untuk menerbitkan invoice pesanan.</p>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-[#a8a29e] font-semibold mb-1">Nama Lengkap</label>
                    <input
                      type="text"
                      required
                      placeholder="Nama Anda"
                      value={customerData.name}
                      onChange={(e) => setCustomerData({ ...customerData, name: e.target.value })}
                      className="w-full bg-[#292524] border border-[#38332f] text-[#f5f5f4] rounded-xl px-3 py-2.5 focus:border-[#c2a676] focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[#a8a29e] font-semibold mb-1">Nomor WhatsApp</label>
                      <input
                        type="tel"
                        required
                        placeholder="08123456789"
                        value={customerData.phone}
                        onChange={(e) => setCustomerData({ ...customerData, phone: e.target.value })}
                        className="w-full bg-[#292524] border border-[#38332f] text-[#f5f5f4] rounded-xl px-3 py-2.5 focus:border-[#c2a676] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[#a8a29e] font-semibold mb-1">Kota / Kabupaten</label>
                      <input
                        type="text"
                        required
                        placeholder="Kota Malang / Surabaya dll"
                        value={customerData.city}
                        onChange={(e) => setCustomerData({ ...customerData, city: e.target.value })}
                        className="w-full bg-[#292524] border border-[#38332f] text-[#f5f5f4] rounded-xl px-3 py-2.5 focus:border-[#c2a676] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[#a8a29e] font-semibold mb-1">Alamat Lengkap Pengiriman</label>
                    <textarea
                      rows="2"
                      required
                      placeholder="Jalan, No Rumah, RT/RW, Kecamatan, Kodepos..."
                      value={customerData.address}
                      onChange={(e) => setCustomerData({ ...customerData, address: e.target.value })}
                      className="w-full bg-[#292524] border border-[#38332f] text-[#f5f5f4] rounded-xl px-3 py-2.5 focus:border-[#c2a676] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[#a8a29e] font-semibold mb-1">Metode Pembayaran</label>
                    <select
                      value={customerData.paymentMethod}
                      onChange={(e) => setCustomerData({ ...customerData, paymentMethod: e.target.value })}
                      className="w-full bg-[#292524] border border-[#38332f] text-[#f5f5f4] rounded-xl px-3 py-2.5 focus:border-[#c2a676] focus:outline-none"
                    >
                      <option value="qris">QRIS (Semua E-Wallet &amp; Mobile Banking)</option>
                      <option value="bca">Transfer Bank BCA (Otomatis)</option>
                      <option value="mandiri">Transfer Bank Mandiri</option>
                      <option value="showroom">Bayar Tunai / EDC di Showroom Sanubari</option>
                    </select>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#292524]/60 border border-[#38332f] flex justify-between items-center text-xs">
                  <span className="text-[#a8a29e]">Total Tagihan:</span>
                  <span className="text-base font-extrabold text-[#c2a676]">{formatRupiah(finalTotal)}</span>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#c2a676] to-[#b45309] text-[#141211] font-bold text-xs uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all shadow-lg"
                >
                  Konfirmasi &amp; Terbitkan Pesanan
                </button>
              </form>
            ) : (
              <div className="text-center py-6 space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-[#f5f5f4]">Pesanan Berhasil Dibuat!</h3>
                <p className="text-xs text-[#a8a29e] max-w-sm mx-auto leading-relaxed">
                  Terima kasih, <strong>{customerData.name || 'Kak'}</strong>. Invoice pesananmu telah dicatat di sistem Alat Kopi Malang. Admin kami akan segera menghubungi nomor WhatsApp <strong>{customerData.phone}</strong> untuk konfirmasi packing &amp; bukti bayar.
                </p>
                <div className="p-4 rounded-2xl bg-[#292524] text-xs text-left space-y-1.5 border border-[#38332f]">
                  <div className="flex justify-between"><span className="text-[#78716c]">No. Invoice:</span> <strong className="text-[#f5f5f4]">INV-AKM-{Math.floor(100000 + Math.random() * 900000)}</strong></div>
                  <div className="flex justify-between"><span className="text-[#78716c]">Total Pembayaran:</span> <strong className="text-[#c2a676]">{formatRupiah(finalTotal)}</strong></div>
                  <div className="flex justify-between"><span className="text-[#78716c]">Metode:</span> <strong className="text-[#f5f5f4] uppercase">{customerData.paymentMethod}</strong></div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      onClearCart();
                      setCheckoutModalOpen(false);
                      setOrderSuccess(false);
                      onClose();
                    }}
                    className="w-full py-3 rounded-xl bg-[#c2a676] text-[#141211] font-bold text-xs hover:brightness-110"
                  >
                    Selesai &amp; Kembali Belanja
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}

