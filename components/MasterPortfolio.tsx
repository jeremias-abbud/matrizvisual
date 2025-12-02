
import React, { useState, useEffect } from 'react';
import Portfolio from './Portfolio';
import LogoGrid from './LogoGrid';
import AllProjectsShowcase from './AllProjectsShowcase'; // Novo componente da vitrine
import ProjectDetailModal from './ProjectDetailModal'; // Import the new modal
import { Project, ProjectCategory } from '../types';
import { LayoutGrid, PenTool, Monitor, Video, Grid, Sparkles, Package } from 'lucide-react';
import { supabase } from '../src/lib/supabase';

const MasterPortfolio: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'logos' | 'sites' | 'packaging' | 'design' | 'video'>('overview');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
    // Opcional: Atualizar URL sem recarregar para criar histórico
    const newUrl = `${window.location.pathname}?project=${project.id}`;
    window.history.pushState({ path: newUrl }, '', newUrl);
  };

  const handleCloseModal = () => {
    setSelectedProject(null);
    // Limpar URL ao fechar
    const newUrl = window.location.pathname;
    window.history.pushState({ path: newUrl }, '', newUrl);
  };
  
  // DEEP LINKING LOGIC
  useEffect(() => {
    const checkDeepLink = async () => {
        const params = new URLSearchParams(window.location.search);
        const projectId = params.get('project');

        if (projectId) {
            // Tenta buscar na tabela de projetos
            let { data: projectData, error } = await supabase
                .from('projects')
                .select('*')
                .eq('id', projectId)
                .single();

            // Se não achou em projetos, ou se o ID parece ser de logo antigo (ex: old_123 ou apenas numérico se não for UUID)
            if (!projectData) {
                 // Tenta limpar prefixos comuns se houver
                 const cleanId = projectId.replace('old_', '').replace('logo_', '');
                 const { data: logoData } = await supabase
                    .from('logos')
                    .select('*')
                    .eq('id', cleanId)
                    .single();
                 
                 if (logoData) {
                     // Formata como projeto
                     setSelectedProject({
                        id: `logo_${logoData.id}`,
                        title: logoData.name,
                        category: ProjectCategory.LOGO,
                        industry: logoData.industry,
                        imageUrl: logoData.url,
                        description: 'Projeto de identidade visual e design de logotipo.',
                        tags: ['Logotipo', 'Branding'],
                        client: logoData.name,
                     });
                     return;
                 }
            }

            if (projectData) {
                 setSelectedProject({
                    id: projectData.id,
                    title: projectData.title,
                    category: projectData.category as ProjectCategory,
                    industry: projectData.industry,
                    imageUrl: projectData.image_url,
                    description: projectData.description,
                    tags: projectData.tags || [],
                    client: projectData.client,
                    date: projectData.date,
                    longDescription: projectData.long_description,
                    gallery: projectData.gallery,
                    videoUrl: projectData.video_url,
                 });
            }
        }
    };

    checkDeepLink();
  }, []);

  const tabs = [
    { id: 'overview', label: 'Visão Geral', icon: <Sparkles size={16} /> },
    { id: 'logos', label: 'Logotipos', icon: <Grid size={16} /> },
    { id: 'sites', label: 'Websites', icon: <Monitor size={16} /> },
    { id: 'packaging', label: 'Rótulos & Embalagens', icon: <Package size={16} /> },
    { id: 'design', label: 'Design Gráfico', icon: <PenTool size={16} /> },
    { id: 'video', label: 'Vídeos', icon: <Video size={16} /> },
  ];

  return (
    <>
      <section id="portfolio" className="py-20 md:py-24 bg-matriz-black scroll-mt-20">
        <div className="container mx-auto px-6">
          
          {/* Main Section Header */}
          <div className="mb-12 flex flex-col items-center text-center">
              <span className="text-matriz-purple uppercase tracking-[0.3em] text-xs font-bold mb-3">
                  O Que Criamos
              </span>
              <h2 className="font-display text-4xl md:text-6xl font-black text-white mb-6">
                  NOSSO <span className="text-transparent bg-clip-text bg-gradient-to-r from-matriz-purple to-white">PORTFÓLIO</span>
              </h2>
              <p className="text-gray-400 max-w-2xl text-lg">
                  Explore nossos projetos por categoria. De marcas memoráveis a sites que vendem, veja o que podemos fazer pelo seu negócio.
              </p>
          </div>

          {/* Master Tabs */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
              {tabs.map((tab) => (
                  <button
                      key={tab.id}
                      data-tab-id={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`flex items-center gap-2 px-6 py-3 rounded-full border transition-all duration-300 font-bold uppercase text-xs tracking-widest ${
                          activeTab === tab.id
                          ? 'bg-matriz-purple border-matriz-purple text-white shadow-[0_0_20px_rgba(139,92,246,0.4)] transform scale-105'
                          : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white hover:border-white/30'
                      }`}
                  >
                      {tab.icon}
                      {tab.label}
                  </button>
              ))}
          </div>

          {/* Content Area - Conditional Rendering */}
          <div className="animate-fade-in min-h-[500px]">
              {activeTab === 'overview' && (
                  <AllProjectsShowcase onProjectClick={handleProjectClick} />
              )}

              {activeTab === 'logos' && (
                  <div className="bg-matriz-dark/30 rounded-lg p-4 md:p-8 border border-white/5">
                      <LogoGrid headless onProjectClick={handleProjectClick} />
                  </div>
              )}

              {activeTab === 'sites' && (
                  <Portfolio headless forcedCategory={ProjectCategory.WEB} onProjectClick={handleProjectClick} />
              )}

              {activeTab === 'packaging' && (
                  <Portfolio headless forcedCategory={ProjectCategory.PACKAGING} onProjectClick={handleProjectClick} />
              )}

              {activeTab === 'design' && (
                  <Portfolio headless forcedCategory={ProjectCategory.DESIGN} onProjectClick={handleProjectClick} />
              )}

              {activeTab === 'video' && (
                  <Portfolio headless forcedCategory={ProjectCategory.VIDEO} onProjectClick={handleProjectClick} />
              )}
          </div>

        </div>
      </section>
      
      {/* Render the centralized modal */}
      <ProjectDetailModal project={selectedProject} onClose={handleCloseModal} />
    </>
  );
};

export default MasterPortfolio;
