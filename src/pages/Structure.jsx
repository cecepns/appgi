import { useState, useEffect } from 'react';
import { publicAPI } from '../utils/api';
import bg2 from '../assets/bg-2.jpg';

const Structure = () => {
  const [struktur, setStruktur] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    publicAPI.getStruktur()
      .then(response => {
        setStruktur(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error loading struktur:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="pt-32">
      {/* Header Section */}
      <section 
        className="relative text-white py-16 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${bg2})` }}
      >
        <div className="absolute inset-0 opacity-90 bg-gradient-to-br from-primary-800 to-primary-900"></div>
        <div className="container-custom relative z-10">
          <div className="text-center" data-aos="fade-up">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              Struktur Organisasi
            </h1>
            <p className="text-xl text-primary-100 max-w-3xl mx-auto">
              Struktur kepemimpinan dan organisasi APPGI periode {struktur.periode || '2024 - 2029'}
            </p>
          </div>
        </div>
      </section>

      {/* Structure Content */}
      <section className="section bg-white">
        <div className="container-custom">
          {/* Period Information */}
          <div className="text-center mb-12" data-aos="fade-up">
            <div className="inline-flex items-center bg-primary-100 text-primary-800 px-6 py-3 rounded-full text-lg font-medium">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Periode {struktur.periode || '2024 - 2029'}
            </div>
          </div>

          {/* Description */}
          {struktur.deskripsi && (
            <div className="max-w-4xl mx-auto text-center mb-16" data-aos="fade-up">
              <p className="text-lg text-gray-700 leading-relaxed">
                {struktur.deskripsi}
              </p>
            </div>
          )}

          {/* Organization Chart */}
          <div className="max-w-6xl mx-auto" data-aos="zoom-in">
            {struktur.gambar_bagan ? (
              <div className="bg-white rounded-2xl shadow-xl p-6 lg:p-8">
                <img
                  src={`https://api-inventory.isavralabel.com/appgi${struktur.gambar_bagan}`}
                  alt="Bagan Struktur Organisasi APPGI"
                  className="w-full h-auto rounded-lg shadow-md"
                />
              </div>
            ) : (
              <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center">
                <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  Bagan Struktur Organisasi
                </h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  Bagan struktur organisasi sedang dalam proses pembaruan. 
                  Silakan hubungi kami untuk informasi struktur organisasi terkini.
                </p>
              </div>
            )}
          </div>

          {/* Additional Information */}
          <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-primary-50 p-8 rounded-2xl" data-aos="fade-right">
              <h3 className="text-2xl font-bold mb-6 text-primary-800">
                Struktur Kepemimpinan
              </h3>
              <div className="space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  Struktur organisasi APPGI dirancang untuk memastikan tata kelola yang efektif 
                  dan akuntabel dalam menjalankan visi dan misi organisasi.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-primary-600 rounded-full"></div>
                    <span className="text-gray-700">Dewan Pengurus Periode {struktur.periode || '2024-2029'}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-primary-600 rounded-full"></div>
                    <span className="text-gray-700">Struktur Organisasi yang Profesional</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-primary-600 rounded-full"></div>
                    <span className="text-gray-700">Pembagian Tugas yang Jelas</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-secondary-50 p-8 rounded-2xl" data-aos="fade-left">
              <h3 className="text-2xl font-bold mb-6 text-secondary-800">
                Divisi & Departemen
              </h3>
              <div className="space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  Setiap divisi dan departemen memiliki tanggung jawab spesifik dalam 
                  mendukung pencapaian tujuan organisasi secara keseluruhan.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-secondary-600 rounded-full"></div>
                    <span className="text-gray-700">Divisi Teknis dan Operasional</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-secondary-600 rounded-full"></div>
                    <span className="text-gray-700">Divisi Pengembangan SDM</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-secondary-600 rounded-full"></div>
                    <span className="text-gray-700">Divisi Kemitraan dan Hubungan Eksternal</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="section bg-gray-50">
        <div className="container-custom text-center">
          <div data-aos="fade-up">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">
              Ingin Mengetahui Lebih Detail?
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Untuk informasi lebih detail mengenai struktur organisasi dan tata kelola APPGI, 
              silakan hubungi kami melalui kontak yang tersedia.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/kontak"
                className="btn btn-primary"
              >
                Hubungi Kami
              </a>
              <a
                href="/tentang"
                className="btn btn-outline"
              >
                Tentang APPGI
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Structure;