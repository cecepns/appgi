import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { publicAPI } from '../utils/api';
import bg2 from '../assets/bg-2.jpg';

const Home = () => {
  const [profile, setProfile] = useState({});
  const [visiMisi, setVisiMisi] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      publicAPI.getProfile(),
      publicAPI.getVisiMisi()
    ]).then(([profileResponse, visiMisiResponse]) => {
      setProfile(profileResponse.data);
      setVisiMisi(visiMisiResponse.data);
      setLoading(false);
    }).catch(error => {
      console.error('Error loading data:', error);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="pt-16 lg:pt-32">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container-custom py-20 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div data-aos="fade-right" className="order-2 lg:order-1">
              <h1 className="text-2xl md:text-4xl font-bold mb-6 leading-tight">
                {profile.nama_organisasi || 'APPGI'}
              </h1>
              <p className="text-xl lg:text-2xl mb-8 text-primary-100 leading-relaxed">
                {profile.tagline || 'Membangun Profesionalitas dalam Industri Pemboran Indonesia'}
              </p>
              <p className="text-lg mb-10 text-primary-50 leading-relaxed">
                {profile.deskripsi_singkat || 'APPGI adalah organisasi profesional yang bergerak dalam bidang pemboran minyak, gas, dan panas bumi di Indonesia.'}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/tentang"
                  className="btn btn-primary bg-white text-primary-800 hover:bg-primary-50 focus:ring-white/20"
                >
                  Tentang APPGI
                </Link>
                <Link
                  to="/kontak"
                  className="btn btn-outline border-white text-white hover:bg-white hover:text-primary-800"
                >
                  Hubungi Kami
                </Link>
              </div>
            </div>
            
            <div data-aos="fade-left" className="order-1 lg:order-2">
              <div className="relative">
                {profile.logo_url ? (
                  <img
                    src={`https://api-inventory.isavralabel.com${profile.logo_url}`}
                    alt="APPGI Logo"
                    className="w-full max-w-lg mx-auto animate-float"
                  />
                ) : (
                  <div className="w-full max-w-lg mx-auto h-80 bg-white/10 rounded-xl flex items-center justify-center animate-float">
                    <span className="text-6xl font-bold">APPGI</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-primary-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-secondary-500/20 rounded-full blur-3xl"></div>
      </section>

      {/* Organization Overview */}
      <section className="section bg-white">
        <div className="container-custom">
          <div className="section-header" data-aos="fade-up">
            <h2 className="text-gradient">Tentang APPGI</h2>
            <p className="text-gray-600 text-lg mt-4 max-w-3xl mx-auto">
              Mengenal lebih dekat organisasi yang berkomitmen membangun profesionalitas industri pemboran Indonesia
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div data-aos="fade-right">
              <div className="prose prose-lg">
                <p className="text-gray-700 leading-relaxed mb-6">
                  {profile.deskripsi_lengkap || 
                   'Asosiasi Perusahaan Pemboran Minyak, Gas, dan Panas Bumi Indonesia (APPGI) didirikan pada tanggal 10 Oktober 2014. APPGI merupakan wadah bagi para profesional dan perusahaan yang bergerak di bidang pemboran minyak, gas, dan panas bumi.'}
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
                  <div className="bg-primary-50 p-6 rounded-xl">
                    <h4 className="font-semibold text-primary-800 mb-2">Tahun Berdiri</h4>
                    <p className="text-2xl font-bold text-primary-600">
                      {profile.tahun_berdiri ? new Date(profile.tahun_berdiri).getFullYear() : '2014'}
                    </p>
                  </div>
                  <div className="bg-secondary-50 p-6 rounded-xl">
                    <h4 className="font-semibold text-secondary-800 mb-2">Bidang Usaha</h4>
                    <p className="text-sm text-secondary-700">
                      {profile.bidang_usaha || 'Pemboran Minyak, Gas, dan Panas Bumi'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div data-aos="fade-left">
              <div className="bg-gradient-to-br from-primary-100 to-secondary-100 p-8 lg:p-12 rounded-2xl">
                <h3 className="text-2xl font-bold mb-6 text-gray-800">Legalitas Organisasi</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-primary-600 rounded-full"></div>
                    <span className="text-gray-700">Organisasi Profesional Terdaftar</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-secondary-600 rounded-full"></div>
                    <span className="text-gray-700">Berafiliasi dengan Industri Nasional</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-accent-600 rounded-full"></div>
                    <span className="text-gray-700">Berkomitmen pada Standar Internasional</span>
                  </div>
                </div>
                
                <Link
                  to="/tentang"
                  className="inline-flex items-center mt-8 text-primary-600 hover:text-primary-700 font-medium"
                >
                  Pelajari Lebih Lanjut
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission Highlight */}
      <section className="section bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-16" data-aos="fade-up">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6 text-gray-800">Visi & Misi</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Komitmen kami dalam membangun masa depan industri pemboran Indonesia
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Visi */}
            <div data-aos="fade-right">
              <div className="bg-white p-8 lg:p-10 rounded-2xl shadow-xl h-full">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800">Visi</h3>
                </div>
                <p className="text-gray-700 leading-relaxed text-lg">
                  {visiMisi.visi || 'Menjadi wadah organisasi untuk menciptakan para profesional yang berkualitas dan terpercaya'}
                </p>
              </div>
            </div>
            
            {/* Misi Preview */}
            <div data-aos="fade-left">
              <div className="bg-white p-8 lg:p-10 rounded-2xl shadow-xl h-full">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-secondary-100 rounded-xl flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800">Misi</h3>
                </div>
                <div className="space-y-3">
                  {visiMisi.misi_list && visiMisi.misi_list.length > 0 ? (
                    visiMisi.misi_list.slice(0, 3).map((misi, index) => (
                      <div key={misi.id} className="flex items-start space-x-3">
                        <span className="inline-flex items-center justify-center w-6 h-6 bg-secondary-100 text-secondary-600 rounded-full text-sm font-medium flex-shrink-0 mt-0.5">
                          {index + 1}
                        </span>
                        <span className="text-gray-700">{misi.teks_misi}</span>
                      </div>
                    ))
                  ) : (
                    <div className="text-gray-500">Misi belum tersedia</div>
                  )}
                  {visiMisi.misi_list && visiMisi.misi_list.length > 3 && (
                    <Link
                      to="/visi-misi"
                      className="inline-flex items-center text-secondary-600 hover:text-secondary-700 font-medium mt-4"
                    >
                      Lihat Semua Misi
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-12" data-aos="fade-up">
            <Link
              to="/visi-misi"
              className="btn btn-primary"
            >
              Selengkapnya Visi & Misi
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section 
        className="section relative text-white bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${bg2})` }}
      >
        <div className="absolute inset-0 opacity-90 bg-gradient-to-br from-primary-800 to-primary-900"></div>
        <div className="container-custom text-center relative z-10">
          <div data-aos="zoom-in">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              Bergabunglah dengan APPGI
            </h2>
            <p className="text-xl mb-10 text-primary-100 max-w-3xl mx-auto leading-relaxed">
              Mari bersama-sama membangun industri pemboran Indonesia yang lebih profesional dan berkelanjutan
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/kontak"
                className="btn bg-white text-primary-600 hover:bg-primary-50"
              >
                Hubungi Kami
              </Link>
              <Link
                to="/tentang"
                className="btn btn-outline border-white text-white hover:bg-white hover:text-primary-600"
              >
                Pelajari Lebih Lanjut
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;