
import React, { useState, useEffect } from 'react';
import { supabase, uploadImage } from '../../src/lib/supabase';
import { Trash2, Plus, Upload, X, Edit2, GripVertical, Save, Image as ImageIcon, Video, Info } from 'lucide-react';
import { ProjectCategory } from '../../types';
import { INDUSTRIES } from '../../constants';
import ModernSelect from './ModernSelect';
import { getVideoThumbnail } from '../../src/lib/videoHelper';

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
  
  // Form States
  const [formData, setFormData] = useState({
    title: '',
    category: ProjectCategory.DESIGN,
    industry: '',
    description: '',
    longDescription: '',
    client: '',
    tags: '',
    videoUrl: '',
  });
  
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]); // New files to upload
  const [existingGalleryUrls, setExistingGalleryUrls] = useState<string[]>([]); // URLs already on server

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
    });
    
    // Set gallery state
    setExistingGalleryUrls(project.gallery || []);
    setGalleryFiles([]);
    setCoverImageFile(null);
    
    setShowForm(true);
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingProject(null);
    setFormData({
      title: '',
      category: ProjectCategory.DESIGN,
      industry: '',
      description: '',
      longDescription: '',
      client: '',
      tags: '',
      videoUrl: '',
    });
    setCoverImageFile(null);
    setGalleryFiles([]);
    setExistingGalleryUrls([]);
  };

  // Gallery Handlers
  const handleGalleryFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
          setGalleryFiles(prev => [...prev, ...Array.from(e.target.files!)]);
      }
  };

  const removeGalleryFile = (index: number) => {
      setGalleryFiles(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingGalleryImage = (index: number) => {
      setExistingGalleryUrls(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    try {
        // 1. Determine Cover Image URL
        let coverImageUrl: string | null = null;
        
        // a) Se usuário fez upload manual
        if (coverImageFile) {
            coverImageUrl = await uploadImage(coverImageFile);
            if (!coverImageUrl) throw new Error('Falha no upload da capa');
        } 
        // b) Se não fez upload, mas tem link de vídeo -> Tenta pegar a thumbnail automática
        else if (!editingProject && formData.videoUrl) {
            const videoThumb = await getVideoThumbnail(formData.videoUrl);
            if (videoThumb) {
                coverImageUrl = videoThumb;
            }
        }

        // Validação Final: Precisa de uma imagem (seja upload, seja do vídeo, ou já existente na edição)
        if (!coverImageUrl && !editingProject) {
            alert('É obrigatório ter uma imagem de capa. Faça o upload OU insira um link de vídeo válido (YouTube/Vimeo).');
            setUploading(false);
            return;
        }

        // 2. Upload New Gallery Images
        const newGalleryUrls: string[] = [];
        for (const file of galleryFiles) {
            const url = await uploadImage(file);
            if (url) newGalleryUrls.push(url);
        }

        // Combine existing URLs with new ones
        const finalGallery = [...existingGalleryUrls, ...newGalleryUrls];
        const tagsArray = formData.tags.split(',').map(t => t.trim()).filter(Boolean);
        const longDesc = formData.longDescription || formData.description;
        
        const commonData = {
            title: formData.title,
            category: formData.category,
            industry: formData.industry || null,
            description: formData.description,
            long_description: longDesc,
            client: formData.client,
            tags: tagsArray,
            video_url: formData.videoUrl || null,
            gallery: finalGallery.length > 0 ? finalGallery : null,
        };

        if (editingProject) {
            const updates: any = { ...commonData };
            if (coverImageUrl) updates.image_url = coverImageUrl;

            const { data, error } = await supabase
                .from('projects')
                .update(updates)
                .eq('id', editingProject.id)
                .select();

            if (error) throw error;
            if (data) setProjects(prev => prev.map(p => p.id === editingProject.id ? data[0] : p));

        } else {
            const { data, error } = await supabase
                .from('projects')
                .insert([{
                    ...commonData,
                    image_url: coverImageUrl || 'https://via.placeholder.com/800x600?text=No+Image',
                }])
                .select();

            if (error) throw error;
            if (data) setProjects(prev => [data[0], ...prev]);
        }
        
        resetForm();

    } catch (err) {
        console.error(err);
        alert('Ocorreu um erro ao salvar o projeto.');
    } finally {
        setUploading(false);
    }
  };

  // --- Drag & Drop logic remains same ---
  const handleDragStart = (index: number) => setDraggedItemIndex(index);
  const handleDragEnter = (index: number) => {
    if (draggedItemIndex === null || draggedItemIndex === index) return;
    const newProjects = [...projects];
    const draggedItem = newProjects.splice(draggedItemIndex, 1)[0];
    newProjects.splice(index, 0, draggedItem);
    setProjects(newProjects);
    setDraggedItemIndex(index);
    setHasOrderChanged(true);
  };
  const handleDragEnd = () => setDraggedItemIndex(null);
  const saveOrder = async () => {
    setUploading(true);
    const updates = projects.map((proj, index) => ({ ...proj, display_order: index + 1 }));
    try {
        const { error } = await supabase.from('projects').upsert(updates, { onConflict: 'id' });
        if (error) throw error;
        setHasOrderChanged(false);
        setIsReordering(false);
    } catch (err) { console.error(err); alert('Erro ao salvar ordem.'); } 
    finally { setUploading(false); }
  };

  // Label Dinâmico
  let linkLabel = "Link do Vídeo (YouTube / Vimeo)";
  if (formData.category === ProjectCategory.WEB) linkLabel = "Link do Site (URL)";

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
          <div className="bg-matriz-dark border border-white/10 p-6 rounded max-w-3xl w-full my-10 relative">
            <div className="flex justify-between mb-4">
              <h3 className="text-xl font-bold text-white">{editingProject ? 'Editar Projeto' : 'Novo Projeto'}</h3>
              <button onClick={resetForm} className="text-gray-400 hover:text-white"><X /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[80vh] overflow-y-auto custom-scrollbar pr-2">
              <div className="md:col-span-2">
                <label className="block text-gray-400 text-xs uppercase mb-1">Título <span className="text-matriz-purple">*</span></label>
                <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-black border border-white/10 p-2 text-white rounded" required />
              </div>
              <div>
                <ModernSelect 
                  label="Categoria" 
                  value={formData.category} 
                  onChange={(val) => setFormData({...formData, category: val as ProjectCategory})} 
                  // Removendo 'Logotipos' da lista de categorias disponíveis para criar, forçando o uso do LogoManager (antigo) se desejado
                  options={Object.values(ProjectCategory).filter(c => c !== ProjectCategory.ALL && c !== ProjectCategory.LOGO)} 
                  required 
                />
              </div>
              <div>
                <ModernSelect label="Ramo de Negócio" value={formData.industry} onChange={(val) => setFormData({...formData, industry: val})} options={INDUSTRIES} placeholder="Selecione o Ramo" />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-gray-400 text-xs uppercase mb-1 font-bold">
                    {editingProject ? 'Trocar Imagem de Capa' : 'Imagem de Capa'}
                    {formData.videoUrl ? <span className="text-green-500 font-normal ml-2">(Opcional: Será usada a capa do vídeo)</span> : <span className="text-matriz-purple ml-1">*</span>}
                </label>
                <div className="border border-dashed border-white/20 p-4 text-center rounded bg-black/50 hover:bg-black cursor-pointer relative group transition-colors">
                    {/* Input não é mais required hardcoded, validamos no submit */}
                    <input type="file" accept="image/*" onChange={e => setCoverImageFile(e.target.files?.[0] || null)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                    <div className="flex flex-col items-center gap-2 text-gray-400 group-hover:text-white">
                        <Upload size={24} />
                        <span className="text-sm">{coverImageFile ? coverImageFile.name : 'Clique para enviar imagem (ou deixe vazio para usar capa do vídeo)'}</span>
                    </div>
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-gray-400 text-xs uppercase mb-1 font-bold flex items-center gap-2">
                    {formData.category === ProjectCategory.VIDEO && <Video size={14} className="text-matriz-purple" />}
                    {linkLabel}
                </label>
                <input type="text" placeholder={formData.category === ProjectCategory.VIDEO ? "Ex: https://vimeo.com/123456" : "Ex: https://meusite.com"} value={formData.videoUrl} onChange={e => setFormData({...formData, videoUrl: e.target.value})} className="w-full bg-black border border-white/10 p-2 text-white rounded" />
                {formData.category === ProjectCategory.VIDEO && (
                    <div className="mt-2 flex items-start gap-2 text-gray-500 text-xs p-2 bg-blue-500/5 border border-blue-500/10 rounded">
                        <Info size={14} className="mt-0.5 text-blue-400" />
                        <p>Recomendamos hospedar vídeos no <strong>Vimeo</strong> ou <strong>YouTube</strong> e colar o link aqui. 
                        A capa será gerada automaticamente se você não enviar uma imagem acima.</p>
                    </div>
                )}
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-gray-400 text-xs uppercase mb-1">
                    Descrição Curta (Card) 
                    {/* Descrição opcional se for Logotipos (caso reative no futuro) */}
                    {formData.category !== ProjectCategory.LOGO && <span className="text-matriz-purple"> *</span>}
                </label>
                <textarea 
                    value={formData.description} 
                    onChange={e => setFormData({...formData, description: e.target.value})} 
                    className="w-full bg-black border border-white/10 p-2 text-white rounded" 
                    rows={2} 
                    required={formData.category !== ProjectCategory.LOGO}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-gray-400 text-xs uppercase mb-1">Descrição Longa (Detalhes)</label>
                <textarea value={formData.longDescription} onChange={e => setFormData({...formData, longDescription: e.target.value})} className="w-full bg-black border border-white/10 p-2 text-white rounded" rows={4} />
              </div>

              {/* GALLERY MANAGER */}
              <div className="md:col-span-2 bg-black/30 p-4 rounded border border-white/5">
                <label className="block text-gray-400 text-xs uppercase mb-3 font-bold flex items-center gap-2">
                    <ImageIcon size={14} /> Galeria de Imagens (Opcional)
                </label>
                
                {/* Upload Area */}
                <div className="mb-4">
                    <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded text-sm text-gray-300 hover:text-white transition-colors">
                        <Plus size={16} /> Adicionar Imagens
                        <input type="file" multiple accept="image/*" className="hidden" onChange={handleGalleryFileSelect} />
                    </label>
                    <span className="ml-3 text-xs text-gray-500">Selecione múltiplas imagens do seu computador</span>
                </div>

                {/* Previews */}
                {(existingGalleryUrls.length > 0 || galleryFiles.length > 0) && (
                    <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
                        {/* Existing Images */}
                        {existingGalleryUrls.map((url, idx) => (
                            <div key={`exist-${idx}`} className="relative aspect-square group border border-white/10 rounded overflow-hidden">
                                <img src={url} alt="Galeria" className="w-full h-full object-cover" />
                                <button type="button" onClick={() => removeExistingGalleryImage(idx)} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                    <X size={12} />
                                </button>
                                <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-[8px] text-center text-white py-0.5">Salva</div>
                            </div>
                        ))}
                        {/* New Files */}
                        {galleryFiles.map((file, idx) => (
                            <div key={`new-${idx}`} className="relative aspect-square group border border-matriz-purple/50 rounded overflow-hidden">
                                <img src={URL.createObjectURL(file)} alt="Preview" className="w-full h-full object-cover" />
                                <button type="button" onClick={() => removeGalleryFile(idx)} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                    <X size={12} />
                                </button>
                                <div className="absolute bottom-0 left-0 right-0 bg-matriz-purple text-[8px] text-center text-white py-0.5">Nova</div>
                            </div>
                        ))}
                    </div>
                )}
                {existingGalleryUrls.length === 0 && galleryFiles.length === 0 && (
                    <p className="text-xs text-gray-600 italic">Nenhuma imagem extra adicionada.</p>
                )}
              </div>

              <div className="md:col-span-2 grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-gray-400 text-xs uppercase mb-1">Cliente</label>
                    <input type="text" value={formData.client} onChange={e => setFormData({...formData, client: e.target.value})} className="w-full bg-black border border-white/10 p-2 text-white rounded" />
                </div>
                <div>
                    <label className="block text-gray-400 text-xs uppercase mb-1">Tags (separadas por vírgula)</label>
                    <input type="text" placeholder="Branding, Social Media" value={formData.tags} onChange={e => setFormData({...formData, tags: e.target.value})} className="w-full bg-black border border-white/10 p-2 text-white rounded" />
                </div>
              </div>

              <div className="md:col-span-2 pt-4">
                <button type="submit" disabled={uploading} className="w-full bg-matriz-purple py-3 text-white font-bold rounded uppercase disabled:opacity-50 flex items-center justify-center gap-2">
                    {uploading ? (
                        <>Salvando e Enviando Imagens...</>
                    ) : (
                        <>{editingProject ? 'Atualizar Projeto' : 'Publicar Projeto'}</>
                    )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Project List (Table) */}
      {loading ? (
        <div className="text-white">Carregando...</div>
      ) : (
        <div className="space-y-3">
            {/* Table Header (Desktop Only) */}
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
                        {/* Imagem Aumentada para Mobile e com object-contain */}
                        <div className="h-20 w-20 overflow-hidden rounded bg-black/50 border border-white/5 flex-shrink-0 p-1">
                            <img src={project.image_url} alt={project.title} className="w-full h-full object-contain" />
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
                    {/* Imagem Aumentada para Desktop (h-24 ~ 96px) e com object-contain */}
                    <div className="col-span-3 h-24 w-full overflow-hidden rounded bg-black/50 border border-white/5 flex items-center justify-center p-1">
                        <img src={project.image_url} alt={project.title} className="w-full h-full object-contain" />
                    </div>
                    <div className="col-span-5">
                      <p className="text-white font-bold truncate text-sm">{project.title}</p>
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
