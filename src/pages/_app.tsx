import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { NextSeo } from "next-seo";

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
      <NextSeo
        title="縫い付けられた唇"
        description="ステッチされた唇 - 新しい画像ホスティング プラットフォーム"
        canonical="https://akazz.art/"
        themeColor="#0e0e0e"
        openGraph={{
          url: "https://akazz.art/",
          title: "縫い付けられた唇",
          description: "ステッチされた唇 - 新しい画像ホスティング プラットフォーム",
        }}
      />
      <Head>
        <meta property="og:site_name" content="Nuitsukera" />
        <meta name="theme-color" content="#0e0e0e" />
        <link rel="icon" href="/assets/favicon.ico" />
      </Head>
      <SpeedInsights />
      <Component {...pageProps} />
    </>
  );
}
