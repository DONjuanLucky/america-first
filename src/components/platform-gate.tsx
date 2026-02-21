"use client";

import { useAppState } from "@/components/providers/app-provider";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

export function PlatformGate({ children }: { children: ReactNode }) {
  const { user, ready } = useAppState();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!ready) {
      return;
    }

    if (!user) {
      const nextParam = encodeURIComponent(pathname || "/dashboard");
      router.replace(`/signin?next=${nextParam}`);
    }
  }, [pathname, ready, router, user]);

  if (!ready || !user) {
    return <div className="soft-card rounded-2xl p-6 text-sm text-[#5f6f84]">Loading your civic workspace...</div>;
  }

  return <>{children}</>;
}
