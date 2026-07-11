import { motion } from 'motion/react';
import { Leaf, RefreshCw, Trash2, ShieldAlert, Award, FileText, BarChart3, AlertCircle } from 'lucide-react';
import { WASTE_CATEGORIES } from '../data';

export default function GuideSection() {
  const infographicsStats = [
    { label: 'Organik', percentage: 60, color: 'bg-emerald-500', text: '60%' },
    { label: 'Plastik', percentage: 14, color: 'bg-blue-500', text: '14%' },
    { label: 'Kertas', percentage: 9, color: 'bg-amber-500', text: '9%' },
    { label: 'Karet', percentage: 5.5, color: 'bg-teal-500', text: '5.5%' },
    { label: 'Logam', percentage: 4.3, color: 'bg-purple-500', text: '4.3%' },
    { label: 'Kain', percentage: 3.5, color: 'bg-indigo-500', text: '3.5%' },
    { label: 'Kaca', percentage: 1.7, color: 'bg-pink-500', text: '1.7%' },
    { label: 'Lainnya', percentage: 2.4, color: 'bg-gray-400', text: '2.4%' },
  ];

  const categoriesDetail = [
    {
      title: 'Sampah Organik',
      desc: 'Bisa terurai secara alami.',
      examples: 'Sisa makanan, kulit buah, daun, sisa sayuran.',
      action: 'Diolah menjadi kompos atau pupuk organik cair yang subur.',
      icon: Leaf,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50 border-emerald-200'
    },
    {
      title: 'Sampah Anorganik',
      desc: 'Bahan non-alami dan sulit terurai.',
      examples: 'Plastik, kertas, botol kaca, kardus, kaleng logam.',
      action: 'Didaur ulang menjadi produk baru, kerajinan, atau aspal plastik.',
      icon: RefreshCw,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 border-blue-200'
    },
    {
      title: 'Sampah B3',
      desc: 'Bahan Berbahaya dan Beracun.',
      examples: 'Baterai bekas, limbah elektronik, botol aerosol, lampu neon.',
      action: 'Memerlukan pengelolaan khusus di bawah pengawasan agar aman.',
      icon: ShieldAlert,
      color: 'text-red-600',
      bgColor: 'bg-red-50 border-red-200'
    },
    {
      title: 'Sampah Residu',
      desc: 'Tidak bisa didaur ulang atau dipakai kembali.',
      examples: 'Tisu bekas, popok bayi, pembalut, kemasan berlaminasi.',
      action: 'Dijadikan bahan bakar alternatif (RDF) atau ditangani khusus.',
      icon: Trash2,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50 border-gray-200'
    },
  ];

  return (
    <div className="space-y-8" id="guide-section">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-6 rounded-2xl shadow-sm relative overflow-hidden">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/30 backdrop-blur-md rounded-full text-xs font-semibold tracking-wider uppercase mb-3">
            <Award className="w-3.5 h-3.5" /> Edukasi Pilah Sampah
          </div>
          <h2 className="text-2xl font-bold tracking-tight mb-2">Pilah Sampah Jadi Berkah!</h2>
          <p className="text-emerald-50/90 text-sm max-w-xl leading-relaxed">
            Kurang dari 50% rumah tangga di Indonesia memilah sampah mereka. Padahal, pemilahan dari rumah dapat menciptakan ekonomi sirkular yang memberikan keuntungan nyata bagi warga dan lingkungan kita.
          </p>
        </div>
        <div className="absolute right-0 bottom-0 translate-y-4 translate-x-4 opacity-10 pointer-events-none">
          <Leaf className="w-48 h-48" />
        </div>
      </div>

      {/* Composition Infographic representation */}
      <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-xs">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-5 h-5 text-emerald-600" />
          <h3 className="font-semibold text-gray-800 text-base">Komposisi Sampah di Indonesia</h3>
        </div>
        <p className="text-xs text-gray-500 mb-5 leading-relaxed">
          Berdasarkan data Kementerian Lingkungan Hidup dan Kehutanan (KLHK), mayoritas sampah rumah tangga didominasi oleh sampah organik yang sebenarnya sangat mudah diolah jika tidak tercampur dengan sampah jenis lain.
        </p>

        {/* Bar breakdown */}
        <div className="space-y-4">
          <div className="h-5 flex rounded-full overflow-hidden bg-gray-100 shadow-inner">
            {infographicsStats.map((stat, idx) => (
              <div
                key={idx}
                style={{ width: `${stat.percentage}%` }}
                className={`${stat.color} transition-all duration-500 hover:opacity-90 relative group`}
                title={`${stat.label}: ${stat.percentage}%`}
              />
            ))}
          </div>

          {/* Grid Labels */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            {infographicsStats.map((stat, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs">
                <span className={`w-3 h-3 rounded-full ${stat.color} shrink-0`} />
                <span className="font-medium text-gray-600">{stat.label}</span>
                <span className="text-gray-400 ml-auto font-mono">{stat.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Jakarta Urgent Warning Block */}
      <div className="bg-amber-50 border border-amber-200 p-5 rounded-2xl flex gap-3.5 items-start">
        <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="font-semibold text-amber-900 text-sm">Darurat Sampah DKI Jakarta (April 2026)</h4>
          <p className="text-xs text-amber-800 leading-relaxed">
            DKI Jakarta memproduksi sekitar <strong>8.688 ton</strong> sampah harian. Sejumlah <strong>7.734 ton</strong> di antaranya menumpuk di TPST Bantargebang dan hanya <strong>954 ton</strong> yang didaur ulang. Gubernur menyerukan aksi nyata pilah sampah mandiri demi mengurangi beban kritis pembuangan akhir.
          </p>
        </div>
      </div>

      {/* Core Sorting Guide Cards */}
      <div className="space-y-4">
        <h3 className="font-semibold text-gray-800 text-base flex items-center gap-2">
          <FileText className="w-5 h-5 text-emerald-600" /> Kategori Sampah Rumah Tangga
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {categoriesDetail.map((cat, idx) => {
            const IconComp = cat.icon;
            return (
              <motion.div
                key={idx}
                whileHover={{ y: -2 }}
                transition={{ duration: 0.15 }}
                className={`p-5 rounded-2xl border ${cat.bgColor} flex flex-col justify-between`}
              >
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`p-2.5 rounded-xl bg-white shadow-xs ${cat.color}`}>
                      <IconComp className="w-5 h-5" />
                    </div>
                    <h4 className="font-bold text-gray-800 text-sm">{cat.title}</h4>
                  </div>
                  <p className="text-xs text-gray-600 mb-2 leading-relaxed">
                    <span className="font-semibold">Deskripsi:</span> {cat.desc}
                  </p>
                  <p className="text-xs text-gray-500 mb-3 italic">
                    <span className="font-semibold text-gray-600 not-italic">Contoh:</span> {cat.examples}
                  </p>
                </div>
                <div className="pt-3 border-t border-dashed border-gray-200 mt-auto text-xs">
                  <span className="font-bold text-gray-700">Langkah Pengolahan:</span>
                  <p className="text-gray-600 mt-1">{cat.action}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
