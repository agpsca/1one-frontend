import type { Metadata } from "next";
import { Geist_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
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
      lang="en"
      suppressHydrationWarning
      className={cn(
        "h-full",
        "antialiased",
        "font-sans",
        spaceGrotesk.variable,
        geistMono.variable,
      )}
    >
      <body className="min-h-full flex flex-col">
        <Providers>{children}</Providers>
        {/* TEMPORÁRIO — script de captura do MCP do Figma (generate_figma_design).
            Gated em dev para nunca chegar a produção. Remover depois de capturar. */}
        {process.env.NODE_ENV !== "production" && (
          <script
            async
            src="https://mcp.figma.com/mcp/html-to-design/capture.js"
          />
        )}
      </body>
    </html>
  );
}
