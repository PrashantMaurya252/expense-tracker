import type React from "react"
import { Navigate } from "react-router-dom"


const Protectedroutes = ({children}:{children:React.ReactNode}) => {

    const isLoggedIn = true
  return isLoggedIn ? children : <Navigate to='login'/>
  
}

export default Protectedroutes