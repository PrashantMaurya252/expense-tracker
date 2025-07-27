// src/components/Navbar.tsx
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import ThemeSwitcher from "./ThemeSwitcher";

const MobileNavbar = () => {
  const isLogin = true;

  const options = [
    {
      id: 1,
      title: "Home",
      url: "/",
      type: "public",
      icon: "icon-[material-symbols--home]",
    },
    {
      id: 2,
      title: "Expenses",
      url: "/expenses",
      type: "private",
      icon: "icon-[streamline--task-list-remix]",
    },
    {
      id: 3,
      title: "Dashboard",
      url: "/dashboard",
      type: "private",
      icon: "icon-[material-symbols--dashboard]",
    },
    {
      id: 4,
      title: isLogin ? "Profile" : "Login",
      url: isLogin ? "/profile" : "/auth",
      type: "public",
      icon: isLogin ? (
        "icon-[material-symbols--login]"
      ) : (
        "icon-[mdi--user]"
      ),
    },
  ];

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, type: "spring" }}
      className="bg-primary text-accent shadow-md px-6 py-4 flex justify-between items-center w-full"
      //   style={{ background: "var(--color-bg)", color: "var(--color-accent)" }} // Add this line
    >
      {/* <div className="text-2xl font-bold tracking-wider">
        <span className="text-accent bg-secondary">⚡</span> Expense Tracker
      </div> */}

      <div className="flex justify-between w-full">
        {options.map((item) => (
          <NavLink
            key={item.id}
            to={item.url}
            className={({ isActive }) =>
              `relative px- py-1 text-base font-medium transition-colors duration-300 ${
                isActive
                  ? "text-accent underline underline-offset-4"
                  : "hover:text-accent hover:bg-blue-700 hover:text-white hover:font-bold"
              }`
            }
          >
            {/* <div className="flex flex-col justify-center items-center">
                
            </div> */}
            <motion.span
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="flex flex-col justify-center items-center gap-2"
            >
              <span className={`${item.icon} text-2xl`}></span>
              <span className="font-semibold text-lg">{item.title}</span>
              
              
            </motion.span>
          </NavLink>
        ))}
        {/* <span>
            <ThemeSwitcher/>
        </span> */}
      </div>
    </motion.nav>
  );
};

export default MobileNavbar;
