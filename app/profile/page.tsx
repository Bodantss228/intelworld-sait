'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Wallet, History, Map, LogOut, Scale, Building2, TrendingUp, Calendar, Users, Sparkles, Image as ImageIcon, Newspaper, Vote, AlertCircle, Bell, Plus, Tag, User } from 'lucide-react';
import BankSystem from '@/components/ui/BankSystem';

interface UserProfile {
  uuid: string;
  username: string;
  balance: number;
  createdAt: number;
  lastLogin: number;
  role?: string;
}

interface Transaction {
  timestamp: string;
  type: string;
  playerName: string;
  amount: number;
  balanceAfter: number;
  executorName: string;
}

interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  tags: string[];
  imageUrl?: string;
  videoUrl?: string;
}

interface VotingOption {
  id: string;
  text: string;
  votes: number;
}

interface Voting {
  id: string;
  title: string;
  description: string;
  createdBy: string;
  createdAt: string;
  endsAt: string;
  options: VotingOption[];
  votes: Record<string, string>;
  active: boolean;
  imageUrl?: string;
  anonymous?: boolean;
}

interface Fine {
  id: string;
  playerUuid: string;
  playerName: string;
  amount: number;
  reason: string;
  issuedBy: string;
  issuedAt: string;
  paid: boolean;
}

type TabType = 'wallet' | 'timeline' | 'government' | 'players';
type GovernmentSubTab = 'news' | 'voting' | 'fines' | 'notifications';

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [votings, setVotings] = useState<Voting[]>([]);
  const [fines, setFines] = useState<Fine[]>([]);
  const [players, setPlayers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<TabType>('wallet');
  const [governmentSubTab, setGovernmentSubTab] = useState<GovernmentSubTab>('news');

  useEffect(() => {
    fetchProfile();
    fetchTransactions();
  }, []);

  useEffect(() => {
    if (activeTab === 'government') {
      if (governmentSubTab === 'news') {
        fetchPosts();
      } else if (governmentSubTab === 'voting') {
        fetchVotings();
        // Автообновление голосований каждые 10 секунд
        const interval = setInterval(fetchVotings, 10000);
        return () => clearInterval(interval);
      } else if (governmentSubTab === 'fines') {
        fetchFines();
      }
    } else if (activeTab === 'players') {
      fetchPlayers();
    }
  }, [activeTab, governmentSubTab]);

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/user/profile');

      if (!response.ok) {
        if (response.status === 401) {
          router.push('/login');
          return;
        }
        throw new Error('Ошибка загрузки профиля');
      }

      const data = await response.json();
      setProfile(data);
    } catch (err) {
      setError('Ошибка загрузки данных');
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async () => {
    try {
      const response = await fetch('/api/user/transactions?limit=10');

      if (response.ok) {
        const data = await response.json();
        setTransactions(data.transactions);
      }
    } catch (err) {
      console.error('Error fetching transactions:', err);
    }
  };

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/government/posts?limit=20');
      if (response.ok) {
        const data = await response.json();
        setPosts(data);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const fetchVotings = async () => {
    try {
      console.log('[Profile] Fetching votings...');
      const response = await fetch('/api/government/votings');
      console.log('[Profile] Votings response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('[Profile] Votings data:', data);

        // Убедимся что data это массив
        const votingsArray = Array.isArray(data) ? data : [];
        setVotings(votingsArray);
        console.log('[Profile] Set votings:', votingsArray.length);
      } else {
        console.error('[Profile] Failed to fetch votings:', response.status);
        setVotings([]);
      }
    } catch (error) {
      console.error('[Profile] Error fetching votings:', error);
      setVotings([]);
    }
  };

  const fetchFines = async () => {
    try {
      let url = '/api/government/fines';
      if (profile && profile.role !== 'president') {
        url += `?uuid=${profile.uuid}`;
      }
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setFines(data);
      }
    } catch (error) {
      console.error('Error fetching fines:', error);
    }
  };

  const fetchPlayers = async () => {
    try {
      const response = await fetch('/api/players');
      if (response.ok) {
        const data = await response.json();
        setPlayers(data.players || []);
      }
    } catch (error) {
      console.error('Error fetching players:', error);
    }
  };

  const handleVote = async (votingId: string, optionId: string) => {
    if (!profile) {
      alert('Необходимо авторизоваться');
      router.push('/login');
      return;
    }

    try {
      const response = await fetch('/api/government/voting/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ votingId, optionId }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Ошибка при голосовании');
      }

      alert('Ваш голос учтен!');
      fetchVotings();
    } catch (error: any) {
      alert(error.message || 'Ошибка при голосовании');
    }
  };

  const handlePayFine = async (fineId: string) => {
    if (!profile) return;

    try {
      const response = await fetch('/api/government/fine/pay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fineId }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Ошибка при оплате штрафа');
      }

      alert('Штраф оплачен!');
      fetchFines();
      fetchProfile();
    } catch (error: any) {
      alert(error.message || 'Ошибка при оплате штрафа');
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

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

  const exchangeRates = [
    { from: 'Алмазы', to: 'Изумруды', rate: 1.5, icon: '💎' },
    { from: 'Алмазы', to: 'Золото', rate: 9, icon: '💰' },
    { from: 'Изумруды', to: 'Золото', rate: 6, icon: '🟢' },
    { from: 'Незерит', to: 'Алмазы', rate: 4, icon: '⬛' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Загрузка...</p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error || 'Ошибка загрузки'}</p>
          <Link href="/login" className="text-yellow-500 hover:underline">
            Войти заново
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <nav className="border-b border-gray-800 bg-black/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold">
            <span className="text-yellow-500">Intel</span>
            <span className="text-purple-500">World</span>
          </Link>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors text-sm flex items-center gap-2"
          >
            <LogOut size={16} />
            Выйти
          </button>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Боковая панель */}
          <aside className="lg:w-64 flex-shrink-0">
            <nav className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
              <button
                onClick={() => setActiveTab('wallet')}
                className={`w-full flex items-center gap-3 px-4 py-3 transition-colors ${
                  activeTab === 'wallet'
                    ? 'bg-yellow-500/10 text-yellow-500 border-l-4 border-yellow-500'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <Wallet size={20} />
                <span className="font-medium">Банк</span>
              </button>

              <button
                onClick={() => setActiveTab('timeline')}
                className={`w-full flex items-center gap-3 px-4 py-3 transition-colors ${
                  activeTab === 'timeline'
                    ? 'bg-yellow-500/10 text-yellow-500 border-l-4 border-yellow-500'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <History size={20} />
                <span className="font-medium">Архив</span>
              </button>

              <a
                href="http://white.fnode.me:8316"
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => {
                  e.preventDefault();
                  if (confirm('Открыть карту сервера в новой вкладке?')) {
                    window.open('http://white.fnode.me:8316', '_blank');
                  }
                }}
                className="w-full flex items-center gap-3 px-4 py-3 transition-colors text-gray-400 hover:bg-gray-800 hover:text-white cursor-pointer"
              >
                <Map size={20} />
                <span className="font-medium">Карта</span>
              </a>

              <button
                onClick={() => setActiveTab('players')}
                className={`w-full flex items-center gap-3 px-4 py-3 transition-colors ${
                  activeTab === 'players'
                    ? 'bg-yellow-500/10 text-yellow-500 border-l-4 border-yellow-500'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <Users size={20} />
                <span className="font-medium">Игроки</span>
              </button>

              <button
                onClick={() => setActiveTab('government')}
                className={`w-full flex items-center gap-3 px-4 py-3 transition-colors ${
                  activeTab === 'government'
                    ? 'bg-yellow-500/10 text-yellow-500 border-l-4 border-yellow-500'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <Building2 size={20} />
                <span className="font-medium">Правительство</span>
              </button>
            </nav>
          </aside>

          {/* Основной контент */}
          <main className="flex-1">
            {activeTab === 'wallet' && (
              <BankSystem
                username={profile.username}
                uuid={profile.uuid}
                initialBalance={profile.balance}
                role={profile.role}
              />
            )}

            {activeTab === 'timeline' && (
              <div className="space-y-6">
                <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                  <h3 className="text-2xl font-bold mb-6">Архив сезонов</h3>
                  <p className="text-gray-400 mb-8">История IntelWorld от первого дня до настоящего момента</p>
                </div>

                <div className="relative">
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-yellow-500 via-purple-500 to-purple-700" />

                  {seasons.map((season, index) => (
                    <motion.div
                      key={season.number}
                      initial={{ opacity: 0, x: -50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      className="relative mb-8 ml-12"
                    >
                      <div className="absolute left-[-2rem] top-8 w-4 h-4 rounded-full bg-black border-4 z-10"
                           style={{ borderColor: season.color }} />

                      <div className={`bg-gray-900 border rounded-lg p-6 hover:border-opacity-100 transition-all ${
                        season.current ? 'border-yellow-500' : 'border-gray-800'
                      }`}>
                        {season.current && (
                          <div className="inline-block bg-yellow-500 text-black text-xs font-bold px-3 py-1 rounded-full mb-4">
                            ТЕКУЩИЙ СЕЗОН
                          </div>
                        )}

                        <div className="flex items-center gap-3 mb-4">
                          <div className="text-4xl font-bold" style={{ color: season.color }}>
                            #{season.number}
                          </div>
                          <div>
                            <h3 className="text-xl font-bold">{season.name}</h3>
                            <div className="flex items-center gap-2 text-gray-500 text-sm">
                              <Calendar size={14} />
                              <span>{season.period}</span>
                            </div>
                          </div>
                        </div>

                        <p className="text-gray-400 mb-4 leading-relaxed">
                          {season.description}
                        </p>

                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                            <Sparkles size={16} style={{ color: season.color }} />
                            <span className="font-semibold">Ключевые моменты:</span>
                          </div>
                          <ul className="space-y-1">
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
                            className="mt-4 flex items-center justify-center gap-2 bg-gradient-to-r from-yellow-500/20 to-purple-500/20 border border-yellow-500/30 hover:border-yellow-500/60 text-yellow-500 px-6 py-3 rounded-lg font-semibold transition-all hover:scale-105"
                          >
                            <ImageIcon size={20} />
                            <span>Воспоминания</span>
                          </Link>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'players' && (
              <div className="space-y-6">
                <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                  <h3 className="text-2xl font-bold mb-6">Игроки сервера</h3>

                  {players.length === 0 ? (
                    <div className="text-center py-12 text-gray-400">
                      <Users size={48} className="mx-auto mb-4 opacity-50" />
                      <p>Загрузка списка игроков...</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {players.map((player: any) => (
                        <div key={player.uuid} className="bg-black/50 border border-gray-800 rounded-lg p-4 hover:border-yellow-500/30 transition-colors">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-purple-500 rounded-lg flex items-center justify-center text-black font-bold">
                              {player.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <h4 className="font-semibold text-white">{player.name}</h4>
                              <p className="text-xs text-gray-500">
                                {player.addedAt ? new Date(player.addedAt).toLocaleDateString('ru-RU') : 'Давно'}
                              </p>
                            </div>
                          </div>
                          {player.description && (
                            <p className="text-sm text-gray-400 mt-2">{player.description}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'government' && (
              <div className="space-y-6">
                <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                  <h3 className="text-2xl font-bold mb-6">Правительство</h3>

                  <div className="flex gap-2 mb-6 overflow-x-auto">
                    {[
                      { id: 'news', label: 'Новости' },
                      { id: 'voting', label: 'Голосования' },
                      { id: 'fines', label: 'Штрафы' },
                      { id: 'notifications', label: 'Уведомления' },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setGovernmentSubTab(tab.id as GovernmentSubTab)}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                          governmentSubTab === tab.id
                            ? 'bg-yellow-500 text-black'
                            : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  <div className="bg-black/50 rounded-lg p-8">
                    {/* Новости */}
                    {governmentSubTab === 'news' && (
                      <div className="space-y-6">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="text-xl font-bold">Новости</h4>
                          {(profile?.role === 'president' || profile?.role === 'media') && (
                            <Link
                              href="/government/create-post"
                              className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-purple-500 text-black font-semibold rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
                            >
                              <Plus size={16} />
                              Создать пост
                            </Link>
                          )}
                        </div>

                        {posts.length === 0 ? (
                          <div className="text-center text-gray-400">
                            <Newspaper size={48} className="mx-auto mb-4 opacity-50" />
                            <p>Новостей пока нет</p>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {posts.map((post) => (
                              <div key={post.id} className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                                <h5 className="text-xl font-bold mb-2">{post.title}</h5>
                                <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                                  <span className="flex items-center gap-1">
                                    <User size={14} />
                                    {post.author}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Calendar size={14} />
                                    {new Date(post.createdAt).toLocaleDateString('ru-RU')}
                                  </span>
                                </div>
                                {post.tags && post.tags.length > 0 && (
                                  <div className="flex gap-2 mb-4">
                                    {post.tags.map((tag, idx) => (
                                      <span key={idx} className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded text-xs">
                                        #{tag}
                                      </span>
                                    ))}
                                  </div>
                                )}
                                <p className="text-gray-300 whitespace-pre-wrap">{post.content}</p>
                                {post.imageUrl && (
                                  <img src={post.imageUrl} alt={post.title} className="mt-4 rounded-lg max-w-full" />
                                )}
                                {post.videoUrl && (
                                  <video src={post.videoUrl} controls className="mt-4 rounded-lg max-w-full" />
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Голосования */}
                    {governmentSubTab === 'voting' && (
                      <div className="space-y-6">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="text-xl font-bold">Голосования</h4>
                          {(profile?.role === 'president' || profile?.role === 'media') && (
                            <Link
                              href="/government/create-voting"
                              className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-purple-500 text-black font-semibold rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
                            >
                              <Plus size={16} />
                              Создать голосование
                            </Link>
                          )}
                        </div>

                        {votings.length === 0 ? (
                          <div className="text-center text-gray-400">
                            <Vote size={48} className="mx-auto mb-4 opacity-50" />
                            <p>Активных голосований нет</p>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {votings
                              .filter((voting) => voting.active && new Date(voting.endsAt) > new Date())
                              .map((voting) => {
                              const totalVotes = voting.options.reduce((sum, opt) => sum + opt.votes, 0);
                              const hasVoted = profile && voting.votes[profile.uuid];

                              return (
                                <div key={voting.id} className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                                  <div className="mb-4">
                                    <h5 className="text-xl font-bold mb-2">{voting.title}</h5>
                                    <p className="text-gray-400 text-sm mb-2">{voting.description}</p>
                                    <div className="flex items-center gap-4 text-xs text-gray-500">
                                      <span>Создал: {voting.createdBy}</span>
                                      <span>Завершится: {new Date(voting.endsAt).toLocaleString('ru-RU')}</span>
                                    </div>
                                  </div>

                                  {voting.imageUrl && (
                                    <img
                                      src={voting.imageUrl}
                                      alt={voting.title}
                                      className="mb-4 rounded-lg max-w-full"
                                      crossOrigin="anonymous"
                                      onError={(e) => {
                                        e.currentTarget.style.display = 'none';
                                      }}
                                    />
                                  )}

                                  <div className="space-y-3">
                                    {voting.options.map((option) => {
                                      const percentage = totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0;

                                      return (
                                        <div key={option.id} className="space-y-2">
                                          <div className="flex justify-between items-center">
                                            <span className="text-gray-300">{option.text}</span>
                                            <span className="text-sm text-gray-400">
                                              {option.votes} ({percentage.toFixed(1)}%)
                                            </span>
                                          </div>
                                          <div className="w-full bg-gray-800 rounded-full h-2">
                                            <div
                                              className="bg-gradient-to-r from-yellow-500 to-purple-500 h-2 rounded-full transition-all"
                                              style={{ width: `${percentage}%` }}
                                            />
                                          </div>
                                          {!hasVoted && (
                                            <button
                                              onClick={() => handleVote(voting.id, option.id)}
                                              className="w-full mt-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors text-sm"
                                            >
                                              Голосовать
                                            </button>
                                          )}
                                        </div>
                                      );
                                    })}
                                  </div>

                                  {hasVoted && (
                                    <p className="mt-4 text-sm text-green-400">✓ Вы уже проголосовали</p>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Штрафы */}
                    {governmentSubTab === 'fines' && (
                      <div className="space-y-6">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="text-xl font-bold">Штрафы</h4>
                          {profile?.role === 'president' && (
                            <Link
                              href="/government/create-fine"
                              className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-purple-500 text-black font-semibold rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
                            >
                              <Plus size={16} />
                              Выписать штраф
                            </Link>
                          )}
                        </div>

                        {fines.length === 0 ? (
                          <div className="text-center text-gray-400">
                            <AlertCircle size={48} className="mx-auto mb-4 opacity-50" />
                            <p>Штрафов нет</p>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {fines.map((fine) => (
                              <div key={fine.id} className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                                <div className="flex justify-between items-start mb-4">
                                  <div>
                                    <h5 className="text-lg font-bold text-red-400">
                                      Штраф: {fine.amount} алмазов
                                    </h5>
                                    <p className="text-gray-400 text-sm mt-1">Игрок: {fine.playerName}</p>
                                  </div>
                                  {fine.paid ? (
                                    <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded text-sm">
                                      Оплачено
                                    </span>
                                  ) : (
                                    <span className="px-3 py-1 bg-red-500/20 text-red-300 rounded text-sm">
                                      Не оплачено
                                    </span>
                                  )}
                                </div>
                                <p className="text-gray-300 mb-4">{fine.reason}</p>
                                <div className="flex items-center gap-4 text-xs text-gray-500">
                                  <span>Выписал: {fine.issuedBy}</span>
                                  <span>{new Date(fine.issuedAt).toLocaleString('ru-RU')}</span>
                                </div>
                                {!fine.paid && profile?.uuid === fine.playerUuid && (
                                  <button
                                    onClick={() => handlePayFine(fine.id)}
                                    className="mt-4 w-full px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold rounded-lg transition-colors"
                                  >
                                    Оплатить штраф
                                  </button>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Уведомления */}
                    {governmentSubTab === 'notifications' && (
                      <div className="text-center text-gray-400">
                        <Bell size={48} className="mx-auto mb-4 opacity-50" />
                        <p>Уведомлений нет</p>
                        <p className="text-sm text-gray-500 mt-2">Здесь будут отображаться важные уведомления</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>

        <div className="text-center mt-8">
          <Link href="/" className="text-gray-400 hover:text-white transition-colors text-sm">
            ← Вернуться на главную
          </Link>
        </div>
      </div>
    </div>
  );
}
