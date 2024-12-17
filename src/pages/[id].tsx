import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { NextSeo } from 'next-seo';
import Image from 'next/image';
import Loading from '@/components/Loading';
import Icons from '@/components/Icons';

interface FileData {
  id: string;
  original_name: string;
  format: string;
  path: string;
  created_at: string;
  private: boolean;
  width: number;
  height: number;
}

const FilePage = () => {
  const [fileData, setFileData] = useState<FileData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isPasswordCorrect, setIsPasswordCorrect] = useState<boolean | null>(null);

  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (!id) return;

    const fetchFileData = async () => {
      try {
        const response = await fetch(`/api/verification/${id}`);
        if (!response.ok) throw new Error('Arquivo não encontrado');

        const data = await response.json();
        setFileData(data);
      } catch (err) {
        setError('Erro ao carregar o arquivo');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFileData();
  }, [id]);

  const handlePasswordSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const response = await fetch(`/api/verification/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        setIsPasswordCorrect(true);
        setError(null); // Limpa os erros
      } else {
        const data = await response.json();
        setIsPasswordCorrect(false);
        setError(data.error || 'Erro desconhecido');
      }
    } catch (err) {
      setError('Erro ao verificar a senha');
      console.error(err);
    }
  };

  if (loading) return <Loading />;
  if (error && !fileData) return <div className="text-red-800 text-center">{error}</div>;

  // Garantir que `fileData` não seja `null` antes de usá-lo
  if (!fileData) {
    return <div className="text-red-800 text-center">Arquivo não encontrado</div>;
  }

  const { format, path, original_name, width, height, private: isPrivate } = fileData;
  const fileType = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg'].includes(format)
    ? 'image'
    : ['mp4', 'webm', 'avi', 'mov', 'mkv', 'flv', 'wmv'].includes(format)
    ? 'video'
    : 'unknown';

  // Configuração do SEO dinâmico com base nas informações do arquivo
  const seoTitle = fileData.id; // ID do arquivo
  const seoDescription = fileData.original_name; // Nome original do arquivo
  const seoImageUrl = fileType === 'image' && !isPrivate ? fileData.path : ''; // Caminho da imagem, se for uma imagem pública
  const seoImageAlt = fileType === 'image' && !isPrivate ? fileData.original_name : ''; // Texto alternativo da imagem
  const seoImageWidth = fileType === 'image' && !isPrivate ? fileData.width : 0; // Largura da imagem, se for pública
  const seoImageHeight = fileType === 'image' && !isPrivate ? fileData.height : 0; // Altura da imagem, se for pública

  // Renderiza o formulário de senha se o arquivo for privado e a senha ainda não foi verificada
  if (isPrivate && isPasswordCorrect === null) {
    return (
      <motion.div
        className="flex items-center justify-center min-h-screen p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="shadow-md rounded-lg flex flex-col items-center justify-center">
          <div className="border border-darkcarbon p-6 rounded-lg w-96 grid">
            <form onSubmit={handlePasswordSubmit}>
              <div className="relative mb-4">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Icons name="lock" className="text-mediumslate" />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Digite a senha"
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
              {error && <p className="text-red-800">{error}</p>}
              <button
                type="submit"
                className="bg-blue-500 p-2 rounded w-full mt-4 duration-300 hover:bg-blue-800"
              >
                Continuar
              </button>
            </form>
          </div>
        </div>
      </motion.div>
    );
  }

  if (!isPrivate || isPasswordCorrect) {
    return (
      <>
        <NextSeo
          title={seoTitle}
          description={seoDescription}
          canonical={`https://akazz.art${router.asPath.split("?")[0] === "/" ? "" : router.asPath.split("?")[0]}`}
          themeColor="#0e0e0e"
          openGraph={{
            url: `https://akazz.art${router.asPath.split("?")[0] === "/" ? "" : router.asPath.split("?")[0]}`,
            title: seoTitle,
            description: seoDescription,
            images: seoImageUrl
              ? [
                  {
                    url: seoImageUrl,
                    alt: seoImageAlt,
                    width: seoImageWidth,
                    height: seoImageHeight,
                  },
                ]
              : [], // Não inclui imagem se for um vídeo ou imagem privada
          }}
        />
        <motion.div
          className="flex items-center justify-center min-h-screen p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="shadow-md rounded-lg flex flex-col items-center justify-center">
            {fileType === 'image' && !isPrivate && (
              <Image
                src={path}
                alt={original_name}
                width={width}
                height={height}
                style={{ maxWidth: '100%', height: 'auto' }}
              />
            )}
            {fileType === 'video' && (
              <video controls style={{ maxWidth: '100%', height: 'auto' }}>
                <source src={path} type={`video/${format}`} />
                Seu navegador não suporta este formato de vídeo.
              </video>
            )}
            {fileType === 'unknown' && <div>Formato de arquivo não suportado.</div>}
          </div>
        </motion.div>
      </>
    );
  }

  return <div className="text-red-800 text-center">Erro ao exibir o arquivo.</div>;
};

export default FilePage;
