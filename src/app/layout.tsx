import type { Metadata } from "next";
import {
  DM_Serif_Display,
  JetBrains_Mono,
  Playfair_Display,
  Plus_Jakarta_Sans,
} from "next/font/google";
import { AppProvider } from "@/components/providers/app-provider";
import { AuthSessionProvider } from "@/components/providers/session-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
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
  metadataBase: new URL("https://america-first.app"),
  title: {
    default: "America First | Civic Intelligence Platform",
    template: "%s | America First",
  },
  description:
    "A modern civic intelligence experience for trusted, nonpartisan public information.",
  keywords: [
    "civic intelligence",
    "nonpartisan news",
    "government transparency",
    "civic engagement",
    "who represents me",
    "fact verified politics",
  ],
  openGraph: {
    title: "America First | Civic Intelligence Platform",
    description:
      "Understand left/right perspectives, fact-only updates, and historical context in one civic platform.",
    type: "website",
    url: "https://america-first.app",
    siteName: "America First",
  },
  twitter: {
    card: "summary_large_image",
    title: "America First | Civic Intelligence Platform",
    description: "Nonpartisan civic intelligence with source-based fact summaries.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${display.variable} ${heading.variable} ${sans.variable} ${mono.variable} antialiased`}
      >
        <ThemeProvider>
          <AuthSessionProvider>
            <AppProvider>{children}</AppProvider>
          </AuthSessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
