"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Locale, translations } from "@/lib/i18n";

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (typeof translations)["KR"];
}

const LanguageContext = createContext<LanguageContextType>({
  locale: "KR",
  setLocale: () => {},
  t: translations.KR,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("KR");

  useEffect(() => {
    const saved = localStorage.getItem("site_locale") as Locale | null;
    if (saved && ["KR", "EN", "CN", "JP"].includes(saved)) {
      setLocaleState(saved);
    }
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem("site_locale", newLocale);
  };

  return (
    <LanguageContext.Provider
      value={{
        locale,
        setLocale,
        t: translations[locale] as unknown as (typeof translations)["KR"],
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
