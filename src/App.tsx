import { useState, useEffect, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Leaf, User, Shield, BookOpen, Trophy, Calendar, Sparkles, MessageSquare,
  History, PlusCircle, AlertCircle, ShoppingBag, ArrowUpRight, Scale,
  LogOut, Bell, Check, X, ShieldCheck, Download, Trash2, Menu, Settings, Info, RefreshCw
} from 'lucide-react';
import {
  INITIAL_CITIZENS,
  INITIAL_DEPOSITS,
  INITIAL_REWARDS,
  INITIAL_REDEMPTIONS,
  INITIAL_FEEDBACKS,
  INITIAL_NOTIFICATIONS,
  DEFAULT_PICKUP_SCHEDULE,
  WASTE_CATEGORIES
} from './data';
import { Citizen, WasteDeposit, RewardItem, RewardRedemption, Feedback, AppNotification, WasteType } from './types';

// Importing our modular sub-components
import GuideSection from './components/GuideSection';
import Leaderboard from './components/Leaderboard';
import RewardStore from './components/RewardStore';
import SecurityInspector from './components/SecurityInspector';
import ExportReports from './components/ExportReports';
import PickupSchedules from './components/PickupSchedules';
import FeedbackForm from './components/FeedbackForm';
import AdminDashboard from './components/AdminDashboard';
import LoginScreen from './components/LoginScreen';

export default function App() {
  // Login State
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  // Roles: 'warga' (Citizen) | 'admin' (Admin)
  const [userRole, setUserRole] = useState<'warga' | 'admin'>('warga');

  // Active user in Citizen view: default C001
  const [activeCitizenId, setActiveCitizenId] = useState<string>('C001');

  // Logged-in admin role name
  const [adminRole, setAdminRole] = useState<string>('Ketua RT 005');

  // Handle Login Event
  const handleLogin = (role: 'warga' | 'admin', citizenId?: string, adminRoleName?: string) => {
    setUserRole(role);
    if (role === 'warga' && citizenId) {
      setActiveCitizenId(citizenId);
      setActiveCitizenTab('dashboard'); // Reset tab on login
    } else if (role === 'admin' && adminRoleName) {
      setAdminRole(adminRoleName);
    }
    setIsLoggedIn(true);
  };

  // Application State
  const [citizens, setCitizens] = useState<Citizen[]>(INITIAL_CITIZENS);
  const [deposits, setDeposits] = useState<WasteDeposit[]>(INITIAL_DEPOSITS);
  const [rewards, setRewards] = useState<RewardItem[]>(INITIAL_REWARDS);
  const [redemptions, setRedemptions] = useState<RewardRedemption[]>(INITIAL_REDEMPTIONS);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>(INITIAL_FEEDBACKS);
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);
  const [remindersEnabled, setRemindersEnabled] = useState(true);

  // Active main tab in citizen view
  const [activeCitizenTab, setActiveCitizenTab] = useState<'dashboard' | 'rewards' | 'schedule' | 'leaderboard' | 'feedback' | 'secure_export'>('dashboard');

  // Window size tracker for responsive UI/UX
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isMobileNotificationsOpen, setIsMobileNotificationsOpen] = useState<boolean>(false);

  useEffect(() => {
    const checkSize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkSize();
    window.addEventListener('resize', checkSize);
    return () => window.removeEventListener('resize', checkSize);
  }, []);

  // Active Toast list
  const [toasts, setToasts] = useState<{ id: string; title: string; message: string; type: string }[]>([]);

  // Form states for citizen logging a deposit
  const [showLogForm, setShowLogForm] = useState(false);
  const [depositType, setDepositType] = useState<WasteType>('organik');
  const [depositWeight, setDepositWeight] = useState<number>(3);
  const [logSuccess, setLogSuccess] = useState(false);

  // Active Citizen object
  const activeCitizen = citizens.find(c => c.id === activeCitizenId);

  // Helper to add toast notifications
  const addToast = (title: string, message: string, type: string = 'info') => {
    const newToast = { id: Date.now().toString(), title, message, type };
    setToasts(prev => [...prev, newToast]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== newToast.id));
    }, 5000);
  };

  // Helper to append a center notification
  const addCenterNotification = (title: string, message: string, type: 'pickup' | 'reward' | 'system') => {
    const newNotif: AppNotification = {
      id: 'N' + Date.now(),
      title,
      message,
      type,
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      isRead: false
    };
    setNotifications(prev => [newNotif, ...prev]);
    addToast(title, message, type);
  };

  // Effect to trigger initial reminder notification
  useEffect(() => {
    if (remindersEnabled) {
      const timer = setTimeout(() => {
        addToast(
          '🔔 Pengingat Jadwal Rutin',
          'Sampah Organik & B3 besok pagi (Selasa) pukul 08:00 WIB. Pilah sampah Anda untuk bonus poin!',
          'pickup'
        );
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [remindersEnabled]);

  // Citizen records a new waste deposit
  const handleRecordDeposit = (e: FormEvent) => {
    e.preventDefault();
    if (depositWeight <= 0) return;

    const category = WASTE_CATEGORIES.find(c => c.id === depositType);
    const pointsEarned = Math.round(depositWeight * (category?.pointsPerKg || 10));

    const newDeposit: WasteDeposit = {
      id: 'D' + (deposits.length + 1).toString().padStart(3, '0'),
      citizenId: activeCitizenId,
      citizenName: activeCitizen?.name || 'Budi Santoso',
      type: depositType,
      weight: parseFloat(depositWeight.toString()),
      pointsEarned,
      date: new Date().toISOString().split('T')[0],
      status: 'pending' // pending review by admin
    };

    setDeposits(prev => [newDeposit, ...prev]);
    setLogSuccess(true);
    addToast(
      '♻️ Setoran Diajukan',
      `Setoran ${category?.name} seberat ${depositWeight} kg berhasil diajukan. Menunggu persetujuan admin!`,
      'success'
    );

    setTimeout(() => {
      setLogSuccess(false);
      setShowLogForm(false);
      setDepositWeight(3);
    }, 4000);
  };

  // Citizen redeems points for a reward
  const handleRedeemReward = (rewardItem: RewardItem) => {
    // Deduct points from active user
    setCitizens(prev => prev.map(cit => {
      if (cit.id === activeCitizenId) {
        return {
          ...cit,
          points: cit.points - rewardItem.pointsCost
        };
      }
      return cit;
    }));

    // Add redemption record
    const newRedemption: RewardRedemption = {
      id: 'TX' + (redemptions.length + 1).toString().padStart(3, '0'),
      citizenId: activeCitizenId,
      citizenName: activeCitizen?.name || 'Budi Santoso',
      rewardId: rewardItem.id,
      rewardName: rewardItem.name,
      pointsDeducted: rewardItem.pointsCost,
      date: new Date().toISOString().split('T')[0],
      status: 'pending'
    };

    setRedemptions(prev => [newRedemption, ...prev]);

    // Update reward item stock
    setRewards(prev => prev.map(rew => {
      if (rew.id === rewardItem.id) {
        return {
          ...rew,
          stock: rew.stock - 1
        };
      }
      return rew;
    }));

    addCenterNotification(
      '🎁 Penukaran Diproses',
      `Penukaran poin untuk ${rewardItem.name} sedang diproses. Silakan hubungi pengurus RT untuk penyerahan barang.`,
      'reward'
    );
  };

  // Citizen adds feedback
  const handleAddFeedback = (newFeed: { rating: number; comment: string; aspect: string }) => {
    const feedbackRecord: Feedback = {
      id: 'F' + (feedbacks.length + 1).toString().padStart(3, '0'),
      citizenName: activeCitizen?.name || 'Budi Santoso',
      rating: newFeed.rating,
      comment: newFeed.comment,
      aspect: newFeed.aspect,
      date: new Date().toISOString().split('T')[0]
    };
    setFeedbacks(prev => [feedbackRecord, ...prev]);
    addToast('💬 Umpan Balik Terkirim', 'Terima kasih atas saran Anda demi kebersihan RT 005!', 'success');
  };

  // ADMIN ACTION: Approve deposit
  const handleApproveDeposit = (depositId: string) => {
    const deposit = deposits.find(d => d.id === depositId);
    if (!deposit) return;

    // Update status
    setDeposits(prev => prev.map(d => d.id === depositId ? { ...d, status: 'approved' } : d));

    // Award points and add waste kg to corresponding citizen
    setCitizens(prev => prev.map(cit => {
      if (cit.id === deposit.citizenId) {
        return {
          ...cit,
          points: cit.points + deposit.pointsEarned,
          totalWasteKg: Number((cit.totalWasteKg + deposit.weight).toFixed(1))
        };
      }
      return cit;
    }));

    // If it was the active citizen, show instant live notification
    if (deposit.citizenId === activeCitizenId) {
      addCenterNotification(
        '🎉 Setoran Sampah Disetujui!',
        `Setoran seberat ${deposit.weight} kg (${deposit.type}) disetujui. Saldo Anda bertambah +${deposit.pointsEarned} Poin!`,
        'reward'
      );
    } else {
      addToast(
        '✅ Setoran Disetujui',
        `Setoran seberat ${deposit.weight} kg oleh ${deposit.citizenName} disetujui. Poin ditambahkan.`,
        'success'
      );
    }
  };

  // ADMIN ACTION: Reject deposit
  const handleRejectDeposit = (depositId: string) => {
    const deposit = deposits.find(d => d.id === depositId);
    if (!deposit) return;

    setDeposits(prev => prev.map(d => d.id === depositId ? { ...d, status: 'rejected' } : d));

    if (deposit.citizenId === activeCitizenId) {
      addCenterNotification(
        '⚠️ Setoran Ditolak',
        `Setoran seberat ${deposit.weight} kg (${deposit.type}) ditolak. Silakan periksa kembali klasifikasi pemilahan Anda.`,
        'system'
      );
    } else {
      addToast('❌ Setoran Ditolak', `Setoran oleh ${deposit.citizenName} ditolak.`, 'error');
    }
  };

  // ADMIN ACTION: Mark reward redemption as completed/delivered
  const handleCompleteRedemption = (redemptionId: string) => {
    const redemption = redemptions.find(r => r.id === redemptionId);
    if (!redemption) return;

    setRedemptions(prev => prev.map(r => r.id === redemptionId ? { ...r, status: 'selesai' } : r));

    if (redemption.citizenId === activeCitizenId) {
      addCenterNotification(
        '🎁 Hadiah Telah Diserahkan!',
        `Klaim ${redemption.rewardName} selesai. Terima kasih telah aktif berpartisipasi dalam pemilahan sampah!`,
        'reward'
      );
    } else {
      addToast('✅ Hadiah Diserahkan', `Klaim ${redemption.rewardName} oleh ${redemption.citizenName} ditandai selesai.`, 'success');
    }
  };

  // ADMIN ACTION: Cancel reward redemption
  const handleCancelRedemption = (redemptionId: string) => {
    const redemption = redemptions.find(r => r.id === redemptionId);
    if (!redemption) return;

    // Refund points to citizen
    setCitizens(prev => prev.map(cit => {
      if (cit.id === redemption.citizenId) {
        return {
          ...cit,
          points: cit.points + redemption.pointsDeducted
        };
      }
      return cit;
    }));

    setRedemptions(prev => prev.map(r => r.id === redemptionId ? { ...r, status: 'dibatalkan' } : r));

    if (redemption.citizenId === activeCitizenId) {
      addCenterNotification(
        '⚠️ Penukaran Dibatalkan',
        `Penukaran ${redemption.rewardName} dibatalkan. Poin seberat ${redemption.pointsDeducted} telah dikembalikan.`,
        'system'
      );
    } else {
      addToast('❌ Penukaran Dibatalkan', `Klaim oleh ${redemption.citizenName} dibatalkan dan poin di-refund.`, 'info');
    }
  };

  // ADMIN ACTION: Broadcast system notifications (websocket mock trigger)
  const handlePushSystemNotification = (title: string, message: string, type: 'pickup' | 'reward' | 'system') => {
    addCenterNotification(title, message, type);
  };

  // ADMIN ACTION: Reset waste data back to zero (0)
  const handleResetWasteData = () => {
    setCitizens(prev => prev.map(c => ({
      ...c,
      totalWasteKg: 0
    })));
    setDeposits([]);
    addToast('♻️ Data Sampah Direset', 'Semua data setoran sampah warga telah berhasil direset ke nol (0).', 'success');
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-50 font-sans text-slate-900 antialiased" id="app-root">
        <LoginScreen citizens={citizens} onLogin={handleLogin} />
        {/* Real-time Toast Notifications Manager */}
        <div className="fixed bottom-4 right-4 z-50 max-w-sm w-full space-y-2 pointer-events-none">
          <AnimatePresence>
            {toasts.map(toast => (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, y: 50, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white border border-slate-200 p-4 rounded-xl shadow-lg pointer-events-auto flex gap-3"
              >
                <div className="flex-1">
                  <h5 className="font-extrabold text-xs text-slate-900 leading-tight">{toast.title}</h5>
                  <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{toast.message}</p>
                </div>
                <button
                  onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
                  className="text-slate-400 hover:text-slate-600 self-start cursor-pointer font-bold uppercase tracking-wider text-[10px]"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 antialiased" id="app-root">
      
      {/* Top Application Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 md:px-6 py-3 md:py-4 flex items-center justify-between gap-4">
          
          {/* Logo & Identity */}
          <div className="flex items-center gap-2 md:gap-3">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white shrink-0">
              <Leaf className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xs md:text-sm font-bold leading-none text-emerald-900 uppercase tracking-wider">ePil5am</h1>
              <p className="text-[9px] md:text-[10px] text-slate-400 font-medium uppercase mt-0.5">RT 005 RW 013 • Taman Buaran Indah IV</p>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            {/* Mobile Notification Bell */}
            {isMobile && isLoggedIn && (
              <button
                onClick={() => setIsMobileNotificationsOpen(true)}
                className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-xl relative cursor-pointer"
                title="Notifikasi"
              >
                <Bell className="w-4.5 h-4.5" />
                {notifications.filter(n => !n.isRead).length > 0 && (
                  <span className="absolute top-1.5 right-1.5 bg-red-500 text-white text-[8px] font-bold w-4 h-4 flex items-center justify-center rounded-full scale-90">
                    {notifications.filter(n => !n.isRead).length}
                  </span>
                )}
              </button>
            )}

            {/* Active Mode Indicator / Badge */}
            <div 
              className="flex items-center gap-1 bg-slate-100 p-0.5 md:p-1 rounded-xl border border-slate-200/50 select-none"
              title={userRole === 'warga' ? 'Peran: Warga' : 'Peran: Admin RT'}
            >
              {userRole === 'warga' ? (
                <div className="px-2 md:px-3 py-1 md:py-1.5 rounded-lg text-[10px] md:text-xs font-bold bg-white text-emerald-900 shadow-sm border border-slate-200/50 flex items-center gap-1">
                  <User className="w-3 md:w-3.5 h-3 md:h-3.5" />
                  <span>Warga</span>
                </div>
              ) : (
                <div className="px-2 md:px-3 py-1 md:py-1.5 rounded-lg text-[10px] md:text-xs font-bold bg-slate-900 text-white shadow-sm flex items-center gap-1">
                  <Shield className="w-3 md:w-3.5 h-3 md:h-3.5" />
                  <span>Admin RT</span>
                </div>
              )}
            </div>

            {/* Logout Button */}
            <button
              onClick={() => {
                setIsLoggedIn(false);
                addToast('🚪 Keluar Berhasil', 'Sesi Anda telah diakhiri.', 'info');
              }}
              className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl border border-transparent hover:border-rose-100 transition-all cursor-pointer flex items-center gap-1.5 text-xs font-bold"
              title="Keluar"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Keluar</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Body Layout */}
      <main className="max-w-5xl mx-auto p-4 md:p-6 pb-28 lg:pb-24">
        
        {/* Mobile/Tablet Welcome Banner */}
        {isMobile && isLoggedIn && (
          <div className="lg:hidden mb-4 bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 bg-emerald-50 text-emerald-700 rounded-xl flex items-center justify-center shrink-0">
                {userRole === 'warga' ? (
                  <User className="w-5 h-5 text-emerald-600" />
                ) : (
                  <Shield className="w-5 h-5 text-slate-700" />
                )}
              </div>
              <div className="min-w-0">
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">
                  {userRole === 'warga' ? 'Selamat Datang, Warga' : 'Selamat Datang, Admin'}
                </span>
                <h2 className="text-sm font-black text-slate-800 truncate">
                  {userRole === 'warga' ? activeCitizen?.name : adminRole}
                </h2>
              </div>
            </div>
            {userRole === 'warga' && activeCitizen && (
              <div className="bg-emerald-50 border border-emerald-100/60 px-2.5 py-1 rounded-xl text-right shrink-0">
                <span className="text-[9px] text-emerald-800 font-bold uppercase tracking-wider block">ID Warga</span>
                <span className="text-xs font-mono font-black text-emerald-700 leading-none block">{activeCitizen.id}</span>
              </div>
            )}
          </div>
        )}
        
        {/* Citizen View */}
        {userRole === 'warga' ? (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
            
            {/* Sidebar Navigation - Desktop Only */}
            <div className="hidden lg:block lg:col-span-1 bg-white border border-slate-200 p-5 rounded-2xl space-y-1.5 shadow-sm">
              <div className="px-2 py-1.5 border-b border-slate-100 mb-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Menu Warga</span>
                {activeCitizen && (
                  <h4 className="font-extrabold text-slate-800 text-sm truncate mt-1">{activeCitizen.name}</h4>
                )}
              </div>

              {[
                { id: 'dashboard', label: 'Dashboard Saya', icon: BookOpen },
                { id: 'rewards', label: 'Tukar Hadiah Poin', icon: ShoppingBag },
                { id: 'schedule', label: 'Jadwal & Pengingat', icon: Calendar },
                { id: 'leaderboard', label: 'Leaderboard RT 005', icon: Trophy },
                { id: 'feedback', label: 'Evaluasi & Ulasan', icon: MessageSquare },
                { id: 'secure_export', label: 'Keamanan & Ekspor', icon: ShieldCheck }
              ].map(menu => {
                const IconComp = menu.icon;
                const isActive = activeCitizenTab === menu.id;
                return (
                  <button
                    key={menu.id}
                    onClick={() => setActiveCitizenTab(menu.id as any)}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2.5 cursor-pointer ${
                      isActive
                        ? 'bg-emerald-50 text-emerald-900 border border-emerald-100/60 shadow-xs'
                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 border border-transparent'
                    }`}
                  >
                    <IconComp className="w-4 h-4 shrink-0" />
                    <span>{menu.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Main Content Area */}
            <div className="col-span-1 lg:col-span-3 space-y-6">
              
              {/* Citizen Active Tab Router */}
              {activeCitizenTab === 'dashboard' && (
                <div className="space-y-6 animate-fadeIn">
                  
                  {/* Stats Cards Section */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Points Box */}
                    <div className="bg-emerald-900 text-white p-5 rounded-2xl shadow-sm relative overflow-hidden flex flex-col justify-between">
                      <div className="z-10">
                        <span className="text-[9px] text-emerald-100/80 font-bold uppercase tracking-widest">Saldo Hadiah</span>
                        <div className="flex items-baseline gap-1 mt-1">
                          <h3 className="text-3xl font-black font-mono tracking-tight">{activeCitizen?.points.toLocaleString()}</h3>
                          <span className="text-xs text-emerald-100/80 font-bold">PTS</span>
                        </div>
                      </div>
                      <div className="mt-4 pt-3 border-t border-white/10 flex justify-between items-center z-10">
                        <span className="text-[10px] text-emerald-100/80 font-bold uppercase tracking-wider">Warga Peduli • Lvl 3</span>
                        <ArrowUpRight className="w-3.5 h-3.5 text-emerald-300" />
                      </div>
                      <div className="absolute right-0 bottom-0 translate-y-3 translate-x-3 opacity-[0.03] pointer-events-none">
                        <Sparkles className="w-24 h-24" />
                      </div>
                    </div>

                    {/* Total Waste Box */}
                    <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex flex-col justify-between">
                      <div>
                        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest block">Total Pilah Sampah</span>
                        <div className="flex items-baseline gap-1 mt-1">
                          <h3 className="text-3xl font-black text-slate-800 font-mono">{activeCitizen?.totalWasteKg.toFixed(1)}</h3>
                          <span className="text-xs text-slate-400 font-bold">KG</span>
                        </div>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-3 pt-2 border-t border-slate-100 font-medium">Bahan daur ulang diselamatkan.</p>
                    </div>

                    {/* Pending Setoran Box */}
                    <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex flex-col justify-between">
                      <div>
                        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest block">Setoran Pending</span>
                        <div className="flex items-baseline gap-1 mt-1">
                          <h3 className="text-3xl font-black text-amber-500 font-mono">
                            {deposits.filter(d => d.citizenId === activeCitizenId && d.status === 'pending').length}
                          </h3>
                          <span className="text-xs text-slate-400 font-bold">SETORAN</span>
                        </div>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-3 pt-2 border-t border-slate-100 font-medium">Menunggu timbangan disetujui.</p>
                    </div>
                  </div>

                  {/* Create New Deposit Form Trigger Block */}
                  <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm space-y-4">
                    <div className="flex justify-between items-center flex-wrap gap-4">
                      <div>
                        <h4 className="font-extrabold text-slate-800 text-sm uppercase tracking-wide">Ingin Menyetor Sampah Terpilah?</h4>
                        <p className="text-xs text-slate-500 mt-1">Catat berat perkiraan sampah Anda untuk dikonfirmasi oleh Admin RT saat penjemputan.</p>
                      </div>
                      <button
                        onClick={() => setShowLogForm(!showLogForm)}
                        className="px-5 py-2.5 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                      >
                        <PlusCircle className="w-4 h-4" />
                        <span>Catat Berat Sampah</span>
                      </button>
                    </div>

                    {/* Deposit Form */}
                    <AnimatePresence>
                      {showLogForm && (
                        <motion.form
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          onSubmit={handleRecordDeposit}
                          className="pt-5 border-t border-slate-100 space-y-4 overflow-hidden"
                        >
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Type */}
                            <div>
                              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Pilih Jenis Sampah</label>
                              <select
                                value={depositType}
                                onChange={(e) => setDepositType(e.target.value as WasteType)}
                                className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-semibold text-slate-700"
                              >
                                {WASTE_CATEGORIES.map(cat => (
                                  <option key={cat.id} value={cat.id}>
                                    {cat.name} (+{cat.pointsPerKg} pts/kg)
                                  </option>
                                ))}
                              </select>
                            </div>

                            {/* Weight */}
                            <div>
                              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Perkiraan Berat (kg)</label>
                              <div className="relative">
                                <input
                                  type="number"
                                  step="0.1"
                                  min="0.1"
                                  required
                                  value={depositWeight}
                                  onChange={(e) => setDepositWeight(parseFloat(e.target.value) || 0)}
                                  className="w-full text-xs p-3 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-bold text-slate-800"
                                />
                                <span className="absolute right-3 top-3 text-xs font-bold text-slate-400 uppercase font-mono">KG</span>
                              </div>
                            </div>
                          </div>

                          {/* Points Simulation Info */}
                          <div className="bg-emerald-50 border border-emerald-100/60 p-4 rounded-xl flex items-center justify-between text-xs">
                            <span className="text-emerald-950 font-semibold">Perkiraan Perolehan Poin Warga:</span>
                            <span className="font-mono font-black text-emerald-600 text-sm">
                              +{Math.round(depositWeight * (WASTE_CATEGORIES.find(c => c.id === depositType)?.pointsPerKg || 10))} POIN
                            </span>
                          </div>

                          <div className="flex justify-end gap-2 pt-2">
                            <button
                              type="button"
                              onClick={() => setShowLogForm(false)}
                              className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-xl cursor-pointer"
                            >
                              Batal
                            </button>
                            <button
                              type="submit"
                              className="px-5 py-2.5 bg-emerald-600 text-white text-xs font-bold rounded-xl hover:bg-emerald-700 cursor-pointer shadow-sm"
                            >
                              Ajukan Penyetoran
                            </button>
                          </div>
                        </motion.form>
                      )}
                    </AnimatePresence>

                    {logSuccess && (
                      <div className="bg-emerald-50 border border-emerald-200 text-emerald-950 p-4 rounded-xl flex gap-2 text-xs">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold">Pengajuan Setoran Sukses!</p>
                          <p className="text-emerald-800 mt-0.5">Ajuan seberat {depositWeight} kg berhasil direkam. Pengurus RT 005 akan memverifikasi setoran saat pengambilan rutin hari Kamis/Sabtu.</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Waste composition infographics & Jakarta critical situation */}
                  <GuideSection />

                  {/* Transaction History of Citizen */}
                  <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm space-y-4">
                    <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                      <h4 className="font-extrabold text-slate-800 text-xs uppercase tracking-widest flex items-center gap-2">
                        <History className="w-4 h-4 text-emerald-600" /> Riwayat Transaksi Saya
                      </h4>
                    </div>

                    <div className="space-y-2.5">
                      {deposits.filter(d => d.citizenId === activeCitizenId).slice(0, 5).map((dep, idx) => {
                        const isPending = dep.status === 'pending';
                        const isApproved = dep.status === 'approved';
                        const category = WASTE_CATEGORIES.find(c => c.id === dep.type);

                        return (
                          <div key={dep.id} className="p-4 bg-slate-50 border border-slate-100 rounded-xl flex justify-between items-center text-xs hover:bg-slate-100/50 transition-colors">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-slate-800">{category?.name || dep.type}</span>
                                <span className="text-[10px] text-slate-400 font-mono">#{dep.id}</span>
                              </div>
                              <div className="flex items-center gap-2 text-[10px] text-slate-400 font-medium">
                                <span>{dep.date}</span>
                                <span>•</span>
                                <span className="font-mono">{dep.weight} kg</span>
                              </div>
                            </div>
                            <div className="text-right space-y-1.5 shrink-0">
                              <span className="font-mono font-black text-amber-600 block">+{dep.pointsEarned} pts</span>
                              <span className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border ${
                                isPending
                                  ? 'bg-amber-50 text-amber-800 border-amber-100'
                                  : isApproved
                                    ? 'bg-emerald-50 text-emerald-900 border-emerald-100'
                                    : 'bg-red-50 text-red-800 border-red-100'
                              }`}>
                                {isPending ? 'Pending' : isApproved ? 'Disetujui' : 'Ditolak'}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {activeCitizenTab === 'rewards' && (
                <RewardStore
                  rewards={rewards}
                  userPoints={activeCitizen?.points || 0}
                  onRedeem={handleRedeemReward}
                  redemptionHistory={redemptions.filter(r => r.citizenId === activeCitizenId)}
                />
              )}

              {activeCitizenTab === 'schedule' && (
                <PickupSchedules
                  schedules={DEFAULT_PICKUP_SCHEDULE}
                  remindersEnabled={remindersEnabled}
                  onToggleReminders={setRemindersEnabled}
                />
              )}

              {activeCitizenTab === 'leaderboard' && (
                <Leaderboard
                  citizens={citizens}
                  activeCitizenId={activeCitizenId}
                />
              )}

              {activeCitizenTab === 'feedback' && (
                <FeedbackForm
                  onAddFeedback={handleAddFeedback}
                  feedbacks={feedbacks}
                />
              )}

              {activeCitizenTab === 'secure_export' && (
                <div className="space-y-6">
                  <ExportReports
                    deposits={deposits}
                    citizens={citizens}
                    redemptions={redemptions}
                  />
                  <SecurityInspector />
                </div>
              )}

            </div>
          </div>
        ) : (
          /* Admin View Dashboard */
          <AdminDashboard
            citizens={citizens}
            deposits={deposits}
            redemptions={redemptions}
            feedbacks={feedbacks}
            adminRole={adminRole}
            onApproveDeposit={handleApproveDeposit}
            onRejectDeposit={handleRejectDeposit}
            onCompleteRedemption={handleCompleteRedemption}
            onCancelRedemption={handleCancelRedemption}
            onPushSystemNotification={handlePushSystemNotification}
            onUpdateCitizens={setCitizens}
            onResetWasteData={handleResetWasteData}
          />
        )}
      </main>

      {/* Real-time Toast Notifications Manager */}
      <div className="fixed bottom-4 right-4 z-50 max-w-sm w-full space-y-2 pointer-events-none">
        <AnimatePresence>
          {toasts.map(toast => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border border-slate-200 p-4 rounded-xl shadow-lg pointer-events-auto flex gap-3"
            >
              <div className="flex-1">
                <h5 className="font-extrabold text-xs text-slate-900 leading-tight">{toast.title}</h5>
                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{toast.message}</p>
              </div>
              <button
                onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
                className="text-slate-400 hover:text-slate-600 self-start cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Floating Panel showing Notification Center (Active notifications feed) - Desktop Only */}
      <div className="hidden lg:block fixed bottom-4 left-4 z-45">
        <div className="relative group">
          <div className="bg-slate-900 text-white p-3.5 rounded-full shadow-lg hover:bg-slate-800 transition-all cursor-pointer flex items-center justify-center relative">
            <Bell className="w-5 h-5" />
            {notifications.filter(n => !n.isRead).length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                {notifications.filter(n => !n.isRead).length}
              </span>
            )}
          </div>

          {/* Collapsible Dropdown */}
          <div className="absolute bottom-14 left-0 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl p-4 hidden group-hover:block hover:block z-50 max-h-96 overflow-y-auto space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <span className="font-extrabold text-xs text-slate-800 uppercase tracking-wide">Notifikasi Real-Time</span>
              <button
                onClick={() => setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))}
                className="text-[10px] font-bold text-emerald-600 hover:text-emerald-700 cursor-pointer"
              >
                Tandai semua dibaca
              </button>
            </div>

            <div className="space-y-2.5">
              {notifications.map(notif => (
                <div
                  key={notif.id}
                  className={`p-3 rounded-xl border text-xs space-y-1 transition-colors ${
                    notif.isRead ? 'bg-white border-slate-100 text-slate-500' : 'bg-emerald-50/40 border-emerald-100 text-slate-800'
                  }`}
                >
                  <div className="flex justify-between items-start gap-1">
                    <span className="font-bold leading-tight block">{notif.title}</span>
                    <span className="text-[9px] font-mono text-slate-400 shrink-0">{notif.date.substring(11)}</span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-slate-600">{notif.message}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation Bar for Mobile Warga Mode */}
      {isMobile && isLoggedIn && userRole === 'warga' && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-xl px-2 py-2 flex justify-around items-center">
          {[
            { id: 'dashboard', label: 'Beranda', icon: BookOpen },
            { id: 'rewards', label: 'Hadiah', icon: ShoppingBag },
            { id: 'schedule', label: 'Jadwal', icon: Calendar },
            { id: 'leaderboard', label: 'Skor', icon: Trophy },
            { id: 'more', label: 'Menu', icon: Menu }
          ].map(tab => {
            const IconComp = tab.icon;
            const isActive = tab.id === 'more' ? isMobileMenuOpen : (activeCitizenTab === tab.id && !isMobileMenuOpen);
            return (
              <button
                key={tab.id}
                onClick={() => {
                  if (tab.id === 'more') {
                    setIsMobileMenuOpen(prev => !prev);
                  } else {
                    setActiveCitizenTab(tab.id as any);
                    setIsMobileMenuOpen(false);
                  }
                }}
                className={`flex flex-col items-center gap-1 py-1.5 px-3 rounded-2xl transition-all cursor-pointer ${
                  isActive
                    ? 'text-emerald-700 bg-emerald-50 font-extrabold'
                    : 'text-slate-400 hover:text-slate-600 font-bold'
                }`}
              >
                <IconComp className="w-5 h-5 shrink-0" />
                <span className="text-[10px] tracking-wide">{tab.label}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Mobile Drawer/Modal Menu "Lainnya" */}
      <AnimatePresence>
        {isMobile && isLoggedIn && isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 flex flex-col justify-end bg-slate-900/60 backdrop-blur-xs">
            {/* Backdrop Tap to Close */}
            <div className="absolute inset-0" onClick={() => setIsMobileMenuOpen(false)} />

            {/* Slide-Up Container */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="bg-white rounded-t-3xl border-t border-slate-200 p-6 space-y-5 z-10 shadow-2xl pb-10"
            >
              {/* Header Indicator */}
              <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto cursor-pointer" onClick={() => setIsMobileMenuOpen(false)} />
              
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-sm font-black text-slate-800">Menu Tambahan Warga</h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">{activeCitizen?.name} • RT 005</p>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Action Buttons list */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    setActiveCitizenTab('feedback');
                    setIsMobileMenuOpen(false);
                  }}
                  className={`p-4 border rounded-2xl flex flex-col items-start gap-2.5 text-left transition-all ${
                    activeCitizenTab === 'feedback'
                      ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <MessageSquare className="w-5 h-5 text-emerald-600" />
                  <div>
                    <span className="text-xs font-bold block">Evaluasi & Saran</span>
                    <span className="text-[10px] text-slate-500 leading-normal block mt-0.5">Beri rating pelayanan RT</span>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setActiveCitizenTab('secure_export');
                    setIsMobileMenuOpen(false);
                  }}
                  className={`p-4 border rounded-2xl flex flex-col items-start gap-2.5 text-left transition-all ${
                    activeCitizenTab === 'secure_export'
                      ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  <div>
                    <span className="text-xs font-bold block">Keamanan & Ekspor</span>
                    <span className="text-[10px] text-slate-500 leading-normal block mt-0.5">Enkripsi & Backup data</span>
                  </div>
                </button>
              </div>

              {/* Quick Preferences Card */}
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4">
                <div className="flex justify-between items-center text-xs">
                  <div className="flex items-center gap-2">
                    <Info className="w-4 h-4 text-slate-500" />
                    <span className="font-bold text-slate-700">Panduan Sampah Terpilah</span>
                  </div>
                  <button
                    onClick={() => {
                      setActiveCitizenTab('dashboard');
                      setIsMobileMenuOpen(false);
                      setTimeout(() => {
                        const el = document.getElementById('composition-infographics');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }, 200);
                    }}
                    className="py-1 px-3 border border-slate-200 text-slate-600 hover:bg-slate-100 font-bold rounded-xl text-[10px]"
                  >
                    Lihat Info
                  </button>
                </div>
              </div>

              {/* Red-labeled Logout Action */}
              <button
                onClick={() => {
                  setIsLoggedIn(false);
                  setIsMobileMenuOpen(false);
                  addToast('🚪 Sesi Diakhiri', 'Sesi login Anda berhasil ditutup.', 'info');
                }}
                className="w-full py-3 bg-rose-50 border border-rose-100 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <LogOut className="w-4 h-4" /> Keluar dari Aplikasi
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Mobile Drawer/Modal Menu "Notifikasi" */}
      <AnimatePresence>
        {isMobile && isLoggedIn && isMobileNotificationsOpen && (
          <div className="fixed inset-0 z-50 flex flex-col justify-end bg-slate-900/60 backdrop-blur-xs">
            {/* Backdrop Tap to Close */}
            <div className="absolute inset-0" onClick={() => setIsMobileNotificationsOpen(false)} />

            {/* Slide-Up Container */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="bg-white rounded-t-3xl border-t border-slate-200 p-6 space-y-4 z-10 shadow-2xl pb-10 max-h-[80vh] flex flex-col"
            >
              {/* Header Indicator */}
              <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto shrink-0 cursor-pointer" onClick={() => setIsMobileNotificationsOpen(false)} />
              
              <div className="flex justify-between items-center border-b border-slate-100 pb-3 shrink-0">
                <div>
                  <h3 className="text-sm font-black text-slate-800">Notifikasi Real-Time</h3>
                  <p className="text-[10px] text-slate-400 font-medium uppercase mt-0.5">Informasi & Update Pengurus RT</p>
                </div>
                <button
                  onClick={() => {
                    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
                    addToast('✓ Dibaca', 'Semua notifikasi ditandai telah dibaca.', 'info');
                  }}
                  className="text-[10px] font-bold text-emerald-600 hover:text-emerald-700 cursor-pointer"
                >
                  Tandai semua dibaca
                </button>
              </div>

              {/* Scrollable list content */}
              <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 py-1">
                {notifications.length > 0 ? (
                  notifications.map(notif => (
                    <div
                      key={notif.id}
                      className={`p-3.5 rounded-2xl border text-xs space-y-1 transition-colors ${
                        notif.isRead ? 'bg-slate-50/50 border-slate-100 text-slate-500' : 'bg-emerald-50/30 border-emerald-100/80 text-slate-800 shadow-xs'
                      }`}
                    >
                      <div className="flex justify-between items-start gap-2">
                        <span className="font-bold leading-tight text-slate-800 block">{notif.title}</span>
                        <span className="text-[9px] font-mono text-slate-400 shrink-0">{notif.date.substring(11)}</span>
                      </div>
                      <p className="text-[11px] leading-relaxed text-slate-600 mt-1">{notif.message}</p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10 text-xs text-slate-400 font-medium">
                    Belum ada notifikasi baru untuk Anda.
                  </div>
                )}
              </div>

              <button
                onClick={() => setIsMobileNotificationsOpen(false)}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 mt-2"
              >
                Tutup Notifikasi
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
