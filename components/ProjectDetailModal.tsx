
import React, { useState, useEffect, useCallback } from 'react';
import { Project } from '../types';
import { X, Calendar, User, ChevronLeft, ChevronRight, Maximize } from 'lucide-react';
import { getEmbedUrl } from '../src/lib/videoHelper';

interface ProjectDetailModalProps {
  project: Project | null;
  onClose: () => void;
}

const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({ project, onClose }) => {
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);
  const [fullscreenIndex, setFullscreenIndex] = useState(0);

  // Combina imagem de capa com imagens da galeria para navegação completa
  const allImages = project ? [project.imageUrl, ...(project.gallery || [])] : [];

  const handleClose = useCallback(() => {
    if (fullscreenImage) {
      setFullscreenImage(null);
    } else {
      onClose();
    }
  }, [fullscreenImage, onClose]);

  const openFullscreen = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    setFullscreenIndex(index);
    setFullscreenImage(allImages[index]);
  };

  const nextImage = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    const newIndex = (fullscreenIndex + 1) % allImages.length;
    setFullscreenIndex(newIndex);
    setFullscreenImage(allImages[newIndex]);
  }, [fullscreenIndex, allImages]);

  const prevImage = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    const newIndex = (fullscreenIndex - 1 + allImages.length) % allImages.length;
    setFullscreenIndex(newIndex);
    setFullscreenImage(allImages[newIndex]);
  }, [fullscreenIndex, allImages]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!project) return;
      
      // Se estiver em fullscreen
      if (fullscreenImage) {
        if (e.key === 'Escape') setFullscreenImage(null);
        if (e.key === 'ArrowRight') nextImage();
        if (e.key === 'ArrowLeft') prevImage();
        return;
      }

      // Se estiver apenas no modal
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [project, onClose, fullscreenImage, nextImage, prevImage]);

  useEffect(() => {
    if (project) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [project]);

  if (!project) return null;
  
  const hasGallery = project.gallery && project.gallery.length > 0;

  const renderFullscreenView = () => (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-black/95 backdrop-blur-xl" onClick={() => setFullscreenImage(null)}></div>
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center">
        <button onClick={() => setFullscreenImage(null)} className="fixed top-6 right-6 z-[120] text-white/50 hover:text-white transition-colors bg-black/50 hover:bg-matriz-purple p-3 rounded-full border border-white/10">
          <X size={32} />
        </button>
        
        <div className="relative w-full h-full flex items-center justify-center">
          <img 
            src={fullscreenImage!} 
            alt={`Fullscreen image ${project.title}`} 
            className="max-w-full max-h-full object-contain" 
          />
        </div>
        
        {/* Mostra setas de navegação se houver mais de uma imagem no total */}
        {allImages.length > 1 && (
          <>
            <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 p-4 text-white/50 hover:text-white transition-colors hover:bg-white/5 rounded-full">
              <ChevronLeft size={48} />
            </button>
            <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 p-4 text-white/50 hover:text-white transition-colors hover:bg-white/5 rounded-full">
              <ChevronRight size={48} />
            </button>
            <div className="absolute bottom-6 bg-black/70 backdrop-blur-md px-4 py-2 text-sm text-white rounded-full border border-white/10">
              {fullscreenIndex + 1} / {allImages.length}
            </div>
          </>
        )}
      </div>
    </div>
  );

  return (
    <>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/90 backdrop-blur-md transition-opacity" onClick={onClose}></div>
        <div className="relative bg-matriz-dark w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-lg border border-white/10 shadow-2xl animate-fade-in-down custom-scrollbar">
          <button onClick={onClose} className="sticky top-4 right-4 z-[50] p-2 bg-black/50 hover:bg-matriz-purple rounded-full text-white transition-colors border border-white/10 float-right mr-4">
            <X size={24} />
          </button>
          
          <div className="w-full h-auto aspect-video max-h-[60vh] bg-matriz-black flex items-center justify-center clear-both relative group">
            {project.videoUrl ? (
              <iframe src={getEmbedUrl(project.videoUrl)} title={project.title} className="w-full h-full" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
            ) : (
              <>
                <img 
                    src={project.imageUrl} 
                    alt={project.title} 
                    className="w-full h-full object-contain cursor-pointer" 
                    onClick={(e) => openFullscreen(e, 0)}
                />
                <button onClick={(e) => openFullscreen(e, 0)} className="absolute top-4 left-4 p-2 bg-black/50 hover:bg-matriz-purple rounded-full text-white transition-all border border-white/10 opacity-0 group-hover:opacity-100" title="Ver em tela cheia">
                  <Maximize size={20} />
                </button>
              </>
            )}
          </div>
          
          <div className="p-6 md:p-10">
            <div className="flex flex-col lg:flex-row gap-10">
              
              <div className="flex-1">
                <div className="flex flex-wrap gap-2 mb-4 items-center">
                  <span className="inline-block px-3 py-1 bg-matriz-purple text-white text-xs font-bold uppercase tracking-widest rounded-sm">{project.category}</span>
                  {project.industry && <span className="inline-block px-3 py-1 bg-black/60 border border-white/20 text-white text-xs font-bold uppercase tracking-widest rounded-sm">{project.industry}</span>}
                </div>
                <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-6">{project.title}</h2>
                <h3 className="text-xl font-bold text-white mb-4">Sobre o Projeto</h3>
                <p className="text-gray-300 leading-relaxed mb-8 text-lg">{project.longDescription || project.description}</p>

                {hasGallery && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-white mb-2">Galeria do Projeto</h3>
                    <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar pt-2">
                      {project.gallery!.map((img, idx) => (
                        <button 
                            key={idx} 
                            onClick={(e) => openFullscreen(e, idx + 1)} // idx + 1 porque 0 é a capa
                            className="relative flex-shrink-0 w-32 h-20 rounded-sm overflow-hidden border-2 border-transparent hover:border-matriz-purple/50 bg-black group"
                        >
                          <img src={img} alt="" loading="lazy" decoding="async" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/50 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                            <Maximize size={24} className="text-white" />
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

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
                    <h3 className="text-lg font-bold text-white mb-4">Tecnologias & Ferramentas</h3>
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map(tag => (
                        <span key={tag} className="px-3 py-1 bg-matriz-purple/10 border border-matriz-purple/20 text-matriz-purple text-xs font-bold rounded-full">{tag}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {fullscreenImage && renderFullscreenView()}
    </>
  );
};

export default ProjectDetailModal;
