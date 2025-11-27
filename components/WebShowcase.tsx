import React, { useState } from 'react';
import { ExternalLink, Code2, Cpu, Globe } from 'lucide-react';
import { FEATURED_WEB_PROJECTS } from '../constants';

const WebShowcase: React.FC = () => {
  const [activeProject, setActiveProject] = useState(FEATURED_WEB_PROJECTS[0]);

  return (
    <section className="py-24 bg-gradient-to-b from-matriz-black to-matriz-dark border-b border-white/5 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-matriz-purple/5 rounded-full blur-3xl pointer-events-none"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="mb-16">
          <span className="text-matriz-purple text-xs font-bold uppercase tracking-[0.3em]">Desenvolvimento Web</span>
          <h2 className="font-display text-4xl font-bold text-white mt-2">
            Experiências Digitais <span className="text-gray-500">Imersivas</span>
          </h2>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Left Side: Project List/Controls */}
          <div className="lg:w-1/3 flex flex-col gap-4">
            {FEATURED_WEB_PROJECTS.map((project) => (
              <button
                key={project.id}
                onClick={() => setActiveProject(project)}
                className={`group text-left p-6 border rounded-sm transition-all duration-300 relative overflow-hidden ${
                  activeProject.id === project.id
                    ? 'border-matriz-purple bg-white/5 shadow-[0_0_20px_rgba(139,92,246,0.1)]'
                    : 'border-white/5 bg-transparent hover:bg-white/5 hover:border-white/20'
                }`}
              >
                {/* Active Indicator */}
                {activeProject.id === project.id && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-matriz-purple"></div>
                )}

                <h3 className={`font-display text-lg font-bold mb-1 transition-colors ${
                  activeProject.id === project.id ? 'text-white' : 'text-gray-400 group-hover:text-white'
                }`}>
                  {project.title}
                </h3>
                <p className="text-sm text-gray-500 line-clamp-2">
                  {project.description}
                </p>
              </button>
            ))}
            
            {/* Tech Stack of Active Project (Mobile/Tablet view only, hidden on large desktop to avoid duplication if desired, or kept for style) */}
            <div className="mt-8 p-6 bg-black/40 border border-white/5 rounded-sm">
                <div className="flex items-center gap-2 mb-4 text-matriz-silver">
                    <Code2 size={20} className="text-matriz-purple" />
                    <span className="text-xs uppercase tracking-widest font-bold">Tech Stack</span>
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
                Visitar Site <ExternalLink size={18} />
              </a>
          </div>

          {/* Right Side: Browser Mockup */}
          <div className="lg:w-2/3">
            <div className="relative group">
                {/* Glow behind monitor */}
                <div className="absolute -inset-1 bg-gradient-to-r from-matriz-purple to-blue-600 rounded-lg blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                
                {/* Browser Window */}
                <div className="relative bg-matriz-gray rounded-lg border border-white/10 overflow-hidden shadow-2xl">
                    {/* Browser Toolbar */}
                    <div className="h-10 bg-[#1a1a1a] border-b border-white/5 flex items-center px-4 gap-2">
                        <div className="flex gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                            <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                        </div>
                        {/* Fake Address Bar */}
                        <div className="ml-4 flex-1 bg-black/50 rounded-md h-6 flex items-center px-3 text-[10px] text-gray-500 font-mono">
                            <Globe size={10} className="mr-2" />
                            https://{activeProject.title.toLowerCase().replace(/\s/g, '-')}.com
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
                <div className="absolute -bottom-6 -right-6 w-24 h-24 border-b-2 border-r-2 border-white/10 rounded-br-3xl pointer-events-none"></div>
                <div className="absolute -top-6 -left-6 w-24 h-24 border-t-2 border-l-2 border-matriz-purple/30 rounded-tl-3xl pointer-events-none"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WebShowcase;