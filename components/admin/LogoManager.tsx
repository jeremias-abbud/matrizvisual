
import React, { useState, useEffect } from 'react';
import { supabase, uploadImage } from '../../src/lib/supabase';
import { Trash2, Plus, Upload, X, Edit2, GripVertical, Save } from 'lucide-react';
import { INDUSTRIES } from '../../constants';
import ModernSelect from './ModernSelect';

interface Logo {
  id: string;
  name: string;
  url: string;
  industry?: string;
  display_order: number;
}

const LogoManager: React.FC = () => {
  const [logos, setLogos] = useState<Logo[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Reorder State
  const [isReordering, setIsReordering] = useState(false);
  const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);
  const [hasOrderChanged, setHasOrderChanged] = useState(false);
  
  // Form State
  const [name, setName] = useState('');
  const [industry, setIndustry] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchLogos();
  }, []);

  const fetchLogos = async () => {
    // Ordenar por display_order (ASC) para respeitar a ordem manual
    const { data } = await supabase
        .from('logos')
        .select('*')
        .order('display_order', { ascending: true });
    
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
    setImageFile(null); 
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

    let imageUrl = null;
    if (imageFile) {
        imageUrl = await uploadImage(imageFile);
    }

    if (editingId) {
        const updates: any = { 
            name,
            industry: industry || null,
        };
        if (imageUrl) updates.url = imageUrl; 

        const { data, error } = await supabase
            .from('logos')
            .update(updates)
            .eq('id', editingId)
            .select();

        if (!error && data) {
            setLogos(prev => prev.map(l => l.id === editingId ? data[0] : l));
            resetForm();
        } else {
            alert('Erro ao atualizar logo.');
        }

    } else {
        if (!imageUrl) {
            alert('Por favor, envie uma imagem para o logo.');
            setUploading(false);
            return;
        }

        // Lógica para colocar no topo: Encontrar o menor display_order atual e subtrair 1
        // Se a lista estiver vazia, começa com 1000 (número arbitrário seguro)
        const currentMinOrder = logos.length > 0 
            ? Math.min(...logos.map(l => l.display_order)) 
            : 1000;
        
        const newOrder = currentMinOrder - 1;

        const { data, error } = await supabase
            .from('logos')
            .insert([{
                name,
                industry: industry || null,
                url: imageUrl,
                display_order: newOrder
            }])
            .select();

        if (!error && data) {
            // Adiciona no início da lista local para feedback imediato
            setLogos(prev => [data[0], ...prev]);
            resetForm();
        } else {
            console.error(error);
            alert('Erro ao criar logo.');
        }
    }
    
    setUploading(false);
  };

  // --- DRAG AND DROP LOGIC ---
  const handleDragStart = (index: number) => {
    setDraggedItemIndex(index);
  };

  const handleDragEnter = (index: number) => {
    if (draggedItemIndex === null || draggedItemIndex === index) return;
    
    const newLogos = [...logos];
    const draggedItem = newLogos[draggedItemIndex];
    
    // Remove from old pos
    newLogos.splice(draggedItemIndex, 1);
    // Insert at new pos
    newLogos.splice(index, 0, draggedItem);
    
    setLogos(newLogos);
    setDraggedItemIndex(index);
    setHasOrderChanged(true);
  };

  const handleDragEnd = () => {
    setDraggedItemIndex(null);
  };

  const saveOrder = async () => {
    setUploading(true);
    
    // Normaliza os orders para 1, 2, 3... ao salvar, para manter limpo
    const updates = logos.map((logo, index) => ({
        ...logo, 
        display_order: index + 1 
    }));
    
    try {
        const { error } = await supabase.from('logos').upsert(updates, { onConflict: 'id' });
        
        if (error) throw error;
        setLogos(updates); // Atualiza estado local com os novos números normalizados
        setHasOrderChanged(false);
        setIsReordering(false);
    } catch (err) {
        console.error(err);
        alert('Erro ao salvar a ordem.');
    } finally {
        setUploading(false);
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div>
            <h2 className="text-2xl font-display font-bold text-white">Gerenciar Logotipos</h2>
            <p className="text-sm text-gray-500 mt-1">Adicione, edite ou reordene os logotipos da sua galeria.</p>
        </div>
        
        <div className="flex gap-3 w-full md:w-auto">
             {isReordering ? (
                 <>
                    <button 
                        onClick={() => { setIsReordering(false); fetchLogos(); /* Reset */ }}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded text-gray-300 hover:text-white border border-white/10 text-sm font-bold uppercase"
                        disabled={uploading}
                    >
                        Cancelar
                    </button>
                    <button 
                        onClick={saveOrder}
                        disabled={!hasOrderChanged || uploading}
                        className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded text-white font-bold uppercase text-sm transition-colors ${hasOrderChanged ? 'bg-green-600 hover:bg-green-500' : 'bg-gray-600 cursor-not-allowed'}`}
                    >
                        <Save size={18} /> {uploading ? 'Salvando...' : 'Salvar Ordem'}
                    </button>
                 </>
             ) : (
                <>
                    <button 
                        onClick={() => setIsReordering(true)}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded text-matriz-purple border border-matriz-purple hover:bg-matriz-purple hover:text-white transition-colors text-sm font-bold uppercase"
                    >
                        <GripVertical size={18} /> Reordenar
                    </button>
                    <button 
                        onClick={() => { resetForm(); setShowForm(true); }}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-matriz-purple px-4 py-2 rounded text-white font-bold uppercase text-sm hover:bg-purple-600 transition-colors"
                    >
                        <Plus size={18} /> Adicionar Novo
                    </button>
                </>
             )}
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[60] p-4">
          <div className="bg-matriz-dark border border-white/10 p-6 rounded max-w-md w-full max-h-[90vh] overflow-y-auto custom-scrollbar relative">
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
                <ModernSelect 
                  label="Ramo de Negócio (Opcional)"
                  value={industry}
                  onChange={(val) => setIndustry(val)}
                  options={INDUSTRIES}
                  placeholder="Selecione o Ramo"
                />
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
                        required={!editingId}
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
        <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${isReordering ? 'bg-white/5 p-4 rounded border border-dashed border-white/20' : ''}`}>
          {logos.map((logo, index) => (
            <div 
                key={logo.id} 
                className={`bg-black/40 border border-white/5 rounded p-3 transition-all ${isReordering ? 'cursor-move hover:border-matriz-purple hover:bg-white/10' : ''}`}
                draggable={isReordering}
                onDragStart={() => handleDragStart(index)}
                onDragEnter={() => handleDragEnter(index)}
                onDragEnd={handleDragEnd}
                onDragOver={(e) => e.preventDefault()}
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                      {isReordering && <GripVertical size={20} className="text-matriz-purple flex-shrink-0" />}
                      <div className="w-16 h-16 bg-black/20 rounded border border-white/5 flex-shrink-0 flex items-center justify-center p-1">
                        <img src={logo.url} alt={logo.name} className="max-w-full max-h-full object-contain" />
                      </div>
                      <div className="flex-1 min-w-0">
                          <p className="text-white font-bold truncate">{logo.name}</p>
                          {logo.industry && <p className="text-gray-500 text-xs truncate">{logo.industry}</p>}
                      </div>
                  </div>
                  
                  {!isReordering && (
                      <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/5 sm:pt-0 sm:border-0">
                        <button 
                            onClick={() => handleEdit(logo)} 
                            className="flex-1 sm:flex-none justify-center px-3 py-2 bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white rounded transition-colors text-xs font-bold uppercase flex items-center gap-2" 
                            title="Editar"
                        >
                            <Edit2 size={16} /> <span className="sm:hidden">Editar</span>
                        </button>
                        <button 
                            onClick={() => handleDelete(logo.id)} 
                            className="flex-1 sm:flex-none justify-center px-3 py-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded transition-colors text-xs font-bold uppercase flex items-center gap-2" 
                            title="Excluir"
                        >
                            <Trash2 size={16} /> <span className="sm:hidden">Excluir</span>
                        </button>
                      </div>
                  )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LogoManager;
