import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { DefaultSeo } from "next-seo";

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
      <DefaultSeo
        title="Akazz — Host"
        description="Akazz — Host • Nova plataforma de hospedagem de mídia"
        openGraph={{
          site_name: "Akazz — Host",
          description: "Akazz — Host • Nova plataforma de hospedagem de mídia",
          url: "https://akazz.art/",
          images: [
            {
              url: "/assets/favicon.ico",
              alt: "Akazz logo",
            },
          ],
        }}
        twitter={{
          cardType: 'summary_large_image',
        }}
        themeColor="#0e0e0e"
      />
      <SpeedInsights />
      <Component {...pageProps} />
    </>
  );
}
