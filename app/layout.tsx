import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// Google Font ကို အသုံးပြုထားခြင်း
const inter = Inter({ subsets: ["latin"] });

// Website ရဲ့ Title နဲ့ Description (SEO အတွက်ပါ အဆင်သင့်)
export const metadata: Metadata = {
  title: "Yangon TV - Production Lab",
  description: "Subtitle Editor Group & Production Terminal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} min-h-screen flex flex-col selection:bg-blue-500/30`}>
        {/* Page တွေ အကုန်လုံး ဒီ {children} နေရာမှာ ဝင်လာပါမယ် */}
        {children}
      </body>
    </html>
  );
}