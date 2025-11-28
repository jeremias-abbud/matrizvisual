

import React, { useState, useEffect } from 'react';
import { supabase } from '../src/lib/supabase';
import Portfolio from './Portfolio';
import WebShowcase from './WebShowcase';
import LogoGrid from './LogoGrid';
import { Project, ProjectCategory } from '../types';
import { Clock, Monitor, Grid, Palette, Video, ArrowRight } from 'lucide-react';
import { PROJECTS as MOCK_PROJECTS } from '../constants';

interface AllProjectsShowcaseProps {
  onProjectClick: (project: Project) => void;
}

const AllProjectsShowcase: React.FC<AllProjectsShowcaseProps> = ({ onProjectClick }) => {
  const [latestProjects, setLatestProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatest = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .order('created_at', { ascending: false }) // Pega os mais recentes primeiro
          .limit(3); // Limita a 3 projetos

        if (error) throw error;

        if (data && data.length > 0) {
          const formattedData = data.map((item: any) => ({
            id: item.id,
            title: item.title,
            category: item.category as ProjectCategory,
            industry: item.industry,
            imageUrl: item.image_url,
            description: item.description,
            tags: item.tags || [],
            client: item.client,
            date: item.date,
            longDescription: item.long_description,
            gallery: item.gallery,
            videoUrl: item.video_url,
          }));
          setLatestProjects(formattedData);
        } else {
          // Fallback para os 3 primeiros da lista mock
          setLatestProjects(MOCK_PROJECTS.slice(0, 3));
        }
      } catch (err) {
        console.error("Error fetching latest projects:", err);
        setLatestProjects(MOCK_PROJECTS.slice(0, 3));
      } finally {
        setLoading(false);
      }
    };
    fetchLatest();
  }, []);
  
  const SectionHeader = ({ icon, title }: { icon: React.ReactNode, title: string }) => (
    <div className="flex items-center gap-4 mb-8">
      <div className="p-3 bg-matriz-purple/10 border border-matriz-purple/20 rounded-md text-matriz-purple">
        {icon}
      </div>
      <h3 className="font-display text-2xl md:text-3xl font-bold text-white">{title}</h3>
      <div className="flex-grow h-px bg-white/10 ml-4"></div>
    </div>
  );

  return (
    <div className="space-y-20">
      
      {/* 1. Latest Projects Section */}
      <section>
        <SectionHeader icon={<Clock size={24} />} title="Últimos Projetos" />
        {loading ? (
           <div className="flex justify-center py-10"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-matriz-purple"></div></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {latestProjects.map(project => (
               <button 
                  key={project.id} 
                  onClick={() => onProjectClick(project)}
                  className="group relative overflow-hidden bg-matriz-dark border border-white/5 flex flex-col text-left hover:border-matriz-purple/50 transition-colors duration-300"
                >
                  <div className="aspect-video overflow-hidden relative bg-black/50">
                      <img 
                      src={project.imageUrl} 
                      alt={project.title} 
                      loading="lazy"
                      className="w-full h-full object-contain p-2 transition-transform duration-700 group-hover:scale-110"
                      />
                  </div>
                  <div className="p-4 flex-grow flex flex-col">
                      <span className="text-matriz-purple text-xs font-bold uppercase tracking-wider mb-2">{project.category}</span>
                      <h4 className="text-lg font-bold text-white mb-2 flex-grow">{project.title}</h4>
                      <p className="text-gray-400 text-sm line-clamp-2">{project.description}</p>
                  </div>
               </button>
            ))}
          </div>
        )}
      </section>

      {/* 2. Web Showcase Section */}
      <section>
        <SectionHeader icon={<Monitor size={24} />} title="Websites em Destaque" />
        <div className="bg-matriz-dark/30 rounded-lg p-0 md:p-4 border border-white/5 overflow-hidden">
          {/* Mostra apenas os 3 mais recentes */}
          <WebShowcase headless limit={3} />
        </div>
      </section>
      
      {/* 3. Logo Grid Section */}
      <section>
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-matriz-purple/10 border border-matriz-purple/20 rounded-md text-matriz-purple">
                    <Grid size={24} />
                </div>
                <h3 className="font-display text-2xl md:text-3xl font-bold text-white">Galeria de Logotipos</h3>
            </div>
            <button 
              onClick={() => (document.querySelector('button[data-tab-id="logos"]') as HTMLButtonElement)?.click()}
              className="group text-matriz-purple font-bold uppercase text-sm tracking-wider flex items-center gap-2"
            >
              Ver Galeria Completa <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
        </div>
        {/* Mostra uma prévia de 8 logos */}
        <LogoGrid headless limit={8} />
      </section>

      {/* 4. Other Projects (Design & Video) */}
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
