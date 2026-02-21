import { AppShell } from "@/components/app-shell";
import { PlatformGate } from "@/components/platform-gate";

export default function PlatformLayout({ children }: { children: React.ReactNode }) {
  return (
    <PlatformGate>
      <AppShell>{children}</AppShell>
    </PlatformGate>
  );
}
