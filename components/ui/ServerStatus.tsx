'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, Users, Zap, HardDrive } from 'lucide-react';

export default function ServerStatus() {
  const [liveData, setLiveData] = useState<any>(null);
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/server/update');
        const data = await res.json();

        if (data.timestamp) {
          const age = Date.now() - data.timestamp;
          setIsOnline(age < 120000); // Online if data is less than 2 minutes old
          setLiveData(data);
        }
      } catch (error) {
        setIsOnline(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 10000); // Update every 10 seconds
    return () => clearInterval(interval);
  }, []);

  if (!liveData) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-6 right-6 bg-card border border-border rounded-xl p-4 shadow-2xl z-50 max-w-xs"
    >
      <div className="flex items-center gap-2 mb-3">
        <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-success animate-pulse' : 'bg-red-500'}`} />
        <h3 className="font-bold text-sm">
          {isOnline ? 'Сервер онлайн' : 'Сервер оффлайн'}
        </h3>
      </div>

      {isOnline && (
        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-gray-400">
              <Users size={14} />
              <span>Игроки</span>
            </div>
            <span className="text-white font-semibold">
              {liveData.online}/{liveData.maxPlayers}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-gray-400">
              <Activity size={14} />
              <span>TPS</span>
            </div>
            <span className={liveData.tps >= 19 ? 'text-success' : 'text-yellow-500'}>
              {liveData.tps?.toFixed(1) || '20.0'}
            </span>
          </div>

          {liveData.memory && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-gray-400">
                <HardDrive size={14} />
                <span>Память</span>
              </div>
              <span className="text-white">
                {liveData.memory.used}/{liveData.memory.max}MB
              </span>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-gray-400">
              <Zap size={14} />
              <span>Версия</span>
            </div>
            <span className="text-white">{liveData.version}</span>
          </div>
        </div>
      )}

      <div className="text-xs text-gray-600 mt-2 text-center">
        Обновлено: {new Date(liveData.timestamp).toLocaleTimeString('ru-RU')}
      </div>
    </motion.div>
  );
}
