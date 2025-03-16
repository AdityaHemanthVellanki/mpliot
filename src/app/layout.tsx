import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "../components/ThemeProvider";
import Navigation from '@/components/Navigation';
import ParticlesBackground from "@/components/ParticlesBackground";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Mpilot - AI Model Finder",
  description: "Find the perfect AI model for your task with Mpilot's intelligent recommendation system.",
  keywords: "AI model finder, AI models, machine learning models, NLP models, computer vision models",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans min-h-screen`}>
        <ThemeProvider>
          <ParticlesBackground />
          <Navigation />
          <main className="container mx-auto px-4 pb-16">{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
