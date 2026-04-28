'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FileText, Image as ImageIcon, Video, Send, Loader2 } from 'lucide-react';
import CloudinaryUploadWidget from '@/components/ui/CloudinaryUploadWidget';

export default function CreatePostPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: '',
    imageUrl: '',
    videoUrl: '',
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const tags = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);

      const response = await fetch('/api/government/post/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          content: formData.content,
          tags,
          imageUrl: formData.imageUrl || null,
          videoUrl: formData.videoUrl || null,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Ошибка при создании поста');
      }

      alert('Пост успешно создан!');
      router.push('/government');
    } catch (error: any) {
      alert(error.message || 'Ошибка при создании поста');
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
            <span className="gradient-text">Создать новость</span>
          </h1>
          <p className="text-gray-400">
            Опубликуйте новость для всех игроков сервера
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
              <FileText className="inline mr-2" size={16} />
              Заголовок
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full bg-surface border border-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
              placeholder="Введите заголовок новости"
              required
              maxLength={100}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-400 mb-2">
              Содержание
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full bg-surface border border-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors resize-none"
              placeholder="Напишите текст новости..."
              rows={10}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-400 mb-2">
              Теги (через запятую)
            </label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              className="w-full bg-surface border border-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
              placeholder="новости, события, обновления"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-400 mb-2">
                <ImageIcon className="inline mr-2" size={16} />
                Изображение
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

            <div>
              <label className="block text-sm font-semibold text-gray-400 mb-2">
                <Video className="inline mr-2" size={16} />
                Видео
              </label>
              <div className="space-y-2">
                <input
                  type="url"
                  value={formData.videoUrl}
                  onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                  className="w-full bg-surface border border-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                  placeholder="Или вставьте ссылку на видео"
                />
                <CloudinaryUploadWidget
                  onUpload={(url) => setFormData({ ...formData, videoUrl: url })}
                  buttonText="Загрузить видео с ПК"
                  resourceType="video"
                  buttonClass="block w-full bg-secondary/10 border border-secondary/30 rounded-lg px-4 py-3 text-center text-secondary hover:bg-secondary/20 transition-colors cursor-pointer"
                />
                {formData.videoUrl && (
                  <video
                    src={formData.videoUrl}
                    className="w-full h-32 object-cover rounded-lg"
                    controls
                  />
                )}
              </div>
            </div>
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
                  Публикация...
                </>
              ) : (
                <>
                  <Send size={20} />
                  Опубликовать
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
