import React from 'react';

interface FilterOption {
    id: string;
    label: string;
}

interface MobileFilterPillsProps {
    options: FilterOption[];
    selected: string;
    onSelect: (id: string) => void;
    className?: string;
}

export const MobileFilterPills: React.FC<MobileFilterPillsProps> = ({
    options,
    selected,
    onSelect,
    className = '',
}) => {
    return (
        <div className={`py-1 ${className}`}>
            <div className="flex flex-wrap items-center gap-2 px-4">
                {options.map((opt) => {
                    const isActive = selected === opt.id;
                    return (
                        <button
                            key={opt.id}
                            type="button"
                            onClick={() => onSelect(opt.id)}
                            className={`px-3.5 py-1.5 rounded-full text-[13px] font-medium tracking-normal transition-colors ${
                                isActive
                                    ? 'bg-brand-700 text-white'
                                    : 'bg-sand-200/50 text-brand-900 hover:bg-sand-200'
                            }`}
                        >
                            {opt.label}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};
