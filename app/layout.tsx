import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { promises as fs } from 'fs';
import path from 'path';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  try {
    const filePath = path.join(process.cwd(), 'public', 'settings.json');
    // Check if file exists to avoid error log
    try {
      await fs.access(filePath);
    } catch {
      return {
        title: "E-Commerce Store",
        description: "Premium quality products with Cash on Delivery",
      };
    }

    const fileContents = await fs.readFile(filePath, 'utf8');
    const settings = JSON.parse(fileContents);

    return {
      title: settings.site_name || "E-Commerce Store",
      description: settings.hero_description || "Premium quality products with Cash on Delivery",
      icons: {
        icon: settings.favicon || '/favicon.ico',
        shortcut: settings.favicon || '/favicon.ico',
        apple: settings.favicon || '/favicon.ico',
      }
    };
  } catch (error) {
    console.warn("Failed to load settings for metadata:", error);
    return {
      title: "E-Commerce Store",
      description: "Premium quality products with Cash on Delivery",
    };
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body
        suppressHydrationWarning={true}
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
