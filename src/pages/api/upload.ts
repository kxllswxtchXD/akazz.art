// src/pages/api/upload.ts

import { IncomingForm, File, Fields, Files } from 'formidable';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import { customAlphabet } from 'nanoid';
import bcrypt from 'bcryptjs';
import { query } from '@/lib/db';
import { NextApiRequest, NextApiResponse } from 'next';

const nanoid = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 8);

const mkdir = promisify(fs.mkdir);
const rename = promisify(fs.rename);

export const config = {
  api: {
    bodyParser: false,
  },
};

const parseForm = (req: NextApiRequest): Promise<{ fields: Fields; files: Files }> => {
  const form = new IncomingForm({ multiples: false });

  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: '許可されていないメソッドです' });
  }

  try {
    const { fields, files } = await parseForm(req);

    console.log('Files:', files);
    console.log('Fields:', fields);

    const fileArray = files.image as File[] | File | undefined;
    if (!fileArray) {
      return res.status(400).json({ error: 'ファイルが送信されていません。' });
    }

    const file = Array.isArray(fileArray) ? fileArray[0] : fileArray;

    // Determine upload directory based on environment
    const uploadDir = process.env.NODE_ENV === 'production'
      ? path.join('/tmp', 'uploads') // Temporary directory for production
      : path.join(process.cwd(), 'public', 'uploads'); // Local directory for development

    await mkdir(uploadDir, { recursive: true });

    const ext = path.extname(file.originalFilename || '');
    const newFilename = `${nanoid()}${ext}`;
    const newFilePath = path.join(uploadDir, newFilename);

    await rename(file.filepath, newFilePath);

    const isPrivate = fields.private?.[0] === 'true';
    const password = fields.password?.[0];

    let hashedPassword: string | null = null;
    if (isPrivate && password) {
      try {
        hashedPassword = await bcrypt.hash(password, 10);
      } catch (err) {
        console.error('パスワードのハッシュ化中にエラーが発生しました:', err);
        return res.status(500).json({ error: 'パスワードの処理中にエラーが発生しました。' });
      }
    }

    const filenameWithoutExt = path.basename(newFilename, ext);

    await query(
      'INSERT INTO images (filename, filepath, private, password) VALUES ($1, $2, $3, $4)',
      [filenameWithoutExt, newFilename, isPrivate, hashedPassword || null]
    );

    const link = `/s/${newFilename}`;
    return res.status(200).json({ link });
  } catch (error) {
    console.error('アップロードエラー:', error);
    return res.status(500).json({ error: 'アップロード処理中にエラーが発生しました。' });
  }
}
