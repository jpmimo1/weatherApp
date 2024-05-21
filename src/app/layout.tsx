import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { WeatherInit } from "@/components";
import { ToastContainer } from "react-toastify";
import { cn } from "@/lib/utils";
import 'react-toastify/ReactToastify.min.css';
import { ThemeProvider } from "@/providers";

const fontSans = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Weather App",
  description: "Weather app created by Jean Paul Flores",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(
        "min-h-screen bg-background font-sans antialiased",
        fontSans.variable
      )}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <WeatherInit />
          <ToastContainer autoClose={3000} position="bottom-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
