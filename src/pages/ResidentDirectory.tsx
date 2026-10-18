import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Users,
  Search,
  Plus,
  RotateCcw,
  ArrowLeft,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Eye,
  Edit2,
  Trash2,
  MapPin,
  Phone,
  Calendar,
  Building2,
  Filter,
  X,
  Droplets,
  ShieldCheck,
  AlertTriangle,
  UserCheck
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { UserNav } from '@/components/UserNav';
import { useResidents } from '@/hooks/useResidents';
import { Resident, RTUnit, RT_LIST } from '@/data/initialResidents';

type SortField = 'name' | 'rt' | 'address' | 'joinDate';
type SortOrder = 'asc' | 'desc';

interface ResidentFormData {
  name: string;
  nik: string;
  rt: RTUnit | string;
  address: string;
  phone: string;
  joinDate: string;
}

const INITIAL_FORM: ResidentFormData = {
  name: '',
  nik: '',
  rt: 'RT 01',
  address: '',
  phone: '',
  joinDate: new Date().toISOString().split('T')[0],
};

export default function ResidentDirectory() {
  const { residents, isLoaded, addResident, updateResident, deleteResident, resetResidents } = useResidents();

  // Search and Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRt, setSelectedRt] = useState<string>('all');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Active Resident for View/Edit/Delete
  const [activeResident, setActiveResident] = useState<Resident | null>(null);
  const [formData, setFormData] = useState<ResidentFormData>(INITIAL_FORM);

  // Sorting handler
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // Filtered residents list
  const filteredResidents = useMemo(() => {
    return residents.filter((resident) => {
      // RT filter
      if (selectedRt !== 'all' && resident.rt !== selectedRt) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = resident.name?.toLowerCase().includes(q);
        const matchNik = resident.nik?.toLowerCase().includes(q);
        const matchAddress = resident.address?.toLowerCase().includes(q);
        const matchPhone = resident.phone?.toLowerCase().includes(q);
        return matchName || matchNik || matchAddress || matchPhone;
      }
      return true;
    });
  }, [residents, selectedRt, searchQuery]);

  // Sorted residents list
  const sortedResidents = useMemo(() => {
    return [...filteredResidents].sort((a, b) => {
      const aVal = a[sortField] || '';
      const bVal = b[sortField] || '';

      if (sortField === 'joinDate') {
        const timeA = new Date(aVal).getTime();
        const timeB = new Date(bVal).getTime();
        return sortOrder === 'asc' ? timeA - timeB : timeB - timeA;
      }

      const comparison = aVal.toString().localeCompare(bVal.toString(), 'id', { numeric: true });
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [filteredResidents, sortField, sortOrder]);

  // Form Handlers
  const handleOpenAdd = () => {
    setFormData({
      ...INITIAL_FORM,
      joinDate: new Date().toISOString().split('T')[0],
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (resident: Resident) => {
    setActiveResident(resident);
    setFormData({
      name: resident.name,
      nik: resident.nik,
      rt: resident.rt,
      address: resident.address,
      phone: resident.phone,
      joinDate: resident.joinDate,
    });
    setIsEditModalOpen(true);
  };

  const handleOpenDetail = (resident: Resident) => {
    setActiveResident(resident);
    setIsDetailModalOpen(true);
  };

  const handleOpenDelete = (resident: Resident) => {
    setActiveResident(resident);
    setIsDeleteModalOpen(true);
  };

  const handleSaveAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.nik.trim()) {
      toast.error('Mohon lengkapi nama dan NIK warga.');
      return;
    }

    addResident({
      name: formData.name.trim(),
      nik: formData.nik.trim(),
      rt: formData.rt,
      address: formData.address.trim() || 'Jl. Melati',
      phone: formData.phone.trim() || '-',
      joinDate: formData.joinDate || new Date().toISOString().split('T')[0],
    });

    setIsAddModalOpen(false);
    toast.success(`Warga ${formData.name} berhasil ditambahkan.`);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeResident) return;
    if (!formData.name.trim() || !formData.nik.trim()) {
      toast.error('Mohon lengkapi nama dan NIK warga.');
      return;
    }

    updateResident(activeResident.id, {
      name: formData.name.trim(),
      nik: formData.nik.trim(),
      rt: formData.rt,
      address: formData.address.trim(),
      phone: formData.phone.trim(),
      joinDate: formData.joinDate,
    });

    setIsEditModalOpen(false);
    toast.success(`Data warga ${formData.name} berhasil diperbarui.`);
  };

  const handleConfirmDelete = () => {
    if (!activeResident) return;
    deleteResident(activeResident.id);
    setIsDeleteModalOpen(false);
    toast.info(`Data warga ${activeResident.name} berhasil dihapus.`);
    setActiveResident(null);
  };

  const handleResetDefaults = () => {
    if (window.confirm('Reset direktori warga ke data bawaan (90 warga terdistribusi ke 6 RT)?')) {
      resetResidents();
      toast.info('Direktori warga telah di-reset ke data master bawaan (90 Warga).');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col antialiased selection:bg-indigo-100 selection:text-indigo-900 pb-16">
      {/* Decorative gradient blur */}
      <div className="absolute top-0 right-1/4 w-[450px] h-[350px] bg-indigo-200/30 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 left-0 w-[400px] h-[300px] bg-blue-200/30 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Header */}
      <header className="bg-white/80 backdrop-blur-xl sticky top-0 z-30 border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex flex-wrap gap-4 items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/">
              <Button
                variant="ghost"
                size="sm"
                className="text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl"
              >
                <ArrowLeft className="w-4 h-4 mr-1.5" />
                Portal
              </Button>
            </Link>
            <div className="h-5 w-px bg-slate-200" />
            <div className="flex items-center gap-2.5">
              <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 p-2 rounded-xl text-white shadow-md shadow-indigo-200">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-800 leading-tight">
                  Direktori Warga <span className="text-indigo-600 font-extrabold">RW 05</span>
                </h1>
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Kampung Melati SuperApp &bull; Master Resident Directory
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleResetDefaults}
              className="text-slate-600 border-slate-200 hover:bg-slate-100 rounded-xl flex items-center gap-1.5 text-xs font-semibold"
              title="Kembalikan data ke 90 warga bawaan"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              Reset Defaults
            </Button>

            <Button
              size="sm"
              onClick={handleOpenAdd}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl px-4 py-2 flex items-center gap-1.5 shadow-sm transition-all text-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Warga</span>
            </Button>

            {/* Global User Status & Logout */}
            <UserNav />
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 pt-8 space-y-6 flex-1">
        {/* Metric Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1: Total Warga */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs relative overflow-hidden group hover:border-indigo-300 transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Total Warga RW 05
              </span>
              <div className="p-2.5 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-slate-800 tracking-tight">
              {residents.length}
            </div>
            <div className="mt-3 flex items-center text-xs font-semibold text-indigo-600 gap-1.5">
              <UserCheck className="w-3.5 h-3.5" />
              <span>Terdata di Master Database</span>
            </div>
          </div>

          {/* Card 2: Wilayah RT */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs relative overflow-hidden group hover:border-blue-300 transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Wilayah Rukun Tetangga
              </span>
              <div className="p-2.5 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100">
                <Building2 className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-slate-800 tracking-tight">
              6 RT
            </div>
            <div className="mt-3 flex items-center text-xs font-semibold text-slate-500 gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-blue-500" />
              <span>RT 01 s/d RT 06 Terdaftar</span>
            </div>
          </div>

          {/* Card 3: Warga Ditampilkan */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs relative overflow-hidden group hover:border-emerald-300 transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Warga Ditampilkan
              </span>
              <div className="p-2.5 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100">
                <Filter className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-slate-800 tracking-tight">
              {sortedResidents.length}
            </div>
            <div className="mt-3 flex items-center text-xs font-semibold text-emerald-600 gap-1.5">
              <span>
                {selectedRt === 'all'
                  ? 'Semua wilayah RT'
                  : `Filter Wilayah: ${selectedRt}`}
              </span>
            </div>
          </div>

          {/* Card 4: Sinkronisasi Air Bersih */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs relative overflow-hidden group hover:border-cyan-300 transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Sinkronisasi Air Bersih
              </span>
              <div className="p-2.5 rounded-2xl bg-cyan-50 text-cyan-600 border border-cyan-100">
                <Droplets className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-slate-800 tracking-tight">
              100%
            </div>
            <div className="mt-3 flex items-center text-xs font-semibold text-cyan-600 gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Terkoneksi Sistem KSM</span>
            </div>
          </div>
        </section>

        {/* Search & Filter Toolbar */}
        <section className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            {/* Search Input */}
            <div className="relative w-full md:w-96">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Cari berdasarkan nama, NIK, alamat, atau HP..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Total Results Label */}
            <div className="text-xs font-semibold text-slate-500">
              Menampilkan <span className="font-bold text-slate-800">{sortedResidents.length}</span> dari{' '}
              <span className="font-bold text-slate-800">{residents.length}</span> warga
            </div>
          </div>

          {/* RT Filter Chips */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-2">
              Wilayah RT:
            </span>
            <button
              onClick={() => setSelectedRt('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedRt === 'all'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
              }`}
            >
              Semua RT ({residents.length})
            </button>
            {RT_LIST.map((rt) => {
              const count = residents.filter((r) => r.rt === rt).length;
              const isSelected = selectedRt === rt;
              return (
                <button
                  key={rt}
                  onClick={() => setSelectedRt(rt)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
                  }`}
                >
                  {rt} ({count})
                </button>
              );
            })}
          </div>
        </section>

        {/* Residents Table */}
        <section className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-400 text-xs font-bold uppercase tracking-wider">
                  <th
                    onClick={() => handleSort('name')}
                    className="py-3.5 px-5 cursor-pointer hover:text-slate-700 transition-colors select-none"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Nama Lengkap</span>
                      {sortField === 'name' ? (
                        sortOrder === 'asc' ? <ArrowUp className="w-3.5 h-3.5 text-indigo-600" /> : <ArrowDown className="w-3.5 h-3.5 text-indigo-600" />
                      ) : (
                        <ArrowUpDown className="w-3 h-3 text-slate-300" />
                      )}
                    </div>
                  </th>
                  <th className="py-3.5 px-4">NIK</th>
                  <th
                    onClick={() => handleSort('rt')}
                    className="py-3.5 px-4 cursor-pointer hover:text-slate-700 transition-colors select-none"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Wilayah RT</span>
                      {sortField === 'rt' ? (
                        sortOrder === 'asc' ? <ArrowUp className="w-3.5 h-3.5 text-indigo-600" /> : <ArrowDown className="w-3.5 h-3.5 text-indigo-600" />
                      ) : (
                        <ArrowUpDown className="w-3 h-3 text-slate-300" />
                      )}
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort('address')}
                    className="py-3.5 px-4 cursor-pointer hover:text-slate-700 transition-colors select-none"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Alamat Rumah</span>
                      {sortField === 'address' ? (
                        sortOrder === 'asc' ? <ArrowUp className="w-3.5 h-3.5 text-indigo-600" /> : <ArrowDown className="w-3.5 h-3.5 text-indigo-600" />
                      ) : (
                        <ArrowUpDown className="w-3 h-3 text-slate-300" />
                      )}
                    </div>
                  </th>
                  <th className="py-3.5 px-4">No. HP</th>
                  <th
                    onClick={() => handleSort('joinDate')}
                    className="py-3.5 px-4 cursor-pointer hover:text-slate-700 transition-colors select-none"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Tgl Terdaftar</span>
                      {sortField === 'joinDate' ? (
                        sortOrder === 'asc' ? <ArrowUp className="w-3.5 h-3.5 text-indigo-600" /> : <ArrowDown className="w-3.5 h-3.5 text-indigo-600" />
                      ) : (
                        <ArrowUpDown className="w-3 h-3 text-slate-300" />
                      )}
                    </div>
                  </th>
                  <th className="py-3.5 px-5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sortedResidents.length > 0 ? (
                  sortedResidents.map((resident) => (
                    <tr
                      key={resident.id}
                      className="hover:bg-slate-50/80 transition-colors group"
                    >
                      <td className="py-3.5 px-5 font-bold text-slate-800">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-extrabold flex items-center justify-center text-xs shrink-0">
                            {resident.name.charAt(0)}
                          </div>
                          <div>
                            <span className="block leading-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
                              {resident.name}
                            </span>
                            <span className="text-[11px] font-medium text-slate-400">
                              ID: {resident.id}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-xs text-slate-600">
                        {resident.nik}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-blue-50 text-blue-700 border border-blue-200/60">
                          {resident.rt}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 font-medium">
                        {resident.address}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-xs text-slate-600">
                        {resident.phone}
                      </td>
                      <td className="py-3.5 px-4 text-xs text-slate-500 font-medium">
                        {resident.joinDate}
                      </td>
                      <td className="py-3.5 px-5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenDetail(resident)}
                            className="h-8 w-8 p-0 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg"
                            title="Lihat Detail"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenEdit(resident)}
                            className="h-8 w-8 p-0 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg"
                            title="Edit Data"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenDelete(resident)}
                            className="h-8 w-8 p-0 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                            title="Hapus Warga"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400">
                      <Users className="w-8 h-8 mx-auto mb-2 opacity-30" />
                      <p className="text-sm font-semibold">Tidak ada data warga ditemukan</p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Coba sesuaikan kata kunci pencarian atau pilihan filter RT.
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {/* Modal: Tambah Warga */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden"
            >
              <div className="p-6 bg-gradient-to-br from-indigo-600 to-indigo-700 text-white flex justify-between items-center">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-white/10 rounded-xl">
                    <Plus className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-lg">Tambah Warga Baru</h3>
                    <p className="text-indigo-200 text-xs">Pendaftaran warga ke Master Directory RW 05</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="text-white/70 hover:text-white rounded-lg p-1 hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveAdd} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    Nama Lengkap <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Contoh: Bambang Pamungkas"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                      NIK (16 Digit) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.nik}
                      onChange={(e) => setFormData({ ...formData, nik: e.target.value })}
                      placeholder="3171011503800001"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                      Wilayah RT <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={formData.rt}
                      onChange={(e) => setFormData({ ...formData, rt: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    >
                      {RT_LIST.map((rt) => (
                        <option key={rt} value={rt}>
                          {rt}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    Alamat Lengkap Rumah
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Contoh: Jl. Melati Blok A1 No. 01"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                      No. Handphone / WhatsApp
                    </label>
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="081234560001"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                      Tanggal Terdaftar
                    </label>
                    <input
                      type="date"
                      value={formData.joinDate}
                      onChange={(e) => setFormData({ ...formData, joinDate: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setIsAddModalOpen(false)}
                    className="rounded-xl text-slate-600 hover:bg-slate-100"
                  >
                    Batal
                  </Button>
                  <Button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl px-5"
                  >
                    Simpan Warga
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal: Edit Warga */}
      <AnimatePresence>
        {isEditModalOpen && activeResident && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden"
            >
              <div className="p-6 bg-gradient-to-br from-amber-600 to-amber-700 text-white flex justify-between items-center">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-white/10 rounded-xl">
                    <Edit2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-lg">Edit Data Warga</h3>
                    <p className="text-amber-200 text-xs">Perbarui identitas &amp; kontak warga ({activeResident.id})</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="text-white/70 hover:text-white rounded-lg p-1 hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveEdit} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    Nama Lengkap <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                      NIK (16 Digit) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.nik}
                      onChange={(e) => setFormData({ ...formData, nik: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                      Wilayah RT <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={formData.rt}
                      onChange={(e) => setFormData({ ...formData, rt: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                    >
                      {RT_LIST.map((rt) => (
                        <option key={rt} value={rt}>
                          {rt}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    Alamat Rumah
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                      No. Handphone
                    </label>
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                      Tanggal Terdaftar
                    </label>
                    <input
                      type="date"
                      value={formData.joinDate}
                      onChange={(e) => setFormData({ ...formData, joinDate: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setIsEditModalOpen(false)}
                    className="rounded-xl text-slate-600 hover:bg-slate-100"
                  >
                    Batal
                  </Button>
                  <Button
                    type="submit"
                    className="bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl px-5"
                  >
                    Simpan Perubahan
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal: Detail Warga */}
      <AnimatePresence>
        {isDetailModalOpen && activeResident && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden"
            >
              <div className="p-6 bg-gradient-to-br from-indigo-600 to-indigo-800 text-white relative">
                <button
                  onClick={() => setIsDetailModalOpen(false)}
                  className="absolute right-4 top-4 text-white/70 hover:text-white rounded-lg p-1 hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-white/20 text-white font-extrabold flex items-center justify-center text-2xl border border-white/30 shadow-inner">
                    {activeResident.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-lg leading-tight">{activeResident.name}</h3>
                    <p className="text-indigo-200 text-xs font-mono mt-0.5">ID: {activeResident.id}</p>
                    <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-white/20 text-white border border-white/30">
                      {activeResident.rt}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-3">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Nomor Induk Kependudukan (NIK)
                    </span>
                    <span className="text-sm font-mono font-bold text-slate-800">
                      {activeResident.nik}
                    </span>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <MapPin className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Alamat Domisili
                      </span>
                      <span className="text-sm font-semibold text-slate-700">
                        {activeResident.address} ({activeResident.rt})
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <Phone className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Kontak WhatsApp / Telp
                      </span>
                      <span className="text-sm font-mono font-semibold text-slate-700">
                        {activeResident.phone}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <Calendar className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Tanggal Terdaftar di RW
                      </span>
                      <span className="text-sm font-semibold text-slate-700">
                        {activeResident.joinDate}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-cyan-50/70 p-3.5 rounded-2xl border border-cyan-100 flex items-center gap-3">
                  <Droplets className="w-5 h-5 text-cyan-600 shrink-0" />
                  <div className="text-xs">
                    <span className="font-bold text-cyan-900 block">Terintegrasi Sistem Air KSM</span>
                    <span className="text-cyan-700">Profil warga terhubung ke pencatatan meter air bersih.</span>
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsDetailModalOpen(false);
                      handleOpenEdit(activeResident);
                    }}
                    className="rounded-xl text-xs font-bold text-slate-700"
                  >
                    <Edit2 className="w-3.5 h-3.5 mr-1.5" />
                    Edit Profil
                  </Button>
                  <Button
                    onClick={() => setIsDetailModalOpen(false)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold px-4"
                  >
                    Tutup
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal: Konfirmasi Hapus Warga */}
      <AnimatePresence>
        {isDeleteModalOpen && activeResident && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-sm w-full shadow-2xl border border-slate-200 overflow-hidden p-6 text-center space-y-4"
            >
              <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-lg text-slate-800">Hapus Data Warga?</h3>
                <p className="text-slate-500 text-xs mt-1 leading-relaxed">
                  Apakah Anda yakin ingin menghapus warga <span className="font-bold text-slate-800">{activeResident.name}</span> ({activeResident.nik}) dari direktori? Tindakan ini tidak dapat dibatalkan.
                </p>
              </div>

              <div className="pt-2 flex justify-center gap-3">
                <Button
                  variant="ghost"
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="rounded-xl text-slate-600 hover:bg-slate-100 font-semibold text-xs"
                >
                  Batal
                </Button>
                <Button
                  onClick={handleConfirmDelete}
                  className="bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs px-4"
                >
                  Ya, Hapus Warga
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
