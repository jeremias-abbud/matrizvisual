import React, { useState, useEffect } from 'react';
import { PROJECTS } from '../constants';
import { Project, ProjectCategory } from '../types';
import { X, Calendar, User, ArrowRight, ChevronLeft, ChevronRight, Plus, Minus, PlayCircle, Globe, Image as ImageIcon } from 'lucide-react';

const ITEMS_PER_PAGE = 6;

const Portfolio: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<ProjectCategory>(ProjectCategory.ALL);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  // Disable body scroll when modal is open and reset image index
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

  // Reset visible count when category changes
  useEffect(() => {
    setVisibleCount(ITEMS_PER_PAGE);
  }, [activeCategory]);

  const filteredProjects = activeCategory === ProjectCategory.ALL
    ? PROJECTS
    : PROJECTS.filter(project => project.category === activeCategory);

  const visibleProjects = filteredProjects.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProjects.length;
  const canShowLess = visibleCount > ITEMS_PER_PAGE;

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + ITEMS_PER_PAGE);
  };

  const handleShowLess = () => {
    setVisibleCount(ITEMS_PER_PAGE);
    const section = document.getElementById('portfolio');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // ProjectCategory enum already includes 'Todos' (ALL), so we just use Object.values
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

  // Helper to get type icon
  const getTypeIcon = (category: ProjectCategory) => {
    switch (category) {
      case ProjectCategory.VIDEO:
        return <PlayCircle className="text-white drop-shadow-md" size={48} />;
      case ProjectCategory.WEB:
        return <Globe className="text-white drop-shadow-md" size={48} />;
      default:
        return null; // Clean look for design, or could use ImageIcon
    }
  };

  return (
    <section id="portfolio" className="py-16 md:py-20 bg-matriz-black scroll-mt-28 relative">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6">
          <div>
            <span className="text-matriz-purple uppercase tracking-widest text-sm font-bold">Nosso Trabalho</span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-white mt-2">Portfólio</h2>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-2 md:gap-4">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 text-sm uppercase tracking-wider transition-all border ${
                  activeCategory === category
                    ? 'border-matriz-purple bg-matriz-purple/10 text-white shadow-[0_0_10px_rgba(139,92,246,0.3)]'
                    : 'border-white/10 text-gray-500 hover:border-white/30 hover:text-white'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Counters */}
        <div className="mb-6 text-gray-500 text-sm text-right">
          Exibindo {visibleProjects.length} de {filteredProjects.length} projetos
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {visibleProjects.map((project) => (
            <div key={project.id} className="group relative overflow-hidden bg-matriz-dark border border-white/5 animate-fade-in flex flex-col cursor-pointer" onClick={() => setSelectedProject(project)}>
              {/* Image Container */}
              <div className="aspect-video overflow-hidden relative bg-matriz-dark">
                <img 
                  src={project.imageUrl} 
                  alt={project.title} 
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 filter grayscale group-hover:grayscale-0"
                />
                
                {/* Format Indicator (Center) */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none">
                    {getTypeIcon(project.category)}
                </div>

                 {/* Overlay Content */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                  <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <span className="text-matriz-purple text-xs font-bold uppercase tracking-wider mb-2 block">
                      {project.category}
                    </span>
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
              
              {/* Border Glow Effect */}
              <div className="absolute inset-0 border-2 border-matriz-purple opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            </div>
          ))}
        </div>
        
        {filteredProjects.length === 0 && (
          <div className="text-center py-20 animate-fade-in">
            <p className="text-gray-500">Nenhum projeto encontrado nesta categoria.</p>
          </div>
        )}

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

      {/* Project Details Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/90 backdrop-blur-md transition-opacity" 
            onClick={() => setSelectedProject(null)}
          ></div>
          
          <div className="relative bg-matriz-dark w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-lg border border-white/10 shadow-2xl animate-fade-in-down custom-scrollbar">
            
            <button 
              onClick={() => setSelectedProject(null)}
              className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-matriz-purple rounded-full text-white transition-colors border border-white/10"
            >
              <X size={24} />
            </button>

            {/* Hero Image */}
            <div className="w-full h-64 md:h-96 relative">
              <img 
                src={selectedProject.imageUrl} 
                alt={selectedProject.title} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-matriz-dark to-transparent"></div>
              
              <div className="absolute bottom-0 left-0 p-6 md:p-10 w-full">
                <span className="inline-block px-3 py-1 mb-3 bg-matriz-purple text-white text-xs font-bold uppercase tracking-widest rounded-sm">
                  {selectedProject.category}
                </span>
                <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-2">{selectedProject.title}</h2>
              </div>
            </div>

            <div className="p-6 md:p-10">
              <div className="flex flex-col lg:flex-row gap-10">
                
                {/* Main Content */}
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    Sobre o Projeto
                  </h3>
                  <p className="text-gray-300 leading-relaxed mb-8 text-lg">
                    {selectedProject.longDescription || selectedProject.description}
                  </p>

                  {/* Enhanced Gallery Carousel */}
                  {selectedProject.gallery && selectedProject.gallery.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-bold text-white mb-2">Galeria do Projeto</h3>
                      
                      <div className="relative group bg-black border border-white/10 rounded-sm overflow-hidden select-none">
                        {/* Main Image Display */}
                        <div className="aspect-video w-full relative bg-matriz-dark/50 flex items-center justify-center">
                          <img 
                            src={selectedProject.gallery[currentImageIndex]} 
                            alt={`Gallery image ${currentImageIndex + 1}`} 
                            className="w-full h-full object-contain animate-fade-in"
                            key={currentImageIndex} // Key forces re-render animation
                          />
                        </div>

                        {/* Navigation Controls */}
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
                        
                        {/* Image Counter */}
                         <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-md px-3 py-1 text-xs text-white rounded-full border border-white/10">
                           {currentImageIndex + 1} / {selectedProject.gallery.length}
                         </div>
                      </div>

                      {/* Thumbnails */}
                      <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar pt-2">
                        {selectedProject.gallery.map((img, idx) => (
                          <button
                            key={idx}
                            onClick={() => setCurrentImageIndex(idx)}
                            className={`relative flex-shrink-0 w-24 h-16 rounded-sm overflow-hidden border-2 transition-all ${
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
                              className="w-full h-full object-cover" 
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Sidebar Info */}
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