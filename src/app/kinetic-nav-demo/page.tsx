import { SterlingGateKineticNavigation } from "@/components/ui/sterling-gate-kinetic-navigation";

export default function KineticNavDemoPage() {
  return (
    <main className="min-h-screen">
      <SterlingGateKineticNavigation />
      <section className="mx-auto max-w-5xl px-4 py-12 md:px-8">
        <h1 className="font-heading text-4xl text-[#11294a] md:text-5xl">Kinetic Navigation Demo</h1>
        <p className="mt-3 max-w-2xl text-[#4f6482]">
          This is the integrated GSAP navigation style adapted for the America First palette.
          Open the menu to see animated overlays, shape transitions, and full route links.
        </p>
      </section>
    </main>
  );
}
