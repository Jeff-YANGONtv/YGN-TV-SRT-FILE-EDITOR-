#  Yangon TV - Production Lab (v1.0)

 Premium Subtitle Editing & QC Management System 

##  Key Features
- **Premium UI:** Glassmorphism Effect များ၊ Electric Blue Glow နှင့် Dark Mode Toggle ပါဝင်သည်။
- **Telegram Storage:** Telegram Channel ကို Unlimited Storage Database အဖြစ် အသုံးပြုထားသည်။
- **Advanced Editor:** Real-time Video Preview၊ Subtitle Syncing နှင့် Blank Line Clearing tools များ ပါဝင်သည်။ (Waveform Scanning coming soon)
- **Series Management:** Season နှင့် Episode အလိုက် စနစ်တကျ မှတ်တမ်းတင်နိုင်သည်။
- **Mobile Optimized:** လက်ဖြင့် အလွယ်တကူ ထိန်းချုပ်နိုင်ရန် Bottom Navigation Tab Menu ပါဝင်သည်။

## 🛠 Tech Stack
- **Frontend:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS + Framer Motion
- **Database:** Supabase
- **Storage:** Telegram Bot API
- **Icons:** Lucide React

## 🚀 Setup Instructions

### Local Development
1. Clone the repository
2. Install dependencies: `npm install`
3. Configure `.env.local` with your Supabase, Google, and Telegram Bot keys (see `.env.example`)
4. Run development server: `npm run dev`
5. Open http://localhost:3000

### Vercel Deployment
For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)

Quick start:
1. Push code to GitHub
2. Go to https://vercel.com/new
3. Import your repository
4. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `GOOGLE_CLIENT_EMAIL`
   - `GOOGLE_PRIVATE_KEY`
   - `GOOGLE_DRIVE_FOLDER_ID`
   - `GOOGLE_SHEET_ID`
   - `TELEGRAM_BOT_TOKEN`
   - `TELEGRAM_CHANNEL_ID`
5. Deploy!

## 🔐 Authentication

This project uses **Supabase Authentication** with SSR (Server-Side Rendering) support:
- **Sign Up:** `/` (Register new account)
- **Login:** `/login` (Sign in with email/password)
- **Protected Routes:** `/edit/*` (Requires authentication)

**Note:** Email confirmation is required for new accounts.

## 📝 Recent Updates

- ✅ Integrated Real-time Video Player with subtitle sync
- ✅ Standardized SRT Parsing logic across the app
- ✅ Added missing Auth Callback route for Supabase
- ✅ Secured Telegram Delete API with authentication
- ✅ Improved mobile UI and Save button positioning
- ✅ Updated documentation and configuration examples

## 👤 Developer 
-  **Jeff**  **(project founder)**

## 📄 License
See LICENSE file for details
