import React, { useState } from 'react';
import { Plus, Trash2, Upload, Eye, X } from 'lucide-react';
import { SuratPeringatan } from '../types/Employee';

interface SPManagerProps {
  suratPeringatan: SuratPeringatan[];
  onChange: (sp: SuratPeringatan[]) => void;
  readOnly?: boolean;
}

export function SPManager({ suratPeringatan, onChange, readOnly = false }: SPManagerProps) {
  const [viewingPhoto, setViewingPhoto] = useState<string | null>(null);

  const addSP = () => {
    const newSP: SuratPeringatan = {
      id: Date.now().toString(),
      type: 'SP1',
      date: '',
      reason: '',
      photoUrl: ''
    };
    onChange([...suratPeringatan, newSP]);
  };

  const updateSP = (id: string, updates: Partial<SuratPeringatan>) => {
    const updated = suratPeringatan.map(sp => 
      sp.id === id ? { ...sp, ...updates } : sp
    );
    onChange(updated);
  };

  const deleteSP = (id: string) => {
    const filtered = suratPeringatan.filter(sp => sp.id !== id);
    onChange(filtered);
  };

  const handlePhotoUpload = (id: string, file: File) => {
    // Create a local URL for preview
    const photoUrl = URL.createObjectURL(file);
    updateSP(id, { photoFile: file, photoUrl });
  };

  const getSPColor = (type: string) => {
    switch (type) {
      case 'SP1':
        return 'border-orange-200 bg-orange-50';
      case 'SP2':
        return 'border-red-200 bg-red-50';
      case 'SP3':
        return 'border-red-300 bg-red-100';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  const getSPTextColor = (type: string) => {
    switch (type) {
      case 'SP1':
        return 'text-orange-800';
      case 'SP2':
        return 'text-red-800';
      case 'SP3':
        return 'text-red-900';
      default:
        return 'text-gray-800';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-base lg:text-lg font-semibold text-gray-900">
          Surat Peringatan (SP)
        </h4>
        {!readOnly && (
          <button
            type="button"
            onClick={addSP}
            className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            <Plus className="w-4 h-4 mr-1" />
            Tambah SP
          </button>
        )}
      </div>

      {suratPeringatan.length === 0 ? (
        <div className="text-center py-6 text-gray-500 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
          <p>Belum ada surat peringatan</p>
          {!readOnly && (
            <p className="text-sm mt-1">Klik "Tambah SP" untuk menambahkan surat peringatan</p>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {suratPeringatan.map((sp) => (
            <div
              key={sp.id}
              className={`border rounded-lg p-4 ${getSPColor(sp.type)}`}
            >
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-start">
                {/* SP Type Dropdown */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Jenis SP
                  </label>
                  {readOnly ? (
                    <span className={`inline-flex items-center px-2.5 py-1.5 rounded-md text-sm font-medium ${getSPTextColor(sp.type)} bg-white border`}>
                      {sp.type}
                    </span>
                  ) : (
                    <select
                      value={sp.type}
                      onChange={(e) => updateSP(sp.id, { type: e.target.value as 'SP1' | 'SP2' | 'SP3' })}
                      className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="SP1">SP1</option>
                      <option value="SP2">SP2</option>
                      <option value="SP3">SP3</option>
                    </select>
                  )}
                </div>

                {/* Date */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Tanggal
                  </label>
                  {readOnly ? (
                    <span className="text-sm text-gray-900">
                      {sp.date ? new Date(sp.date).toLocaleDateString('id-ID') : '-'}
                    </span>
                  ) : (
                    <input
                      type="date"
                      value={sp.date}
                      onChange={(e) => updateSP(sp.id, { date: e.target.value })}
                      className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  )}
                </div>

                {/* Reason */}
                <div className="md:col-span-4">
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Alasan
                  </label>
                  {readOnly ? (
                    <span className="text-sm text-gray-900">{sp.reason || '-'}</span>
                  ) : (
                    <input
                      type="text"
                      value={sp.reason}
                      onChange={(e) => updateSP(sp.id, { reason: e.target.value })}
                      placeholder="Masukkan alasan SP"
                      className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  )}
                </div>

                {/* Photo Upload */}
                <div className="md:col-span-3">
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Foto Surat
                  </label>
                  <div className="flex items-center space-x-2">
                    {!readOnly && (
                      <label className="inline-flex items-center px-2 py-1.5 bg-gray-100 text-gray-700 text-xs font-medium rounded-md hover:bg-gray-200 cursor-pointer transition-colors duration-200">
                        <Upload className="w-3 h-3 mr-1" />
                        Upload
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handlePhotoUpload(sp.id, file);
                          }}
                          className="hidden"
                        />
                      </label>
                    )}
                    
                    {sp.photoUrl && (
                      <button
                        type="button"
                        onClick={() => setViewingPhoto(sp.photoUrl!)}
                        className="inline-flex items-center px-2 py-1.5 bg-blue-100 text-blue-700 text-xs font-medium rounded-md hover:bg-blue-200 transition-colors duration-200"
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        Lihat
                      </button>
                    )}
                  </div>
                </div>

                {/* Delete Button */}
                {!readOnly && (
                  <div className="md:col-span-1 flex justify-end">
                    <button
                      type="button"
                      onClick={() => deleteSP(sp.id)}
                      className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-md transition-colors duration-200"
                      title="Hapus SP"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Photo Viewer Modal */}
      {viewingPhoto && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={() => setViewingPhoto(null)}
              className="absolute top-4 right-4 p-2 bg-white rounded-full text-gray-600 hover:text-gray-800 z-10"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={viewingPhoto}
              alt="Surat Peringatan"
              className="max-w-full max-h-full object-contain rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
}