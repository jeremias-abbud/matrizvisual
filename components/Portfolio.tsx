

import React, { useState, useEffect } from 'react';
import { supabase } from '../src/lib/supabase';
import { PROJECTS as MOCK_PROJECTS, INDUSTRIES } from '../constants'; // Fallback
import { Project, ProjectCategory } from '../types';
import { X, Calendar, User, ArrowRight, ChevronLeft, ChevronRight, Plus, Minus, PlayCircle, Globe, Palette, Filter, Star } from 'lucide-react';
import { getEmbedUrl } from '../src/lib/videoHelper';
import { smoothScrollTo } from '../src/lib/scroll';

const ITEMS_PER_PAGE = 6;

interface PortfolioProps {
  headless?: boolean;
  forcedCategory?: ProjectCategory;
  featuredOnly?: boolean; // Nova prop para Destaques
}

const Portfolio: React.FC<PortfolioProps> = ({ headless = false, forcedCategory, featuredOnly = false }) => {
  const [activeCategory, setActiveCategory] = useState<ProjectCategory>(forcedCategory || ProjectCategory.ALL);
  const [activeIndustry, setActiveIndustry] = useState<string>('');
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  useEffect(() => {
    if (forcedCategory) {
      setActiveCategory(forcedCategory);
    }
  }, [forcedCategory]);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .order('display_order', { ascending: true });

        if (error) throw error;

        if (data && data.length > 0) {
           const formattedData = data.map((item: any) => ({
            id: item.id,
            title: item.title,
            category: item.category as ProjectCategory,
            industry: item.industry,
            imageUrl: item.image_url,
            description: item.description,
            tags: item.tags,
            client: item.client,
            date: item.date,
            longDescription: item.long_description,
            gallery: item.gallery,
            videoUrl: item.video_url,
            isFeatured: item.is_featured, // Mapeia o novo campo
          }));
          setProjects(formattedData);
        } else {
          setProjects(MOCK_PROJECTS);
        }
      } catch (err) {
        console.error('Error fetching projects:', err);
        setProjects(MOCK_PROJECTS);
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, []);

  useEffect(() => {
    if (selectedProject) {
      setCurrentImageIndex(0);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedProject]);

  useEffect(() => {
    setVisibleCount(ITEMS_PER_PAGE);
  }, [activeCategory, activeIndustry, featuredOnly]);
  
  const baseProjects = featuredOnly ? projects.filter(p => p.isFeatured) : projects;

  const filteredProjects = baseProjects.filter(project => {
    const matchCategory = activeCategory === ProjectCategory.ALL || project.category === activeCategory;
    const matchIndustry = activeIndustry === '' || project.industry === activeIndustry;
    return matchCategory && matchIndustry;
  });

  const visibleProjects = filteredProjects.length > 0 ? filteredProjects.slice(0, visibleCount) : [];
  const hasMore = visibleCount < filteredProjects.length;
  const canShowLess = visibleCount > ITEMS_PER_PAGE;

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + ITEMS_PER_PAGE);
  };

  const handleShowLess = (e: React.MouseEvent) => {
    setVisibleCount(ITEMS_PER_PAGE);
    smoothScrollTo(e as React.MouseEvent<HTMLAnchorElement>, '#portfolio');
  };

  const categories = Object.values(ProjectCategory);

  const nextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (selectedProject?.gallery) {
      setCurrentImageIndex((prev) => (prev + 1) % selectedProject.gallery!.length);
    }
  };

  const prevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (selectedProject?.gallery) {
      setCurrentImageIndex((prev) => (prev - 1 + selectedProject.gallery!.length) % selectedProject.gallery!.length);
    }
  };

  const getTypeIcon = (category: ProjectCategory) => {
    switch (category) {
      case ProjectCategory.VIDEO:
        return <PlayCircle className="text-white drop-shadow-md" size={48} />;
      case ProjectCategory.WEB:
        return <Globe className="text-white drop-shadow-md" size={48} />;
      case ProjectCategory.LOGO:
        return <Palette className="text-white drop-shadow-md" size={48} />;
      default:
        return null;
    }
  };

  return (
    <section id="portfolio" className={`${headless ? 'py-0 border-none' : 'py-16 md:py-20 bg-matriz-black scroll-mt-28 relative'}`}>
      <div className={`${headless ? '' : 'container mx-auto px-6'}`}>
        
        {!headless && (
          <div className="flex flex-col xl:flex-row justify-between items-end mb-10 gap-6">
            <div className="w-full xl:w-auto">
              <span className="text-matriz-purple uppercase tracking-widest text-sm font-bold">Nosso Trabalho</span>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-white mt-2">Portfólio</h2>
            </div>
          </div>
        )}

        <div className={`flex flex-col md:flex-row gap-6 w-full items-start md:items-end mb-10 ${headless ? 'justify-end' : ''}`}>
             
             {!forcedCategory && (
               <div className="flex flex-wrap gap-2 md:gap-3 flex-1">
                  {categories.map((category) => (
                  <button
                      key={category}
                      onClick={() => setActiveCategory(category)}
                      className={`px-3 py-2 text-xs md:text-sm uppercase tracking-wider transition-all border ${
                      activeCategory === category
                          ? 'border-matriz-purple bg-matriz-purple/10 text-white shadow-[0_0_10px_rgba(139,92,246,0.3)]'
                          : 'border-white/10 text-gray-500 hover:border-white/30 hover:text-white'
                      }`}
                  >
                      {category}
                  </button>
                  ))}
               </div>
             )}

             <div className="relative group min-w-[200px]">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                    <Filter size={14} />
                </div>
                <select 
                    value={activeIndustry}
                    onChange={(e) => setActiveIndustry(e.target.value)}
                    className="w-full appearance-none bg-matriz-dark border border-white/10 text-gray-300 text-sm pl-9 pr-8 py-2.5 rounded-sm focus:border-matriz-purple focus:outline-none cursor-pointer hover:bg-white/5 transition-colors uppercase tracking-wide font-bold"
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

        <div className="mb-6 text-gray-500 text-sm flex justify-between items-center border-b border-white/5 pb-2">
           <span>
             {activeIndustry ? <span className="text-matriz-purple font-bold mr-1">{activeIndustry}</span> : 'Todos os Ramos'}
           </span>
           <span>Exibindo {visibleProjects.length} de {filteredProjects.length} projetos</span>
        </div>

        {loading ? (
             <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-matriz-purple"></div>
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {visibleProjects.map((project) => (
                <div key={project.id} className="group relative overflow-hidden bg-matriz-dark border border-white/5 animate-fade-in flex flex-col cursor-pointer" onClick={() => setSelectedProject(project)}>
                <div className="aspect-video overflow-hidden relative bg-matriz-dark">
                    <img 
                    src={project.imageUrl} 
                    alt={project.title} 
                    loading="lazy"
                    decoding="async"
                    className={`w-full h-full transition-transform duration-700 group-hover:scale-110 ${
                        project.category === ProjectCategory.LOGO 
                        ? 'object-contain p-10 bg-black/50' 
                        : 'object-cover'
                    }`}
                    />

                    {project.isFeatured && (
                       <div className="absolute top-3 left-3 bg-yellow-400 text-black p-1.5 rounded-full shadow-lg z-10" title="Projeto em Destaque">
                           <Star size={12} fill="currentColor" />
                       </div>
                    )}
                    
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none">
                        {getTypeIcon(project.category)}
                    </div>

                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                    <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        <div className="flex justify-between items-end mb-2">
                             <span className="text-matriz-purple text-xs font-bold uppercase tracking-wider block">
                                {project.category}
                             </span>
                             {project.industry && (
                                <span className="text-[10px] text-gray-400 uppercase tracking-widest border border-white/10 px-2 py-0.5 rounded-sm bg-black/50">
                                    {project.industry}
                                </span>
                             )}
                        </div>
                        
                        <h3 className="text-xl font-display font-bold text-white mb-2">{project.title}</h3>
                        <p className="text-gray-300 text-sm mb-4 line-clamp-2">{project.description}</p>
                        
                        <button 
                        className="mt-2 inline-flex items-center gap-2 text-white border-b border-matriz-purple pb-1 hover:text-matriz-purple transition-colors text-sm uppercase font-bold tracking-wider"
                        >
                        Ver Detalhes <ArrowRight size={16} />
                        </button>
                    </div>
                    </div>
                </div>
                
                <div className="absolute inset-0 border-2 border-matriz-purple opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
            ))}
            </div>
        )}
        
        {!loading && filteredProjects.length === 0 && (
          <div className="text-center py-20 animate-fade-in bg-white/5 border border-white/5 rounded-sm">
            <Filter size={48} className="mx-auto text-gray-600 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Nenhum projeto encontrado</h3>
            <p className="text-gray-500">Tente mudar o filtro de Ramo de Negócio ou Categoria.</p>
            <button 
                onClick={() => { setActiveIndustry(''); setActiveCategory(ProjectCategory.ALL); }}
                className="mt-4 text-matriz-purple font-bold uppercase text-sm hover:underline"
            >
                Limpar Filtros
            </button>
          </div>
        )}

        {!loading && (hasMore || canShowLess) && (
          <div className="mt-12 flex justify-center gap-4 animate-fade-in">
            {hasMore && (
              <button 
                onClick={handleLoadMore}
                className="group relative px-8 py-4 border border-white/10 bg-white/5 hover:bg-matriz-purple hover:border-matriz-purple text-white transition-all duration-300 overflow-hidden"
              >
                <div className="flex items-center gap-3 relative z-10 font-bold tracking-widest uppercase text-sm">
                  <Plus size={18} className="group-hover:rotate-180 transition-transform duration-500" />
                  Carregar Mais
                </div>
              </button>
            )}
            
            {canShowLess && (
              <button 
                onClick={handleShowLess}
                className="group relative px-8 py-4 border border-white/10 bg-transparent hover:bg-white/10 hover:border-white text-gray-300 hover:text-white transition-all duration-300 overflow-hidden"
              >
                <div className="flex items-center gap-3 relative z-10 font-bold tracking-widest uppercase text-sm">
                  <Minus size={18} className="group-hover:scale-75 transition-transform duration-500" />
                  Ver Menos
                </div>
              </button>
            )}
          </div>
        )}
      </div>

      {selectedProject && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/90 backdrop-blur-md transition-opacity" 
            onClick={() => setSelectedProject(null)}
          ></div>
          
          <div className="relative bg-matriz-dark w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-lg border border-white/10 shadow-2xl animate-fade-in-down custom-scrollbar">
            
            <button 
              onClick={() => setSelectedProject(null)}
              className="absolute top-4 right-4 z-[50] p-2 bg-black/50 hover:bg-matriz-purple rounded-full text-white transition-colors border border-white/10"
            >
              <X size={24} />
            </button>

            <div className="w-full h-64 md:h-96 relative bg-matriz-black flex items-center justify-center overflow-hidden">
                {selectedProject.videoUrl ? (
                     <div className="w-full h-full relative z-20">
                         <iframe 
                             src={getEmbedUrl(selectedProject.videoUrl)} 
                             title={selectedProject.title}
                             className="w-full h-full"
                             frameBorder="0"
                             allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                             allowFullScreen
                         ></iframe>
                     </div>
                ) : (
                    <>
                        {selectedProject.category === ProjectCategory.LOGO && (
                            <img 
                                src={selectedProject.imageUrl} 
                                className="absolute inset-0 w-full h-full object-cover opacity-20 blur-xl scale-150"
                            />
                        )}
                        <img 
                            src={selectedProject.imageUrl} 
                            alt={selectedProject.title} 
                            className={`w-full h-full relative z-10 ${
                                selectedProject.category === ProjectCategory.LOGO 
                                ? 'object-contain p-12' 
                                : 'object-cover'
                            }`}
                        />
                         <div className="absolute inset-0 bg-gradient-to-t from-matriz-dark via-transparent to-transparent z-20 pointer-events-none"></div>
                    </>
                )}
              
              {!selectedProject.videoUrl && (
                  <div className="absolute bottom-0 left-0 p-6 md:p-10 w-full z-30">
                    <div className="flex gap-2 mb-3 items-center">
                        <span className="inline-block px-3 py-1 bg-matriz-purple text-white text-xs font-bold uppercase tracking-widest rounded-sm">
                        {selectedProject.category}
                        </span>
                        {selectedProject.industry && (
                            <span className="inline-block px-3 py-1 bg-black/60 border border-white/20 text-white text-xs font-bold uppercase tracking-widest rounded-sm">
                            {selectedProject.industry}
                            </span>
                        )}
                        {selectedProject.isFeatured && (
                           <span className="inline-flex items-center gap-1.5 px-2 py-1 bg-yellow-400 text-black text-xs font-bold uppercase tracking-widest rounded-sm">
                               <Star size={12} fill="currentColor" /> DESTAQUE
                           </span>
                        )}
                    </div>
                    <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-2 drop-shadow-lg">{selectedProject.title}</h2>
                </div>
              )}
            </div>
            
            {selectedProject.videoUrl && (
                <div className="p-6 md:px-10 md:pt-10 md:pb-0">
                    <div className="flex gap-2 mb-3 items-center">
                        <span className="inline-block px-3 py-1 bg-matriz-purple text-white text-xs font-bold uppercase tracking-widest rounded-sm">
                        {selectedProject.category}
                        </span>
                        {selectedProject.industry && (
                            <span className="inline-block px-3 py-1 bg-black/60 border border-white/20 text-white text-xs font-bold uppercase tracking-widest rounded-sm">
                            {selectedProject.industry}
                            </span>
                        )}
                        {selectedProject.isFeatured && (
                           <span className="inline-flex items-center gap-1.5 px-2 py-1 bg-yellow-400 text-black text-xs font-bold uppercase tracking-widest rounded-sm">
                               <Star size={12} fill="currentColor" /> DESTAQUE
                           </span>
                        )}
                    </div>
                    <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-2 drop-shadow-lg">{selectedProject.title}</h2>
                </div>
            )}

            <div className="p-6 md:p-10">
              <div className="flex flex-col lg:flex-row gap-10">
                
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    Sobre o Projeto
                  </h3>
                  <p className="text-gray-300 leading-relaxed mb-8 text-lg">
                    {selectedProject.longDescription || selectedProject.description}
                  </p>

                  {selectedProject.gallery && selectedProject.gallery.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-bold text-white mb-2">Galeria do Projeto</h3>
                      
                      <div className="relative group bg-black border border-white/10 rounded-sm overflow-hidden select-none">
                        <div className="aspect-video w-full relative bg-matriz-dark/50 flex items-center justify-center">
                          <img 
                            src={selectedProject.gallery[currentImageIndex]} 
                            alt={`Gallery image ${currentImageIndex + 1}`} 
                            className={`w-full h-full animate-fade-in ${
                                selectedProject.category === ProjectCategory.LOGO 
                                ? 'object-contain p-8' 
                                : 'object-contain'
                            }`}
                            key={currentImageIndex}
                          />
                        </div>

                        {selectedProject.gallery.length > 1 && (
                          <>
                            <button 
                              onClick={prevImage}
                              className="absolute left-0 top-0 bottom-0 px-4 hover:bg-black/20 text-white/50 hover:text-white transition-all flex items-center justify-center focus:outline-none"
                            >
                              <div className="p-2 bg-black/50 rounded-full backdrop-blur-sm hover:bg-matriz-purple">
                                <ChevronLeft size={24} />
                              </div>
                            </button>
                            <button 
                              onClick={nextImage}
                              className="absolute right-0 top-0 bottom-0 px-4 hover:bg-black/20 text-white/50 hover:text-white transition-all flex items-center justify-center focus:outline-none"
                            >
                              <div className="p-2 bg-black/50 rounded-full backdrop-blur-sm hover:bg-matriz-purple">
                                <ChevronRight size={24} />
                              </div>
                            </button>
                          </>
                        )}
                        
                         <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-md px-3 py-1 text-xs text-white rounded-full border border-white/10">
                           {currentImageIndex + 1} / {selectedProject.gallery.length}
                         </div>
                      </div>

                      <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar pt-2">
                        {selectedProject.gallery.map((img, idx) => (
                          <button
                            key={idx}
                            onClick={() => setCurrentImageIndex(idx)}
                            className={`relative flex-shrink-0 w-24 h-16 rounded-sm overflow-hidden border-2 transition-all bg-black ${
                              currentImageIndex === idx 
                                ? 'border-matriz-purple opacity-100 ring-2 ring-matriz-purple/20' 
                                : 'border-transparent opacity-40 hover:opacity-80'
                            }`}
                          >
                            <img 
                              src={img} 
                              alt="" 
                              loading="lazy"
                              decoding="async"
                              className={`w-full h-full ${selectedProject.category === ProjectCategory.LOGO ? 'object-contain p-1' : 'object-cover'}`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="lg:w-80 space-y-8">
                  <div className="bg-white/5 p-6 rounded-sm border border-white/5">
                    <div className="space-y-4">
                      {selectedProject.client && (
                        <div>
                          <span className="text-xs uppercase tracking-widest text-gray-500 block mb-1">Cliente</span>
                          <div className="flex items-center gap-2 text-white font-medium">
                            <User size={16} className="text-matriz-purple" />
                            {selectedProject.client}
                          </div>
                        </div>
                      )}
                      
                      {selectedProject.date && (
                        <div>
                          <span className="text-xs uppercase tracking-widest text-gray-500 block mb-1">Data</span>
                          <div className="flex items-center gap-2 text-white font-medium">
                            <Calendar size={16} className="text-matriz-purple" />
                            {selectedProject.date}
                          </div>
                        </div>
                      )}

                      {selectedProject.industry && (
                        <div>
                          <span className="text-xs uppercase tracking-widest text-gray-500 block mb-1">Ramo</span>
                          <div className="flex items-center gap-2 text-white font-medium">
                             <span className="text-sm border border-white/10 px-2 py-1 rounded bg-black/50">
                                {selectedProject.industry}
                             </span>
                          </div>
                        </div>
                      )}

                      <div>
                        <span className="text-xs uppercase tracking-widest text-gray-500 block mb-2">Tecnologias</span>
                        <div className="flex flex-wrap gap-2">
                          {selectedProject.tags.map(tag => (
                            <span key={tag} className="px-2 py-1 bg-black text-xs text-gray-300 border border-white/10 rounded-sm">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <a href="#contact" onClick={() => setSelectedProject(null)} className="block w-full py-3 bg-matriz-purple hover:bg-purple-600 text-white font-bold uppercase tracking-widest text-center transition-colors text-sm">
                    Solicitar Orçamento
                  </a>
                </div>

              </div>
            </div>

          </div>
        </div>
      )}
    </section>
  );
};

export default Portfolio;