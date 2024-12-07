import { createContext, useState, ReactNode, useContext } from "react";

// Definindo o tipo para os dados de SEO
interface SeoData {
  title: string | null;
  description: string | null;
  imageUrl: string | null;
}

// Criando o contexto com os dados de SEO
interface AppContextType {
  seoData: SeoData;
  setSeoData: (data: SeoData) => void;
}

// Definindo valores padrão para o contexto
const defaultSeoData: SeoData = {
  title: "縫い付けられた唇", // Título padrão
  description: null, // Descrição padrão, você pode preencher isso mais tarde
  imageUrl: null, // URL de imagem padrão, você pode preencher isso mais tarde
};

// Criando o contexto
const AppContext = createContext<AppContextType | undefined>(undefined);

// Função para fornecer o contexto
export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [seoData, setSeoData] = useState<SeoData>(defaultSeoData);

  return (
    <AppContext.Provider value={{ seoData, setSeoData }}>
      {children}
    </AppContext.Provider>
  );
};

// Hook personalizado para usar o contexto
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext deve ser usado dentro de um AppProvider");
  }
  return context;
};
