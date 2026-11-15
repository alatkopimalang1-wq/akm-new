import React from 'react';

export interface BrandData {
    id?: number;
    name: string;
    slug: string;
    origin?: string | null;
    logo?: string | null;
    description?: string | null;
    products_count?: number;
    sort_order?: number;
}

interface BrandAvatarProps {
    brand: BrandData;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    showVerified?: boolean;
    className?: string;
}

const BRAND_PALETTES: Record<string, { bg: string; border: string; text: string; label: string; isAkm?: boolean }> = {
    'alat-kopi-malang': {
        bg: 'bg-[#F0F2FE]',
        border: 'border-[#CBD5F5]',
        text: 'text-[#374151]',
        label: 'ALAT KOPI MALANG',
        isAkm: true,
    },
    'hario': {
        bg: 'bg-[#E0F2FE]',
        border: 'border-[#BAE6FD]',
        text: 'text-[#0284C7]',
        label: 'HARIO',
    },
    'comandante': {
        bg: 'bg-[#FEF3C7]',
        border: 'border-[#FDE68A]',
        text: 'text-[#B45309]',
        label: 'C40',
    },
    'fellow': {
        bg: 'bg-[#F1F5F9]',
        border: 'border-[#CBD5E1]',
        text: 'text-[#1E293B]',
        label: 'FELLOW',
    },
    'timemore': {
        bg: 'bg-[#FFE4E6]',
        border: 'border-[#FECDD3]',
        text: 'text-[#E11D48]',
        label: 'TIME',
    },
    'gemilai': {
        bg: 'bg-[#DCFCE7]',
        border: 'border-[#BBF7D0]',
        text: 'text-[#15803D]',
        label: 'GEMILAI',
    },
    'otten-coffee': {
        bg: 'bg-[#FFEDD5]',
        border: 'border-[#FED7AA]',
        text: 'text-[#C2410C]',
        label: 'OTTEN',
    },
    'aura-living': {
        bg: 'bg-[#F3E8FF]',
        border: 'border-[#E9D5FF]',
        text: 'text-[#7E22CE]',
        label: 'AURA',
    },
    'studiosound': {
        bg: 'bg-[#CCFBF1]',
        border: 'border-[#99F6E4]',
        text: 'text-[#0F766E]',
        label: 'SOUND',
    },
    'hyperstride': {
        bg: 'bg-[#FFEDD5]',
        border: 'border-[#FDBA74]',
        text: 'text-[#EA580C]',
        label: 'STRIDE',
    },
    'stealth-urban': {
        bg: 'bg-[#E2E8F0]',
        border: 'border-[#94A3B8]',
        text: 'text-[#334155]',
        label: 'STEALTH',
    },
    'mechcraft': {
        bg: 'bg-[#FEF3C7]',
        border: 'border-[#FCD34D]',
        text: 'text-[#B45309]',
        label: 'MECH',
    },
    'la-marzocco': {
        bg: 'bg-[#FEE2E2]',
        border: 'border-[#FECACA]',
        text: 'text-[#991B1B]',
        label: 'MARZOCCO',
    },
    'mahlkonig': {
        bg: 'bg-[#FEF9C3]',
        border: 'border-[#FEF08A]',
        text: 'text-[#854D0E]',
        label: 'EK43',
    },
    'breville': {
        bg: 'bg-[#F1F5F9]',
        border: 'border-[#CBD5E1]',
        text: 'text-[#0F172A]',
        label: 'BREVILLE',
    },
    'rocket-espresso': {
        bg: 'bg-[#F8FAFC]',
        border: 'border-[#E2E8F0]',
        text: 'text-[#0F172A]',
        label: 'ROCKET',
    },
    'nuova-simonelli': {
        bg: 'bg-[#FEF2F2]',
        border: 'border-[#FCA5A5]',
        text: 'text-[#B91C1C]',
        label: 'SIMONELLI',
    },
    'aeropress': {
        bg: 'bg-[#FEF2F2]',
        border: 'border-[#FECACA]',
        text: 'text-[#DC2626]',
        label: 'AERO',
    },
    'bodum': {
        bg: 'bg-[#FFF1F2]',
        border: 'border-[#FECDD3]',
        text: 'text-[#BE123C]',
        label: 'BODUM',
    },
    'cafec': {
        bg: 'bg-[#ECFDF5]',
        border: 'border-[#A7F3D0]',
        text: 'text-[#047857]',
        label: 'CAFEC',
    },
    'normcore': {
        bg: 'bg-[#F8FAFC]',
        border: 'border-[#E2E8F0]',
        text: 'text-[#1E293B]',
        label: 'NORMCORE',
    },
    'kruve': {
        bg: 'bg-[#F0FDF4]',
        border: 'border-[#BBF7D0]',
        text: 'text-[#166534]',
        label: 'KRUVE',
    },
    'flair-espresso': {
        bg: 'bg-[#FFF7ED]',
        border: 'border-[#FFEDD5]',
        text: 'text-[#C2410C]',
        label: 'FLAIR',
    },
    'soy-turkiye': {
        bg: 'bg-[#FFFBEB]',
        border: 'border-[#FDE68A]',
        text: 'text-[#B45309]',
        label: 'SOY',
    },
    'monin': {
        bg: 'bg-[#FFF7ED]',
        border: 'border-[#FED7AA]',
        text: 'text-[#9A3412]',
        label: 'MONIN',
    },
    'metallurgica-motta': {
        bg: 'bg-[#F1F5F9]',
        border: 'border-[#CBD5E1]',
        text: 'text-[#334155]',
        label: 'MOTTA',
    },
    'ims-filtri': {
        bg: 'bg-[#EFF6FF]',
        border: 'border-[#BFDBFE]',
        text: 'text-[#1D4ED8]',
        label: 'IMS',
    },
    'edelmann': {
        bg: 'bg-[#F8FAFC]',
        border: 'border-[#CBD5E1]',
        text: 'text-[#475569]',
        label: 'EDELMANN',
    },
};

const FALLBACK_PALETTES = [
    { bg: 'bg-[#E0F2FE]', border: 'border-[#BAE6FD]', text: 'text-[#0369A1]' },
    { bg: 'bg-[#FEF3C7]', border: 'border-[#FDE68A]', text: 'text-[#B45309]' },
    { bg: 'bg-[#DCFCE7]', border: 'border-[#BBF7D0]', text: 'text-[#15803D]' },
    { bg: 'bg-[#F3E8FF]', border: 'border-[#E9D5FF]', text: 'text-[#7E22CE]' },
    { bg: 'bg-[#FFE4E6]', border: 'border-[#FECDD3]', text: 'text-[#BE123C]' },
    { bg: 'bg-[#FFEDD5]', border: 'border-[#FED7AA]', text: 'text-[#C2410C]' },
    { bg: 'bg-[#CCFBF1]', border: 'border-[#99F6E4]', text: 'text-[#0F766E]' },
];

function getFallbackPalette(str: string) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const idx = Math.abs(hash) % FALLBACK_PALETTES.length;
    return FALLBACK_PALETTES[idx];
}

export function BrandAvatar({
    brand,
    size = 'md',
    showVerified = false,
    className = '',
}: BrandAvatarProps) {
    const slug = (brand.slug || '').toLowerCase().trim();
    const config = BRAND_PALETTES[slug];
    const fallback = getFallbackPalette(brand.name || slug || 'brand');

    const bgClass = config?.bg || fallback.bg;
    const borderClass = config?.border || fallback.border;
    const textClass = config?.text || fallback.text;
    const labelText = config?.label || (brand.name ? (brand.name.length > 8 ? brand.name.slice(0, 7) : brand.name).toUpperCase() : 'BRAND');

    const sizeClasses = {
        sm: 'w-12 h-12 text-[10px]',
        md: 'w-16 h-16 sm:w-[72px] sm:h-[72px] text-xs',
        lg: 'w-20 h-20 sm:w-24 sm:h-24 text-sm sm:text-base',
        xl: 'w-24 h-24 sm:w-28 sm:h-28 text-base sm:text-lg',
    }[size];

    const logoUrl = React.useMemo(() => {
        if (!brand.logo) return null;
        if (brand.logo.startsWith('http://') || brand.logo.startsWith('https://')) return brand.logo;
        const clean = brand.logo.replace(/^\/?(public\/|storage\/)?/, '');
        return `/storage/${clean}`;
    }, [brand.logo]);

    return (
        <div className={`relative inline-flex items-center justify-center shrink-0 ${className}`}>
            <div
                className={`${sizeClasses} ${bgClass} border-2 ${borderClass} rounded-full flex items-center justify-center overflow-hidden transition-all duration-200 select-none shadow-xs`}
            >
                {logoUrl ? (
                    <img
                        src={logoUrl}
                        alt={brand.name}
                        className="w-4/5 h-4/5 object-contain"
                        onError={(e) => {
                            // On image load error, fallback to stylized text
                            (e.target as HTMLElement).style.display = 'none';
                        }}
                    />
                ) : config?.isAkm ? (
                    // Pixel-matched AKM Dripper & Typography
                    <div className="flex flex-col items-center justify-center px-1 text-center">
                        <svg className="w-6 h-6 sm:w-7 sm:h-7 text-slate-800" viewBox="0 0 40 40" fill="none" stroke="currentColor">
                            {/* Coffee V60 Dripper Icon matching Image 1 */}
                            <path d="M7 11h26l-7 15H14L7 11z" strokeWidth="2.2" strokeLinejoin="round" />
                            <path d="M11 11l4 15M29 11l-4 15M20 11v15" strokeWidth="1.5" strokeLinecap="round" />
                            <path d="M12 26h16v3H12v-3z" strokeWidth="2" strokeLinejoin="round" />
                            <path d="M9 29h22" strokeWidth="2.5" strokeLinecap="round" />
                            <path d="M33 13h4a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-4" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                        <span className="text-[7.5px] sm:text-[8.5px] font-black leading-tight tracking-tight text-slate-900 mt-0.5">
                            ALAT KOPI
                        </span>
                        <span className="text-[6.5px] sm:text-[7.5px] font-extrabold leading-none text-slate-700 tracking-tighter">
                            MALANG
                        </span>
                    </div>
                ) : (
                    <span
                        className={`${textClass} font-black uppercase text-center leading-tight tracking-wider px-1 max-w-full break-words`}
                        style={{
                            letterSpacing: labelText.length <= 4 ? '0.08em' : '0.02em',
                        }}
                    >
                        {labelText}
                    </span>
                )}
            </div>

            {/* Blue Verified Checkmark Badge matching Image 1 */}
            {showVerified && (
                <div
                    className="absolute -bottom-0.5 -right-0.5 sm:bottom-0 sm:right-0 w-4 h-4 sm:w-5 sm:h-5 bg-[#2563EB] text-white rounded-full border-2 border-white flex items-center justify-center shadow-xs"
                    title="Verified Brand"
                >
                    <svg
                        className="w-2.5 h-2.5 sm:w-3 sm:h-3 stroke-current"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <polyline points="20 6 9 17 4 12" />
                    </svg>
                </div>
            )}
        </div>
    );
}
