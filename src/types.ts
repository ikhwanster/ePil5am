export type WasteType = 'organik' | 'anorganik_plastik' | 'anorganik_kertas' | 'anorganik_logam' | 'b3' | 'residu';

export interface WasteCategoryInfo {
  id: WasteType;
  name: string;
  pointsPerKg: number;
  color: string;
  description: string;
  examples: string[];
}

export interface WasteDeposit {
  id: string;
  citizenId: string;
  citizenName: string;
  type: WasteType;
  weight: number; // in kg
  pointsEarned: number;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface RewardItem {
  id: string;
  name: string;
  pointsCost: number;
  stock: number;
  category: string;
  description: string;
  iconName: string;
}

export interface RewardRedemption {
  id: string;
  citizenId: string;
  citizenName: string;
  rewardId: string;
  rewardName: string;
  pointsDeducted: number;
  date: string;
  status: 'pending' | 'selesai' | 'dibatalkan';
}

export interface Citizen {
  id: string;
  name: string;
  address: string; // e.g., "Blok A No. 12"
  phone: string;
  points: number;
  totalWasteKg: number;
  joinedDate: string;
}

export interface Feedback {
  id: string;
  citizenName: string;
  rating: number; // 1-5
  comment: string;
  date: string;
  aspect: string; // "Ketepatan Waktu", "Sikap Petugas", "Kebersihan Area", "Umum"
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'pickup' | 'reward' | 'system';
  date: string;
  isRead: boolean;
}

export interface PickupSchedule {
  day: string;
  types: string[];
  time: string;
  officer: string;
}
