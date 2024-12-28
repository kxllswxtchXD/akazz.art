import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { NextSeo } from "next-seo";
import Head from "next/head";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

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
      <Head>
        <link rel="icon" href="/assets/favicon.ico" />
      </Head>
      <NextSeo
        title="Akazz — Host"
        description="Nova plataforma de hospedagem de mídia."
        canonical={`https://akazz.art${
          router.asPath.split("?")[0] === "/" ? "" : router.asPath.split("?")[0]
        }`}
        themeColor="#0e0e0e"
        openGraph={{
          url: `https://akazz.art${
            router.asPath.split("?")[0] === "/" ? "" : router.asPath.split("?")[0]
          }`,
          title: "Akazz — Host",
          description: "Nova plataforma de hospedagem de mídia.",
        }}
      />
      <Component {...pageProps} />
    </>
  );
}
