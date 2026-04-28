'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react';

export default function GalleryPage() {
  const params = useParams();
  const router = useRouter();
  const season = params.season as string;

  const [images, setImages] = useState<string[]>([]);
  const [videos, setVideos] = useState<string[]>([]);
  const [allMedia, setAllMedia] = useState<Array<{url: string, type: 'image' | 'video'}>>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  useEffect(() => {
    // Загружаем список фото и видео из GitHub
    const fetchMedia = async () => {
      try {
        const response = await fetch(
          `https://api.github.com/repos/Bodantss228/archive-season-intel/contents/seasons/season${season}`
        );
        const data = await response.json();

        if (Array.isArray(data)) {
          const mediaItems = data
            .filter((file: any) => /\.(jpg|jpeg|png|gif|mp4|mov|avi|webm)$/i.test(file.name))
            .map((file: any) => ({
              url: file.download_url,
              type: (/\.(mp4|mov|avi|webm)$/i.test(file.name) ? 'video' : 'image') as 'video' | 'image'
            }));

          setAllMedia(mediaItems);
          setImages(mediaItems.filter(m => m.type === 'image').map(m => m.url));
          setVideos(mediaItems.filter(m => m.type === 'video').map(m => m.url));
        }
      } catch (error) {
        console.error('Failed to load media:', error);
      }
    };

    fetchMedia();
  }, [season]);

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setIsLightboxOpen(true);
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
  };

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % allMedia.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + allMedia.length) % allMedia.length);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isLightboxOpen) return;

      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen, allMedia.length]);

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-6 py-20">
        <button
          onClick={() => router.push('/timeline')}
          className="flex items-center gap-2 text-gray-400 hover:text-primary transition-colors mb-8"
        >
          <ArrowLeft size={20} />
          <span>Назад к архиву</span>
        </button>

        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">
            <span className="gradient-text">Сезон {season}</span>
          </h1>
          <p className="text-gray-400">
            {allMedia.length} {allMedia.length === 1 ? 'файл' : 'файлов'} ({images.length} фото, {videos.length} видео)
          </p>
        </div>

        {allMedia.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">Загрузка...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {allMedia.map((media, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="relative aspect-square bg-surface rounded-lg overflow-hidden cursor-pointer group"
                onClick={() => openLightbox(index)}
              >
                {media.type === 'image' ? (
                  <img
                    src={media.url}
                    alt={`Media ${index + 1}`}
                    className="w-full h-full object-cover transition-transform group-hover:scale-110"
                  />
                ) : (
                  <video
                    src={media.url}
                    className="w-full h-full object-cover"
                    muted
                  />
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center">
                  <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity font-semibold">
                    {media.type === 'video' ? '▶ Видео' : 'Открыть'}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
            onClick={closeLightbox}
          >
            <button
              onClick={closeLightbox}
              className="absolute top-6 right-6 text-white hover:text-primary transition-colors z-10"
            >
              <X size={32} />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                prevImage();
              }}
              className="absolute left-6 text-white hover:text-primary transition-colors z-10"
            >
              <ChevronLeft size={48} />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
              className="absolute right-6 text-white hover:text-primary transition-colors z-10"
            >
              <ChevronRight size={48} />
            </button>

            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="max-w-7xl max-h-[90vh] w-full h-full flex items-center justify-center p-12"
              onClick={(e) => e.stopPropagation()}
            >
              {allMedia[currentIndex]?.type === 'image' ? (
                <img
                  src={allMedia[currentIndex].url}
                  alt={`Media ${currentIndex + 1}`}
                  className="max-w-full max-h-full object-contain"
                />
              ) : (
                <video
                  src={allMedia[currentIndex]?.url}
                  controls
                  autoPlay
                  className="max-w-full max-h-full object-contain"
                />
              )}
            </motion.div>

            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-white text-sm">
              {currentIndex + 1} / {allMedia.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
