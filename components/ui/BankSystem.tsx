'use client';

import { useState, useEffect } from 'react';
import { Wallet, Send, History, TrendingUp, CreditCard, ArrowUpRight, ArrowDownLeft, Building2, User, Plus, Trash2 } from 'lucide-react';

interface BankAccount {
  accountNumber: string;
  balance?: number;
  createdAt: number;
  isGovernment?: boolean;
  ownerUuid?: string;
  ownerName?: string;
}

interface Transaction {
  id: string;
  type: 'incoming' | 'outgoing';
  amount: number;
  from: string;
  to: string;
  timestamp: number;
  description: string;
}

interface ExchangeRate {
  id: string;
  fromItem: string;
  fromAmount: number;
  toItem: string;
  toAmount: number;
  createdBy: string;
  createdAt: string;
}

const ITEMS = [
  { id: 'Diamond', name: 'Алмаз', image: '/photo/Diamond.png' },
  { id: 'Emerald', name: 'Изумруд', image: '/photo/Emerald.png' },
  { id: 'Gold_Ingot', name: 'Золотой слиток', image: '/photo/Gold_Ingot.png' },
  { id: 'Iron_Ingot', name: 'Железный слиток', image: '/photo/Iron_Ingot.png' },
  { id: 'Copper_Ingot', name: 'Медный слиток', image: '/photo/Copper_Ingot.png' },
  { id: 'Netherite_Ingot', name: 'Незеритовый слиток', image: '/photo/Netherite_Ingot.png' },
  { id: 'Netherite_Scrap', name: 'Незеритовый скрап', image: '/photo/Netherite_Scrap.png' },
];

interface BankSystemProps {
  username: string;
  uuid: string;
  initialBalance: number;
  role?: string;
  isBanker?: boolean;
  isPresident?: boolean;
}

export default function BankSystem({ username, uuid, initialBalance, role, isBanker: isBankerProp, isPresident: isPresidentProp }: BankSystemProps) {
  const [activeTab, setActiveTab] = useState<'main' | 'transfer' | 'history' | 'rates'>('main');
  const [transferTab, setTransferTab] = useState<'nickname' | 'account'>('nickname');
  const [hasAccount, setHasAccount] = useState(false);
  const [account, setAccount] = useState<BankAccount | null>(null);
  const [governmentAccount, setGovernmentAccount] = useState<BankAccount | null>(null);
  const [activeAccountType, setActiveAccountType] = useState<'personal' | 'government'>('personal');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const [transferAmount, setTransferAmount] = useState('');
  const [transferRecipient, setTransferRecipient] = useState('');
  const [transferDescription, setTransferDescription] = useState('');
  const [exchangeRates, setExchangeRates] = useState<ExchangeRate[]>([]);
  const [showCreateRateModal, setShowCreateRateModal] = useState(false);
  const [fromItem, setFromItem] = useState('Diamond');
  const [fromAmount, setFromAmount] = useState(1);
  const [toItem, setToItem] = useState('Emerald');
  const [toAmount, setToAmount] = useState(1);

  const isBanker = isBankerProp || role === 'banker';
  const isPresident = isPresidentProp || role === 'president';

  useEffect(() => {
    fetchOrCreateAccounts();
    fetchTransactions();
    fetchExchangeRates();
  }, [uuid, role]);

  const fetchOrCreateAccounts = async () => {
    try {
      // Получаем или создаем личный счет
      let personalResponse = await fetch(`/api/bank/account?uuid=${uuid}`);

      if (!personalResponse.ok) {
        // Создаем личный счет автоматически
        const createResponse = await fetch('/api/bank/account/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ playerUuid: uuid, playerName: username }),
        });

        if (createResponse.ok) {
          const data = await createResponse.json();
          // Получаем баланс для личного счета
          const balanceResponse = await fetch(`/api/bank/balance?uuid=${uuid}`);
          if (balanceResponse.ok) {
            const balanceData = await balanceResponse.json();
            data.balance = balanceData.balance;
          }
          setAccount(data);
          setHasAccount(true);
        }
      } else {
        const data = await personalResponse.json();
        // Получаем баланс для личного счета
        const balanceResponse = await fetch(`/api/bank/balance?uuid=${uuid}`);
        if (balanceResponse.ok) {
          const balanceData = await balanceResponse.json();
          data.balance = balanceData.balance;
        }
        setAccount(data);
        setHasAccount(true);
      }

      // Если президент - создаем/получаем государственный счет
      if (isPresident) {
        try {
          let govResponse = await fetch(`/api/bank/account/government?uuid=${uuid}`);

          if (!govResponse.ok) {
            // Создаем государственный счет автоматически
            const createGovResponse = await fetch('/api/bank/account/government', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ presidentUuid: uuid, presidentName: username }),
            });

            if (createGovResponse.ok) {
              const govData = await createGovResponse.json();
              // Получаем баланс для государственного счета (используем специальный UUID для 0000)
              const govBalanceResponse = await fetch(`/api/bank/balance?accountNumber=0000`);
              if (govBalanceResponse.ok) {
                const govBalanceData = await govBalanceResponse.json();
                govData.balance = govBalanceData.balance;
              } else {
                govData.balance = 0;
              }
              setGovernmentAccount(govData);
            } else {
              console.error('Failed to create government account');
            }
          } else {
            const govData = await govResponse.json();
            setGovernmentAccount(govData);
          }
        } catch (govError) {
          console.error('Error with government account:', govError);
        }
      }
    } catch (error) {
      console.error('Error fetching/creating accounts:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async () => {
    try {
      const response = await fetch(`/api/user/transactions?limit=50`);
      if (response.ok) {
        const data = await response.json();
        if (data.transactions && Array.isArray(data.transactions)) {
          // Преобразуем транзакции в нужный формат
          const formattedTransactions = data.transactions.map((tx: any) => ({
            id: `${tx.timestamp}-${tx.type}`,
            type: tx.type === 'deposit' ? 'incoming' : 'outgoing',
            amount: tx.amount,
            from: tx.executorName || 'Система',
            to: tx.playerName || 'Неизвестно',
            timestamp: new Date(tx.timestamp).getTime(),
            description: tx.description || (tx.type === 'deposit' ? 'Пополнение' : 'Снятие'),
          }));
          setTransactions(formattedTransactions);
        }
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const fetchExchangeRates = async () => {
    try {
      const response = await fetch('/api/bank/exchange/rates');
      if (response.ok) {
        const data = await response.json();
        setExchangeRates(data);
      }
    } catch (error) {
      console.error('Error fetching exchange rates:', error);
    }
  };

  const handleCreateRate = async () => {
    try {
      const response = await fetch('/api/bank/exchange/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bankerUuid: uuid,
          bankerName: username,
          fromItem,
          fromAmount,
          toItem,
          toAmount,
        }),
      });

      if (response.ok) {
        setShowCreateRateModal(false);
        fetchExchangeRates();
        setFromItem('Diamond');
        setFromAmount(1);
        setToItem('Emerald');
        setToAmount(1);
      }
    } catch (error) {
      console.error('Error creating rate:', error);
    }
  };

  const handleDeleteRate = async (rateId: string) => {
    try {
      const response = await fetch(
        `/api/bank/exchange/delete?bankerUuid=${uuid}&rateId=${rateId}`,
        { method: 'DELETE' }
      );

      if (response.ok) {
        fetchExchangeRates();
      }
    } catch (error) {
      console.error('Error deleting rate:', error);
    }
  };

  const getItemData = (itemId: string) => {
    return ITEMS.find(item => item.id === itemId) || ITEMS[0];
  };

  const handleTransfer = async () => {
    if (!account || !transferAmount || !transferRecipient) {
      alert('Заполните все обязательные поля');
      return;
    }

    const amount = parseFloat(transferAmount);
    const currentAccount = activeAccountType === 'government' ? governmentAccount : account;

    if (!currentAccount) {
      alert('Счет не найден');
      return;
    }

    if (amount <= 0) {
      alert('Сумма должна быть больше 0');
      return;
    }

    if (amount > (currentAccount.balance ?? 0)) {
      alert('Недостаточно средств на счете');
      return;
    }

    try {
      const response = await fetch('/api/bank/transfer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipient: transferRecipient,
          amount: amount,
          description: transferDescription || 'Перевод',
          transferType: transferTab,
          fromAccount: activeAccountType === 'government' ? '0000' : undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || 'Ошибка при переводе');
        return;
      }

      alert('Перевод выполнен успешно!');
      setTransferAmount('');
      setTransferRecipient('');
      setTransferDescription('');

      // Обновляем баланс
      await fetchOrCreateAccounts();
      await fetchTransactions();
    } catch (error) {
      console.error('Transfer error:', error);
      alert('Ошибка при выполнении перевода');
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

  const currentAccount = activeAccountType === 'government' ? governmentAccount : account;
  const currentBalance = currentAccount?.balance ?? 0;

  if (loading) {
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Загрузка...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Переключатель счетов для президента */}
      {isPresident && governmentAccount && (
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4">Выбор счета</h3>
          <div className="flex gap-2">
            <button
              onClick={() => setActiveAccountType('personal')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-medium transition-colors ${
                activeAccountType === 'personal'
                  ? 'bg-yellow-500 text-black'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              <User size={18} />
              Личный счет
              {account && <span className="text-xs">({account.accountNumber})</span>}
            </button>
            {governmentAccount && (
              <button
                onClick={() => setActiveAccountType('government')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-medium transition-colors ${
                  activeAccountType === 'government'
                    ? 'bg-yellow-500 text-black'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                <Building2 size={18} />
                Государственный
                <span className="text-xs">(0000)</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Навигация */}
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
        <div className="flex gap-2 overflow-x-auto">
          {[
            { id: 'main', label: 'Главная', icon: Wallet },
            { id: 'transfer', label: 'Переводы', icon: Send },
            { id: 'history', label: 'История', icon: History },
            { id: 'rates', label: 'Курсы', icon: TrendingUp },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-yellow-500 text-black'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Главная */}
      {activeTab === 'main' && currentAccount && (
        <div className="space-y-6">
          <div className={`bg-gradient-to-br rounded-lg p-8 border ${
            activeAccountType === 'government'
              ? 'from-orange-500/20 to-red-500/20 border-orange-500/30'
              : 'from-yellow-500/20 to-purple-500/20 border-yellow-500/30'
          }`}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-gray-400 text-sm mb-1">Номер счета</p>
                <p className={`text-2xl font-bold ${
                  activeAccountType === 'government' ? 'text-orange-500' : 'text-yellow-500'
                }`}>
                  {currentAccount.accountNumber}
                  {activeAccountType === 'government' && (
                    <span className="ml-2 text-xs bg-orange-500/20 border border-orange-500/50 px-2 py-1 rounded-full">
                      Государственный
                    </span>
                  )}
                </p>
              </div>
              {activeAccountType === 'government' ? (
                <Building2 size={48} className="text-orange-500" />
              ) : (
                <Wallet size={48} className="text-yellow-500" />
              )}
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-2">Баланс</p>
              <p className="text-5xl font-bold text-white mb-2">{currentBalance}</p>
              <p className="text-gray-400">алмазов</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
              <p className="text-gray-400 text-sm mb-1">Владелец</p>
              <p className="text-xl font-semibold">
                {activeAccountType === 'government' ? 'Государство IntelWorld' : username}
              </p>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
              <p className="text-gray-400 text-sm mb-1">Дата открытия</p>
              <p className="text-xl font-semibold">{formatDate(currentAccount.createdAt)}</p>
            </div>
          </div>
        </div>
      )}

      {/* Переводы */}
      {activeTab === 'transfer' && currentAccount && (
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
          <h3 className="text-2xl font-bold mb-6">
            Перевод средств
            {activeAccountType === 'government' && (
              <span className="ml-2 text-sm text-orange-500">(с государственного счета)</span>
            )}
          </h3>

          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setTransferTab('nickname')}
              className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
                transferTab === 'nickname'
                  ? 'bg-yellow-500 text-black'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              По нику
            </button>
            <button
              onClick={() => setTransferTab('account')}
              className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
                transferTab === 'account'
                  ? 'bg-yellow-500 text-black'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              По номеру счета
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                {transferTab === 'nickname' ? 'Ник получателя' : 'Номер счета получателя'}
              </label>
              <input
                type="text"
                value={transferRecipient}
                onChange={(e) => setTransferRecipient(e.target.value)}
                placeholder={transferTab === 'nickname' ? 'Введите ник игрока' : 'Введите номер счета'}
                className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-lg text-white focus:border-yellow-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Сумма</label>
              <input
                type="number"
                value={transferAmount}
                onChange={(e) => setTransferAmount(e.target.value)}
                placeholder="0"
                className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-lg text-white focus:border-yellow-500 focus:outline-none"
              />
              <p className="text-xs text-gray-500 mt-1">Доступно: {currentBalance} алмазов</p>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Комментарий (необязательно)</label>
              <input
                type="text"
                value={transferDescription}
                onChange={(e) => setTransferDescription(e.target.value)}
                placeholder="Назначение платежа"
                className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-lg text-white focus:border-yellow-500 focus:outline-none"
              />
            </div>

            <button
              onClick={handleTransfer}
              disabled={!transferAmount || !transferRecipient}
              className="w-full py-3 bg-gradient-to-r from-yellow-500 to-purple-500 text-black font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Send size={20} />
              Отправить перевод
            </button>
          </div>
        </div>
      )}

      {/* История */}
      {activeTab === 'history' && (
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
          <h3 className="text-2xl font-bold mb-6">История операций</h3>

          {transactions.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <History size={48} className="mx-auto mb-4 opacity-50" />
              <p>История операций пуста</p>
            </div>
          ) : (
            <div className="space-y-3">
              {transactions.map((tx) => (
                <div
                  key={tx.id}
                  className="bg-black/50 rounded-lg p-4 flex items-center justify-between hover:bg-black/70 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-full ${
                      tx.type === 'incoming' ? 'bg-green-500/20' : 'bg-red-500/20'
                    }`}>
                      {tx.type === 'incoming' ? (
                        <ArrowDownLeft className="text-green-400" size={20} />
                      ) : (
                        <ArrowUpRight className="text-red-400" size={20} />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold">{tx.description}</p>
                      <p className="text-sm text-gray-400">
                        {tx.type === 'incoming' ? 'От' : 'Кому'}: {tx.type === 'incoming' ? tx.from : tx.to}
                      </p>
                      <p className="text-xs text-gray-500">{formatDate(tx.timestamp)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-xl font-bold ${
                      tx.type === 'incoming' ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {tx.type === 'incoming' ? '+' : '-'}{tx.amount}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Курсы обмена */}
      {activeTab === 'rates' && (
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold">Курсы обмена</h3>
            {isBanker && (
              <button
                onClick={() => setShowCreateRateModal(true)}
                className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded-lg font-semibold inline-flex items-center gap-2 transition-colors"
              >
                <Plus size={20} />
                Добавить курс
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {exchangeRates.map((rate) => {
              const fromData = getItemData(rate.fromItem);
              const toData = getItemData(rate.toItem);

              return (
                <div key={rate.id} className="bg-black/50 rounded-lg p-6 border border-gray-800 hover:border-yellow-500/30 transition-colors">
                  <div className="flex items-center justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3 flex-1">
                      <img src={fromData.image} alt={fromData.name} className="w-12 h-12" />
                      <div>
                        <p className="text-gray-400 text-sm">{fromData.name}</p>
                        <p className="text-2xl text-yellow-500 font-bold">{rate.fromAmount}</p>
                      </div>
                    </div>

                    <div className="text-gray-600 text-2xl">→</div>

                    <div className="flex items-center gap-3 flex-1">
                      <img src={toData.image} alt={toData.name} className="w-12 h-12" />
                      <div>
                        <p className="text-gray-400 text-sm">{toData.name}</p>
                        <p className="text-2xl text-yellow-500 font-bold">{rate.toAmount}</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-800 flex items-center justify-between">
                    <div className="text-sm text-gray-400">
                      <p>Создал: {rate.createdBy}</p>
                      <p>{new Date(rate.createdAt).toLocaleDateString('ru-RU')}</p>
                    </div>

                    {isBanker && (
                      <button
                        onClick={() => handleDeleteRate(rate.id)}
                        className="text-red-500 hover:text-red-400 transition-colors p-2"
                      >
                        <Trash2 size={20} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {exchangeRates.length === 0 && (
            <div className="text-center text-gray-400 py-12">
              <p>Пока нет обменных курсов</p>
            </div>
          )}

          <div className="mt-6 bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
            <p className="text-sm text-gray-400">
              {isBanker
                ? 'Вы можете добавлять и удалять курсы обмена. Изменения применяются сразу для всех игроков.'
                : 'Курсы обновляются банкирами сервера. Обмен валюты доступен в банке на спавне.'
              }
            </p>
          </div>
        </div>
      )}

      {showCreateRateModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-xl p-8 max-w-2xl w-full border border-gray-800">
            <h2 className="text-3xl font-bold mb-6 text-yellow-500">Новый курс обмена</h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Отдаёте
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <select
                    value={fromItem}
                    onChange={(e) => setFromItem(e.target.value)}
                    className="bg-black border border-gray-700 rounded-lg px-4 py-3 text-white"
                  >
                    {ITEMS.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    min="1"
                    value={fromAmount}
                    onChange={(e) => setFromAmount(parseInt(e.target.value) || 1)}
                    className="bg-black border border-gray-700 rounded-lg px-4 py-3 text-white"
                    placeholder="Количество"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Получаете
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <select
                    value={toItem}
                    onChange={(e) => setToItem(e.target.value)}
                    className="bg-black border border-gray-700 rounded-lg px-4 py-3 text-white"
                  >
                    {ITEMS.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    min="1"
                    value={toAmount}
                    onChange={(e) => setToAmount(parseInt(e.target.value) || 1)}
                    className="bg-black border border-gray-700 rounded-lg px-4 py-3 text-white"
                    placeholder="Количество"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  onClick={handleCreateRate}
                  className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-black px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  Создать
                </button>
                <button
                  onClick={() => setShowCreateRateModal(false)}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  Отмена
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
