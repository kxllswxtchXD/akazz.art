import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { DefaultSeo } from "next-seo";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <DefaultSeo
        title="• Akazz"
        description="Armazene e compartilhe suas imagens de forma rápida e segura."
        openGraph={{
          type: "website",
          locale: "pt_BR",
          url: "https://akazz.art",
        }}
      />
      <Component {...pageProps} />
    </>
  );
}