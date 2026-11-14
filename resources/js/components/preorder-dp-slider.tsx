import React from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { formatRupiah } from '@/lib/trans';

export const DP_PERCENTAGE_STEPS = [30, 50, 70, 100] as const;
export type DpPercentage = (typeof DP_PERCENTAGE_STEPS)[number];

export function normalizeDpPercentage(val: unknown, minVal?: unknown): DpPercentage {
    const num = Number(val);
    const normalized: DpPercentage =
        num === 30 || num === 50 || num === 70 || num === 100 ? num : 100;

    if (minVal !== undefined) {
        const minNum = Number(minVal);
        const normalizedMin: DpPercentage =
            minNum === 30 || minNum === 50 || minNum === 70 || minNum === 100 ? minNum : 30;
        return (normalized < normalizedMin ? normalizedMin : normalized) as DpPercentage;
    }

    return normalized;
}

export function normalizeMinDpPercentage(val: unknown): DpPercentage {
    const num = Number(val);
    if (num === 30 || num === 50 || num === 70 || num === 100) {
        return num;
    }
    return 30;
}

export function calculateDpBreakdown(totalAmount: number, dpPercentage: number, minDpPercentage?: number) {
    const pct = normalizeDpPercentage(dpPercentage, minDpPercentage);
    const safeTotal = Math.max(0, Math.round(Number(totalAmount) || 0));
    const dpAmount = pct === 100 ? safeTotal : Math.round((safeTotal * pct) / 100);
    const remainingBalance = Math.max(0, safeTotal - dpAmount);

    return {
        dpPercentage: pct,
        isDp: pct < 100,
        fullTotal: safeTotal,
        dpAmount,
        remainingBalance,
        remainingPercentage: 100 - pct,
    };
}

interface PreorderDpSliderProps {
    totalAmount: number;
    dpPercentage: DpPercentage;
    minDpPercentage?: DpPercentage;
    onChange: (nextPercentage: DpPercentage) => void;
    title?: string;
    compact?: boolean;
}

export const PreorderDpSlider: React.FC<PreorderDpSliderProps> = ({
    totalAmount,
    dpPercentage,
    minDpPercentage = 30,
    onChange,
    title = 'Pengaturan Pembayaran DP (Down Payment) Pre-Order',
    compact = false,
}) => {
    const minPct = normalizeMinDpPercentage(minDpPercentage);
    const activePct = normalizeDpPercentage(dpPercentage, minPct);
    const stepIndex = Math.max(0, DP_PERCENTAGE_STEPS.indexOf(activePct));
    const progressPercent = (stepIndex / (DP_PERCENTAGE_STEPS.length - 1)) * 100;

    const breakdown = calculateDpBreakdown(totalAmount, activePct, minPct);

    const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const idx = Number(e.target.value);
        const rawPct = DP_PERCENTAGE_STEPS[idx] ?? 100;
        const clampedPct = (rawPct < minPct ? minPct : rawPct) as DpPercentage;
        onChange(clampedPct);
    };

    return (
        <div
            className={`rounded-2xl border border-amber-300/90 bg-gradient-to-br from-amber-50/80 via-white to-cream-50/70 shadow-2xs ${
                compact ? 'p-3.5 space-y-3' : 'p-4 sm:p-5 space-y-4'
            }`}
        >
            {/* Header */}
            <div className="flex items-start justify-between gap-2.5">
                <div className="flex items-center gap-2 min-w-0">
                    <span className="w-7 h-7 rounded-lg bg-amber-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
                        <SlidersHorizontal className="w-3.5 h-3.5" />
                    </span>
                    <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-1.5">
                            <span className="text-[10px] font-black uppercase tracking-wider text-amber-800">
                                Pre-Order · Down Payment (DP)
                            </span>
                            {minPct > 30 && (
                                <span className="px-1.5 py-0.5 rounded bg-amber-200/80 text-amber-950 text-[9px] font-extrabold uppercase tracking-wider">
                                    Min. DP {minPct}%
                                </span>
                            )}
                        </div>
                        <h3 className="text-xs sm:text-sm font-extrabold text-brand-950 leading-snug">
                            {title}
                        </h3>
                    </div>
                </div>

                <span
                    className={`px-2.5 py-1 rounded-full text-xs font-black tracking-wide shrink-0 border ${
                        activePct === 100
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                            : 'bg-amber-600 text-white border-amber-700 shadow-2xs'
                    }`}
                >
                    {activePct === 100 ? '100% (Lunas)' : `DP ${activePct}%`}
                </span>
            </div>

            {/* Interactive Slide Geser (Range Slider) */}
            <div className="space-y-2.5 pt-1">
                <div className="relative flex items-center h-6">
                    {/* Track Background */}
                    <div className="w-full h-2.5 bg-sand-200 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-amber-500 to-brand-700 transition-all duration-150 rounded-full"
                            style={{ width: `${progressPercent}%` }}
                        />
                    </div>

                    {/* Step Tick Dots on Track */}
                    <div className="absolute inset-x-0 flex items-center justify-between pointer-events-none px-1">
                        {DP_PERCENTAGE_STEPS.map((pct, idx) => {
                            const isPassed = idx <= stepIndex;
                            const isCurrent = idx === stepIndex;
                            return (
                                <span
                                    key={pct}
                                    className={`rounded-full transition-all duration-150 ${
                                        isCurrent
                                            ? 'w-5 h-5 bg-brand-800 border-2 border-white ring-2 ring-amber-500 shadow-sm'
                                            : isPassed
                                                ? 'w-3 h-3 bg-amber-600 border border-white'
                                                : 'w-3 h-3 bg-sand-300 border border-white'
                                    }`}
                                />
                            );
                        })}
                    </div>

                    {/* Native Range Input Overlay for Smooth Dragging / Sliding */}
                    <input
                        type="range"
                        min={0}
                        max={DP_PERCENTAGE_STEPS.length - 1}
                        step={1}
                        value={stepIndex}
                        onChange={handleSliderChange}
                        aria-label="Slide geser persentase Down Payment (DP)"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                </div>

                {/* Clickable Step Labels: 30%, 50%, 70%, 100% (Lunas) */}
                <div className="grid grid-cols-4 gap-1.5">
                    {DP_PERCENTAGE_STEPS.map((pct) => {
                        const isSelected = activePct === pct;
                        const isBelowMin = pct < minPct;
                        return (
                            <button
                                key={pct}
                                type="button"
                                disabled={isBelowMin}
                                title={
                                    isBelowMin
                                        ? `Minimal DP untuk produk ini adalah ${minPct}%`
                                        : undefined
                                }
                                onClick={() => {
                                    if (!isBelowMin) {
                                        onChange(pct);
                                    }
                                }}
                                className={`py-1.5 px-1 rounded-xl text-[11px] sm:text-xs font-extrabold text-center transition-all border ${
                                    isBelowMin
                                        ? 'bg-sand-100 text-brand-400 border-sand-200 opacity-50 cursor-not-allowed line-through'
                                        : isSelected
                                            ? 'bg-brand-900 text-white border-brand-900 shadow-xs cursor-pointer'
                                            : 'bg-white hover:bg-amber-50 text-brand-800 border-sand-200 cursor-pointer'
                                }`}
                            >
                                {pct === 100 ? '100% (Lunas)' : `${pct}%`}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Automatic Calculation & Reduction Box */}
            <div className="pt-2.5 border-t border-amber-200/80 space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-brand-700">
                    <span>Total Harga Penuh (100%):</span>
                    <span className="font-semibold text-brand-950 whitespace-nowrap">
                        {formatRupiah(breakdown.fullTotal)}
                    </span>
                </div>

                {breakdown.isDp ? (
                    <>
                        <div className="flex items-center justify-between text-amber-800">
                            <span>Sisa Pelunasan ({breakdown.remainingPercentage}% — Dikurangi dari Total Sekarang):</span>
                            <span className="font-bold text-red-600 whitespace-nowrap">
                                -{formatRupiah(breakdown.remainingBalance)}
                            </span>
                        </div>
                        <div className="flex items-center justify-between pt-1.5 border-t border-amber-200/60 text-xs sm:text-sm font-black text-brand-950">
                            <span>Total yang Harus Dibayar (DP {breakdown.dpPercentage}%):</span>
                            <span className="text-emerald-700 text-sm sm:text-base whitespace-nowrap">
                                {formatRupiah(breakdown.dpAmount)}
                            </span>
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-brand-600 bg-amber-100/60 px-2.5 py-1.5 rounded-lg border border-amber-200/80">
                            <span>Sisa yang Dilunasi Saat Barang Siap ({breakdown.remainingPercentage}%):</span>
                            <span className="font-bold text-brand-950 whitespace-nowrap">
                                {formatRupiah(breakdown.remainingBalance)}
                            </span>
                        </div>
                    </>
                ) : (
                    <div className="flex items-center justify-between pt-1.5 border-t border-amber-200/60 text-xs sm:text-sm font-black text-brand-950">
                        <span>Total yang Harus Dibayar (100% Lunas):</span>
                        <span className="text-emerald-700 text-sm sm:text-base whitespace-nowrap">
                            {formatRupiah(breakdown.fullTotal)}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
};
