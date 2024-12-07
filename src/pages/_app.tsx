import "@/styles/globals.css";
import { AppProps } from "next/app";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { NextSeo } from "next-seo"; // Importando o NextSeo
import { AppProvider, useAppContext } from "@/context/AppContext"; // Importando o contexto de SEO

// Componente para configurar o SEO e o restante da aplicação
const App = ({ Component, pageProps }: AppProps) => {
  const router = useRouter();
  const { seoData } = useAppContext(); // Obtendo os dados de SEO do contexto

  // Efeito para redirecionar usuários móveis para "/unauthorized"
  useEffect(() => {
    const isMobile = /Mobi|Android/i.test(navigator.userAgent);
    const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
    const isAndroid = /Android/i.test(navigator.userAgent);

    if (isMobile && (isIOS || isAndroid)) {
      router.push("/unauthorized");
    }
  }, [router]);

  return (
    <>
      {/* Configurando o NextSeo com os dados do contexto */}
      <NextSeo
        title="縫い付けられた唇" // Título fixo
        themeColor="#2b2d31"
        openGraph={{
          url: `https://akazz.art/`, // A URL do site
          title: "縫い付けられた唇", // Título fixo
        }}
      />
      {/* Dados de performance */}
      <SpeedInsights />
      {/* Renderizando o componente da página */}
      <Component {...pageProps} />
    </>
  );
};

// Componente que envolve a aplicação no contexto
export default function AppWrapper(props: AppProps) {
  return (
    <AppProvider>
      <App {...props} />
    </AppProvider>
  );
}
