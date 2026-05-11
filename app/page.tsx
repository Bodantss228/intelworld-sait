'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Users, Zap } from 'lucide-react';

export default function Home() {
  const [stats, setStats] = useState<any>({ online: 0, maxPlayers: 100, version: '1.21.8', tps: 20 });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/stats');
        const data = await res.json();
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const copyServerIP = () => {
    navigator.clipboard.writeText('play.intelworld.ru');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative">
      <section
        className="relative min-h-screen overflow-hidden bg-black bg-cover bg-center"
        style={{ backgroundImage: "url('/background.png')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/35 via-transparent to-black/10" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/75 to-transparent" />

        <div className="relative z-10 min-h-screen px-5 pb-10 pt-28 sm:px-8 lg:px-12">
          <motion.div
            className="absolute bottom-8 left-5 w-[min(360px,calc(100vw-2.5rem))] sm:bottom-10 sm:left-8 lg:bottom-14 lg:left-12"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <button
              type="button"
              onClick={copyServerIP}
              className="group flex w-full items-center justify-between gap-3 rounded-md border border-white/15 bg-black/45 px-4 py-3 text-left text-white shadow-2xl backdrop-blur-md transition hover:border-primary/60 hover:bg-black/60"
              aria-label="Скопировать IP сервера"
            >
              <span className="min-w-0 truncate text-lg font-semibold">
                {copied ? 'Скопировано!' : 'play.intelworld.ru'}
              </span>
              <Copy className="shrink-0 text-primary transition group-hover:scale-105" size={20} />
            </button>

            <div className="mt-3 grid grid-cols-3 overflow-hidden rounded-md border border-white/10 bg-black/40 text-white shadow-xl backdrop-blur-md">
              <div className="flex min-h-20 flex-col justify-center border-r border-white/10 px-4">
                <div className="flex items-center gap-2 text-xs uppercase text-gray-400">
                  <Users size={14} />
                  Онлайн
                </div>
                <div className="mt-2 text-2xl font-bold">{stats.online}</div>
              </div>

              <div className="flex min-h-20 flex-col justify-center border-r border-white/10 px-4">
                <div className="flex items-center gap-2 text-xs uppercase text-gray-400">
                  <Zap size={14} />
                  Версия
                </div>
                <div className="mt-2 text-lg font-semibold">{stats.version}</div>
              </div>

              <div className="flex min-h-20 flex-col justify-center px-4">
                <div className="text-xs uppercase text-gray-400">TPS</div>
                <div className={`mt-2 text-lg font-semibold ${stats.tps >= 19 ? 'text-success' : 'text-yellow-500'}`}>
                  {Number(stats.tps || 0).toFixed(1)}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="absolute bottom-10 left-1/2 z-10 -translate-x-1/2 transform">
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-gray-500"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M12 5v14M19 12l-7 7-7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.div>
        </div>
      </section>

      <section className="bg-surface py-32">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-4xl font-bold mb-6">
              <span className="text-secondary">Что если?</span>
            </h2>
            <p className="text-gray-400 mb-12 max-w-2xl mx-auto">
              Эксклюзивные ивенты, меняющие правила игры
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { name: 'Что если', desc: 'Костя стал натуралом' },
                { name: '???', desc: 'Скоро откроется' },
                { name: '???', desc: 'Скоро откроется' },
                { name: '???', desc: 'Скоро откроется' },
              ].map((event, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-black border border-secondary/30 rounded-lg p-6 hover:border-secondary transition-all"
                >
                  <h4 className="text-lg font-bold mb-2 text-secondary">{event.name}</h4>
                  <p className="text-sm text-gray-500">{event.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
