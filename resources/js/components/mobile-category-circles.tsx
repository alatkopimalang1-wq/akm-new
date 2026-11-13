import React from 'react';
import { Link } from '@inertiajs/react';
import { Coffee, Flame, FlaskConical, Droplets, Mountain, Award, Package, Compass } from 'lucide-react';

interface CategoryItem {
    id: string;
    label: string;
    href: string;
    icon: React.ReactNode;
    badge?: string;
}

export const MobileCategoryCircles: React.FC = () => {
    const items: CategoryItem[] = [
        {
            id: 'kawi',
            label: 'Kopi Kawi',
            href: '/shop?series=kawi',
            icon: <Mountain className="w-6 h-6 text-accent-copper" />,
            badge: 'Signature',
        },
        {
            id: 'co-ferment',
            label: 'CO-Ferment',
            href: '/shop?series=co-ferment',
            icon: <FlaskConical className="w-6 h-6 text-brand-700" />,
            badge: 'Popular',
        },
        {
            id: 'classic',
            label: 'Classic Filter',
            href: '/shop?category=classic-process',
            icon: <Droplets className="w-6 h-6 text-brand-700" />,
        },
        {
            id: 'experimental',
            label: 'Eksperimen',
            href: '/shop?category=experimental-process',
            icon: <Coffee className="w-6 h-6 text-brand-700" />,
        },
        {
            id: 'espresso',
            label: 'Espresso',
            href: '/shop?category=espresso-beans',
            icon: <Flame className="w-6 h-6 text-amber-600" />,
        },
        {
            id: 'houseblend',
            label: 'Houseblend',
            href: '/shop?series=houseblend',
            icon: <Award className="w-6 h-6 text-brand-700" />,
        },
        {
            id: 'tester',
            label: 'Tester 15g',
            href: '/shop?q=tester',
            icon: <Package className="w-6 h-6 text-emerald-600" />,
        },
        {
            id: 'guide',
            label: 'Panduan',
            href: '/panduan-seduh',
            icon: <Compass className="w-6 h-6 text-brand-700" />,
        },
    ];

    return (
        <div className="py-2 px-4">
            <div className="grid grid-cols-4 gap-3">
                {items.slice(0, 4).map((item) => (
                    <Link
                        key={item.id}
                        href={item.href}
                        className="flex flex-col items-center group text-center"
                    >
                        <div className="w-14 h-14 rounded-2xl bg-sand-200/60 group-hover:bg-sand-200 flex items-center justify-center transition-colors">
                            {item.icon}
                        </div>
                        <span className="mt-2 text-[13px] font-medium text-brand-950 line-clamp-1 leading-snug">
                            {item.label}
                        </span>
                    </Link>
                ))}
            </div>
        </div>
    );
};
