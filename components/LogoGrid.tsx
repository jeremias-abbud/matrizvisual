
import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Minus, ZoomIn, X, ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import { supabase } from '../src/lib/supabase';
import { PROJECTS as MOCK_PROJECTS, INDUSTRIES } from '../constants'; // Fallback
import { smoothScrollTo } from '../src/lib/scroll';
import { Project, ProjectCategory } from '../types';

interface LogoGridProps {
  headless?: boolean;
  limit?: number;
}

const LogoGrid: React.FC<LogoGridProps> = ({ headless = false, limit }) => {
  const INITIAL_COUNT = limit || 8;
  const [logos, setLogos] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);
  const [selectedLogoIndex, setSelectedLogoIndex] = useState<number | null>(null);
  const [activeIndustry, setActiveIndustry] = useState<string>('');

  const getMockLogos = () => MOCK_PROJECTS.filter(p => p.category === ProjectCategory.LOGO);

  useEffect(() => {
    async function fetchAllLogos() {
      try {
        setLoading(true);

        // 1. Fetch NEW logos from 'projects' table
        const { data: newLogosData, error: newLogosError } = await supabase
          .from('projects')
          .select('id, title, image_url, industry, created_at, display_order')
          .eq('category', ProjectCategory.LOGO)
          .order('display_order', { ascending: true, nullsFirst: true })
          .order('created_at', { ascending: false });

        if (newLogosError) throw newLogosError;
        
        const formattedNewLogos = (newLogosData || []).map((item: any) => ({
            ...item,
            imageUrl: item.image_url, // Ensure field name consistency
        })) as Project[];
        
        // 2. Fetch OLD logos from 'logos' table
        const { data: oldLogosData, error: oldLogosError } = await supabase
            .from('logos')
            .select('id, name, url, industry, display_order')
            .order('display_order', { ascending: true });

        if (oldLogosError) throw oldLogosError;

        // Map old structure to new Project structure for consistency
        const formattedOldLogos = (oldLogosData || []).map((item: any) => ({
            id: `old_${item.id}`,
            title: item.name,
            imageUrl: item.url,
            industry: item.industry,
            display_order: item.display_order,
            category: ProjectCategory.LOGO
        })) as Project[];
        
        // 3. Combine both lists
        const combinedLogos = [...formattedNewLogos, ...formattedOldLogos];

        if (combinedLogos.length > 0) {
          setLogos(combinedLogos);
        } else {
          setLogos(getMockLogos());
        }
      } catch (err) {
        console.error('Error fetching all logos:', err);
        setLogos(getMockLogos());
      } finally {
        setLoading(false);
      }
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

  const openModal = (index: number) => {
    setSelectedLogoIndex(index);
    document.body.style.overflow = 'hidden'; 
  };

  const closeModal = useCallback(() => {
    setSelectedLogoIndex(null);
    document.body.style.overflow = 'unset';
  }, []);

  const nextLogo = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (selectedLogoIndex !== null) {
      setSelectedLogoIndex((prev) => (prev !== null ? (prev + 1) % filteredLogos.length : null));
    }
  }, [selectedLogoIndex, filteredLogos.length]);

  const prevLogo = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (selectedLogoIndex !== null) {
      setSelectedLogoIndex((prev) => (prev !== null ? (prev - 1 + filteredLogos.length) % filteredLogos.length : null));
    }
  }, [selectedLogoIndex, filteredLogos.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedLogoIndex === null) return;
      
      if (e.key === 'Escape') closeModal();
      if (e.key === 'ArrowRight') nextLogo();
      if (e.key === 'ArrowLeft') prevLogo();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedLogoIndex, closeModal, nextLogo, prevLogo]);

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
                 Cada logotipo é criado para ser único. Confira nossa coleção de marcas desenvolvidas para empreendedores que desejam se destacar no mercado.
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

        {loading ? (
            <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-matriz-purple"></div>
            </div>
        ) : (
            <>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {visibleLogos.map((logo, index) => (
                    <div 
                    key={logo.id} 
                    onClick={() => openModal(index)}
                    className="group relative aspect-square bg-matriz-dark border border-white/5 rounded-sm flex items-center justify-center p-6 overflow-hidden transition-all duration-300 hover:border-matriz-purple/50 hover:bg-matriz-purple/5 hover:shadow-[0_0_25px_rgba(139,92,246,0.15)] animate-fade-in cursor-pointer"
                    >
                    <div className="absolute inset-0 bg-radial-gradient from-matriz-purple/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                        <div className="bg-matriz-purple p-1.5 rounded-full text-white shadow-[0_0_10px_rgba(139,92,246,0.5)]">
                            <ZoomIn size={16} />
                        </div>
                    </div>

                    <img 
                        src={logo.imageUrl} 
                        alt={logo.title} 
                        className="w-full h-full object-contain opacity-70 group-hover:opacity-100 transition-all duration-500 transform group-hover:scale-110 relative z-10 filter drop-shadow-sm group-hover:drop-shadow-[0_0_15px_rgba(139,92,246,0.6)]" 
                        loading="lazy"
                    />
                    
                    <div className="absolute bottom-2 left-0 w-full text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 px-2">
                        <span className="text-[10px] uppercase tracking-widest text-matriz-purple font-bold block truncate drop-shadow-md">{logo.title}</span>
                        {logo.industry && (
                            <span className="text-[8px] uppercase tracking-wide text-gray-400 block truncate">{logo.industry}</span>
                        )}
                    </div>
                    </div>
                ))}
                </div>

                {!loading && filteredLogos.length === 0 && (
                    <div className="text-center py-12 bg-white/5 border border-white/5 rounded-sm">
                        <Filter size={32} className="mx-auto text-gray-600 mb-2" />
                        <p className="text-gray-500 text-sm">Nenhum logotipo encontrado neste ramo.</p>
                        <button 
                            onClick={() => setActiveIndustry('')}
                            className="mt-2 text-matriz-purple font-bold uppercase text-xs hover:underline"
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
            </>
        )}
      </div>

      {selectedLogoIndex !== null && filteredLogos.length > 0 && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in">
            <div 
                className="absolute inset-0 bg-black/95 backdrop-blur-xl"
                onClick={closeModal}
            ></div>

            <div className="relative z-10 w-full max-w-4xl h-full flex flex-col items-center justify-center">
                
                <button 
                    onClick={closeModal}
                    className="fixed top-6 right-6 z-[110] text-white/50 hover:text-white transition-colors bg-black/50 hover:bg-matriz-purple p-3 rounded-full border border-white/10"
                >
                    <X size={32} />
                </button>

                <div className="relative w-full h-[60vh] md:h-[70vh] flex items-center justify-center">
                    <img 
                        key={selectedLogoIndex}
                        src={filteredLogos[selectedLogoIndex].imageUrl} 
                        alt={filteredLogos[selectedLogoIndex].title} 
                        className="max-w-full max-h-full object-contain filter drop-shadow-[0_0_30px_rgba(255,255,255,0.1)] animate-fade-in"
                    />
                </div>

                <div className="mt-8 text-center">
                    <h3 className="font-display text-2xl md:text-3xl font-bold text-white">
                        {filteredLogos[selectedLogoIndex].title}
                    </h3>
                    <div className="flex flex-col items-center gap-1 mt-2">
                        <span className="text-matriz-purple text-xs uppercase tracking-[0.3em] font-bold block">
                            Logotipos
                        </span>
                        {filteredLogos[selectedLogoIndex].industry && (
                             <span className="text-gray-500 text-[10px] uppercase tracking-widest bg-white/5 px-2 py-1 rounded">
                                {filteredLogos[selectedLogoIndex].industry}
                             </span>
                        )}
                    </div>
                </div>

                <button 
                    onClick={prevLogo}
                    className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 p-4 text-white/50 hover:text-white transition-colors hover:bg-white/5 rounded-full"
                >
                    <ChevronLeft size={48} />
                </button>
                <button 
                    onClick={nextLogo}
                    className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 p-4 text-white/50 hover:text-white transition-colors hover:bg-white/5 rounded-full"
                >
                    <ChevronRight size={48} />
                </button>

            </div>
        </div>
      )}
    </section>
  );
};

export default LogoGrid;
