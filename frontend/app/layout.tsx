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
      <body className="min-h-full flex flex-col bg-gray-50">
        <header className="border-b border-gray-200 bg-white">
          <nav className="mx-auto flex max-w-4xl items-center gap-6 px-4 py-3 text-sm font-medium">
            <span className="font-bold text-blue-600">BaldeCash</span>
            <Link href="/" className="text-gray-600 hover:text-gray-900">
              Nueva solicitud
            </Link>
            <Link href="/solicitudes" className="text-gray-600 hover:text-gray-900">
              Listado
            </Link>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
