import { useState } from 'react';
import { motion } from 'motion/react';
import { Shield, Lock, Unlock, Key, KeyRound, Eye, EyeOff, Server, HelpCircle, CheckCircle } from 'lucide-react';
import { encryptField, decryptField } from '../data';

export default function SecurityInspector() {
  const [inputText, setInputText] = useState('0812-3456-7890 (Nomor Telepon Warga)');
  const [secretKey, setSecretKey] = useState('RT005_SECRET_KEY');
  const [showExplanation, setShowExplanation] = useState(false);

  // Compute live encryption
  const encryptedText = encryptField(inputText, secretKey);
  const decryptedText = decryptField(encryptedText, secretKey);

  const securityFeatures = [
    {
      title: 'Enkripsi Simetris AES-256',
      desc: 'Semua informasi kontak telepon dan alamat rumah warga disandikan secara aman sebelum disimpan di database cloud.',
      status: 'Aktif'
    },
    {
      title: 'Hashing Kata Sandi PBKDF2',
      desc: 'Credential login diproteksi menggunakan standard industri searah dengan garam (salting) acak mencegah serangan kamus.',
      status: 'Aktif'
    },
    {
      title: 'Saluran Aman TLS/HTTPS',
      desc: 'Semua data transit antara aplikasi mobile warga dan server terenkripsi penuh menggunakan sertifikasi SSL terbaru.',
      status: 'Aktif'
    },
    {
      title: 'Kepatuhan Regulasi PDP',
      desc: 'Memenuhi prinsip Perlindungan Data Pribadi (UU PDP No 27/2022) dengan mengaburkan data sensitif warga di tampilan non-admin.',
      status: 'Sesuai'
    }
  ];

  return (
    <div className="space-y-6" id="security-inspector-section">
      {/* Intro Header */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white p-6 rounded-2xl shadow-sm border border-slate-800">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-gray-100 text-base">Sistem Enkripsi & Privasi Warga</h3>
            <p className="text-slate-400 text-xs">RT 005 RW 013, Taman Buaran Indah IV</p>
          </div>
        </div>
        <p className="text-slate-300 text-xs leading-relaxed">
          Kami memprioritaskan keamanan informasi warga. Alamat rumah dan nomor telepon dienkripsi langsung di tingkat penyimpanan menggunakan algoritma enkripsi simetris yang kuat untuk mencegah kebocoran data pribadi.
        </p>
      </div>

      {/* Interactive Sandbox */}
      <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-gray-800 text-sm flex items-center gap-2">
            <KeyRound className="w-4.5 h-4.5 text-indigo-600" /> Demo Enkripsi Real-Time
          </h4>
          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100 uppercase tracking-wide">
            AES-256 Simulator
          </span>
        </div>

        <p className="text-xs text-gray-500 leading-relaxed">
          Coba ketikkan data sensitif (misalnya nomor telepon atau alamat rumah) di bawah untuk melihat bagaimana sistem menyandikan data tersebut secara real-time sebelum dikirimkan ke cloud.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Inputs */}
          <div className="space-y-3">
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Data Sensitif (Plaintext)</label>
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Masukkan nomor telepon atau alamat..."
                className="w-full text-xs p-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium text-gray-700"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Kunci Keamanan Sektoral</label>
              <div className="relative">
                <input
                  type="text"
                  value={secretKey}
                  onChange={(e) => setSecretKey(e.target.value)}
                  placeholder="Kunci Enkripsi"
                  className="w-full text-xs p-3 pl-8 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono text-gray-600"
                />
                <Key className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-3.5" />
              </div>
            </div>
          </div>

          {/* Cipher Results */}
          <div className="bg-slate-900 text-slate-100 p-4 rounded-xl font-mono text-xs flex flex-col justify-between border border-slate-800">
            <div>
              <div className="flex justify-between items-center pb-2 border-b border-slate-800/80 mb-3">
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
                  <Lock className="w-3 h-3 text-red-400" /> Database Ciphertext
                </span>
                <span className="text-[9px] text-emerald-400 font-semibold uppercase">Terenkripsi</span>
              </div>
              <p className="text-amber-400 break-all bg-slate-950/80 p-2.5 rounded-lg border border-slate-950 text-[11px] leading-relaxed max-h-24 overflow-y-auto">
                {encryptedText || '[KOSONG]'}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/80">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
                  <Unlock className="w-3 h-3 text-emerald-400" /> Hasil Dekripsi Server
                </span>
                <span className="text-[9px] text-blue-400 font-semibold uppercase">Decrypted</span>
              </div>
              <p className="text-emerald-400 text-xs font-semibold">{decryptedText || '[KOSONG]'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Security Architecture Cards */}
      <div className="space-y-3">
        <h4 className="font-semibold text-gray-800 text-sm flex items-center gap-1.5">
          <Server className="w-4.5 h-4.5 text-slate-700" /> Protokol Keamanan & Regulasi Privasi
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {securityFeatures.map((feat, idx) => (
            <div key={idx} className="bg-gray-50 border border-gray-100 p-4 rounded-xl flex items-start gap-3">
              <div className="p-1.5 bg-white rounded-lg border border-gray-200 shrink-0 text-emerald-600 mt-0.5">
                <CheckCircle className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h5 className="font-bold text-gray-800 text-xs">{feat.title}</h5>
                  <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 bg-emerald-50 text-emerald-700 rounded-sm">
                    {feat.status}
                  </span>
                </div>
                <p className="text-[11px] text-gray-500 mt-1 leading-relaxed">{feat.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
