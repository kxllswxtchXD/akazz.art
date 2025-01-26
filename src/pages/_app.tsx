// pages/_app.tsx
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { DefaultSeo } from "next-seo";
import nextSeoConfig from "../../next-seo.config";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <DefaultSeo {...nextSeoConfig} />
      <Component {...pageProps} />
    </>
  );
}
