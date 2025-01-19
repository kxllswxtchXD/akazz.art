// src/pages/api/upload.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { query } from '@/lib/db';
import bcrypt from 'bcryptjs';

const MAX_FILE_SIZE = 25 * 1024 * 1024;

const generateRandomName = (length: number = 8): string => {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '25mb',
    },
  },
};

const uploadHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    try {
      const { file, originalName, private: isPrivate, password } = req.body;

      if (!file || !originalName) {
        return res.status(400).json({ error: 'Parâmetros inválidos.' });
      }

      const buffer = Buffer.from(file, 'base64');

      if (buffer.length > MAX_FILE_SIZE) {
        return res.status(400).json({ error: 'O arquivo excede o limite de 25 MB.' });
      }

      const newName = generateRandomName();

      let hashedPassword = null;
      if (isPrivate && password) {
        hashedPassword = await bcrypt.hash(password, 10);
      }

      // Removendo a variável 'id' que não é usada
      const result = await query(
        `
          INSERT INTO images (original_name, new_name, content, private, password)
          VALUES ($1, $2, $3, $4, $5)
          RETURNING new_name
        `,
        [originalName, newName, buffer, isPrivate, hashedPassword]
      );

      const { new_name } = result.rows[0];

      const host = req.headers.host;
      const fileUrl = `https://${host}/${new_name}`;

      return res.status(200).json({ link: fileUrl });
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Erro ao fazer upload:', error.message);
        return res.status(500).json({ error: 'Erro ao fazer upload do arquivo', details: error.message });
      } else {
        console.error('Erro desconhecido:', error);
        return res.status(500).json({ error: 'Erro desconhecido ao fazer upload.' });
      }
    }
  } else {
    return res.status(405).json({ error: 'Método não permitido' });
  }
};

export default uploadHandler;
