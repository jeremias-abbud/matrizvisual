
import React, { useState, useEffect } from 'react';
import Portfolio from './Portfolio';
import LogoGrid from './LogoGrid';
import AllProjectsShowcase from './AllProjectsShowcase';
import ProjectDetailModal from './ProjectDetailModal';
import { Project, ProjectCategory } from '../types';
import { PenTool, Monitor, Video, Grid, Sparkles, Package, Users, Share2, Check, Link } from 'lucide-react';
import { supabase } from '../src/lib/supabase';

const MasterPortfolio: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'logos' | 'sites' | 'packaging' | 'design' | 'video' | 'models'>('overview');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [tabLinkCopied, setTabLinkCopied] = useState(false);
  
  // Estado para controlar a navegação (Carrossel)
  const [projectList, setProjectList] = useState<Project[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);

  // Manipulador atualizado para aceitar a lista de contexto
  const handleProjectClick = (project: Project, listContext?: Project[]) => {
    setSelectedProject(project);
    
    if (listContext && listContext.length > 0) {
        setProjectList(listContext);
        const idx = listContext.findIndex(p => p.id === project.id);
        setCurrentIndex(idx);
    } else {
        // Fallback se não vier lista: lista de 1 item
        setProjectList([project]);
        setCurrentIndex(0);
    }

    // Atualizar URL (Deep Linking)
    const newUrl = `${window.location.pathname}?project=${project.id}`;
    window.history.pushState({ path: newUrl }, '', newUrl);
  };

  const handleNextProject = () => {
    if (currentIndex < projectList.length - 1) {
        const nextIdx = currentIndex + 1;
        setSelectedProject(projectList[nextIdx]);
        setCurrentIndex(nextIdx);
        // Atualiza URL
        const newUrl = `${window.location.pathname}?project=${projectList[nextIdx].id}`;
        window.history.replaceState({ path: newUrl }, '', newUrl);
    }
  };

  const handlePrevProject = () => {
    if (currentIndex > 0) {
        const prevIdx = currentIndex - 1;
        setSelectedProject(projectList[prevIdx]);
        setCurrentIndex(prevIdx);
        // Atualiza URL
        const newUrl = `${window.location.pathname}?project=${projectList[prevIdx].id}`;
        window.history.replaceState({ path: newUrl }, '', newUrl);
    }
  };

  const handleCloseModal = () => {
    setSelectedProject(null);
    // Ao fechar, mantemos a aba na URL se ela existir
    const params = new URLSearchParams(window.location.search);
    const currentTab = params.get('tab');
    const newUrl = currentTab ? `${window.location.pathname}?tab=${currentTab}` : window.location.pathname;
    window.history.pushState({ path: newUrl }, '', newUrl);
  };
  
  // DEEP LINKING LOGIC (Projects & Tabs)
  useEffect(() => {
    const handleDeepLinks = async () => {
        const params = new URLSearchParams(window.location.search);
        const projectId = params.get('project');
        const tabId = params.get('tab');

        // 1. Handle Tab Deep Link
        if (tabId && tabs.some(t => t.id === tabId)) {
            setActiveTab(tabId as any);
            // Scroll to portfolio section smoothly after a small delay to ensure rendering
            setTimeout(() => {
                const element = document.getElementById('portfolio');
                if (element) {
                    const headerOffset = 100;
                    const elementPosition = element.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            }, 100);
        }

        // 2. Handle Project Deep Link (Prioridade sobre a aba se ambos existirem)
        if (projectId) {
            let { data: projectData } = await supabase
                .from('projects')
                .select('*')
                .eq('id', projectId)
                .single();

            if (!projectData) {
                 const cleanId = projectId.replace('old_', '').replace('logo_', '');
                 const { data: logoData } = await supabase
                    .from('logos')
                    .select('*')
                    .eq('id', cleanId)
                    .single();
                 
                 if (logoData) {
                     const logoProject = {
                        id: `logo_${logoData.id}`,
                        title: logoData.name,
                        category: ProjectCategory.LOGO,
                        industry: logoData.industry,
                        imageUrl: logoData.url,
                        description: 'Projeto de identidade visual.',
                        tags: ['Logotipo', 'Branding'],
                        client: logoData.name,
                     } as Project;
                     
                     handleProjectClick(logoProject); 
                     return;
                 }
            }

            if (projectData) {
                 const fullProject = {
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
                 } as Project;
                 
                 handleProjectClick(fullProject);
            }
        }
    };

    handleDeepLinks();
  }, []);

  const handleCopyCategoryLink = () => {
      const url = `${window.location.origin}/?tab=${activeTab}#portfolio`;
      navigator.clipboard.writeText(url);
      setTabLinkCopied(true);
      setTimeout(() => setTabLinkCopied(false), 2000);
  };

  const tabs = [
    { id: 'overview', label: 'Visão Geral', icon: <Sparkles size={16} /> },
    { id: 'logos', label: 'Logotipos', icon: <Grid size={16} /> },
    { id: 'sites', label: 'Websites', icon: <Monitor size={16} /> },
    { id: 'packaging', label: 'Rótulos & Embalagens', icon: <Package size={16} /> },
    { id: 'models', label: 'Modelos e Personagens', icon: <Users size={16} /> },
    { id: 'design', label: 'Design Gráfico', icon: <PenTool size={16} /> },
    { id: 'video', label: 'Vídeos', icon: <Video size={16} /> },
  ];

  return (
    <>
      <section id="portfolio" className="py-20 md:py-24 bg-matriz-black scroll-mt-20">
        <div className="container mx-auto px-6">
          
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

          <div className="flex flex-col items-center mb-12 gap-6">
            <div className="flex flex-wrap justify-center gap-3">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        data-tab-id={tab.id}
                        onClick={() => {
                            setActiveTab(tab.id as any);
                            // Atualiza a URL sem recarregar quando o usuário clica manualmente
                            const newUrl = `${window.location.pathname}?tab=${tab.id}`;
                            window.history.replaceState({ path: newUrl }, '', newUrl);
                        }}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-full border transition-all duration-300 font-bold uppercase text-[10px] md:text-xs tracking-widest ${
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

            {/* Share Category Button */}
            <button 
                onClick={handleCopyCategoryLink}
                className="flex items-center gap-2 text-xs text-gray-500 hover:text-matriz-purple transition-colors border-b border-transparent hover:border-matriz-purple pb-0.5"
                title="Copiar link direto para esta categoria"
            >
                {tabLinkCopied ? <Check size={14} /> : <Link size={14} />}
                {tabLinkCopied ? 'Link Copiado!' : `Copiar link de "${tabs.find(t => t.id === activeTab)?.label}"`}
            </button>
          </div>

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
              
              {activeTab === 'models' && (
                  <Portfolio headless forcedCategory={ProjectCategory.MODELS} onProjectClick={handleProjectClick} />
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
      
      <ProjectDetailModal 
        project={selectedProject} 
        onClose={handleCloseModal}
        onNext={handleNextProject}
        onPrev={handlePrevProject}
        hasNext={currentIndex < projectList.length - 1}
        hasPrev={currentIndex > 0}
      />
    </>
  );
};

export default MasterPortfolio;
