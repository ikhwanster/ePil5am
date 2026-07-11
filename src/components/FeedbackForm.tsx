import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, Star, Check, Sparkles, Send, Info } from 'lucide-react';
import { Feedback } from '../types';

interface FeedbackFormProps {
  onAddFeedback: (feedback: { rating: number; comment: string; aspect: string }) => void;
  feedbacks: Feedback[];
}

export default function FeedbackForm({ onAddFeedback, feedbacks }: FeedbackFormProps) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [aspect, setAspect] = useState('Ketepatan Waktu');
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const aspects = [
    'Ketepatan Waktu',
    'Sikap Petugas',
    'Kebersihan Area',
    'Aplikasi / Sistem',
    'Lainnya'
  ];

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (comment.trim() === '') return;

    onAddFeedback({ rating, comment, aspect });
    setComment('');
    setRating(5);
    setAspect('Ketepatan Waktu');
    
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="space-y-6" id="feedback-form-section">
      {/* Intro info */}
      <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm space-y-3">
        <div className="flex items-center gap-2.5 text-emerald-600">
          <MessageSquare className="w-5 h-5" />
          <h3 className="font-extrabold text-slate-800 text-sm uppercase tracking-wide">Evaluasi Layanan Kebersihan</h3>
        </div>
        <p className="text-xs text-slate-500 leading-relaxed">
          Suara Anda sangat berarti untuk kemajuan lingkungan Taman Buaran Indah IV. Berikan penilaian objektif terkait layanan pengumpulan, ketepatan waktu petugas Pak Joko, serta kebersihan umum pasca penjemputan sampah.
        </p>
      </div>

      {/* Grid of form and latest reviews */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Form */}
        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm space-y-4">
          <h4 className="font-extrabold text-slate-800 text-xs uppercase tracking-wide pb-2 border-b border-slate-100">Kirim Umpan Balik</h4>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Aspect Selector */}
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">Aspek Penilaian</label>
              <div className="flex flex-wrap gap-2">
                {aspects.map((asp, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setAspect(asp)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                      aspect === asp
                        ? 'bg-emerald-50 text-emerald-900 border-emerald-100'
                        : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {asp}
                  </button>
                ))}
              </div>
            </div>

            {/* Star Rating Selector */}
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Skor Bintang (1 - 5)</label>
              <div className="flex items-center gap-1.5 py-1">
                {[1, 2, 3, 4, 5].map((starValue) => {
                  const isActive = (hoverRating !== null ? hoverRating : rating) >= starValue;
                  return (
                    <button
                      key={starValue}
                      type="button"
                      onClick={() => setRating(starValue)}
                      onMouseEnter={() => setHoverRating(starValue)}
                      onMouseLeave={() => setHoverRating(null)}
                      className="p-1 cursor-pointer transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-7 h-7 transition-colors ${
                          isActive ? 'text-amber-400 fill-amber-400' : 'text-slate-200'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mt-1">
                {rating === 5 && 'Sangat Memuaskan'}
                {rating === 4 && 'Memuaskan / Bagus'}
                {rating === 3 && 'Cukup / Rata-rata'}
                {rating === 2 && 'Perlu Peningkatan'}
                {rating === 1 && 'Sangat Buruk'}
              </span>
            </div>

            {/* Review Comment */}
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">Ulasan / Kritik / Saran</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Tulis kritik, saran, atau pujian Anda untuk petugas dan program Bank Sampah RT 005..."
                required
                className="w-full text-xs p-3 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium h-24 resize-none text-slate-800"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Send className="w-4 h-4" /> Kirim Ulasan Layanan
            </button>
          </form>

          {/* Success Banner */}
          <AnimatePresence>
            {showSuccess && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="bg-emerald-50 border border-emerald-200 text-emerald-950 p-3 rounded-xl flex items-center gap-2 text-xs"
              >
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Terima kasih! Ulasan Anda telah diteruskan ke admin RT 005 secara anonim dan aman.</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Latest Feedbacks History List */}
        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm space-y-4">
          <h4 className="font-extrabold text-slate-800 text-xs uppercase tracking-widest pb-2 border-b border-slate-100">Evaluasi Terkini Warga</h4>
          
          <div className="space-y-3.5 max-h-80 overflow-y-auto pr-1">
            {feedbacks.map((item) => (
              <div key={item.id} className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-2 hover:bg-slate-100/30 transition-colors">
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <span className="text-[9px] font-bold text-emerald-900 bg-emerald-50 border border-emerald-100/50 px-2 py-0.5 rounded-md">
                      {item.aspect}
                    </span>
                    <h5 className="font-bold text-slate-800 text-xs mt-1.5">{item.citizenName}</h5>
                  </div>
                  <div className="flex items-center gap-1 bg-white border border-slate-200 px-2 py-0.5 rounded-lg shadow-xs">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span className="text-xs font-bold text-slate-800">{item.rating}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 italic">"{item.comment}"</p>
                
                <span className="text-[10px] text-slate-400 block font-semibold uppercase tracking-wider">
                  Dikirim pada {item.date}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
