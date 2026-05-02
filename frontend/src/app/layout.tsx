import { Inter, Battambang } from "next/font/google";
import "./globals.css";
import ClientLayout from "@/components/ClientLayout";
import { LanguageProvider } from "@/context/LanguageContext";

const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });
const battambang = Battambang({
  weight: ['400', '700'],
  subsets: ['khmer'],
  variable: '--font-battambang'
});

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "ប្រព័ន្ធគ្រប់គ្រងសិស្ស",
  description: "ប្រព័ន្ធគ្រប់គ្រងកម្រិតខ្ពស់សម្រាប់ស្ថាប័នអប់រំទំនើប",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${battambang.variable}`}>
        <LanguageProvider>
          <ClientLayout>
            {children}
          </ClientLayout>
        </LanguageProvider>
      </body>
    </html>
  );
}
