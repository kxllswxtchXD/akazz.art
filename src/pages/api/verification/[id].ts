// src/pages/api/verification/[id].ts
import { NextApiRequest, NextApiResponse } from 'next';
import { query } from '@/lib/db';
import bcrypt from 'bcryptjs';

const verificationHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: 'ID da imagem não fornecido.' });
  }

  if (req.method === 'GET') {
    try {
      const result = await query(
        `SELECT id, original_name, new_name, content, private, password FROM images WHERE new_name = $1`,
        [id]
      );

      const image = result.rows[0];

      if (!image) {
        return res.status(404).json({ error: 'Imagem não encontrada.' });
      }

      const fileType = 'image';

      return res.status(200).json({
        id: image.id,
        original_name: image.original_name,
        new_name: image.new_name,
        content: image.content.toString('base64'),
        type: fileType,
        private: image.private,
        password: image.password,
      });

    } catch (error) {
      console.error('Erro ao verificar imagem:', error);
      return res.status(500).json({ error: 'Erro ao buscar dados da imagem.' });
    }
  } else if (req.method === 'POST') {
    try {
      const { password } = req.body;
      const result = await query(
        `SELECT password FROM images WHERE new_name = $1`,
        [id]
      );

      const image = result.rows[0];

      if (!image || !image.password) {
        return res.status(404).json({ error: 'Imagem não encontrada ou não é privada.' });
      }

      const isPasswordCorrect = await bcrypt.compare(password, image.password);

      if (isPasswordCorrect) {
        return res.status(200).json({ success: true });
      } else {
        return res.status(403).json({ error: 'Senha incorreta.' });
      }

    } catch (error) {
      console.error('Erro ao verificar senha:', error);
      return res.status(500).json({ error: 'Erro ao verificar senha.' });
    }
  } else {
    return res.status(405).json({ error: 'Método não permitido.' });
  }
};

export default verificationHandler;
