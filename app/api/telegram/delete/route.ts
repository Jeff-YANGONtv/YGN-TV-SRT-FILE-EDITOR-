import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  // ၁။ Auth စစ်ဆေးခြင်း
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { searchParams } = new URL(request.url);
  const message_id = searchParams.get('message_id');

  const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const CHANNEL_ID = process.env.TELEGRAM_CHANNEL_ID;

  if (!message_id || !BOT_TOKEN || !CHANNEL_ID) {
    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
  }

  try {
    // Telegram Bot API ကိုသုံးပြီး Channel ထဲက message ကို ဖျက်ခြင်း
    const response = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/deleteMessage`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: CHANNEL_ID,
          message_id: message_id,
        }),
      }
    );

    const result = await response.json();

    if (result.ok) {
      return NextResponse.json({ success: true, message: 'Deleted from Telegram' });
    } else {
      return NextResponse.json({ success: false, error: result.description }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}