'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, TrendingUp, Clock, Award, Users } from 'lucide-react';

export default function StatsPage() {
  const [players, setPlayers] = useState<any[]>([]);
  const [liveData, setLiveData] = useState<any>(null);

  useEffect(() => {
    // Fetch live data from mod
    const fetchData = async () => {
      try {
        const statsRes = await fetch('/api/stats');
        const statsData = await statsRes.json();

        setPlayers(statsData.players || []);
        setLiveData(statsData);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };

    fetchData();
    // Update every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold mb-6">
            <span className="gradient-text">Статистика</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Лидеры сервера и достижения игроков
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {[
            { label: 'Онлайн сейчас', value: liveData?.online?.toString() || '0', icon: TrendingUp, color: '#10B981' },
            { label: 'TPS сервера', value: liveData?.tps?.toFixed(1) || '0.0', icon: Clock, color: '#9333EA' },
            { label: 'Версия', value: liveData?.version || '1.21.8', icon: Award, color: '#A855F7' },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-all"
            >
              <stat.icon size={32} className="mb-3" style={{ color: stat.color }} />
              <div className="text-3xl font-bold mb-1" style={{ color: stat.color }}>
                {stat.value}
              </div>
              <div className="text-sm text-gray-500">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="bg-surface border-b border-border px-8 py-6">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <Trophy className="text-primary" size={28} />
              Игроки онлайн
            </h2>
          </div>

          <div className="p-8">
            {players.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {players.map((player, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center gap-3 p-4 bg-surface rounded-lg border border-border hover:border-primary/50 transition-all"
                  >
                    <img
                      src={`https://minotar.net/avatar/${player.name}/48`}
                      alt={player.name}
                      className="w-12 h-12 rounded"
                      onError={(e) => {
                        // Fallback to crafatar if minotar fails
                        const target = e.target as HTMLImageElement;
                        if (target.src.includes('minotar')) {
                          target.src = `https://crafatar.com/avatars/${player.uuid}?size=48&overlay`;
                        } else if (target.src.includes('crafatar')) {
                          // Final fallback to visage
                          target.src = `https://visage.surgeplay.com/face/48/${player.name}`;
                        }
                      }}
                    />
                    <div className="flex-1">
                      <span className="font-semibold text-lg">{player.name}</span>
                      {player.ping && (
                        <div className="text-xs text-gray-500">
                          Пинг: {player.ping}ms
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <Users size={64} className="mx-auto mb-4 text-gray-600" />
                <p className="text-gray-500 text-lg">Нет игроков онлайн</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
