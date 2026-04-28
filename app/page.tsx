'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Copy, Users, Zap } from 'lucide-react';
import MagneticButton from '@/components/ui/MagneticButton';

export default function Home() {
  const [stats, setStats] = useState<any>({ online: 0, maxPlayers: 100, version: '1.21.8', tps: 0 });
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
    // Update every 30 seconds
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
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
        <div className="absolute inset-0 z-0">
          <video
            className="absolute inset-0 w-full h-full object-cover opacity-40"
            autoPlay
            loop
            muted
            playsInline
          >
            <source src="/video1_smooth.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black" />
        </div>

        <div className="absolute inset-0 opacity-20 z-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-secondary/30 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <div className="container mx-auto px-6 text-center relative z-10">
          <motion.h1
            className="text-7xl md:text-9xl font-bold mb-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <span className="text-primary glow-gold">Intel</span>
            <span className="text-white">World</span>
          </motion.h1>

          <motion.div
            className="text-xl md:text-3xl text-gray-400 mb-12 font-light"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
          >
            Сезон 5: <span className="text-secondary italic">"What If..."</span>
          </motion.div>

          <motion.div
            className="flex flex-col md:flex-row items-center justify-center gap-6 mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
          >
            <MagneticButton
              className="bg-primary text-black px-10 py-4 rounded-lg font-bold text-lg hover:bg-primary/90 transition-all"
              onClick={copyServerIP}
            >
              {copied ? 'Скопировано!' : 'play.intelworld.ru'}
              <Copy className="inline ml-2" size={20} />
            </MagneticButton>

            <div className="flex items-center gap-6 text-gray-400">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${stats.online > 0 ? 'bg-success animate-pulse' : 'bg-gray-600'}`} />
                <Users size={20} className={stats.online > 0 ? 'text-success' : 'text-gray-600'} />
                <span className="text-sm">
                  <span className="text-white font-semibold">{stats.online}</span>
                </span>
              </div>
              <div className="w-px h-6 bg-gray-700" />
              <div className="flex items-center gap-2">
                <Zap size={20} className="text-primary" />
                <span className="text-sm">{stats.version}</span>
              </div>
              {stats.tps && (
                <>
                  <div className="w-px h-6 bg-gray-700" />
                  <div className="flex items-center gap-2">
                    <span className="text-sm">TPS: <span className={stats.tps >= 19 ? 'text-success' : 'text-yellow-500'}>{stats.tps.toFixed(1)}</span></span>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </div>

        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10">
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-gray-600"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M12 5v14M19 12l-7 7-7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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
                { name: 'Что если Костя стал натуралом', desc: 'Скоро откроется' },
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
