import { useState, FormEvent } from 'react';
import { motion } from 'motion/react';
import { Leaf, User, Shield, Key, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { Citizen } from '../types';

interface LoginScreenProps {
  citizens: Citizen[];
  onLogin: (role: 'warga' | 'admin', citizenId?: string, adminRole?: string) => void;
}

export default function LoginScreen({ citizens, onLogin }: LoginScreenProps) {
  const [activeTab, setActiveTab] = useState<'warga' | 'admin'>('warga');
  const [selectedCitizenId, setSelectedCitizenId] = useState<string>('C001');
  const [citizenPassword, setCitizenPassword] = useState<string>('123456');
  
  const [adminUsername, setAdminUsername] = useState<string>('ketua');
  const [adminPassword, setAdminPassword] = useState<string>('123456');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleWargaLogin = (e: FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!citizenPassword) {
      setError('PIN keamanan wajib diisi');
      return;
    }

    if (citizenPassword !== '123456') {
      setError('PIN keamanan salah. PIN default adalah 123456');
      return;
    }
    
    const citizen = citizens.find(c => c.id === selectedCitizenId);
    if (!citizen) {
      setError('Citizen tidak ditemukan');
      return;
    }

    onLogin('warga', selectedCitizenId);
  };

  const handleAdminLogin = (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!adminUsername || !adminPassword) {
      setError('Username dan Password wajib diisi');
      return;
    }

    const lowerUser = adminUsername.toLowerCase().trim();
    const cleanPass = adminPassword.trim();

    const allowedAdmins = ['admin', 'ketua', 'sekretaris', 'bendahara'];
    const isAllowedUser = allowedAdmins.includes(lowerUser);
    const isCorrectPassword = ['admin', '005', '123456'].includes(cleanPass);

    if (isAllowedUser && isCorrectPassword) {
      let roleLabel = 'Admin RT 005';
      if (lowerUser === 'ketua') {
        roleLabel = 'Ketua RT 005';
      } else if (lowerUser === 'sekretaris') {
        roleLabel = 'Sekretaris RT 005';
      } else if (lowerUser === 'bendahara') {
        roleLabel = 'Bendahara RT 005';
      }
      onLogin('admin', undefined, roleLabel);
    } else {
      setError('Username atau Password Admin salah. Gunakan username "ketua", "sekretaris", atau "bendahara" dengan password default "123456".');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans antialiased" id="login-screen">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        {/* Logo and Branding */}
        <div className="inline-flex items-center justify-center w-12 h-12 bg-emerald-600 rounded-2xl text-white shadow-md mx-auto mb-2">
          <Leaf className="w-6 h-6 animate-pulse" />
        </div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase">
          ePil5am
        </h2>
        <p className="text-xs text-slate-500 font-bold uppercase tracking-widest leading-none">
          RT 005 RW 013 • Taman Buaran Indah IV
        </p>
        <p className="text-xs text-slate-400 max-w-xs mx-auto">
          Sistem Informasi, Manajemen Pengumpulan, & Distribusi Poin Bank Sampah Mandiri
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 border border-slate-200 shadow-sm rounded-3xl sm:px-10 space-y-6">
          
          {/* Tab Selector */}
          <div className="flex bg-slate-100 border border-slate-200 p-1 rounded-2xl">
            <button
              onClick={() => {
                setActiveTab('warga');
                setError('');
              }}
              className={`flex-1 py-3 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === 'warga'
                  ? 'bg-white text-emerald-900 border border-slate-200/60 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <User className="w-4 h-4" /> Masuk sebagai Warga
            </button>
            <button
              onClick={() => {
                setActiveTab('admin');
                setError('');
              }}
              className={`flex-1 py-3 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === 'admin'
                  ? 'bg-slate-900 text-white border border-slate-950 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Shield className="w-4 h-4" /> Admin RT
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3.5 bg-red-50 border border-red-200 text-red-900 rounded-xl text-xs font-bold flex items-center gap-2"
            >
              <div className="w-1.5 h-1.5 bg-red-600 rounded-full shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          {/* Forms switcher */}
          {activeTab === 'warga' ? (
            <form onSubmit={handleWargaLogin} className="space-y-5">
              {/* Profile/Citizen Selection Grid */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                  Pilih Akun Keluarga Warga
                </label>
                <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                  {citizens.map((citizen) => {
                    const isSelected = selectedCitizenId === citizen.id;
                    return (
                      <button
                        key={citizen.id}
                        type="button"
                        onClick={() => setSelectedCitizenId(citizen.id)}
                        className={`p-3 rounded-xl border text-left transition-all relative flex flex-col justify-between h-20 cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-950 ring-2 ring-emerald-500/10'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex justify-between items-start w-full">
                          <span className="font-extrabold text-xs truncate max-w-[80%]">
                            {citizen.name}
                          </span>
                          {isSelected && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          )}
                        </div>
                        <div className="flex justify-between items-baseline w-full">
                          <span className="text-[9px] font-mono font-bold text-slate-400">
                            {citizen.id}
                          </span>
                          <span className="text-[10px] font-mono font-extrabold text-amber-600">
                            {citizen.points} PTS
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Pin/Password */}
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">
                  PIN Keamanan Warga (PIN Default: 123456)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3.5 text-slate-400">
                    <Key className="w-4 h-4" />
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={citizenPassword}
                    onChange={(e) => setCitizenPassword(e.target.value)}
                    placeholder="Masukkan PIN"
                    maxLength={6}
                    required
                    className="w-full text-xs pl-10 pr-10 py-3 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-extrabold tracking-widest text-slate-800"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
              >
                Masuk ke Portal Warga
              </button>
            </form>
          ) : (
            <form onSubmit={handleAdminLogin} className="space-y-5">
              {/* Username */}
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">
                  Username Pengelola RT
                </label>
                <input
                  type="text"
                  value={adminUsername}
                  onChange={(e) => setAdminUsername(e.target.value)}
                  placeholder="Masukkan Username"
                  required
                  className="w-full text-xs p-3 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-500/20 focus:border-slate-500 font-bold text-slate-800"
                />
              </div>

              {/* Password */}
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">
                  Kata Sandi Admin RT
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3.5 text-slate-400">
                    <Key className="w-4 h-4" />
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="Masukkan Password"
                    required
                    className="w-full text-xs pl-10 pr-10 py-3 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-500/20 focus:border-slate-500 font-semibold text-slate-800"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200/60 rounded-xl text-[10px] text-slate-500 space-y-2">
                <p className="font-bold uppercase tracking-wider text-slate-700">Akun Pengelola RT 005:</p>
                <div className="space-y-1 font-medium">
                  <p>• <strong className="text-slate-800">Ketua RT:</strong> username <span className="font-mono font-extrabold text-slate-900 bg-slate-100 px-1 rounded">ketua</span></p>
                  <p>• <strong className="text-slate-800">Sekretaris:</strong> username <span className="font-mono font-extrabold text-slate-900 bg-slate-100 px-1 rounded">sekretaris</span></p>
                  <p>• <strong className="text-slate-800">Bendahara:</strong> username <span className="font-mono font-extrabold text-slate-900 bg-slate-100 px-1 rounded">bendahara</span></p>
                </div>
                <p className="pt-1 border-t border-slate-200/60 text-[9px]">Kata Sandi Default: <strong className="font-mono text-slate-800 font-extrabold">123456</strong></p>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
              >
                Masuk ke Konsol Admin
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}
