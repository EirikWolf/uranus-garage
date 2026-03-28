import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { SessionProvider } from "@/components/session-provider";
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
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        <SessionProvider>
          <Navigation />
          <main className="flex-1">{children}</main>
          <Footer />
        </SessionProvider>
      </body>
    </html>
  );
}
