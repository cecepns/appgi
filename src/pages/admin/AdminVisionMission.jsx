import { useState, useEffect } from 'react';
import { publicAPI, adminAPI } from '../../utils/api';

const AdminVisionMission = () => {
  const [formData, setFormData] = useState({
    visi: '',
    misi_list: []
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    publicAPI.getVisiMisi()
      .then(response => {
        const data = response.data;
        setFormData({
          visi: data.visi || '',
          misi_list: data.misi_list || []
        });
        setInitialLoading(false);
      })
      .catch(error => {
        console.error('Error loading visi misi:', error);
        setMessage({ type: 'error', text: 'Gagal memuat data visi misi' });
        setInitialLoading(false);
      });
  }, []);

  const handleVisiChange = (e) => {
    setFormData(prev => ({
      ...prev,
      visi: e.target.value
    }));
  };

  const handleMisiChange = (index, value) => {
    const newMisiList = [...formData.misi_list];
    newMisiList[index] = {
      ...newMisiList[index],
      teks_misi: value
    };
    setFormData(prev => ({
      ...prev,
      misi_list: newMisiList
    }));
  };

  const addMisi = () => {
    setFormData(prev => ({
      ...prev,
      misi_list: [
        ...prev.misi_list,
        {
          id: Date.now(), // temporary ID
          urutan: prev.misi_list.length + 1,
          teks_misi: ''
        }
      ]
    }));
  };

  const removeMisi = (index) => {
    const newMisiList = formData.misi_list.filter((_, i) => i !== index);
    // Update urutan
    const updatedMisiList = newMisiList.map((misi, i) => ({
      ...misi,
      urutan: i + 1
    }));
    
    setFormData(prev => ({
      ...prev,
      misi_list: updatedMisiList
    }));
  };

  const moveMisiUp = (index) => {
    if (index === 0) return;
    
    const newMisiList = [...formData.misi_list];
    [newMisiList[index], newMisiList[index - 1]] = [newMisiList[index - 1], newMisiList[index]];
    
    // Update urutan
    const updatedMisiList = newMisiList.map((misi, i) => ({
      ...misi,
      urutan: i + 1
    }));
    
    setFormData(prev => ({
      ...prev,
      misi_list: updatedMisiList
    }));
  };

  const moveMisiDown = (index) => {
    if (index === formData.misi_list.length - 1) return;
    
    const newMisiList = [...formData.misi_list];
    [newMisiList[index], newMisiList[index + 1]] = [newMisiList[index + 1], newMisiList[index]];
    
    // Update urutan
    const updatedMisiList = newMisiList.map((misi, i) => ({
      ...misi,
      urutan: i + 1
    }));
    
    setFormData(prev => ({
      ...prev,
      misi_list: updatedMisiList
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    // Validate
    if (!formData.visi.trim()) {
      setMessage({ type: 'error', text: 'Visi harus diisi' });
      setLoading(false);
      return;
    }

    const validMisiList = formData.misi_list.filter(misi => misi.teks_misi.trim());
    if (validMisiList.length === 0) {
      setMessage({ type: 'error', text: 'Minimal harus ada satu misi' });
      setLoading(false);
      return;
    }

    try {
      await adminAPI.updateVisiMisi({
        visi: formData.visi,
        misi_list: validMisiList
      });
      
      setMessage({ type: 'success', text: 'Visi & Misi berhasil diperbarui!' });
      
      // Reload data
      const response = await publicAPI.getVisiMisi();
      const data = response.data;
      setFormData({
        visi: data.visi || '',
        misi_list: data.misi_list || []
      });
    } catch (error) {
      console.error('Error updating visi misi:', error);
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.error || 'Gagal memperbarui visi & misi' 
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
        <h1 className="text-3xl font-bold text-gray-800">Visi & Misi</h1>
        <p className="text-gray-600 mt-2">
          Kelola visi organisasi dan daftar misi APPGI
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
          {/* Visi Section */}
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <svg className="w-6 h-6 mr-3 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Visi Organisasi
            </h3>
            
            <div className="form-group">
              <label className="form-label">Visi *</label>
              <textarea
                value={formData.visi}
                onChange={handleVisiChange}
                className="form-textarea"
                rows={4}
                placeholder="Masukkan visi organisasi..."
                required
              />
              <p className="mt-2 text-sm text-gray-500">
                Visi menggambarkan cita-cita dan tujuan jangka panjang organisasi.
              </p>
            </div>
          </div>

          {/* Misi Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                <svg className="w-6 h-6 mr-3 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Misi Organisasi
              </h3>
              <button
                type="button"
                onClick={addMisi}
                className="btn btn-secondary"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Tambah Misi
              </button>
            </div>

            {formData.misi_list.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h4 className="text-lg font-medium text-gray-700 mb-2">Belum ada misi</h4>
                <p className="text-gray-500 mb-4">Tambahkan misi pertama untuk organisasi</p>
                <button
                  type="button"
                  onClick={addMisi}
                  className="btn btn-primary"
                >
                  Tambah Misi Pertama
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {formData.misi_list.map((misi, index) => (
                  <div key={misi.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 mt-2">
                        <span className="inline-flex items-center justify-center w-8 h-8 bg-secondary-100 text-secondary-600 rounded-full text-sm font-semibold">
                          {index + 1}
                        </span>
                      </div>
                      
                      <div className="flex-1">
                        <textarea
                          value={misi.teks_misi}
                          onChange={(e) => handleMisiChange(index, e.target.value)}
                          className="form-textarea"
                          rows={3}
                          placeholder={`Masukkan misi ke-${index + 1}...`}
                        />
                      </div>
                      
                      <div className="flex-shrink-0 flex flex-col space-y-2">
                        <button
                          type="button"
                          onClick={() => moveMisiUp(index)}
                          disabled={index === 0}
                          className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                          title="Pindah ke atas"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                          </svg>
                        </button>
                        
                        <button
                          type="button"
                          onClick={() => moveMisiDown(index)}
                          disabled={index === formData.misi_list.length - 1}
                          className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                          title="Pindah ke bawah"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        
                        <button
                          type="button"
                          onClick={() => removeMisi(index)}
                          className="p-2 text-red-400 hover:text-red-600"
                          title="Hapus misi"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <p className="mt-4 text-sm text-gray-500">
              Misi menggambarkan langkah-langkah strategis untuk mencapai visi. Anda dapat mengatur urutan dengan tombol panah.
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

export default AdminVisionMission;