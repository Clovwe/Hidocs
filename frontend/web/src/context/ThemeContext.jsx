import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { translations } from "../data/translations";

const DARK_KEY   = "hidocs_dark_mode";
const THEME_KEY  = "hidocs_theme";
const LANG_KEY   = "hidocs_lang";
export const DEFAULT_COLOR = "#2168b4";

export const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem(DARK_KEY) === "true");

  const [primaryColor, setPrimaryColorState] = useState(() => {
    try {
      const s = localStorage.getItem(THEME_KEY);
      return s ? (JSON.parse(s).customHex || DEFAULT_COLOR) : DEFAULT_COLOR;
    } catch {
      return DEFAULT_COLOR;
    }
  });

  const [imageDataUrl, setImageDataUrlState] = useState(() => {
    try {
      const s = localStorage.getItem(THEME_KEY);
      return s ? (JSON.parse(s).imageDataUrl || null) : null;
    } catch {
      return null;
    }
  });

  const [lang, setLangState] = useState(() => {
    try {
      return localStorage.getItem(LANG_KEY) || "id";
    } catch {
      return "id";
    }
  });

  const saveTheme = useRef((color, img) => {
    try {
      localStorage.setItem(THEME_KEY, JSON.stringify({ customHex: color, imageDataUrl: img }));
    } catch {}
  });

  useEffect(() => {
    try {
      localStorage.setItem(DARK_KEY, darkMode);
      if (darkMode) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    } catch {}
  }, [darkMode]);

  useEffect(() => {
    const root = document.documentElement;
    const pri = primaryColor || DEFAULT_COLOR;
    root.style.setProperty("--hp-pri", pri);
    root.style.setProperty("--hp-pri-dark", pri);
    root.style.setProperty("--hp-pri-lt", darkMode ? "#111e30" : "#eef5fd");
    root.style.setProperty("--nb-pri", pri);
    root.style.setProperty("--nb-pri-lt", darkMode ? "#111e30" : "#eef5fd");
    root.style.setProperty("--theme-color", pri);
    saveTheme.current(pri, imageDataUrl);
  }, [primaryColor, imageDataUrl, darkMode]);

  useEffect(() => {
    try {
      localStorage.setItem(LANG_KEY, lang);
    } catch {}
  }, [lang]);

  const toggleTheme = useCallback(() => {
    setDarkMode((prev) => !prev);
  }, []);

  const setPrimaryColor = useCallback((hex) => {
    setPrimaryColorState(hex || DEFAULT_COLOR);
  }, []);

  const setImageDataUrl = useCallback((url) => {
    setImageDataUrlState(url || null);
  }, []);

  const resetTheme = useCallback(() => {
    setPrimaryColorState(DEFAULT_COLOR);
    setImageDataUrlState(null);
  }, []);

  const setLang = useCallback((code) => {
    setLangState(code === "en" ? "en" : "id");
  }, []);

  const t = translations[lang] || translations.id;

  return (
    <ThemeContext.Provider value={{
      darkMode, setDarkMode, toggleTheme,
      primaryColor, setPrimaryColor,
      imageDataUrl, setImageDataUrl,
      resetTheme,
      lang, setLang,
      t,
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
