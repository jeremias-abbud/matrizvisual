import React, { useState, useEffect, useCallback } from 'react';
import { Project } from '../types';
import { X, Calendar, User, ChevronLeft, ChevronRight, Maximize, Share2, Link2, Check, MessageCircle, Globe, Play } from 'lucide-react';
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
  const [fullscreenVideo, setFullscreenVideo] = useState<boolean>(false);
  const [fullscreenIndex, setFullscreenIndex] = useState(0);
  const [linkCopied, setLinkCopied] = useState(false);

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
      
      if (fullscreenVideo) {
         if (e.key === 'Escape') setFullscreenVideo(false);
         return;
      }

      if (fullscreenImage) {
        if (e.key === 'Escape') setFullscreenImage(null);
        if (e.key === 'ArrowRight') nextImage();
        if (e.key === 'ArrowLeft') prevImage();
        return;
      }

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
  
  const isVerticalVideo = project.category === 'Vídeos' && project.videoUrl && (
    project.videoUrl.includes('/shorts/') || 
    project.videoUrl.includes('tiktok') || 
    project.videoUrl.includes('reel')
  );

  const renderFullscreenView = () => (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-0 animate-fade-in touch-none">
      <div className="absolute inset-0 bg-black/95 backdrop-blur-xl" onClick={() => { setFullscreenImage(null); setFullscreenVideo(false); }}></div>
      
      <div className="relative z-[115] w-full h-full flex flex-col items-center justify-center">
        <button onClick={() => { setFullscreenImage(null); setFullscreenVideo(false); }} className="fixed top-4 right-4 z-[130] text-white hover:text-matriz-purple bg-black/60 p-3 rounded-full border border-white/10 backdrop-blur-md transition-colors shadow-lg">
          <X size={28} />
        </button>
        
        {fullscreenVideo && project.videoUrl ? (
             <div className={`
                ${isVerticalVideo 
                    ? 'fixed inset-0 w-full h-[100dvh] z-[120] bg-black p-0' 
                    : 'relative w-full h-full p-4 md:p-8 max-w-6xl mx-auto flex items-center justify-center'}`
             }>
                <iframe 
                    src={getEmbedUrl(project.videoUrl)} 
                    title={project.title} 
                    className={`w-full h-full ${isVerticalVideo ? 'object-cover' : 'aspect-video shadow-2xl'}`} 
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
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-4">
        <div className="absolute inset-0 bg-black/90 backdrop-blur-md transition-opacity" onClick={onClose}></div>
        
        {/* Desktop Nav Arrows (Outside Modal) */}
        {hasPrev && (
            <button 
                onClick={(e) => { e.stopPropagation(); onPrev && onPrev(); }}
                className="hidden xl:flex absolute left-8 top-1/2 -translate-y-1/2 z-[105] p-4 bg-black/50 border border-white/10 text-white/50 hover:text-white hover:bg-matriz-purple rounded-full transition-all hover:scale-110 shadow-2xl backdrop-blur-sm"
                title="Projeto Anterior"
            >
                <ChevronLeft size={32} />
            </button>
        )}

        {hasNext && (
            <button 
                onClick={(e) => { e.stopPropagation(); onNext && onNext(); }}
                className="hidden xl:flex absolute right-8 top-1/2 -translate-y-1/2 z-[105] p-4 bg-black/50 border border-white/10 text-white/50 hover:text-white hover:bg-matriz-purple rounded-full transition-all hover:scale-110 shadow-2xl backdrop-blur-sm"
                title="Próximo Projeto"
            >
                <ChevronRight size={32} />
            </button>
        )}

        {/* --- MAIN MODAL CONTAINER (Split Layout on Desktop) --- */}
        <div className="relative bg-matriz-dark w-full max-w-7xl h-[100dvh] md:h-auto md:max-h-[90vh] lg:h-[85vh] md:rounded-lg border-x md:border border-white/10 shadow-2xl animate-fade-in-down flex flex-col lg:flex-row overflow-hidden">
          
          <button onClick={onClose} className="absolute top-4 right-4 z-50 p-2 bg-black/60 hover:bg-matriz-purple rounded-full text-white transition-colors border border-white/10 backdrop-blur-md shadow-lg">
            <X size={24} />
          </button>
          
          {/* --- LEFT COLUMN: MEDIA (Fixed on Desktop) --- */}
          <div className="w-full lg:w-[60%] h-[40vh] md:h-[50vh] lg:h-full bg-black/40 relative group shrink-0 flex items-center justify-center border-b lg:border-b-0 lg:border-r border-white/5">
            {/* Background Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px]"></div>

            {project.videoUrl && project.category === 'Vídeos' ? (
              <>
                  <iframe 
                    key={project.id}
                    src={getEmbedUrl(project.videoUrl)} 
                    title={project.title} 
                    className="w-full h-full relative z-10" 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                  ></iframe>
                   <button onClick={openVideoFullscreen} className="absolute top-4 left-4 p-2 bg-black/60 hover:bg-matriz-purple rounded-full text-white transition-all border border-white/10 flex items-center gap-2 backdrop-blur-md z-20 shadow-lg">
                        <Maximize size={20} /> <span className="text-xs font-bold uppercase ml-2">Expandir</span>
                   </button>
              </>
            ) : (
              <>
                <img 
                    key={project.id}
                    src={project.imageUrl} 
                    alt={project.title} 
                    className="w-full h-full object-contain cursor-pointer relative z-10 p-4 lg:p-12" 
                    onClick={(e) => openFullscreen(e, 0)}
                    decoding="async"
                />
                <button onClick={(e) => openFullscreen(e, 0)} className="absolute top-4 left-4 p-2 bg-black/60 hover:bg-matriz-purple rounded-full text-white transition-all border border-white/10 flex items-center gap-2 backdrop-blur-md z-20 shadow-lg cursor-pointer">
                  <Maximize size={20} /> <span className="text-xs font-bold uppercase ml-2">Expandir</span>
                </button>
              </>
            )}
          </div>
          
          {/* --- RIGHT COLUMN: CONTENT (Scrollable on Desktop) --- */}
          <div className="w-full lg:w-[40%] h-full flex flex-col bg-matriz-dark overflow-y-auto custom-scrollbar relative">
            <div className="p-6 md:p-8 lg:p-10 space-y-8 pb-20 lg:pb-10">
                
                {/* Header Info */}
                <div>
                    <div className="flex flex-wrap gap-2 mb-4 items-center">
                        <span className="inline-block px-3 py-1 bg-matriz-purple/20 text-matriz-purple border border-matriz-purple/30 text-[10px] font-bold uppercase tracking-widest rounded-sm">
                            {project.category}
                        </span>
                        {project.industry && (
                            <span className="inline-block px-3 py-1 bg-white/5 border border-white/10 text-gray-400 text-[10px] font-bold uppercase tracking-widest rounded-sm">
                                {project.industry}
                            </span>
                        )}
                    </div>
                    <h2 className="text-2xl md:text-3xl font-display font-bold text-white leading-tight">
                        {project.title}
                    </h2>
                </div>

                {/* Metadata Box */}
                <div className="grid grid-cols-2 gap-4 p-4 bg-white/5 border border-white/5 rounded-sm">
                    {project.client && (
                      <div>
                          <h4 className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1 flex items-center gap-2">
                             <User size={12}/> Cliente
                          </h4>
                          <p className="text-white text-sm font-medium truncate">{project.client}</p>
                      </div>
                    )}
                    {project.date && (
                      <div>
                          <h4 className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1 flex items-center gap-2">
                             <Calendar size={12}/> Data
                          </h4>
                          <p className="text-white text-sm font-medium truncate">{project.date}</p>
                      </div>
                    )}
                </div>
                
                {/* Description */}
                <div className="prose prose-invert max-w-none text-gray-300 leading-relaxed text-sm">
                    <p>{project.longDescription || project.description}</p>
                </div>
                
                {/* Web Action */}
                {project.category === 'Web Sites' && (
                    <div className="pt-2">
                         <a 
                            href={project.videoUrl || '#'} 
                            target="_blank" 
                            rel="noreferrer"
                            className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 bg-matriz-purple text-white font-bold uppercase tracking-widest hover:bg-white hover:text-matriz-black transition-all duration-300 rounded-sm shadow-[0_0_15px_rgba(139,92,246,0.3)] text-sm"
                         >
                            <Globe size={18} /> Acessar Site Online
                         </a>
                    </div>
                )}

                {/* Gallery Grid */}
                {hasGallery && (
                  <div className="space-y-4 pt-6 border-t border-white/5">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                        <Share2 size={14} className="text-matriz-purple"/> Galeria do Projeto
                    </h3>
                    <div className="grid grid-cols-3 gap-2">
                      {project.gallery!.map((img, idx) => (
                        <button 
                            key={idx} 
                            onClick={(e) => openFullscreen(e, idx + 1)} 
                            className="relative aspect-square rounded-sm overflow-hidden border border-white/10 hover:border-matriz-purple/50 bg-black group transition-all"
                        >
                          <img 
                            src={img} 
                            alt={`Detalhe ${idx + 1}`} 
                            loading="lazy" 
                            decoding="async" 
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                          />
                          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                            <Maximize size={20} className="text-white drop-shadow-lg" />
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Share Actions */}
                <div className="pt-6 border-t border-white/5 space-y-3">
                    <button 
                        onClick={handleShareWhatsApp}
                        className="w-full flex items-center justify-center gap-2 py-3 bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366] hover:text-black border border-[#25D366]/30 rounded-sm transition-all text-xs font-bold uppercase tracking-wide hover:shadow-[0_0_15px_rgba(37,211,102,0.3)]"
                    >
                        <MessageCircle size={16} /> Enviar no WhatsApp
                    </button>
                    <button 
                        onClick={handleCopyLink}
                        className="w-full flex items-center justify-center gap-2 py-3 bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white border border-white/10 rounded-sm transition-all text-xs font-bold uppercase tracking-wide"
                    >
                        {linkCopied ? <Check size={16} className="text-green-500" /> : <Link2 size={16} />}
                        {linkCopied ? 'Link Copiado!' : 'Copiar Link Direto'}
                    </button>
                </div>

                {project.tags && project.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-2">
                      {project.tags.map(tag => (
                        <span key={tag} className="px-2 py-1 bg-white/5 border border-white/10 text-gray-500 text-[9px] font-bold rounded-full cursor-default">
                            #{tag}
                        </span>
                      ))}
                  </div>
                )}
            </div>
          </div>
          
          {/* Mobile Navigation Footer (Sticky) */}
          <div className="lg:hidden grid grid-cols-2 gap-4 p-4 border-t border-white/10 bg-matriz-black/95 backdrop-blur-xl sticky bottom-0 z-40 shrink-0">
                <button 
                    onClick={(e) => { e.stopPropagation(); onPrev && onPrev(); }}
                    disabled={!hasPrev}
                    className={`flex items-center justify-center gap-2 text-xs font-bold uppercase border px-4 py-3 rounded-sm transition-colors ${
                        hasPrev 
                        ? 'border-white/10 text-white bg-white/5 hover:bg-white/10' 
                        : 'border-white/5 text-gray-600 bg-transparent cursor-not-allowed'
                    }`}
                >
                    <ChevronLeft size={16} /> Anterior
                </button>
                <button 
                    onClick={(e) => { e.stopPropagation(); onNext && onNext(); }}
                    disabled={!hasNext}
                    className={`flex items-center justify-center gap-2 text-xs font-bold uppercase border px-4 py-3 rounded-sm transition-colors ${
                        hasNext 
                        ? 'border-matriz-purple/50 text-white bg-matriz-purple/10 hover:bg-matriz-purple/20' 
                        : 'border-white/5 text-gray-600 bg-transparent cursor-not-allowed'
                    }`}
                >
                    Próximo <ChevronRight size={16} />
                </button>
          </div>
        </div>
      </div>
      {(fullscreenImage || fullscreenVideo) && renderFullscreenView()}
    </>
  );
};

export default ProjectDetailModal;