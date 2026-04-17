import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { BottomNav } from "@/components/ui/BottomNav";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Yangon TV - Production Lab",
  description: "Independent Media Production Terminal",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* ပတ်ဝန်းကျင်တစ်ခုလုံးကို Dark Mode Fix လုပ်ထားပါတယ် */}
      <body className={`${inter.className} bg-[#0b0d11] text-white antialiased`}>
        <ThemeProvider 
          attribute="class" 
          defaultTheme="dark" 
          enableSystem={false}
        >
          {/* Main Content Area */}
          <main className="min-h-screen pb-20 md:pb-0">
            {children}
          </main>

          {/* Mobile Bottom Navigation */}
          <BottomNav />
        </ThemeProvider>
      </body>
    </html>
  );
}