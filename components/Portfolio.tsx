

import React, { useState, useEffect } from 'react';
import { supabase } from '../src/lib/supabase';
import { PROJECTS as MOCK_PROJECTS, INDUSTRIES } from '../constants'; // Fallback
import { Project, ProjectCategory } from '../types';
import { ArrowRight, ChevronLeft, Plus, Minus, PlayCircle, Globe, Palette, Filter } from 'lucide-react';
import { smoothScrollTo } from '../src/lib/scroll';

const ITEMS_PER_PAGE = 6;

interface PortfolioProps {
  headless?: boolean;
  forcedCategory?: ProjectCategory;
  onProjectClick: (project: Project) => void;
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
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .order('display_order', { ascending: true, nullsFirst: true })
          .order('created_at', { ascending: false });

        if (error) throw error;

        if (data && data.length > 0) {
           const formattedData = data.map((item: any) => ({
            id: item.id,
            title: item.title,
            category: item.category as ProjectCategory,
            industry: item.industry,
            imageUrl: item.image_url,
            description: item.description,
            tags: item.tags || [],
            client: item.client,
            date: item.date,
            longDescription: item.long_description,
            gallery: item.gallery,
            videoUrl: item.video_url,
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

  const categories = Object.values(ProjectCategory);

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
                <div key={project.id} className="group relative overflow-hidden bg-matriz-dark border border-white/5 animate-fade-in flex flex-col cursor-pointer" onClick={() => onProjectClick(project)}>
                <div className="aspect-video overflow-hidden relative bg-black/50">
                    <img 
                    src={project.imageUrl} 
                    alt={project.title} 
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-contain p-2 transition-transform duration-700 group-hover:scale-110"
                    />
                    
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
    </section>
  );
};

export default Portfolio;