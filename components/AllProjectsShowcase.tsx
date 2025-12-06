
import React, { useState, useEffect } from 'react';
import { getAllProjects, getAllLogos } from '../src/lib/dataService'; 
import Portfolio from './Portfolio';
import WebShowcase from './WebShowcase';
import LogoGrid from './LogoGrid';
import { Project, ProjectCategory } from '../types';
import { Clock, Monitor, Grid, Palette, Video, ArrowRight, Eye, Play } from 'lucide-react';

interface AllProjectsShowcaseProps {
  onProjectClick: (project: Project, listContext?: Project[]) => void;
}

const AllProjectsShowcase: React.FC<AllProjectsShowcaseProps> = ({ onProjectClick }) => {
  const [latestProjects, setLatestProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  
  // State for pagination
  const [visibleCount, setVisibleCount] = useState(6);

  useEffect(() => {
    const fetchLatest = async () => {
      setLoading(true);
      const allProjects = await getAllProjects();
      const allLogos = await getAllLogos();

      const combined = [...allProjects, ...allLogos];
      
      const uniqueItems = Array.from(new Map(combined.map(item => [item.id, item])).values());

      uniqueItems.sort((a: any, b: any) => {
          return (b.createdAt || 0) - (a.createdAt || 0);
      });

      // Keep full list for pagination
      setLatestProjects(uniqueItems);
      setLoading(false);
    };
    fetchLatest();
  }, []);
  
  const handleLoadMore = () => {
      setVisibleCount(prev => prev + 6);
  };

  const SectionHeader = ({ icon, title }: { icon: React.ReactNode, title: string }) => (
    <div className="flex items-center gap-4 mb-8">
      <div className="p-3 bg-matriz-purple/10 border border-matriz-purple/20 rounded-sm text-matriz-purple shadow-[0_0_15px_rgba(139,92,246,0.1)]">
        {icon}
      </div>
      <h3 className="font-display text-2xl md:text-3xl font-bold text-white">{title}</h3>
      <div className="flex-grow h-px bg-gradient-to-r from-matriz-purple/30 to-transparent ml-4"></div>
    </div>
  );

  return (
    <div className="space-y-20">
      
      {/* 1. Latest Projects Section (Using Cinema Style) */}
      <section>
        <SectionHeader icon={<Clock size={24} />} title="Destaques & Recentes" />
        {loading ? (
           <div className="flex justify-center py-10"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-matriz-purple"></div></div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {latestProjects.slice(0, visibleCount).map(project => (
                <div 
                    key={project.id} 
                    className="group bg-[#080808] border border-white/5 rounded-sm overflow-hidden flex flex-col cursor-pointer transition-all duration-500 hover:border-matriz-purple/30 hover:shadow-[0_0_30px_rgba(139,92,246,0.1)] h-full" 
                    onClick={() => onProjectClick(project, latestProjects)}
                >
                    {/* CINEMA IMAGE CONTAINER */}
                    <div className="relative aspect-video bg-[#050505] border-b border-white/5 overflow-hidden">
                        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
                        
                        <img 
                            src={project.imageUrl} 
                            alt={`Projeto: ${project.title}`}
                            loading="lazy"
                            decoding="async"
                            className="w-full h-full object-contain p-6 transition-transform duration-700 group-hover:scale-105 relative z-10"
                        />
                        
                        <div className="absolute top-3 left-3 z-20 flex gap-2">
                            <span className="px-2 py-1 bg-black/80 backdrop-blur-md border border-white/10 text-[9px] font-bold text-matriz-purple uppercase tracking-wider rounded-sm shadow-lg">
                                {project.category}
                            </span>
                        </div>

                        {project.category === ProjectCategory.VIDEO && (
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                                <div className="bg-matriz-purple/90 p-4 rounded-full text-white shadow-2xl backdrop-blur-sm group-hover:scale-110 transition-transform">
                                    <Play size={20} fill="currentColor" />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* INFO CONTAINER */}
                    <div className="flex flex-col flex-grow p-5 bg-[#080808] group-hover:bg-[#0a0a0a] transition-colors">
                        <div className="flex-grow">
                            <div className="flex justify-between items-start gap-3 mb-2">
                                <h3 className="font-display text-lg font-bold text-white leading-tight group-hover:text-matriz-purple transition-colors line-clamp-2">
                                    {project.title}
                                </h3>
                            </div>
                            {project.industry && (
                                <p className="text-[10px] text-gray-500 uppercase tracking-wider font-medium mb-3">
                                    {project.industry}
                                </p>
                            )}
                        </div>
                        
                        <div className="mt-4 pt-4 border-t border-white/5">
                            <button className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs uppercase font-bold tracking-widest rounded-sm transition-all flex items-center justify-center gap-2 group/btn">
                                <Eye size={14} className="text-gray-400 group-hover/btn:text-white" /> Ver Detalhes
                            </button>
                        </div>
                    </div>
                </div>
                ))}
            </div>
            
            {/* Load More Button for Recents */}
            {visibleCount < latestProjects.length && (
                <div className="mt-12 flex justify-center">
                    <button 
                        onClick={handleLoadMore}
                        className="group px-8 py-4 border border-matriz-purple/20 bg-matriz-purple/5 hover:bg-matriz-purple text-white transition-all duration-300 text-xs font-bold uppercase tracking-[0.2em]"
                    >
                        Carregar Mais
                    </button>
                </div>
            )}
          </>
        )}
      </section>

      {/* 2. Web Showcase Section */}
      <section>
        <SectionHeader icon={<Monitor size={24} />} title="Websites em Destaque" />
        <div className="bg-matriz-dark/30 rounded-lg p-0 md:p-4 border border-matriz-purple/10 overflow-hidden shadow-[0_4px_20px_rgba(139,92,246,0.05)]">
          <WebShowcase headless limit={3} />
        </div>
      </section>
      
      {/* 3. Logo Grid Section */}
      <section>
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-matriz-purple/10 border border-matriz-purple/20 rounded-sm text-matriz-purple shadow-[0_0_15px_rgba(139,92,246,0.2)]">
                    <Grid size={24} />
                </div>
                <h3 className="font-display text-2xl md:text-3xl font-bold text-white">Galeria de Logotipos</h3>
            </div>
            <button 
              onClick={() => (document.querySelector('button[data-tab-id="logos"]') as HTMLButtonElement)?.click()}
              className="group text-matriz-purple font-bold uppercase text-sm tracking-wider flex items-center gap-2 hover:bg-matriz-purple/10 px-4 py-2 rounded-full transition-all"
            >
              Ver Galeria Completa <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
        </div>
        <LogoGrid headless limit={8} onProjectClick={onProjectClick} />
      </section>

      {/* 4. Other Projects */}
      <section>
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <SectionHeader icon={<Palette size={24} />} title="Design Gráfico" />
              <Portfolio headless forcedCategory={ProjectCategory.DESIGN} onProjectClick={onProjectClick} />
            </div>
            <div>
              <SectionHeader icon={<Video size={24} />} title="Vídeo & Motion" />
              <Portfolio headless forcedCategory={ProjectCategory.VIDEO} onProjectClick={onProjectClick} />
            </div>
         </div>
      </section>

    </div>
  );
};

export default AllProjectsShowcase;
