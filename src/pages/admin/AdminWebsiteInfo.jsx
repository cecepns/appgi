import { useState, useEffect } from 'react';
import { publicAPI, adminAPI } from '../../utils/api';

const AdminWebsiteInfo = () => {
  const [formData, setFormData] = useState({
    site_title: '',
    site_description: '',
    footer_copyright: '',
    favicon_url: '',
    hero_banner_url: ''
  });
  const [files, setFiles] = useState({
    favicon: null,
    hero_banner: null
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    publicAPI.getWebsiteInfo()
      .then(response => {
        const data = response.data;
        setFormData({
          site_title: data.site_title || '',
          site_description: data.site_description || '',
          footer_copyright: data.footer_copyright || '',
          favicon_url: data.favicon_url || '',
          hero_banner_url: data.hero_banner_url || ''
        });
        setInitialLoading(false);
      })
      .catch(error => {
        console.error('Error loading website info:', error);
        setMessage({ type: 'error', text: 'Gagal memuat data website' });
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

  const handleFileChange = (e, fileType) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setMessage({ type: 'error', text: 'Ukuran file terlalu besar. Maksimal 5MB.' });
        return;
      }
      setFiles(prev => ({
        ...prev,
        [fileType]: file
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const submitData = { ...formData };
      if (files.favicon) {
        submitData.favicon = files.favicon;
      }
      if (files.hero_banner) {
        submitData.hero_banner = files.hero_banner;
      }

      await adminAPI.updateWebsiteInfo(submitData);
      setMessage({ type: 'success', text: 'Informasi website berhasil diperbarui!' });
      setFiles({ favicon: null, hero_banner: null });
      
      // Reset file inputs
      const faviconInput = document.getElementById('favicon-upload');
      const bannerInput = document.getElementById('banner-upload');
      if (faviconInput) faviconInput.value = '';
      if (bannerInput) bannerInput.value = '';
      
      // Reload data
      const response = await publicAPI.getWebsiteInfo();
      const data = response.data;
      setFormData({
        site_title: data.site_title || '',
        site_description: data.site_description || '',
        footer_copyright: data.footer_copyright || '',
        favicon_url: data.favicon_url || '',
        hero_banner_url: data.hero_banner_url || ''
      });
    } catch (error) {
      console.error('Error updating website info:', error);
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.error || 'Gagal memperbarui informasi website' 
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
        <h1 className="text-3xl font-bold text-gray-800">Informasi Website</h1>
        <p className="text-gray-600 mt-2">
          Kelola pengaturan umum website, SEO, dan branding APPGI
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
          {/* General Information */}
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
              <svg className="w-6 h-6 mr-3 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Informasi Umum
            </h3>
            
            <div className="space-y-6">
              <div className="form-group">
                <label className="form-label">Judul Website *</label>
                <input
                  type="text"
                  name="site_title"
                  value={formData.site_title}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="APPGI - Asosiasi Perusahaan Pemboran Minyak, Gas, dan Panas Bumi Indonesia"
                  required
                />
                <p className="mt-2 text-sm text-gray-500">
                  Judul ini akan ditampilkan di tab browser dan hasil pencarian Google
                </p>
              </div>

              <div className="form-group">
                <label className="form-label">Deskripsi Website</label>
                <textarea
                  name="site_description"
                  value={formData.site_description}
                  onChange={handleInputChange}
                  className="form-textarea"
                  rows={4}
                  placeholder="Website resmi APPGI - Asosiasi Perusahaan Pemboran Minyak, Gas, dan Panas Bumi Indonesia..."
                />
                <p className="mt-2 text-sm text-gray-500">
                  Deskripsi untuk SEO dan preview di media sosial (maksimal 160 karakter)
                </p>
              </div>

              <div className="form-group">
                <label className="form-label">Copyright Footer</label>
                <input
                  type="text"
                  name="footer_copyright"
                  value={formData.footer_copyright}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Copyright © 2025 APPGI. All rights reserved."
                />
                <p className="mt-2 text-sm text-gray-500">
                  Teks copyright yang ditampilkan di footer website
                </p>
              </div>
            </div>
          </div>

          {/* Visual Assets */}
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
              <svg className="w-6 h-6 mr-3 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Aset Visual
            </h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Favicon */}
              <div className="form-group">
                <label className="form-label">Favicon</label>
                <div className="space-y-4">
                  {formData.favicon_url && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Favicon Saat Ini:</p>
                      <img
                        src={`https://api-inventory.isavralabel.com${formData.favicon_url}`}
                        alt="Favicon"
                        className="w-8 h-8 border border-gray-200 rounded"
                      />
                    </div>
                  )}
                  
                  <div>
                    <input
                      type="file"
                      id="favicon-upload"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, 'favicon')}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                    />
                    {files.favicon && (
                      <p className="mt-2 text-sm text-green-600">
                        File terpilih: {files.favicon.name}
                      </p>
                    )}
                  </div>
                  
                  <div className="text-sm text-gray-500">
                    <ul className="list-disc list-inside space-y-1">
                      <li>Format: ICO, PNG (disarankan 16x16 atau 32x32 pixel)</li>
                      <li>Ukuran maksimal: 1MB</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Hero Banner */}
              {/* <div className="form-group">
                <label className="form-label">Hero Banner</label>
                <div className="space-y-4">
                  {formData.hero_banner_url && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Banner Saat Ini:</p>
                      <img
                        src={`https://api-inventory.isavralabel.com${formData.hero_banner_url}`}
                        alt="Hero Banner"
                        className="w-full max-h-32 object-cover border border-gray-200 rounded-lg"
                      />
                    </div>
                  )}
                  
                  <div>
                    <input
                      type="file"
                      id="banner-upload"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, 'hero_banner')}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-secondary-50 file:text-secondary-700 hover:file:bg-secondary-100"
                    />
                    {files.hero_banner && (
                      <p className="mt-2 text-sm text-green-600">
                        File terpilih: {files.hero_banner.name}
                      </p>
                    )}
                  </div>
                  
                  <div className="text-sm text-gray-500">
                    <ul className="list-disc list-inside space-y-1">
                      <li>Format: JPG, PNG</li>
                      <li>Ukuran disarankan: 1920x600 pixel</li>
                      <li>Ukuran maksimal: 5MB</li>
                    </ul>
                  </div>
                </div>
              </div> */}
            </div>
          </div>

          {/* SEO Tips */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h4 className="text-lg font-medium text-blue-800 mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              Tips SEO & Branding
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-blue-700">
              <div>
                <h5 className="font-medium mb-2">SEO (Search Engine Optimization):</h5>
                <ul className="list-disc list-inside space-y-1">
                  <li>Gunakan kata kunci yang relevan di judul website</li>
                  <li>Buat deskripsi yang menarik dan informatif</li>
                  <li>Pastikan deskripsi tidak lebih dari 160 karakter</li>
                  <li>Gunakan nama organisasi yang konsisten</li>
                </ul>
              </div>
              <div>
                <h5 className="font-medium mb-2">Branding & Visual:</h5>
                <ul className="list-disc list-inside space-y-1">
                  <li>Favicon akan muncul di tab browser</li>
                  <li>Hero banner untuk halaman beranda (opsional)</li>
                  <li>Pastikan gambar memiliki kualitas yang baik</li>
                  <li>Gunakan format gambar yang sesuai</li>
                </ul>
              </div>
            </div>
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

export default AdminWebsiteInfo;