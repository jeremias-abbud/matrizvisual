
import React, { useState, useEffect } from 'react';
import { Project, ProjectCategory } from '../types';
import { X, Calendar, User, ArrowRight, ChevronLeft, ChevronRight, PlayCircle } from 'lucide-react';
import { getEmbedUrl } from '../src/lib/videoHelper';

interface ProjectDetailModalProps {
  project: Project | null;
  onClose: () => void;
}

const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({ project, onClose }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (project) {
      setCurrentImageIndex(0);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [project, onClose]);

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

  if (!project) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/90 backdrop-blur-md transition-opacity" 
        onClick={onClose}
      ></div>
      
      <div className="relative bg-matriz-dark w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-lg border border-white/10 shadow-2xl animate-fade-in-down custom-scrollbar">
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-[50] p-2 bg-black/50 hover:bg-matriz-purple rounded-full text-white transition-colors border border-white/10"
        >
          <X size={24} />
        </button>

        <div className="w-full h-64 md:h-96 relative bg-matriz-black flex items-center justify-center overflow-hidden">
            {project.videoUrl ? (
                 <div className="w-full h-full relative z-20">
                     <iframe 
                         src={getEmbedUrl(project.videoUrl)} 
                         title={project.title}
                         className="w-full h-full"
                         frameBorder="0"
                         allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                         allowFullScreen
                     ></iframe>
                 </div>
            ) : (
                <>
                    {project.category === ProjectCategory.LOGO && (
                        <img 
                            src={project.imageUrl} 
                            className="absolute inset-0 w-full h-full object-cover opacity-20 blur-xl scale-150"
                        />
                    )}
                    <img 
                        src={project.imageUrl} 
                        alt={project.title} 
                        className="w-full h-full relative z-10 object-contain p-4 bg-black/30"
                    />
                     <div className="absolute inset-0 bg-gradient-to-t from-matriz-dark via-transparent to-transparent z-20 pointer-events-none"></div>
                </>
            )}
          
          {!project.videoUrl && (
              <div className="absolute bottom-0 left-0 p-6 md:p-10 w-full z-30">
                <div className="flex gap-2 mb-3 items-center">
                    <span className="inline-block px-3 py-1 bg-matriz-purple text-white text-xs font-bold uppercase tracking-widest rounded-sm">
                    {project.category}
                    </span>
                    {project.industry && (
                        <span className="inline-block px-3 py-1 bg-black/60 border border-white/20 text-white text-xs font-bold uppercase tracking-widest rounded-sm">
                        {project.industry}
                        </span>
                    )}
                </div>
                <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-2 drop-shadow-lg">{project.title}</h2>
            </div>
          )}
        </div>
        
        {project.videoUrl && (
            <div className="p-6 md:px-10 md:pt-10 md:pb-0">
                <div className="flex gap-2 mb-3 items-center">
                    <span className="inline-block px-3 py-1 bg-matriz-purple text-white text-xs font-bold uppercase tracking-widest rounded-sm">
                    {project.category}
                    </span>
                    {project.industry && (
                        <span className="inline-block px-3 py-1 bg-black/60 border border-white/20 text-white text-xs font-bold uppercase tracking-widest rounded-sm">
                        {project.industry}
                        </span>
                    )}
                </div>
                <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-2 drop-shadow-lg">{project.title}</h2>
            </div>
        )}

        <div className="p-6 md:p-10">
          <div className="flex flex-col lg:flex-row gap-10">
            
            <div className="flex-1">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
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

            <div className="lg:w-80 space-y-8">
              <div className="bg-white/5 p-6 rounded-sm border border-white/5">
                <div className="space-y-4">
                  {project.client && (
                    <div>
                      <span className="text-xs uppercase tracking-widest text-gray-500 block mb-1">Cliente</span>
                      <div className="flex items-center gap-2 text-white font-medium">
                        <User size={16} className="text-matriz-purple" />
                        {project.client}
                      </div>
                    </div>
                  )}
                  
                  {project.date && (
                    <div>
                      <span className="text-xs uppercase tracking-widest text-gray-500 block mb-1">Data</span>
                      <div className="flex items-center gap-2 text-white font-medium">
                        <Calendar size={16} className="text-matriz-purple" />
                        {project.date}
                      </div>
                    </div>
                  )}

                  {project.industry && (
                    <div>
                      <span className="text-xs uppercase tracking-widest text-gray-500 block mb-1">Ramo</span>
                      <div className="flex items-center gap-2 text-white font-medium">
                         <span className="text-sm border border-white/10 px-2 py-1 rounded bg-black/50">
                            {project.industry}
                         </span>
                      </div>
                    </div>
                  )}

                  <div>
                    <span className="text-xs uppercase tracking-widest text-gray-500 block mb-2">Tecnologias</span>
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map(tag => (
                        <span key={tag} className="px-2 py-1 bg-black text-xs text-gray-300 border border-white/10 rounded-sm">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              <a href="#contact" onClick={onClose} className="block w-full py-3 bg-matriz-purple hover:bg-purple-600 text-white font-bold uppercase tracking-widest text-center transition-colors text-sm">
                Solicitar Orçamento
              </a>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default ProjectDetailModal;
