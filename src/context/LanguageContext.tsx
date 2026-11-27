import React, { createContext, useContext } from "react";
import viJson from "../../locales/vi.json";

interface LanguageContextProps {
  language: string;
  changeLanguage: (newLang: string) => Promise<void>;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

interface LanguageProviderProps {
  children: React.ReactNode;
  initialUserLanguage?: string;
  onUserUpdate?: () => void;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const language = "vi";
  const changeLanguage = async (newLang: string) => {
    // No-op
  };

  const t = (key: string, params?: Record<string, string | number>) => {
    const dict = viJson as Record<string, string>;
    let value = dict[key] || key;
    if (params) {
      Object.entries(params).forEach(([paramName, paramVal]) => {
        value = value.replace(new RegExp(`{${paramName}}`, "g"), String(paramVal));
      });
    }
    return value;
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
