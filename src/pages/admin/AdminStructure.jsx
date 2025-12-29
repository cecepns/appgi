import { useState, useEffect } from 'react';
import { publicAPI, adminAPI } from '../../utils/api';

const AdminStructure = () => {
  const [formData, setFormData] = useState({
    periode: '',
    deskripsi: '',
    gambar_bagan: ''
  });
  const [baganFile, setBaganFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    publicAPI.getStruktur()
      .then(response => {
        const data = response.data;
        setFormData({
          periode: data.periode || '',
          deskripsi: data.deskripsi || '',
          gambar_bagan: data.gambar_bagan || ''
        });
        setInitialLoading(false);
      })
      .catch(error => {
        console.error('Error loading struktur:', error);
        setMessage({ type: 'error', text: 'Gagal memuat data struktur' });
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
      setBaganFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const submitData = { ...formData };
      if (baganFile) {
        submitData.gambar_bagan = baganFile;
      }

      await adminAPI.updateStruktur(submitData);
      setMessage({ type: 'success', text: 'Struktur organisasi berhasil diperbarui!' });
      setBaganFile(null);
      
      // Reset file input
      const fileInput = document.getElementById('bagan-upload');
      if (fileInput) fileInput.value = '';
      
      // Reload data
      const response = await publicAPI.getStruktur();
      const data = response.data;
      setFormData({
        periode: data.periode || '',
        deskripsi: data.deskripsi || '',
        gambar_bagan: data.gambar_bagan || ''
      });
    } catch (error) {
      console.error('Error updating struktur:', error);
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.error || 'Gagal memperbarui struktur organisasi' 
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
        <h1 className="text-3xl font-bold text-gray-800">Struktur Organisasi</h1>
        <p className="text-gray-600 mt-2">
          Kelola informasi dan bagan struktur organisasi APPGI
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Form Fields */}
            <div className="space-y-6">
              <div className="form-group">
                <label className="form-label">Periode *</label>
                <input
                  type="text"
                  name="periode"
                  value={formData.periode}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Contoh: 2024 - 2029"
                  required
                />
                <p className="mt-2 text-sm text-gray-500">
                  Periode kepemimpinan struktur organisasi saat ini.
                </p>
              </div>

              <div className="form-group">
                <label className="form-label">Deskripsi</label>
                <textarea
                  name="deskripsi"
                  value={formData.deskripsi}
                  onChange={handleInputChange}
                  className="form-textarea"
                  rows={6}
                  placeholder="Deskripsi tentang struktur organisasi, pembagian tugas, dan tanggung jawab..."
                />
                <p className="mt-2 text-sm text-gray-500">
                  Penjelasan tentang struktur organisasi dan pembagian tugas.
                </p>
              </div>
            </div>

            {/* Image Upload and Preview */}
            <div className="space-y-6">
              <div className="form-group">
                <label className="form-label">Bagan Struktur Organisasi</label>
                
                {/* Current Image */}
                {formData.gambar_bagan && (
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-3">Bagan Saat Ini:</p>
                    <img
                      src={`https://api-inventory.isavralabel.com/appgi${formData.gambar_bagan}`}
                      alt="Bagan Struktur Organisasi"
                      className="w-full max-h-64 object-contain border border-gray-200 rounded-lg"
                    />
                  </div>
                )}
                
                {/* File Upload */}
                <div className="space-y-3">
                  <input
                    type="file"
                    id="bagan-upload"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                  />
                  
                  {baganFile && (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-sm text-green-700">
                        <svg className="w-4 h-4 inline mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        File terpilih: {baganFile.name}
                      </p>
                    </div>
                  )}
                  
                  <div className="text-sm text-gray-500">
                    <ul className="list-disc list-inside space-y-1">
                      <li>Format: JPG, PNG, atau GIF</li>
                      <li>Ukuran maksimal: 5MB</li>
                      <li>Disarankan ukuran minimal 1000x600 pixel untuk kualitas terbaik</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {!formData.gambar_bagan && !baganFile && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <div>
                  <h4 className="text-sm font-medium text-yellow-800 mb-1">Bagan Belum Diunggah</h4>
                  <p className="text-sm text-yellow-700">
                    Untuk menampilkan struktur organisasi yang lengkap, sebaiknya unggah bagan struktur organisasi.
                  </p>
                </div>
              </div>
            </div>
          )}

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

export default AdminStructure;