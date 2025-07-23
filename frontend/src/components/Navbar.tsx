import { NavLink } from "react-router-dom"


const Navbar = () => {
    const isLogin = true
    const options = [
        {id:1,title:"Home",url:"/",type:"public"},
        {id:2,title:"Tasks",url:"/tasks",type:"private"},
        {id:1,title:"Dashboard",url:"/dashboard",type:"private"},
        {id:1,title:isLogin ? "Profile":"Login",url:isLogin ? "/profile":"/auth",type:"public"},
    ]
  return (
    <div>
        <div>
            {options?.map((item,index)=>(
                <NavLink to={item.url}>{item.title}</NavLink>
            ))}
            <span></span>
        </div>
    </div>
  )
}

export default Navbar