'use client';

import { useEffect, useRef } from 'react';

interface CloudinaryUploadWidgetProps {
  onUpload: (url: string) => void;
  buttonText: string;
  buttonClass?: string;
  resourceType?: 'image' | 'video' | 'auto';
}

declare global {
  interface Window {
    cloudinary: any;
  }
}

export default function CloudinaryUploadWidget({
  onUpload,
  buttonText,
  buttonClass = '',
  resourceType = 'auto',
}: CloudinaryUploadWidgetProps) {
  const widgetRef = useRef<any>(null);

  useEffect(() => {
    // Загружаем Cloudinary Widget скрипт
    if (!document.getElementById('cloudinary-upload-widget')) {
      const script = document.createElement('script');
      script.id = 'cloudinary-upload-widget';
      script.src = 'https://upload-widget.cloudinary.com/global/all.js';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const openWidget = () => {
    if (!window.cloudinary) {
      alert('Загрузка виджета... Попробуйте еще раз через секунду');
      return;
    }

    if (!widgetRef.current) {
      widgetRef.current = window.cloudinary.createUploadWidget(
        {
          cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
          uploadPreset: 'intelworld_unsigned', // Создадим этот preset
          sources: ['local', 'url', 'camera'],
          multiple: false,
          resourceType: resourceType,
          clientAllowedFormats: resourceType === 'image' ? ['png', 'jpg', 'jpeg', 'gif', 'webp'] : resourceType === 'video' ? ['mp4', 'mov', 'avi', 'webm'] : undefined,
          maxFileSize: 100000000, // 100MB
          folder: 'intelworld',
          language: 'ru',
          text: {
            ru: {
              or: 'или',
              back: 'Назад',
              close: 'Закрыть',
              no_results: 'Нет результатов',
              search_placeholder: 'Поиск файлов',
              menu: {
                files: 'Мои файлы',
                web: 'Веб-адрес',
                camera: 'Камера',
              },
              local: {
                browse: 'Выбрать',
                dd_title_single: 'Перетащите файл сюда',
                dd_title_multi: 'Перетащите файлы сюда',
                drop_title_single: 'Отпустите файл для загрузки',
                drop_title_multiple: 'Отпустите файлы для загрузки',
              },
            },
          },
        },
        (error: any, result: any) => {
          if (!error && result && result.event === 'success') {
            onUpload(result.info.secure_url);
            widgetRef.current.close();
          }
          if (error) {
            console.error('Upload error:', error);
            alert('Ошибка загрузки файла');
          }
        }
      );
    }

    widgetRef.current.open();
  };

  return (
    <button
      type="button"
      onClick={openWidget}
      className={buttonClass}
    >
      {buttonText}
    </button>
  );
}
