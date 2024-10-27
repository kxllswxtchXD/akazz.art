// src/components/Upload/Form.tsx
import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const UploadForm = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isPrivate, setIsPrivate] = useState(false);
  const [password, setPassword] = useState('');
  const [uploadLink, setUploadLink] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  const handleUpload = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);
    formData.append('private', String(isPrivate));
    if (isPrivate) {
      formData.append('password', password);
    }

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (response.ok) {
        const baseURL = window.location.origin;
        const imageId = data.link.split('.')[0];
        setUploadLink(`${baseURL}${imageId}`);
        setFile(null);
        setPassword('');
        setIsPrivate(false);
      } else {
        alert(`Erro ao enviar a imagem: ${data.error || 'Erro desconhecido'}`);
      }
    } catch (error) {
      console.error('Erro ao fazer upload:', error);
      alert('Erro ao fazer upload. Por favor, tente novamente.');
    }
  };
  return (
    <form onSubmit={handleUpload} className="space-y-4">
      <div>
        <label className="block text-mediumslate font-medium mb-2">Selecione uma imagem:</label>
        <div style={{ display: 'none' }}>
          <input type="file" ref={fileInputRef} accept="image/*" onChange={handleFileChange}/>
        </div>
        <button type="button" onClick={() => fileInputRef.current?.click()} className="w-full border border-darkcarbon rounded-md p-4 text-center text-mediumslate duration-300 hover:text-mediumslate hover:border-mediumslate">
          {file ? file.name : 'Selecionar imagem'}
        </button>
      </div>
      <div className="flex items-center">
        <input type="checkbox" id="private" checked={isPrivate} onChange={() => setIsPrivate(!isPrivate)} className="w-4 h-4 text-mediumslate border-gray-300 rounded"/>
        <label htmlFor="private" className="ml-2 text-mediumslate">Marcar como privada</label>
      </div>
      <AnimatePresence>
        {isPrivate && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }}>
            <label htmlFor="password" className="block text-mediumslate font-medium mb-2">Senha (opcional):</label>
            <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} className="block bg-blackonyx border border-darkcarbon placeholder:text-mediumslate p-2 pl-5 w-full rounded outline-none focus:border-mediumslate focus:outline-none duration-300 hover:border-mediumslate"/>
          </motion.div>
        )}
      </AnimatePresence>
      <button type="submit" className="bg-blue-500 p-2 rounded w-full mt-4 duration-300 hover:bg-blue-800">Enviar</button>
      <AnimatePresence>
        {uploadLink && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }} className="mt-6">
            <label className="block text-mediumslate font-medium mb-2">Link da imagem:</label>
            <input type="text" value={uploadLink} readOnly className="block bg-blackonyx border border-darkcarbon placeholder:text-mediumslate p-2 pl-5 w-full rounded outline-none focus:border-mediumslate focus:outline-none duration-300 hover:border-mediumslate" onClick={(e) => (e.target as HTMLInputElement).select()}/>
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  );
};

export default UploadForm;
