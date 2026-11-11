import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Package, 
  MapPin, 
  User, 
  ShieldCheck, 
  ShoppingBag, 
  LogOut, 
  Mail, 
  Phone, 
  Plus, 
  Check, 
  CheckCircle2, 
  Edit3, 
  Trash2, 
  ArrowRight, 
  ExternalLink,
  ChevronRight,
  Eye,
  EyeOff,
  Coffee,
  Sparkles
} from 'lucide-react';

export default function AccountPage({ showToast }) {
  const navigate = useNavigate();

  // Scroll to top on load
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Active Tab state: 'orders' | 'address' | 'profile' | 'password'
  const [activeTab, setActiveTab] = useState('orders');

  // User Profile State (persisted in localStorage)
  const [userProfile, setUserProfile] = useState(() => {
    try {
      const saved = localStorage.getItem('akm_user_profile');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      fullName: 'Winda Sari',
      email: 'windasario266@gmail.com',
      phone: '0812-3456-7890',
      birthDate: '1996-08-17',
      gender: 'Wanita',
      memberTier: 'Pelanggan Setia'
    };
  });

  // Saved Addresses State
  const [addresses, setAddresses] = useState(() => {
    try {
      const saved = localStorage.getItem('akm_user_addresses');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      {
        id: 'addr-1',
        label: 'Rumah',
        recipientName: 'Winda Sari',
        phone: '0812-3456-7890',
        fullAddress: 'Jl. Ijen Boulevard No. 45, Oro-oro Dowo, Kec. Klojen',
        city: 'Kota Malang',
        province: 'Jawa Timur',
        postalCode: '65115',
        isPrimary: true
      }
    ];
  });

  // Password Change Form State
  const [passwords, setPasswords] = useState({
    current: '',
    newPass: '',
    confirmPass: ''
  });
  const [showPassword, setShowPassword] = useState(false);

  // Modal / Form state for Add Address
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [newAddress, setNewAddress] = useState({
    label: 'Rumah',
    recipientName: 'Winda Sari',
    phone: '0812-3456-7890',
    fullAddress: '',
    city: 'Kota Malang',
    province: 'Jawa Timur',
    postalCode: '',
    isPrimary: false
  });

  // Save profile handler
  const handleSaveProfile = (e) => {
    e.preventDefault();
    localStorage.setItem('akm_user_profile', JSON.stringify(userProfile));
    if (showToast) {
      showToast('Profil Anda berhasil diperbarui!');
    } else {
      alert('Profil Anda berhasil diperbarui!');
    }
  };

  // Add Address handler
  const handleAddAddress = (e) => {
    e.preventDefault();
    if (!newAddress.fullAddress) {
      alert('Mohon lengkapi alamat detail');
      return;
    }
    const updated = [...addresses, { ...newAddress, id: `addr-${Date.now()}` }];
    setAddresses(updated);
    localStorage.setItem('akm_user_addresses', JSON.stringify(updated));
    setIsAddressModalOpen(false);
    setNewAddress({
      label: 'Kantor',
      recipientName: userProfile.fullName,
      phone: userProfile.phone,
      fullAddress: '',
      city: 'Kota Malang',
      province: 'Jawa Timur',
      postalCode: '',
      isPrimary: false
    });
    if (showToast) showToast('Alamat baru berhasil ditambahkan');
  };

  // Set Primary Address
  const handleSetPrimaryAddress = (id) => {
    const updated = addresses.map(addr => ({
      ...addr,
      isPrimary: addr.id === id
    }));
    setAddresses(updated);
    localStorage.setItem('akm_user_addresses', JSON.stringify(updated));
    if (showToast) showToast('Alamat utama berhasil diubah');
  };

  // Delete Address
  const handleDeleteAddress = (id) => {
    if (addresses.length === 1) {
      alert('Minimal harus memiliki satu alamat pengiriman.');
      return;
    }
    const updated = addresses.filter(addr => addr.id !== id);
    setAddresses(updated);
    localStorage.setItem('akm_user_addresses', JSON.stringify(updated));
    if (showToast) showToast('Alamat berhasil dihapus');
  };

  // Password update handler
  const handleUpdatePassword = (e) => {
    e.preventDefault();
    if (!passwords.current) {
      alert('Masukkan kata sandi saat ini');
      return;
    }
    if (passwords.newPass.length < 6) {
      alert('Kata sandi baru minimal 6 karakter');
      return;
    }
    if (passwords.newPass !== passwords.confirmPass) {
      alert('Konfirmasi kata sandi tidak cocok!');
      return;
    }
    setPasswords({ current: '', newPass: '', confirmPass: '' });
    if (showToast) {
      showToast('Kata sandi berhasil diperbarui dengan aman!');
    } else {
      alert('Kata sandi berhasil diperbarui dengan aman!');
    }
  };

  // Logout handler
  const handleLogout = () => {
    if (window.confirm('Apakah Anda yakin ingin keluar dari akun?')) {
      if (showToast) showToast('Anda telah keluar dari akun');
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        
        {/* ========================================================================= */}
        {/* TOP PROFILE HEADER BANNER (Persis Screenshot Pengguna dengan Nuansa Navy) */}
        {/* ========================================================================= */}
        <div className="rounded-2xl sm:rounded-3xl bg-[#0e1f36] p-6 sm:p-8 text-white shadow-xl shadow-slate-900/10 mb-8 sm:mb-10 transition-all">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            
            {/* Left Column: Avatar Box + User Greeting & Details */}
            <div className="flex items-center gap-4 sm:gap-5">
              
              {/* Rounded Square Avatar with Letter 'W' in Warm Gold/Amber */}
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center font-bold text-amber-500 text-2xl sm:text-3xl shadow-inner shrink-0 select-none">
                {userProfile.fullName ? userProfile.fullName.charAt(0).toUpperCase() : 'W'}
              </div>

              {/* Greeting, Tier Badge & Email */}
              <div>
                <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-white">
                    Halo, {userProfile.fullName}!
                  </h1>
                  <span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-semibold bg-amber-950/60 text-amber-300 border border-amber-600/40 shadow-2xs">
                    {userProfile.memberTier}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-slate-300 text-xs sm:text-sm mt-1 sm:mt-1.5 font-medium">
                  <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{userProfile.email}</span>
                </div>
              </div>

            </div>

            {/* Right Column: Action Buttons ("Belanja Kopi Lagi" & "Keluar") */}
            <div className="flex items-center gap-3 shrink-0 self-start md:self-center">
              
              {/* Button: Belanja Kopi Lagi */}
              <Link
                to="/kategori"
                className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl bg-[#965c2e] hover:bg-[#824f26] text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer"
                title="Buka katalog kopi dan alat"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Belanja Kopi Lagi</span>
              </Link>

              {/* Button: Keluar */}
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-700/70 text-slate-300 hover:text-white border border-slate-700/70 text-xs sm:text-sm font-semibold transition-all active:scale-95 cursor-pointer"
                title="Keluar dari akun"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Keluar</span>
              </button>

            </div>

          </div>
        </div>

        {/* ========================================================================= */}
        {/* TABS NAVIGATION BAR (Persis Screenshot) */}
        {/* ========================================================================= */}
        <div className="border-b border-slate-200 mb-8 sm:mb-10 overflow-x-auto no-scrollbar">
          <nav className="flex space-x-6 sm:space-x-10 min-w-max">
            
            {/* Tab 1: Riwayat Pesanan */}
            <button
              onClick={() => setActiveTab('orders')}
              className={`pb-3 sm:pb-3.5 text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer relative ${
                activeTab === 'orders'
                  ? 'text-[#965c2e] border-b-2 border-[#965c2e]'
                  : 'text-slate-500 hover:text-slate-900 border-b-2 border-transparent'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Riwayat Pesanan</span>
              {/* Active Indicator Dot / Count */}
              <span className={`w-2 h-2 rounded-full ${activeTab === 'orders' ? 'bg-[#965c2e]' : 'bg-slate-300'}`} />
            </button>

            {/* Tab 2: Alamat Pengiriman */}
            <button
              onClick={() => setActiveTab('address')}
              className={`pb-3 sm:pb-3.5 text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer relative ${
                activeTab === 'address'
                  ? 'text-[#965c2e] border-b-2 border-[#965c2e]'
                  : 'text-slate-500 hover:text-slate-900 border-b-2 border-transparent'
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span>Alamat Pengiriman</span>
            </button>

            {/* Tab 3: Profil & Kontak */}
            <button
              onClick={() => setActiveTab('profile')}
              className={`pb-3 sm:pb-3.5 text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer relative ${
                activeTab === 'profile'
                  ? 'text-[#965c2e] border-b-2 border-[#965c2e]'
                  : 'text-slate-500 hover:text-slate-900 border-b-2 border-transparent'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Profil & Kontak</span>
            </button>

            {/* Tab 4: Kata Sandi */}
            <button
              onClick={() => setActiveTab('password')}
              className={`pb-3 sm:pb-3.5 text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer relative ${
                activeTab === 'password'
                  ? 'text-[#965c2e] border-b-2 border-[#965c2e]'
                  : 'text-slate-500 hover:text-slate-900 border-b-2 border-transparent'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Kata Sandi</span>
            </button>

          </nav>
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: RIWAYAT PESANAN (Persis Screenshot Tampilan Kosong & Transaksi) */}
        {/* ========================================================================= */}
        {activeTab === 'orders' && (
          <div className="max-w-xl mx-auto animate-fade-in">
            
            {/* Centered Empty State Box Matching User Screenshot */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-8 sm:p-14 text-center shadow-xs">
              
              {/* Soft Circular Icon Container */}
              <div className="w-16 h-16 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-600 mx-auto mb-5 shadow-2xs">
                <ShoppingBag className="w-7 h-7 stroke-[1.75]" />
              </div>

              {/* Title */}
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mb-2.5">
                Belum Ada Riwayat Pesanan
              </h2>

              {/* Description */}
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-md mx-auto mb-6">
                Anda belum memiliki transaksi pesanan di Sanubari Roastery. Temukan kopi segar sangrai pilihan kami sekarang.
              </p>

              {/* Action Button: Mulai Belanja Kopi */}
              <Link
                to="/kategori"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#0e1f36] hover:bg-[#162f52] text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all active:scale-95"
              >
                <span>Mulai Belanja Kopi</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

            </div>

            {/* Quick Helper for Tracking Existing External Invoice */}
            <div className="text-center mt-6">
              <Link
                to="/lacak-pesanan"
                className="text-xs font-semibold text-slate-400 hover:text-[#0e1f36] underline transition-colors inline-flex items-center gap-1"
              >
                <span>Sudah punya nomor resi / kode pesanan sebelumnya? Lacak di sini</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: ALAMAT PENGIRIMAN */}
        {/* ========================================================================= */}
        {activeTab === 'address' && (
          <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">Alamat Pengiriman Saya</h2>
                <p className="text-xs sm:text-sm text-slate-500">Kelola alamat tujuan untuk kemudahan checkout otomatis</p>
              </div>
              <button
                onClick={() => setIsAddressModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0e1f36] hover:bg-[#162f52] text-white text-xs font-bold transition-all shadow-sm active:scale-95"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Alamat</span>
              </button>
            </div>

            {/* Address Cards List */}
            <div className="grid grid-cols-1 gap-4">
              {addresses.map((addr) => (
                <div
                  key={addr.id}
                  className={`p-5 sm:p-6 rounded-2xl border transition-all ${
                    addr.isPrimary
                      ? 'bg-amber-50/20 border-amber-300 shadow-xs'
                      : 'bg-white border-slate-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">{addr.label}</span>
                        {addr.isPrimary && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 border border-amber-300">
                            Utama
                          </span>
                        )}
                      </div>
                      <p className="text-xs sm:text-sm font-semibold text-slate-800">
                        {addr.recipientName} <span className="text-slate-400 font-normal">({addr.phone})</span>
                      </p>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                        {addr.fullAddress}, {addr.city}, {addr.province} {addr.postalCode}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {!addr.isPrimary && (
                        <button
                          onClick={() => handleSetPrimaryAddress(addr.id)}
                          className="text-xs font-bold text-[#965c2e] hover:underline px-2 py-1"
                        >
                          Jadikan Utama
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteAddress(addr.id)}
                        className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg transition-colors"
                        title="Hapus alamat"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Modal Tambah Alamat */}
            {isAddressModalOpen && (
              <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fade-in">
                <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-slide-up">
                  <h3 className="text-lg font-bold text-slate-900 mb-4">Tambah Alamat Pengiriman Baru</h3>
                  <form onSubmit={handleAddAddress} className="space-y-3.5">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Label Alamat (cth: Rumah, Kantor)</label>
                      <input
                        type="text"
                        value={newAddress.label}
                        onChange={(e) => setNewAddress({ ...newAddress, label: e.target.value })}
                        className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:border-[#0e1f36] focus:outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Nama Penerima</label>
                      <input
                        type="text"
                        value={newAddress.recipientName}
                        onChange={(e) => setNewAddress({ ...newAddress, recipientName: e.target.value })}
                        className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:border-[#0e1f36] focus:outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">No. WhatsApp / HP</label>
                      <input
                        type="tel"
                        value={newAddress.phone}
                        onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                        className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:border-[#0e1f36] focus:outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Alamat Lengkap</label>
                      <textarea
                        rows="2"
                        value={newAddress.fullAddress}
                        onChange={(e) => setNewAddress({ ...newAddress, fullAddress: e.target.value })}
                        placeholder="Nama jalan, nomor rumah, RT/RW, kelurahan/kecamatan"
                        className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:border-[#0e1f36] focus:outline-none"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Kota / Kabupaten</label>
                        <input
                          type="text"
                          value={newAddress.city}
                          onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                          className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:border-[#0e1f36] focus:outline-none"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Kode Pos</label>
                        <input
                          type="text"
                          value={newAddress.postalCode}
                          onChange={(e) => setNewAddress({ ...newAddress, postalCode: e.target.value })}
                          placeholder="cth: 65115"
                          className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:border-[#0e1f36] focus:outline-none"
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-end gap-2 pt-3">
                      <button
                        type="button"
                        onClick={() => setIsAddressModalOpen(false)}
                        className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                      >
                        Batal
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 text-xs font-bold bg-[#0e1f36] text-white rounded-xl shadow-md"
                      >
                        Simpan Alamat
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: PROFIL & KONTAK */}
        {/* ========================================================================= */}
        {activeTab === 'profile' && (
          <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-10 shadow-xs animate-fade-in">
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 mb-1">Informasi Akun & Kontak</h2>
            <p className="text-xs sm:text-sm text-slate-500 mb-6">Ubah data profil pribadi Anda di bawah ini</p>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Nama Lengkap</label>
                <input
                  type="text"
                  value={userProfile.fullName}
                  onChange={(e) => setUserProfile({ ...userProfile, fullName: e.target.value })}
                  className="w-full text-sm p-3 rounded-xl border border-slate-300 focus:border-[#0e1f36] focus:outline-none font-semibold text-slate-900"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Alamat Email</label>
                <input
                  type="email"
                  value={userProfile.email}
                  onChange={(e) => setUserProfile({ ...userProfile, email: e.target.value })}
                  className="w-full text-sm p-3 rounded-xl border border-slate-300 focus:border-[#0e1f36] focus:outline-none font-semibold text-slate-900"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Nomor Handphone / WhatsApp</label>
                <input
                  type="tel"
                  value={userProfile.phone}
                  onChange={(e) => setUserProfile({ ...userProfile, phone: e.target.value })}
                  className="w-full text-sm p-3 rounded-xl border border-slate-300 focus:border-[#0e1f36] focus:outline-none font-semibold text-slate-900"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Tanggal Lahir</label>
                  <input
                    type="date"
                    value={userProfile.birthDate}
                    onChange={(e) => setUserProfile({ ...userProfile, birthDate: e.target.value })}
                    className="w-full text-sm p-3 rounded-xl border border-slate-300 focus:border-[#0e1f36] focus:outline-none font-semibold text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Jenis Kelamin</label>
                  <select
                    value={userProfile.gender}
                    onChange={(e) => setUserProfile({ ...userProfile, gender: e.target.value })}
                    className="w-full text-sm p-3 rounded-xl border border-slate-300 focus:border-[#0e1f36] focus:outline-none font-semibold text-slate-900"
                  >
                    <option value="Wanita">Wanita</option>
                    <option value="Pria">Pria</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-[#0e1f36] hover:bg-[#162f52] text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all active:scale-95"
                >
                  Simpan Perubahan Profil
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: KATA SANDI */}
        {/* ========================================================================= */}
        {activeTab === 'password' && (
          <div className="max-w-xl mx-auto bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-10 shadow-xs animate-fade-in">
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 mb-1">Perbarui Kata Sandi</h2>
            <p className="text-xs sm:text-sm text-slate-500 mb-6">Gunakan kata sandi yang aman untuk melindungi akun belanja Anda</p>

            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Kata Sandi Saat Ini</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={passwords.current}
                    onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                    placeholder="Masukkan kata sandi lama Anda"
                    className="w-full text-sm p-3 pr-10 rounded-xl border border-slate-300 focus:border-[#0e1f36] focus:outline-none"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Kata Sandi Baru</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={passwords.newPass}
                  onChange={(e) => setPasswords({ ...passwords, newPass: e.target.value })}
                  placeholder="Minimal 6 karakter"
                  className="w-full text-sm p-3 rounded-xl border border-slate-300 focus:border-[#0e1f36] focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Konfirmasi Kata Sandi Baru</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={passwords.confirmPass}
                  onChange={(e) => setPasswords({ ...passwords, confirmPass: e.target.value })}
                  placeholder="Ulangi kata sandi baru"
                  className="w-full text-sm p-3 rounded-xl border border-slate-300 focus:border-[#0e1f36] focus:outline-none"
                  required
                />
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-[#0e1f36] hover:bg-[#162f52] text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all active:scale-95"
                >
                  Perbarui Kata Sandi
                </button>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
