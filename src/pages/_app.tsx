import { createContext, useContext, useState, useEffect } from 'react';
import type { AppProps } from 'next/app';
import '../app/globals.css';

// Create a context for the theme
const ThemeContext = createContext({
  darkMode: true,
  toggleDarkMode: () => {},
});

export const useTheme = () => useContext(ThemeContext);

const MyApp = ({ Component, pageProps }: AppProps) => {
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      <div className="min-h-screen">
        <Component {...pageProps} />
      </div>
    </ThemeContext.Provider>
  );
};

export default MyApp;
