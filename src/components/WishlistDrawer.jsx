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
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-sm animate-fade-in flex justify-end">
      <div 
        className="w-full max-w-md bg-[#181615] h-full flex flex-col border-l border-[#292524] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-[#292524] flex items-center justify-between bg-[#1c1917]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-red-500/10 flex items-center justify-center">
              <Heart className="w-5 h-5 text-red-400 fill-red-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#f5f5f4]">Daftar Keinginan (Wishlist)</h3>
              <span className="text-xs text-[#78716c]">{wishlistItems.length} alat tersimpan</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#a8a29e] hover:text-[#f5f5f4] hover:bg-[#292524] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {wishlistItems.length === 0 ? (
            <div className="text-center py-20 space-y-3">
              <Heart className="w-12 h-12 text-[#78716c] mx-auto opacity-50" />
              <h4 className="text-base font-bold text-[#f5f5f4]">Wishlist Masih Kosong</h4>
              <p className="text-xs text-[#78716c] max-w-xs mx-auto">
                Tekan tombol hati pada produk alat kopi yang kamu minati untuk menyimpannya di sini.
              </p>
            </div>
          ) : (
            wishlistItems.map((item) => (
              <div 
                key={item.id}
                className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#1c1917] border border-[#292524]"
              >
                <img
                  src={item.images[0]}
                  alt={item.name}
                  className="w-16 h-16 rounded-xl object-cover shrink-0 bg-[#24201d]"
                />
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] uppercase font-bold text-[#c2a676]">{item.brand}</span>
                  <h4 className="text-xs font-bold text-[#f5f5f4] truncate">{item.name}</h4>
                  <span className="text-xs font-extrabold text-[#f5f5f4] block mt-1">
                    {formatRupiah(item.price)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      onAddToCart(item);
                      onRemoveFromWishlist(item.id);
                    }}
                    className="p-2.5 rounded-xl bg-[#c2a676] text-[#141211] hover:brightness-110 active:scale-95 transition-all"
                    title="Pindahkan ke Keranjang"
                  >
                    <ShoppingBag className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onRemoveFromWishlist(item.id)}
                    className="p-2.5 rounded-xl bg-[#292524] text-[#ef4444] hover:bg-[#38332f] transition-all"
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

