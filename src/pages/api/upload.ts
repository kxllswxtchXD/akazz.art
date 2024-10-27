// src/pages/api/upload.ts
import { NextApiRequest, NextApiResponse } from 'next';
import multer from 'multer';
import path from 'path';
import { customAlphabet } from 'nanoid';
import bcrypt from 'bcryptjs';
import { query } from '@/lib/db';
import { promises as fs } from 'fs';

// nanoidのインスタンスを作成
const nanoid = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 8);

// Multerストレージの設定
const storage = multer.diskStorage({
  destination: path.join(process.cwd(), 'public', 'uploads'),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname || '');
    const newFilename = `${nanoid()}${ext}`;
    cb(null, newFilename);
  },
});

const upload = multer({ storage });

// APIの設定
export const config = {
  api: {
    bodyParser: false, // 必ずfalseにする（ファイルの解析をMulterに任せる）
  },
};

// ヘルパー関数: ファイルアップロードをPromiseでラップ
const handleFileUpload = (req: NextApiRequest): Promise<Express.Multer.File> =>
  new Promise((resolve, reject) => {
    upload.single('image')(req as any, {} as any, (err: any) => {
      if (err) return reject(err);
      const file = (req as any).file;
      if (!file) return reject(new Error('画像が送信されていません。'));
      resolve(file);
    });
  });

// アップロードエンドポイントのハンドラー関数
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: '許可されていないメソッド' });
  }

  try {
    // ファイルのアップロードを処理
    const file = await handleFileUpload(req);

    const isPrivate = req.body.private === 'true';
    const password = req.body.password;

    let hashedPassword: string | null = null;
    if (isPrivate && password) {
      try {
        hashedPassword = await bcrypt.hash(password, 10);
      } catch (hashError) {
        console.error('パスワードハッシュ処理中のエラー:', hashError);
        return res.status(500).json({ error: 'パスワード処理中のエラー' });
      }
    }

    const filenameWithoutExt = path.basename(file.filename, path.extname(file.filename));

    // データベースに画像の情報を保存
    await query(
      'INSERT INTO images (filename, filepath, private, password) VALUES ($1, $2, $3, $4)',
      [filenameWithoutExt, file.filename, isPrivate, hashedPassword || null]
    );

    const link = `/s/${file.filename}`;
    return res.status(200).json({ link });
  } catch (error) {
    console.error('アップロードエラー:', error);
    return res.status(500).json({ error: 'アップロード処理中のエラーが発生しました。' });
  }
}
