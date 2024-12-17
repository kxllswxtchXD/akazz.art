import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs'; // Biblioteca para hash de senhas
import { query } from '@/lib/db'; // Função para consulta ao banco de dados

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  // Verificar se o ID é válido
  if (typeof id !== 'string') {
    return res.status(400).json({ error: 'ID inválido' });
  }

  // Tratamento para o método GET (Obter informações do arquivo)
  if (req.method === 'GET') {
    try {
      const result = await query(
        `SELECT id, original_name, format, created_at, private, width, height, password
         FROM files
         WHERE id = $1`,
        [id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Arquivo não encontrado' });
      }

      const file = result.rows[0];

      // Construir o caminho do arquivo com base no formato
      const path = `/${file.id}.${file.format}`;

      return res.status(200).json({
        id: file.id,
        original_name: file.original_name,
        format: file.format,
        created_at: file.created_at,
        private: file.private,
        width: file.width,
        height: file.height,
        path,
      });
    } catch (error) {
      console.error('Erro ao buscar arquivo no banco de dados:', error);
      return res.status(500).json({ error: 'Erro interno no servidor' });
    }
  }

  // Tratamento para o método POST (Verificar senha)
  if (req.method === 'POST') {
    const { password } = req.body;

    // Verificar se a senha foi fornecida
    if (!password) {
      return res.status(400).json({ error: 'Senha necessária' });
    }

    try {
      const result = await query(
        `SELECT id, password, private
         FROM files
         WHERE id = $1`,
        [id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Arquivo não encontrado' });
      }

      const file = result.rows[0];

      // Arquivo público não requer senha
      if (!file.private) {
        console.log(`Acesso concedido a arquivo público: ${file.original_name}`);
        return res.status(200).json({ message: 'Acesso concedido a arquivo público' });
      }

      // Verificar se a senha está correta
      const isPasswordCorrect = await bcrypt.compare(password, file.password);

      if (!isPasswordCorrect) {
        console.log(`Senha incorreta para o arquivo: ${file.original_name}`);
        return res.status(401).json({ error: 'Senha incorreta' });
      }

      // Senha correta
      console.log(`Senha correta para o arquivo: ${file.original_name}`);
      return res.status(200).json({ message: 'Acesso concedido a arquivo privado' });
    } catch (error) {
      console.error('Erro ao verificar a senha:', error);
      return res.status(500).json({ error: 'Erro interno no servidor' });
    }
  }

  // Retornar erro para métodos não permitidos
  return res.status(405).json({ error: 'Método não permitido' });
}
