import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icons from '@/components/Icons';

const UploadForm = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isPrivate, setIsPrivate] = useState(false);
  const [password, setPassword] = useState('');
  const [uploadLink, setUploadLink] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  const handleUpload = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const base64File = reader.result as string;
      const formData = {
        file: base64File.split(',')[1],
        originalName: file.name,
        private: isPrivate,
        password: isPrivate ? password : undefined,
      };

      try {
        const response = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });

        const data = await response.json();
        if (response.ok) {
          setUploadLink(data.link);
          setFile(null);
          setPassword('');
          setIsPrivate(false);
        } else {
          console.error(data.error || 'Erro desconhecido.');
        }
      } catch (error) {
        console.error('Erro ao enviar:', error);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <form onSubmit={handleUpload} className="space-y-4">
        <div>
          <label className="block text-muted-foreground font-medium mb-2">Selecionar imagem:</label>
          <div className="relative">
            <input ref={fileInputRef} type="file" onChange={handleFileChange} accept="image/*" className="hidden" />
            <button type="button" onClick={() => fileInputRef.current?.click()} className="w-full border border-border rounded-md p-4 text-center text-muted-foreground duration-300 hover:text-primary-800 hover:border-primary-800 truncate">
              {file ? file.name : 'Enviar arquivo'}
            </button>
          </div>
        </div>

        <div className="flex items-center">
          <input type="checkbox" id="private" checked={isPrivate} onChange={() => setIsPrivate(!isPrivate)} className="w-4 h-4" />
          <label htmlFor="private" className="ml-2 text-muted-foreground">Privar</label>
        </div>

        <AnimatePresence>
          {isPrivate && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }}>
              <div className="relative mb-4">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                  <Icons name="lock" size="w-6 h-6" className="text-muted-foreground"/>
                </div>
                <input type={showPassword ? 'text' : 'password'} placeholder="Senha" value={password} onChange={(e) => setPassword(e.target.value)} className="bg-transparent border border-border text-muted-foreground placeholder:border-primary-800 p-2 pl-10 w-full rounded focus:outline-none" required />
                <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer" onClick={() => setShowPassword((prev) => !prev)}>
                  <AnimatePresence>
                    {showPassword ? (
                      <motion.div key="eye-slash" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} className="absolute inset-y-0 right-0 flex items-center justify-center">
                        <Icons name="eye_slash" size="w-6 h-6" className="mr-2 text-muted-foreground" />
                      </motion.div>
                    ) : (
                      <motion.div key="eye" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} className="absolute inset-y-0 right-0 flex items-center justify-center">
                        <Icons name="eye" size="w-6 h-6" className="mr-2 text-muted-foreground" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <button type="submit" className="bg-primary-750 p-2 rounded w-full mt-4 duration-300 hover:bg-primary-800">Enviar</button>

        <AnimatePresence>
          {uploadLink && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }} className="mt-6">
              <label className="block text-muted-foreground font-medium mb-2">URL de acesso:</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                  <Icons name="link" size="w-6 h-6" className="text-muted-foreground" />
                </div>
                <input type="text" value={uploadLink} readOnly className="block bg-transparent text-muted-foreground font-light border border-border p-2 pl-10 w-full rounded focus:border-border focus:outline-none" onClick={(e) => (e.target as HTMLInputElement).select()} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </div>
  );
};

export default UploadForm;