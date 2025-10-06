import ReactQueryProvider from "@/providers/ReactQueryProvider";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { ToastContainer } from "react-toastify";

export const metadata: Metadata = {
  title: "Chat As",
  description: "App Chat As",
};

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <body suppressHydrationWarning className={`${poppins.variable} font-poppins !important antialiased bg-[#F4F4F4]`}>
        <ReactQueryProvider>
          {children}
          <ToastContainer position="top-right" autoClose={2000} />
        </ReactQueryProvider>
      </body>
  );
}
