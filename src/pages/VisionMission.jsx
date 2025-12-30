import { useState, useEffect } from 'react';
import { publicAPI } from '../utils/api';
import bg2 from '../assets/bg-2.jpg';

const VisionMission = () => {
  const [visiMisi, setVisiMisi] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    publicAPI.getVisiMisi()
      .then(response => {
        setVisiMisi(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error loading visi misi:', error);
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
              Visi & Misi
            </h1>
            <p className="text-xl text-primary-100 max-w-3xl mx-auto">
            Komitmen dan arah strategis APPGI dalam membangun masa depan industri minyak dan gas bumi Indonesia
            </p>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="section bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div data-aos="fade-right">
              <div className="text-center lg:text-left">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-100 rounded-2xl mb-6">
                  <svg className="w-10 h-10 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <h2 className="text-3xl lg:text-4xl font-bold mb-8 text-gray-800">Visi APPGI</h2>
              </div>
            </div>
            
            <div data-aos="fade-left">
              <blockquote className="text-2xl lg:text-3xl font-medium text-gray-700 leading-relaxed italic border-l-8 border-primary-500 pl-8 bg-primary-50 p-8 rounded-r-2xl">
                "{visiMisi.visi || 'Menjadi wadah organisasi untuk menciptakan para profesional yang berkualitas dan terpercaya'}"
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="section bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-16" data-aos="fade-up">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-secondary-100 rounded-2xl mb-6">
              <svg className="w-10 h-10 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold mb-6 text-gray-800">Misi APPGI</h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              Langkah-langkah strategis yang kami tempuh untuk mewujudkan visi organisasi
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            {visiMisi.misi_list && visiMisi.misi_list.length > 0 ? (
              <div className="space-y-6">
                {visiMisi.misi_list
                  .sort((a, b) => a.urutan - b.urutan)
                  .map((misi, index) => (
                    <div 
                      key={misi.id} 
                      className="bg-white p-6 lg:p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300"
                      data-aos="fade-up"
                      data-aos-delay={index * 100}
                    >
                      <div className="flex items-start space-x-6">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 bg-secondary-100 rounded-xl flex items-center justify-center">
                            <span className="text-xl font-bold text-secondary-600">
                              {String(misi.urutan).padStart(2, '0')}
                            </span>
                          </div>
                        </div>
                        <div className="flex-1">
                          <p className="text-lg text-gray-700 leading-relaxed">
                            {misi.teks_misi}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">Misi Belum Tersedia</h3>
                <p className="text-gray-500">
                  Informasi misi organisasi sedang dalam proses pembaruan.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Vision Mission Impact */}
      <section className="section bg-primary-600 text-white">
        <div className="container-custom text-center">
          <div data-aos="zoom-in">
            <h2 className="text-3xl lg:text-4xl font-bold mb-8">
              Dampak Visi & Misi APPGI
            </h2>
            <p className="text-xl mb-12 text-primary-100 max-w-3xl mx-auto leading-relaxed">
              Melalui visi dan misi yang jelas, APPGI berkomitmen untuk terus berkontribusi positif 
              bagi pengembangan industri pemboran Indonesia
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3">Inovasi Berkelanjutan</h3>
                <p className="text-primary-100">
                  Mendorong pengembangan teknologi dan metodologi terbaru dalam industri pemboran
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3">Pengembangan SDM</h3>
                <p className="text-primary-100">
                  Meningkatkan kapasitas dan kompetensi sumber daya manusia Indonesia
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3">Kolaborasi Strategis</h3>
                <p className="text-primary-100">
                  Membangun kemitraan yang kuat dengan berbagai stakeholder industri
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default VisionMission;