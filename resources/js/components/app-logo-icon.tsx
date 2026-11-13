import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export default function AppLogoIcon({
    className,
    ...props
}: HTMLAttributes<HTMLImageElement>) {
    return (
        <img
            {...props}
            src="/brand/logo-akm.jpg?v=20261113"
            alt="Alat Kopi Malang"
            className={cn('rounded-full object-contain', className)}
        />
    );
}
