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
  title: "BaldeCash · Solicitudes de financiamiento",
  description: "Módulo de solicitudes de financiamiento de BaldeCash",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900">
        <header className="border-b border-slate-200 bg-white">
          <nav className="mx-auto flex max-w-4xl items-center gap-6 px-4 py-3 text-sm font-medium">
            <span className="flex items-center gap-2 font-bold text-[#029b93]">
              <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#feca52]" />
              BaldeCash
            </span>
            <Link href="/" className="text-slate-600 hover:text-[#029b93]">
              Nueva solicitud
            </Link>
            <Link href="/solicitudes" className="text-slate-600 hover:text-[#029b93]">
              Listado
            </Link>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
