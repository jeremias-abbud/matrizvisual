import React, { useState, useEffect, useCallback } from 'react';
import { LOGOS } from '../constants';
import { Plus, Minus, ZoomIn, X, ChevronLeft, ChevronRight } from 'lucide-react';

const LogoGrid: React.FC = () => {
  const INITIAL_COUNT = 8;
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);
  const [selectedLogoIndex, setSelectedLogoIndex] = useState<number | null>(null);
  
  const visibleLogos = LOGOS.slice(0, visibleCount);
  const hasMore = visibleCount < LOGOS.length;
  const canShowLess = visibleCount > INITIAL_COUNT;

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 8);
  };

  const handleShowLess = () => {
    setVisibleCount(INITIAL_COUNT);
    const section = document.getElementById('logos');
    if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const openModal = (index: number) => {
    setSelectedLogoIndex(index);
    document.body.style.overflow = 'hidden'; // Prevent scrolling
  };

  const closeModal = useCallback(() => {
    setSelectedLogoIndex(null);
    document.body.style.overflow = 'unset';
  }, []);

  const nextLogo = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (selectedLogoIndex !== null) {
      // Find the actual index in the full LOGOS array based on current visibility context
      // Actually, navigation should probably cycle through ALL logos or just visible ones? 
      // User expectation: Cycle through available images. Let's cycle through ALL logos for better UX.
      setSelectedLogoIndex((prev) => (prev !== null ? (prev + 1) % LOGOS.length : null));
    }
  }, [selectedLogoIndex]);

  const prevLogo = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (selectedLogoIndex !== null) {
      setSelectedLogoIndex((prev) => (prev !== null ? (prev - 1 + LOGOS.length) % LOGOS.length : null));
    }
  }, [selectedLogoIndex]);

  // Keyboard navigation
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
    <section className="py-16 md:py-20 bg-matriz-black relative border-b border-white/5 scroll-mt-28" id="logos">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6">
           <div>
             <span className="text-matriz-purple text-xs font-bold uppercase tracking-[0.3em]">Identidade Visual</span>
             <h3 className="font-display text-3xl md:text-4xl font-bold text-white mt-2">
               Galeria de <span className="text-gray-500">Logotipos</span>
             </h3>
             <p className="text-gray-400 mt-4 max-w-xl text-sm leading-relaxed">
               Cada logotipo é criado para ser único. Confira nossa coleção de marcas desenvolvidas para empreendedores que desejam se destacar no mercado.
             </p>
           </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {visibleLogos.map((logo, index) => (
            <div 
              key={logo.id} 
              onClick={() => openModal(index)}
              className="group relative aspect-square bg-matriz-dark border border-white/5 rounded-sm flex items-center justify-center p-6 overflow-hidden transition-all duration-300 hover:border-matriz-purple/50 hover:bg-white/5 animate-fade-in cursor-pointer"
            >
              {/* Glow Effect on Hover */}
              <div className="absolute inset-0 bg-matriz-purple/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              {/* Icon Overlay */}
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                <div className="bg-matriz-purple p-1.5 rounded-full text-white shadow-lg">
                    <ZoomIn size={16} />
                </div>
              </div>

              {/* Logo Image */}
              <img 
                src={logo.url} 
                alt={logo.name} 
                className="w-full h-full object-contain filter grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500 transform group-hover:scale-105 relative z-10" 
                loading="lazy"
              />
              
              <div className="absolute bottom-2 left-0 w-full text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-[10px] uppercase tracking-widest text-matriz-purple font-bold">{logo.name}</span>
              </div>
            </div>
          ))}
        </div>
        
        {/* Load More / Less Buttons */}
        {(hasMore || canShowLess) && (
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

      {/* Lightbox Modal */}
      {selectedLogoIndex !== null && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/95 backdrop-blur-xl"
                onClick={closeModal}
            ></div>

            {/* Content */}
            <div className="relative z-10 w-full max-w-4xl h-full flex flex-col items-center justify-center">
                
                {/* Close Button */}
                <button 
                    onClick={closeModal}
                    className="absolute top-4 right-4 md:-top-10 md:-right-10 text-white/50 hover:text-white transition-colors bg-white/10 hover:bg-matriz-purple p-2 rounded-full"
                >
                    <X size={32} />
                </button>

                {/* Main Image Container */}
                <div className="relative w-full h-[60vh] md:h-[70vh] flex items-center justify-center">
                    <img 
                        key={selectedLogoIndex} // Force re-render for animation
                        src={LOGOS[selectedLogoIndex].url} 
                        alt={LOGOS[selectedLogoIndex].name} 
                        className="max-w-full max-h-full object-contain filter drop-shadow-[0_0_30px_rgba(255,255,255,0.1)] animate-fade-in"
                    />
                </div>

                {/* Caption */}
                <div className="mt-8 text-center">
                    <h3 className="font-display text-2xl md:text-3xl font-bold text-white">
                        {LOGOS[selectedLogoIndex].name}
                    </h3>
                    <span className="text-matriz-purple text-xs uppercase tracking-[0.3em] font-bold mt-2 block">
                        Design de Marca
                    </span>
                </div>

                {/* Navigation Buttons */}
                <button 
                    onClick={prevLogo}
                    className="absolute left-0 md:-left-20 top-1/2 -translate-y-1/2 p-4 text-white/50 hover:text-white transition-colors hover:bg-white/5 rounded-full"
                >
                    <ChevronLeft size={48} />
                </button>
                <button 
                    onClick={nextLogo}
                    className="absolute right-0 md:-right-20 top-1/2 -translate-y-1/2 p-4 text-white/50 hover:text-white transition-colors hover:bg-white/5 rounded-full"
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