export function t(
    val: Record<string, string> | string | null | undefined,
    locale: string = 'id',
    fallback: string = ''
): string {
    if (!val) return fallback;
    if (typeof val === 'string') return val;
    return val[locale] || val['id'] || val['en'] || Object.values(val)[0] || fallback;
}

export function formatRupiah(amount: number): string {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount).replace('IDR', 'Rp');
}
