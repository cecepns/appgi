import { useState, useEffect } from 'react';
import { publicAPI, adminAPI } from '../../utils/api';

const AdminContact = () => {
  const [formData, setFormData] = useState({
    alamat: '',
    email: '',
    telepon: '',
    whatsapp: '',
    google_maps_url: '',
    google_maps_embed: '',
    jam_operasional: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    publicAPI.getKontak()
      .then(response => {
        const data = response.data;
        setFormData({
          alamat: data.alamat || '',
          email: data.email || '',
          telepon: data.telepon || '',
          whatsapp: data.whatsapp || '',
          google_maps_url: data.google_maps_url || '',
          google_maps_embed: data.google_maps_embed || '',
          jam_operasional: data.jam_operasional || ''
        });
        setInitialLoading(false);
      })
      .catch(error => {
        console.error('Error loading kontak:', error);
        setMessage({ type: 'error', text: 'Gagal memuat data kontak' });
        setInitialLoading(false);
      });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    // Basic validation
    if (!formData.alamat.trim()) {
      setMessage({ type: 'error', text: 'Alamat harus diisi' });
      setLoading(false);
      return;
    }

    try {
      await adminAPI.updateKontak(formData);
      setMessage({ type: 'success', text: 'Informasi kontak berhasil diperbarui!' });
      
      // Reload data
      const response = await publicAPI.getKontak();
      const data = response.data;
      setFormData({
        alamat: data.alamat || '',
        email: data.email || '',
        telepon: data.telepon || '',
        whatsapp: data.whatsapp || '',
        google_maps_url: data.google_maps_url || '',
        google_maps_embed: data.google_maps_embed || '',
        jam_operasional: data.jam_operasional || ''
      });
    } catch (error) {
      console.error('Error updating kontak:', error);
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.error || 'Gagal memperbarui informasi kontak' 
      });
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
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
        <h1 className="text-3xl font-bold text-gray-800">Kontak & Alamat</h1>
        <p className="text-gray-600 mt-2">
          Kelola informasi kontak, alamat kantor, dan lokasi APPGI
        </p>
      </div>

      {/* Form */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        {message.text && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.type === 'success' 
              ? 'bg-green-50 border border-green-200 text-green-700' 
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Contact Information */}
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
              <svg className="w-6 h-6 mr-3 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 3.26a2 2 0 001.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Informasi Kontak
            </h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="form-group">
                <label className="form-label">Alamat Kantor *</label>
                <textarea
                  name="alamat"
                  value={formData.alamat}
                  onChange={handleInputChange}
                  className="form-textarea"
                  rows={4}
                  placeholder="Alamat lengkap kantor operasional..."
                  required
                />
              </div>

              <div className="space-y-6">
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="info@apgi.or.id"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Nomor Telepon</label>
                  <input
                    type="tel"
                    name="telepon"
                    value={formData.telepon}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="+62 21 xxxx xxxx"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">WhatsApp</label>
                  <input
                    type="text"
                    name="whatsapp"
                    value={formData.whatsapp}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="+62 8xx xxxx xxxx"
                  />
                  <p className="mt-2 text-sm text-gray-500">
                    Nomor WhatsApp untuk kontak cepat (format: +62)
                  </p>
                </div>
              </div>
            </div>

            <div className="form-group mt-6">
              <label className="form-label">Jam Operasional</label>
              <input
                type="text"
                name="jam_operasional"
                value={formData.jam_operasional}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Senin - Jumat: 08:00 - 17:00 WIB"
              />
            </div>
          </div>

          {/* Maps Information */}
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
              <svg className="w-6 h-6 mr-3 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Lokasi & Peta
            </h3>
            
            <div className="space-y-6">
              <div className="form-group">
                <label className="form-label">URL Google Maps</label>
                <input
                  type="url"
                  name="google_maps_url"
                  value={formData.google_maps_url}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="https://maps.app.goo.gl/..."
                />
                <p className="mt-2 text-sm text-gray-500">
                  Link Google Maps untuk membuka lokasi di aplikasi Maps
                </p>
              </div>

              <div className="form-group">
                <label className="form-label">Embed Code Google Maps</label>
                <textarea
                  name="google_maps_embed"
                  value={formData.google_maps_embed}
                  onChange={handleInputChange}
                  className="form-textarea"
                  rows={4}
                  placeholder="<iframe src='https://www.google.com/maps/embed?...' width='100%' height='300' style='border:0;' allowfullscreen='' loading='lazy'></iframe>"
                />
                <p className="mt-2 text-sm text-gray-500">
                  Kode embed dari Google Maps untuk menampilkan peta di website
                </p>
              </div>

              {/* Preview Peta */}
              {formData.google_maps_embed && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Preview Peta:</h4>
                  <div 
                    className="w-full rounded-lg overflow-hidden"
                    dangerouslySetInnerHTML={{ __html: formData.google_maps_embed }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-blue-800 mb-2">Cara mendapatkan embed code Google Maps:</h4>
            <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
              <li>Buka Google Maps dan cari lokasi kantor</li>
              <li>Klik tombol "Share" atau "Bagikan"</li>
              <li>Pilih tab "Embed a map" atau "Sematkan peta"</li>
              <li>Pilih ukuran peta (disarankan Medium atau Large)</li>
              <li>Copy kode HTML yang diberikan</li>
              <li>Paste kode tersebut di field "Embed Code Google Maps" di atas</li>
            </ol>
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => window.location.reload()}
            >
              Reset
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Menyimpan...</span>
                </div>
              ) : (
                'Simpan Perubahan'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminContact;