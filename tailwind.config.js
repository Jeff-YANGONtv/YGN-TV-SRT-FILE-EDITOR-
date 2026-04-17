import type { Config } from "tailwindcss";

const config: Config = {
  // Dark mode ကို class ကနေ ထိန်းချုပ်မယ်လို့ ကြေညာထားခြင်း
  darkMode: "class", 
  
  // Tailwind အလုပ်လုပ်ရမယ့် ဖိုင်တွေရဲ့ လမ်းကြောင်း
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  
  theme: {
    extend: {
      // ကိုယ်ပိုင် Custom အရောင်များ
      colors: {
        background: "#0b0d11", // Yangon TV Premium Dark Base
      },
      // Page ဝင်ဝင်ချင်း အပေါ်ကို လျှောတက်လာမယ့် Animation
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out forwards',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(15px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
};

export default config;