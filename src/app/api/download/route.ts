import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export default async function POST(request: NextApiRequest, response: NextApiResponse) {
  if (request.method !== 'GET') {
    return response.status(405).end();
  }

  response.setHeader('Content-Disposition', 'attachment; filename=Tuhin_Kairi_Resume.pdf');
  response.setHeader('Content-Type', 'application/text');

  const filePath = path.join(process.cwd(), 'public', 'Tuhin_Kairi_Resume.pdf');

  // Check if the file exists
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'File not found' });
  }

  // Set response headers for file download
  res.setHeader('Content-Disposition', 'attachment; filename=Tuhin_Kairi_Resume.pdf');
  res.setHeader('Content-Type', 'application/pdf');

  // Stream the file to the response
  const fileStream = fs.createReadStream(filePath);
  fileStream.pipe(res);

  fileStream.on('error', (err) => {
    console.error('File stream error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  });

  res.on('close', () => {
    fileStream.destroy(); // Ensure the stream is closed properly
  });
}
