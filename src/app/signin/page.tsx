"use client";

import { useAppState } from "@/components/providers/app-provider";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { signIn as authSignIn } from "next-auth/react";
import { FormEvent, useEffect, useState } from "react";

export default function SignInPage() {
  const { ready, user } = useAppState();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [zip, setZip] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [nextPath, setNextPath] = useState("/dashboard");
  const router = useRouter();

  useEffect(() => {
    const url = new URL(window.location.href);
    const requestedPath = url.searchParams.get("next");
    if (requestedPath) {
      setNextPath(requestedPath);
    }
  }, []);

  useEffect(() => {
    if (ready && user) {
      router.replace(nextPath);
    }
  }, [nextPath, ready, router, user]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      if (mode === "signup") {
        const signUpResponse = await fetch("/api/auth/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name.trim(),
            email: email.trim(),
            password,
            zip: zip.trim(),
          }),
        });

        if (!signUpResponse.ok) {
          const data = (await signUpResponse.json()) as { error?: string };
          setError(data.error ?? "Unable to create account.");
          return;
        }
      }

      const result = await authSignIn("credentials", {
        email: email.trim(),
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password.");
        return;
      }

      router.replace(nextPath);
      router.refresh();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl items-center px-4 py-8 md:px-8">
      <section className="grid w-full gap-4 lg:grid-cols-[1.1fr_1fr]">
        <article className="relative overflow-hidden rounded-3xl border border-[#d2dde9] bg-[#0a1628] p-8 text-white md:p-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_15%,rgba(212,160,23,0.22),transparent_42%),radial-gradient(circle_at_85%_80%,rgba(26,58,107,0.75),transparent_45%)]" />
          <div className="relative z-10">
            <p className="text-xs font-semibold tracking-[0.14em] text-[#d8e1ee]">SECURE ACCESS</p>
            <h1 className="font-display mt-2 text-5xl leading-[0.95]">Welcome Back</h1>
            <p className="mt-4 max-w-md text-[#d8e1ee]">
              Sign in to sync your civic profile, tracked representatives, issue focus, and personalized dashboard.
            </p>
            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/35 bg-white/10 px-3 py-1.5 text-sm">
              <ShieldCheck className="h-4 w-4 text-[#d4a017]" />
              No political ad tracking. No data selling.
            </div>
          </div>
        </article>

        <article className="glass-card rounded-3xl p-6 md:p-8">
          <h2 className="font-heading text-3xl text-[#11294a]">Sign in</h2>
          <p className="mt-1 text-sm text-[#5f6f84]">Access your account or create one for personalized civic intelligence.</p>

          <div className="mt-4 inline-flex rounded-xl bg-[#ecf1f8] p-1 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setMode("signin")}
              className={`rounded-lg px-3 py-2 ${mode === "signin" ? "bg-white text-[#11294a]" : "text-[#5f6f84]"}`}
            >
              Sign in
            </button>
            <button
              type="button"
              onClick={() => setMode("signup")}
              className={`rounded-lg px-3 py-2 ${mode === "signup" ? "bg-white text-[#11294a]" : "text-[#5f6f84]"}`}
            >
              Create account
            </button>
          </div>

          <form className="mt-5 space-y-3" onSubmit={handleSubmit}>
            <button
              type="button"
              onClick={() => void authSignIn("google", { callbackUrl: nextPath })}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#cad6e6] bg-white px-4 py-3 text-sm font-semibold text-[#11294a] transition hover:bg-[#f4f8fd]"
            >
              Continue with Google
            </button>

            <div className="my-2 text-center text-xs uppercase tracking-[0.08em] text-[#7e8fa8]">or use email</div>

            {mode === "signup" && (
              <label className="block text-sm font-semibold text-[#11294a]">
                Full name
                <input
                  required
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className="mt-1 h-11 w-full rounded-xl border border-[#cad6e6] bg-white px-3 text-sm outline-none focus:border-[#1a3a6b]"
                  placeholder="Alex Carter"
                />
              </label>
            )}
            <label className="block text-sm font-semibold text-[#11294a]">
              Email
              <input
                required
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="mt-1 h-11 w-full rounded-xl border border-[#cad6e6] bg-white px-3 text-sm outline-none focus:border-[#1a3a6b]"
                placeholder="you@email.com"
              />
            </label>

            <label className="block text-sm font-semibold text-[#11294a]">
              Password
              <input
                required
                type="password"
                minLength={8}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="mt-1 h-11 w-full rounded-xl border border-[#cad6e6] bg-white px-3 text-sm outline-none focus:border-[#1a3a6b]"
                placeholder="Minimum 8 characters"
              />
            </label>

            {mode === "signup" && (
              <label className="block text-sm font-semibold text-[#11294a]">
                ZIP code
                <input
                  required
                  pattern="[0-9]{5}"
                  value={zip}
                  onChange={(event) => setZip(event.target.value)}
                  className="mt-1 h-11 w-full rounded-xl border border-[#cad6e6] bg-white px-3 text-sm outline-none focus:border-[#1a3a6b]"
                  placeholder="10019"
                />
              </label>
            )}

            {error && <p className="rounded-lg bg-[#fff2ee] px-3 py-2 text-sm text-[#9b352b]">{error}</p>}

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#1a3a6b] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#234a85]"
            >
              {isSubmitting ? "Please wait..." : mode === "signin" ? "Continue to dashboard" : "Create account and continue"}
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        </article>
      </section>
    </main>
  );
}
