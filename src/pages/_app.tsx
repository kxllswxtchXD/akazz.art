import { NextSeo } from 'next-seo';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';

export default function Page({ name, description, base64 }: { name: string, description: string, base64: string }) {
  const router = useRouter();

  return (
    <>
      <NextSeo
        title={name}
        description={description}
        canonical={`https://akazz.art/${router.query.id}`}
        themeColor="#0e0e0e"
        openGraph={{
          url: `https://akazz.art/${router.query.id}`,
          title: name,
          description: description,
          images: [
            {
              url: `data:image/jpeg;base64,${base64}`,  // Usando base64 para Open Graph
              alt: name,  // Descrição alternativa
            },
          ],
        }}
      />
      {/* Não há mais exibição de conteúdo na página */}
    </>
  );
}

// Função para buscar dados da API
export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const res = await fetch(`https://akazz.art/api/image/${params?.id}`);
  const data = await res.json();

  if (!data.base64) {
    return {
      notFound: true,  // Caso a imagem não exista
    };
  }

  return {
    props: {
      name: data.name,
      description: data.description,
      base64: data.base64,
    },
  };
};
