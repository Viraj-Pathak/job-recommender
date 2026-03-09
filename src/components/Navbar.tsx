"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Briefcase, Menu, X, Moon, Sun, Bookmark, Kanban, User } from "lucide-react";
import { useState } from "react";
import { useTheme } from "./ThemeProvider";

const navLinks = [
  { href: "/jobs", label: "Find Jobs" },
  { href: "/recommend", label: "For You" },
  { href: "/insights", label: "Insights" },
];

const iconLinks = [
  { href: "/saved", label: "Saved Jobs", icon: Bookmark },
  { href: "/tracker", label: "Tracker", icon: Kanban },
  { href: "/profile", label: "Profile", icon: User },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { theme, toggle } = useTheme();

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-blue-600">
            <Briefcase className="w-6 h-6" />
            <span>JobMatch</span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`text-sm font-medium transition-colors ${
                  pathname.startsWith(href)
                    ? "text-blue-600"
                    : "text-gray-600 dark:text-gray-300 hover:text-blue-600"
                }`}
              >
                {label}
              </Link>
            ))}
            <div className="h-4 w-px bg-gray-200 dark:bg-gray-700" />
            {iconLinks.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                title={label}
                className={`transition-colors ${
                  pathname.startsWith(href)
                    ? "text-blue-600"
                    : "text-gray-500 dark:text-gray-400 hover:text-blue-600"
                }`}
              >
                <Icon className="w-5 h-5" />
              </Link>
            ))}
          </div>

          {/* Desktop right */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={toggle}
              className="p-2 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              title={theme === "dark" ? "Light mode" : "Dark mode"}
            >
              {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <Link
              href="/recommend"
              className="bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Get Recommendations
            </Link>
          </div>

          {/* Mobile */}
          <div className="md:hidden flex items-center gap-2">
            <button onClick={toggle} className="p-2 text-gray-500 dark:text-gray-400">
              {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button className="p-2" onClick={() => setOpen(!open)}>
              {open ? <X className="w-5 h-5 text-gray-700 dark:text-gray-300" /> : <Menu className="w-5 h-5 text-gray-700 dark:text-gray-300" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-700 px-4 py-3 space-y-1">
          {[...navLinks, ...iconLinks].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className="block py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600"
            >
              {label}
            </Link>
          ))}
          <Link
            href="/recommend"
            onClick={() => setOpen(false)}
            className="block w-full text-center bg-blue-600 text-white text-sm font-medium px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-colors mt-2"
          >
            Get Recommendations
          </Link>
        </div>
      )}
    </nav>
  );
}
