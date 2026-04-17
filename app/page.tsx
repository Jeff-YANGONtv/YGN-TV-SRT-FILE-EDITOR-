import { redirect } from 'next/navigation';

export default function Home() {
  // Domain ထဲဝင်တာနဲ့ Login page ဆီကို တန်းပို့ပေးမှာပါ
  redirect('/login');
}