'use client';

import { useState } from 'react';
import { Download, ChevronDown, ChevronUp, CheckCircle, AlertCircle, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MODPACK_DOWNLOAD_URL =
  'https://github.com/Bodantss228/IntellWorld-What-If-sbork/releases/download/Tag_version_v1/IntellWorld.What.If.zip';

export default function DownloadsPage() {
  const [expandedLauncher, setExpandedLauncher] = useState<string | null>(null);

  const launchers = [
    {
      id: 'tlauncher',
      name: 'TLauncher (Рекомендуется)',
      steps: [
        'Скачайте и установите TLauncher',
        'Скачайте ZIP-архив модпака выше',
        'Распакуйте папку в .minecraft/versions',
        'В TLauncher в списке версий выберите IntellWorld What If',
        'Запустите игру и кайфуйте',
      ],
    },
    {
      id: 'manual',
      name: 'Ручная установка',
      steps: [
        'Скачайте ZIP-архив модпака выше',
        'Распакуйте в папку .minecraft/versions',
        'Дальше сами',
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold mb-6">
            <span className="gradient-text">Скачать</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Установите модпак IntelWorld и присоединяйтесь к юбилейному сезону
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-card border border-primary/30 rounded-2xl p-8 mb-12 text-center glow-purple">
            <div className="mb-6">
              <h2 className="text-3xl font-bold mb-2">IntellWorld Modpack</h2>
              <p className="text-gray-400">Сезон 5: "What If..." • Minecraft 1.21.8 • Fabric</p>
            </div>

            <div className="flex items-center justify-center gap-6 mb-8">
              <div className="text-left">
                <p className="text-sm text-gray-500">Дата обновления</p>
                <p className="text-lg font-semibold">2 мая 2026</p>
              </div>
            </div>

            <a
              href={MODPACK_DOWNLOAD_URL}
              className="bg-primary text-black px-10 py-4 rounded-lg font-bold text-lg hover:bg-primary/90 transition-all inline-flex items-center gap-2"
            >
              <Download size={24} />
              Скачать модпак
            </a>
          </div>

          <div className="bg-card border border-border rounded-2xl p-8 mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <AlertCircle className="text-primary" size={28} />
              Системные требования
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-400">Минимальные</h3>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start gap-2">
                    <CheckCircle size={20} className="text-success mt-0.5 flex-shrink-0" />
                    <span>Компьютер</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle size={20} className="text-success mt-0.5 flex-shrink-0" />
                    <span>Мамина карточка</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4 text-primary">Рекомендуемые</h3>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start gap-2">
                    <CheckCircle size={20} className="text-primary mt-0.5 flex-shrink-0" />
                    <span>Квантовый адронный коллайдер</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle size={20} className="text-primary mt-0.5 flex-shrink-0" />
                    <span>Папина кредитка</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl p-8 mb-12">
            <h2 className="text-2xl font-bold mb-6">Инструкция по установке</h2>

            <div className="space-y-4">
              {launchers.map((launcher) => (
                <div key={launcher.id} className="border border-border rounded-lg overflow-hidden">
                  <button
                    onClick={() =>
                      setExpandedLauncher(expandedLauncher === launcher.id ? null : launcher.id)
                    }
                    className="w-full px-6 py-4 flex items-center justify-between bg-surface hover:bg-surface/70 transition-colors"
                  >
                    <span className="text-lg font-semibold">{launcher.name}</span>
                    {expandedLauncher === launcher.id ? (
                      <ChevronUp className="text-primary" size={24} />
                    ) : (
                      <ChevronDown className="text-primary" size={24} />
                    )}
                  </button>

                  <AnimatePresence>
                    {expandedLauncher === launcher.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 py-6 bg-black/30">
                          <ol className="space-y-4">
                            {launcher.steps.map((step, index) => (
                              <li key={index} className="flex items-start gap-3">
                                <div className="w-6 h-6 rounded-full bg-primary text-black flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                                  {index + 1}
                                </div>
                                <span className="text-gray-300">{step}</span>
                              </li>
                            ))}
                          </ol>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-r from-secondary/20 to-primary/20 border border-secondary/30 rounded-2xl p-10 text-center">
            <h3 className="text-2xl font-bold mb-4">Нужна помощь?</h3>
            <p className="text-gray-300 mb-6">
              Справляйтесь сами или напишите нам
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://t.me/bodantss"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-primary text-black px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-all inline-flex items-center justify-center gap-2"
              >
                <ExternalLink size={20} />
                @bodantss
              </a>
              <a
                href="https://t.me/photonxxl"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-secondary text-white px-8 py-3 rounded-lg font-semibold hover:bg-secondary/90 transition-all inline-flex items-center justify-center gap-2"
              >
                <ExternalLink size={20} />
                @photonxxl
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
