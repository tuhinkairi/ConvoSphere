import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import * as path from 'path';

export default async function POST(request: NextApiRequest, response: NextApiResponse) {
  if (request.method !== 'GET') {
    return response.status(405).end();
  }

  response.setHeader('Content-Disposition', 'attachment; filename=Tuhin_Kairi_Resume.pdf');
  response.setHeader('Content-Type', 'application/text');

  const filePath = path.join(process.cwd(), 'public', 'Tuhin_Kairi_Resume.pdf');
  const fileStream = fs.createReadStream(filePath);

  fileStream.pipe(response);

  response.on('finish', () => {
    fileStream.close();
  });
}