import { createContext, useContext, useState } from 'react';
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

    const toggleDarkMode = () => {
        setDarkMode((prevMode) => !prevMode);
    };

    return (
        <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
            <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'}`}>
                <Component {...pageProps} />
            </div>
        </ThemeContext.Provider>
    );
};

export default MyApp;
