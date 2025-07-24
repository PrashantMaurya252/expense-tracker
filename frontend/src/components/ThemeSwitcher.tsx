import React from 'react'
import { useTheme } from '../context/ThemeContext'

const ThemeSwitcher = () => {
    const {theme,setTheme} = useTheme()

    const themes:typeof theme[] =["light" , "dark" , "cupcake" , "cyberpunk" , "dracula" , "forest"]
  return (
    <select value={theme} onChange={(e)=> setTheme(e.target.value as typeof theme)}>
        {themes?.map((t)=><option key={t} value={t}>{t.charAt(0).toUpperCase()+t.slice(1)}</option>)}
    </select>
  )
}

export default ThemeSwitcher