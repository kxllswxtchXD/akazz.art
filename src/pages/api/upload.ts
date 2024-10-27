// src/pages/api/upload.ts
import { NextApiRequest, NextApiResponse } from 'next';
import multer from 'multer';
import path from 'path';
import { customAlphabet } from 'nanoid';
import bcrypt from 'bcryptjs';
import { query } from '@/lib/db';

// Configure multer storage
const storage = multer.diskStorage({
  destination: path.join(process.cwd(), 'public', 'uploads'),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname || '');
    const newFilename = `${nanoid()}${ext}`;
    cb(null, newFilename);
  },
});

// Create the multer instance
const upload = multer({ storage });

export const config = {
  api: {
    bodyParser: false,
  },
};

// Define the custom request type with the file property
interface MulterRequest extends NextApiRequest {
  file: Express.Multer.File; // Property for the uploaded file
}

// Create a function to handle the multer middleware
const uploadMiddleware = (req: NextApiRequest, res: NextApiResponse, next: (err?: any) => void) => {
  upload.single('image')(req as any, res as any, next);
};

// Create an instance of nanoid
const nanoid = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 8);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  // Use the custom middleware
  uploadMiddleware(req, res, async (err) => {
    if (err) {
      console.error('Error during file upload:', err);
      return res.status(500).json({ error: 'Erro ao processar o upload' });
    }

    const file = (req as MulterRequest).file; // Use the new MulterRequest type

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
      return res.status(200).json({ link }); // Ensure a response is sent
    } catch (dbError) {
      console.error('Erro ao inserir no banco de dados:', dbError);
      return res.status(500).json({ error: 'Erro ao salvar informações da imagem no banco de dados' });
    }
  });
}
  