import { NextApiRequest, NextApiResponse } from 'next';
import { query } from '@/lib/db';
import bcrypt from 'bcryptjs';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  // Handle GET request to fetch image details
  if (req.method === 'GET') {
    const result = await query('SELECT private, base64 FROM images WHERE filename = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: '画像が見つかりません' });
    }

    const { private: isPrivate, base64 } = result.rows[0];

    // Respond with image details (base64 content)
    return res.status(200).json({ private: isPrivate, base64 });
  }

  // Handle POST request for password authentication
  if (req.method === 'POST') {
    const { password } = req.body;
    const result = await query('SELECT password FROM images WHERE filename = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: '画像が見つかりません' });
    }

    const { password: hashedPassword } = result.rows[0];

    const accessGranted = hashedPassword ? await bcrypt.compare(password, hashedPassword) : !hashedPassword;
    return res.status(200).json({ accessGranted });
  }

  // Return 405 for unsupported methods
  return res.status(405).json({ error: '許可されていないメソッドです' });
}
