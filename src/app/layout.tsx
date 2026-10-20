import type { Metadata } from "next";
import { Geist_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { GhostFibers } from "@/components/ghost-fibers";
import { Providers } from "@/components/providers";
import { cn } from "@/lib/utils";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: { default: "1one", template: "%s — 1one" },
  description: "Gestão de produtos e custos em um só lugar",
  other: {
    "darkreader-lock": "true",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      suppressHydrationWarning
      className={cn(
        "h-full",
        "bg-background",
        "antialiased",
        "font-sans",
        spaceGrotesk.variable,
        geistMono.variable,
      )}
    >
      <body className="min-h-full flex flex-col bg-transparent">
        <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
          <GhostFibers
            glowColor="#00664E"
            secondaryColor="#05DC7F"
            lineColor="#152E2B"
            vignette={0.5}
            brightness={0.9}
          />
        </div>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
