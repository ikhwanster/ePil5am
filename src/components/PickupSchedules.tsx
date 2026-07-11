import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Bell, BellOff, Info, Check, Clock, User, Phone, CheckCircle2, ChevronRight, Truck } from 'lucide-react';
import { PickupSchedule } from '../types';

interface PickupSchedulesProps {
  schedules: PickupSchedule[];
  onToggleReminders: (enabled: boolean) => void;
  remindersEnabled: boolean;
}

export default function PickupSchedules({ schedules, onToggleReminders, remindersEnabled }: PickupSchedulesProps) {
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [requestSuccess, setRequestSuccess] = useState(false);
  
  // Custom collection request state
  const [weightEstimate, setWeightEstimate] = useState('5');
  const [wasteType, setWasteType] = useState('anorganik_plastik');
  const [notes, setNotes] = useState('');

  const handleRequestCollection = (e: FormEvent) => {
    e.preventDefault();
    setRequestSuccess(true);
    setTimeout(() => {
      setRequestSuccess(false);
      setShowScheduleForm(false);
      setNotes('');
    }, 4000);
  };

  return (
    <div className="space-y-6" id="pickup-schedules-section">
      {/* Banner */}
      <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3 text-emerald-600">
            <div className="p-2.5 bg-emerald-50 rounded-xl">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-800 text-sm uppercase tracking-wider">Jadwal Penjemputan Sampah</h3>
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mt-0.5">RT 005 RW 013 • Taman Buaran Indah IV</p>
            </div>
          </div>

          <button
            onClick={() => onToggleReminders(!remindersEnabled)}
            className={`px-4 py-2 text-xs font-bold rounded-xl flex items-center gap-2 transition-all cursor-pointer border ${
              remindersEnabled
                ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
            }`}
          >
            {remindersEnabled ? (
              <>
                <Bell className="w-4 h-4 text-emerald-600 animate-swing" />
                <span>Pengingat Aktif</span>
              </>
            ) : (
              <>
                <BellOff className="w-4 h-4 text-slate-400" />
                <span>Aktifkan Pengingat</span>
              </>
            )}
          </button>
        </div>

        <p className="text-xs text-slate-500 leading-relaxed">
          Petugas kebersihan RT 005 mengambil sampah warga secara terjadwal di depan gerbang rumah masing-masing. Aktifkan pengingat untuk menerima notifikasi real-time H-1 malam sebelum jadwal pengambilan!
        </p>
      </div>

      {/* Routine Schedule Cards */}
      <div className="space-y-3">
        <h4 className="font-bold text-slate-400 text-[10px] uppercase tracking-widest">Jadwal Rutin Mingguan</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {schedules.map((sched, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -1 }}
              className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm relative overflow-hidden"
            >
              <div className="flex justify-between items-start mb-3">
                <span className="text-xs font-black text-emerald-900 bg-emerald-50 border border-emerald-100/50 px-3 py-1 rounded-lg uppercase tracking-wider">
                  {sched.day}
                </span>
                <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-md flex items-center gap-1">
                  <Clock className="w-3 h-3 text-emerald-600" /> {sched.time}
                </span>
              </div>

              <div className="space-y-2.5">
                <div>
                  <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest block mb-1">Kategori Diambil</span>
                  <div className="flex flex-wrap gap-1.5">
                    {sched.types.map((type, tIdx) => (
                      <span key={tIdx} className="text-xs font-bold text-slate-700 bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-md">
                        {type}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 pt-2 border-t border-slate-100 text-[11px] text-slate-500 font-medium">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>Petugas: <strong className="text-slate-700">{sched.officer}</strong></span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Heavy Garbage Collection Request Form */}
      <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl space-y-4">
        <div className="flex justify-between items-center flex-wrap gap-3">
          <div>
            <h4 className="font-extrabold text-slate-800 text-sm uppercase tracking-wide">Punya Sampah Besar / Berat?</h4>
            <p className="text-xs text-slate-500 mt-1">Gunakan layanan pemanggilan kurir Bank Sampah RT 005 khusus warga</p>
          </div>
          <button
            onClick={() => setShowScheduleForm(!showScheduleForm)}
            className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-all cursor-pointer shadow-sm"
          >
            {showScheduleForm ? 'Tutup Form' : 'Ajukan Penjemputan'}
          </button>
        </div>

        <AnimatePresence>
          {showScheduleForm && (
            <motion.form
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              onSubmit={handleRequestCollection}
              className="space-y-4 overflow-hidden pt-4 border-t border-slate-200"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Perkiraan Berat Sampah (kg)</label>
                  <input
                    type="number"
                    value={weightEstimate}
                    onChange={(e) => setWeightEstimate(e.target.value)}
                    required
                    min="1"
                    className="w-full text-xs p-3 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-bold text-slate-800"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Kategori Utama</label>
                  <select
                    value={wasteType}
                    onChange={(e) => setWasteType(e.target.value)}
                    className="w-full text-xs p-3 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-semibold text-slate-700"
                  >
                    <option value="organik">Sampah Organik</option>
                    <option value="anorganik_plastik">Anorganik (Plastik/Kaleng)</option>
                    <option value="anorganik_kertas">Anorganik (Kertas/Kardus)</option>
                    <option value="b3">Sampah Berbahaya (B3)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Catatan Tambahan (Alamat detail, waktu luang)</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Misal: Blok A/12, silakan ambil jam 16:00 sore sesudah pulang kerja..."
                  className="w-full text-xs p-3 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium h-16 resize-none text-slate-800"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-600 text-white font-bold rounded-xl text-xs hover:bg-emerald-700 flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Truck className="w-4 h-4" /> Ajukan Jadwal Penjemputan Khusus
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        {requestSuccess && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-950 p-4 rounded-xl flex items-start gap-2 text-xs shadow-xs">
            <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Pengajuan Penjemputan Khusus Berhasil!</p>
              <p className="text-emerald-800 mt-0.5">Petugas Bank Sampah RT 005 akan mengonfirmasi lokasi Anda dan melakukan penjemputan sesuai catatan Anda. Notifikasi status penjemputan akan dikirimkan real-time.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
