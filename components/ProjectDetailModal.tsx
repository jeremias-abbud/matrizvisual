
import React, { useState, useEffect } from 'react';
import { Project } from '../types';
import { X, Calendar, User, ChevronLeft, ChevronRight, Maximize } from 'lucide-react';
import { getEmbedUrl } from '../src/lib/videoHelper';

interface ProjectDetailModalProps {
  project: Project | null;
  onClose: () => void;
}

const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({ project, onClose }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (project) {
      setCurrentImageIndex(0);
      setIsFullscreen(false); // Reset fullscreen state when project changes
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!project) return;

      if (e.key === 'Escape') {
        if (isFullscreen) {
          setIsFullscreen(false);
        } else {
          onClose();
        }
      }
      
      if (isFullscreen && project.gallery && project.gallery.length > 1) {
        if (e.key === 'ArrowRight') nextImage();
        if (e.key === 'ArrowLeft') prevImage();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [project, onClose, isFullscreen]);

  const nextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (project?.gallery) {
      setCurrentImageIndex((prev) => (prev + 1) % project.gallery!.length);
    }
  };

  const prevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (project?.gallery) {
      setCurrentImageIndex((prev) => (prev - 1 + project.gallery!.length) % project.gallery!.length);
    }
  };
  
  const openFullscreen = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFullscreen(true);
  };

  const closeFullscreen = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setIsFullscreen(false);
  };
  
  if (!project) return null;
  
  const displayedImage = project.gallery?.[currentImageIndex] || project.imageUrl;

  const renderFullscreenView = () => (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-black/95 backdrop-blur-xl" onClick={closeFullscreen}></div>

      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center">
        <button 
          onClick={closeFullscreen}
          className="fixed top-6 right-6 z-[120] text-white/50 hover:text-white transition-colors bg-black/50 hover:bg-matriz-purple p-3 rounded-full border border-white/10"
        >
          <X size={32} />
        </button>

        <div className="relative w-full h-full flex items-center justify-center">
          <img 
            src={displayedImage}
            alt={`Fullscreen image ${project.title}`}
            className="max-w-full max-h-full object-contain"
          />
        </div>
        
        {project.gallery && project.gallery.length > 1 && (
          <>
            <button 
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-4 text-white/50 hover:text-white transition-colors hover:bg-white/5 rounded-full"
            >
              <ChevronLeft size={48} />
            </button>
            <button 
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-4 text-white/50 hover:text-white transition-colors hover:bg-white/5 rounded-full"
            >
              <ChevronRight size={48} />
            </button>
            <div className="absolute bottom-6 bg-black/70 backdrop-blur-md px-4 py-2 text-sm text-white rounded-full border border-white/10">
              {currentImageIndex + 1} / {project.gallery.length}
            </div>
          </>
        )}
      </div>
    </div>
  );

  return (
    <>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div 
          className="absolute inset-0 bg-black/90 backdrop-blur-md transition-opacity" 
          onClick={onClose}
        ></div>
        
        <div className="relative bg-matriz-dark w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-lg border border-white/10 shadow-2xl animate-fade-in-down custom-scrollbar">
          
          <button 
            onClick={onClose}
            className="sticky top-4 right-4 z-[50] p-2 bg-black/50 hover:bg-matriz-purple rounded-full text-white transition-colors border border-white/10 float-right mr-4"
          >
            <X size={24} />
          </button>
          
          {/* --- MEDIA SECTION --- */}
          <div className="w-full h-auto aspect-video max-h-[60vh] bg-matriz-black flex items-center justify-center clear-both relative group">
            {project.videoUrl ? (
              <iframe 
                src={getEmbedUrl(project.videoUrl)} 
                title={project.title}
                className="w-full h-full"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
              ></iframe>
            ) : (
              <>
                <img 
                  src={project.imageUrl} 
                  alt={project.title} 
                  className="w-full h-full object-contain"
                />
                <button
                  onClick={openFullscreen}
                  className="absolute top-4 left-4 p-2 bg-black/50 hover:bg-matriz-purple rounded-full text-white transition-all border border-white/10 opacity-0 group-hover:opacity-100"
                  title="Ver em tela cheia"
                >
                  <Maximize size={20} />
                </button>
              </>
            )}
          </div>
          
          {/* --- CONTENT SECTION --- */}
          <div className="p-6 md:p-10">
            <div className="flex flex-col lg:flex-row gap-10">
              
              {/* Main Content (Left) */}
              <div className="flex-1">
                <div className="flex flex-wrap gap-2 mb-4 items-center">
                  <span className="inline-block px-3 py-1 bg-matriz-purple text-white text-xs font-bold uppercase tracking-widest rounded-sm">
                    {project.category}
                  </span>
                  {project.industry && (
                    <span className="inline-block px-3 py-1 bg-black/60 border border-white/20 text-white text-xs font-bold uppercase tracking-widest rounded-sm">
                      {project.industry}
                    </span>
                  )}
                </div>
                <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-6">{project.title}</h2>

                <h3 className="text-xl font-bold text-white mb-4">
                  Sobre o Projeto
                </h3>
                <p className="text-gray-300 leading-relaxed mb-8 text-lg">
                  {project.longDescription || project.description}
                </p>

                {project.gallery && project.gallery.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-white mb-2">Galeria do Projeto</h3>
                    
                    <div className="relative group bg-black border border-white/10 rounded-sm overflow-hidden select-none">
                      <div className="aspect-video w-full relative bg-matriz-dark/50 flex items-center justify-center">
                        <img 
                          src={project.gallery[currentImageIndex]} 
                          alt={`Gallery image ${currentImageIndex + 1}`} 
                          className="w-full h-full animate-fade-in object-contain p-2"
                          key={currentImageIndex}
                        />
                         <button
                           onClick={openFullscreen}
                           className="absolute top-4 left-4 p-2 bg-black/50 hover:bg-matriz-purple rounded-full text-white transition-all border border-white/10 opacity-0 group-hover:opacity-100"
                           title="Ver em tela cheia"
                         >
                           <Maximize size={20} />
                         </button>
                      </div>

                      {project.gallery.length > 1 && (
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
                         {currentImageIndex + 1} / {project.gallery.length}
                       </div>
                    </div>

                    <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar pt-2">
                      {project.gallery.map((img, idx) => (
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
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar (Right) */}
              <div className="lg:w-80 space-y-8">
                {(project.client || project.date) && (
                  <div className="bg-white/5 p-6 rounded-sm border border-white/5 space-y-4">
                    {project.client && (
                      <div className="flex items-start gap-3">
                        <User className="text-matriz-purple mt-1 flex-shrink-0" size={20} />
                        <div>
                          <h4 className="text-xs uppercase tracking-widest text-gray-400 font-bold">Cliente</h4>
                          <p className="text-white text-lg">{project.client}</p>
                        </div>
                      </div>
                    )}
                    {project.date && (
                      <div className="flex items-start gap-3">
                        <Calendar className="text-matriz-purple mt-1 flex-shrink-0" size={20} />
                        <div>
                          <h4 className="text-xs uppercase tracking-widest text-gray-400 font-bold">Data</h4>
                          <p className="text-white text-lg">{project.date}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {project.tags && project.tags.length > 0 && (
                  <div>
                    <h3 className="text-lg font-bold text-white mb-4">
                      Tecnologias & Ferramentas
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map(tag => (
                        <span key={tag} className="px-3 py-1 bg-matriz-purple/10 border border-matriz-purple/20 text-matriz-purple text-xs font-bold rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {isFullscreen && renderFullscreenView()}
    </>
  );
};

export default ProjectDetailModal;
