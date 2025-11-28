

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
  long_description: string;
  client: string;
  tags: string[];
  video_url?: string;
  gallery?: string[];
  display_order?: number;
}

const ProjectManager: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const [isReordering, setIsReordering] = useState(false);
  const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);
  const [hasOrderChanged, setHasOrderChanged] = useState(false);
  
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    category: ProjectCategory.LOGO,
    industry: '',
    description: '',
    longDescription: '',
    client: '',
    tags: '',
    videoUrl: '',
    gallery: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const { data } = await supabase
        .from('projects')
        .select('*')
        .order('display_order', { ascending: true, nullsFirst: true })
        .order('created_at', { ascending: false });
        
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

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      category: project.category as ProjectCategory,
      industry: project.industry || '',
      description: project.description || '',
      longDescription: project.long_description || project.description || '',
      client: project.client || '',
      tags: project.tags?.join(', ') || '',
      videoUrl: project.video_url || '',
      gallery: project.gallery?.join(', ') || '',
    });
    setImageFile(null);
    setShowForm(true);
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingProject(null);
    setFormData({
      title: '',
      category: ProjectCategory.LOGO,
      industry: '',
      description: '',
      longDescription: '',
      client: '',
      tags: '',
      videoUrl: '',
      gallery: '',
    });
    setImageFile(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    let imageUrl: string | null = null;
    if (imageFile) {
        imageUrl = await uploadImage(imageFile);
        if (!imageUrl) {
             alert('Erro no upload da imagem');
             setUploading(false);
             return;
        }
    }
    
    const tagsArray = formData.tags.split(',').map(t => t.trim()).filter(Boolean);
    const galleryArray = formData.gallery.split(',').map(url => url.trim()).filter(Boolean);
    const longDesc = formData.longDescription || formData.description;
    
    if (editingProject) {
        const updates: any = {
            title: formData.title,
            category: formData.category,
            industry: formData.industry || null,
            description: formData.description,
            long_description: longDesc,
            client: formData.client,
            tags: tagsArray,
            video_url: formData.videoUrl || null,
            gallery: galleryArray.length > 0 ? galleryArray : null,
        };
        if (imageUrl) {
            updates.image_url = imageUrl;
        }

        const { data, error } = await supabase
            .from('projects')
            .update(updates)
            .eq('id', editingProject.id)
            .select();

        if (!error && data) {
            setProjects(prev => prev.map(p => p.id === editingProject.id ? data[0] : p));
            resetForm();
        } else {
            alert('Erro ao atualizar projeto.');
            console.error(error);
        }
    } else {
        if (!imageUrl && !formData.videoUrl) {
            alert('Para um novo projeto, adicione uma imagem de capa.');
            setUploading(false);
            return;
        }
      
        const newProjectData = {
            title: formData.title,
            category: formData.category,
            industry: formData.industry || null,
            description: formData.description,
            long_description: longDesc,
            client: formData.client,
            tags: tagsArray,
            image_url: imageUrl || 'https://via.placeholder.com/800x600?text=Video+Project',
            video_url: formData.videoUrl || null,
            gallery: galleryArray.length > 0 ? galleryArray : null,
            // display_order is intentionally omitted to be null by default
        };

        const { data, error } = await supabase
            .from('projects')
            .insert([newProjectData])
            .select();

        if (!error && data) {
            setProjects(prev => [data[0], ...prev]); // Add to the beginning of the list
            resetForm();
        } else {
            alert('Erro ao salvar projeto.');
            console.error(error);
        }
    }
    setUploading(false);
  };

  const handleDragStart = (index: number) => {
    setDraggedItemIndex(index);
  };

  const handleDragEnter = (index: number) => {
    if (draggedItemIndex === null || draggedItemIndex === index) return;
    const newProjects = [...projects];
    const draggedItem = newProjects.splice(draggedItemIndex, 1)[0];
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
    const updates = projects.map((proj, index) => ({
        ...proj,
        display_order: index + 1
    }));
    try {
        const { error } = await supabase.from('projects').upsert(updates, { onConflict: 'id' });
        if (error) throw error;
        setHasOrderChanged(false);
        setIsReordering(false);
    } catch (err) {
        console.error(err);
        alert('Erro ao salvar a ordem. Verifique o console.');
    } finally {
        setUploading(false);
    }
  };

  // Determina se a descrição é obrigatória
  const isDescriptionRequired = formData.category !== ProjectCategory.LOGO;
  // Label dinâmico para o campo de link
  const linkLabel = formData.category === ProjectCategory.WEB 
    ? "Link do Site (URL)" 
    : "Link de Vídeo (YouTube/Vimeo)";

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-2xl font-display font-bold text-white">Gerenciar Portfólio</h2>
        <div className="flex gap-3">
             {isReordering ? (
                 <>
                    <button onClick={() => { setIsReordering(false); fetchProjects(); }} className="flex items-center gap-2 px-4 py-2 rounded text-gray-300 hover:text-white border border-white/10 text-sm font-bold uppercase" disabled={uploading}>Cancelar</button>
                    <button onClick={saveOrder} disabled={!hasOrderChanged || uploading} className={`flex items-center gap-2 px-4 py-2 rounded text-white font-bold uppercase text-sm transition-colors ${hasOrderChanged ? 'bg-green-600 hover:bg-green-500' : 'bg-gray-600 cursor-not-allowed'}`}>
                        <Save size={18} /> {uploading ? 'Salvando...' : 'Salvar Ordem'}
                    </button>
                 </>
             ) : (
                <>
                    <button onClick={() => setIsReordering(true)} className="flex items-center gap-2 px-4 py-2 rounded text-matriz-purple border border-matriz-purple hover:bg-matriz-purple hover:text-white transition-colors text-sm font-bold uppercase">
                        <GripVertical size={18} /> Reordenar
                    </button>
                    <button onClick={() => { resetForm(); setShowForm(true); }} className="flex items-center gap-2 bg-matriz-purple px-4 py-2 rounded text-white font-bold uppercase text-sm hover:bg-purple-600 transition-colors">
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
              <h3 className="text-xl font-bold text-white">{editingProject ? 'Editar Projeto' : 'Novo Projeto'}</h3>
              <button onClick={resetForm} className="text-gray-400 hover:text-white"><X /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[80vh] overflow-y-auto custom-scrollbar pr-2">
              <div className="md:col-span-2">
                <label className="block text-gray-400 text-xs uppercase mb-1">Título do Projeto <span className="text-matriz-purple">*</span></label>
                <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-black border border-white/10 p-2 text-white rounded" required />
              </div>
              <div>
                <ModernSelect label="Categoria (Serviço)" value={formData.category} onChange={(val) => setFormData({...formData, category: val as ProjectCategory})} options={Object.values(ProjectCategory).filter(c => c !== ProjectCategory.ALL)} required />
              </div>
              <div>
                <ModernSelect label="Ramo de Negócio" value={formData.industry} onChange={(val) => setFormData({...formData, industry: val})} options={INDUSTRIES} placeholder="Selecione o Ramo" />
              </div>
              <div>
                <label className="block text-gray-400 text-xs uppercase mb-1">Cliente</label>
                <input type="text" value={formData.client} onChange={e => setFormData({...formData, client: e.target.value})} className="w-full bg-black border border-white/10 p-2 text-white rounded" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-gray-400 text-xs uppercase mb-1">{linkLabel}</label>
                <input type="text" placeholder="Ex: https://..." value={formData.videoUrl} onChange={e => setFormData({...formData, videoUrl: e.target.value})} className="w-full bg-black border border-white/10 p-2 text-white rounded" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-gray-400 text-xs uppercase mb-1">Descrição Curta (para o card) {isDescriptionRequired && <span className="text-matriz-purple">*</span>}</label>
                <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-black border border-white/10 p-2 text-white rounded" rows={2} required={isDescriptionRequired} />
              </div>
              <div className="md:col-span-2">
                <label className="block text-gray-400 text-xs uppercase mb-1">Descrição Longa (para o detalhe)</label>
                <textarea value={formData.longDescription} onChange={e => setFormData({...formData, longDescription: e.target.value})} className="w-full bg-black border border-white/10 p-2 text-white rounded" rows={4} />
              </div>
              <div className="md:col-span-2">
                <label className="block text-gray-400 text-xs uppercase mb-1">Tags (separadas por vírgula)</label>
                <input type="text" placeholder="Ex: Branding, Social Media, 2024" value={formData.tags} onChange={e => setFormData({...formData, tags: e.target.value})} className="w-full bg-black border border-white/10 p-2 text-white rounded" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-gray-400 text-xs uppercase mb-1">Galeria (URLs separadas por vírgula)</label>
                <textarea placeholder="Ex: https://..., https://..." value={formData.gallery} onChange={e => setFormData({...formData, gallery: e.target.value})} className="w-full bg-black border border-white/10 p-2 text-white rounded" rows={3} />
              </div>
              <div className="md:col-span-2">
                <label className="block text-gray-400 text-xs uppercase mb-1">
                    {editingProject ? 'Trocar Imagem de Capa (Opcional)' : 'Imagem de Capa *'}
                </label>
                <div className="border border-dashed border-white/20 p-4 text-center rounded bg-black/50 hover:bg-black cursor-pointer relative">
                    <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files?.[0] || null)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" required={!editingProject} />
                    <div className="flex flex-col items-center gap-2 text-gray-400">
                        <Upload size={24} />
                        <span className="text-sm">{imageFile ? imageFile.name : 'Clique para enviar imagem'}</span>
                    </div>
                </div>
              </div>
              <div className="md:col-span-2 pt-4">
                <button type="submit" disabled={uploading} className="w-full bg-matriz-purple py-3 text-white font-bold rounded uppercase disabled:opacity-50">
                    {uploading ? 'Salvando...' : (editingProject ? 'Atualizar Projeto' : 'Publicar Projeto')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-white">Carregando...</div>
      ) : (
        <div className="space-y-3">
            <div className="hidden md:grid grid-cols-12 gap-4 bg-white/5 p-3 rounded text-xs uppercase text-gray-400 font-bold">
                <div className="col-span-1 text-center">#</div>
                <div className="col-span-3">Imagem</div>
                <div className="col-span-5">Título</div>
                <div className="col-span-3 text-right">Ações</div>
            </div>
            
            {projects.map((project, index) => (
              <div 
                key={project.id} 
                className={`bg-black/40 border border-white/5 rounded transition-colors ${
                  isReordering ? 'cursor-move hover:border-matriz-purple hover:bg-white/10' : 'hover:bg-white/5'
                } ${
                  isReordering && draggedItemIndex === index ? 'opacity-50 border-dashed border-matriz-purple' : ''
                }`}
                draggable={isReordering} 
                onDragStart={() => handleDragStart(index)} 
                onDragEnter={() => handleDragEnter(index)} 
                onDragEnd={handleDragEnd} 
                onDragOver={(e) => e.preventDefault()}
              >
                {/* Mobile Card Layout */}
                <div className="md:hidden flex flex-col gap-3 p-3">
                    <div className="flex items-start gap-4">
                        {isReordering && <GripVertical size={20} className="text-matriz-purple mt-1 flex-shrink-0" />}
                        <div className="h-16 w-16 overflow-hidden rounded bg-black flex-shrink-0">
                            <img src={project.image_url} alt={project.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-white font-bold break-words">{project.title}</p>
                            <span className="px-2 py-0.5 mt-1 inline-block bg-matriz-purple/20 text-matriz-purple text-[10px] rounded border border-matriz-purple/30">
                                {project.category}
                            </span>
                        </div>
                    </div>
                    <div className="border-t border-white/5 pt-3 flex justify-end items-center">
                        {!isReordering && (
                        <div className="flex justify-end gap-2">
                            <button onClick={() => handleEdit(project)} className="p-2 bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white rounded transition-colors" title="Editar"><Edit2 size={16} /></button>
                            <button onClick={() => handleDelete(project.id)} className="p-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded transition-colors" title="Excluir"><Trash2 size={16} /></button>
                        </div>
                        )}
                    </div>
                </div>

                {/* Desktop Table Row Layout */}
                <div className="hidden md:grid md:grid-cols-12 gap-4 items-center p-3">
                    <div className="col-span-1 text-center text-gray-500 font-mono text-xs">
                        {isReordering ? <GripVertical size={16} className="mx-auto text-matriz-purple" /> : (index + 1)}
                    </div>
                    <div className="col-span-3 h-12 w-full overflow-hidden rounded bg-black">
                        <img src={project.image_url} alt={project.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="col-span-5">
                      <p className="text-white font-bold truncate">{project.title}</p>
                      <span className="px-2 py-1 bg-matriz-purple/20 text-matriz-purple text-xs rounded border border-matriz-purple/30 mt-1 inline-block">
                          {project.category}
                      </span>
                    </div>
                    <div className="col-span-3 flex justify-end gap-2">
                        {!isReordering && (<>
                            <button onClick={() => handleEdit(project)} className="p-2 bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white rounded transition-colors" title="Editar"><Edit2 size={16} /></button>
                            <button onClick={() => handleDelete(project.id)} className="p-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded transition-colors" title="Excluir"><Trash2 size={16} /></button>
                        </>)}
                    </div>
                </div>
            </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default ProjectManager;
