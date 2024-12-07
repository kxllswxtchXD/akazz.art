import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { SpeedInsights } from "@vercel/speed-insights/next"

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  useEffect(() => {
    const isMobile = /Mobi|Android/i.test(navigator.userAgent);
    const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
    const isAndroid = /Android/i.test(navigator.userAgent);

    if (isMobile && (isIOS || isAndroid)) {
      router.push('/unauthorized');
    }
  }, [router]);

  return (
    <>
      <Head>
        <title>縫い付けられた唇</title>
        <meta property="og:site_name" content="Nuitsukera" />
        <meta property="og:description" content="ステッチされた唇 - 新しい画像ホスティング プラットフォーム" />
        <meta name="theme-color" content="#2b2d31" />
        <meta property="og:url" content="https://i.akazz.art/" />
        <link rel="icon" href="/assets/favicon.ico" />
      </Head>
      <SpeedInsights/>
      <Component {...pageProps} />
    </>
  );
}
