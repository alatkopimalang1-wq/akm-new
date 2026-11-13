import { createInertiaApp, router } from '@inertiajs/react';
import { AnimateUIProvider } from '@animate-ui/react/provider';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { initializeTheme } from '@/hooks/use-appearance';
import AppLayout from '@/layouts/app-layout';
import AuthLayout from '@/layouts/auth-layout';
import SettingsLayout from '@/layouts/settings/layout';

import { CartProvider } from '@/context/cart-context';
import { GlobalCoffeeBeanLoader } from '@/components/global-coffee-bean-loader';
import { trackPageView } from '@/lib/meta-pixel';

const appName = import.meta.env.VITE_APP_NAME || 'Sanubari Roastery';

void createInertiaApp({
    title: (title) => (title ? `${title}` : appName),
    defaults: {
        visitOptions: () => ({
            viewTransition: true,
        }),
    },
    layout: (name) => {
        switch (true) {
            case name.startsWith('auth/'):
                return AuthLayout;
            case name.startsWith('settings/'):
                return [AppLayout, SettingsLayout];
            case name === 'dashboard':
                return AppLayout;
            default:
                return null;
        }
    },
    strictMode: true,
    withApp(app) {
        return (
            <AnimateUIProvider tempo={1}>
                <TooltipProvider delayDuration={0}>
                    <CartProvider>
                        <GlobalCoffeeBeanLoader />
                        {app}
                        <Toaster />
                    </CartProvider>
                </TooltipProvider>
            </AnimateUIProvider>
        );
    },
    progress: {
        color: '#c28a4d',
    },
});

// This will set light / dark mode on load...
initializeTheme();

// Track Meta Pixel PageView on client-side Inertia navigations (first visit is handled by Blade base script)
let isInitialVisit = true;
router.on('navigate', () => {
    if (isInitialVisit) {
        isInitialVisit = false;
        return;
    }
    trackPageView();
});

