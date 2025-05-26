import LoginForm from '@/app/ui/login/login-form';
import { Suspense } from 'react';
import AuthPage from '@/app/ui/login/auth-page';

export default function LoginPage() {
  return (
    <div className="flex h-dvh w-screen items-start pt-12 md:pt-0 md:items-center justify-center bg-background">
      <div className="w-full max-w-md overflow-hidden rounded-2xl flex flex-col gap-12">
        <div className="flex flex-col items-center justify-center gap-2 px-4 text-center sm:px-16">
          <h3 className="text-3xl font-semibold dark:text-zinc-50">Sign In</h3>
          <p className="text-m text-gray-500 dark:text-zinc-400">
            Use your email and password to sign in
          </p>
        </div>
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
