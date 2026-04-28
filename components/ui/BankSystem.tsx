'use client';

import { useState, useEffect } from 'react';
import { Wallet, Send, History, TrendingUp, CreditCard, ArrowUpRight, ArrowDownLeft, Building2, User } from 'lucide-react';

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

interface BankSystemProps {
  username: string;
  uuid: string;
  initialBalance: number;
  role?: string;
}

export default function BankSystem({ username, uuid, initialBalance, role }: BankSystemProps) {
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

  const isPresident = role === 'president';

  useEffect(() => {
    fetchOrCreateAccounts();
    fetchTransactions();
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
            // Получаем баланс для государственного счета
            const govBalanceResponse = await fetch(`/api/bank/balance?accountNumber=0000`);
            if (govBalanceResponse.ok) {
              const govBalanceData = await govBalanceResponse.json();
              govData.balance = govBalanceData.balance;
            } else {
              govData.balance = 0;
            }
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
            from: tx.executorName,
            to: tx.playerName,
            timestamp: new Date(tx.timestamp).getTime(),
            description: tx.type === 'deposit' ? 'Пополнение' : 'Снятие',
          }));
          setTransactions(formattedTransactions);
        }
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const exchangeRates = [
    { from: 'Алмазы', to: 'Изумруды', rate: 1.5, icon: '💎' },
    { from: 'Алмазы', to: 'Золото', rate: 9, icon: '💰' },
    { from: 'Изумруды', to: 'Золото', rate: 6, icon: '🟢' },
    { from: 'Незерит', to: 'Алмазы', rate: 4, icon: '⬛' },
  ];

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

    if (amount > currentAccount.balance) {
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

      {/* Кредиты */}
      {activeTab === 'rates' && (
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
          <h3 className="text-2xl font-bold mb-6">Курсы обмена</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {exchangeRates.map((rate, index) => (
              <div key={index} className="bg-black/50 rounded-lg p-6 border border-gray-800 hover:border-yellow-500/30 transition-colors">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-3xl">{rate.icon}</div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-yellow-500">{rate.rate}x</p>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">{rate.from}</span>
                  <span className="text-gray-600">→</span>
                  <span className="text-gray-300">{rate.to}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
            <p className="text-sm text-gray-400">
              Курсы обновляются администрацией сервера. Обмен валюты доступен в банке на спавне.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
