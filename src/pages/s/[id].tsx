// src/pages/s/[id].tsx
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import Icons from '@/components/Icons';
import Loading from '@/components/Loading';
import { motion } from 'framer-motion';
import Head from 'next/head';

interface ImageResponse {
  private: boolean;
  filepath: string;
  width: number;
  height: number;
}

const ImagePage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [imageUrl, setImageUrl] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [password, setPassword] = useState<string>('');
  const [isPrivate, setIsPrivate] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [imageDimensions, setImageDimensions] = useState<{ width: number; height: number } | null>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  useEffect(() => {
    const fetchImageDetails = async () => {
      if (!id || typeof id !== 'string') {
        console.log('無効または未定義の ID');
        return;
      }

      try {
        console.log(`API に ID を問い合わせる: ${id}`);
        const response = await axios.get<ImageResponse>(`/api/image/${id}`);
        const { private: isPrivateImage, filepath, width, height } = response.data;
        
        setIsPrivate(isPrivateImage);
        setImageUrl(`/uploads/${filepath}`);
        setImageDimensions({ width, height });
      } catch (error) {
        console.error('画像の詳細を取得中にエラーが発生しました:', error);
        setError('画像が見つかりません。');
      } finally {
        setLoading(false);
      }
    };

    fetchImageDetails();
  }, [id]);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log(`IDのパスワードを確認中: ${id}`);
      const response = await axios.post<{ accessGranted: boolean }>(`/api/image/${id}`, { password });
      if (response.data.accessGranted) {
        const { data } = await axios.get<ImageResponse>(`/api/image/${id}`);
        setImageUrl(`/uploads/${data.filepath}`);
        setIsPrivate(data.private);
        setIsAuthenticated(true);
        setImageDimensions({ width: data.width, height: data.height });
      } else {
        setError('パスワードが間違っています!');
      }
    } catch (err) {
      console.error('パスワードチェック中にエラーが発生しました:パスワードが間違っています!', err);
      setError('パスワードチェック中にエラーが発生しました。');
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <Head>
        <title>縫い付けられた唇 • {id}</title>
      </Head>
      <motion.div className="flex items-center justify-center min-h-screen p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        <div className="shadow-md rounded-lg flex flex-col items-center justify-center">
          {isPrivate && !isAuthenticated ? (
            <div className="border border-darkcarbon p-6 rounded-lg w-96 grid">
              <form onSubmit={handlePasswordSubmit}>
                <div className="relative mb-4">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Icons name="lock" className="text-mediumslate" /></span>
                  <input type={showPassword ? 'text' : 'password'} placeholder="パスワード" value={password} onChange={(e) => setPassword(e.target.value)} className="bg-blackonyx border border-darkcarbon placeholder:text-mediumslate p-2 pl-10 w-full rounded focus:outline-none" required/>
                  <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer" onClick={() => setShowPassword(prev => !prev)}><Icons name={showPassword ? 'eye_slash' : 'eye'} className="text-mediumslate" /></button>
                </div>
                {error && <p className="text-red-800">{error}</p>}
                <button type="submit" className="bg-blue-500 p-2 rounded w-full mt-4 duration-300 hover:bg-blue-800">ログイン</button>
              </form>
            </div>
          ) : (
            <motion.div className="flex items-center justify-center h-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
              {imageDimensions && (
                <Image src={imageUrl} alt={id as string} width={imageDimensions.width} height={imageDimensions.height} unoptimized={true} className="max-w-full object-contain"/>
              )}
            </motion.div>
          )}
        </div>
      </motion.div>
    </>
  );
};

export default ImagePage;
