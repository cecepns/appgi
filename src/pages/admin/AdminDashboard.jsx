import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { publicAPI } from '../../utils/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    profile: null,
    visiMisi: null,
    struktur: null,
    kontak: null,
    websiteInfo: null
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      publicAPI.getProfile(),
      publicAPI.getVisiMisi(),
      publicAPI.getStruktur(),
      publicAPI.getKontak(),
      publicAPI.getWebsiteInfo()
    ]).then(([profileRes, visiMisiRes, strukturRes, kontakRes, websiteInfoRes]) => {
      setStats({
        profile: profileRes.data,
        visiMisi: visiMisiRes.data,
        struktur: strukturRes.data,
        kontak: kontakRes.data,
        websiteInfo: websiteInfoRes.data
      });
      setLoading(false);
    }).catch(error => {
      console.error('Error loading dashboard data:', error);
      setLoading(false);
    });
  }, []);

  const menuItems = [
    {
      title: 'Profil Organisasi',
      description: 'Kelola informasi dasar organisasi, logo, dan deskripsi',
      href: '/admin/profile',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      color: 'bg-blue-500',
      status: stats.profile?.nama_organisasi ? 'Lengkap' : 'Perlu diperbarui'
    },
    {
      title: 'Visi & Misi',
      description: 'Edit visi organisasi dan kelola daftar misi',
      href: '/admin/visi-misi',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      ),
      color: 'bg-green-500',
      status: stats.visiMisi?.visi ? 'Lengkap' : 'Perlu diperbarui'
    },
    {
      title: 'Struktur Organisasi',
      description: 'Upload dan kelola bagan struktur organisasi',
      href: '/admin/struktur',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      color: 'bg-purple-500',
      status: stats.struktur?.periode ? 'Lengkap' : 'Perlu diperbarui'
    },
    {
      title: 'Kontak & Alamat',
      description: 'Kelola informasi kontak dan lokasi kantor',
      href: '/admin/kontak',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 3.26a2 2 0 001.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      color: 'bg-orange-500',
      status: stats.kontak?.alamat ? 'Lengkap' : 'Perlu diperbarui'
    },
    {
      title: 'Informasi Website',
      description: 'Kelola pengaturan umum website dan SEO',
      href: '/admin/website-info',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      color: 'bg-red-500',
      status: stats.websiteInfo?.site_title ? 'Lengkap' : 'Perlu diperbarui'
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
            <p className="text-gray-600 mt-2">
              Selamat datang di panel administrasi APPGI. Kelola konten website Anda di sini.
            </p>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={() => window.open('/', '_blank')}
              className="btn btn-outline"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Lihat Website
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-blue-100">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Misi</p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.visiMisi?.misi_list?.length || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-green-100">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Status Konten</p>
              <p className="text-2xl font-semibold text-green-600">Aktif</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-purple-100">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Tahun Berdiri</p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.profile?.tahun_berdiri ? new Date(stats.profile.tahun_berdiri).getFullYear() : '2014'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-orange-100">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Lokasi</p>
              <p className="text-sm font-semibold text-gray-900">Jakarta Selatan</p>
            </div>
          </div>
        </div>
      </div>

      {/* Management Menu */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Manajemen Konten</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map((item) => (
            <Link
              key={item.title}
              to={item.href}
              className="group block p-6 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors duration-200"
            >
              <div className="flex items-center mb-4">
                <div className={`p-3 ${item.color} rounded-lg text-white group-hover:scale-110 transition-transform duration-200`}>
                  {item.icon}
                </div>
                <div className="ml-4 flex-1">
                  <h3 className="text-lg font-semibold text-gray-800 group-hover:text-primary-600 transition-colors duration-200">
                    {item.title}
                  </h3>
                  <div className="mt-1">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      item.status === 'Lengkap' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">
                {item.description}
              </p>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Aktivitas Terbaru</h2>
        <div className="space-y-4">
          <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-800">Website berhasil dimuat</p>
              <p className="text-xs text-gray-500">Semua konten telah berhasil dimuat dari database</p>
            </div>
            <div className="text-xs text-gray-500">Baru saja</div>
          </div>
          
          <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-800">Panel admin siap digunakan</p>
              <p className="text-xs text-gray-500">Sistem manajemen konten telah diinisialisasi</p>
            </div>
            <div className="text-xs text-gray-500">Hari ini</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;