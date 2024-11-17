import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

export async function GET() {
  const filePath = path.join(process.cwd(), 'public', 'Tuhin_Kairi_Resume.pdf');

  // Check if the file exists
  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ error: 'File not found' }, { status: 404 });
  }

  // Convert Node.js Readable stream to Web Stream
  const fileStream = fs.createReadStream(filePath);
  const readableStream = new ReadableStream({
    start(controller) {
      fileStream.on('data', (chunk) => controller.enqueue(chunk));
      fileStream.on('end', () => controller.close());
      fileStream.on('error', (err) => controller.error(err));
    },
  });

  const headers = new Headers({
    'Content-Disposition': 'attachment; filename=Tuhin_Kairi_Resume.pdf',
    'Content-Type': 'application/pdf',
  });

  return new Response(readableStream, { headers });
}
