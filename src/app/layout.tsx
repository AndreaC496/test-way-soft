import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Gym Tracker",
  description: "Log training sessions and track consistency and performance.",
};

const NAV_LINKS = [
  { href: "/", label: "Log" },
  { href: "/consistency", label: "Consistency" },
  { href: "/performance", label: "Performance" },
] as const;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-zinc-50 text-zinc-900">
        <nav className="border-b bg-white">
          <div className="mx-auto flex max-w-2xl items-center gap-6 px-6 py-3">
            <span className="font-semibold">Gym Tracker</span>
            <div className="flex gap-4 text-sm">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-zinc-600 hover:text-zinc-950"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </nav>
        <div className="flex-1">{children}</div>
      </body>
    </html>
  );
}
