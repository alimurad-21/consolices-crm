import { Suspense } from "react";
import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 px-4">
      {/* Decorative blurred blobs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-blue-400/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-indigo-400/10 blur-3xl" />
      </div>

      <div className="glass-card relative z-10 w-full max-w-md rounded-2xl p-8">
        {/* Brand */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 shadow-lg shadow-blue-500/20">
            <span className="text-lg font-bold text-white">C</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">
            Welcome back
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Sign in to your Consolices CRM account
          </p>
        </div>

        <Suspense fallback={<div className="h-[260px]" />}>
          <LoginForm />
        </Suspense>

        <p className="mt-6 text-center text-xs text-slate-400">
          Invite-only access. Contact your admin for an account.
        </p>
      </div>
    </div>
  );
}
