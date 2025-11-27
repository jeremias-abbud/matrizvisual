
import React, { useState, useEffect } from 'react';
import { supabase, uploadImage } from '../../src/lib/supabase';
import { Trash2, Plus, Upload, X, Edit2 } from 'lucide-react';
import { INDUSTRIES } from '../../constants';

interface Logo {
  id: string;
  name: string;
  url: string;
  industry?: string;
}

const LogoManager: React.FC = () => {
  const [logos, setLogos] = useState<Logo[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form State
  const [name, setName] = useState('');
  const [industry, setIndustry] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchLogos();
  }, []);

  const fetchLogos = async () => {
    const { data } = await supabase.from('logos').select('*').order('created_at', { ascending: false });
    if (data) setLogos(data);
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja apagar este logo?')) return;
    
    const { error } = await supabase.from('logos').delete().eq('id', id);
    if (!error) {
      setLogos(prev => prev.filter(l => l.id !== id));
    } else {
      alert('Erro ao deletar. Verifique suas permissões.');
    }
  };

  const handleEdit = (logo: Logo) => {
    setEditingId(logo.id);
    setName(logo.name);
    setIndustry(logo.industry || '');
    setImageFile(null); // Reset file input, user might not want to change image
    setShowForm(true);
  };

  const resetForm = () => {
    setShowForm(false);
    setName('');
    setIndustry('');
    setImageFile(null);
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    // 1. Upload Image if exists
    let imageUrl = null;
    if (imageFile) {
        imageUrl = await uploadImage(imageFile);
    }

    if (editingId) {
        // --- UPDATE MODE ---
        const updates: any = { 
            name,
            industry: industry || null
        };
        if (imageUrl) updates.url = imageUrl; // Only update URL if a new image was uploaded

        const { error } = await supabase
            .from('logos')
            .update(updates)
            .eq('id', editingId);

        if (!error) {
            setLogos(prev => prev.map(l => l.id === editingId ? { ...l, ...updates } : l));
            resetForm();
        } else {
            alert('Erro ao atualizar logo.');
        }

    } else {
        // --- CREATE MODE ---
        if (!imageUrl) {
            alert('Selecione uma imagem para criar um novo logo.');
            setUploading(false);
            return;
        }

        const { data, error } = await supabase.from('logos').insert([{
            name,
            industry: industry || null,
            url: imageUrl
        }]).select();

        if (!error && data) {
            setLogos([data[0], ...logos]);
            resetForm();
        } else {
            alert('Erro ao criar logo.');
        }
    }
    
    setUploading(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-display font-bold text-white">Gerenciar Logotipos</h2>
        <button 
          onClick={() => { resetForm(); setShowForm(true); }}
          className="flex items-center gap-2 bg-matriz-purple px-4 py-2 rounded text-white font-bold uppercase text-sm hover:bg-purple-600 transition-colors"
        >
          <Plus size={18} /> Adicionar Novo
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[60] p-4">
          <div className="bg-matriz-dark border border-white/10 p-6 rounded max-w-md w-full max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="flex justify-between mb-4">
              <h3 className="text-xl font-bold text-white">
                {editingId ? 'Editar Logotipo' : 'Novo Logotipo'}
              </h3>
              <button onClick={resetForm} className="text-gray-400 hover:text-white"><X /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-400 text-xs uppercase mb-1">Nome do Cliente</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full bg-black border border-white/10 p-2 text-white rounded"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-400 text-xs uppercase mb-1">Ramo de Negócio (Opcional)</label>
                <select 
                  value={industry}
                  onChange={e => setIndustry(e.target.value)}
                  className="w-full bg-black border border-white/10 p-2 text-white rounded custom-scrollbar"
                >
                    <option value="">-- Selecione ou deixe em branco --</option>
                    {INDUSTRIES.map(ind => (
                        <option key={ind} value={ind}>{ind}</option>
                    ))}
                </select>
              </div>
              
              <div>
                <label className="block text-gray-400 text-xs uppercase mb-1">
                    {editingId ? 'Trocar Imagem (Opcional)' : 'Imagem do Logo (PNG/JPG)'}
                </label>
                <div className="border border-dashed border-white/20 p-4 text-center rounded bg-black/50 hover:bg-black cursor-pointer relative">
                    <input 
                        type="file" 
                        accept="image/*"
                        onChange={e => setImageFile(e.target.files?.[0] || null)}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="flex flex-col items-center gap-2 text-gray-400">
                        <Upload size={24} />
                        <span className="text-sm">{imageFile ? imageFile.name : 'Clique para enviar imagem'}</span>
                    </div>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={uploading}
                className="w-full bg-matriz-purple py-3 text-white font-bold rounded uppercase disabled:opacity-50"
              >
                {uploading ? 'Salvando...' : (editingId ? 'Atualizar Logo' : 'Salvar Logo')}
              </button>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-white">Carregando...</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {logos.map(logo => (
            <div key={logo.id} className="bg-white/5 border border-white/10 rounded p-4 relative group">
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <button 
                    onClick={() => handleEdit(logo)}
                    className="bg-blue-600 p-1.5 rounded text-white hover:bg-blue-500 transition-colors"
                    title="Editar"
                >
                    <Edit2 size={14} />
                </button>
                <button 
                    onClick={() => handleDelete(logo.id)}
                    className="bg-red-600 p-1.5 rounded text-white hover:bg-red-500 transition-colors"
                    title="Excluir"
                >
                    <Trash2 size={14} />
                </button>
              </div>
              
              <div className="aspect-square flex items-center justify-center mb-2 bg-black/20 rounded border border-white/5">
                <img src={logo.url} alt={logo.name} className="max-w-full max-h-full object-contain p-2" />
              </div>
              <p className="text-center text-white text-sm font-bold truncate">{logo.name}</p>
              {logo.industry && (
                  <p className="text-center text-gray-500 text-[10px] uppercase truncate mt-1 px-1 bg-white/5 rounded">
                      {logo.industry}
                  </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LogoManager;
