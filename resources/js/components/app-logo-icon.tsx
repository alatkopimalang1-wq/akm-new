import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export default function AppLogoIcon({
    className,
    ...props
}: HTMLAttributes<HTMLImageElement>) {
    return (
        <img
            {...props}
            src="/brand/logo-akm.png?v=20261113b"
            alt="Alat Kopi Malang"
            className={cn('rounded-full object-contain', className)}
        />
    );
}
