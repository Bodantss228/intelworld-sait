import fs from 'fs';
import path from 'path';

const DATA_DIR = process.env.MINECRAFT_DATA_DIR || path.join(process.cwd(), 'data');

export interface VerificationCode {
  uuid: string;
  username: string;
  code: string;
  expiresAt: number;
}

export interface UserAccount {
  uuid: string;
  username: string;
  createdAt: number;
  lastLogin: number;
}

export interface Transaction {
  timestamp: string;
  type: string;
  playerUuid: string;
  playerName: string;
  amount: number;
  balanceAfter: number;
  executorUuid: string;
  executorName: string;
}

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function readJsonFile<T>(filename: string, defaultValue: T): T {
  ensureDataDir();
  const filePath = path.join(DATA_DIR, filename);

  if (!fs.existsSync(filePath)) {
    return defaultValue;
  }

  try {
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading ${filename}:`, error);
    return defaultValue;
  }
}

function writeJsonFile<T>(filename: string, data: T): void {
  ensureDataDir();
  const filePath = path.join(DATA_DIR, filename);

  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error(`Error writing ${filename}:`, error);
  }
}

export function getVerificationCodes(): VerificationCode[] {
  return readJsonFile<VerificationCode[]>('verification-codes.json', []);
}

export function saveVerificationCodes(codes: VerificationCode[]): void {
  writeJsonFile('verification-codes.json', codes);
}

export function addVerificationCode(code: VerificationCode): void {
  const codes = getVerificationCodes();
  const now = Date.now();

  const validCodes = codes.filter(c => c.expiresAt > now && c.uuid !== code.uuid);
  validCodes.push(code);

  saveVerificationCodes(validCodes);
}

export function verifyCode(username: string, code: string): VerificationCode | null {
  const codes = getVerificationCodes();
  const now = Date.now();

  const validCode = codes.find(
    c => c.username.toLowerCase() === username.toLowerCase() &&
         c.code === code &&
         c.expiresAt > now
  );

  if (validCode) {
    const remainingCodes = codes.filter(c => c.code !== code);
    saveVerificationCodes(remainingCodes);
  }

  return validCode || null;
}

export function getAccounts(): Record<string, UserAccount> {
  return readJsonFile<Record<string, UserAccount>>('accounts.json', {});
}

export function saveAccounts(accounts: Record<string, UserAccount>): void {
  writeJsonFile('accounts.json', accounts);
}

export function getAccount(uuid: string): UserAccount | null {
  const accounts = getAccounts();
  return accounts[uuid] || null;
}

export function createOrUpdateAccount(uuid: string, username: string): UserAccount {
  const accounts = getAccounts();
  const now = Date.now();

  if (accounts[uuid]) {
    accounts[uuid].username = username;
    accounts[uuid].lastLogin = now;
  } else {
    accounts[uuid] = {
      uuid,
      username,
      createdAt: now,
      lastLogin: now,
    };
  }

  saveAccounts(accounts);
  return accounts[uuid];
}

export function getBalances(): Record<string, number> {
  return readJsonFile<Record<string, number>>('balances.json', {});
}

export function getBalance(uuid: string): number {
  const balances = getBalances();
  return balances[uuid] || 0;
}

export function getTransactions(): Transaction[] {
  return readJsonFile<Transaction[]>('transactions.json', []);
}

export function getUserTransactions(uuid: string, limit: number = 50): Transaction[] {
  const transactions = getTransactions();
  return transactions
    .filter(t => t.playerUuid === uuid)
    .slice(-limit)
    .reverse();
}
