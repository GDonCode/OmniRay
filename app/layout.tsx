import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Newsreader, Space_Grotesk } from "next/font/google";
import { Footer } from "@/components/footer";
import { GlowBackground } from "@/components/GlowBackground";
import { Header } from "@/components/header";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#000000",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://omniray.org"),
  title: { default: "OmniRay", template: "%s | OmniRay" },
  description:
    "OmniRay is a software studio that designs, builds and ships web platforms, apps and internal tools.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${newsreader.variable} ${spaceGrotesk.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#111111]">
        {/* One dark shell for every page: solid #111, dot grid and glow sit behind the content. */}
        <div className="relative isolate flex min-h-svh flex-1 flex-col overflow-x-clip bg-[#111111] text-white">
          <GlowBackground />
          <Header />
          <div className="flex flex-1 flex-col">{children}</div>
          <Footer />
        </div>
      </body>
    </html>
  );
}
