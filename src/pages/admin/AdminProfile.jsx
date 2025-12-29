import { useState, useEffect } from 'react';
import { publicAPI, adminAPI } from '../../utils/api';

const AdminProfile = () => {
  const [formData, setFormData] = useState({
    nama_organisasi: '',
    tagline: '',
    deskripsi_singkat: '',
    deskripsi_lengkap: '',
    bidang_usaha: '',
    logo_url: ''
  });
  const [logoFile, setLogoFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    publicAPI.getProfile()
      .then(response => {
        const data = response.data;
        setFormData({
          nama_organisasi: data.nama_organisasi || '',
          tagline: data.tagline || '',
          deskripsi_singkat: data.deskripsi_singkat || '',
          deskripsi_lengkap: data.deskripsi_lengkap || '',
          bidang_usaha: data.bidang_usaha || '',
          logo_url: data.logo_url || ''
        });
        setInitialLoading(false);
      })
      .catch(error => {
        console.error('Error loading profile:', error);
        setMessage({ type: 'error', text: 'Gagal memuat data profil' });
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setMessage({ type: 'error', text: 'Ukuran file terlalu besar. Maksimal 5MB.' });
        return;
      }
      setLogoFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const submitData = { ...formData };
      if (logoFile) {
        submitData.logo = logoFile;
      }

      await adminAPI.updateProfile(submitData);
      setMessage({ type: 'success', text: 'Profil organisasi berhasil diperbarui!' });
      setLogoFile(null);
      
      // Reset file input
      const fileInput = document.getElementById('logo-upload');
      if (fileInput) fileInput.value = '';
      
      // Reload data
      const response = await publicAPI.getProfile();
      const data = response.data;
      setFormData({
        nama_organisasi: data.nama_organisasi || '',
        tagline: data.tagline || '',
        deskripsi_singkat: data.deskripsi_singkat || '',
        deskripsi_lengkap: data.deskripsi_lengkap || '',
        bidang_usaha: data.bidang_usaha || '',
        logo_url: data.logo_url || ''
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.error || 'Gagal memperbarui profil organisasi' 
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
        <h1 className="text-3xl font-bold text-gray-800">Profil Organisasi</h1>
        <p className="text-gray-600 mt-2">
          Kelola informasi dasar organisasi, logo, dan deskripsi APPGI
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

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Logo Upload */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="form-group">
                <label className="form-label">Logo Organisasi</label>
                <div className="flex items-start space-x-6">
                  <div className="flex-shrink-0">
                    {formData.logo_url ? (
                      <img
                        src={`http://localhost:5000${formData.logo_url}`}
                        alt="Logo APPGI"
                        className="w-24 h-24 object-cover rounded-lg border border-gray-200"
                      />
                    ) : (
                      <div className="w-24 h-24 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <input
                      type="file"
                      id="logo-upload"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                    />
                    <p className="mt-2 text-sm text-gray-500">
                      Format: JPG, PNG, atau GIF. Maksimal 5MB.
                    </p>
                    {logoFile && (
                      <p className="mt-1 text-sm text-green-600">
                        File terpilih: {logoFile.name}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="form-group">
                <label className="form-label">Nama Organisasi *</label>
                <input
                  type="text"
                  name="nama_organisasi"
                  value={formData.nama_organisasi}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Nama lengkap organisasi"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Tagline</label>
                <input
                  type="text"
                  name="tagline"
                  value={formData.tagline}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Tagline atau slogan organisasi"
                />
              </div>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Bidang Usaha</label>
            <input
              type="text"
              name="bidang_usaha"
              value={formData.bidang_usaha}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Bidang usaha atau kegiatan utama organisasi"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Deskripsi Singkat</label>
            <textarea
              name="deskripsi_singkat"
              value={formData.deskripsi_singkat}
              onChange={handleInputChange}
              className="form-textarea"
              rows={3}
              placeholder="Deskripsi singkat tentang organisasi (1-2 kalimat)"
            />
            <p className="mt-2 text-sm text-gray-500">
              Deskripsi ini akan ditampilkan di halaman beranda dan footer.
            </p>
          </div>

          <div className="form-group">
            <label className="form-label">Deskripsi Lengkap</label>
            <textarea
              name="deskripsi_lengkap"
              value={formData.deskripsi_lengkap}
              onChange={handleInputChange}
              className="form-textarea"
              rows={6}
              placeholder="Deskripsi lengkap tentang sejarah, tujuan, dan kegiatan organisasi"
            />
            <p className="mt-2 text-sm text-gray-500">
              Deskripsi ini akan ditampilkan di halaman Tentang APPGI.
            </p>
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

export default AdminProfile;