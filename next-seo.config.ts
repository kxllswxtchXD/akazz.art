// next-seo.config.ts
import { DefaultSeoProps } from "next-seo";

const nextSeoConfig: DefaultSeoProps = {
  title: "• Akazz",
  description: "Armazene e compartilhe suas imagens de forma rápida e segura.",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://akazz.art",
    site_name: "Akazz",
  },
};

export default nextSeoConfig;
