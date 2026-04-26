import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Hey Banco - El Banco 100% Digital",
  description:
    "La aplicación más poderosa para tus finanzas. Administra, ahorra, transfiere, invierte y asegura desde tu app.",
  generator: "v0.app",
};

export const viewport: Viewport = {
  themeColor: "#fcec02",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="bg-background">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
