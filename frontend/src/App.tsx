import { Route, Routes } from "react-router-dom"
import Authentication from "./pages/Authentication"
import Navbar from "./components/Navbar"
import MobileNavbar from './components/MobileNavbar'
import Home from "./pages/Home"
import Dashboard from "./pages/Dashboard"
import Profile from "./pages/Profile"
import Expenses from "./pages/Expenses"




function App() {
  

  return (
    <div className="w-full">
      <Navbar/>
      <Routes>
        <Route path="/auth" element={<Authentication/>}/>
        <Route path="/" element={<Home/>}/>
        <Route path="/expenses" element={<Expenses/>}/>
        <Route path="/dashboard" element={<Dashboard/>}/>
        <Route path="/profile" element={<Profile/>}/>
      </Routes>
      <div className="absolute bottom-0 md:hidden w-full">
        <MobileNavbar/>
      </div>
      
    </div>
  )
}

export default App
