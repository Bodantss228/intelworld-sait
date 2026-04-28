'use client';

import { useState, useEffect } from 'react';
import { ArrowRight, Plus, Trash2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface ExchangeRate {
  id: string;
  fromItem: string;
  fromAmount: number;
  toItem: string;
  toAmount: number;
  createdBy: string;
  createdAt: string;
}

const ITEMS = [
  { id: 'Diamond', name: 'Алмаз', image: '/photo/Diamond.png' },
  { id: 'Emerald', name: 'Изумруд', image: '/photo/Emerald.png' },
  { id: 'Gold_Ingot', name: 'Золотой слиток', image: '/photo/Gold_Ingot.png' },
  { id: 'Iron_Ingot', name: 'Железный слиток', image: '/photo/Iron_Ingot.png' },
  { id: 'Copper_Ingot', name: 'Медный слиток', image: '/photo/Copper_Ingot.png' },
  { id: 'Netherite_Ingot', name: 'Незеритовый слиток', image: '/photo/Netherite_Ingot.png' },
  { id: 'Netherite_Scrap', name: 'Незеритовый скрап', image: '/photo/Netherite_Scrap.png' },
];

export default function ServicesPage() {
  const { user } = useAuth();
  const [rates, setRates] = useState<ExchangeRate[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isBanker, setIsBanker] = useState(false);

  const [fromItem, setFromItem] = useState('Diamond');
  const [fromAmount, setFromAmount] = useState(1);
  const [toItem, setToItem] = useState('Emerald');
  const [toAmount, setToAmount] = useState(1);

  useEffect(() => {
    fetchRates();
    checkBankerRole();
  }, [user]);

  const fetchRates = async () => {
    try {
      const response = await fetch('/api/bank/exchange/rates');
      if (response.ok) {
        const data = await response.json();
        setRates(data);
      }
    } catch (error) {
      console.error('Error fetching rates:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkBankerRole = async () => {
    if (!user?.uuid) return;
    try {
      const response = await fetch(`/api/government/role?uuid=${user.uuid}`);
      if (response.ok) {
        const data = await response.json();
        setIsBanker(data.isBanker || false);
      }
    } catch (error) {
      console.error('Error checking role:', error);
    }
  };

  const handleCreateRate = async () => {
    if (!user?.uuid || !user?.username) return;

    try {
      const response = await fetch('/api/bank/exchange/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bankerUuid: user.uuid,
          bankerName: user.username,
          fromItem,
          fromAmount,
          toItem,
          toAmount,
        }),
      });

      if (response.ok) {
        setShowCreateModal(false);
        fetchRates();
        setFromItem('Diamond');
        setFromAmount(1);
        setToItem('Emerald');
        setToAmount(1);
      }
    } catch (error) {
      console.error('Error creating rate:', error);
    }
  };

  const handleDeleteRate = async (rateId: string) => {
    if (!user?.uuid) return;

    try {
      const response = await fetch(
        `/api/bank/exchange/delete?bankerUuid=${user.uuid}&rateId=${rateId}`,
        { method: 'DELETE' }
      );

      if (response.ok) {
        fetchRates();
      }
    } catch (error) {
      console.error('Error deleting rate:', error);
    }
  };

  const getItemData = (itemId: string) => {
    return ITEMS.find(item => item.id === itemId) || ITEMS[0];
  };

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-20 text-center">
        <p className="text-gray-400">Загрузка курсов...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-20">
      <div className="text-center mb-16">
        <h1 className="text-5xl md:text-6xl font-bold gradient-text mb-6">
          Обменные курсы
        </h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Актуальные курсы обмена предметов в банке IntelWorld
        </p>
      </div>

      {isBanker && (
        <div className="mb-8 text-center">
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-primary hover:bg-primary/80 text-background px-6 py-3 rounded-lg font-semibold inline-flex items-center gap-2 transition-colors"
          >
            <Plus size={20} />
            Добавить курс
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {rates.map((rate) => {
          const fromData = getItemData(rate.fromItem);
          const toData = getItemData(rate.toItem);

          return (
            <div
              key={rate.id}
              className="bg-surface rounded-xl p-6 border border-gray-800 hover:border-primary/50 transition-all"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 flex-1">
                  <img src={fromData.image} alt={fromData.name} className="w-12 h-12" />
                  <div>
                    <p className="text-white font-semibold">{fromData.name}</p>
                    <p className="text-2xl text-primary font-bold">{rate.fromAmount}</p>
                  </div>
                </div>

                <ArrowRight className="text-gray-500 flex-shrink-0" size={24} />

                <div className="flex items-center gap-3 flex-1">
                  <img src={toData.image} alt={toData.name} className="w-12 h-12" />
                  <div>
                    <p className="text-white font-semibold">{toData.name}</p>
                    <p className="text-2xl text-primary font-bold">{rate.toAmount}</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-800 flex items-center justify-between">
                <div className="text-sm text-gray-400">
                  <p>Создал: {rate.createdBy}</p>
                  <p>{new Date(rate.createdAt).toLocaleDateString('ru-RU')}</p>
                </div>

                {isBanker && (
                  <button
                    onClick={() => handleDeleteRate(rate.id)}
                    className="text-red-500 hover:text-red-400 transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {rates.length === 0 && (
        <div className="text-center text-gray-400 py-12">
          <p>Пока нет обменных курсов</p>
        </div>
      )}

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-surface rounded-xl p-8 max-w-2xl w-full border border-gray-800">
            <h2 className="text-3xl font-bold mb-6 gradient-text">Новый курс обмена</h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Отдаёте
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <select
                    value={fromItem}
                    onChange={(e) => setFromItem(e.target.value)}
                    className="bg-background border border-gray-700 rounded-lg px-4 py-3 text-white"
                  >
                    {ITEMS.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    min="1"
                    value={fromAmount}
                    onChange={(e) => setFromAmount(parseInt(e.target.value) || 1)}
                    className="bg-background border border-gray-700 rounded-lg px-4 py-3 text-white"
                    placeholder="Количество"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Получаете
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <select
                    value={toItem}
                    onChange={(e) => setToItem(e.target.value)}
                    className="bg-background border border-gray-700 rounded-lg px-4 py-3 text-white"
                  >
                    {ITEMS.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    min="1"
                    value={toAmount}
                    onChange={(e) => setToAmount(parseInt(e.target.value) || 1)}
                    className="bg-background border border-gray-700 rounded-lg px-4 py-3 text-white"
                    placeholder="Количество"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  onClick={handleCreateRate}
                  className="flex-1 bg-primary hover:bg-primary/80 text-background px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  Создать
                </button>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  Отмена
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
