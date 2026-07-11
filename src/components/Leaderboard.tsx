import { useState } from 'react';
import { motion } from 'motion/react';
import { Trophy, Medal, Crown, ArrowUp, Sparkles, Scale, Star } from 'lucide-react';
import { Citizen } from '../types';

interface LeaderboardProps {
  citizens: Citizen[];
  activeCitizenId: string;
}

export default function Leaderboard({ citizens, activeCitizenId }: LeaderboardProps) {
  const [sortBy, setSortBy] = useState<'points' | 'waste'>('points');

  // Sort citizens
  const sortedCitizens = [...citizens].sort((a, b) => {
    if (sortBy === 'points') {
      return b.points - a.points;
    } else {
      return b.totalWasteKg - a.totalWasteKg;
    }
  });

  // Find user's rank
  const activeUserRank = sortedCitizens.findIndex(c => c.id === activeCitizenId) + 1;
  const activeUser = citizens.find(c => c.id === activeCitizenId);

  return (
    <div className="space-y-6" id="leaderboard-section">
      {/* Intro Banner */}
      <div className="bg-slate-900 border border-slate-950 text-white p-6 rounded-2xl shadow-sm flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest bg-slate-800 border border-slate-700 px-2.5 py-1 rounded-full w-max mb-2.5 text-amber-400">
            <Sparkles className="w-3.5 h-3.5" /> Juara Bulan Juli 2026
          </div>
          <h3 className="text-base font-extrabold tracking-wide uppercase">Pahlawan Lingkungan RT 005</h3>
          <p className="text-slate-400 text-xs mt-1.5 max-w-sm leading-relaxed">
            Semakin rajin memilah sampah dan menyetorkannya, semakin tinggi posisi Anda di leaderboard bulanan!
          </p>
        </div>
        <div className="p-3 bg-slate-800 border border-slate-700 rounded-full hidden sm:block">
          <Trophy className="w-8 h-8 text-amber-500 animate-bounce" />
        </div>
      </div>

      {/* Sorting Tabs */}
      <div className="flex bg-slate-100 border border-slate-200 p-1 rounded-xl">
        <button
          onClick={() => setSortBy('points')}
          className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
            sortBy === 'points'
              ? 'bg-white text-slate-900 border border-slate-200/60 shadow-xs'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Star className="w-4 h-4 text-amber-500" /> Urutkan Berdasarkan Poin
        </button>
        <button
          onClick={() => setSortBy('waste')}
          className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
            sortBy === 'waste'
              ? 'bg-white text-slate-900 border border-slate-200/60 shadow-xs'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Scale className="w-4 h-4 text-emerald-600" /> Urutkan Berdasarkan Berat (kg)
        </button>
      </div>

      {/* Leaderboard Table List */}
      <div className="bg-white border border-slate-200 rounded-2xl divide-y divide-slate-100 overflow-hidden shadow-sm">
        {sortedCitizens.map((citizen, index) => {
          const rank = index + 1;
          const isMe = citizen.id === activeCitizenId;

          let badgeColor = '';
          let BadgeIcon = null;

          if (rank === 1) {
            badgeColor = 'bg-amber-50 text-amber-700 border-amber-200';
            BadgeIcon = Crown;
          } else if (rank === 2) {
            badgeColor = 'bg-slate-100 text-slate-700 border-slate-200';
            BadgeIcon = Medal;
          } else if (rank === 3) {
            badgeColor = 'bg-orange-50 text-orange-700 border-orange-200';
            BadgeIcon = Medal;
          }

          return (
            <motion.div
              key={citizen.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`flex items-center gap-4 p-4 transition-colors ${
                isMe ? 'bg-emerald-50/50 hover:bg-emerald-50' : 'hover:bg-slate-50/40'
              }`}
            >
              {/* Rank column */}
              <div className="w-10 flex justify-center items-center shrink-0">
                {BadgeIcon ? (
                  <div className={`p-1.5 rounded-lg border flex items-center justify-center ${badgeColor}`}>
                    <BadgeIcon className="w-4.5 h-4.5" />
                  </div>
                ) : (
                  <span className="font-mono font-bold text-slate-400 text-sm">#{rank}</span>
                )}
              </div>

              {/* Citizen Name & Address */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className={`text-sm font-bold truncate ${isMe ? 'text-emerald-950' : 'text-slate-800'}`}>
                    {citizen.name}
                  </h4>
                  {isMe && (
                    <span className="text-[9px] font-bold bg-emerald-100 border border-emerald-200 text-emerald-900 px-2 py-0.5 rounded-full uppercase shrink-0">
                      Anda
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Warga RT 005</p>
              </div>

              {/* Values */}
              <div className="text-right shrink-0">
                {sortBy === 'points' ? (
                  <div className="space-y-0.5">
                    <span className="font-mono font-black text-sm text-amber-600 block">
                      {citizen.points.toLocaleString()} PTS
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                      {citizen.totalWasteKg} kg sampah
                    </span>
                  </div>
                ) : (
                  <div className="space-y-0.5">
                    <span className="font-mono font-black text-sm text-emerald-600 block">
                      {citizen.totalWasteKg} KG
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                      {citizen.points} pts
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* User Current Rank Summary Card */}
      {activeUser && (
        <div className="bg-emerald-50/50 border border-emerald-100 p-4 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white border border-emerald-100 rounded-xl shadow-xs text-emerald-700">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] text-emerald-900 font-bold uppercase tracking-wider">Peringkat Anda Saat Ini</p>
              <h4 className="font-extrabold text-emerald-950 text-sm">
                Rank #{activeUserRank} dari {citizens.length} Warga RT 005
              </h4>
            </div>
          </div>
          <div className="text-right">
            <div className="inline-flex items-center gap-1.5 bg-white border border-emerald-200 px-3 py-1.5 rounded-xl shadow-xs">
              <ArrowUp className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-xs font-bold text-emerald-900 font-mono">
                {sortBy === 'points' ? `${activeUser.points} PTS` : `${activeUser.totalWasteKg} KG`}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
