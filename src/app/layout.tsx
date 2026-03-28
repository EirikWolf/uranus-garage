import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Uranus Garage — Great beer and no cars!",
  description: "Hjemmebryggeri med fokus på håndverk, kunnskap og godt øl.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="no" className="dark">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
