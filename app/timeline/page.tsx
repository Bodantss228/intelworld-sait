'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Calendar, Users, Sparkles, Image as ImageIcon } from 'lucide-react';

export default function TimelinePage() {
  const seasons = [
    {
      number: 1,
      name: 'Начало',
      period: '2020',
      description: 'Первый сезон IntelWorld. Основание сервера и формирование сообщества.',
      highlights: ['Создание первых городов', 'Формирование экономики', 'Первые игроки'],
      color: '#6B7280',
      hasGallery: false,
    },
    {
      number: 2,
      name: 'Развитие',
      period: '2021',
      description: 'Расширение мира и появление первых крупных проектов.',
      highlights: ['Торговые пути', 'Первые войны', 'Развитие инфраструктуры'],
      color: '#10B981',
      hasGallery: false,
    },
    {
      number: 3,
      name: 'Золотая эра',
      period: '2022-2023',
      description: 'Пик активности сервера. Создание банковской системы.',
      highlights: ['Запуск банка', 'Массовые ивенты', 'Рекорд онлайна'],
      color: '#FFD700',
      hasGallery: true,
    },
    {
      number: 4,
      name: 'Технологии',
      period: '2024',
      description: 'Внедрение маркетплейсов и первых ИИ-систем.',
      highlights: ['Авито и WB', 'Первая версия Клео', 'Модернизация'],
      color: '#3B82F6',
      hasGallery: true,
    },
    {
      number: 5,
      name: 'What If...',
      period: '2025-2026',
      description: 'Юбилейный сезон. Исследование альтернативных реальностей и временных аномалий.',
      highlights: ['Временные аномалии', 'Мультивселенная', 'Клео 2.0'],
      color: '#9333EA',
      current: true,
      hasGallery: false,
    },
  ];

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-6 py-20">
        <div className="text-center mb-20">
          <h1 className="text-6xl font-bold mb-6">
            <span className="gradient-text">Архив сезонов</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            История IntelWorld от первого дня до настоящего момента
          </p>
        </div>

        <div className="max-w-5xl mx-auto relative">
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-secondary to-accent" />

          {seasons.map((season, index) => (
            <motion.div
              key={season.number}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`relative mb-16 ${
                index % 2 === 0 ? 'md:pr-1/2 md:text-right' : 'md:pl-1/2 md:ml-auto'
              }`}
            >
              <div className="absolute left-8 md:left-1/2 top-8 w-4 h-4 rounded-full bg-black border-4 transform -translate-x-1/2 z-10"
                   style={{ borderColor: season.color }} />

              <div className={`ml-20 md:ml-0 ${index % 2 === 0 ? 'md:mr-16' : 'md:ml-16'}`}>
                <div className={`bg-card border rounded-2xl p-8 hover:border-opacity-100 transition-all ${
                  season.current ? 'border-primary glow-purple' : 'border-border'
                }`}>
                  {season.current && (
                    <div className="inline-block bg-primary text-black text-xs font-bold px-3 py-1 rounded-full mb-4">
                      ТЕКУЩИЙ СЕЗОН
                    </div>
                  )}

                  <div className="flex items-center gap-3 mb-4">
                    <div className="text-5xl font-bold" style={{ color: season.color }}>
                      #{season.number}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">{season.name}</h3>
                      <div className="flex items-center gap-2 text-gray-500 text-sm">
                        <Calendar size={14} />
                        <span>{season.period}</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-400 mb-6 leading-relaxed">
                    {season.description}
                  </p>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                      <Sparkles size={16} style={{ color: season.color }} />
                      <span className="font-semibold">Ключевые моменты:</span>
                    </div>
                    <ul className="space-y-2">
                      {season.highlights.map((highlight, i) => (
                        <li key={i} className="flex items-center gap-2 text-gray-400 text-sm">
                          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: season.color }} />
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {season.hasGallery && (
                    <Link
                      href={`/gallery/${season.number}`}
                      className="mt-6 flex items-center justify-center gap-2 bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/30 hover:border-primary/60 text-primary px-6 py-3 rounded-lg font-semibold transition-all hover:scale-105"
                    >
                      <ImageIcon size={20} />
                      <span>Воспоминания</span>
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-20"
        >
          <div className="bg-gradient-to-r from-secondary/20 to-primary/20 border border-secondary/30 rounded-2xl p-12 max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Станьте частью истории</h2>
            <p className="text-gray-400 mb-6">
              Присоединяйтесь к юбилейному 5-му сезону и создавайте историю вместе с нами
            </p>
            <code className="bg-black border border-primary/30 px-8 py-4 rounded-lg text-primary text-xl font-mono inline-block">
              play.intelworld.ru
            </code>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
