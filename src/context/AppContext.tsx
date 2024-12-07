import { createContext, useContext, useState, ReactNode } from "react";

interface SeoData {
  title: string | null;
  imageUrl: string | null; // Permite null
  description: string | null; // Permite null
}

interface AppContextType {
  seoData: SeoData;
  setSeoData: (data: SeoData) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [seoData, setSeoData] = useState<SeoData>({
    title: null,  // Título padrão
    imageUrl: null,  // Inicializando imageUrl como null
    description: null,  // Inicializando description como null
  });

  return (
    <AppContext.Provider value={{ seoData, setSeoData }}>
      {children}
    </AppContext.Provider>
  );
};
