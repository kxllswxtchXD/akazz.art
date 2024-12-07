import "@/styles/globals.css";
import { AppProps } from "next/app";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { NextSeo } from "next-seo";
import { AppProvider } from "@/context/AppContext";

const App = ({ Component, pageProps }: AppProps) => {
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
      <NextSeo
        title="縫い付けられた唇"
        themeColor="#2b2d31"
        openGraph={{
          url: `https://akazz.art/`,
          title: "縫い付けられた唇",
        }}
      />
      <SpeedInsights />
      <Component {...pageProps} />
    </>
  );
};

export default function AppWrapper(props: AppProps) {
  return (
    <AppProvider>
      <App {...props} />
    </AppProvider>
  );
}
