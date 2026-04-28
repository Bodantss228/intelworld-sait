'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Upload, Image as ImageIcon, Video, Trash2, Loader2, CheckCircle, XCircle } from 'lucide-react';

interface UploadedFile {
  name: string;
  size: number;
  type: string;
  preview?: string;
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
}

export default function AdminGalleryPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSeason, setSelectedSeason] = useState<number>(5);
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [uploading, setUploading] = useState(false);

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

      // Проверяем роль (президент или СМИ)
      if (data.role !== 'president' && data.role !== 'media') {
        alert('Недостаточно прав. Требуется роль Президента или СМИ.');
        router.push('/profile');
        return;
      }

      setUser(data);
    } catch (error) {
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);

    const newFiles: UploadedFile[] = selectedFiles.map(file => {
      const isImage = file.type.startsWith('image/');
      const isVideo = file.type.startsWith('video/');

      if (!isImage && !isVideo) {
        return {
          name: file.name,
          size: file.size,
          type: file.type,
          status: 'error' as const,
          error: 'Неподдерживаемый формат файла',
        };
      }

      if (file.size > 100 * 1024 * 1024) { // 100MB
        return {
          name: file.name,
          size: file.size,
          type: file.type,
          status: 'error' as const,
          error: 'Файл слишком большой (макс. 100MB)',
        };
      }

      return {
        name: file.name,
        size: file.size,
        type: file.type,
        preview: isImage ? URL.createObjectURL(file) : undefined,
        status: 'pending' as const,
      };
    });

    setFiles([...files, ...newFiles]);
  };

  const removeFile = (index: number) => {
    const newFiles = [...files];
    if (newFiles[index].preview) {
      URL.revokeObjectURL(newFiles[index].preview!);
    }
    newFiles.splice(index, 1);
    setFiles(newFiles);
  };

  const handleUpload = async () => {
    setUploading(true);

    // В реальной реализации здесь будет загрузка на GitHub или Vercel Blob
    // Пока что симулируем загрузку
    for (let i = 0; i < files.length; i++) {
      if (files[i].status !== 'pending') continue;

      const newFiles = [...files];
      newFiles[i].status = 'uploading';
      setFiles(newFiles);

      // Симуляция загрузки
      await new Promise(resolve => setTimeout(resolve, 1000));

      newFiles[i].status = 'success';
      setFiles(newFiles);
    }

    setUploading(false);
    alert('Файлы успешно загружены! (Демо режим - реальная загрузка будет добавлена позже)');
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  const pendingFiles = files.filter(f => f.status === 'pending' || f.status === 'uploading');
  const canUpload = pendingFiles.length > 0 && !uploading;

  return (
    <div className="min-h-screen bg-black py-20">
      <div className="container mx-auto px-6 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-5xl font-bold mb-4">
            <span className="gradient-text">Загрузка медиа в галерею</span>
          </h1>
          <p className="text-gray-400">
            Загрузите фото и видео для галереи сезонов
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card border border-border rounded-2xl p-8 space-y-6"
        >
          {/* Выбор сезона */}
          <div>
            <label className="block text-sm font-semibold text-gray-400 mb-3">
              Выберите сезон
            </label>
            <div className="grid grid-cols-5 gap-3">
              {[1, 2, 3, 4, 5].map((season) => (
                <button
                  key={season}
                  onClick={() => setSelectedSeason(season)}
                  className={`py-3 rounded-lg font-semibold transition-all ${
                    selectedSeason === season
                      ? 'bg-gradient-to-r from-primary to-secondary text-black'
                      : 'bg-surface border border-border text-gray-400 hover:border-primary'
                  }`}
                >
                  Сезон {season}
                </button>
              ))}
            </div>
          </div>

          {/* Зона загрузки */}
          <div>
            <label className="block text-sm font-semibold text-gray-400 mb-3">
              Загрузить файлы
            </label>
            <div className="border-2 border-dashed border-border rounded-lg p-12 text-center hover:border-primary transition-colors cursor-pointer">
              <input
                type="file"
                multiple
                accept="image/*,video/*"
                onChange={handleFileSelect}
                className="hidden"
                id="file-upload"
                disabled={uploading}
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <Upload size={48} className="mx-auto mb-4 text-gray-600" />
                <p className="text-lg text-gray-300 mb-2">
                  Нажмите для выбора файлов или перетащите сюда
                </p>
                <p className="text-sm text-gray-500">
                  Поддерживаются изображения (JPG, PNG, GIF) и видео (MP4, MOV, WEBM)
                </p>
                <p className="text-xs text-gray-600 mt-2">
                  Максимальный размер файла: 100MB
                </p>
              </label>
            </div>
          </div>

          {/* Список файлов */}
          {files.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4">
                Выбрано файлов: {files.length}
              </h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="bg-surface border border-border rounded-lg p-4 flex items-center gap-4"
                  >
                    {/* Превью */}
                    <div className="flex-shrink-0 w-16 h-16 bg-black rounded-lg overflow-hidden flex items-center justify-center">
                      {file.preview ? (
                        <img src={file.preview} alt={file.name} className="w-full h-full object-cover" />
                      ) : file.type.startsWith('video/') ? (
                        <Video size={32} className="text-gray-600" />
                      ) : (
                        <ImageIcon size={32} className="text-gray-600" />
                      )}
                    </div>

                    {/* Информация */}
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium truncate">{file.name}</p>
                      <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
                      {file.error && (
                        <p className="text-sm text-red-400 mt-1">{file.error}</p>
                      )}
                    </div>

                    {/* Статус */}
                    <div className="flex-shrink-0">
                      {file.status === 'pending' && (
                        <button
                          onClick={() => removeFile(index)}
                          disabled={uploading}
                          className="p-2 text-gray-400 hover:text-red-400 transition-colors disabled:opacity-50"
                        >
                          <Trash2 size={20} />
                        </button>
                      )}
                      {file.status === 'uploading' && (
                        <Loader2 className="animate-spin text-primary" size={24} />
                      )}
                      {file.status === 'success' && (
                        <CheckCircle className="text-green-500" size={24} />
                      )}
                      {file.status === 'error' && (
                        <XCircle className="text-red-500" size={24} />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Кнопки действий */}
          <div className="flex gap-4 pt-4">
            <button
              onClick={handleUpload}
              disabled={!canUpload}
              className="flex-1 bg-gradient-to-r from-primary to-secondary text-black font-bold py-4 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {uploading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Загрузка...
                </>
              ) : (
                <>
                  <Upload size={20} />
                  Загрузить файлы
                </>
              )}
            </button>

            <button
              onClick={() => router.push('/government')}
              className="px-8 py-4 border border-border rounded-lg text-gray-400 hover:text-white hover:border-primary transition-colors"
            >
              Отмена
            </button>
          </div>

          {/* Предупреждение */}
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
            <p className="text-sm text-yellow-200">
              <strong>Примечание:</strong> Это демо-версия админ-панели. Реальная загрузка файлов на GitHub или Vercel Blob Storage будет добавлена после настройки API ключей.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
