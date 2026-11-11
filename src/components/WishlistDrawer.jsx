import React from 'react';
import { X, Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { formatRupiah } from '../utils/format';

export default function WishlistDrawer({ 
  isOpen, 
  onClose, 
  wishlistItems, 
  onAddToCart, 
  onRemoveFromWishlist 
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm animate-fade-in flex justify-end">
      <div 
        className="w-full max-w-md bg-white text-slate-900 h-full flex flex-col border-l border-slate-200 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center">
              <Heart className="w-5 h-5 text-red-500 fill-red-500" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Daftar Keinginan (Wishlist)</h3>
              <span className="text-xs text-slate-500">{wishlistItems.length} alat tersimpan</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-200/80 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {wishlistItems.length === 0 ? (
            <div className="text-center py-20 space-y-3">
              <Heart className="w-12 h-12 text-slate-300 mx-auto" />
              <h4 className="text-base font-bold text-slate-900">Wishlist Masih Kosong</h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Tekan tombol hati pada produk alat kopi yang kamu minati untuk menyimpannya di sini.
              </p>
            </div>
          ) : (
            wishlistItems.map((item) => (
              <div 
                key={item.id}
                className="flex items-center gap-3 p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs"
              >
                <img
                  src={item.images[0]}
                  alt={item.name}
                  className="w-16 h-16 rounded-xl object-cover shrink-0 bg-slate-100 border border-slate-200"
                />
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] uppercase font-bold text-[#0070f3]">{item.brand}</span>
                  <h4 className="text-xs font-bold text-slate-900 truncate">{item.name}</h4>
                  <span className="text-xs font-extrabold text-slate-900 block mt-1">
                    {formatRupiah(item.price)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      onAddToCart(item);
                      onRemoveFromWishlist(item.id);
                    }}
                    className="p-2.5 rounded-xl bg-gradient-to-r from-[#0070f3] to-[#0052cc] text-white hover:brightness-110 active:scale-95 transition-all shadow-md shadow-blue-500/25"
                    title="Pindahkan ke Keranjang"
                  >
                    <ShoppingBag className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onRemoveFromWishlist(item.id)}
                    className="p-2.5 rounded-xl bg-slate-100 text-red-500 hover:bg-red-50 hover:text-red-700 transition-all"
                    title="Hapus"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
