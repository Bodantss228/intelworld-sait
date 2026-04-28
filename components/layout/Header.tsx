'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<string>('');

  useEffect(() => {
    // Проверяем наличие auth cookie
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/user/profile');
        if (response.ok) {
          const data = await response.json();
          setIsLoggedIn(true);
          setUserRole(data.role || '');
        } else {
          setIsLoggedIn(false);
        }
      } catch {
        setIsLoggedIn(false);
      }
    };
    checkAuth();
  }, []);

  const canAccessAdmin = userRole === 'president' || userRole === 'media';

  const navLinks = [
    { href: '/', label: 'Главная' },
    { href: '/stats', label: 'Статистика' },
    { href: '/downloads', label: 'Скачать' },
    {
      href: isLoggedIn ? '/profile' : '/login',
      label: isLoggedIn ? 'Личный кабинет' : 'Войти',
      highlight: true
    },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-black/90 backdrop-blur-md border-b border-border">
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/logo-new.png"
              alt="IntelWorld"
              width={120}
              height={40}
              className="h-10 w-auto"
            />
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              link.highlight ? (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-purple-500 text-black font-semibold rounded-lg hover:opacity-90 transition-opacity text-sm"
                >
                  {link.label}
                </Link>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-gray-400 hover:text-primary transition-colors text-sm font-medium"
                >
                  {link.label}
                </Link>
              )
            ))}
          </div>

          <button
            className="md:hidden text-primary"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden mt-4 pb-4"
            >
              {navLinks.map((link) => (
                link.highlight ? (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block py-2 px-4 bg-gradient-to-r from-yellow-500 to-purple-500 text-black font-semibold rounded-lg hover:opacity-90 transition-opacity text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ) : (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block py-2 text-gray-400 hover:text-primary transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                )
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
