import AppProvider from "@/contexts/app.context";
import ReactQueryProvider from "@/providers/ReactQueryProvider";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";


export const metadata: Metadata = {
  title: "Chat As",
  description: "App Chat As",
};

export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-inter antialiased`}>
        <ReactQueryProvider>
          <AppProvider>{children}</AppProvider>
        </ReactQueryProvider>
        
      </body>
    </html>
  );
}
