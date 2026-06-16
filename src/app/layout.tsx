import type { Metadata } from "next";
import "./globals.css";
import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "AI-PHMS | Prescription & Health Analytics",
  description: "AI-Powered Prescription & Health Analytics Management System",
  icons: {
    icon: "/assets/logo.png",
    shortcut: "/assets/logo.png",
    apple: "/assets/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Google+Sans+Flex:opsz,wght@6..144,1..1000&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className="min-h-full antialiased"
        style={{ fontFamily: "'Google Sans Flex', ui-sans-serif, system-ui, sans-serif" }}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <TooltipProvider>
            <div className="flex bg-background text-foreground min-h-screen">
              <Sidebar />
              <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
                <Suspense fallback={<div className="h-16 border-b bg-card" />}>
                  <Header />
                </Suspense>
                <main className="flex-1 overflow-y-auto p-4 md:p-8">{children}</main>
              </div>
            </div>
            <ToastContainer position="top-right" autoClose={3000} />
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
