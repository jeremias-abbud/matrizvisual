
import React, { useState, useEffect, useMemo } from 'react';
import { getAllProjects } from '../src/lib/dataService';
import { INDUSTRIES } from '../constants';
import { Project, ProjectCategory } from '../types';
import { ArrowRight, ChevronLeft, Plus, Minus, Globe, Filter, Play, Tag, X, Users, Building2, Eye } from 'lucide-react';
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
  const [activeClient, setActiveClient] = useState<string>('');
  const [activeTag, setActiveTag] = useState<string>('');
  
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
      const data = await getAllProjects();
      setProjects(data);
      setLoading(false);
    }
    fetchProjects();
  }, []);

  useEffect(() => {
    setVisibleCount(ITEMS_PER_PAGE);
    setActiveClient(''); 
    setActiveTag('');    
  }, [activeCategory, activeIndustry]);

  useEffect(() => {
    setVisibleCount(ITEMS_PER_PAGE);
    setActiveTag('');    
  }, [activeClient]);
  
  const projectsFilteredByIndustry = useMemo(() => {
      return projects.filter(project => {
        const matchCategory = activeCategory === ProjectCategory.ALL || project.category === activeCategory;
        const matchIndustry = activeIndustry === '' || project.industry === activeIndustry;
        return matchCategory && matchIndustry;
      });
  }, [projects, activeCategory, activeIndustry]);

  const availableClients = useMemo(() => {
      const clientMap = new Map<string, string>();
      projectsFilteredByIndustry.forEach(p => {
          if (p.client && p.client.trim().length > 0) {
              const originalName = p.client.trim();
              const lowerName = originalName.toLowerCase();
              if (!clientMap.has(lowerName)) {
                  clientMap.set(lowerName, originalName);
              }
          }
      });
      return Array.from(clientMap.values()).sort((a, b) => a.localeCompare(b));
  }, [projectsFilteredByIndustry]);

  const projectsFilteredByClient = useMemo(() => {
      return projectsFilteredByIndustry.filter(project => {
          if (activeClient === '') return true;
          return project.client?.trim().toLowerCase() === activeClient.toLowerCase();
      });
  }, [projectsFilteredByIndustry, activeClient]);

  const availableTags = useMemo(() => {
      const tags = new Set<string>();
      projectsFilteredByClient.forEach(p => {
          if (p.tags && Array.isArray(p.tags)) {
              p.tags.forEach(t => tags.add(t.trim()));
          }
      });
      return Array.from(tags).sort();
  }, [projectsFilteredByClient]);

  const finalFilteredProjects = useMemo(() => {
      if (!activeTag) return projectsFilteredByClient;
      return projectsFilteredByClient.filter(p => 
          p.tags && p.tags.some(t => t.trim() === activeTag)
      );
  }, [projectsFilteredByClient, activeTag]);

  const visibleProjects = finalFilteredProjects.length > 0 ? finalFilteredProjects.slice(0, visibleCount) : [];
  const hasMore = visibleCount < finalFilteredProjects.length;
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

        {/* --- FILTERS --- */}
        <div className={`flex flex-col gap-4 mb-10 ${headless ? 'justify-end' : ''}`}>
             <div className="flex flex-col xl:flex-row gap-4 w-full">
                {!forcedCategory && (
                <div className="flex flex-wrap gap-2 md:gap-3 flex-1">
                    {categories.map((category) => (
                    <button
                        key={category}
                        onClick={() => setActiveCategory(category)}
                        className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all border rounded-sm ${
                        activeCategory === category
                            ? 'border-matriz-purple bg-matriz-purple text-white shadow-[0_0_15px_rgba(139,92,246,0.4)]'
                            : 'border-white/10 text-gray-500 hover:border-white/30 hover:text-white bg-black/40'
                        }`}
                    >
                        {category}
                    </button>
                    ))}
                </div>
                )}

                <div className="flex flex-col sm:flex-row gap-4 xl:w-auto w-full">
                    <div className="relative group min-w-[200px] flex-1">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                            <Filter size={14} />
                        </div>
                        <select 
                            value={activeIndustry}
                            onChange={(e) => setActiveIndustry(e.target.value)}
                            className="w-full appearance-none bg-black/40 border border-white/10 text-gray-300 text-xs pl-9 pr-8 py-3 rounded-sm focus:border-matriz-purple focus:outline-none cursor-pointer hover:bg-white/5 transition-colors uppercase tracking-wide font-bold shadow-sm"
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

                    <div className="relative group min-w-[200px] flex-1">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                            <Building2 size={14} />
                        </div>
                        <select 
                            value={activeClient}
                            onChange={(e) => setActiveClient(e.target.value)}
                            disabled={availableClients.length === 0}
                            className={`w-full appearance-none bg-black/40 border border-white/10 text-gray-300 text-xs pl-9 pr-8 py-3 rounded-sm focus:border-matriz-purple focus:outline-none transition-colors uppercase tracking-wide font-bold shadow-sm ${availableClients.length === 0 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-white/5'}`}
                        >
                            <option value="">{availableClients.length === 0 ? 'Sem clientes' : 'Todos os Clientes'}</option>
                            {availableClients.map(client => (
                                <option key={client} value={client}>{client}</option>
                            ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-500">
                            <ChevronLeft size={14} className="-rotate-90" />
                        </div>
                    </div>
                </div>
             </div>

             {availableTags.length > 0 && (
                 <div className="w-full overflow-x-auto pb-2 custom-scrollbar">
                     <div className="flex items-center gap-2">
                         <div className="flex items-center gap-1 text-xs text-gray-500 uppercase font-bold mr-2 shrink-0">
                             <Tag size={12} /> Filtrar:
                         </div>
                         {activeTag && (
                             <button 
                                onClick={() => setActiveTag('')}
                                className="flex items-center gap-1 px-3 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/30 text-[10px] font-bold uppercase hover:bg-red-500/20 transition-colors shrink-0"
                             >
                                 <X size={10} /> Limpar
                             </button>
                         )}
                         {availableTags.map(tag => (
                             <button
                                key={tag}
                                onClick={() => setActiveTag(activeTag === tag ? '' : tag)}
                                className={`px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wide transition-all whitespace-nowrap ${
                                    activeTag === tag
                                    ? 'bg-matriz-purple text-white border-matriz-purple shadow-[0_0_10px_rgba(139,92,246,0.3)]'
                                    : 'bg-white/5 text-gray-400 border-white/10 hover:border-white/30 hover:text-white'
                                }`}
                             >
                                 {tag}
                             </button>
                         ))}
                     </div>
                 </div>
             )}
        </div>

        <div className="mb-8 text-gray-500 text-xs flex flex-wrap justify-between items-center border-b border-white/5 pb-3 gap-2">
           <div className="flex items-center gap-2 flex-wrap">
             {activeIndustry && <span className="text-matriz-purple font-bold">{activeIndustry}</span>}
             {activeClient && (
                 <>
                    <span className="text-gray-600">/</span>
                    <span className="text-white font-bold bg-white/10 px-2 py-0.5 rounded-sm">{activeClient}</span>
                 </>
             )}
             {!activeIndustry && !activeClient && 'Mostrando Todos'}
             
             {activeTag && <span className="text-gray-600">/</span>}
             {activeTag && <span className="text-white bg-matriz-purple/20 px-2 py-0.5 rounded text-[10px] border border-matriz-purple/30">{activeTag}</span>}
           </div>
           <span className="ml-auto font-mono opacity-50">{visibleProjects.length} / {finalFilteredProjects.length}</span>
        </div>

        {loading ? (
             <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-matriz-purple"></div>
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {visibleProjects.map((project) => (
                <div 
                    key={project.id} 
                    className="group bg-[#080808] border border-white/5 rounded-sm overflow-hidden flex flex-col cursor-pointer transition-all duration-500 hover:border-matriz-purple/30 hover:shadow-[0_0_30px_rgba(139,92,246,0.1)] h-full" 
                    onClick={() => onProjectClick(project, visibleProjects)}
                >
                    {/* --- CINEMA IMAGE CONTAINER --- */}
                    <div className="relative aspect-video md:aspect-[4/3] bg-[#050505] border-b border-white/5 overflow-hidden">
                        {/* Grid Pattern */}
                        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
                        
                        <img 
                            src={project.imageUrl} 
                            alt={`Projeto: ${project.title}`}
                            loading="lazy"
                            decoding="async"
                            className="w-full h-full object-contain p-6 transition-transform duration-700 group-hover:scale-105 relative z-10"
                        />
                        
                        {/* Tags Overlay (Top Left) */}
                        <div className="absolute top-3 left-3 z-20 flex gap-2">
                            <span className="px-2 py-1 bg-black/80 backdrop-blur-md border border-white/10 text-[9px] font-bold text-matriz-purple uppercase tracking-wider rounded-sm shadow-lg">
                                {project.category}
                            </span>
                        </div>

                        {/* Play Icon */}
                        {project.category === ProjectCategory.VIDEO && (
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                                <div className="bg-matriz-purple/90 p-4 rounded-full text-white shadow-2xl backdrop-blur-sm group-hover:scale-110 transition-transform">
                                    <Play size={20} fill="currentColor" />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* --- INFO CONTAINER --- */}
                    <div className="flex flex-col flex-grow p-5 bg-[#080808] group-hover:bg-[#0a0a0a] transition-colors">
                        <div className="flex-grow">
                            <div className="flex justify-between items-start gap-3 mb-2">
                                <h3 className="font-display text-lg font-bold text-white leading-tight group-hover:text-matriz-purple transition-colors line-clamp-2">
                                    {project.title}
                                </h3>
                            </div>
                            {project.industry && (
                                <p className="text-[10px] text-gray-500 uppercase tracking-wider font-medium mb-3">
                                    {project.industry}
                                </p>
                            )}
                        </div>
                        
                        {/* Actions */}
                        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/5">
                            <button className="flex-1 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs uppercase font-bold tracking-widest rounded-sm transition-all flex items-center justify-center gap-2 group/btn">
                                <Eye size={14} className="text-gray-400 group-hover/btn:text-white" /> Ver Detalhes
                            </button>
                            {project.category === ProjectCategory.WEB && (project.videoUrl || project.id) && (
                                <button
                                    onClick={(e) => handleVisitSite(e, project.videoUrl)}
                                    className="px-4 py-3 bg-matriz-purple/10 border border-matriz-purple/30 text-matriz-purple hover:bg-matriz-purple hover:text-white transition-all text-xs uppercase font-bold tracking-widest rounded-sm flex items-center justify-center gap-2"
                                    title="Acessar Site"
                                >
                                    <Globe size={14} />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            ))}
            </div>
        )}
        
        {!loading && finalFilteredProjects.length === 0 && (
          <div className="text-center py-24 bg-white/5 border border-white/5 rounded-sm">
            <Filter size={48} className="mx-auto text-gray-600 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Nenhum projeto encontrado</h3>
            <p className="text-gray-500 text-sm">Tente ajustar seus filtros.</p>
            <button 
                onClick={() => { setActiveIndustry(''); setActiveCategory(ProjectCategory.ALL); setActiveTag(''); setActiveClient(''); }}
                className="mt-6 text-matriz-purple font-bold uppercase text-xs hover:underline tracking-widest"
            >
                Limpar Filtros
            </button>
          </div>
        )}

        {!loading && (hasMore || canShowLess) && (
          <div className="mt-16 flex justify-center gap-4 animate-fade-in">
            {hasMore && (
              <button 
                onClick={handleLoadMore}
                className="group relative px-8 py-4 border border-matriz-purple/30 bg-matriz-purple/10 hover:bg-matriz-purple text-white transition-all duration-300 overflow-hidden shadow-[0_0_20px_rgba(139,92,246,0.1)] hover:shadow-[0_0_30px_rgba(139,92,246,0.4)]"
              >
                <div className="flex items-center gap-3 relative z-10 font-bold tracking-[0.2em] uppercase text-xs">
                  <Plus size={14} className="group-hover:rotate-180 transition-transform duration-500" />
                  Carregar Mais
                </div>
              </button>
            )}
            
            {canShowLess && (
              <button 
                onClick={handleShowLess}
                className="group relative px-8 py-4 border border-white/10 bg-transparent hover:bg-white/5 text-gray-400 hover:text-white transition-all duration-300"
              >
                <div className="flex items-center gap-3 relative z-10 font-bold tracking-[0.2em] uppercase text-xs">
                  <Minus size={14} />
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
