import { motion } from "framer-motion";
import { NextSeo } from "next-seo";
import UploadForm from "@/components/Upload/Form";

export default function Home() {
  return (
    <>
      <NextSeo
        title="縫い付けられた唇 • Upload" // Título da página
        description="ステッチされた唇 - 新しい画像ホスティング プラットフォーム" // Descrição
        themeColor="#2b2d31" // Tema da página
        openGraph={{
          site_name: "Nuitsukera", // Nome do site
          description: "ステッチされた唇 - 新しい画像ホスティング プラットフォーム",
          url: "https://akazz.art/", // URL base
        }}
        additionalLinkTags={[
          {
            rel: "icon",
            href: "/assets/favicon.ico", // Ícone da página
          },
        ]}
      />
      <motion.div
        className="flex items-center justify-center min-h-screen p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="border border-darkcarbon shadow-md rounded-lg p-8 w-full max-w-lg">
          <h1 className="text-3xl font-bold text-center text-mediumslate mb-6 font-varela">
            画像の送信
          </h1>
          <motion.div
            key="uploadForm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <UploadForm />
          </motion.div>
        </div>
      </motion.div>
    </>
  );
}
