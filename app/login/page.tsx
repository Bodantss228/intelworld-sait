'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Проверяем авторизацию при загрузке
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/user/profile');
        if (response.ok) {
          // Уже авторизован - редирект в профиль
          router.push('/profile');
        }
      } catch (error) {
        // Не авторизован - остаемся на странице логина
      }
    };
    checkAuth();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, code }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Ошибка авторизации');
        setLoading(false);
        return;
      }

      router.push('/profile');
    } catch (err) {
      setError('Ошибка соединения с сервером');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">
            <span className="text-yellow-500">Intel</span>
            <span className="text-purple-500">World</span>
          </h1>
          <p className="text-gray-400">Вход в личный кабинет</p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 mb-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Как войти?</h2>
            <ol className="text-sm text-gray-400 space-y-2">
              <li>1. Зайдите на сервер <span className="text-yellow-500">play.intelworld.ru</span></li>
              <li>2. Напишите команду <span className="text-purple-500">/account link</span></li>
              <li>3. Скопируйте полученный код</li>
              <li>4. Введите ник и код ниже</li>
            </ol>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium mb-2">
                Ваш ник в Minecraft
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 bg-black border border-gray-700 rounded-lg focus:outline-none focus:border-yellow-500 transition-colors"
                placeholder="Steve"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="code" className="block text-sm font-medium mb-2">
                Код из игры
              </label>
              <input
                type="text"
                id="code"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                className="w-full px-4 py-2 bg-black border border-gray-700 rounded-lg focus:outline-none focus:border-yellow-500 transition-colors font-mono text-lg tracking-wider"
                placeholder="ABC123"
                maxLength={6}
                required
                disabled={loading}
              />
              <p className="text-xs text-gray-500 mt-1">Код действителен 5 минут</p>
            </div>

            {error && (
              <div className="bg-red-900/20 border border-red-500 rounded-lg p-3 text-red-400 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-yellow-500 to-purple-500 text-black font-semibold py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Проверка...' : 'Войти'}
            </button>
          </form>
        </div>

        <div className="text-center">
          <Link href="/" className="text-gray-400 hover:text-white transition-colors text-sm">
            ← Вернуться на главную
          </Link>
        </div>
      </div>
    </div>
  );
}
