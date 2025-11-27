


import React, { useState } from 'react';
import Portfolio from './Portfolio';
import LogoGrid from './LogoGrid';
import WebShowcase from './WebShowcase';
import FeaturedLogos from './FeaturedLogos';
import { ProjectCategory } from '../types';
import { LayoutGrid, PenTool, Monitor, Video, Grid, Star } from 'lucide-react';

const MasterPortfolio: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'logos' | 'sites' | 'design' | 'video'>('all');

  const tabs = [
    { id: 'all', label: 'Destaques', icon: <Star size={16} /> },
    { id: 'logos', label: 'Logotipos', icon: <Grid size={16} /> },
    { id: 'sites', label: 'Websites', icon: <Monitor size={16} /> },
    { id: 'design', label: 'Design Gráfico', icon: <PenTool size={16} /> },
    { id: 'video', label: 'Vídeos', icon: <Video size={16} /> },
  ];

  return (
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
            {activeTab === 'all' && (
                <>
                    <div className="flex items-center gap-4 mb-8">
                        <LayoutGrid className="text-matriz-purple" size={24} />
                        <h3 className="font-display text-2xl font-bold text-white">Projetos em Destaque</h3>
                        <div className="flex-grow h-px bg-white/10"></div>
                    </div>
                    <Portfolio headless featuredOnly />
                    <FeaturedLogos />
                </>
            )}

            {activeTab === 'logos' && (
                <div className="bg-matriz-dark/30 rounded-lg p-4 md:p-8 border border-white/5">
                    <LogoGrid headless />
                </div>
            )}

            {activeTab === 'sites' && (
                <div className="bg-matriz-dark/30 rounded-lg p-0 md:p-4 border border-white/5 overflow-hidden">
                    <WebShowcase headless />
                </div>
            )}

            {activeTab === 'design' && (
                <Portfolio headless forcedCategory={ProjectCategory.DESIGN} />
            )}

            {activeTab === 'video' && (
                <Portfolio headless forcedCategory={ProjectCategory.VIDEO} />
            )}
        </div>

      </div>
    </section>
  );
};

export default MasterPortfolio;