import { createContext, useContext, useState, ReactNode } from "react";

interface SeoData {
  title: string | null;
  imageUrl: string | null;
  description: string | null;
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
    title: null,
    imageUrl: null,
    description: null,
  });

  return (
    <AppContext.Provider value={{ seoData, setSeoData }}>
      {children}
    </AppContext.Provider>
  );
};
