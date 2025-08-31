"use client";

import { useAuth } from "@/context/UserContext";
import { motion } from "framer-motion";
import Link from "next/link";
import { Moon, Sun } from "lucide-react";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const { isLoggedIn } = useAuth();
  const pathname = usePathname();
  const { setTheme } = useTheme();

  const options = [
    { id: 1, title: "Home", url: "/", type: "public" },
    { id: 2, title: "Expenses", url: "/expenses", type: "private" },
    { id: 3, title: "Dashboard", url: "/dashboard", type: "private" },
    {
      id: 4,
      title: isLoggedIn ? "Profile" : "Login",
      url: isLoggedIn ? "/profile" : "/sign-up",
      type: "public",
    },
  ];

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, type: "spring" }}
      className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 shadow-md px-6 py-4 flex justify-between items-center"
    >
      {/* Logo */}
      <div className="text-2xl font-bold tracking-wider">
        <span className="text-accent bg-secondary">⚡</span> Expense Tracker
      </div>

      {/* Menu */}
      <div className="hidden md:flex gap-6 items-center">
        {options.map((item) => (
          <Link key={item.id} href={item.url}>
            <motion.span
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300 }}
              className={`relative px-3 py-1 text-base font-medium transition-colors duration-300 ${
                pathname === item.url
                  ? "text-blue-600 dark:text-blue-400 underline underline-offset-4"
                  : "hover:text-blue-600 dark:hover:text-blue-400"
              }`}
            >
              {item.title}
            </motion.span>
          </Link>
        ))}

        {/* Theme Toggle */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <Sun className="h-[1.2rem] w-[1.2rem] transition-all dark:hidden" />
              <Moon className="h-[1.2rem] w-[1.2rem] hidden dark:block transition-all" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setTheme("light")}>
              Light
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")}>
              Dark
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("system")}>
              System
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </motion.nav>
  );
};

export default Navbar;
