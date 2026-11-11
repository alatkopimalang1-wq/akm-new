// Helper formatting utilities

export function formatRupiah(amount) {
  if (typeof amount !== 'number') return 'Rp 0';
  return 'Rp ' + amount.toLocaleString('id-ID');
}

export function generateWhatsAppMessage(items, customerNotes = '', shippingOption = 'ambil-showroom') {
  const brandTitle = '*PESANAN ALAT KOPI MALANG (AKM)*\n_Partner Showroom Sanubari Roastery_\n';
  const divider = '------------------------------------------\n';
  
  let total = 0;
  let itemsText = items.map((item, index) => {
    const itemSubtotal = item.price * item.quantity;
    total += itemSubtotal;
    const variantText = item.selectedVariant ? ` (${item.selectedVariant.label})` : '';
    return `${index + 1}. *${item.name}*${variantText}\n   - Jml: ${item.quantity} x ${formatRupiah(item.price)} = *${formatRupiah(itemSubtotal)}*`;
  }).join('\n\n');

  let shippingText = shippingOption === 'ambil-showroom' 
    ? '📍 *Opsi Pengiriman:* Ambil Langsung di Showroom (Ruko Tlogomas Square Malang)'
    : `🚚 *Opsi Pengiriman:* Ekspedisi Kurir / Instant Malang`;

  let notesText = customerNotes ? `\n📝 *Catatan Pembeli:* ${customerNotes}` : '';

  const totalText = `\n${divider}💰 *TOTAL PESANAN: ${formatRupiah(total)}*\n${divider}`;
  const footer = `\nHalo tim Alat Kopi Malang / Sanubari Roastery! Saya ingin konfirmasi pesanan ini. Mohon info ketersediaan stok & nomor rekening pembayaran. Terima kasih! 🙏☕`;

  const fullMessage = `${brandTitle}${divider}\n${itemsText}${totalText}\n${shippingText}${notesText}\n${footer}`;
  return encodeURIComponent(fullMessage);
}

