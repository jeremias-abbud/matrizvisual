
import React, { useState, useEffect } from 'react';
import { supabase, uploadImage } from '../../src/lib/supabase';
import { Trash2, Plus, Upload, X, Edit2, GripVertical, Save } from 'lucide-react';
import { ProjectCategory } from '../../types';
import { INDUSTRIES } from '../../constants';
import ModernSelect from './ModernSelect';

interface Project {
  id: string;
  title: string;
  category: string;
  industry?: string;
  image_url: string;
  description: string;
  client: string;
  tags: string[];
  video_url?: string;
  display_order?: number;
}

const ProjectManager: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  // Reorder State
  const [isReordering, setIsReordering] = useState(false);
  const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);
  const [hasOrderChanged, setHasOrderChanged] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    title: '',
    category: ProjectCategory.LOGO,
    industry: '',
    description: '',
    client: '',
    tags: '', // comma separated string for input
    videoUrl: ''
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    // Ordenar por display_order (ASC) para respeitar a ordem visual definida
    const { data } = await supabase
        .from('projects')
        .select('*')
        .order('display_order', { ascending: true });
        
    if (data) setProjects(data);
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Tem certeza? Isso não pode ser desfeito.')) return;
    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (!error) {
      setProjects(prev => prev.filter(p => p.id !== id));
    } else {
        alert('Erro ao deletar. Verifique permissões.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageFile && !formData.videoUrl) return alert('Selecione uma imagem principal ou um link de vídeo');
    
    setUploading(true);
    let imageUrl = '';
    
    if (imageFile) {
        imageUrl = await uploadImage(imageFile) || '';
    } else {
        if (!imageUrl && !formData.videoUrl) {
             alert('Erro no upload da imagem');
             setUploading(false);
             return;
        }
    }
    
    if (imageUrl || formData.videoUrl) {
      const tagsArray = formData.tags.split(',').map(t => t.trim()).filter(t => t !== '');
      
      // Calcular a próxima ordem (último + 1)
      const maxOrder = projects.length > 0 ? Math.max(...projects.map(p => p.display_order || 0)) : 0;

      const { data, error } = await supabase.from('projects').insert([{
        title: formData.title,
        category: formData.category,
        industry: formData.industry || null, // Salva null se vazio
        description: formData.description,
        client: formData.client,
        tags: tagsArray,
        image_url: imageUrl || 'https://via.placeholder.com/800x600?text=Video+Project', // Placeholder se for só video
        video_url: formData.videoUrl || null,
        long_description: formData.description,
        display_order: maxOrder + 1
      }]).select();

      if (!error && data) {
        setProjects([...projects, data[0]]); // Adiciona no final
        setShowForm(false);
        setFormData({ title: '', category: ProjectCategory.LOGO, industry: '', description: '', client: '', tags: '', videoUrl: '' });
        setImageFile(null);
      } else {
        alert('Erro ao salvar projeto.');
        console.error(error);
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
    
    const newProjects = [...projects];
    const draggedItem = newProjects[draggedItemIndex];
    
    // Remove from old pos
    newProjects.splice(draggedItemIndex, 1);
    // Insert at new pos
    newProjects.splice(index, 0, draggedItem);
    
    setProjects(newProjects);
    setDraggedItemIndex(index);
    setHasOrderChanged(true);
  };

  const handleDragEnd = () => {
    setDraggedItemIndex(null);
  };

  const saveOrder = async () => {
    setUploading(true);
    
    // Create updates array
    const updates = projects.map((proj, index) => ({
        id: proj.id,
        display_order: index + 1
    }));

    try {
        const { error } = await supabase.from('projects').upsert(updates, { onConflict: 'id' });
        
        if (error) throw error;
        setHasOrderChanged(false);
        setIsReordering(false);
        // Opcional: Recarregar para garantir sincronia
        // fetchProjects(); 
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
        <h2 className="text-2xl font-display font-bold text-white">Gerenciar Portfólio</h2>
        
        <div className="flex gap-3">
             {isReordering ? (
                 <>
                    <button 
                        onClick={() => { setIsReordering(false); fetchProjects(); /* Reset */ }}
                        className="flex items-center gap-2 px-4 py-2 rounded text-gray-300 hover:text-white border border-white/10 text-sm font-bold uppercase"
                        disabled={uploading}
                    >
                        Cancelar
                    </button>
                    <button 
                        onClick={saveOrder}
                        disabled={!hasOrderChanged || uploading}
                        className={`flex items-center gap-2 px-4 py-2 rounded text-white font-bold uppercase text-sm transition-colors ${hasOrderChanged ? 'bg-green-600 hover:bg-green-500' : 'bg-gray-600 cursor-not-allowed'}`}
                    >
                        <Save size={18} /> {uploading ? 'Salvando...' : 'Salvar Ordem'}
                    </button>
                 </>
             ) : (
                <>
                    <button 
                        onClick={() => setIsReordering(true)}
                        className="flex items-center gap-2 px-4 py-2 rounded text-matriz-purple border border-matriz-purple hover:bg-matriz-purple hover:text-white transition-colors text-sm font-bold uppercase"
                    >
                        <GripVertical size={18} /> Reordenar
                    </button>
                    <button 
                        onClick={() => setShowForm(true)}
                        className="flex items-center gap-2 bg-matriz-purple px-4 py-2 rounded text-white font-bold uppercase text-sm hover:bg-purple-600 transition-colors"
                    >
                        <Plus size={18} /> Adicionar Projeto
                    </button>
                </>
             )}
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[60] p-4 overflow-y-auto">
          <div className="bg-matriz-dark border border-white/10 p-6 rounded max-w-2xl w-full my-10 relative">
            <div className="flex justify-between mb-4">
              <h3 className="text-xl font-bold text-white">Novo Projeto</h3>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-white"><X /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[80vh] overflow-y-auto custom-scrollbar pr-2">
              <div className="md:col-span-2">
                <label className="block text-gray-400 text-xs uppercase mb-1">Título do Projeto</label>
                <input 
                  type="text" 
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  className="w-full bg-black border border-white/10 p-2 text-white rounded"
                  required
                />
              </div>

              <div>
                <ModernSelect 
                  label="Categoria (Serviço)"
                  value={formData.category}
                  onChange={(val) => setFormData({...formData, category: val as ProjectCategory})}
                  options={Object.values(ProjectCategory)}
                  required
                />
              </div>

              <div>
                <ModernSelect 
                  label="Ramo de Negócio"
                  value={formData.industry}
                  onChange={(val) => setFormData({...formData, industry: val})}
                  options={INDUSTRIES}
                  placeholder="Selecione o Ramo"
                />
              </div>

              <div>
                <label className="block text-gray-400 text-xs uppercase mb-1">Cliente</label>
                <input 
                  type="text" 
                  value={formData.client}
                  onChange={e => setFormData({...formData, client: e.target.value})}
                  className="w-full bg-black border border-white/10 p-2 text-white rounded"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-gray-400 text-xs uppercase mb-1">Link de Vídeo (YouTube/Vimeo)</label>
                <input 
                  type="text" 
                  placeholder="Ex: https://www.youtube.com/watch?v=..."
                  value={formData.videoUrl}
                  onChange={e => setFormData({...formData, videoUrl: e.target.value})}
                  className="w-full bg-black border border-white/10 p-2 text-white rounded"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-gray-400 text-xs uppercase mb-1">Descrição Curta</label>
                <textarea 
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  className="w-full bg-black border border-white/10 p-2 text-white rounded"
                  rows={3}
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-gray-400 text-xs uppercase mb-1">Tags (separadas por vírgula)</label>
                <input 
                  type="text" 
                  placeholder="Ex: Branding, Social Media, 2024"
                  value={formData.tags}
                  onChange={e => setFormData({...formData, tags: e.target.value})}
                  className="w-full bg-black border border-white/10 p-2 text-white rounded"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-gray-400 text-xs uppercase mb-1">
                    Imagem Capa {formData.videoUrl && '(Opcional mas recomendado)'}
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

              <div className="md:col-span-2 pt-4">
                <button 
                    type="submit" 
                    disabled={uploading}
                    className="w-full bg-matriz-purple py-3 text-white font-bold rounded uppercase disabled:opacity-50"
                >
                    {uploading ? 'Enviando...' : 'Publicar Projeto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-white">Carregando...</div>
      ) : (
        <div className="space-y-2">
            {/* Header */}
            <div className="grid grid-cols-12 gap-4 bg-white/5 p-3 rounded text-xs uppercase text-gray-400 font-bold">
                <div className="col-span-1 text-center">#</div>
                <div className="col-span-2">Imagem</div>
                <div className="col-span-4">Título</div>
                <div className="col-span-3">Categoria / Indústria</div>
                <div className="col-span-2 text-right">Ações</div>
            </div>
            
            {/* List */}
            {projects.map((project, index) => (
                <div 
                    key={project.id} 
                    className={`grid grid-cols-12 gap-4 bg-black/40 border border-white/5 p-3 rounded items-center transition-colors ${
                        isReordering 
                        ? 'cursor-move hover:border-matriz-purple hover:bg-white/10' 
                        : 'hover:bg-white/5'
                    } ${
                        isReordering && draggedItemIndex === index ? 'opacity-50 border-dashed border-matriz-purple' : ''
                    }`}
                    draggable={isReordering}
                    onDragStart={() => handleDragStart(index)}
                    onDragEnter={() => handleDragEnter(index)}
                    onDragEnd={handleDragEnd}
                    onDragOver={(e) => e.preventDefault()}
                >
                    <div className="col-span-1 text-center text-gray-500 font-mono text-xs">
                        {isReordering ? <GripVertical size={16} className="mx-auto text-matriz-purple" /> : (index + 1)}
                    </div>
                    <div className="col-span-2 h-12 w-20 overflow-hidden rounded bg-black">
                        <img src={project.image_url} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="col-span-4 text-white font-bold truncate">{project.title}</div>
                    <div className="col-span-3">
                        <span className="px-2 py-1 bg-matriz-purple/20 text-matriz-purple text-xs rounded border border-matriz-purple/30 block w-fit mb-1">
                            {project.category}
                        </span>
                        {project.industry && (
                            <span className="text-xs text-gray-500 block truncate">
                                {project.industry}
                            </span>
                        )}
                    </div>
                    <div className="col-span-2 flex justify-end gap-2">
                        {!isReordering && (
                            <button 
                                onClick={() => handleDelete(project.id)}
                                className="p-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded transition-colors"
                                title="Excluir"
                            >
                                <Trash2 size={16} />
                            </button>
                        )}
                    </div>
                </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default ProjectManager;
