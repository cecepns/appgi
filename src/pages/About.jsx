import { useState, useEffect } from "react";
import { publicAPI } from "../utils/api";
import bg2 from "../assets/bg-2.jpg";

const About = () => {
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    publicAPI
      .getProfile()
      .then((response) => {
        setProfile(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error loading profile:", error);
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
              Tentang APPGI
            </h1>
            <p className="text-xl text-primary-100 max-w-3xl mx-auto">
              Komitmen dan arah strategis APPGI dalam membangun masa depan
              industri minyak dan gas bumi Indonesia
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="section bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            <div data-aos="fade-right">
              <div className="relative">
                {profile.logo_url ? (
                  <img
                    src={`https://api-inventory.isavralabel.com/appgi${profile.logo_url}`}
                    alt="APPGI Logo"
                    className="w-full max-w-md mx-auto"
                  />
                ) : (
                  <div className="w-full max-w-md mx-auto h-80 bg-gray-100 rounded-xl flex items-center justify-center">
                    <span className="text-4xl font-bold text-gray-400">
                      APPGI
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div data-aos="fade-left">
              <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">
                {profile.nama_organisasi || "APPGI"}
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                {profile.deskripsi_lengkap ||
                  "Asosiasi Perusahaan Pemboran Minyak, Gas, dan Panas Bumi Indonesia (APPGI) didirikan pada tanggal 10 Oktober 2014. APPGI merupakan wadah bagi para profesional dan perusahaan yang bergerak di bidang pemboran minyak, gas, dan panas bumi untuk meningkatkan kualitas dan profesionalitas industri pemboran di Indonesia."}
              </p>

              {profile.tagline && (
                <blockquote className="border-l-4 border-primary-500 pl-6 italic text-gray-600 bg-gray-50 p-4 rounded-r-lg">
                  &ldquo;{profile.tagline}&rdquo;
                </blockquote>
              )}
            </div>
          </div>

          {/* Key Information Cards */}
          <div
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
            data-aos="fade-up"
          >
            <div className="card">
              <div className="card-body text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-primary-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Tahun Berdiri</h3>
                <p className="text-3xl font-bold text-primary-600 mb-2">
                  {profile.tahun_berdiri
                    ? new Date(profile.tahun_berdiri).getFullYear()
                    : "2014"}
                </p>
                <p className="text-gray-600 text-sm">
                  {profile.tahun_berdiri
                    ? new Date(profile.tahun_berdiri).toLocaleDateString(
                        "id-ID",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )
                    : "10 Oktober 2014"}
                </p>
              </div>
            </div>

            <div className="card">
              <div className="card-body text-center">
                <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-secondary-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Bidang Usaha</h3>
                <p className="text-gray-700 leading-relaxed">
                  {profile.bidang_usaha ||
                    "Pemboran Minyak, Gas, dan Panas Bumi"}
                </p>
              </div>
            </div>

            <div className="card">
              <div className="card-body text-center">
                <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-accent-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Tipe Organisasi</h3>
                <p className="text-gray-700 leading-relaxed">
                  Asosiasi Profesional
                </p>
              </div>
            </div>
          </div>

          {/* Detailed Description */}
          <div
            className="bg-gray-50 rounded-2xl p-8 lg:p-12"
            data-aos="fade-up"
          >
            <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
              Sejarah & Latar Belakang
            </h2>

            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed mb-6">
                Asosiasi Profesi Perminyakan dan Gas Bumi Indonesia (APPGI)
                didirikan pada tanggal 10 Oktober 2014 sebagai respons terhadap
                kebutuhan industri minyak dan gas bumi Indonesia akan sebuah
                wadah organisasi yang dapat menyatukan para profesional.
              </p>

              <p className="text-gray-700 leading-relaxed mb-6">
                APPGI berkomitmen untuk meningkatkan profesionalitas anggotanya
                melalui berbagai program pengembangan kapasitas, standardisasi
                teknis, dan pertukaran knowledge terkini dalam industri
                pemboran. Organisasi ini juga berperan aktif dalam membangun
                jaringan kerjasama yang kuat antar anggota dan stakeholder
                industri.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-primary-800">
                    Fokus Utama
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-start space-x-3">
                      <svg
                        className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-gray-700">
                        Pengembangan profesionalitas anggota
                      </span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <svg
                        className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-gray-700">
                        Standardisasi teknis industri
                      </span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <svg
                        className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-gray-700">
                        Keselamatan kerja dan lingkungan
                      </span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4 text-secondary-800">
                    Kegiatan Utama
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-start space-x-3">
                      <svg
                        className="w-5 h-5 text-secondary-600 mt-0.5 flex-shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-gray-700">
                        Pelatihan dan sertifikasi
                      </span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <svg
                        className="w-5 h-5 text-secondary-600 mt-0.5 flex-shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-gray-700">
                        Seminar dan workshop
                      </span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <svg
                        className="w-5 h-5 text-secondary-600 mt-0.5 flex-shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-gray-700">
                        Networking dan kerjasama
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
