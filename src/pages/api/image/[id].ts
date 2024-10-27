// src/pages/api/image/[id].ts
import { NextApiRequest, NextApiResponse } from 'next';
import { query } from '@/lib/db';
import bcrypt from 'bcryptjs';
import sharp from 'sharp';
import path from 'path';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method === 'GET') {
    const result = await query('SELECT private, filepath FROM images WHERE filename = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Imagem não encontrada' });
    }

    const { private: isPrivate, filepath } = result.rows[0];
    
    const filePath = path.join(process.cwd(), 'public', 'uploads', filepath);

    try {
      const { width, height } = await sharp(filePath).metadata();
      
      return res.status(200).json({ private: isPrivate, filepath, width, height });
    } catch (err) {
      console.error('Erro ao processar a imagem:', err);
      return res.status(500).json({ error: 'Erro ao processar a imagem.' });
    }
  }

  if (req.method === 'POST') {
    const { password } = req.body;
    const result = await query('SELECT password FROM images WHERE filename = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Imagem não encontrada' });
    }

    const { password: hashedPassword } = result.rows[0];

    const accessGranted = hashedPassword ? await bcrypt.compare(password, hashedPassword) : !hashedPassword;
    return res.status(200).json({ accessGranted });
  }

  return res.status(405).json({ error: 'Método não permitido' });
}
