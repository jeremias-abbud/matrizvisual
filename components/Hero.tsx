import React from 'react';
import { ArrowRight } from 'lucide-react';

const Hero: React.FC = () => {
  const handleScrollClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const targetId = href.replace('#', '');
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-matriz-black pt-20 scroll-mt-28">
      {/* Abstract Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-matriz-purple/20 rounded-full blur-[128px]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-[96px]"></div>
        
        {/* Grid lines */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10 text-center">
        <div className="inline-block mb-4 px-3 py-1 border border-matriz-purple/50 rounded-full bg-matriz-purple/10 backdrop-blur-sm animate-fade-in">
            <span className="text-matriz-purple text-xs uppercase tracking-[0.2em] font-bold">Futuro Visual</span>
        </div>
        
        <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-black text-white mb-6 leading-tight animate-fade-in-down">
          CRIATIVIDADE <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-matriz-silver via-white to-matriz-silver drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
            SEM LIMITES
          </span>
        </h1>

        <p className="font-sans text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in delay-100">
          Elevamos sua marca através de Design de alto impacto, Sites performáticos e Produções Audiovisuais cinematográficas.
        </p>

        <div className="flex flex-col md:flex-row justify-center gap-4 animate-fade-in delay-200">
          <a 
            href="#portfolio" 
            onClick={(e) => handleScrollClick(e, '#portfolio')}
            className="group relative px-8 py-4 bg-matriz-purple text-white font-bold tracking-widest uppercase overflow-hidden cursor-pointer"
          >
            <div className="absolute inset-0 w-0 bg-white transition-all duration-[250ms] ease-out group-hover:w-full opacity-10"></div>
            <span className="relative flex items-center gap-2">
              Ver Projetos <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
          </a>
          <a 
            href="#contact" 
            onClick={(e) => handleScrollClick(e, '#contact')}
            className="px-8 py-4 border border-matriz-gray text-white hover:border-matriz-silver transition-colors duration-300 font-bold tracking-widest uppercase bg-transparent cursor-pointer"
          >
            Fale Conosco
          </a>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <a 
        href="#services" 
        onClick={(e) => handleScrollClick(e, '#services')}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50 hover:opacity-100 transition-opacity animate-bounce-slow cursor-pointer z-10"
      >
        <span className="text-[10px] uppercase tracking-widest">Scroll</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-white to-transparent"></div>
      </a>
    </section>
  );
};

export default Hero;