import React, { useState, useEffect } from 'react';
import { supabase, uploadImage } from '../../src/lib/supabase';
import { Trash2, Plus, Upload, X } from 'lucide-react';

interface Logo {
  id: string;
  name: string;
  url: string;
}

const LogoManager: React.FC = () => {
  const [logos, setLogos] = useState<Logo[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  
  // Form State
  const [name, setName] = useState('');
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageFile) return alert('Selecione uma imagem');
    
    setUploading(true);
    const imageUrl = await uploadImage(imageFile);
    
    if (imageUrl) {
      const { data, error } = await supabase.from('logos').insert([{
        name,
        url: imageUrl
      }]).select();

      if (!error && data) {
        setLogos([data[0], ...logos]);
        setShowForm(false);
        setName('');
        setImageFile(null);
      } else {
        alert('Erro ao salvar no banco de dados.');
      }
    }
    setUploading(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-display font-bold text-white">Gerenciar Logotipos</h2>
        <button 
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-matriz-purple px-4 py-2 rounded text-white font-bold uppercase text-sm hover:bg-purple-600 transition-colors"
        >
          <Plus size={18} /> Adicionar Novo
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[60] p-4">
          <div className="bg-matriz-dark border border-white/10 p-6 rounded max-w-md w-full">
            <div className="flex justify-between mb-4">
              <h3 className="text-xl font-bold text-white">Novo Logotipo</h3>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-white"><X /></button>
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
                <label className="block text-gray-400 text-xs uppercase mb-1">Imagem do Logo (PNG/JPG)</label>
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
                {uploading ? 'Enviando...' : 'Salvar Logo'}
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
              <button 
                onClick={() => handleDelete(logo.id)}
                className="absolute top-2 right-2 bg-red-500 p-1 rounded text-white opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 size={16} />
              </button>
              <div className="aspect-square flex items-center justify-center mb-2">
                <img src={logo.url} alt={logo.name} className="max-w-full max-h-full object-contain" />
              </div>
              <p className="text-center text-white text-sm font-bold truncate">{logo.name}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LogoManager;