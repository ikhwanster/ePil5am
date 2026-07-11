import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import {
  ShieldAlert, Check, X, Shield, Lock, Unlock, HelpCircle, AlertCircle,
  BarChart3, Users, Star, Gift, CheckCircle, Flame, Send, Volume2, Key,
  Plus, Trash2, Edit, Save, UserPlus, RotateCcw, RefreshCw
} from 'lucide-react';
import { WasteDeposit, Citizen, RewardRedemption, Feedback, WasteType } from '../types';
import { WASTE_CATEGORIES, decryptField, encryptField } from '../data';

interface AdminDashboardProps {
  citizens: Citizen[];
  deposits: WasteDeposit[];
  redemptions: RewardRedemption[];
  feedbacks: Feedback[];
  adminRole?: string;
  onApproveDeposit: (depositId: string) => void;
  onRejectDeposit: (depositId: string) => void;
  onCompleteRedemption: (redemptionId: string) => void;
  onCancelRedemption: (redemptionId: string) => void;
  onPushSystemNotification: (title: string, message: string, type: 'pickup' | 'reward' | 'system') => void;
  onUpdateCitizens?: (citizens: Citizen[]) => void;
  onResetWasteData?: () => void;
}

export default function AdminDashboard({
  citizens,
  deposits,
  redemptions,
  feedbacks,
  adminRole = 'Admin RT 005',
  onApproveDeposit,
  onRejectDeposit,
  onCompleteRedemption,
  onCancelRedemption,
  onPushSystemNotification,
  onUpdateCitizens,
  onResetWasteData
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'deposits' | 'rewards' | 'citizens' | 'feedback' | 'broadcast'>('overview');
  const [securityKey, setSecurityKey] = useState('RT005_SECRET');
  const [showRealData, setShowRealData] = useState(false);

  // Broadcast state
  const [broadcastTitle, setBroadcastTitle] = useState('Pembaruan Stok Sembako RT 005');
  const [broadcastMessage, setBroadcastMessage] = useState('Minyak goreng Bimoli 1 Liter sudah terisi kembali di Balai RT! Segera tukarkan poin pilah sampah Anda.');
  const [broadcastType, setBroadcastType] = useState<'pickup' | 'reward' | 'system'>('reward');
  const [broadcastSuccess, setBroadcastSuccess] = useState(false);

  // Citizen CRUD States
  const [isCitizenModalOpen, setIsCitizenModalOpen] = useState(false);
  const [editingCitizen, setEditingCitizen] = useState<Citizen | null>(null);
  const [formCitizenId, setFormCitizenId] = useState('');
  const [formName, setFormName] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formAddress, setFormAddress] = useState('');
  const [formPoints, setFormPoints] = useState<number>(0);
  const [formTotalWasteKg, setFormTotalWasteKg] = useState<number>(0);
  const [citizenError, setCitizenError] = useState('');
  const [citizenSuccessMsg, setCitizenSuccessMsg] = useState('');

  // Stateful delete confirmation
  const [citizenToDelete, setCitizenToDelete] = useState<Citizen | null>(null);

  // Reset Waste Data State
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  const handleConfirmResetWaste = () => {
    if (onResetWasteData) {
      onResetWasteData();
    }
    setIsResetModalOpen(false);
  };

  const handleOpenAddCitizen = () => {
    setEditingCitizen(null);
    setCitizenError('');
    setCitizenSuccessMsg('');
    
    // Auto generate next ID
    const currentIds = citizens.map(c => parseInt(c.id.replace('C', ''), 10)).filter(num => !isNaN(num));
    const nextNum = currentIds.length > 0 ? Math.max(...currentIds) + 1 : 1;
    const nextId = `C${String(nextNum).padStart(3, '0')}`;
    
    setFormCitizenId(nextId);
    setFormName('');
    setFormPhone('');
    setFormAddress('');
    setFormPoints(0);
    setFormTotalWasteKg(0);
    setIsCitizenModalOpen(true);
  };

  const handleOpenEditCitizen = (citizen: Citizen) => {
    setEditingCitizen(citizen);
    setCitizenError('');
    setCitizenSuccessMsg('');
    
    // Decrypt phone & address to plain text for editing
    const decPhone = decryptField(citizen.phone, securityKey);
    const decAddress = decryptField(citizen.address, securityKey);
    
    setFormCitizenId(citizen.id);
    setFormName(citizen.name);
    setFormPhone(decPhone);
    setFormAddress(decAddress);
    setFormPoints(citizen.points);
    setFormTotalWasteKg(citizen.totalWasteKg);
    setIsCitizenModalOpen(true);
  };

  const handleSaveCitizen = (e: FormEvent) => {
    e.preventDefault();
    setCitizenError('');
    setCitizenSuccessMsg('');
    
    if (!formName.trim()) {
      setCitizenError('Nama warga wajib diisi');
      return;
    }
    if (!formPhone.trim()) {
      setCitizenError('Nomor telepon wajib diisi');
      return;
    }
    if (!formAddress.trim()) {
      setCitizenError('Alamat wajib diisi');
      return;
    }

    if (onUpdateCitizens) {
      // Encrypt sensitive fields
      const encPhone = encryptField(formPhone.trim(), securityKey);
      const encAddress = encryptField(formAddress.trim(), securityKey);

      if (editingCitizen) {
        // Edit Mode
        const updated = citizens.map(c => {
          if (c.id === editingCitizen.id) {
            return {
              ...c,
              name: formName.trim(),
              phone: encPhone,
              address: encAddress,
              points: Number(formPoints),
              totalWasteKg: Number(formTotalWasteKg)
            };
          }
          return c;
        });
        onUpdateCitizens(updated);
        setCitizenSuccessMsg('Data warga berhasil diperbarui!');
        setTimeout(() => {
          setIsCitizenModalOpen(false);
          setEditingCitizen(null);
        }, 1500);
      } else {
        // Add Mode
        // Check if ID is duplicate
        if (citizens.some(c => c.id === formCitizenId)) {
          setCitizenError(`ID Warga ${formCitizenId} sudah terdaftar`);
          return;
        }

        const newCitizen: Citizen = {
          id: formCitizenId,
          name: formName.trim(),
          phone: encPhone,
          address: encAddress,
          points: Number(formPoints),
          totalWasteKg: Number(formTotalWasteKg),
          joinedDate: new Date().toISOString().split('T')[0]
        };

        onUpdateCitizens([...citizens, newCitizen]);
        setCitizenSuccessMsg('Warga baru berhasil ditambahkan!');
        setTimeout(() => {
          setIsCitizenModalOpen(false);
        }, 1500);
      }
    }
  };

  const handleConfirmDeleteCitizen = () => {
    if (citizenToDelete && onUpdateCitizens) {
      const updated = citizens.filter(c => c.id !== citizenToDelete.id);
      onUpdateCitizens(updated);
      setCitizenToDelete(null);
    }
  };

  // Compute stats
  const totalApprovedDeposits = deposits.filter(d => d.status === 'approved');
  const totalWasteKg = totalApprovedDeposits.reduce((acc, curr) => acc + curr.weight, 0);
  const totalActiveCitizens = citizens.length;
  const totalPointsDistributed = citizens.reduce((acc, curr) => acc + curr.points, 0);
  const totalPendingDeposits = deposits.filter(d => d.status === 'pending').length;
  const totalPendingRedemptions = redemptions.filter(r => r.status === 'pending').length;

  // Compute waste type distribution for Recharts Pie Chart
  const wasteDistribution = WASTE_CATEGORIES.map(cat => {
    const totalKg = totalApprovedDeposits
      .filter(d => d.type === cat.id)
      .reduce((acc, curr) => acc + curr.weight, 0);
    return {
      name: cat.name,
      value: Number(totalKg.toFixed(1)),
      color: cat.color
    };
  }).filter(item => item.value > 0);

  // Compute daily trends for Bar Chart
  const dailyTrendsMap: { [key: string]: number } = {};
  totalApprovedDeposits.forEach(dep => {
    dailyTrendsMap[dep.date] = (dailyTrendsMap[dep.date] || 0) + dep.weight;
  });
  const dailyTrendsData = Object.keys(dailyTrendsMap).sort().map(date => ({
    tanggal: date.substring(5), // e.g., '07-01'
    berat: Number(dailyTrendsMap[date].toFixed(1))
  }));

  const handleBroadcast = (e: FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle || !broadcastMessage) return;

    onPushSystemNotification(broadcastTitle, broadcastMessage, broadcastType);
    setBroadcastSuccess(true);
    setTimeout(() => {
      setBroadcastSuccess(false);
      setBroadcastTitle('');
      setBroadcastMessage('');
    }, 4000);
  };

  return (
    <div className="space-y-6" id="admin-dashboard-section">
      {/* Header Info */}
      <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-sm border border-slate-950 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block mb-1">Konsol Pengelola</span>
          <h2 className="text-xl font-extrabold tracking-wide uppercase">Dashboard {adminRole}</h2>
          <p className="text-slate-400 text-xs mt-1">Kelola penyetoran, distribusi reward poin, dan pantau kontribusi kebersihan warga.</p>
        </div>
        <div className="flex gap-2">
          {/* Decryption Control */}
          <button
            onClick={() => setShowRealData(!showRealData)}
            className={`px-3.5 py-2 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer border ${
              showRealData
                ? 'bg-emerald-600 text-white border-emerald-700 shadow-sm'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
          >
            {showRealData ? (
              <>
                <Unlock className="w-4 h-4" />
                <span>Data Warga: Dekripsi Aktif</span>
              </>
            ) : (
              <>
                <Lock className="w-4 h-4 text-amber-500" />
                <span>Dekripsi Privasi Warga</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Admin Menu Tabs */}
      <div className="flex overflow-x-auto whitespace-nowrap scrollbar-none pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap gap-2 border-b border-slate-200">
        {[
          { id: 'overview', label: 'Ringkasan & Grafik', icon: BarChart3, alertCount: 0 },
          { id: 'deposits', label: 'Setoran Sampah', icon: ShieldAlert, alertCount: totalPendingDeposits },
          { id: 'rewards', label: 'Klaim Hadiah', icon: Gift, alertCount: totalPendingRedemptions },
          { id: 'citizens', label: 'Data Warga RT 005', icon: Users, alertCount: 0 },
          { id: 'feedback', label: 'Saran & Rating', icon: Star, alertCount: 0 },
          { id: 'broadcast', label: 'Kirim Notifikasi Real-Time', icon: Volume2, alertCount: 0 }
        ].map(tab => {
          const IconComp = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-2 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer border relative shrink-0 ${
                isActive
                  ? 'bg-slate-900 text-white border-slate-950 shadow-sm'
                  : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <IconComp className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.alertCount > 0 && (
                <span className="bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full ml-1">
                  {tab.alertCount}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Overview/Charts Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Action reset bar */}
          <div className="bg-amber-50/60 border border-amber-100 rounded-2xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="flex items-start gap-2.5">
              <div className="w-9 h-9 bg-amber-100 text-amber-800 rounded-xl flex items-center justify-center shrink-0">
                <RefreshCw className="w-4 h-4 text-amber-700" />
              </div>
              <div>
                <h5 className="text-xs font-bold text-slate-800">Manajemen Pembersihan Berkala</h5>
                <p className="text-[11px] text-slate-500 mt-0.5">Admin RT dapat mereset data setoran sampah warga kembali ke nol (0) untuk memulai periode baru.</p>
              </div>
            </div>
            <button
              onClick={() => setIsResetModalOpen(true)}
              className="py-1.5 px-3.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer transition-colors shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset Data Sampah
            </button>
          </div>

          {/* Metric Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Total Sampah</span>
              <div className="flex items-baseline gap-1 mt-1.5">
                <span className="text-2xl font-black text-slate-800 font-mono">{totalWasteKg.toFixed(1)}</span>
                <span className="text-xs text-slate-400 font-bold">KG</span>
              </div>
              <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider block mt-1.5">Bulan Juli 2026</span>
            </div>

            <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Warga Terdaftar</span>
              <div className="flex items-baseline gap-1 mt-1.5">
                <span className="text-2xl font-black text-slate-800 font-mono">{totalActiveCitizens}</span>
                <span className="text-xs text-slate-400 font-bold">KK</span>
              </div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mt-1.5">RT 005 RW 013</span>
            </div>

            <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Total Distribusi Poin</span>
              <div className="flex items-baseline gap-1 mt-1.5">
                <span className="text-2xl font-black text-slate-800 font-mono">{totalPointsDistributed.toLocaleString()}</span>
                <span className="text-xs text-slate-400 font-bold">PTS</span>
              </div>
              <span className="text-[10px] text-emerald-800 font-bold uppercase tracking-wider block mt-1.5">Aktif di Warga</span>
            </div>

            <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Tingkat Penilaian</span>
              <div className="flex items-center gap-1.5 mt-2">
                <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                <span className="text-xl font-black text-slate-800 font-mono">
                  {(feedbacks.reduce((acc, curr) => acc + curr.rating, 0) / feedbacks.length || 5).toFixed(1)}
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mt-1.5">Dari {feedbacks.length} Responden</span>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pie Chart: Waste Type Composition */}
            <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
              <h4 className="font-extrabold text-slate-800 text-xs uppercase tracking-widest mb-4">Komposisi Volume Sampah Disetor (kg)</h4>
              <div className="h-64">
                {wasteDistribution.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={wasteDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {wasteDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value} kg`, 'Berat']} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-xs text-slate-400 font-semibold uppercase tracking-wider">
                    Tidak ada data setoran sampah yang disetujui bulan ini.
                  </div>
                )}
              </div>
            </div>

            {/* Bar Chart: Daily Collection Trends */}
            <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
              <h4 className="font-extrabold text-slate-800 text-xs uppercase tracking-widest mb-4">Trend Penyetoran Sampah Mingguan (kg)</h4>
              <div className="h-64">
                {dailyTrendsData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dailyTrendsData}>
                      <XAxis dataKey="tanggal" stroke="#64748B" fontSize={11} />
                      <YAxis stroke="#64748B" fontSize={11} />
                      <Tooltip formatter={(value) => [`${value} kg`, 'Berat']} />
                      <Bar dataKey="berat" fill="#10B981" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-xs text-slate-400 font-semibold uppercase tracking-wider">
                    Tidak ada data setoran sampah yang disetujui.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Review Waste Deposits Tab */}
      {activeTab === 'deposits' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="font-extrabold text-slate-800 text-xs uppercase tracking-widest">Review Setoran Sampah Warga</h4>
            <span className="text-[10px] bg-amber-50 border border-amber-100 text-amber-900 px-3 py-1 rounded-full font-bold uppercase tracking-wider">
              {totalPendingDeposits} Antrean Menunggu Persetujuan
            </span>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-100 shadow-sm">
            {deposits.filter(d => d.status === 'pending').length > 0 ? (
              deposits.filter(d => d.status === 'pending').map(dep => {
                const category = WASTE_CATEGORIES.find(c => c.id === dep.type);
                return (
                  <div key={dep.id} className="p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-slate-50/40 transition-colors">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-800">{dep.citizenName}</span>
                        <span className="text-[10px] text-slate-400 font-bold">#{dep.id}</span>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        <span
                          className="px-2.5 py-0.5 rounded-md text-[9px] font-bold text-white uppercase tracking-wider"
                          style={{ backgroundColor: category?.color || '#64748B' }}
                        >
                          {category?.name || dep.type}
                        </span>
                        <span className="font-extrabold text-slate-700 font-mono">{dep.weight} kg</span>
                        <span className="text-slate-200">|</span>
                        <span className="text-amber-600 font-black font-mono">+{dep.pointsEarned} Poin</span>
                        <span className="text-slate-200">|</span>
                        <span className="text-slate-400 font-semibold uppercase tracking-wide text-[10px]">{dep.date}</span>
                      </div>
                    </div>

                    <div className="flex gap-2 w-full sm:w-auto shrink-0">
                      <button
                        onClick={() => onRejectDeposit(dep.id)}
                        className="flex-1 sm:flex-none py-1.5 px-3.5 border border-rose-200 text-rose-700 rounded-xl text-xs font-bold hover:bg-rose-50/50 flex items-center justify-center gap-1 cursor-pointer transition-colors"
                      >
                        <X className="w-3.5 h-3.5" /> Tolak
                      </button>
                      <button
                        onClick={() => onApproveDeposit(dep.id)}
                        className="flex-1 sm:flex-none py-1.5 px-4 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 flex items-center justify-center gap-1 cursor-pointer shadow-sm transition-colors"
                      >
                        <Check className="w-3.5 h-3.5" /> Setujui
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-8 text-center text-xs text-slate-400 space-y-2">
                <CheckCircle className="w-8 h-8 text-emerald-600 mx-auto" />
                <p className="font-extrabold text-slate-800 uppercase tracking-wider">Semua Setoran Selesai Direview!</p>
                <p className="font-medium text-slate-500">Tidak ada pengajuan setoran sampah warga yang tertunda saat ini.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Review Reward Claim/Redemptions Tab */}
      {activeTab === 'rewards' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="font-extrabold text-slate-800 text-xs uppercase tracking-widest">Pengambilan & Klaim Hadiah Poin</h4>
            <span className="text-[10px] bg-amber-50 border border-amber-100 text-amber-900 px-3 py-1 rounded-full font-bold uppercase tracking-wider">
              {totalPendingRedemptions} Klaim Menunggu Distribusi
            </span>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-100 shadow-sm">
            {redemptions.filter(r => r.status === 'pending').length > 0 ? (
              redemptions.filter(r => r.status === 'pending').map(red => (
                <div key={red.id} className="p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-slate-50/40 transition-colors">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h5 className="font-bold text-xs text-slate-800">{red.citizenName}</h5>
                      <span className="text-[10px] text-slate-400 font-bold font-mono">#{red.id}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-slate-900 font-extrabold">{red.rewardName}</span>
                      <span className="text-slate-200">|</span>
                      <span className="text-amber-600 font-extrabold font-mono">-{red.pointsDeducted} Poin</span>
                      <span className="text-slate-200">|</span>
                      <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">{red.date}</span>
                    </div>
                  </div>

                  <div className="flex gap-2 w-full sm:w-auto shrink-0">
                    <button
                      onClick={() => onCancelRedemption(red.id)}
                      className="flex-1 sm:flex-none py-1.5 px-3 border border-slate-200 text-slate-500 rounded-xl text-xs font-bold hover:bg-slate-50 cursor-pointer transition-colors"
                    >
                      Batalkan
                    </button>
                    <button
                      onClick={() => onCompleteRedemption(red.id)}
                      className="flex-1 sm:flex-none py-1.5 px-4 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 flex items-center justify-center gap-1.5 cursor-pointer shadow-sm transition-colors"
                    >
                      <Check className="w-3.5 h-3.5" /> Serahkan Hadiah
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-xs text-slate-400 space-y-2">
                <CheckCircle className="w-8 h-8 text-slate-800 mx-auto" />
                <p className="font-extrabold text-slate-800 uppercase tracking-widest">Semua Klaim Hadiah Selesai!</p>
                <p className="font-medium text-slate-500">Tidak ada pengajuan klaim hadiah warga yang menanti penyerahan barang.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Citizens List Tab with Privacy Toggle */}
      {activeTab === 'citizens' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h4 className="font-extrabold text-slate-800 text-xs uppercase tracking-widest">Direktori Buku Kas & Poin Warga</h4>
              <p className="text-xs text-slate-400 mt-1">Daftar warga RT 005 RW 013 beserta status privasi data pribadi.</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleOpenAddCitizen}
                className="py-1.5 px-3 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 flex items-center justify-center gap-1.5 cursor-pointer shadow-sm transition-colors"
              >
                <UserPlus className="w-3.5 h-3.5" /> Tambah Warga
              </button>
              <div className="flex items-center gap-1 text-[10px] text-slate-800 font-bold bg-slate-100 border border-slate-200/60 px-2.5 py-1 rounded-lg">
                <Key className="w-3.5 h-3.5" />
                <span>AES-256 Terjamin</span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-100 shadow-sm">
            {citizens.map(cit => {
              // Decode phone & address if showRealData is true, otherwise keep masked/enc
              const decodedAddress = showRealData ? decryptField(cit.address, securityKey) : cit.address;
              const decodedPhone = showRealData ? decryptField(cit.phone, securityKey) : cit.phone;

              return (
                <div key={cit.id} className="p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-slate-50/40 transition-colors">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-sm text-slate-800">{cit.name}</span>
                      <span className="text-[10px] font-mono text-slate-400 bg-slate-50 border border-slate-100 px-1.5 py-0.5 rounded-md">{cit.id}</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-xs">
                      <div>
                        <span className="text-slate-400 font-bold uppercase tracking-wider text-[9px] block sm:inline mr-1">Telepon:</span>
                        <span className={`font-mono text-[11px] ${showRealData ? 'text-slate-800 font-bold' : 'text-red-400 font-semibold truncate max-w-xs block sm:inline-block'}`}>
                          {decodedPhone}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 font-bold uppercase tracking-wider text-[9px] block sm:inline mr-1">Alamat Rumah:</span>
                        <span className={`font-bold text-[11px] ${showRealData ? 'text-slate-800' : 'text-red-400 font-semibold truncate max-w-xs block sm:inline-block'}`}>
                          {decodedAddress}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <div className="text-right">
                      <span className="text-[9px] text-slate-400 block font-bold uppercase tracking-widest">Saldo Poin</span>
                      <span className="font-mono font-extrabold text-amber-600 text-sm">{cit.points.toLocaleString()} PTS</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] text-slate-400 block font-bold uppercase tracking-widest">Total Setor</span>
                      <span className="font-mono font-bold text-slate-800 text-sm">{cit.totalWasteKg} KG</span>
                    </div>
                    <div className="flex items-center gap-1.5 border-l border-slate-100 pl-4">
                      <button
                        onClick={() => handleOpenEditCitizen(cit)}
                        className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg border border-transparent hover:border-blue-100 transition-all cursor-pointer"
                        title="Edit Data Warga"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setCitizenToDelete(cit)}
                        className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg border border-transparent hover:border-rose-100 transition-all cursor-pointer"
                        title="Hapus Warga"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Citizens Feedback Ratings Tab */}
      {activeTab === 'feedback' && (
        <div className="space-y-4">
          <h4 className="font-extrabold text-slate-800 text-xs uppercase tracking-widest">Aduan & Feedback Warga RT 005</h4>

          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-100 shadow-sm">
            {feedbacks.length > 0 ? (
              feedbacks.map(feed => (
                <div key={feed.id} className="p-5 space-y-2 hover:bg-slate-50/40 transition-colors">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <span className="text-[9px] font-bold text-emerald-900 bg-emerald-50 border border-emerald-100/50 px-2.5 py-0.5 rounded-md">
                        {feed.aspect}
                      </span>
                      <h5 className="font-bold text-xs text-slate-800 mt-1.5">{feed.citizenName}</h5>
                    </div>
                    <div className="flex items-center gap-1 bg-white border border-slate-200 px-2 py-0.5 rounded-lg text-xs font-bold text-slate-800 shadow-xs">
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      <span>{feed.rating}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 italic">"{feed.comment}"</p>
                  
                  <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                    Dikirim pada {feed.date}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-xs text-slate-400 font-bold uppercase tracking-wider">
                Belum ada feedback yang masuk dari warga.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Broadcast/Notification API Trigger Tab */}
      {activeTab === 'broadcast' && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm space-y-4">
            <h4 className="font-extrabold text-slate-800 text-xs uppercase tracking-widest flex items-center gap-2 pb-2 border-b border-slate-100">
              <Volume2 className="w-5 h-5 text-emerald-600 animate-pulse" /> Integrasi Notifikasi Real-Time (API)
            </h4>

            <p className="text-xs text-slate-500 leading-relaxed">
              Mensimulasikan integrasi API Gateway Notifikasi Pusat. Ketika admin merilis pengumuman atau memperbarui katalog reward, sistem akan secara instan "mendorong" pesan (Push Notification API) ke layar perangkat warga yang sedang aktif.
            </p>

            <form onSubmit={handleBroadcast} className="space-y-4 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">Judul Notifikasi API</label>
                  <input
                    type="text"
                    value={broadcastTitle}
                    onChange={(e) => setBroadcastTitle(e.target.value)}
                    required
                    placeholder="Contoh: Pengingat Penjemputan..."
                    className="w-full text-xs p-3 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-500/20 focus:border-slate-500 font-semibold text-slate-800"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">Tipe Saluran Notifikasi</label>
                  <select
                    value={broadcastType}
                    onChange={(e) => setBroadcastType(e.target.value as any)}
                    className="w-full text-xs p-3 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-500/20 focus:border-slate-500 font-semibold text-slate-800"
                  >
                    <option value="pickup">Jadwal Penjemputan (Pickup Schedule Alert)</option>
                    <option value="reward">Pembaruan Hadiah (Reward Catalogue API)</option>
                    <option value="system">Pemberitahuan Sistem (System Announcement)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">Isi Pesan Push</label>
                <textarea
                  value={broadcastMessage}
                  onChange={(e) => setBroadcastMessage(e.target.value)}
                  required
                  placeholder="Ketikkan pesan penting untuk seluruh warga RT 005..."
                  className="w-full text-xs p-3 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-500/20 focus:border-slate-500 font-semibold text-slate-800 h-20 resize-none"
                />
              </div>

              <button
                type="submit"
                className="py-2.5 px-5 bg-slate-900 text-white font-bold rounded-xl text-xs hover:bg-slate-800 flex items-center justify-center gap-1.5 cursor-pointer shadow-sm transition-colors"
              >
                <Send className="w-4 h-4" /> Kirim & Broadcast Instan ke Layanan Warga
              </button>
            </form>

            <AnimatePresence>
              {broadcastSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="bg-emerald-50 border border-emerald-200 text-emerald-950 p-4 rounded-xl flex items-start gap-2.5 text-xs shadow-xs"
                >
                  <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-extrabold text-emerald-950 uppercase tracking-wide">Notifikasi Sukses Didistribusikan!</h5>
                    <p className="text-emerald-900 mt-1 font-medium">
                      Pesan API Gateway berhasil dikirimkan ke seluruh websocket dan notifikasi client warga RT 005. Warga akan melihat peringatan di panel notifikasi secara real-time.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Modal Tambah/Edit Warga */}
      <AnimatePresence>
        {isCitizenModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white border border-slate-200 rounded-3xl shadow-xl w-full max-w-md overflow-hidden"
            >
              <div className="bg-slate-950 p-6 text-white flex justify-between items-center">
                <div>
                  <span className="text-[9px] text-emerald-400 font-bold uppercase tracking-widest block mb-0.5">MANAJEMEN WARGA</span>
                  <h3 className="text-base font-extrabold tracking-tight">
                    {editingCitizen ? 'Edit Data Warga' : 'Tambah Warga Baru'}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsCitizenModalOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveCitizen} className="p-6 space-y-4">
                {citizenError && (
                  <div className="p-3 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl text-xs font-semibold flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{citizenError}</span>
                  </div>
                )}
                {citizenSuccessMsg && (
                  <div className="p-3 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-xl text-xs font-semibold flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 shrink-0" />
                    <span>{citizenSuccessMsg}</span>
                  </div>
                )}

                <div className="space-y-3">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
                      ID Warga
                    </label>
                    <input
                      type="text"
                      value={formCitizenId}
                      onChange={e => setFormCitizenId(e.target.value.toUpperCase())}
                      disabled={editingCitizen !== null}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-mono font-bold focus:outline-none focus:border-emerald-500 disabled:opacity-60"
                      placeholder="e.g. C030"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
                      Nama Lengkap
                    </label>
                    <input
                      type="text"
                      value={formName}
                      onChange={e => setFormName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-500"
                      placeholder="Nama Lengkap Warga"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
                      Nomor Telepon (AES-256)
                    </label>
                    <input
                      type="text"
                      value={formPhone}
                      onChange={e => setFormPhone(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-mono font-semibold text-slate-800 focus:outline-none focus:border-emerald-500"
                      placeholder="e.g. 0812XXXXXXXX"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
                      Alamat Rumah (AES-256)
                    </label>
                    <textarea
                      value={formAddress}
                      onChange={e => setFormAddress(e.target.value)}
                      rows={2}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:border-emerald-500 resize-none"
                      placeholder="Alamat Lengkap / Nomor Rumah"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
                        Poin (PTS)
                      </label>
                      <input
                        type="number"
                        value={formPoints}
                        onChange={e => setFormPoints(Math.max(0, parseInt(e.target.value, 10) || 0))}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-mono font-bold text-slate-800 focus:outline-none focus:border-emerald-500"
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
                        Total Sampah (KG)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={formTotalWasteKg}
                        onChange={e => setFormTotalWasteKg(Math.max(0, parseFloat(e.target.value) || 0))}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-mono font-bold text-slate-800 focus:outline-none focus:border-emerald-500"
                        min="0"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsCitizenModalOpen(false)}
                    className="flex-1 py-2 px-3 border border-slate-200 text-slate-500 rounded-xl text-xs font-bold hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 px-4 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 flex items-center justify-center gap-1.5 cursor-pointer shadow-sm transition-colors"
                  >
                    <Save className="w-3.5 h-3.5" /> Simpan Data
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal Konfirmasi Hapus Warga */}
      <AnimatePresence>
        {citizenToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white border border-slate-200 rounded-3xl shadow-xl w-full max-w-sm overflow-hidden p-6 space-y-4"
            >
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto">
                  <Trash2 className="w-6 h-6" />
                </div>
                <h3 className="text-base font-extrabold text-slate-900">Hapus Data Warga?</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Apakah Anda yakin ingin menghapus warga <strong className="text-slate-800">{citizenToDelete.name}</strong> ({citizenToDelete.id})? Tindakan ini tidak dapat dibatalkan.
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setCitizenToDelete(null)}
                  className="flex-1 py-2 px-3 border border-slate-200 text-slate-500 rounded-xl text-xs font-bold hover:bg-slate-50 cursor-pointer transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={handleConfirmDeleteCitizen}
                  className="flex-1 py-2 px-4 bg-rose-600 text-white rounded-xl text-xs font-bold hover:bg-rose-700 cursor-pointer transition-colors"
                >
                  Ya, Hapus
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal Konfirmasi Reset Data Sampah */}
      <AnimatePresence>
        {isResetModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white border border-slate-200 rounded-3xl shadow-xl w-full max-w-sm overflow-hidden p-6 space-y-4"
            >
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto">
                  <RotateCcw className="w-6 h-6 text-rose-600" />
                </div>
                <h3 className="text-base font-extrabold text-slate-900">Reset Semua Data Sampah?</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Apakah Anda yakin ingin mereset semua data setoran sampah warga kembali ke <strong className="text-slate-800">nol (0)</strong>? Tindakan ini akan menghapus riwayat setoran sampah yang ada dan tidak dapat dibatalkan.
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setIsResetModalOpen(false)}
                  className="flex-1 py-2 px-3 border border-slate-200 text-slate-500 rounded-xl text-xs font-bold hover:bg-slate-50 cursor-pointer transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={handleConfirmResetWaste}
                  className="flex-1 py-2 px-4 bg-rose-600 text-white rounded-xl text-xs font-bold hover:bg-rose-700 cursor-pointer transition-colors"
                >
                  Ya, Reset Data
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
