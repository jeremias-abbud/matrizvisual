
import React, { useState, useEffect, useCallback } from 'react';
import { Project } from '../types';
import { X, Calendar, User, ChevronLeft, ChevronRight, Maximize, Share2, Link2, Check, MessageCircle, Globe } from 'lucide-react';
import { getEmbedUrl } from '../src/lib/videoHelper';

interface ProjectDetailModalProps {
  project: Project | null;
  onClose: () => void;
  onNext?: () => void;
  onPrev?: () => void;
  hasNext?: boolean;
  hasPrev?: boolean;
}

const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({ 
  project, 
  onClose,
  onNext,
  onPrev,
  hasNext,
  hasPrev
}) => {
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);
  const [fullscreenVideo, setFullscreenVideo] = useState<boolean>(false); // Novo estado para vídeo
  const [fullscreenIndex, setFullscreenIndex] = useState(0);
  const [linkCopied, setLinkCopied] = useState(false);

  // Combina imagem de capa com imagens da galeria para navegação completa
  const allImages = project ? [project.imageUrl, ...(project.gallery || [])] : [];

  const handleClose = useCallback(() => {
    if (fullscreenImage) {
      setFullscreenImage(null);
    } else if (fullscreenVideo) {
      setFullscreenVideo(false);
    } else {
      onClose();
    }
  }, [fullscreenImage, fullscreenVideo, onClose]);

  const openFullscreen = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    setFullscreenIndex(index);
    setFullscreenImage(allImages[index]);
  };

  const openVideoFullscreen = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFullscreenVideo(true);
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

  // Sharing Functions
  const handleShareWhatsApp = () => {
    if (!project) return;
    const deepLink = `${window.location.origin}/?project=${project.id}`;
    const text = `Confira este projeto incrível: *${project.title}* - Matriz Visual\n${deepLink}`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const handleCopyLink = () => {
    if (!project) return;
    const deepLink = `${window.location.origin}/?project=${project.id}`;
    navigator.clipboard.writeText(deepLink);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!project) return;
      
      // Se estiver em fullscreen VIDEO
      if (fullscreenVideo) {
         if (e.key === 'Escape') setFullscreenVideo(false);
         return;
      }

      // Se estiver em fullscreen IMAGEM (Navega entre IMAGENS)
      if (fullscreenImage) {
        if (e.key === 'Escape') setFullscreenImage(null);
        if (e.key === 'ArrowRight') nextImage();
        if (e.key === 'ArrowLeft') prevImage();
        return;
      }

      // Se estiver apenas no modal (Navega entre PROJETOS)
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' && onNext) onNext();
      if (e.key === 'ArrowLeft' && onPrev) onPrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [project, onClose, fullscreenImage, fullscreenVideo, nextImage, prevImage, onNext, onPrev]);

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
  const showDescriptionTitle = (project.description || project.longDescription) && (project.description.length > 10 || (project.longDescription && project.longDescription.length > 10));

  // Detecta se é um vídeo vertical (Shorts/Reels) para ajustar o player no mobile
  const isVerticalVideo = project.category === 'Vídeos' && project.videoUrl && (
    project.videoUrl.includes('/shorts/') || 
    project.videoUrl.includes('tiktok') || 
    project.videoUrl.includes('reel')
  );

  const renderFullscreenView = () => (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-0 animate-fade-in touch-none">
      <div className="absolute inset-0 bg-black/95 backdrop-blur-xl" onClick={() => { setFullscreenImage(null); setFullscreenVideo(false); }}></div>
      
      <div className="relative z-[115] w-full h-full flex flex-col items-center justify-center">
        {/* Close Button */}
        <button onClick={() => { setFullscreenImage(null); setFullscreenVideo(false); }} className="fixed top-4 right-4 z-[130] text-white hover:text-matriz-purple bg-black/60 p-3 rounded-full border border-white/10 backdrop-blur-md transition-colors shadow-lg">
          <X size={28} />
        </button>
        
        {fullscreenVideo && project.videoUrl ? (
             <div className={`relative w-full h-full flex items-center justify-center p-0 md:p-8 ${isVerticalVideo ? 'max-w-md mx-auto' : 'max-w-6xl mx-auto'}`}>
                <iframe 
                    src={getEmbedUrl(project.videoUrl)} 
                    title={project.title} 
                    className={`w-full ${isVerticalVideo ? 'h-full md:h-[90vh]' : 'aspect-video shadow-2xl'}`} 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                ></iframe>
             </div>
        ) : (
            <div className="relative w-full h-full flex items-center justify-center p-2 md:p-8">
            <img 
                src={fullscreenImage!} 
                alt={`Visualização em tela cheia do projeto ${project.title}`} 
                className="max-w-full max-h-full object-contain shadow-2xl" 
                decoding="async"
            />
            </div>
        )}
        
        {/* Navegação de IMAGENS na tela cheia - MOBILE OTIMIZADO (Só aparece se for imagem) */}
        {!fullscreenVideo && allImages.length > 1 && (
          <>
            <button 
                onClick={prevImage} 
                className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 p-4 text-white bg-black/60 hover:bg-matriz-purple border border-white/20 rounded-full z-[130] backdrop-blur-md transition-all active:scale-95 shadow-lg touch-manipulation"
                aria-label="Imagem Anterior"
            >
              <ChevronLeft size={32} />
            </button>
            
            <button 
                onClick={nextImage} 
                className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 p-4 text-white bg-black/60 hover:bg-matriz-purple border border-white/20 rounded-full z-[130] backdrop-blur-md transition-all active:scale-95 shadow-lg touch-manipulation"
                aria-label="Próxima Imagem"
            >
              <ChevronRight size={32} />
            </button>
            
            <div className="absolute bottom-8 bg-black/70 backdrop-blur-md px-6 py-2 text-sm text-white rounded-full border border-white/10 font-bold tracking-widest z-[120]">
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
        
        {/* Botão Anterior (Projeto) - Visível apenas em Desktop ou Tablet grande */}
        {hasPrev && (
            <button 
                onClick={(e) => { e.stopPropagation(); onPrev && onPrev(); }}
                className="hidden lg:flex absolute left-4 top-1/2 -translate-y-1/2 z-[105] p-3 bg-black/50 border border-white/10 text-white/70 hover:text-white hover:bg-matriz-purple rounded-full transition-all hover:scale-110"
                title="Projeto Anterior"
            >
                <ChevronLeft size={32} />
            </button>
        )}

        {/* Botão Próximo (Projeto) - Visível apenas em Desktop ou Tablet grande */}
        {hasNext && (
            <button 
                onClick={(e) => { e.stopPropagation(); onNext && onNext(); }}
                className="hidden lg:flex absolute right-4 top-1/2 -translate-y-1/2 z-[105] p-3 bg-black/50 border border-white/10 text-white/70 hover:text-white hover:bg-matriz-purple rounded-full transition-all hover:scale-110"
                title="Próximo Projeto"
            >
                <ChevronRight size={32} />
            </button>
        )}

        <div className="relative bg-matriz-dark w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-lg border border-white/10 shadow-2xl animate-fade-in-down custom-scrollbar">
          <button onClick={onClose} className="sticky top-4 right-4 z-[50] p-2 bg-black/50 hover:bg-matriz-purple rounded-full text-white transition-colors border border-white/10 float-right mr-4 backdrop-blur-sm">
            <X size={24} />
          </button>
          
          <div className={`w-full bg-matriz-black flex items-center justify-center clear-both relative group ${
              isVerticalVideo 
                ? 'aspect-[9/16] md:aspect-video h-[75vh] md:h-auto md:max-h-[60vh]' 
                : 'aspect-video h-auto max-h-[60vh]'
          }`}>
            {project.videoUrl && project.category === 'Vídeos' ? (
              <>
                  <iframe 
                    key={project.id} // FORÇA O REACT A RECRIAR O IFRAME AO TROCAR DE PROJETO
                    src={getEmbedUrl(project.videoUrl)} 
                    title={project.title} 
                    className="w-full h-full" 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                  ></iframe>
                   <button onClick={openVideoFullscreen} className="absolute top-4 left-4 p-2 bg-black/50 hover:bg-matriz-purple rounded-full text-white transition-all border border-white/10 flex items-center gap-2 backdrop-blur-sm z-20" title="Ver em tela cheia">
                        <Maximize size={20} /> <span className="text-xs font-bold uppercase hidden md:inline">Expandir</span>
                   </button>
              </>
            ) : (
              <>
                <img 
                    key={project.id} // FORÇA O REACT A RECRIAR A IMAGEM AO TROCAR DE PROJETO
                    src={project.imageUrl} 
                    alt={project.title} 
                    className="w-full h-full object-contain cursor-pointer" 
                    onClick={(e) => openFullscreen(e, 0)}
                    decoding="async"
                />
                <button onClick={(e) => openFullscreen(e, 0)} className="absolute top-4 left-4 p-2 bg-black/50 hover:bg-matriz-purple rounded-full text-white transition-all border border-white/10 opacity-100 md:opacity-0 md:group-hover:opacity-100 flex items-center gap-2 backdrop-blur-sm" title="Ver em tela cheia">
                  <Maximize size={20} /> <span className="text-xs font-bold uppercase hidden md:inline">Expandir</span>
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
                
                {showDescriptionTitle && (
                    <h3 className="text-xl font-bold text-white mb-4">Sobre o Projeto</h3>
                )}
                <p className="text-gray-300 leading-relaxed mb-8 text-lg">{project.longDescription || project.description}</p>
                
                {project.category === 'Web Sites' && (
                    <div className="mb-8">
                         <a 
                            href={project.videoUrl || '#'} 
                            target="_blank" 
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-matriz-purple text-white font-bold uppercase tracking-widest hover:bg-white hover:text-matriz-black transition-all duration-300 rounded-sm"
                         >
                            <Globe size={18} /> Acessar Site
                         </a>
                    </div>
                )}

                {hasGallery && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-white mb-2">Galeria do Projeto</h3>
                    <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar pt-2">
                      {/* O índice aqui começa em 1, pois 0 é a capa */}
                      {project.gallery!.map((img, idx) => (
                        <button 
                            key={idx} 
                            onClick={(e) => openFullscreen(e, idx + 1)} 
                            className="relative flex-shrink-0 w-32 h-20 rounded-sm overflow-hidden border-2 border-transparent hover:border-matriz-purple/50 bg-black group"
                        >
                          <img 
                            src={img} 
                            alt={`Detalhe do projeto ${project.title} - Imagem ${idx + 1}`} 
                            loading="lazy" 
                            decoding="async" 
                            className="w-full h-full object-cover" 
                          />
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
                {/* Share Actions */}
                <div className="bg-matriz-purple/5 p-4 rounded-sm border border-matriz-purple/20">
                    <h4 className="text-xs uppercase tracking-widest text-matriz-purple font-bold mb-3 flex items-center gap-2">
                        <Share2 size={14} /> Compartilhar
                    </h4>
                    <div className="flex flex-col gap-2">
                        <button 
                            onClick={handleShareWhatsApp}
                            className="w-full flex items-center justify-center gap-2 py-3 bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366] hover:text-black border border-[#25D366]/30 rounded-sm transition-all text-xs font-bold uppercase tracking-wide"
                        >
                            <MessageCircle size={16} /> WhatsApp
                        </button>
                        <button 
                            onClick={handleCopyLink}
                            className="w-full flex items-center justify-center gap-2 py-3 bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white border border-white/10 rounded-sm transition-all text-xs font-bold uppercase tracking-wide"
                        >
                            {linkCopied ? <Check size={16} className="text-green-500" /> : <Link2 size={16} />}
                            {linkCopied ? 'Link Copiado!' : 'Copiar Link'}
                        </button>
                    </div>
                </div>

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
          
          {/* Navegação Mobile entre PROJETOS (Fixo no rodapé do modal) */}
          <div className="lg:hidden flex justify-between p-4 border-t border-white/10 bg-matriz-black/80 backdrop-blur sticky bottom-0 z-40">
                <button 
                    onClick={(e) => { e.stopPropagation(); onPrev && onPrev(); }}
                    disabled={!hasPrev}
                    className={`flex items-center gap-2 text-sm font-bold uppercase border border-white/10 px-4 py-2 rounded-full ${hasPrev ? 'text-white bg-black/50' : 'text-gray-600 bg-black/20'}`}
                >
                    <ChevronLeft size={18} /> Anterior
                </button>
                <button 
                    onClick={(e) => { e.stopPropagation(); onNext && onNext(); }}
                    disabled={!hasNext}
                    className={`flex items-center gap-2 text-sm font-bold uppercase border border-white/10 px-4 py-2 rounded-full ${hasNext ? 'text-white bg-black/50' : 'text-gray-600 bg-black/20'}`}
                >
                    Próximo <ChevronRight size={18} />
                </button>
          </div>
        </div>
      </div>
      {(fullscreenImage || fullscreenVideo) && renderFullscreenView()}
    </>
  );
};

export default ProjectDetailModal;
