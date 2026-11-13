import React from 'react';

interface SectionHeadingProps {
    title: string;
    subtitle?: string;
    align?: 'left' | 'center' | 'right';
    light?: boolean;
    className?: string;
    eyebrow?: string;
    italicWord?: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
    title,
    subtitle,
    align = 'left',
    light = false,
    className = '',
}) => {
    const alignClass = {
        left: 'text-left',
        center: 'text-center mx-auto',
        right: 'text-right ml-auto',
    }[align];

    return (
        <div className={`max-w-2xl ${alignClass} ${className}`}>
            <h2
                className={`text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight ${
                    light ? 'text-white' : 'text-brand-950'
                }`}
            >
                {title}
            </h2>
            {subtitle && (
                <p
                    className={`mt-2 text-sm sm:text-base leading-relaxed ${
                        light ? 'text-brand-200' : 'text-brand-600'
                    }`}
                >
                    {subtitle}
                </p>
            )}
        </div>
    );
};
