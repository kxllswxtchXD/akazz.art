import { IncomingForm, File, Fields, Files } from 'formidable';
import fs from 'fs';
import { promisify } from 'util';
import { customAlphabet } from 'nanoid';
import bcrypt from 'bcryptjs';
import path from 'path';
import { NextApiRequest, NextApiResponse } from 'next';
import { query } from '@/lib/db';
import sharp from 'sharp';

const nanoid = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 8);

const readFile = promisify(fs.readFile);

export const config = {
  api: {
    bodyParser: false,
  },
};

const parseForm = (req: NextApiRequest): Promise<{ fields: Fields; files: Files }> => {
  const form = new IncomingForm({
    multiples: false,
    maxFileSize: 10 * 1024 * 1024 * 1024,
    keepExtensions: true,
  });

  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });
};

const getImageDimensions = async (filePath: string) => {
  const image = await sharp(filePath).metadata();
  return { width: image.width ?? 0, height: image.height ?? 0 };
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido.' });
  }

  try {
    const { fields, files } = await parseForm(req);

    const fileArray = files.file as File | File[] | undefined;
    if (!fileArray) {
      return res.status(400).json({ error: 'Nenhum arquivo foi enviado.' });
    }

    const file = Array.isArray(fileArray) ? fileArray[0] : fileArray;

    const validImageExtensions = [
      '.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.tiff', '.tif', '.heif', '.heic', '.svg', '.ico', '.raw'
    ];

    const validVideoExtensions = [
      '.mp4', '.avi', '.mov', '.mkv', '.webm', '.flv', '.wmv', '.ogv', '.3gp', '.mpeg', '.mpg', '.vob', '.m4v'
    ];

    const validExtensions = [...validImageExtensions, ...validVideoExtensions];

    const fileExtension = file.originalFilename ? path.extname(file.originalFilename).toLowerCase() : '';

    if (!validExtensions.includes(fileExtension)) {
      return res.status(400).json({ error: 'Formato de arquivo não suportado. Envie uma imagem ou vídeo.' });
    }

    const filenameWithoutExt = nanoid();
    const filename = `${filenameWithoutExt}${fileExtension}`;

    const filePath = path.join(process.cwd(), 'public', filename);

    await fs.promises.writeFile(filePath, await readFile(file.filepath));

    let width = 0;
    let height = 0;
    if (validImageExtensions.includes(fileExtension)) {
      const dimensions = await getImageDimensions(filePath);
      width = dimensions.width;
      height = dimensions.height;
    }

    const isPrivate = fields.private?.[0] === 'true';
    const password = fields.password?.[0];

    let hashedPassword: string | null = null;
    if (isPrivate && password) {
      try {
        hashedPassword = await bcrypt.hash(password, 10);
      } catch (err) {
        console.error('Erro ao hashizar a senha:', err);
        return res.status(500).json({ error: 'Erro ao processar a senha.' });
      }
    }

    const protocol = req.headers['x-forwarded-proto'] || 'http';
    const host = req.headers.host;
    const fileURL = `${protocol}://${host}/${filenameWithoutExt}`;

    const result = await query(
      `INSERT INTO files (id, original_name, format, password, created_at, private, width, height) 
      VALUES ($1, $2, $3, $4, NOW(), $5, $6, $7) RETURNING id`,
      [
        filenameWithoutExt,
        file.originalFilename,
        fileExtension.slice(1),
        hashedPassword,
        isPrivate,
        width,
        height
      ]
    );

    const fileId = result.rows[0].id;

    return res.status(200).json({ link: fileURL, id: fileId });
  } catch (error) {
    console.error('Erro durante o upload:', error);

    if (error instanceof Error && error.hasOwnProperty('code') && (error as any).code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'O arquivo é muito grande. Envie arquivos de até 10GB.' });
    }

    return res.status(500).json({ error: 'Erro ao processar o upload.' });
  }
}