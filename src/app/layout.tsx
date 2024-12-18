import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Provider } from "./provider/Provider";
import { Suspense } from "react";
import toast, { Toaster } from 'react-hot-toast';
import Loader from "@/components/additional/Loader";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Whatsapp Clone",
  description: "It is whatsapp clone created with Convex , Next.js ,Clerk auth and Gemini+EDEN.ai  ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body 
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-screen w-screen overflow-x-hidden`}
      >
        <Suspense fallback={<Loader/>}>
        <Provider>
          {children}
          <Toaster />
        </Provider>
        </Suspense>
      </body>
    </html>
  );
}
