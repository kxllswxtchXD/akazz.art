// src/pages/[id].tsx
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import { NextSeo } from 'next-seo';
import Loading from '@/components/Loading';
import Icons from '@/components/Icons';
import Image from 'next/image';

interface ImageData {
  type: string;
  content: string;
  original_name: string;
  new_name: string;
  private: boolean;
}

const ImagePage = () => {
  const router = useRouter();
  const { id } = router.query;

  const [imageData, setImageData] = useState<ImageData | null>(null);
  const [password, setPassword] = useState('');
  const [isPasswordCorrect, setIsPasswordCorrect] = useState<boolean | null>(null);
  const [fileType, setFileType] = useState('');
  const [content, setContent] = useState<string>('');
  const [originalName, setOriginalName] = useState('');
  const [new_name, setNewname] = useState('');
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState(false);

  const fetchImageData = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const response = await fetch(`/api/verification/${id}`);
      if (response.ok) {
        const { type, content, original_name, new_name, private: isPrivate } = await response.json();
        setImageData({ type, content, original_name, new_name, private: isPrivate });
        setFileType(type);
        setContent(content);
        setOriginalName(original_name);
        setNewname(new_name)

        const imgElement = new window.Image();
        imgElement.src = `data:image/jpeg;base64,${content}`;
        imgElement.onload = () => {
          setWidth(imgElement.width);
          setHeight(imgElement.height);
        };
      } else {
        console.error('Erro ao buscar dados da imagem.');
      }
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchImageData();
  }, [id, fetchImageData]);

  const handlePasswordSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!password || !imageData?.new_name) return;
    setLoading(true);
    try {
      const response = await fetch(`/api/verification/${imageData.new_name}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (response.ok) {
        setIsPasswordCorrect(true);
      } else {
        setIsPasswordCorrect(false);
      }
    } catch (error) {
      console.error('Erro ao verificar senha:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <>
      <NextSeo 
        title={originalName}
        openGraph={{
          title: originalName,
          url: `https://akazz.art/${id}`,
        }}
      />
      <motion.div className="flex items-center justify-center min-h-screen p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        <div className="shadow-md rounded-lg p-8 w-full max-w-lg">
          {isPasswordCorrect === null && imageData?.private && (
            <AnimatePresence>
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }}>
                <form onSubmit={handlePasswordSubmit}>
                  <div className="relative mb-4">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center text-muted-foreground">
                      <Icons name="lock" size="w-6 h-6" />
                    </div>
                    <input type={showPassword ? 'text' : 'password'} placeholder="Senha" value={password} onChange={(e) => setPassword(e.target.value)} className="bg-transparent border border-border text-muted-foreground p-2 pl-10 w-full rounded focus:outline-none" required />
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
                  <button type="submit" className="bg-primary-750 p-2 rounded w-full mt-4 duration-300 hover:bg-primary-800">Continuar</button>
                </form>
              </motion.div>
            </AnimatePresence>
          )}
          {isPasswordCorrect === false && imageData?.private && <div className="text-red-500">Senha incorreta. Tente novamente.</div>}
          {isPasswordCorrect === true && imageData?.private && (
            <div className="flex flex-col items-center justify-center">
              {fileType === 'image' && content && <Image src={`data:image/jpeg;base64,${content}`} alt={originalName} width={width} height={height} style={{ maxWidth: '100%', height: 'auto' }} />}
            </div>
          )}
          {isPasswordCorrect === null && !imageData?.private && fileType === 'image' && (
            <div className="flex flex-col items-center justify-center">
              {content && <Image src={`data:image/jpeg;base64,${content}`} alt={originalName} width={width} height={height} style={{ maxWidth: '100%', height: 'auto' }} />}
            </div>
          )}
        </div>
      </motion.div>
    </>
  );
};

export default ImagePage;
