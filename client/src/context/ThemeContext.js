import React,{useState} from 'react';

// Create a new context with a default value
export const ThemeContext = React.createContext('');

const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(true);
 
  const toggleTheme = () => {
    setTheme(!theme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme}}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
