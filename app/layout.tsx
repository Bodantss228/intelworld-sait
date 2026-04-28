import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'IntelWorld - Юбилейный 5-й сезон',
  description: 'IntelWorld - ванилла+ сервер с уникальной экосистемой. Банк, маркетплейсы, ИИ-персонаж Клео и временные аномалии.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body>
        <Header />
        <main className="min-h-screen pt-20">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
