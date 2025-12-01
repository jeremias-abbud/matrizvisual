
import React, { useState, useEffect } from 'react';
import { ExternalLink, Code2, ChevronLeft, ChevronRight, Filter, Loader2, Globe } from 'lucide-react';
import { supabase } from '../src/lib/supabase';
import { FEATURED_WEB_PROJECTS as MOCK_PROJECTS, INDUSTRIES } from '../constants'; // Fallback
import { ProjectCategory } from '../types';

interface WebProject {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  tech: string[];
  liveUrl: string;
  industry?: string;
}

interface WebShowcaseProps {
  headless?: boolean;
  limit?: number;
}

const WebShowcase: React.FC<WebShowcaseProps> = ({ headless = false, limit }) => {
  const [projects, setProjects] = useState<WebProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isIframeLoading, setIsIframeLoading] = useState(true);
  
  const [activeIndustry, setActiveIndustry] = useState<string>('');

  useEffect(() => {
    async function fetchWebProjects() {
        try {
            let query = supabase
                .from('projects')
                .select('*')
                .eq('category', ProjectCategory.WEB)
                .order('created_at', { ascending: false });
            
            if (limit) {
                query = query.limit(limit);
            }

            const { data, error } = await query;

            if (error) throw error;

            if (data && data.length > 0) {
                 const formattedData = data.map((item: any) => ({
                    id: item.id,
                    title: item.title,
                    description: item.description,
                    imageUrl: item.image_url,
                    tech: item.tags || [],
                    // Prioritiza video_url como link do site, fallback para '#'
                    liveUrl: item.video_url || '#', 
                    industry: item.industry
                 }));
                 setProjects(formattedData);
            } else {
                setProjects(MOCK_PROJECTS);
            }
        } catch (err) {
            console.error('Error fetching web showcase:', err);
            setProjects(MOCK_PROJECTS);
        } finally {
            setLoading(false);
        }
    }
    fetchWebProjects();
  }, [limit]);

  const filteredProjects = projects.filter(proj => activeIndustry === '' || proj.industry === activeIndustry);

  useEffect(() => {
    setActiveIndex(0);
  }, [activeIndustry]);

  useEffect(() => {
    setIsIframeLoading(true);
  }, [activeIndex]);

  const activeProject = filteredProjects[activeIndex];

  const nextProject = () => {
    if (filteredProjects.length === 0) return;
    setActiveIndex((prev) => (prev + 1) % filteredProjects.length);
  };

  const prevProject = () => {
    if (filteredProjects.length === 0) return;
    setActiveIndex((prev) => (prev - 1 + filteredProjects.length) % filteredProjects.length);
  };

  if (loading) {
      return (
        <section className={`${headless ? 'py-10' : 'py-16 md:py-20'} bg-gradient-to-b from-matriz-black to-matriz-dark border-b border-white/5 relative overflow-hidden flex justify-center items-center h-96`}>
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-matriz-purple"></div>
        </section>
      )
  }

  return (
    <section className={`${headless ? 'py-0 border-none' : 'py-16 md:py-20 bg-gradient-to-b from-matriz-black to-matriz-dark border-b border-white/5 relative overflow-hidden'}`}>
      {!headless && <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-matriz-purple/5 rounded-full blur-3xl pointer-events-none"></div>}
      
      <div className={`${headless ? '' : 'container mx-auto px-6'} relative z-10`}>
        
        {!headless && (
          <div className="mb-10 lg:mb-12 flex flex-col lg:flex-row justify-between items-end gap-6">
            <div>
              <span className="text-matriz-purple text-xs font-bold uppercase tracking-[0.3em]">Galeria de Sites</span>
              <h2 className="font-display text-4xl font-bold text-white mt-2">
                  Sites Profissionais <span className="text-gray-500">Modernos</span>
              </h2>
            </div>
          </div>
        )}

        {!limit && (
            <div className={`flex justify-end mb-8 ${headless ? 'w-full' : 'absolute top-0 right-6'}`}>
                <div className="w-full lg:w-auto relative group min-w-[240px]">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                        <Filter size={14} />
                    </div>
                    <select 
                        value={activeIndustry}
                        onChange={(e) => setActiveIndustry(e.target.value)}
                        className="w-full appearance-none bg-matriz-dark border border-white/10 text-gray-300 text-sm pl-9 pr-8 py-3 rounded-sm focus:border-matriz-purple focus:outline-none cursor-pointer hover:bg-white/5 transition-colors uppercase tracking-wide font-bold"
                    >
                        <option value="">Todos os Ramos</option>
                        {INDUSTRIES.map(ind => (
                            <option key={ind} value={ind}>{ind}</option>
                        ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-500">
                        <ChevronLeft size={14} className="-rotate-90" />
                    </div>
                </div>
            </div>
        )}

        {filteredProjects.length === 0 ? (
             <div className="text-center py-20 bg-white/5 border border-white/5 rounded-sm">
                <Filter size={48} className="mx-auto text-gray-600 mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Nenhum site encontrado</h3>
                <p className="text-gray-500">Tente mudar o filtro de Ramo de Negócio.</p>
                <button 
                    onClick={() => setActiveIndustry('')}
                    className="mt-4 text-matriz-purple font-bold uppercase text-sm hover:underline"
                >
                    Limpar Filtros
                </button>
            </div>
        ) : (
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            
            {/* PREVIEW WINDOW (Common for Mobile & Desktop) */}
            <div className="lg:w-2/3 order-1 lg:order-2">
                <div className="relative w-full aspect-[9/16] md:aspect-[16/10] bg-matriz-gray rounded-lg border border-matriz-purple/10 shadow-[0_4px_20px_rgba(139,92,246,0.05)] overflow-hidden group">
                    {/* Header do Browser Falso (Estético) */}
                    <div className="h-8 bg-black/80 border-b border-white/5 flex items-center px-4 gap-2">
                        <div className="flex gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-full bg-red-500/50"></div>
                            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50"></div>
                            <div className="w-2.5 h-2.5 rounded-full bg-green-500/50"></div>
                        </div>
                        <div className="flex-1 text-center">
                             <div className="inline-block px-3 py-0.5 bg-white/5 rounded text-[10px] text-gray-500 truncate max-w-[200px]" title={activeProject.liveUrl}>
                                {activeProject.liveUrl}
                             </div>
                        </div>
                    </div>

                    {isIframeLoading && (
                        <div className="absolute inset-0 top-8 flex flex-col items-center justify-center gap-3 bg-matriz-dark text-gray-500 z-10">
                            <Loader2 className="animate-spin text-matriz-purple" size={32} />
                            <span className="text-xs uppercase tracking-widest animate-pulse">Carregando Preview...</span>
                        </div>
                    )}
                    <iframe
                        key={activeProject.id}
                        src={activeProject.liveUrl}
                        title={`Website do projeto ${activeProject.title} - Matriz Visual`}
                        onLoad={() => setIsIframeLoading(false)}
                        className={`w-full h-full bg-white transition-opacity duration-500 ${isIframeLoading ? 'opacity-0' : 'opacity-100'}`}
                        sandbox="allow-scripts allow-same-origin allow-forms"
                        loading="lazy"
                    />
                    
                    {/* Overlay Interativo para Mobile (Permite scroll no iframe mas mostra que é interativo) */}
                    <div className="absolute bottom-4 right-4 z-20 pointer-events-none md:hidden">
                        <span className="bg-black/70 backdrop-blur text-white text-[10px] px-2 py-1 rounded uppercase tracking-wider border border-white/10">
                            Interativo
                        </span>
                    </div>
                </div>
            </div>
            
            {/* MOBILE INFO & NAVIGATION (Visible only on small screens) */}
            <div className="lg:hidden order-2 flex flex-col gap-6 mt-2">
                <div className="flex items-center justify-between gap-4 bg-white/5 p-4 rounded-lg border border-white/5">
                    <button onClick={prevProject} className="p-3 bg-black/50 border border-white/10 rounded-full hover:bg-matriz-purple hover:text-white transition-colors" aria-label="Projeto Anterior">
                        <ChevronLeft size={20} />
                    </button>
                    
                    <div className="text-center flex-1 min-w-0">
                        <h3 className="font-display text-lg font-bold text-white mb-1 truncate">
                        {activeProject.title}
                        </h3>
                        {activeProject.industry && (
                             <span className="text-[10px] text-matriz-purple font-bold uppercase tracking-widest block truncate">
                                {activeProject.industry}
                             </span>
                        )}
                    </div>

                    <button onClick={nextProject} className="p-3 bg-black/50 border border-white/10 rounded-full hover:bg-matriz-purple hover:text-white transition-colors" aria-label="Próximo Projeto">
                        <ChevronRight size={20} />
                    </button>
                </div>
                
                <p className="text-gray-400 text-sm leading-relaxed text-center px-4">{activeProject.description}</p>
                
                <a 
                  href={activeProject.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-4 bg-matriz-purple text-white font-bold uppercase tracking-widest hover:bg-white hover:text-matriz-black transition-all duration-300 flex items-center justify-center gap-2 text-sm rounded-sm shadow-[0_0_15px_rgba(139,92,246,0.3)] animate-pulse hover:animate-none"
                  aria-label={`Acessar site do projeto ${activeProject.title}`}
                >
                  <Globe size={18} /> Acessar Site
                </a>
            </div>

            {/* DESKTOP LIST (Hidden on mobile) */}
            <div className="hidden lg:flex lg:w-1/3 flex-col gap-4 order-1 h-full min-h-[500px]">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-xs uppercase tracking-widest text-gray-500 font-bold">Lista de Projetos</span>
                    <div className="flex gap-2">
                         <button onClick={prevProject} className="p-2 hover:bg-white/10 rounded-full text-white" aria-label="Anterior"><ChevronLeft size={16}/></button>
                         <button onClick={nextProject} className="p-2 hover:bg-white/10 rounded-full text-white" aria-label="Próximo"><ChevronRight size={16}/></button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto max-h-[600px] custom-scrollbar pr-2 space-y-3">
                    {filteredProjects.map((project, index) => (
                    <button
                        key={project.id}
                        onClick={() => setActiveIndex(index)}
                        className={`w-full group text-left p-6 border rounded-sm transition-all duration-300 relative overflow-hidden ${
                        index === activeIndex
                            ? 'border-matriz-purple bg-white/5 shadow-[0_0_20px_rgba(139,92,246,0.1)]'
                            : 'border-matriz-purple/10 bg-transparent hover:bg-white/5 hover:border-white/20'
                        }`}
                        aria-label={`Ver projeto ${project.title}`}
                    >
                        {index === activeIndex && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-matriz-purple"></div>
                        )}
                        <h3 className={`font-display text-lg font-bold mb-1 transition-colors ${
                            index === activeIndex ? 'text-white' : 'text-gray-400 group-hover:text-white'
                        }`}>
                            {project.title}
                        </h3>
                        {project.industry && (
                            <span className="text-[10px] text-gray-500 uppercase tracking-widest block mb-2">
                                {project.industry}
                            </span>
                        )}
                        <p className="text-sm text-gray-500 line-clamp-2">{project.description}</p>
                    </button>
                    ))}
                </div>
                
                <div className="mt-auto pt-4">
                    <div className="p-6 bg-black/40 border border-white/5 rounded-sm">
                        <div className="flex items-center gap-2 mb-4 text-matriz-silver">
                            <Code2 size={20} className="text-matriz-purple" />
                            <span className="text-xs uppercase tracking-widest font-bold">Tecnologias</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {activeProject.tech.length > 0 ? activeProject.tech.map((tech) => (
                                <span key={tech} className="px-3 py-1 text-xs border border-matriz-purple/30 text-matriz-purple bg-matriz-purple/5 rounded-full">
                                    {tech}
                                </span>
                            )) : <span className="text-gray-600 text-xs italic">Nenhuma tag informada</span>}
                        </div>
                    </div>
                    
                    <a 
                        href={activeProject.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-4 w-full inline-flex items-center justify-center gap-2 px-6 py-4 bg-matriz-purple text-white font-bold uppercase tracking-widest hover:bg-white hover:text-matriz-black transition-all duration-300 rounded-sm shadow-[0_0_15px_rgba(139,92,246,0.3)]"
                        aria-label={`Acessar site do projeto ${activeProject.title} em nova aba`}
                    >
                        Acessar Site <ExternalLink size={18} />
                    </a>
                </div>
            </div>

            </div>
        )}
      </div>
    </section>
  );
};

export default WebShowcase;
