// src/pages/api/upload.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import multer from 'multer';
import path from 'path';
import { customAlphabet } from 'nanoid';
import bcrypt from 'bcryptjs';
import { query } from '@/lib/db';

const storage = multer.diskStorage({
  destination: path.join(process.cwd(), 'public', 'uploads'),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname || '');
    const newFilename = `${nanoid()}${ext}`;
    cb(null, newFilename);
  },
});

const upload = multer({ storage });

export const config = {
  api: {
    bodyParser: false,
  },
};

const nanoid = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 8);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  upload.single('image')(req as any, res as any, async (err) => {
    if (err) {
      console.error('Error during file upload:', err);
      return res.status(500).json({ error: 'Erro ao processar o upload' });
    }

    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: 'Nenhuma imagem foi enviada.' });
    }

    const isPrivate = req.body.private === 'true';
    const password = req.body.password;

    let hashedPassword: string | null = null;
    if (isPrivate && password) {
      try {
        hashedPassword = await bcrypt.hash(password, 10);
      } catch (hashError) {
        console.error('Error hashing password:', hashError);
        return res.status(500).json({ error: 'Erro ao processar a senha' });
      }
    }

    try {
      const filenameWithoutExt = path.basename(file.filename, path.extname(file.filename));
      await query(
        'INSERT INTO images (filename, filepath, private, password) VALUES ($1, $2, $3, $4)',
        [filenameWithoutExt, file.filename, isPrivate, hashedPassword || null]
      );

      const link = `/s/${file.filename}`;
      return res.status(200).json({ link });
    } catch (dbError) {
      console.error('Erro ao inserir no banco de dados:', dbError);
      return res.status(500).json({ error: 'Erro ao salvar informações da imagem no banco de dados' });
    }
  });
}
