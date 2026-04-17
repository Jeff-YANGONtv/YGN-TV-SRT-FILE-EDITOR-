import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { SplashScreen } from "@/components/ui/SplashScreen";
import { BottomNav } from "@/components/ui/BottomNav";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Yangon TV - Production Lab",
  description: "Premium Subtitle Management System by Zin Ko Ko Lwin",
  manifest: "/manifest.json", // PWA အတွက်
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-slate-50 dark:bg-[#0b0d11] transition-colors duration-500`}>
        <ThemeProvider attribute="class" defaultTheme="dark">
          <SplashScreen />
          <main className="min-h-screen pb-24 md:pb-0">
            {children}
          </main>
          <BottomNav />
        </ThemeProvider>
      </body>
    </html>
  );
}