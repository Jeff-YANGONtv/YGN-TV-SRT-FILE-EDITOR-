import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    let body;
    try {
      body = await request.json();
    } catch (e) {
      return NextResponse.json({ success: false, message: "Invalid JSON in request body" }, { status: 400 });
    }

    const { srtContent, movieTitle, season, episode, editorName } = body;

    if (!srtContent || !movieTitle) {
      return NextResponse.json({ success: false, message: "Missing required fields: srtContent or movieTitle" }, { status: 400 });
    }

    // Environment variables validation
    const requiredEnvVars = [
      'GOOGLE_CLIENT_EMAIL',
      'GOOGLE_PRIVATE_KEY',
      'GOOGLE_DRIVE_FOLDER_ID',
      'GOOGLE_SHEET_ID'
    ];
    
    const missingVars = requiredEnvVars.filter(v => !process.env[v]);
    if (missingVars.length > 0) {
      return NextResponse.json({ 
        success: false, 
        message: `Missing environment variables: ${missingVars.join(', ')}` 
      }, { status: 500 });
    }
    
    // ၁။ Auth စစ်ဆေးခြင်း
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const finalTitle = (season && episode) ? `${movieTitle} - S${season}E${episode}` : movieTitle;
    const fileName = `${finalTitle}.srt`;

    // ၂။ Google Auth Setup
    const auth = new google.auth.JWT(
      process.env.GOOGLE_CLIENT_EMAIL,
      undefined,
      process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      ['https://www.googleapis.com/auth/drive', 'https://www.googleapis.com/auth/spreadsheets']
    );

    const drive = google.drive({ version: 'v3', auth });
    const sheets = google.sheets({ version: 'v4', auth });

    // ၃။ Google Drive သို့ သိမ်းဆည်းခြင်း
    const fileMetadata = {
      name: fileName,
      parents: [process.env.GOOGLE_DRIVE_FOLDER_ID!],
    };
    const media = {
      mimeType: 'text/plain',
      body: srtContent,
    };

    const driveResponse = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: 'id',
    });

    // ၄။ Google Sheets တွင် Track လုပ်ခြင်း
    const timestamp = new Date().toLocaleString('en-GB', { timeZone: 'Asia/Yangon' });
    const values = [
      [timestamp, editorName, movieTitle, season || '-', episode || '-', fileName, driveResponse.data.id]
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEET_ID!,
      range: 'Sheet1!A:G',
      valueInputOption: 'USER_ENTERED',
      requestBody: { values },
    });

    // ၅။ Telegram သို့ ပို့ခြင်း
    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const CHANNEL_ID = process.env.TELEGRAM_CHANNEL_ID;

    if (BOT_TOKEN && CHANNEL_ID) {
      const tgFormData = new FormData();
      tgFormData.append('chat_id', CHANNEL_ID);
      
      const blob = new Blob([srtContent], { type: 'text/plain' });
      tgFormData.append('document', blob, fileName);
      tgFormData.append('caption', `🎬 New Subtitle Uploaded!\n\nTitle: ${finalTitle}\nEditor: ${editorName}\nDate: ${timestamp}`);

      await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendDocument`, {
        method: 'POST',
        body: tgFormData,
      });
    }

    const driveFileId = driveResponse?.data?.id;
    if (!driveFileId) {
      throw new Error('Failed to get file ID from Google Drive response');
    }

    return NextResponse.json({
      success: true,
      driveFileId: driveFileId,
      message: 'Successfully saved to Drive, Sheets and Telegram'
    });

  } catch (error: any) {
    console.error('Save All Error:', error);
    // Provide more detailed error information for debugging
    const errorMessage = error.message || 'Unknown error occurred';
    const errorStack = process.env.NODE_ENV === 'development' ? error.stack : undefined;
    
    return NextResponse.json({ 
      success: false, 
      message: errorMessage,
      error: errorMessage,
      details: error.response?.data || errorStack
    }, { status: 500 });
  }
}
