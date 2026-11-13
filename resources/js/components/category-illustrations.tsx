import React from 'react';

interface SubcategoryIconProps {
    name: string;
    className?: string;
}

export const SubcategoryIcon: React.FC<SubcategoryIconProps> = ({ name, className = 'w-8 h-8' }) => {
    switch (name) {
        case 'coffee-beans':
            return (
                <svg viewBox="0 0 48 48" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M24 6C16.268 6 10 13.163 10 22c0 9.941 7.163 19 16 19 7.732 0 14-7.163 14-16 0-9.941-7.163-19-16-19Z"
                        fill="#D9B382"
                        fillOpacity="0.4"
                    />
                    <path
                        d="M23 9c-5.5 1-9 5.5-9 12.5 0 8.5 5 15.5 12 16.5 5.5-1 9-5.5 9-12.5 0-8.5-5-15.5-12-16.5Z"
                        stroke="#8C5E32"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                    />
                    <path
                        d="M17 18c3 2 4 8 1 12m10-15c-3 4-2 11 1 15"
                        stroke="#5A3A1A"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                    />
                </svg>
            );

        case 'coffee-capsule':
            return (
                <svg viewBox="0 0 48 48" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M15 16l3 18h12l3-18H15Z"
                        fill="#C28A4D"
                        fillOpacity="0.3"
                        stroke="#8C5E32"
                        strokeWidth="2.5"
                        strokeLinejoin="round"
                    />
                    <ellipse cx="24" cy="16" rx="10" ry="3.5" fill="#E8CBA3" stroke="#8C5E32" strokeWidth="2.5" />
                    <line x1="12" y1="36" x2="36" y2="36" stroke="#5A3A1A" strokeWidth="3" strokeLinecap="round" />
                </svg>
            );

        case 'drip-bag':
            return (
                <svg viewBox="0 0 48 48" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
                    <rect x="13" y="14" width="22" height="24" rx="3" fill="#E8D5B5" fillOpacity="0.4" stroke="#8C5E32" strokeWidth="2.5" />
                    <path d="M13 22h22" stroke="#8C5E32" strokeWidth="2" strokeDasharray="2 2" />
                    <path d="M7 20h6v12H7a2 2 0 01-2-2V22a2 2 0 012-2Zm34 0h-6v12h6a2 2 0 002-2V22a2 2 0 00-2-2Z" fill="#F4EADB" stroke="#8C5E32" strokeWidth="2" strokeLinejoin="round" />
                    <circle cx="24" cy="30" r="2" fill="#8C5E32" />
                </svg>
            );

        case 'cold-brew':
            return (
                <svg viewBox="0 0 48 48" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
                    <rect x="16" y="16" width="16" height="24" rx="4" fill="#3D2B1F" fillOpacity="0.25" stroke="#3D2B1F" strokeWidth="2.5" />
                    <path d="M21 8h6v8h-6z" fill="#C28A4D" stroke="#8C5E32" strokeWidth="2" />
                    <rect x="20" y="6" width="8" height="3" rx="1" fill="#5A3A1A" />
                    <rect x="19" y="24" width="10" height="10" rx="1" fill="#F4EADB" stroke="#8C5E32" strokeWidth="1.5" />
                    <path d="M22 28h4m-4 3h3" stroke="#8C5E32" strokeWidth="1.2" strokeLinecap="round" />
                </svg>
            );

        case 'green-bean':
            return (
                <svg viewBox="0 0 48 48" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M24 8c-7 0-13 6-13 14 0 9 7 17 15 17 7 0 13-6 13-14 0-9-7-17-15-17Z"
                        fill="#7A9A60"
                        fillOpacity="0.3"
                        stroke="#5B6E4E"
                        strokeWidth="2.5"
                    />
                    <path
                        d="M20 18c3 2 4 7 1 11m8-13c-3 4-2 10 1 13"
                        stroke="#45543B"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                    />
                    <path d="M24 6c1-3 4-4 7-4" stroke="#5B6E4E" strokeWidth="2" strokeLinecap="round" />
                </svg>
            );

        case 'specialty-ferment':
            return (
                <svg viewBox="0 0 48 48" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 8h6v8l9 18a3 3 0 01-2.7 4.5H14.7A3 3 0 0112 34l9-18V8Z" fill="#C28A4D" fillOpacity="0.2" stroke="#8C5E32" strokeWidth="2.5" strokeLinejoin="round" />
                    <path d="M19 8h10" stroke="#8C5E32" strokeWidth="2.5" strokeLinecap="round" />
                    <path d="M16 28h16" stroke="#A06F32" strokeWidth="2" strokeDasharray="3 2" />
                    <circle cx="21" cy="33" r="1.5" fill="#8C5E32" />
                    <circle cx="26" cy="31" r="2" fill="#8C5E32" />
                </svg>
            );

        case 'dripper':
            return (
                <svg viewBox="0 0 48 48" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 12l9 22h10l9-22H10Z" fill="#E8CBA3" fillOpacity="0.4" stroke="#8C5E32" strokeWidth="2.5" strokeLinejoin="round" />
                    <path d="M6 12h36" stroke="#5A3A1A" strokeWidth="3" strokeLinecap="round" />
                    <path d="M34 16c4 0 6 2 6 5s-2 5-6 5" stroke="#8C5E32" strokeWidth="2.5" strokeLinecap="round" />
                    <line x1="16" y1="38" x2="32" y2="38" stroke="#8C5E32" strokeWidth="3" strokeLinecap="round" />
                </svg>
            );

        case 'paper-filter':
            return (
                <svg viewBox="0 0 48 48" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 14l12 24 12-24H12Z" fill="#FFF9ED" stroke="#D9B382" strokeWidth="2.5" strokeLinejoin="round" />
                    <path d="M12 14c4 4 20 4 24 0" stroke="#8C5E32" strokeWidth="2" strokeLinecap="round" />
                    <path d="M24 16v22" stroke="#E8D5B5" strokeWidth="1.5" strokeDasharray="2 2" />
                </svg>
            );

        case 'kettle':
            return (
                <svg viewBox="0 0 48 48" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
                    <path d="M14 20c0-2 2-6 8-6h8c6 0 8 4 8 6v14a4 4 0 01-4 4H18a4 4 0 01-4-4V20Z" fill="#D9D9D9" fillOpacity="0.5" stroke="#4B5563" strokeWidth="2.5" strokeLinejoin="round" />
                    <path d="M14 26c-6-1-10 4-8 12" stroke="#374151" strokeWidth="2.5" strokeLinecap="round" />
                    <path d="M34 22c5-1 9 2 9 7s-4 8-9 7" stroke="#374151" strokeWidth="2.5" strokeLinecap="round" />
                    <circle cx="26" cy="11" r="2" fill="#374151" />
                    <line x1="22" y1="14" x2="30" y2="14" stroke="#374151" strokeWidth="2.5" />
                </svg>
            );

        case 'manual-grinder':
            return (
                <svg viewBox="0 0 48 48" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
                    <rect x="17" y="16" width="14" height="24" rx="2" fill="#C28A4D" fillOpacity="0.25" stroke="#5A3A1A" strokeWidth="2.5" />
                    <line x1="17" y1="28" x2="31" y2="28" stroke="#8C5E32" strokeWidth="2" />
                    <line x1="24" y1="16" x2="24" y2="10" stroke="#374151" strokeWidth="2.5" strokeLinecap="round" />
                    <path d="M24 10h12a3 3 0 013 3v2" stroke="#374151" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="39" cy="15" r="2.5" fill="#8C5E32" />
                </svg>
            );

        case 'scale':
            return (
                <svg viewBox="0 0 48 48" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
                    <rect x="10" y="14" width="28" height="24" rx="5" fill="#1F2937" fillOpacity="0.1" stroke="#374151" strokeWidth="2.5" />
                    <rect x="15" y="28" width="18" height="6" rx="1.5" fill="#111827" />
                    <text x="18" y="33" fill="#10B981" fontSize="5" fontFamily="monospace" fontWeight="bold">250.0</text>
                    <circle cx="24" cy="20" r="3" stroke="#9CA3AF" strokeWidth="1.5" />
                </svg>
            );

        case 'server':
            return (
                <svg viewBox="0 0 48 48" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 12h12v4l7 18a4 4 0 01-3.7 5.5H14.7A4 4 0 0111 34l7-18v-4Z" fill="#E0F2FE" fillOpacity="0.5" stroke="#0284C7" strokeWidth="2.5" strokeLinejoin="round" />
                    <path d="M34 20c5 0 8 3 8 7s-3 7-8 7" stroke="#0284C7" strokeWidth="2.5" strokeLinecap="round" />
                    <line x1="16" y1="12" x2="32" y2="12" stroke="#0369A1" strokeWidth="2.5" strokeLinecap="round" />
                    <path d="M14 28h18" stroke="#38BDF8" strokeWidth="1.5" strokeDasharray="3 2" />
                </svg>
            );

        case 'espresso-home':
            return (
                <svg viewBox="0 0 48 48" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
                    <rect x="12" y="10" width="24" height="28" rx="4" fill="#E5E7EB" stroke="#374151" strokeWidth="2.5" />
                    <circle cx="24" cy="18" r="4" fill="#F3F4F6" stroke="#374151" strokeWidth="1.5" />
                    <rect x="18" y="24" width="12" height="4" rx="1" fill="#374151" />
                    <line x1="24" y1="28" x2="32" y2="31" stroke="#374151" strokeWidth="2" strokeLinecap="round" />
                    <rect x="16" y="34" width="16" height="2" rx="1" fill="#9CA3AF" />
                </svg>
            );

        case 'espresso-commercial':
            return (
                <svg viewBox="0 0 48 48" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
                    <rect x="8" y="12" width="32" height="26" rx="3" fill="#D1D5DB" fillOpacity="0.6" stroke="#1F2937" strokeWidth="2.5" />
                    <rect x="12" y="22" width="7" height="6" rx="1" fill="#374151" />
                    <rect x="29" y="22" width="7" height="6" rx="1" fill="#374151" />
                    <line x1="20" y1="16" x2="28" y2="16" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" />
                    <rect x="10" y="34" width="28" height="2" fill="#4B5563" />
                </svg>
            );

        case 'electric-grinder':
            return (
                <svg viewBox="0 0 48 48" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 8h10l-2 8H21l-2-8Z" fill="#E5E7EB" stroke="#374151" strokeWidth="2" strokeLinejoin="round" />
                    <rect x="18" y="16" width="12" height="24" rx="2" fill="#1F2937" stroke="#1F2937" strokeWidth="2" />
                    <rect x="20" y="24" width="8" height="12" rx="1" fill="#9CA3AF" />
                    <circle cx="24" cy="20" r="1.5" fill="#EF4444" />
                </svg>
            );

        case 'barista-tools':
            return (
                <svg viewBox="0 0 48 48" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 12h6v8l-7 14h16l-7-14v-8Z" fill="#C28A4D" fillOpacity="0.3" stroke="#8C5E32" strokeWidth="2.5" strokeLinejoin="round" />
                    <line x1="16" y1="36" x2="32" y2="36" stroke="#5A3A1A" strokeWidth="3" strokeLinecap="round" />
                    <circle cx="24" cy="9" r="3" fill="#8C5E32" />
                </svg>
            );

        case 'syrups':
            return (
                <svg viewBox="0 0 48 48" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
                    <rect x="17" y="16" width="14" height="24" rx="3" fill="#FDE68A" fillOpacity="0.4" stroke="#D97706" strokeWidth="2.5" />
                    <line x1="24" y1="16" x2="24" y2="10" stroke="#78350F" strokeWidth="2" />
                    <path d="M20 10h8l-2-3h-4l-2 3Z" fill="#78350F" />
                    <rect x="19" y="24" width="10" height="10" rx="1" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="1" />
                </svg>
            );

        case 'powder':
            return (
                <svg viewBox="0 0 48 48" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 20c0 10 5 18 12 18s12-8 12-18H12Z" fill="#86EFAC" fillOpacity="0.4" stroke="#16A34A" strokeWidth="2.5" strokeLinejoin="round" />
                    <line x1="10" y1="20" x2="38" y2="20" stroke="#15803D" strokeWidth="2.5" strokeLinecap="round" />
                    <path d="M22 10l4 8" stroke="#A16207" strokeWidth="2" strokeLinecap="round" />
                </svg>
            );

        case 'tea':
            return (
                <svg viewBox="0 0 48 48" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
                    <path d="M14 20a10 10 0 0020 0H14Z" fill="#FED7AA" fillOpacity="0.4" stroke="#EA580C" strokeWidth="2.5" strokeLinejoin="round" />
                    <path d="M34 22c3 0 5 2 5 4s-2 4-5 4" stroke="#EA580C" strokeWidth="2" strokeLinecap="round" />
                    <path d="M18 14c2-2 4-2 6 0s4 2 6 0" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" />
                </svg>
            );

        case 'milk':
            return (
                <svg viewBox="0 0 48 48" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
                    <path d="M16 16l4-6h8l4 6v22a2 2 0 01-2 2H18a2 2 0 01-2-2V16Z" fill="#DBEAFE" fillOpacity="0.6" stroke="#2563EB" strokeWidth="2.5" strokeLinejoin="round" />
                    <rect x="20" y="24" width="8" height="8" rx="1" fill="#93C5FD" />
                    <text x="21" y="30" fill="#1E40AF" fontSize="5" fontWeight="bold">MILK</text>
                </svg>
            );

        case 'apparel':
            return (
                <svg viewBox="0 0 48 48" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
                    <path d="M16 10l-6 5 4 6 4-3v18h20V18l4 3 4-6-6-5c-3 3-9 3-12 0-3 3-9 3-12 0Z" fill="#E5E7EB" stroke="#374151" strokeWidth="2.5" strokeLinejoin="round" />
                    <circle cx="24" cy="24" r="2" fill="#5B6E4E" />
                </svg>
            );

        case 'apron':
            return (
                <svg viewBox="0 0 48 48" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 10h12v8l6 8v14H12V26l6-8v-8Z" fill="#D97706" fillOpacity="0.25" stroke="#92400E" strokeWidth="2.5" strokeLinejoin="round" />
                    <path d="M18 10c0-4 3-6 6-6s6 2 6 6" stroke="#92400E" strokeWidth="2" strokeLinecap="round" />
                    <rect x="18" y="28" width="12" height="8" rx="1" stroke="#92400E" strokeWidth="1.5" />
                </svg>
            );

        case 'tumbler':
            return (
                <svg viewBox="0 0 48 48" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
                    <path d="M16 12h16l-3 26a2 2 0 01-2 2h-6a2 2 0 01-2-2l-3-26Z" fill="#5B6E4E" fillOpacity="0.3" stroke="#5B6E4E" strokeWidth="2.5" strokeLinejoin="round" />
                    <rect x="15" y="8" width="18" height="4" rx="1" fill="#374151" stroke="#374151" strokeWidth="1" />
                    <line x1="17" y1="22" x2="31" y2="22" stroke="#5B6E4E" strokeWidth="1.5" />
                </svg>
            );

        case 'gift':
            return (
                <svg viewBox="0 0 48 48" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
                    <rect x="10" y="18" width="28" height="20" rx="3" fill="#FEE2E2" stroke="#DC2626" strokeWidth="2.5" />
                    <rect x="8" y="14" width="32" height="6" rx="1" fill="#FECACA" stroke="#DC2626" strokeWidth="2" />
                    <line x1="24" y1="14" x2="24" y2="38" stroke="#DC2626" strokeWidth="2.5" />
                    <path d="M24 14c-4-4-8-4-8 0s4 4 8 0Zm0 0c4-4 8-4 8 0s-4 4-8 0Z" stroke="#DC2626" strokeWidth="2" />
                </svg>
            );

        default:
            return (
                <svg viewBox="0 0 48 48" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
                    <circle cx="24" cy="24" r="16" fill="#F3F4F6" stroke="#9CA3AF" strokeWidth="2.5" />
                    <path d="M20 24h8m-4-4v8" stroke="#4B5563" strokeWidth="2" strokeLinecap="round" />
                </svg>
            );
    }
};

