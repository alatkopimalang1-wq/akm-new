import type { InertiaLinkProps } from '@inertiajs/react';
import { clsx } from 'clsx';
import type { ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function toUrl(url: NonNullable<InertiaLinkProps['href']>): string {
    return typeof url === 'string' ? url : url.url;
}

export interface ParsedCustomNoteLine {
    tag: string | null;
    text: string;
}

export function parseCustomNotes(notes?: string | null): ParsedCustomNoteLine[] {
    if (!notes) return [];

    return String(notes)
        .split(/\n|\s*\|\s*|(?=\[(?:(?:Slot|Item)\s*\d+|(?:Item\s+)?(?:GRATIS|OPSIONAL|OPTIONAL))\])/i)
        .map((rawLine) => rawLine.trim())
        .filter(Boolean)
        .map((line) => {
            const match = line.match(
                /^\[(?:(?:Slot|Item)\s*(\d+)|(?:Item\s+)?(GRATIS|OPSIONAL|OPTIONAL))\]\s*(?:1x\s+)*(\d+x\s+)?(.*)$/i,
            );
            if (!match) {
                return { tag: null, text: line };
            }

            const [, slotNum, specialKind, qty, rest] = match;
            let tag = '[Item]';
            if (slotNum) {
                tag = `[Item ${slotNum}]`;
            } else if (specialKind && specialKind.toUpperCase() === 'GRATIS') {
                tag = '[Item Gratis]';
            } else {
                tag = '[Item Opsional]';
            }

            const normalizedQty = (qty || '1x ').trim();
            return {
                tag,
                text: `${normalizedQty} ${rest.trim()}`.trim(),
            };
        });
}
