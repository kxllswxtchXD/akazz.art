// src/pages/api/upload.ts
import { NextApiRequest, NextApiResponse } from 'next';
import multer from 'multer';
import path from 'path';
import { customAlphabet } from 'nanoid';
import bcrypt from 'bcryptjs';
import { query } from '@/lib/db';

// Multerストレージの設定
const storage = multer.diskStorage({
  destination: path.join(process.cwd(), 'public', 'uploads'),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname || '');
    const newFilename = `${nanoid()}${ext}`;
    cb(null, newFilename);
  },
});

// Multerインスタンスの作成
const upload = multer({ storage });

// API設定
export const config = {
  api: {
    bodyParser: false,
  },
};

// MulterRequestインターフェースの定義
interface MulterRequest extends NextApiRequest {
  file: Express.Multer.File; // アップロードされたファイルのプロパティ
}

// Multerミドルウェアを処理する関数
const uploadMiddleware = (req: MulterRequest, res: NextApiResponse, next: (err?: unknown) => void) => {
  upload.single('image')(req as any, res as any, next); // any型として指定
};

// nanoidのインスタンスを作成
const nanoid = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 8);

// アップロードエンドポイントのハンドラー関数
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: '許可されていないメソッド' });
  }

  // カスタムミドルウェアを使用
  uploadMiddleware(req as MulterRequest, res, async (err) => {
    if (err) {
      console.error('ファイルアップロード中のエラー:', err);
      return res.status(500).json({ error: 'アップロード処理中のエラー' });
    }

    const file = (req as MulterRequest).file; // 新しいMulterRequest型を使用

    if (!file) {
      return res.status(400).json({ error: '画像が送信されていません。' });
    }

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

    try {
      const filenameWithoutExt = path.basename(file.filename, path.extname(file.filename));
      await query(
        'INSERT INTO images (filename, filepath, private, password) VALUES ($1, $2, $3, $4)',
        [filenameWithoutExt, file.filename, isPrivate, hashedPassword || null]
      );

      const link = `/s/${file.filename}`;
      return res.status(200).json({ link }); // 応答が送信されることを確認
    } catch (dbError) {
      console.error('データベースへの挿入中のエラー:', dbError);
      return res.status(500).json({ error: 'データベースに画像情報を保存中のエラー' });
    }
  });
}
