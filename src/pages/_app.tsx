import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { SpeedInsights } from "@vercel/speed-insights/next";

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
      <SpeedInsights />
      <Component {...pageProps} />
    </>
  );
}
