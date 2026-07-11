import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Award, ShoppingBag, Check, ShieldAlert, Sparkles, AlertCircle, Droplet, CreditCard, Sparkle, Candy, Leaf, CupSoda } from 'lucide-react';
import { RewardItem, RewardRedemption } from '../types';

interface RewardStoreProps {
  rewards: RewardItem[];
  userPoints: number;
  onRedeem: (reward: RewardItem) => void;
  redemptionHistory: RewardRedemption[];
}

export default function RewardStore({ rewards, userPoints, onRedeem, redemptionHistory }: RewardStoreProps) {
  const [selectedReward, setSelectedReward] = useState<RewardItem | null>(null);
  const [successRedeem, setSuccessRedeem] = useState<RewardItem | null>(null);

  // Helper to get matching icons
  const getIcon = (name: string) => {
    switch (name) {
      case 'Droplet': return <Droplet className="w-5 h-5 text-blue-500" />;
      case 'CreditCard': return <CreditCard className="w-5 h-5 text-indigo-500" />;
      case 'Sparkles': return <Sparkle className="w-5 h-5 text-amber-500" />;
      case 'Candy': return <Candy className="w-5 h-5 text-pink-500" />;
      case 'Leaf': return <Leaf className="w-5 h-5 text-emerald-500" />;
      case 'CupSoda': return <CupSoda className="w-5 h-5 text-teal-500" />;
      default: return <ShoppingBag className="w-5 h-5 text-gray-500" />;
    }
  };

  const handleConfirmRedeem = () => {
    if (selectedReward) {
      onRedeem(selectedReward);
      setSuccessRedeem(selectedReward);
      setSelectedReward(null);
      setTimeout(() => {
        setSuccessRedeem(null);
      }, 4000);
    }
  };

  return (
    <div className="space-y-6" id="reward-store-section">
      {/* Point Balance Header */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-sm border border-slate-950 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block mb-1">Poin Aktif Anda</span>
          <div className="flex items-baseline gap-2">
            <h3 className="text-4xl font-extrabold tracking-tight text-white font-mono">{userPoints.toLocaleString()}</h3>
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Poin RT 005</span>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Tukarkan poin Anda dengan sembako, voucher belanja, atau pupuk organik produksi lokal!
          </p>
        </div>
        <div className="bg-slate-800 border border-slate-700 p-4 rounded-xl self-stretch sm:self-auto flex items-center gap-3">
          <Award className="w-10 h-10 text-amber-500 shrink-0" />
          <div>
            <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">Tingkat Kontribusi</span>
            <span className="text-xs font-bold text-white">Warga Peduli (Level 3)</span>
          </div>
        </div>
      </div>

      {/* Success Banner */}
      <AnimatePresence>
        {successRedeem && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-emerald-50 border border-emerald-200 text-emerald-950 p-4 rounded-xl flex items-start gap-3 shadow-xs overflow-hidden"
          >
            <Check className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-sm">Penukaran Hadiah Berhasil Diajukan!</h4>
              <p className="text-xs text-emerald-800 mt-0.5 leading-relaxed">
                Penukaran <strong>{successRedeem.name}</strong> telah berhasil direkam. Silakan hubungi pengurus RT atau ambil hadiah di Balai RT saat jam kerja dengan membawa KTP/Bukti aplikasi ini.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reward Shop Grid */}
      <div className="space-y-4">
        <h3 className="font-extrabold text-slate-800 text-xs uppercase tracking-widest flex items-center gap-2">
          <ShoppingBag className="w-5 h-5 text-emerald-600" /> Katalog Penukaran Poin
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {rewards.map((reward) => {
            const isAffordable = userPoints >= reward.pointsCost;
            const hasStock = reward.stock > 0;

            return (
              <motion.div
                key={reward.id}
                whileHover={{ y: -2 }}
                className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start gap-2 mb-3">
                    <span className="text-[9px] font-bold uppercase tracking-widest bg-slate-50 border border-slate-100 text-slate-700 px-2 py-1 rounded-md">
                      {reward.category}
                    </span>
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border uppercase tracking-wider ${
                      hasStock ? 'bg-emerald-50 text-emerald-900 border-emerald-100' : 'bg-red-50 text-red-700 border-red-100'
                    }`}>
                      {hasStock ? `Stok: ${reward.stock}` : 'Stok Habis'}
                    </span>
                  </div>

                  <div className="flex gap-3 mb-3">
                    <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl shrink-0 h-11 w-11 flex items-center justify-center">
                      {getIcon(reward.iconName)}
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-800 leading-tight">{reward.name}</h4>
                      <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">{reward.description}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-widest">Biaya Poin</span>
                    <span className="font-mono font-black text-base text-amber-600">{reward.pointsCost} PTS</span>
                  </div>

                  <button
                    disabled={!isAffordable || !hasStock}
                    onClick={() => setSelectedReward(reward)}
                    className={`px-4 py-2.5 text-xs font-bold rounded-xl shadow-sm transition-all border ${
                      hasStock && isAffordable
                        ? 'bg-slate-900 text-white border-transparent hover:bg-slate-800 active:scale-95 cursor-pointer'
                        : 'bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    {!hasStock ? 'Habis' : !isAffordable ? 'Poin Kurang' : 'Tukarkan'}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {selectedReward && (
          <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl p-6 max-w-sm w-full border border-slate-200 shadow-xl space-y-5"
            >
              <div className="flex items-center gap-3 text-slate-900">
                <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl">
                  <ShoppingBag className="w-5 h-5 text-emerald-600" />
                </div>
                <h4 className="font-extrabold text-slate-800 text-base uppercase tracking-wide">Konfirmasi Penukaran</h4>
              </div>

              <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs font-medium">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Nama Barang:</span>
                  <span className="font-bold text-slate-800 text-right">{selectedReward.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Biaya Poin:</span>
                  <span className="font-mono font-black text-amber-600">-{selectedReward.pointsCost} PTS</span>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-2 font-bold">
                  <span className="text-slate-600">Poin Anda Sekarang:</span>
                  <span className="font-mono text-slate-700">{userPoints} PTS</span>
                </div>
                <div className="flex justify-between font-bold text-emerald-800">
                  <span>Poin Setelah Penukaran:</span>
                  <span className="font-mono">{userPoints - selectedReward.pointsCost} PTS</span>
                </div>
              </div>

              <div className="flex gap-2.5">
                <button
                  onClick={() => setSelectedReward(null)}
                  className="flex-1 py-2.5 text-xs font-bold text-slate-500 border border-slate-200 rounded-xl hover:bg-slate-50 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  onClick={handleConfirmRedeem}
                  className="flex-1 py-2.5 text-xs font-bold text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 active:scale-95 cursor-pointer shadow-sm"
                >
                  Ya, Tukarkan
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
