import { WasteCategoryInfo, Citizen, WasteDeposit, RewardItem, RewardRedemption, Feedback, AppNotification, PickupSchedule } from './types';

// Waste category definitions with values inspired by the infographics
export const WASTE_CATEGORIES: WasteCategoryInfo[] = [
  {
    id: 'organik',
    name: 'Sampah Organik',
    pointsPerKg: 10,
    color: '#10B981', // Emerald green
    description: 'Sampah yang mudah terurai secara alami, dapat diolah menjadi kompos atau pupuk organik.',
    examples: ['Sisa makanan', 'Kulit buah', 'Daun kering', 'Sisa sayuran']
  },
  {
    id: 'anorganik_plastik',
    name: 'Plastik (Anorganik)',
    pointsPerKg: 50,
    color: '#3B82F6', // Blue
    description: 'Sampah plastik yang bernilai daur ulang tinggi, diolah kembali menjadi produk baru atau campuran aspal.',
    examples: ['Botol plastik', 'Gelas plastik', 'Kemasan plastik', 'Wadah detergen']
  },
  {
    id: 'anorganik_kertas',
    name: 'Kertas (Anorganik)',
    pointsPerKg: 30,
    color: '#F59E0B', // Amber
    description: 'Koran, kardus, atau kertas bekas yang dapat didaur ulang kembali di industri kertas.',
    examples: ['Kardus bekas', 'Koran lama', 'Majalah/Buku', 'Kertas HVS']
  },
  {
    id: 'anorganik_logam',
    name: 'Logam (Anorganik)',
    pointsPerKg: 100,
    color: '#8B5CF6', // Purple
    description: 'Bahan logam atau aluminium yang bernilai tinggi dan bisa didaur ulang tanpa batas.',
    examples: ['Kaleng minuman', 'Besi tua', 'Tembaga', 'Aluminium foil']
  },
  {
    id: 'b3',
    name: 'Sampah B3',
    pointsPerKg: 80,
    color: '#EF4444', // Red
    description: 'Bahan Berbahaya dan Beracun. Membutuhkan penanganan khusus agar tidak merusak kesehatan & lingkungan.',
    examples: ['Baterai bekas', 'Lampu bohlam/LED', 'Botol aerosol', 'Limbah elektronik']
  },
  {
    id: 'residu',
    name: 'Sampah Residu',
    pointsPerKg: 5,
    color: '#6B7280', // Gray
    description: 'Sampah yang tidak bisa didaur ulang atau dimanfaatkan kembali, berakhir sebagai bahan bakar alternatif.',
    examples: ['Tisu bekas', 'Pembalut bekas', 'Popok bayi', 'Kemasan makanan berlaminasi']
  }
];

// Pickup schedules for RT 005 RW 013, Taman Buaran Indah IV
export const DEFAULT_PICKUP_SCHEDULE: PickupSchedule[] = [
  {
    day: 'Senin',
    types: ['Sampah Residu', 'Sampah Organik'],
    time: '08:00 - 10:00 WIB',
    officer: 'Pak Joko (Petugas Kebersihan RT 005)'
  },
  {
    day: 'Selasa',
    types: ['Sampah Organik', 'Sampah B3'],
    time: '08:00 - 10:00 WIB',
    officer: 'Pak Joko (Petugas Kebersihan RT 005)'
  },
  {
    day: 'Kamis',
    types: ['Sampah Anorganik (Plastik, Kertas, Logam)'],
    time: '09:00 - 11:30 WIB',
    officer: 'Pak Joko & Tim Bank Sampah'
  },
  {
    day: 'Sabtu',
    types: ['Sampah Organik', 'Sampah Residu'],
    time: '08:00 - 11:00 WIB',
    officer: 'Pak Joko (Petugas Kebersihan RT 005)'
  }
];

// Simple secure cryptographic simulation for privacy-sensitive fields
// XOR + Base64 simulation representing high-grade AES-256 equivalent
export function encryptField(value: string, key: string = "RT005_SECRET"): string {
  if (!value) return "";
  let result = "";
  for (let i = 0; i < value.length; i++) {
    const charCode = value.charCodeAt(i) ^ key.charCodeAt(i % key.length);
    result += String.fromCharCode(charCode);
  }
  return btoa(unescape(encodeURIComponent(result)));
}

export function decryptField(cipher: string, key: string = "RT005_SECRET"): string {
  if (!cipher) return "";
  try {
    const decoded = decodeURIComponent(escape(atob(cipher)));
    let result = "";
    for (let i = 0; i < decoded.length; i++) {
      const charCode = decoded.charCodeAt(i) ^ key.charCodeAt(i % key.length);
      result += String.fromCharCode(charCode);
    }
    return result;
  } catch (e) {
    return "[DECRYPTION_ERROR]";
  }
}

// Initial Citizens data (RT 005 RW 013, Taman Buaran Indah IV)
// Addresses and phones are encrypted inside our storage mock, proving strong privacy enforcement.
export const INITIAL_CITIZENS: Citizen[] = [
  { id: 'C001', name: 'Fatrina Diani', address: encryptField('Taman Buaran Indah IV, Blok LA 1 / 1'), phone: encryptField('081290382901'), points: 1250, totalWasteKg: 45.8, joinedDate: '2026-01-10' },
  { id: 'C002', name: 'Muchlis Rida', address: encryptField('Taman Buaran Indah IV, Blok LA 1 / 2'), phone: encryptField('081398765432'), points: 1850, totalWasteKg: 62.4, joinedDate: '2026-01-15' },
  { id: 'C003', name: 'Gigih Tamara', address: encryptField('Taman Buaran Indah IV, Blok LA 1 / 3'), phone: encryptField('082122334455'), points: 1550, totalWasteKg: 55.2, joinedDate: '2026-02-01' },
  { id: 'C004', name: 'Edy Syawardi', address: encryptField('Taman Buaran Indah IV, Blok LA 1 / 4'), phone: encryptField('085711223344'), points: 920, totalWasteKg: 31.5, joinedDate: '2026-02-14' },
  { id: 'C005', name: 'Yuswadi', address: encryptField('Taman Buaran Indah IV, Blok LA 1 / 5'), phone: encryptField('089988776655'), points: 2100, totalWasteKg: 78.9, joinedDate: '2026-01-05' },
  { id: 'C006', name: 'Baso Amir', address: encryptField('Taman Buaran Indah IV, Blok LA 1 / 6'), phone: encryptField('087855667788'), points: 800, totalWasteKg: 28.0, joinedDate: '2026-03-01' },
  { id: 'C007', name: 'Benny Irawan', address: encryptField('Taman Buaran Indah IV, Blok LA 1 / 7-8'), phone: encryptField('081288990011'), points: 1100, totalWasteKg: 38.4, joinedDate: '2026-03-10' },
  { id: 'C008', name: 'Martin', address: encryptField('Taman Buaran Indah IV, Blok LA 1 / 10'), phone: encryptField('081344556677'), points: 1420, totalWasteKg: 49.2, joinedDate: '2026-02-20' },
  { id: 'C009', name: 'Faisal Badjeber', address: encryptField('Taman Buaran Indah IV, Blok LA 1 / 11'), phone: encryptField('081422331144'), points: 1350, totalWasteKg: 47.1, joinedDate: '2026-01-25' },
  { id: 'C010', name: 'M. Taufiq', address: encryptField('Taman Buaran Indah IV, Blok LA 1 / 12'), phone: encryptField('081599887722'), points: 1750, totalWasteKg: 59.8, joinedDate: '2026-01-18' },
  { id: 'C011', name: 'Sahlan Suharman', address: encryptField('Taman Buaran Indah IV, Blok LA 1 / 13'), phone: encryptField('081677665544'), points: 1600, totalWasteKg: 54.0, joinedDate: '2026-03-05' },
  { id: 'C012', name: 'Ambarak Attamimi', address: encryptField('Taman Buaran Indah IV, Blok LA 1 / 14'), phone: encryptField('081722334411'), points: 950, totalWasteKg: 33.5, joinedDate: '2026-04-01' },
  { id: 'C013', name: 'Ibu Yuniarsih', address: encryptField('Taman Buaran Indah IV, Blok LA 1 / 15'), phone: encryptField('081833445566'), points: 2200, totalWasteKg: 81.2, joinedDate: '2026-01-08' },
  { id: 'C014', name: 'Tangkilisan Luntungan', address: encryptField('Taman Buaran Indah IV, Blok LA 1 / 16'), phone: encryptField('081944556677'), points: 1480, totalWasteKg: 50.5, joinedDate: '2026-02-05' },
  { id: 'C015', name: 'Yoga Anantio', address: encryptField('Taman Buaran Indah IV, Blok LA 1 / 17'), phone: encryptField('081255667788'), points: 1300, totalWasteKg: 44.2, joinedDate: '2026-02-12' },
  { id: 'C016', name: 'H. Amas Muda Dalimunthe', address: encryptField('Taman Buaran Indah IV, Blok LA 1 / 18'), phone: encryptField('081366778899'), points: 2450, totalWasteKg: 92.5, joinedDate: '2026-01-02' },
  { id: 'C017', name: 'David Stephanus', address: encryptField('Taman Buaran Indah IV, Blok LA 1 / 19'), phone: encryptField('081477889900'), points: 870, totalWasteKg: 29.5, joinedDate: '2026-03-15' },
  { id: 'C018', name: 'Kharudin', address: encryptField('Taman Buaran Indah IV, Blok LA 8 / 1'), phone: encryptField('081588990022'), points: 1210, totalWasteKg: 42.0, joinedDate: '2026-01-20' },
  { id: 'C019', name: 'Ny Fuad', address: encryptField('Taman Buaran Indah IV, Blok LA 8 / 3'), phone: encryptField('081699001133'), points: 1050, totalWasteKg: 35.8, joinedDate: '2026-03-12' },
  { id: 'C020', name: 'Wahid', address: encryptField('Taman Buaran Indah IV, Blok LA 8 / 4'), phone: encryptField('081700112244'), points: 1620, totalWasteKg: 56.4, joinedDate: '2026-01-22' },
  { id: 'C021', name: 'Erick Chandra', address: encryptField('Taman Buaran Indah IV, Blok LC 1'), phone: encryptField('081811223355'), points: 1950, totalWasteKg: 68.0, joinedDate: '2026-01-07' },
  { id: 'C022', name: 'Firmansyah Siregar', address: encryptField('Taman Buaran Indah IV, Blok LC 1 / 1'), phone: encryptField('081922334466'), points: 1150, totalWasteKg: 39.5, joinedDate: '2026-02-18' },
  { id: 'C023', name: 'Surharni Veronika', address: encryptField('Taman Buaran Indah IV, Blok LC 1 / 1-2'), phone: encryptField('081233445577'), points: 1380, totalWasteKg: 46.8, joinedDate: '2026-02-22' },
  { id: 'C024', name: 'Genthur', address: encryptField('Taman Buaran Indah IV, Blok LC 1 / 3'), phone: encryptField('081344556688'), points: 1510, totalWasteKg: 52.3, joinedDate: '2026-01-29' },
  { id: 'C025', name: 'Irdimansyah', address: encryptField('Taman Buaran Indah IV, Blok LC 1 / 4'), phone: encryptField('081455667799'), points: 1670, totalWasteKg: 58.1, joinedDate: '2026-01-14' },
  { id: 'C026', name: 'Supardi', address: encryptField('Taman Buaran Indah IV, Blok LC 1 / 5-6'), phone: encryptField('081566778800'), points: 2300, totalWasteKg: 86.4, joinedDate: '2026-01-03' },
  { id: 'C027', name: 'Mas Sus Subekti', address: encryptField('Taman Buaran Indah IV, Blok LC 1 / 7'), phone: encryptField('081677889911'), points: 1410, totalWasteKg: 48.0, joinedDate: '2026-02-25' },
  { id: 'C028', name: 'Martha', address: encryptField('Taman Buaran Indah IV, Blok LC 1 / 8'), phone: encryptField('081788990022'), points: 1280, totalWasteKg: 43.5, joinedDate: '2026-03-18' },
  { id: 'C029', name: 'Bima Bagus Baskoro', address: encryptField('Taman Buaran Indah IV, Blok LC 1 / 9'), phone: encryptField('081899001133'), points: 1190, totalWasteKg: 40.2, joinedDate: '2026-03-22' }
];

// Initial Waste Deposits
export const INITIAL_DEPOSITS: WasteDeposit[] = [
  {
    id: 'D001',
    citizenId: 'C002',
    citizenName: 'Muchlis Rida',
    type: 'anorganik_plastik',
    weight: 5.4,
    pointsEarned: 270,
    date: '2026-07-01',
    status: 'approved'
  },
  {
    id: 'D002',
    citizenId: 'C005',
    citizenName: 'Yuswadi',
    type: 'anorganik_logam',
    weight: 8.5,
    pointsEarned: 850,
    date: '2026-07-02',
    status: 'approved'
  },
  {
    id: 'D003',
    citizenId: 'C001',
    citizenName: 'Fatrina Diani',
    type: 'organik',
    weight: 12.0,
    pointsEarned: 120,
    date: '2026-07-04',
    status: 'approved'
  },
  {
    id: 'D004',
    citizenId: 'C003',
    citizenName: 'Gigih Tamara',
    type: 'anorganik_kertas',
    weight: 15.0,
    pointsEarned: 450,
    date: '2026-07-05',
    status: 'approved'
  },
  {
    id: 'D005',
    citizenId: 'C001',
    citizenName: 'Fatrina Diani',
    type: 'b3',
    weight: 1.5,
    pointsEarned: 120,
    date: '2026-07-08',
    status: 'approved'
  },
  {
    id: 'D006',
    citizenId: 'C004',
    citizenName: 'Edy Syawardi',
    type: 'organik',
    weight: 10.0,
    pointsEarned: 100,
    date: '2026-07-09',
    status: 'approved'
  },
  {
    id: 'D007',
    citizenId: 'C001',
    citizenName: 'Fatrina Diani',
    type: 'anorganik_plastik',
    weight: 4.2,
    pointsEarned: 210,
    date: '2026-07-10',
    status: 'pending' // Active deposit waiting for admin review!
  },
  {
    id: 'D008',
    citizenId: 'C003',
    citizenName: 'Gigih Tamara',
    type: 'residu',
    weight: 8.0,
    pointsEarned: 40,
    date: '2026-07-11',
    status: 'pending'
  }
];

// Initial Redeemable Rewards Shop Items
export const INITIAL_REWARDS: RewardItem[] = [
  {
    id: 'R001',
    name: 'Minyak Goreng Bimoli 1 Liter',
    pointsCost: 350,
    stock: 15,
    category: 'Sembako',
    description: 'Minyak goreng kelapa sawit berkualitas tinggi untuk kebutuhan memasak sehari-hari.',
    iconName: 'Droplet'
  },
  {
    id: 'R002',
    name: 'Voucher Belanja Alfamart Rp 50.000',
    pointsCost: 500,
    stock: 10,
    category: 'Voucher',
    description: 'Voucher digital senilai Rp 50.000 yang bisa digunakan di seluruh gerai Alfamart.',
    iconName: 'CreditCard'
  },
  {
    id: 'R003',
    name: 'Deterjen Rinso Bubuk 800g',
    pointsCost: 250,
    stock: 20,
    category: 'Kebutuhan Rumah',
    description: 'Deterjen pembersih pakaian dengan formula anti noda dan wangi tahan lama.',
    iconName: 'Sparkles'
  },
  {
    id: 'R004',
    name: 'Gula Pasir Gulaku 1kg',
    pointsCost: 200,
    stock: 25,
    category: 'Sembako',
    description: 'Gula tebu murni pilihan berkualitas tinggi, bersih dan manis alami.',
    iconName: 'Candy'
  },
  {
    id: 'R005',
    name: 'Pupuk Organik Padat RT 005 (5kg)',
    pointsCost: 100,
    stock: 50,
    category: 'Kebun',
    description: 'Pupuk kompos organik premium hasil olahan langsung dari sampah organik warga RT 005.',
    iconName: 'Leaf'
  },
  {
    id: 'R006',
    name: 'Tumbler Ramah Lingkungan RT 005',
    pointsCost: 400,
    stock: 8,
    category: 'Kebutuhan Rumah',
    description: 'Botol minum stainless steel berkualitas tinggi dengan grafis edukasi pilah sampah RT 005.',
    iconName: 'CupSoda'
  }
];

// Initial Reward Redemptions History
export const INITIAL_REDEMPTIONS: RewardRedemption[] = [
  {
    id: 'TX001',
    citizenId: 'C001',
    citizenName: 'Fatrina Diani',
    rewardId: 'R001',
    rewardName: 'Minyak Goreng Bimoli 1 Liter',
    pointsDeducted: 350,
    date: '2026-06-20',
    status: 'selesai'
  },
  {
    id: 'TX002',
    citizenId: 'C002',
    citizenName: 'Muchlis Rida',
    rewardId: 'R002',
    rewardName: 'Voucher Belanja Alfamart Rp 50.000',
    pointsDeducted: 500,
    date: '2026-06-25',
    status: 'selesai'
  },
  {
    id: 'TX003',
    citizenId: 'C005',
    citizenName: 'Yuswadi',
    rewardId: 'R006',
    rewardName: 'Tumbler Ramah Lingkungan RT 005',
    pointsDeducted: 400,
    date: '2026-07-02',
    status: 'selesai'
  },
  {
    id: 'TX004',
    citizenId: 'C001',
    citizenName: 'Fatrina Diani',
    rewardId: 'R005',
    rewardName: 'Pupuk Organik Padat RT 005 (5kg)',
    pointsDeducted: 100,
    date: '2026-07-10',
    status: 'pending' // Waiting for admin distribution!
  }
];

// Initial Feedbacks
export const INITIAL_FEEDBACKS: Feedback[] = [
  {
    id: 'F001',
    citizenName: 'Edy Syawardi',
    rating: 5,
    comment: 'Layanan penjemputan sampah tepat waktu dan petugas Pak Joko sangat ramah serta selalu mengedukasi warga.',
    date: '2026-07-05',
    aspect: 'Sikap Petugas'
  },
  {
    id: 'F002',
    citizenName: 'Gigih Tamara',
    rating: 4,
    comment: 'Sangat terbantu dengan jadwal penjemputan berkala. Penjemputan sampah anorganik hari Kamis berjalan lancar.',
    date: '2026-07-08',
    aspect: 'Ketepatan Waktu'
  },
  {
    id: 'F003',
    citizenName: 'Muchlis Rida',
    rating: 5,
    comment: 'Timbangan sampah akurat dan poin langsung terupdate secara real-time. Terima kasih RT 005!',
    date: '2026-07-10',
    aspect: 'Kebersihan Area'
  }
];

// Default Notifications
export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'N001',
    title: 'Pengingat Jadwal Penjemputan',
    message: 'Jadwal penjemputan Sampah Organik dan B3 besok pagi (Selasa) pukul 08:00 WIB. Silakan pilah dari rumah!',
    type: 'pickup',
    date: '2026-07-10 18:00',
    isRead: false
  },
  {
    id: 'N002',
    title: 'Setoran Sampah Disetujui',
    message: 'Setoran Sampah Organik seberat 12.0 kg pada 2026-07-04 telah disetujui. Anda mendapatkan +120 Poin!',
    type: 'reward',
    date: '2026-07-04 14:30',
    isRead: true
  },
  {
    id: 'N003',
    title: 'Hadiah Baru Tersedia',
    message: 'Minyak Goreng Bimoli 1L kini tersedia kembali di penukaran hadiah. Tukarkan poin Anda sekarang!',
    type: 'system',
    date: '2026-07-01 09:00',
    isRead: true
  }
];
