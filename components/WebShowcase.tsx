import React, { useState } from 'react';
import { ExternalLink, Code2, Globe, ChevronLeft, ChevronRight } from 'lucide-react';
import { FEATURED_WEB_PROJECTS } from '../constants';

const WebShowcase: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeProject = FEATURED_WEB_PROJECTS[activeIndex];

  const nextProject = () => {
    setActiveIndex((prev) => (prev + 1) % FEATURED_WEB_PROJECTS.length);
  };

  const prevProject = () => {
    setActiveIndex((prev) => (prev - 1 + FEATURED_WEB_PROJECTS.length) % FEATURED_WEB_PROJECTS.length);
  };

  return (
    <section className="py-16 md:py-20 bg-gradient-to-b from-matriz-black to-matriz-dark border-b border-white/5 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-matriz-purple/5 rounded-full blur-3xl pointer-events-none"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="mb-10 lg:mb-12">
          <span className="text-matriz-purple text-xs font-bold uppercase tracking-[0.3em]">Sites Profissionais</span>
          <h2 className="font-display text-4xl font-bold text-white mt-2">
            Sites Modernos <span className="text-gray-500">que Vendem</span>
          </h2>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* MOBILE NAVIGATION & INFO (Visible only on small screens) */}
          <div className="lg:hidden order-2 flex flex-col gap-6">
            <div className="flex items-center justify-between gap-4">
              <button 
                onClick={prevProject}
                className="p-4 bg-white/5 border border-white/10 rounded-sm hover:bg-matriz-purple hover:text-white transition-colors"
              >
                <ChevronLeft size={24} />
              </button>
              
              <div className="text-center flex-1">
                 <h3 className="font-display text-xl font-bold text-white mb-1">
                  {activeProject.title}
                </h3>
                <span className="text-xs text-gray-500 uppercase tracking-widest">
                  {activeIndex + 1} / {FEATURED_WEB_PROJECTS.length}
                </span>
              </div>

              <button 
                onClick={nextProject}
                className="p-4 bg-white/5 border border-white/10 rounded-sm hover:bg-matriz-purple hover:text-white transition-colors"
              >
                <ChevronRight size={24} />
              </button>
            </div>

            <p className="text-gray-400 text-sm leading-relaxed text-center">
              {activeProject.description}
            </p>

             <div className="flex flex-wrap justify-center gap-2">
                {activeProject.tech.map((tech) => (
                    <span key={tech} className="px-3 py-1 text-xs border border-matriz-purple/30 text-matriz-purple bg-matriz-purple/5 rounded-full">
                        {tech}
                    </span>
                ))}
            </div>

            <a 
              href={activeProject.liveUrl}
              target="_blank"
              rel="noreferrer"
              className="w-full py-4 bg-matriz-purple text-white font-bold uppercase tracking-widest hover:bg-white hover:text-matriz-black transition-all duration-300 flex items-center justify-center gap-2 text-sm"
            >
              Ver Exemplo Real <ExternalLink size={16} />
            </a>
          </div>

          {/* DESKTOP LIST (Hidden on mobile) */}
          <div className="hidden lg:flex lg:w-1/3 flex-col gap-4 order-1">
            {FEATURED_WEB_PROJECTS.map((project, index) => (
              <button
                key={project.id}
                onClick={() => setActiveIndex(index)}
                className={`group text-left p-6 border rounded-sm transition-all duration-300 relative overflow-hidden ${
                  index === activeIndex
                    ? 'border-matriz-purple bg-white/5 shadow-[0_0_20px_rgba(139,92,246,0.1)]'
                    : 'border-white/5 bg-transparent hover:bg-white/5 hover:border-white/20'
                }`}
              >
                {/* Active Indicator */}
                {index === activeIndex && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-matriz-purple"></div>
                )}

                <h3 className={`font-display text-lg font-bold mb-1 transition-colors ${
                  index === activeIndex ? 'text-white' : 'text-gray-400 group-hover:text-white'
                }`}>
                  {project.title}
                </h3>
                <p className="text-sm text-gray-500 line-clamp-2">
                  {project.description}
                </p>
              </button>
            ))}
            
            {/* Tech Stack of Active Project */}
            <div className="mt-8 p-6 bg-black/40 border border-white/5 rounded-sm">
                <div className="flex items-center gap-2 mb-4 text-matriz-silver">
                    <Code2 size={20} className="text-matriz-purple" />
                    <span className="text-xs uppercase tracking-widest font-bold">Destaques</span>
                </div>
                <div className="flex flex-wrap gap-2">
                    {activeProject.tech.map((tech) => (
                        <span key={tech} className="px-3 py-1 text-xs border border-matriz-purple/30 text-matriz-purple bg-matriz-purple/5 rounded-full">
                            {tech}
                        </span>
                    ))}
                </div>
            </div>
            
             <a 
                href={activeProject.liveUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-flex items-center justify-center gap-2 px-6 py-4 bg-matriz-purple text-white font-bold uppercase tracking-widest hover:bg-white hover:text-matriz-black transition-all duration-300"
              >
                Ver Exemplo Real <ExternalLink size={18} />
              </a>
          </div>

          {/* BROWSER MOCKUP (Visible on both, adapted styles) */}
          <div className="lg:w-2/3 order-1 lg:order-2">
            <div className="relative group">
                {/* Glow behind monitor */}
                <div className="absolute -inset-1 bg-gradient-to-r from-matriz-purple to-blue-600 rounded-lg blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                
                {/* Browser Window */}
                <div className="relative bg-matriz-gray rounded-lg border border-white/10 overflow-hidden shadow-2xl">
                    {/* Browser Toolbar */}
                    <div className="h-8 lg:h-10 bg-[#1a1a1a] border-b border-white/5 flex items-center px-4 gap-2">
                        <div className="flex gap-1.5 lg:gap-2">
                            <div className="w-2.5 h-2.5 lg:w-3 lg:h-3 rounded-full bg-red-500/80"></div>
                            <div className="w-2.5 h-2.5 lg:w-3 lg:h-3 rounded-full bg-yellow-500/80"></div>
                            <div className="w-2.5 h-2.5 lg:w-3 lg:h-3 rounded-full bg-green-500/80"></div>
                        </div>
                        {/* Fake Address Bar */}
                        <div className="ml-2 lg:ml-4 flex-1 bg-black/50 rounded-md h-5 lg:h-6 flex items-center px-3 text-[8px] lg:text-[10px] text-gray-500 font-mono truncate">
                            <Globe size={10} className="mr-2 shrink-0" />
                            www.{activeProject.title.toLowerCase().replace(/ /g, '').substring(0, 10)}.com.br
                        </div>
                    </div>

                    {/* Viewport */}
                    <div className="relative aspect-[16/10] overflow-hidden bg-black group-hover:shadow-[inset_0_0_100px_rgba(0,0,0,0.5)]">
                         <img 
                            key={activeProject.id} // Forces animation restart on change
                            src={activeProject.imageUrl} 
                            alt={activeProject.title} 
                            className="w-full h-full object-cover animate-fade-in hover:scale-105 transition-transform duration-[2s] ease-out origin-top"
                         />
                         
                         {/* Overlay on hover */}
                         <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors pointer-events-none"></div>
                    </div>
                </div>
                
                {/* Decor elements */}
                <div className="absolute -bottom-6 -right-6 w-16 h-16 lg:w-24 lg:h-24 border-b-2 border-r-2 border-white/10 rounded-br-3xl pointer-events-none"></div>
                <div className="absolute -top-6 -left-6 w-16 h-16 lg:w-24 lg:h-24 border-t-2 border-l-2 border-matriz-purple/30 rounded-tl-3xl pointer-events-none"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WebShowcase;