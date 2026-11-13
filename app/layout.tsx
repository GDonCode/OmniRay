import type { Metadata, Viewport } from "next";
import { Geist_Mono, Space_Grotesk } from "next/font/google";
import { Header } from "@/components/header";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://omniray.org"),
  title: { default: "OmniRay", template: "%s | OmniRay" },
  description: "OmniRay Software Solutions",
};

export const viewport: Viewport = {
  themeColor: "#0F2747",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col"><Header />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
