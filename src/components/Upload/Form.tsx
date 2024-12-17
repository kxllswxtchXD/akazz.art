import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icons from '@/components/Icons';

const UploadForm = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isPrivate, setIsPrivate] = useState(false);
  const [password, setPassword] = useState('');
  const [uploadLink, setUploadLink] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const selectedFile = event.target.files[0];
      if (selectedFile.size > 100 * 1024 * 1024) {
        setErrorMessage('O arquivo é muito grande. Faça upload de arquivos de até 100MB.');
        setFile(null);
      } else {
        setErrorMessage(null);
        setFile(selectedFile);
      }
    }
  };

  const handleUpload = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
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
        setUploadLink(data.link);
        setFile(null);
        setPassword('');
        setIsPrivate(false);
      } else {
        setErrorMessage(data.error || 'erro desconhecido');
      }
    } catch (error) {
      console.error('Erro ao enviar:', error);
      setErrorMessage('Ocorreu um erro durante o upload. Por favor, tente novamente.');
    }
  };

  return (
    <form onSubmit={handleUpload} className="space-y-4">
      <div>
        <label className="block text-mediumslate font-medium mb-2">Selecionar imagem ou vídeo:</label>
        <div className="relative">
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileChange}
            accept="image/*,video/*"
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full border border-darkcarbon rounded-md p-4 text-center text-mediumslate duration-300 hover:text-mediumslate hover:border-mediumslate"
          >
            {file ? file.name : 'Enviar arquivo'}
          </button>
        </div>
        {errorMessage && <div className="text-red-500">{errorMessage}</div>}
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="private"
          checked={isPrivate}
          onChange={() => setIsPrivate(!isPrivate)}
          className="w-4 h-4 text-mediumslate border-gray-300 rounded"
        />
        <label htmlFor="private" className="ml-2 text-mediumslate">
        Privado
        </label>
      </div>

      <AnimatePresence>
        {isPrivate && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="relative mb-4">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Icons name="lock" className="text-mediumslate" />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-blackonyx border border-darkcarbon placeholder:text-mediumslate p-2 pl-10 w-full rounded focus:outline-none"
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                <Icons name={showPassword ? 'eye_slash' : 'eye'} className="text-mediumslate" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="submit"
        className="bg-blue-500 p-2 rounded w-full mt-4 duration-300 hover:bg-blue-800"
      >
       Enviar
      </button>

      <AnimatePresence>
        {uploadLink && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-6"
          >
            <label className="block text-mediumslate font-medium mb-2">URL de acesso:</label>
            <input
              type="text"
              value={uploadLink}
              readOnly
              className="block bg-blackonyx border border-darkcarbon placeholder:text-mediumslate p-2 pl-5 w-full rounded outline-none focus:border-mediumslate focus:outline-none duration-300 hover:border-mediumslate"
              onClick={(e) => (e.target as HTMLInputElement).select()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  );
};

export default UploadForm;
