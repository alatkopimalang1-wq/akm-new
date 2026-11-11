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
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm animate-fade-in flex justify-end">
      
      {/* Drawer Container */}
      <div 
        className="w-full max-w-lg bg-white text-slate-900 h-full flex flex-col border-l border-slate-200 shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-[#0070f3]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Keranjang Belanja</h3>
              <span className="text-xs text-slate-500">{cartItems.length} macam produk</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-200/80 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free shipping progress bar */}
        <div className="bg-blue-50/70 px-5 py-3.5 border-b border-blue-100">
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-slate-700 flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-[#0070f3]" />
              {subtotal >= freeShippingThreshold ? (
                <strong className="text-[#0070f3]">Selamat! Kamu Mendapat Gratis Ongkir se-Jawa 🎉</strong>
              ) : (
                <span>Kurang <strong className="text-[#0070f3]">{formatRupiah(remainingForFreeShipping)}</strong> lagi untuk Gratis Ongkir</span>
              )}
            </span>
            <span className="text-[11px] text-slate-500 font-bold">{progressPercent}%</span>
          </div>
          <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[#0070f3] to-[#0052cc] transition-all duration-500 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {cartItems.length === 0 ? (
            <div className="text-center py-16 space-y-4">
              <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mx-auto text-slate-400">
                <ShoppingBag className="w-8 h-8 text-[#0070f3]" />
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900">Keranjang Masih Kosong</h4>
                <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                  Belum ada alat kopi yang ditambahkan. Silakan jelajahi koleksi dripper, grinder, atau paket starter kit kami.
                </p>
              </div>
              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#0070f3] to-[#0052cc] text-white font-bold text-xs hover:brightness-110 transition-all shadow-md shadow-blue-500/25"
              >
                Mulai Belanja Alat Kopi
              </button>
            </div>
          ) : (
            cartItems.map((item, idx) => (
              <div 
                key={`${item.id}-${item.selectedVariant?.id || 'default'}-${idx}`}
                className="flex gap-3.5 p-3.5 rounded-2xl bg-white border border-slate-200 items-center shadow-xs"
              >
                <img
                  src={item.images[0]}
                  alt={item.name}
                  className="w-16 h-16 rounded-xl object-cover shrink-0 bg-slate-100 border border-slate-200"
                />
                <div className="flex-1 min-w-0">
                  <span className="text-xs uppercase font-bold text-[#0e1f36]">{item.brand}</span>
                  <h4 className="text-sm font-bold text-slate-900 truncate">{item.name}</h4>
                  {item.selectedVariant && (
                    <span className="text-xs text-slate-500 block">
                      Varian: {item.selectedVariant.label}
                    </span>
                  )}
                  <span className="text-sm sm:text-base font-extrabold text-slate-900 block mt-1">
                    {formatRupiah(item.price)}
                  </span>
                </div>

                {/* Quantity Controls */}
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <div className="flex items-center border border-slate-200 rounded-lg bg-slate-50">
                    <button
                      onClick={() => onUpdateQuantity(item.id, item.selectedVariant?.id, item.quantity - 1)}
                      className="px-2.5 py-1 text-sm text-slate-600 hover:text-slate-900 font-bold"
                    >
                      -
                    </button>
                    <span className="px-3 py-1 text-sm font-bold text-slate-900">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => onUpdateQuantity(item.id, item.selectedVariant?.id, item.quantity + 1)}
                      className="px-2.5 py-1 text-sm text-slate-600 hover:text-slate-900 font-bold"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => onRemoveItem(item.id, item.selectedVariant?.id)}
                    className="text-xs text-red-500 hover:text-red-700 font-medium flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Hapus</span>
                  </button>
                </div>
              </div>
            ))
          )}

          {cartItems.length > 0 && (
            <>
              {/* Shipping Delivery Option */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block">
                  Metode Pengambilan / Kirim:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setShippingOption('ambil-showroom')}
                    className={`p-2.5 rounded-xl text-left border transition-all text-xs sm:text-sm ${
                      shippingOption === 'ambil-showroom'
                        ? 'bg-slate-100 border-[#0e1f36] text-[#0e1f36] font-bold shadow-xs'
                        : 'bg-white border-slate-200 text-slate-600'
                    }`}
                  >
                    <p className="font-bold">Ambil di Showroom</p>
                    <span className="text-xs block opacity-80">Ruko Tlogomas Malang (Gratis)</span>
                  </button>

                  <button
                    onClick={() => setShippingOption('ekspedisi')}
                    className={`p-2.5 rounded-xl text-left border transition-all text-xs sm:text-sm ${
                      shippingOption === 'ekspedisi'
                        ? 'bg-slate-100 border-[#0e1f36] text-[#0e1f36] font-bold shadow-xs'
                        : 'bg-white border-slate-200 text-slate-600'
                    }`}
                  >
                    <p className="font-bold">Kirim Kurir / GoSend</p>
                    <span className="text-xs block opacity-80">
                      {subtotal >= freeShippingThreshold ? 'Gratis Ongkir' : 'Tarif Rp 25.000'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Coupon Code Input */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder="Kode Promo (coba: SANUBARI10)"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      disabled={couponApplied}
                      className="w-full bg-white border border-slate-200 text-xs sm:text-sm text-slate-900 rounded-xl px-3 py-2 uppercase placeholder:normal-case focus:outline-none focus:border-[#0e1f36]"
                    />
                    <Tag className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                  <button
                    type="submit"
                    disabled={couponApplied || !couponCode}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs sm:text-sm font-bold text-[#0e1f36] border border-slate-300 disabled:opacity-50"
                  >
                    {couponApplied ? 'Terpasang' : 'Terapkan'}
                  </button>
                </form>
                {couponApplied && (
                  <p className="text-xs text-emerald-600 font-semibold mt-1.5 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Diskon 10% berhasil dipasang! (-{formatRupiah(discountAmount)})</span>
                  </p>
                )}
                {couponError && (
                  <p className="text-xs text-red-500 mt-1.5">{couponError}</p>
                )}
              </div>

              {/* Order Notes */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1.5">
                  Catatan Pesanan (Opsional):
                </label>
                <textarea
                  rows="2"
                  placeholder="Misal: Request bungkus kado, minta disetting grind size pour over, dll..."
                  value={customerNotes}
                  onChange={(e) => setCustomerNotes(e.target.value)}
                  className="w-full bg-white border border-slate-200 text-xs text-slate-900 rounded-xl p-2.5 focus:outline-none focus:border-[#0070f3]"
                />
              </div>
            </>
          )}
        </div>

        {/* Footer Summary & Checkout Options */}
        {cartItems.length > 0 && (
          <div className="p-5 border-t border-slate-200 bg-slate-50 space-y-3">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal Produk</span>
                <span className="text-slate-900 font-semibold">{formatRupiah(subtotal)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>Diskon Promo</span>
                  <span>-{formatRupiah(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600">
                <span>Ongkos Kirim</span>
                <span className="text-slate-900 font-semibold">
                  {shippingCost === 0 ? <strong className="text-emerald-600 font-bold">Gratis</strong> : formatRupiah(shippingCost)}
                </span>
              </div>
              <div className="flex justify-between text-sm sm:text-base font-extrabold text-slate-900 pt-2 border-t border-slate-200">
                <span>Total Pembayaran</span>
                <span className="text-[#0e1f36]">{formatRupiah(finalTotal)}</span>
              </div>
            </div>

            {/* Two Checkout Methods */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              <button
                onClick={handleCheckoutWhatsApp}
                className="w-full py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white text-sm font-bold flex items-center justify-center gap-2 active:scale-95 transition-all shadow-md shadow-green-500/20"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Checkout via WhatsApp</span>
              </button>

              <button
                onClick={() => setCheckoutModalOpen(true)}
                className="w-full py-3 px-4 rounded-xl bg-[#0e1f36] hover:bg-[#162f52] text-white text-sm font-bold flex items-center justify-center gap-2 active:scale-95 transition-all shadow-md"
              >
                <FileText className="w-4 h-4 text-white" />
                <span>Checkout Online</span>
              </button>
            </div>

            <p className="text-xs text-center text-slate-400">
              Pembayaran aman via QRIS, Bank Transfer BCA, Mandiri, atau Bayar di Showroom Malang.
            </p>
          </div>
        )}

      </div>

      {/* Online Checkout Simulation Modal */}
      {checkoutModalOpen && (
        <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div 
            className="w-full max-w-lg bg-white text-slate-900 rounded-3xl border border-slate-200 shadow-2xl p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setCheckoutModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-900 bg-slate-100"
            >
              <X className="w-4 h-4" />
            </button>

            {!orderSuccess ? (
              <form onSubmit={handleCompleteOnlineOrder} className="space-y-4">
                <div className="border-b border-slate-200 pb-3">
                  <h3 className="text-lg font-bold text-slate-900">Formulir Pengiriman &amp; Pembayaran</h3>
                  <p className="text-xs text-slate-500">Lengkapi data penerima untuk menerbitkan invoice pesanan.</p>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Nama Lengkap</label>
                    <input
                      type="text"
                      required
                      placeholder="Nama Anda"
                      value={customerData.name}
                      onChange={(e) => setCustomerData({ ...customerData, name: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-3 py-2.5 focus:border-[#0070f3] focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Nomor WhatsApp</label>
                      <input
                        type="tel"
                        required
                        placeholder="08123456789"
                        value={customerData.phone}
                        onChange={(e) => setCustomerData({ ...customerData, phone: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-3 py-2.5 focus:border-[#0070f3] focus:bg-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Kota / Kabupaten</label>
                      <input
                        type="text"
                        required
                        placeholder="Kota Malang / Surabaya dll"
                        value={customerData.city}
                        onChange={(e) => setCustomerData({ ...customerData, city: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-3 py-2.5 focus:border-[#0070f3] focus:bg-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Alamat Lengkap Pengiriman</label>
                    <textarea
                      rows="2"
                      required
                      placeholder="Jalan, No Rumah, RT/RW, Kecamatan, Kodepos..."
                      value={customerData.address}
                      onChange={(e) => setCustomerData({ ...customerData, address: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-3 py-2.5 focus:border-[#0070f3] focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Metode Pembayaran</label>
                    <select
                      value={customerData.paymentMethod}
                      onChange={(e) => setCustomerData({ ...customerData, paymentMethod: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-3 py-2.5 focus:border-[#0070f3] focus:bg-white focus:outline-none"
                    >
                      <option value="qris">QRIS (Semua E-Wallet &amp; Mobile Banking)</option>
                      <option value="bca">Transfer Bank BCA (Otomatis)</option>
                      <option value="mandiri">Transfer Bank Mandiri</option>
                      <option value="showroom">Bayar Tunai / EDC di Showroom Sanubari</option>
                    </select>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center text-xs">
                  <span className="text-slate-600">Total Tagihan:</span>
                  <span className="text-base font-extrabold text-[#0e1f36]">{formatRupiah(finalTotal)}</span>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-[#0e1f36] hover:bg-[#162f52] text-white font-bold text-xs uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all shadow-md"
                >
                  Konfirmasi &amp; Terbitkan Pesanan
                </button>
              </form>
            ) : (
              <div className="text-center py-6 space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto text-emerald-600">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Pesanan Berhasil Dibuat!</h3>
                <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
                  Terima kasih, <strong>{customerData.name || 'Kak'}</strong>. Invoice pesananmu telah dicatat di sistem Alat Kopi Malang. Admin kami akan segera menghubungi nomor WhatsApp <strong>{customerData.phone}</strong> untuk konfirmasi packing &amp; bukti bayar.
                </p>
                <div className="p-4 rounded-2xl bg-slate-50 text-xs text-left space-y-1.5 border border-slate-200">
                  <div className="flex justify-between"><span className="text-slate-500">No. Invoice:</span> <strong className="text-slate-900">INV-AKM-{Math.floor(100000 + Math.random() * 900000)}</strong></div>
                  <div className="flex justify-between"><span className="text-slate-500">Total Pembayaran:</span> <strong className="text-[#0e1f36]">{formatRupiah(finalTotal)}</strong></div>
                  <div className="flex justify-between"><span className="text-slate-500">Metode:</span> <strong className="text-slate-900 uppercase">{customerData.paymentMethod}</strong></div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      onClearCart();
                      setCheckoutModalOpen(false);
                      setOrderSuccess(false);
                      onClose();
                    }}
                    className="w-full py-3 rounded-xl bg-[#0e1f36] hover:bg-[#162f52] text-white font-bold text-xs shadow-md transition-all active:scale-95"
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
