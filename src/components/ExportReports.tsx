import { useState } from 'react';
import { motion } from 'motion/react';
import { Download, FileSpreadsheet, FileText, Check, Printer, AlertCircle, Info, Calendar } from 'lucide-react';
import { WasteDeposit, Citizen, RewardRedemption } from '../types';

interface ExportReportsProps {
  deposits: WasteDeposit[];
  citizens: Citizen[];
  redemptions: RewardRedemption[];
}

export default function ExportReports({ deposits, citizens, redemptions }: ExportReportsProps) {
  const [exportSuccess, setExportSuccess] = useState<string | null>(null);

  // Helper to trigger a download of CSV (Excel)
  const downloadCSV = (content: string, fileName: string) => {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setExportSuccess(fileName);
    setTimeout(() => setExportSuccess(null), 3000);
  };

  // 1. Export Waste Deposits log
  const handleExportDepositsExcel = () => {
    let csvContent = '\uFEFF'; // UTF-8 BOM
    csvContent += 'ID Setoran,Tanggal,Nama Warga,Kategori Sampah,Berat (kg),Poin Diperoleh,Status\n';

    deposits.forEach(dep => {
      const row = [
        dep.id,
        dep.date,
        `"${dep.citizenName}"`,
        `"${dep.type.toUpperCase().replace('_', ' ')}"`,
        dep.weight,
        dep.pointsEarned,
        dep.status.toUpperCase()
      ].join(',');
      csvContent += row + '\n';
    });

    downloadCSV(csvContent, 'Laporan_Setoran_Sampah_RT005_RW013.csv');
  };

  // 2. Export Citizens Stats
  const handleExportCitizensExcel = () => {
    let csvContent = '\uFEFF'; // UTF-8 BOM
    csvContent += 'ID Warga,Nama Warga,Poin Aktif,Total Sampah Disetor (kg),Tanggal Gabung\n';

    citizens.forEach(cit => {
      const row = [
        cit.id,
        `"${cit.name}"`,
        cit.points,
        cit.totalWasteKg,
        cit.joinedDate
      ].join(',');
      csvContent += row + '\n';
    });

    downloadCSV(csvContent, 'Rekap_Poin_Warga_RT005_RW013.csv');
  };

  // 3. Export Redemptions Excel
  const handleExportRedemptionsExcel = () => {
    let csvContent = '\uFEFF'; // UTF-8 BOM
    csvContent += 'ID Transaksi,Tanggal,Nama Warga,Barang Hadiah,Poin Ditukarkan,Status\n';

    redemptions.forEach(red => {
      const row = [
        red.id,
        red.date,
        `"${red.citizenName}"`,
        `"${red.rewardName}"`,
        red.pointsDeducted,
        red.status.toUpperCase()
      ].join(',');
      csvContent += row + '\n';
    });

    downloadCSV(csvContent, 'Laporan_Penukaran_Hadiah_RT005_RW013.csv');
  };

  // Helper to open standard print preview for PDF saving
  const handlePrintPDF = () => {
    window.print();
  };

  return (
    <div className="space-y-6" id="export-reports-section">
      {/* Intro */}
      <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-xs space-y-4">
        <div className="flex items-center gap-3 text-emerald-600">
          <div className="p-2.5 bg-emerald-50 rounded-xl">
            <Download className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-gray-800 text-base">Ekspor Laporan & Rekapitulasi</h3>
            <p className="text-gray-400 text-xs">RT 005 RW 013, Taman Buaran Indah IV</p>
          </div>
        </div>
        <p className="text-xs text-gray-500 leading-relaxed">
          Gunakan modul ekspor untuk mengunduh laporan aktivitas pilah sampah dalam format Microsoft Excel (.csv) yang kompatibel atau mencetak ringkasan komprehensif bulanan sebagai file PDF melalui menu cetak bawaan sistem browser.
        </p>
      </div>

      {/* Excel Exporters Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Deposits Log */}
        <div className="bg-white border border-gray-100 p-5 rounded-2xl flex flex-col justify-between shadow-xs">
          <div className="space-y-2">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg w-max">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-gray-800 text-xs">Laporan Setoran Sampah</h4>
            <p className="text-[11px] text-gray-400 leading-relaxed">
              Daftar seluruh transaksi setoran sampah warga lengkap dengan tanggal, kategori, berat, dan perolehan poin.
            </p>
          </div>
          <button
            onClick={handleExportDepositsExcel}
            className="mt-4 w-full py-2 px-3 bg-emerald-600 text-white rounded-xl text-xs font-semibold hover:bg-emerald-700 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" /> Ekspor Excel
          </button>
        </div>

        {/* Card 2: Citizens Summary */}
        <div className="bg-white border border-gray-100 p-5 rounded-2xl flex flex-col justify-between shadow-xs">
          <div className="space-y-2">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg w-max">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-gray-800 text-xs">Rekap Poin & Kontribusi</h4>
            <p className="text-[11px] text-gray-400 leading-relaxed">
              Data akumulasi total berat sampah yang didaur ulang dan saldo poin masing-masing warga RT 005.
            </p>
          </div>
          <button
            onClick={handleExportCitizensExcel}
            className="mt-4 w-full py-2 px-3 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-700 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" /> Ekspor Excel
          </button>
        </div>

        {/* Card 3: Redemptions Log */}
        <div className="bg-white border border-gray-100 p-5 rounded-2xl flex flex-col justify-between shadow-xs">
          <div className="space-y-2">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg w-max">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-gray-800 text-xs">Laporan Penukaran Hadiah</h4>
            <p className="text-[11px] text-gray-400 leading-relaxed">
              Catatan distribusi reward poin, status pengambilan barang belanjaan, dan pemakaian poin warga.
            </p>
          </div>
          <button
            onClick={handleExportRedemptionsExcel}
            className="mt-4 w-full py-2 px-3 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-700 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" /> Ekspor Excel
          </button>
        </div>
      </div>

      {/* PDF Export Section */}
      <div className="bg-gradient-to-r from-teal-50 to-emerald-50 border border-teal-100 p-6 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <h4 className="font-bold text-teal-900 text-xs flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-teal-700" /> Cetak Ringkasan Bulanan (Format PDF)
          </h4>
          <p className="text-[11px] text-teal-800 leading-relaxed max-w-xl">
            Sistem menyediakan template cetak resmi yang diformat khusus untuk kebutuhan administrasi kelurahan. Tombol di bawah akan membuka jendela cetak sistem. Anda dapat memilih opsi <strong>"Save as PDF"</strong> pada komputer atau ponsel Anda.
          </p>
        </div>
        <button
          onClick={handlePrintPDF}
          className="py-2.5 px-4 bg-teal-700 text-white rounded-xl text-xs font-bold hover:bg-teal-800 transition-all flex items-center gap-1.5 shrink-0 shadow-sm cursor-pointer"
        >
          <Printer className="w-4 h-4" /> Cetak / Unduh PDF
        </button>
      </div>

      {/* Success alert */}
      {exportSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3.5 rounded-xl flex items-center gap-2.5 text-xs">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Berhasil mengunduh berkas laporan: <strong>{exportSuccess}</strong></span>
        </div>
      )}

      {/* Educational Note about printing */}
      <div className="bg-gray-50 border border-gray-200 p-4 rounded-xl flex gap-3 items-start">
        <Info className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <h5 className="font-bold text-gray-700 text-[10px] uppercase">Petunjuk Cetak PDF yang Rapi</h5>
          <p className="text-[11px] text-gray-500 leading-relaxed">
            Saat dialog cetak muncul, centang opsi <strong>"Background graphics"</strong> agar warna tema dan grafik dari program pilah sampah RT 005 ikut tercetak dengan sempurna.
          </p>
        </div>
      </div>
    </div>
  );
}
