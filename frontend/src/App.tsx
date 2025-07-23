import { Route, Routes } from "react-router-dom"
import Authentication from "./pages/Authentication"
import Navbar from "./components/Navbar"
import Home from "./pages/Home"
import Tasks from "./pages/Tasks"
import Dashboard from "./pages/Dashboard"
import Profile from "./pages/Profile"




function App() {
  

  return (
    <div>
      <Navbar/>
      <Routes>
        <Route path="/auth" element={<Authentication/>}/>
        <Route path="/" element={<Home/>}/>
        <Route path="/tasks" element={<Tasks/>}/>
        <Route path="/dashboard" element={<Dashboard/>}/>
        <Route path="/profile" element={<Profile/>}/>
      </Routes>
    </div>
  )
}

export default App
