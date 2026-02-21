import type { Metadata } from "next";
import {
  DM_Serif_Display,
  JetBrains_Mono,
  Playfair_Display,
  Plus_Jakarta_Sans,
} from "next/font/google";
import { AppProvider } from "@/components/providers/app-provider";
import { AuthSessionProvider } from "@/components/providers/session-provider";
import "./globals.css";

const display = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["600", "700", "800", "900"],
});

const heading = DM_Serif_Display({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400"],
});

const sans = Plus_Jakarta_Sans({
  variable: "--font-sans-ui",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const mono = JetBrains_Mono({
  variable: "--font-mono-data",
  subsets: ["latin"],
  weight: ["400", "600"],
});

export const metadata: Metadata = {
  title: "America First | Civic Intelligence Platform",
  description:
    "A modern civic intelligence experience for trusted, nonpartisan public information.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${display.variable} ${heading.variable} ${sans.variable} ${mono.variable} antialiased`}
      >
        <AuthSessionProvider>
          <AppProvider>{children}</AppProvider>
        </AuthSessionProvider>
      </body>
    </html>
  );
}
