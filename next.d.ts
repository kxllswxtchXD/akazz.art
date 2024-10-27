// next.d.ts
import { NextApiRequest } from 'next';

declare module 'next' {
  interface NextApiRequest {
    file?: Express.Multer.File; // Adiciona a propriedade file
  }
}
