import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const caption = formData.get('caption') as string;

    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const CHANNEL_ID = process.env.TELEGRAM_CHANNEL_ID;

    if (!file || !BOT_TOKEN || !CHANNEL_ID) {
      return NextResponse.json({ error: 'Missing file or configuration' }, { status: 400 });
    }

    // ၁။ Telegram API သို့ ပို့ရန် FormData အသစ် တည်ဆောက်ခြင်း
    const tgFormData = new FormData();
    tgFormData.append('chat_id', CHANNEL_ID);
    tgFormData.append('document', file);
    tgFormData.append('caption', caption);

    // ၂။ Telegram Bot API ဆီသို့ ဖိုင်လှမ်းပို့ခြင်း
    const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendDocument`, {
      method: 'POST',
      body: tgFormData,
    });

    const result = await response.json();

    if (result.ok) {
      return NextResponse.json({
        success: true,
        message_id: result.result.message_id,
        file_id: result.result.document.file_id, // Download ဆွဲဖို့ သုံးမဲ့ ID
      });
    } else {
      return NextResponse.json({ success: false, error: result.description }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Upload Failed' }, { status: 500 });
  }
}