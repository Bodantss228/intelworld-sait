'use client';

import Image from 'next/image';
import { useState } from 'react';
import {
  AlertCircle,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Download,
  ExternalLink,
  FolderOpen,
  PackagePlus,
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

const MODPACK_DOWNLOAD_URL =
  'https://github.com/Bodantss228/IntellWorld-What-If-sbork/releases/download/Tag_version_v1/IntellWorld.What.If.zip';

const UPDATE_DOWNLOAD_URL = '/downloads/IntellWorld-Update-2026-06-13.zip';

const updateSteps = [
  'Нажмите «Скачать обновление» и откройте ZIP-архив.',
  'В TLauncher нажмите кнопку с папкой, чтобы открыть папку Minecraft.',
  'Перейдите в versions -> IntellWorld What If -> mods.',
  'Распакуйте архив и перетащите все 3 .jar файла в папку mods.',
  'Запустите сборку IntellWorld What If как обычно.',
];

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
        <div className="mb-16 text-center">
          <h1 className="mb-6 text-6xl font-bold">
            <span className="gradient-text">Скачать</span>
          </h1>
          <p className="mx-auto max-w-2xl text-xl text-gray-400">
            Установите модпак IntellWorld и присоединяйтесь к сезону What If.
          </p>
        </div>

        <div className="mx-auto max-w-4xl">
          <section className="mb-12 overflow-hidden rounded-2xl border border-primary/40 bg-card glow-purple">
            <div className="border-b border-border bg-primary/10 px-6 py-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-primary p-2 text-black">
                    <PackagePlus size={24} />
                  </div>
                  <div>
                    <p className="text-sm uppercase tracking-[0.2em] text-primary">Обновление сервера</p>
                    <h2 className="text-2xl font-bold">Новые моды для сборки</h2>
                  </div>
                </div>
                <p className="text-sm text-gray-400">3 файла • 13 июня 2026</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-8 p-6 md:grid-cols-[1.1fr_0.9fr] md:p-8">
              <div>
                <p className="mb-6 text-gray-300">
                  Это небольшое обновление не заменяет основную сборку. Скачайте архив, распакуйте его и
                  перенесите все 3 мода в папку уже установленной версии.
                </p>

                <a
                  href={UPDATE_DOWNLOAD_URL}
                  download
                  className="mb-8 inline-flex items-center gap-2 rounded-lg bg-primary px-8 py-4 text-lg font-bold text-black transition-all hover:bg-primary/90"
                >
                  <Download size={24} />
                  Скачать обновление
                </a>

                <ol className="space-y-4">
                  {updateSteps.map((step, index) => (
                    <li key={step} className="flex gap-3">
                      <div className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-black">
                        {index + 1}
                      </div>
                      <span className="text-gray-300">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="rounded-xl border border-border bg-black/40 p-4">
                <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-primary">
                  <FolderOpen size={18} />
                  Где кнопка папки в TLauncher
                </div>
                <Image
                  src="/photo1.png"
                  alt="Кнопка папки в TLauncher"
                  width={1000}
                  height={562}
                  className="h-auto w-full rounded-lg border border-border"
                  priority
                />
                <p className="mt-3 text-sm text-gray-400">
                  После открытия папки Minecraft зайдите в versions, затем в папку IntellWorld What If и в mods.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-12 rounded-2xl border border-primary/30 bg-card p-8 text-center glow-purple">
            <div className="mb-6">
              <h2 className="mb-2 text-3xl font-bold">IntellWorld Modpack</h2>
              <p className="text-gray-400">Сезон 5: "What If..." • Minecraft 1.21.8 • Fabric</p>
            </div>

            <div className="mb-8 flex items-center justify-center gap-6">
              <div className="text-left">
                <p className="text-sm text-gray-500">Дата загрузки модпака</p>
                <p className="text-lg font-semibold">2 мая 2026</p>
              </div>
            </div>

            <a
              href={MODPACK_DOWNLOAD_URL}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-10 py-4 text-lg font-bold text-black transition-all hover:bg-primary/90"
            >
              <Download size={24} />
              Скачать модпак
            </a>
          </section>

          <section className="mb-12 rounded-2xl border border-border bg-card p-8">
            <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold">
              <AlertCircle className="text-primary" size={28} />
              Системные требования
            </h2>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <div>
                <h3 className="mb-4 text-lg font-semibold text-gray-400">Минимальные</h3>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start gap-2">
                    <CheckCircle size={20} className="mt-0.5 flex-shrink-0 text-success" />
                    <span>Компьютер</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle size={20} className="mt-0.5 flex-shrink-0 text-success" />
                    <span>Мамина карточка</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="mb-4 text-lg font-semibold text-primary">Рекомендуемые</h3>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start gap-2">
                    <CheckCircle size={20} className="mt-0.5 flex-shrink-0 text-primary" />
                    <span>Квантовый адронный коллайдер</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle size={20} className="mt-0.5 flex-shrink-0 text-primary" />
                    <span>Папина кредитка</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-12 rounded-2xl border border-border bg-card p-8">
            <h2 className="mb-6 text-2xl font-bold">Инструкция по установке</h2>

            <div className="space-y-4">
              {launchers.map((launcher) => (
                <div key={launcher.id} className="overflow-hidden rounded-lg border border-border">
                  <button
                    onClick={() =>
                      setExpandedLauncher(expandedLauncher === launcher.id ? null : launcher.id)
                    }
                    className="flex w-full items-center justify-between bg-surface px-6 py-4 transition-colors hover:bg-surface/70"
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
                        <div className="bg-black/30 px-6 py-6">
                          <ol className="space-y-4">
                            {launcher.steps.map((step, index) => (
                              <li key={step} className="flex items-start gap-3">
                                <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-black">
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
          </section>

          <section className="rounded-2xl border border-secondary/30 bg-gradient-to-r from-secondary/20 to-primary/20 p-10 text-center">
            <h3 className="mb-4 text-2xl font-bold">Нужна помощь?</h3>
            <p className="mb-6 text-gray-300">Справляйтесь сами или напишите нам</p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <a
                href="https://t.me/bodantss"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-8 py-3 font-semibold text-black transition-all hover:bg-primary/90"
              >
                <ExternalLink size={20} />
                @bodantss
              </a>
              <a
                href="https://t.me/photonxxl"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-secondary px-8 py-3 font-semibold text-white transition-all hover:bg-secondary/90"
              >
                <ExternalLink size={20} />
                @photonxxl
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
