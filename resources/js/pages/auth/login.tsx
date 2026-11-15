import { Form, Head } from '@inertiajs/react';
import GoogleAuthButton from '@/components/google-auth-button';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { register } from '@/routes';
import { store } from '@/routes/login';
import { request } from '@/routes/password';
import PasskeyVerify from '@/components/passkey-verify';

type Props = {
    status?: string;
    canResetPassword: boolean;
};

export default function Login({ status, canResetPassword }: Props) {
    return (
        <>
            <Head title="Masuk Akun — Alat Kopi Malang" />

            <PasskeyVerify />

            {/* Status notification */}
            {status && (
                <div className="mb-5 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center text-xs sm:text-sm font-semibold text-emerald-800 dark:text-emerald-300">
                    {status}
                </div>
            )}

            <div className="space-y-6">
                {/* 1. GOOGLE LOGIN BUTTON (INSTANT ONE-CLICK & REAL-TIME ONE TAP) */}
                <GoogleAuthButton redirect="/akun" enableOneTap={true} />

                {/* DIVIDER */}
                <div className="relative flex items-center justify-center">
                    <div className="border-t border-sand-300 dark:border-neutral-700 w-full" />
                    <span className="bg-sand-50 dark:bg-neutral-900 px-3 text-xs uppercase tracking-wider text-muted-foreground shrink-0 font-medium">
                        atau masuk dengan email
                    </span>
                    <div className="border-t border-sand-300 dark:border-neutral-700 w-full" />
                </div>

                {/* 2. EMAIL & PASSWORD LOGIN FORM */}
                <div>
                    <Form
                        {...store.form()}
                        resetOnSuccess={['password']}
                        className="flex flex-col gap-5"
                    >
                        {({ processing, errors }) => (
                            <>
                                <div className="grid gap-5">
                                    <div className="grid gap-2">
                                        <Label htmlFor="email">Alamat Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            name="email"
                                            required
                                            autoFocus
                                            tabIndex={1}
                                            autoComplete="email"
                                            placeholder="nama@email.com"
                                            className="h-11"
                                        />
                                        <InputError message={errors.email} />
                                    </div>

                                    <div className="grid gap-2">
                                        <div className="flex items-center">
                                            <Label htmlFor="password">Kata Sandi</Label>
                                            {canResetPassword && (
                                                <TextLink
                                                    href={request()}
                                                    className="ml-auto text-xs text-brand-700 dark:text-neutral-400 hover:text-brand-950 dark:hover:text-white"
                                                    tabIndex={5}
                                                >
                                                    Lupa kata sandi?
                                                </TextLink>
                                            )}
                                        </div>
                                        <PasswordInput
                                            id="password"
                                            name="password"
                                            required
                                            tabIndex={2}
                                            autoComplete="current-password"
                                            placeholder="••••••••"
                                            className="h-11"
                                        />
                                        <InputError message={errors.password} />
                                    </div>

                                    <div className="flex items-center space-x-3">
                                        <Checkbox
                                            id="remember"
                                            name="remember"
                                            tabIndex={3}
                                        />
                                        <Label htmlFor="remember" className="text-xs font-medium cursor-pointer">
                                            Ingat saya
                                        </Label>
                                    </div>

                                    <Button
                                        type="submit"
                                        className="mt-2 w-full h-11 bg-brand-800 hover:bg-brand-900 text-white font-bold text-sm shadow-md transition-all active:scale-95 cursor-pointer"
                                        tabIndex={4}
                                        disabled={processing}
                                        data-test="login-button"
                                    >
                                        {processing && <Spinner className="w-4 h-4 mr-2" />}
                                        Masuk
                                    </Button>
                                </div>

                                <div className="text-center text-xs text-muted-foreground pt-2">
                                    Belum punya akun?{' '}
                                    <TextLink href={register()} tabIndex={5} className="font-semibold text-accent-copper hover:underline">
                                        Daftar sekarang
                                    </TextLink>
                                </div>
                            </>
                        )}
                    </Form>
                </div>
            </div>
        </>
    );
}

Login.layout = {
    title: 'Masuk ke Akun Anda',
    description: 'Pilih masuk mudah lewat Akun Google atau email dan kata sandi',
};
