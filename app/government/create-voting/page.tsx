'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Vote, Image as ImageIcon, Plus, Minus, Send, Loader2, Eye, EyeOff } from 'lucide-react';
import CloudinaryUploadWidget from '@/components/ui/CloudinaryUploadWidget';

export default function CreateVotingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    durationHours: 48,
    imageUrl: '',
    anonymous: false,
    options: ['', ''],
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
      if (data.role !== 'media' && data.role !== 'president') {
        alert('Недостаточно прав. Требуется роль СМИ.');
        router.push('/profile');
        return;
      }

      setUser(data);
    } catch (error) {
      router.push('/login');
    }
  };

  const addOption = () => {
    if (formData.options.length < 10) {
      setFormData({ ...formData, options: [...formData.options, ''] });
    }
  };

  const removeOption = (index: number) => {
    if (formData.options.length > 2) {
      const newOptions = formData.options.filter((_, i) => i !== index);
      setFormData({ ...formData, options: newOptions });
    }
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData({ ...formData, options: newOptions });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const validOptions = formData.options.filter(opt => opt.trim());

      if (validOptions.length < 2) {
        alert('Необходимо минимум 2 варианта ответа');
        setLoading(false);
        return;
      }

      const response = await fetch('/api/government/voting/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          durationHours: formData.durationHours,
          options: validOptions,
          imageUrl: formData.imageUrl || null,
          anonymous: formData.anonymous,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Ошибка при создании голосования');
      }

      alert('Голосование успешно создано!');
      router.push('/government');
    } catch (error: any) {
      alert(error.message || 'Ошибка при создании голосования');
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
            <span className="gradient-text">Создать голосование</span>
          </h1>
          <p className="text-gray-400">
            Создайте голосование для всех игроков сервера
          </p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onSubmit={handleSubmit}
          className="bg-card border border-border rounded-2xl p-8 space-y-6"
        >
          <div>
            <label className="block text-sm font-semibold text-gray-400 mb-2">
              <Vote className="inline mr-2" size={16} />
              Вопрос голосования
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full bg-surface border border-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
              placeholder="Например: Кого выбрать мэром города?"
              required
              maxLength={100}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-400 mb-2">
              Описание
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-surface border border-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors resize-none"
              placeholder="Дополнительная информация о голосовании..."
              rows={4}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-400 mb-2">
                Длительность (часов)
              </label>
              <input
                type="number"
                value={formData.durationHours}
                onChange={(e) => setFormData({ ...formData, durationHours: parseInt(e.target.value) })}
                className="w-full bg-surface border border-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                min={1}
                max={168}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-400 mb-2">
                <ImageIcon className="inline mr-2" size={16} />
                Изображение (опционально)
              </label>
              <div className="space-y-2">
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="w-full bg-surface border border-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                  placeholder="Или вставьте ссылку на изображение"
                />
                <CloudinaryUploadWidget
                  onUpload={(url) => setFormData({ ...formData, imageUrl: url })}
                  buttonText="Загрузить изображение с ПК"
                  resourceType="image"
                  buttonClass="block w-full bg-primary/10 border border-primary/30 rounded-lg px-4 py-3 text-center text-primary hover:bg-primary/20 transition-colors cursor-pointer"
                />
                {formData.imageUrl && (
                  <img
                    src={formData.imageUrl}
                    alt="Preview"
                    className="w-full h-32 object-cover rounded-lg"
                  />
                )}
              </div>
            </div>
          </div>

          <div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.anonymous}
                onChange={(e) => setFormData({ ...formData, anonymous: e.target.checked })}
                className="w-5 h-5 rounded border-border bg-surface checked:bg-primary focus:ring-2 focus:ring-primary"
              />
              <span className="text-gray-300 flex items-center gap-2">
                {formData.anonymous ? <EyeOff size={16} /> : <Eye size={16} />}
                Анонимное голосование (результаты скрыты до окончания)
              </span>
            </label>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-400 mb-3">
              Варианты ответов (минимум 2)
            </label>
            <div className="space-y-3">
              {formData.options.map((option, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => updateOption(index, e.target.value)}
                    className="flex-1 bg-surface border border-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                    placeholder={`Вариант ${index + 1}`}
                    required
                    maxLength={100}
                  />
                  {formData.options.length > 2 && (
                    <button
                      type="button"
                      onClick={() => removeOption(index)}
                      className="px-4 py-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 hover:bg-red-500/30 transition-colors"
                    >
                      <Minus size={20} />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {formData.options.length < 10 && (
              <button
                type="button"
                onClick={addOption}
                className="mt-3 flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
              >
                <Plus size={20} />
                Добавить вариант
              </button>
            )}
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-primary to-secondary text-black font-bold py-4 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Создание...
                </>
              ) : (
                <>
                  <Send size={20} />
                  Создать голосование
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
