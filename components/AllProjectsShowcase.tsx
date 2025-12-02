
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
        
        // 1. Buscar projetos gerais (Design, Video, Web)
        // Buscamos os 10 mais recentes
        const { data: projectsData } = await supabase
          .from('projects')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(10); 

        // 2. Buscar logotipos (tabela antiga/restaurada)
        // Buscamos os 10 mais recentes
        const { data: logosData } = await supabase
          .from('logos')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(10);

        // Formatar Projetos
        const formattedProjects = (projectsData || []).map((item: any) => ({
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
            createdAt: new Date(item.created_at).getTime(),
        }));

        // Formatar Logotipos para parecerem Projetos
        const formattedLogos = (logosData || []).map((item: any) => ({
            id: `logo_${item.id}`, // ID único para evitar conflito
            title: item.name,
            category: ProjectCategory.LOGO,
            industry: item.industry,
            imageUrl: item.url,
            description: 'Projeto de identidade visual e design de logotipo.',
            tags: ['Logotipo', 'Branding'],
            client: item.name,
            createdAt: item.created_at ? new Date(item.created_at).getTime() : Date.now(),
        }));

        // 3. Juntar e Ordenar (ESTRITAMENTE CRONOLÓGICO)
        // Ignoramos display_order aqui. O objetivo é mostrar o que é NOVO.
        const allItems = [...formattedProjects, ...formattedLogos].sort((a, b) => {
            return b.createdAt - a.createdAt;
        });

        // Pegar apenas os 3 primeiros (mais novos) para exibir na capa
        if (allItems.length > 0) {
          setLatestProjects(allItems.slice(0, 3));
        } else {
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
      <div className="p-3 bg-matriz-purple/10 border border-matriz-purple/20 rounded-md text-matriz-purple shadow-[0_0_15px_rgba(139,92,246,0.2)]">
        {icon}
      </div>
      <h3 className="font-display text-2xl md:text-3xl font-bold text-white">{title}</h3>
      <div className="flex-grow h-px bg-gradient-to-r from-matriz-purple/30 to-transparent ml-4"></div>
    </div>
  );

  return (
    <div className="space-y-20">
      
      {/* 1. Latest Projects Section */}
      <section>
        <SectionHeader icon={<Clock size={24} />} title="Destaques & Recentes" />
        {loading ? (
           <div className="flex justify-center py-10"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-matriz-purple"></div></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {latestProjects.map(project => (
               <button 
                  key={project.id} 
                  onClick={() => onProjectClick(project)}
                  className="group relative overflow-hidden bg-matriz-dark border border-matriz-purple/10 shadow-[0_4px_20px_rgba(139,92,246,0.05)] flex flex-col text-left transition-all duration-300 hover:border-matriz-purple/50 hover:shadow-[0_0_25px_rgba(139,92,246,0.15)] rounded-sm"
                >
                  <div className="aspect-video overflow-hidden relative bg-black/50">
                      <img 
                      src={project.imageUrl} 
                      alt={`Projeto de ${project.category}: ${project.title} - ${project.industry || 'Matriz Visual'}`}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-contain bg-matriz-black p-2 transition-transform duration-700 group-hover:scale-110"
                      />
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-matriz-purple/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>
                  <div className="p-4 flex-grow flex flex-col relative z-10 bg-matriz-dark border-t border-white/5 group-hover:border-matriz-purple/20 transition-colors">
                      <span className="text-matriz-purple text-xs font-bold uppercase tracking-wider mb-2">{project.category}</span>
                      <h4 className="text-lg font-bold text-white mb-2 flex-grow group-hover:text-matriz-purple transition-colors">{project.title}</h4>
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
        <div className="bg-matriz-dark/30 rounded-lg p-0 md:p-4 border border-matriz-purple/10 overflow-hidden shadow-[0_4px_20px_rgba(139,92,246,0.05)]">
          {/* Mostra apenas os 3 mais recentes */}
          <WebShowcase headless limit={3} />
        </div>
      </section>
      
      {/* 3. Logo Grid Section */}
      <section>
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-matriz-purple/10 border border-matriz-purple/20 rounded-md text-matriz-purple shadow-[0_0_15px_rgba(139,92,246,0.2)]">
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
        {/* Mostra uma prévia de 8 logos */}
        <LogoGrid headless limit={8} onProjectClick={onProjectClick} />
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
