import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { ThemeProvider } from "@/components/ThemeProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "JobMatch – Find Your Dream Job",
  description: "AI-powered job recommendations tailored to your skills and experience.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-gray-50 dark:bg-gray-900 transition-colors`}>
        <ThemeProvider>
          <Navbar />
          <main>{children}</main>
          <footer className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 mt-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">© 2026 JobMatch. All rights reserved.</p>
                <div className="flex gap-6 text-sm text-gray-500 dark:text-gray-400">
                  <a href="#" className="hover:text-gray-900 dark:hover:text-white">Privacy</a>
                  <a href="#" className="hover:text-gray-900 dark:hover:text-white">Terms</a>
                  <a href="#" className="hover:text-gray-900 dark:hover:text-white">Contact</a>
                </div>
              </div>
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
