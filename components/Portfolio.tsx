import React, { useState, useEffect } from 'react';
import { getAllProjects } from '../src/lib/dataService'; // Import DataService
import { INDUSTRIES } from '../constants';
import { Project, ProjectCategory } from '../types';
import { ArrowRight, ChevronLeft, Plus, Minus, PlayCircle, Globe, Palette, Filter, Play } from 'lucide-react';
import { smoothScrollTo } from '../src/lib/scroll';

const ITEMS_PER_PAGE = 6;

interface PortfolioProps {
  headless?: boolean;
  forcedCategory?: ProjectCategory;
  onProjectClick: (project: Project, listContext?: Project[]) => void;
}

const Portfolio: React.FC<PortfolioProps> = ({ headless = false, forcedCategory, onProjectClick }) => {
  const [activeCategory, setActiveCategory] = useState<ProjectCategory>(forcedCategory || ProjectCategory.ALL);
  const [activeIndustry, setActiveIndustry] = useState<string>('');
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  useEffect(() => {
    if (forcedCategory) {
      setActiveCategory(forcedCategory);
    }
  }, [forcedCategory]);

  useEffect(() => {
    async function fetchProjects() {
      setLoading(true);
      // CACHE IMPLEMENTADO: Chama o serviço centralizado
      const data = await getAllProjects();
      setProjects(data);
      setLoading(false);
    }
    fetchProjects();
  }, []);

  useEffect(() => {
    setVisibleCount(ITEMS_PER_PAGE);
  }, [activeCategory, activeIndustry]);
  
  const filteredProjects = projects.filter(project => {
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

  const handleVisitSite = (e: React.MouseEvent, url?: string) => {
    e.stopPropagation();
    if (!url) return;
    
    // Check if URL starts with http/https
    const fullUrl = url.match(/^https?:\/\//) ? url : `https://${url}`;
    window.open(fullUrl, '_blank');
  };

  const categories = Object.values(ProjectCategory);

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
                          ? 'border-matriz-purple bg-matriz-purple/10 text-white shadow-[0_0_15px_rgba(139,92,246,0.4)]'
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
                    className="w-full appearance-none bg-matriz-dark border border-white/10 text-gray-300 text-sm pl-9 pr-8 py-2.5 rounded-sm focus:border-matriz-purple focus:outline-none cursor-pointer hover:bg-white/5 transition-colors uppercase tracking-wide font-bold shadow-sm"
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
                <div 
                    key={project.id} 
                    className="group relative overflow-hidden bg-matriz-dark border border-matriz-purple/10 shadow-[0_4px_20px_rgba(139,92,246,0.05)] animate-fade-in flex flex-col cursor-pointer transition-all duration-500 hover:border-matriz-purple/50 hover:shadow-[0_0_30px_rgba(139,92,246,0.15)] rounded-sm h-full" 
                    onClick={() => onProjectClick(project, visibleProjects)}
                >
                    {/* 1. IMAGE SECTION (Unified for Mobile & Desktop) */}
                    <div className="aspect-video overflow-hidden relative bg-black/50 border-b border-white/5">
                        <img 
                            src={project.imageUrl} 
                            alt={`Projeto de ${project.category}: ${project.title} ${project.industry ? `- ${project.industry}` : ''} criado pela Matriz Visual`}
                            loading="lazy"
                            decoding="async"
                            className="w-full h-full object-contain p-2 transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(0,0,0,0.5)] pointer-events-none"></div>
                        
                        {/* Play Icon Overlay for Videos */}
                        {project.category === ProjectCategory.VIDEO && (
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div className="bg-matriz-purple/80 p-3 rounded-full text-white shadow-lg backdrop-blur-sm group-hover:scale-110 transition-transform">
                                    <Play size={20} fill="currentColor" />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* 2. INFO SECTION (Unified Bottom Layout) */}
                    <div className="p-5 flex flex-col justify-between flex-grow bg-matriz-dark transition-colors duration-300 group-hover:bg-[#151515]">
                        <div>
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <span className="text-matriz-purple text-[11px] font-bold uppercase tracking-wider block mb-1">
                                        {project.category}
                                    </span>
                                    <h3 className="text-xl font-display font-bold text-white leading-tight line-clamp-2" title={project.title}>
                                        {project.title}
                                    </h3>
                                </div>
                                {project.industry && (
                                    <span className="text-[9px] text-gray-400 uppercase tracking-widest border border-white/10 px-2 py-1 rounded-sm bg-black/30 whitespace-nowrap ml-2">
                                        {project.industry}
                                    </span>
                                )}
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-3 mt-5 pt-4 border-t border-white/5">
                            <button className="flex-1 py-2.5 bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors text-xs uppercase font-bold tracking-wider rounded-sm text-center">
                                Ver Detalhes
                            </button>
                            {project.category === ProjectCategory.WEB && (project.videoUrl || project.id) && (
                                <button
                                    onClick={(e) => handleVisitSite(e, project.videoUrl)}
                                    className="flex-1 py-2.5 bg-matriz-purple border border-matriz-purple text-white hover:bg-white hover:text-matriz-black transition-colors text-xs uppercase font-bold tracking-wider rounded-sm text-center flex items-center justify-center gap-2"
                                >
                                    <Globe size={14} /> Acessar
                                </button>
                            )}
                        </div>
                    </div>
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
                className="group relative px-8 py-4 border border-white/10 bg-white/5 hover:bg-matriz-purple hover:border-matriz-purple text-white transition-all duration-300 overflow-hidden shadow-lg hover:shadow-[0_0_20px_rgba(139,92,246,0.3)]"
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
    </section>
  );
};

export default Portfolio;