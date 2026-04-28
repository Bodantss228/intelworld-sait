'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { AlertCircle, DollarSign, FileText, Send, Loader2, Search } from 'lucide-react';

export default function CreateFinePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [formData, setFormData] = useState({
    playerName: '',
    amount: '',
    reason: '',
  });

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/user/profile');
      if (!response.ok) {
        router.push('/login');
        return;
      }
      const data = await response.json();

      // Проверяем роль
      if (data.role !== 'president') {
        alert('Недостаточно прав. Требуется роль Президента.');
        router.push('/profile');
        return;
      }

      setUser(data);
    } catch (error) {
      router.push('/login');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!formData.playerName) {
        alert('Необходимо указать ник игрока');
        setLoading(false);
        return;
      }

      const response = await fetch('/api/government/fine/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          playerName: formData.playerName,
          amount: parseInt(formData.amount),
          reason: formData.reason,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Ошибка при создании штрафа');
      }

      alert('Штраф успешно выписан!');
      router.push('/profile');
    } catch (error: any) {
      alert(error.message || 'Ошибка при создании штрафа');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-20">
      <div className="container mx-auto px-6 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-5xl font-bold mb-4">
            <span className="gradient-text">Выписать штраф</span>
          </h1>
          <p className="text-gray-400">
            Наложите штраф на игрока за нарушение правил
          </p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onSubmit={handleSubmit}
          className="bg-card border border-border rounded-2xl p-8 space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-400 mb-2">
                <Search className="inline mr-2" size={16} />
                Ник игрока
              </label>
              <input
                type="text"
                value={formData.playerName}
                onChange={(e) => setFormData({ ...formData, playerName: e.target.value })}
                className="w-full bg-surface border border-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                placeholder="Steve"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Игрок должен быть онлайн на сервере
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-400 mb-2">
                <DollarSign className="inline mr-2" size={16} />
                Сумма штрафа (алмазы)
              </label>
              <input
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="w-full bg-surface border border-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                placeholder="100"
                min={1}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-400 mb-2">
              <FileText className="inline mr-2" size={16} />
              Причина штрафа
            </label>
            <textarea
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              className="w-full bg-surface border border-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors resize-none"
              placeholder="Опишите причину штрафа..."
              rows={4}
              required
            />
          </div>

          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="text-yellow-500 flex-shrink-0 mt-0.5" size={20} />
              <div className="text-sm text-yellow-200">
                <p className="font-semibold mb-1">Внимание!</p>
                <p>Игрок получит уведомление о штрафе. Штраф необходимо будет оплатить через личный кабинет на сайте.</p>
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold py-4 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Выписывание...
                </>
              ) : (
                <>
                  <Send size={20} />
                  Выписать штраф
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => router.push('/government')}
              className="px-8 py-4 border border-border rounded-lg text-gray-400 hover:text-white hover:border-primary transition-colors"
            >
              Отмена
            </button>
          </div>
        </motion.form>
      </div>
    </div>
  );
}
