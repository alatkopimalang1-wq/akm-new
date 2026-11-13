import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export default function AppLogoIcon({
    className,
    ...props
}: HTMLAttributes<HTMLImageElement>) {
    return (
        <img
            {...props}
            src="/brand/logo-circle.png"
            alt="Sanubari Roastery"
            className={cn('rounded-full object-contain', className)}
        />
    );
}
