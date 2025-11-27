import React, { useState, useEffect } from 'react';
import { supabase, uploadImage } from '../../src/lib/supabase';
import { Trash2, Plus, Upload, X, Edit2 } from 'lucide-react';
import { ProjectCategory } from '../../types';

interface Project {
  id: string;
  title: string;
  category: string;
  image_url: string;
  description: string;
  client: string;
  tags: string[];
}

const ProjectManager: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    title: '',
    category: ProjectCategory.LOGO,
    description: '',
    client: '',
    tags: '', // comma separated string for input
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const { data } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
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
    if (!imageFile) return alert('Selecione uma imagem principal');
    
    setUploading(true);
    const imageUrl = await uploadImage(imageFile);
    
    if (imageUrl) {
      const tagsArray = formData.tags.split(',').map(t => t.trim());
      
      const { data, error } = await supabase.from('projects').insert([{
        title: formData.title,
        category: formData.category,
        description: formData.description,
        client: formData.client,
        tags: tagsArray,
        image_url: imageUrl,
        long_description: formData.description // reusing short for long initially
      }]).select();

      if (!error && data) {
        setProjects([data[0], ...projects]);
        setShowForm(false);
        setFormData({ title: '', category: ProjectCategory.LOGO, description: '', client: '', tags: '' });
        setImageFile(null);
      } else {
        alert('Erro ao salvar projeto.');
        console.error(error);
      }
    }
    setUploading(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-display font-bold text-white">Gerenciar Portfólio</h2>
        <button 
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-matriz-purple px-4 py-2 rounded text-white font-bold uppercase text-sm hover:bg-purple-600 transition-colors"
        >
          <Plus size={18} /> Adicionar Projeto
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[60] p-4 overflow-y-auto">
          <div className="bg-matriz-dark border border-white/10 p-6 rounded max-w-2xl w-full my-10">
            <div className="flex justify-between mb-4">
              <h3 className="text-xl font-bold text-white">Novo Projeto</h3>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-white"><X /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <label className="block text-gray-400 text-xs uppercase mb-1">Categoria</label>
                <select 
                  value={formData.category}
                  onChange={e => setFormData({...formData, category: e.target.value as ProjectCategory})}
                  className="w-full bg-black border border-white/10 p-2 text-white rounded"
                >
                    {Object.values(ProjectCategory).map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>
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
                <label className="block text-gray-400 text-xs uppercase mb-1">Imagem Capa</label>
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
                <div className="col-span-2">Imagem</div>
                <div className="col-span-4">Título</div>
                <div className="col-span-3">Categoria</div>
                <div className="col-span-3 text-right">Ações</div>
            </div>
            
            {/* List */}
            {projects.map(project => (
                <div key={project.id} className="grid grid-cols-12 gap-4 bg-black/40 border border-white/5 p-3 rounded items-center hover:bg-white/5 transition-colors">
                    <div className="col-span-2 h-12 w-20 overflow-hidden rounded bg-black">
                        <img src={project.image_url} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="col-span-4 text-white font-bold truncate">{project.title}</div>
                    <div className="col-span-3">
                        <span className="px-2 py-1 bg-matriz-purple/20 text-matriz-purple text-xs rounded border border-matriz-purple/30">
                            {project.category}
                        </span>
                    </div>
                    <div className="col-span-3 flex justify-end gap-2">
                        {/* Edit functionality would go here - omitted for brevity */}
                        <button 
                            onClick={() => handleDelete(project.id)}
                            className="p-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded transition-colors"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default ProjectManager;