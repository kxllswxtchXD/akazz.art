import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { DefaultSeo } from "next-seo";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <DefaultSeo
        title="• Akazz"
        description="Descrição padrão do meu aplicativo."
        openGraph={{
          type: "website",
          locale: "pt_BR",
          url: "https://akazz.art",
          site_name: "• Akazz",
        }}
      />
      <Component {...pageProps} />
    </>
  );
}