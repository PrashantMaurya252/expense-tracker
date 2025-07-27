// src/components/Navbar.tsx
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import ThemeSwitcher from "./ThemeSwitcher";
// import ThemeSwitcher from "./ThemeSwitcher";

const Navbar = () => {
  const isLogin = true;

  const options = [
    { id: 1, title: "Home", url: "/", type: "public" },
    { id: 2, title: "Expenses", url: "/expenses", type: "private" },
    { id: 3, title: "Dashboard", url: "/dashboard", type: "private" },
    {
      id: 4,
      title: isLogin ? "Profile" : "Login",
      url: isLogin ? "/profile" : "/auth",
      type: "public",
    },
  ];

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, type: "spring" }}
      className="bg-primary text-accent shadow-md px-6 py-4 flex justify-between items-center"
      //   style={{ background: "var(--color-bg)", color: "var(--color-accent)" }} // Add this line
    >
      <div className="text-2xl font-bold tracking-wider">
        <span className="text-accent bg-secondary">⚡</span> Expense Tracker
      </div>

      <div className="hidden md:flex gap-6">
        {options.map((item) => (
          <NavLink
            key={item.id}
            to={item.url}
            className={({ isActive }) =>
              `relative px-3 py-1 text-base font-medium transition-colors duration-300 ${
                isActive
                  ? "text-accent underline underline-offset-4"
                  : "hover:text-accent"
              }`
            }
          >
            <motion.span
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {item.title}
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

export default Navbar;
