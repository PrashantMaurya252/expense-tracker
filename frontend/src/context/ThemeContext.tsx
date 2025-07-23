import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark" | "cupcake" | "cyberpunk" | "dracula" | "forest";

interface ThemeContextType{
    theme:Theme,
    setTheme:(theme:Theme)=>void
}

const ThemeContext = createContext<ThemeContextType | null>(null)

export const ThemeProvider = ({children}:{children:React.ReactNode})=>{

    const [theme,setThemeType] = useState<Theme>(()=>(localStorage.getItem("theme") as Theme) || "light")

    const setTheme = (newTheme:Theme)=>{
        setThemeType(newTheme)
        localStorage.setItem("theme",newTheme)
    }
    useEffect(()=>{
        document.documentElement.className=`theme-${theme}`
    },[theme])

    return (
        <ThemeContext.Provider value={{theme,setTheme}}>
            {children}
        </ThemeContext.Provider>
    )
}

export const useTheme =()=>{
    const context = useContext(ThemeContext)
    if(!context) throw new Error("useTheme must be used inside ThemeProvider");
    return context
}