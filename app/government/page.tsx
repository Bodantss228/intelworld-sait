'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Newspaper, Vote, AlertCircle, Bell, Plus, Calendar, User, Tag } from 'lucide-react';

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

export default function GovernmentPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [votings, setVotings] = useState<Voting[]>([]);
  const [fines, setFines] = useState<Fine[]>([]);
  const [players, setPlayers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [votingLoading, setVotingLoading] = useState(false);
  const [finesLoading, setFinesLoading] = useState(false);
  const [payingFineId, setPayingFineId] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'news' | 'voting' | 'fines' | 'notifications'>('news');

  useEffect(() => {
    checkAuth();
    fetchPosts();
    fetchPlayers();
  }, []);

  useEffect(() => {
    if (activeTab === 'voting') {
      fetchVotings();
    } else if (activeTab === 'fines') {
      fetchFines();
    }
  }, [activeTab]);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/user/profile');
      if (response.ok) {
        const data = await response.json();
        setUser(data);
      }
    } catch (error) {
      console.error('Error checking auth:', error);
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
    } finally {
      setLoading(false);
    }
  };

  const fetchVotings = async () => {
    setVotingLoading(true);
    try {
      const response = await fetch('/api/government/votings');
      if (response.ok) {
        const data = await response.json();
        setVotings(data);
      }
    } catch (error) {
      console.error('Error fetching votings:', error);
    } finally {
      setVotingLoading(false);
    }
  };

  const handleVote = async (votingId: string, optionId: string) => {
    if (!user) {
      alert('Необходимо авторизоваться');
      router.push('/login');
      return;
    }

    try {
      const response = await fetch('/api/government/voting/vote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
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

  const fetchFines = async () => {
    setFinesLoading(true);
    try {
      const response = await fetch('/api/government/fines');
      if (response.ok) {
        const data = await response.json();
        const finesArray = Array.isArray(data) ? data : [];
        finesArray.sort((a: any, b: any) => {
          const aTime = new Date(a.issuedAt).getTime();
          const bTime = new Date(b.issuedAt).getTime();
          return bTime - aTime; // новые сверху
        });
        setFines(finesArray);
      }
    } catch (error) {
      console.error('Error fetching fines:', error);
    } finally {
      setFinesLoading(false);
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

  const handlePayFine = async (fineId: string) => {
    if (!user) {
      alert('Необходимо авторизоваться');
      router.push('/login');
      return;
    }

    setPayingFineId(fineId);
    try {
      const response = await fetch('/api/government/fine/pay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fineId }),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.error || 'Ошибка при оплате штрафа');
      }

      alert('Штраф оплачен!');
      await fetchFines();
      await checkAuth();
    } catch (error: any) {
      alert(error?.message || 'Ошибка при оплате штрафа');
    } finally {
      setPayingFineId(null);
    }
  };

  const handleDeleteFine = async (fineId: string) => {
    if (!user) {
      alert('Необходимо авторизоваться');
      router.push('/login');
      return;
    }

    if (user.role !== 'president') {
      alert('Недостаточно прав');
      return;
    }

    if (!confirm('Удалить этот штраф?')) {
      return;
    }

    try {
      const response = await fetch('/api/government/fine/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fineId }),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.error || 'Ошибка при удалении штрафа');
      }

      await fetchFines();
    } catch (error: any) {
      alert(error?.message || 'Ошибка при удалении штрафа');
    }
  };

  const getPlayerName = (uuid: string) => {
    const player = players.find(p => p.uuid === uuid);
    return player ? player.name : uuid;
  };

  const canCreatePost = user && (user.role === 'media' || user.role === 'president');
  const isPresident = user && user.role === 'president';

  return (
    <div className="min-h-screen bg-black py-20">
      <div className="container mx-auto px-6">
        <Link
          href="/profile"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
        >
          <span>←</span>
          <span>Назад в личный кабинет</span>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-6xl font-bold mb-4">
            <span className="gradient-text">Правительство</span>
          </h1>
          <p className="text-xl text-gray-400">
            Новости, голосования и объявления сервера
          </p>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex gap-4 mb-8 overflow-x-auto"
        >
          <button
            onClick={() => setActiveTab('news')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all whitespace-nowrap ${
              activeTab === 'news'
                ? 'bg-gradient-to-r from-primary to-secondary text-black'
                : 'bg-card border border-border text-gray-400 hover:text-white hover:border-primary'
            }`}
          >
            <Newspaper size={20} />
            Новости
          </button>

          <button
            onClick={() => setActiveTab('voting')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all whitespace-nowrap ${
              activeTab === 'voting'
                ? 'bg-gradient-to-r from-primary to-secondary text-black'
                : 'bg-card border border-border text-gray-400 hover:text-white hover:border-primary'
            }`}
          >
            <Vote size={20} />
            Голосования
          </button>

          <button
            onClick={() => setActiveTab('fines')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all whitespace-nowrap ${
              activeTab === 'fines'
                ? 'bg-gradient-to-r from-primary to-secondary text-black'
                : 'bg-card border border-border text-gray-400 hover:text-white hover:border-primary'
            }`}
          >
            <AlertCircle size={20} />
            Штрафы
          </button>

          <button
            onClick={() => setActiveTab('notifications')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all whitespace-nowrap ${
              activeTab === 'notifications'
                ? 'bg-gradient-to-r from-primary to-secondary text-black'
                : 'bg-card border border-border text-gray-400 hover:text-white hover:border-primary'
            }`}
          >
            <Bell size={20} />
            Объявления
          </button>
        </motion.div>

        {/* News Tab */}
        {activeTab === 'news' && (
          <div>
            {canCreatePost && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-8"
              >
                <Link
                  href="/government/create-post"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-secondary text-black font-bold px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
                >
                  <Plus size={20} />
                  Создать новость
                </Link>
              </motion.div>
            )}

            {loading ? (
              <div className="text-center py-20">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
              </div>
            ) : posts.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <Newspaper size={64} className="mx-auto mb-4 text-gray-600" />
                <p className="text-xl text-gray-400">Новостей пока нет</p>
              </motion.div>
            ) : (
              <div className="flex justify-center">
                <div className="space-y-6 w-full max-w-3xl">
                  {posts.map((post, index) => (
                    <motion.article
                      key={post.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-card border border-border rounded-2xl p-8 hover:border-primary/50 transition-all"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h2 className="text-3xl font-bold mb-2 text-white hover:text-primary transition-colors">
                            {post.title}
                          </h2>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <User size={14} />
                              {post.author}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar size={14} />
                              {new Date(post.createdAt).toLocaleDateString('ru-RU')}
                            </span>
                          </div>
                        </div>
                      </div>

                      {post.imageUrl && (
                        <div className="mb-4 rounded-lg overflow-hidden">
                          <img
                            src={`/api/proxy-image?url=${encodeURIComponent(post.imageUrl)}`}
                            alt={post.title}
                            className="w-full h-auto object-cover"
                            onError={(e) => {
                              console.error('Failed to load image:', post.imageUrl);
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        </div>
                      )}

                      {post.videoUrl && (
                        <div className="mb-4 rounded-lg overflow-hidden">
                          <video
                            src={post.videoUrl}
                            controls
                            className="w-full h-auto"
                          />
                        </div>
                      )}

                      <p className="text-gray-300 leading-relaxed mb-4 whitespace-pre-wrap">
                        {post.content}
                      </p>

                      {post.tags && post.tags.length > 0 && (
                        <div className="flex items-center gap-2 flex-wrap">
                          <Tag size={14} className="text-gray-500" />
                          {post.tags.map((tag, i) => (
                            <span
                              key={i}
                              className="text-xs bg-surface border border-border px-3 py-1 rounded-full text-gray-400"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </motion.article>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Voting Tab */}
        {activeTab === 'voting' && (
          <div>
            {canCreatePost && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-8"
              >
                <Link
                  href="/government/create-voting"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-secondary text-black font-bold px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
                >
                  <Plus size={20} />
                  Создать голосование
                </Link>
              </motion.div>
            )}

            {votingLoading ? (
              <div className="text-center py-20">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
              </div>
            ) : votings.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <Vote size={64} className="mx-auto mb-4 text-gray-600" />
                <p className="text-xl text-gray-400">Голосований пока нет</p>
              </motion.div>
            ) : (
              <div className="flex justify-center">
                <div className="space-y-6 w-full max-w-3xl">
                  {votings.map((voting, index) => {
                    const totalVotes = voting.options.reduce((sum, opt) => sum + opt.votes, 0);
                    const hasVoted = user && voting.votes[user.uuid];
                    const isActive = voting.active && new Date(voting.endsAt) > new Date();
                    const showResults = !voting.anonymous || !isActive || hasVoted;

                    return (
                      <motion.div
                        key={voting.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-card border border-border rounded-2xl p-8"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h2 className="text-3xl font-bold mb-2 text-white">
                              {voting.title}
                            </h2>
                            <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                              <span className="flex items-center gap-1">
                                <User size={14} />
                                {voting.createdBy}
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar size={14} />
                                До {new Date(voting.endsAt).toLocaleDateString('ru-RU')}
                              </span>
                            </div>
                            <p className="text-gray-400 mb-4">{voting.description}</p>
                          </div>
                          {!isActive && (
                            <span className="px-3 py-1 bg-red-500/20 border border-red-500/50 rounded-full text-red-400 text-sm">
                              Завершено
                            </span>
                          )}
                        </div>

                        {voting.imageUrl && (
                          <div className="mb-6 rounded-lg overflow-hidden">
                            <img
                              src={`/api/proxy-image?url=${encodeURIComponent(voting.imageUrl)}`}
                              alt={voting.title}
                              className="w-full h-auto object-cover"
                              onError={(e) => {
                                console.error('Failed to load image:', voting.imageUrl);
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                          </div>
                        )}

                        <div className="space-y-3">
                          {voting.options.map((option) => {
                            const percentage = totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0;
                            const isSelected = hasVoted && voting.votes[user.uuid] === option.id;
                            const votersForOption = Object.entries(voting.votes)
                              .filter(([_, optId]) => optId === option.id)
                              .map(([uuid]) => uuid);

                            return (
                              <div key={option.id} className="relative">
                                <button
                                  onClick={() => isActive && !hasVoted && handleVote(voting.id, option.id)}
                                  disabled={!isActive || hasVoted}
                                  className={`w-full text-left px-6 py-4 rounded-lg border transition-all relative overflow-hidden ${
                                    isSelected
                                      ? 'border-primary bg-primary/10'
                                      : hasVoted || !isActive
                                      ? 'border-border bg-surface cursor-not-allowed'
                                      : 'border-border bg-surface hover:border-primary hover:bg-primary/5 cursor-pointer'
                                  }`}
                                >
                                  {showResults && (
                                    <div
                                      className="absolute inset-0 bg-primary/20 rounded-lg transition-all"
                                      style={{ width: `${percentage}%` }}
                                    />
                                  )}
                                  <div className="flex items-center justify-between relative z-10">
                                    <span className="font-semibold text-white">{option.text}</span>
                                    {showResults && (
                                      <span className="text-gray-400">
                                        {option.votes} ({percentage.toFixed(1)}%)
                                      </span>
                                    )}
                                  </div>
                                </button>
                                {!voting.anonymous && showResults && votersForOption.length > 0 && (
                                  <div className="mt-2 ml-6 text-xs text-gray-500">
                                    Проголосовали: {votersForOption.map(uuid => getPlayerName(uuid)).join(', ')}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>

                        <div className="mt-4 text-sm text-gray-500">
                          Всего голосов: {totalVotes}
                          {hasVoted && <span className="ml-4 text-primary">✓ Вы проголосовали</span>}
                          {voting.anonymous && <span className="ml-4 text-gray-400">🔒 Анонимное</span>}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Fines Tab */}
        {activeTab === 'fines' && (
          <div>
            {isPresident && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-8"
              >
                <Link
                  href="/government/create-fine"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
                >
                  <Plus size={20} />
                  Выписать штраф
                </Link>
              </motion.div>
            )}

            {finesLoading ? (
              <div className="text-center py-20">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
              </div>
            ) : fines.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <AlertCircle size={64} className="mx-auto mb-4 text-gray-600" />
                <p className="text-xl text-gray-400">
                  {isPresident ? 'Штрафов пока нет' : 'У вас нет штрафов'}
                </p>
              </motion.div>
            ) : (
              <div className="space-y-4">
                {fines.map((fine, index) => (
                  <motion.div
                    key={fine.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`bg-card border rounded-2xl p-6 ${
                      fine.paid ? 'border-green-500/30' : 'border-red-500/50'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-2xl font-bold text-white">{fine.playerName}</h3>
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            fine.paid
                              ? 'bg-green-500/20 border border-green-500/50 text-green-400'
                              : 'bg-red-500/20 border border-red-500/50 text-red-400'
                          }`}>
                            {fine.paid ? 'Оплачен' : 'Не оплачен'}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                          <span className="flex items-center gap-1">
                            <User size={14} />
                            Выписал: {fine.issuedBy}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar size={14} />
                            {new Date(fine.issuedAt).toLocaleDateString('ru-RU')}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-red-400">{fine.amount}</div>
                        <div className="text-sm text-gray-500">алмазов</div>
                      </div>
                    </div>

                    <div className="bg-surface border border-border rounded-lg p-4 mb-4">
                      <p className="text-sm font-semibold text-gray-400 mb-1">Причина:</p>
                      <p className="text-gray-300">{fine.reason}</p>
                    </div>

                    {isPresident && (
                      <button
                        onClick={() => handleDeleteFine(fine.id)}
                        className="w-full mb-3 bg-red-500/20 border border-red-500/50 text-red-300 font-bold py-3 rounded-lg hover:bg-red-500/30 transition-colors"
                      >
                        Удалить штраф
                      </button>
                    )}

                    {!fine.paid && user && fine.playerUuid === user.uuid && (
                      <button
                        onClick={() => handlePayFine(fine.id)}
                        disabled={payingFineId === fine.id}
                        className={`w-full bg-gradient-to-r from-primary to-secondary text-black font-bold py-3 rounded-lg transition-opacity ${
                          payingFineId === fine.id ? 'opacity-60 cursor-not-allowed' : 'hover:opacity-90'
                        }`}
                      >
                        {payingFineId === fine.id ? 'Оплата...' : 'Оплатить штраф'}
                      </button>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <Bell size={64} className="mx-auto mb-4 text-gray-600" />
            <p className="text-xl text-gray-400 mb-4">Раздел объявлений в разработке</p>
            <p className="text-gray-500">Скоро здесь появятся важные объявления от президента</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
