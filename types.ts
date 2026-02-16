
export interface User {
  uid: string;
  phone: string;
  balance: number;
  inviteCode: string;
  referrerInviteCode?: string;
  vipLevel: number;
  betVolume: number;
  totalDeposited: number;
  isBanned: boolean;
  isAdmin?: boolean;
  createdAt: number;
}

export interface WinGoResult {
  period: string;
  number: number;
  color: 'red' | 'green' | 'violet';
  size: 'Big' | 'Small';
}

export interface Transaction {
  id: string;
  userId: string;
  phone: string;
  amount: number;
  trxId?: string;
  status: 'pending' | 'approved' | 'rejected';
  type: 'deposit' | 'withdrawal';
  timestamp: number;
}

export interface ReferralStat {
  level: number;
  count: number;
  commission: number;
}
