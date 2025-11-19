// app/layout.tsx
import './globals.css';
import { ReactNode } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

export const metadata = {
  title: 'StorySphere — My Capstone',
  description: 'A lightweight publishing platform built with Next.js (App Router).',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
        <Footer />
      </body>
    </html>
  );
}
