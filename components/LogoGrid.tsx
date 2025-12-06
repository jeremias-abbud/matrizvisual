
import React, { useState, useEffect } from 'react';
import { Plus, Minus, ZoomIn, Filter, ChevronLeft } from 'lucide-react';
import { getAllLogos } from '../src/lib/dataService';
import { INDUSTRIES } from '../constants';
import { smoothScrollTo } from '../src/lib/scroll';
import { Project } from '../types';

interface LogoGridProps {
  headless?: boolean;
  limit?: number;
  onProjectClick?: (project: Project, listContext?: Project[]) => void;
}

const LogoGrid: React.FC<LogoGridProps> = ({ headless = false, limit, onProjectClick }) => {
  const INITIAL_COUNT = limit || 8;
  const [logos, setLogos] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);
  const [activeIndustry, setActiveIndustry] = useState<string>('');

  useEffect(() => {
    async function fetchAllLogos() {
      setLoading(true);
      const combinedLogos = await getAllLogos();
      setLogos(combinedLogos);
      setLoading(false);
    }
    fetchAllLogos();
  }, []);
  
  const filteredLogos = logos.filter(logo => {
    return activeIndustry === '' || logo.industry === activeIndustry;
  });
  
  const visibleLogos = limit ? filteredLogos.slice(0, limit) : filteredLogos.slice(0, visibleCount);
  const hasMore = visibleCount < filteredLogos.length;
  const canShowLess = visibleCount > INITIAL_COUNT;

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 8);
  };

  const handleShowLess = (e: React.MouseEvent) => {
    setVisibleCount(INITIAL_COUNT);
    smoothScrollTo(e as React.MouseEvent<HTMLAnchorElement>, '#logos');
  };

  return (
    <section className={`${headless ? 'py-0 border-none' : 'py-16 md:py-20 bg-matriz-black relative border-b border-white/5 scroll-mt-28'}`} id="logos">
      <div className={`${headless ? '' : 'container mx-auto px-6'}`}>
        
        {!headless && (
          <div className="flex flex-col lg:flex-row justify-between items-end mb-10 gap-6">
             <div className="w-full lg:w-auto">
               <span className="text-matriz-purple text-xs font-bold uppercase tracking-[0.3em]">Design de Marca</span>
               <h3 className="font-display text-3xl md:text-4xl font-bold text-white mt-2">
                 Galeria de <span className="text-gray-500">Logotipos</span>
               </h3>
               <p className="text-gray-400 mt-4 max-w-xl text-sm leading-relaxed">
                 Marcas únicas para negócios que querem se destacar.
               </p>
             </div>
          </div>
        )}

        {!limit && (
           <div className={`flex justify-end mb-8 ${headless ? 'w-full' : ''}`}>
             <div className="w-full md:w-auto relative group min-w-[240px]">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                      <Filter size={14} />
                  </div>
                  <select 
                      value={activeIndustry}
                      onChange={(e) => setActiveIndustry(e.target.value)}
                      className="w-full appearance-none bg-black/40 border border-white/10 text-gray-300 text-xs pl-9 pr-8 py-3 rounded-sm focus:border-matriz-purple focus:outline-none cursor-pointer hover:bg-white/5 transition-colors uppercase tracking-wide font-bold"
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

        {loading ? (
            <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-matriz-purple"></div>
            </div>
        ) : (
            <>
                {/* VITRINE GRID: Cards 'Glass' with reduced padding */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6">
                {visibleLogos.map((logo) => (
                    <div 
                    key={logo.id} 
                    onClick={() => onProjectClick && onProjectClick(logo, visibleLogos)}
                    className="group relative aspect-square bg-[#080808] border border-white/5 rounded-sm flex items-center justify-center overflow-hidden cursor-pointer transition-all duration-300 hover:border-matriz-purple/40 hover:bg-[#0a0a0a]"
                    >
                        {/* Background Grid */}
                        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:10px_10px] pointer-events-none"></div>

                        {/* Image */}
                        <div className="w-full h-full p-6 md:p-10 flex items-center justify-center relative z-10">
                            <img 
                                src={logo.imageUrl} 
                                alt={`Logotipo: ${logo.title}`}
                                className="max-w-full max-h-full object-contain transition-transform duration-500 group-hover:scale-110 drop-shadow-lg" 
                                loading="lazy"
                                decoding="async"
                            />
                        </div>
                        
                        {/* Minimal Label on Hover */}
                        <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                            <div className="bg-black/90 backdrop-blur-md border border-white/10 rounded-sm py-1.5 px-2 text-center">
                                <span className="text-[9px] uppercase tracking-widest text-white font-bold block truncate">{logo.title}</span>
                            </div>
                        </div>
                    </div>
                ))}
                </div>

                {!loading && filteredLogos.length === 0 && (
                    <div className="text-center py-16 bg-white/5 border border-white/5 rounded-sm">
                        <Filter size={32} className="mx-auto text-gray-600 mb-2" />
                        <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Nenhum logotipo encontrado</p>
                        <button 
                            onClick={() => setActiveIndustry('')}
                            className="mt-4 text-matriz-purple font-bold uppercase text-xs hover:underline"
                        >
                            Limpar Filtro
                        </button>
                    </div>
                )}
                
                {!limit && (hasMore || canShowLess) && (
                <div className="mt-12 flex justify-center gap-4 animate-fade-in">
                    {hasMore && (
                        <button 
                        onClick={handleLoadMore}
                        className="group relative px-8 py-4 border border-matriz-purple/20 bg-white/5 hover:bg-matriz-purple hover:border-matriz-purple text-white transition-all duration-300 overflow-hidden"
                        >
                        <div className="flex items-center gap-3 relative z-10 font-bold tracking-widest uppercase text-xs">
                            <Plus size={14} className="group-hover:rotate-180 transition-transform duration-500" />
                            Carregar Mais
                        </div>
                        </button>
                    )}

                    {canShowLess && (
                        <button 
                        onClick={handleShowLess}
                        className="group relative px-8 py-4 border border-white/10 bg-transparent hover:bg-white/5 hover:border-white text-gray-400 hover:text-white transition-all duration-300 overflow-hidden"
                        >
                        <div className="flex items-center gap-3 relative z-10 font-bold tracking-widest uppercase text-xs">
                            <Minus size={14} />
                            Ver Menos
                        </div>
                        </button>
                    )}
                </div>
                )}
            </>
        )}
      </div>
    </section>
  );
};

export default LogoGrid;
