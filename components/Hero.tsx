import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { useSiteAssets } from '../src/hooks/useSiteAssets';
import { smoothScrollTo } from '../src/lib/scroll';

const Hero: React.FC = () => {
  const { assetsMap } = useSiteAssets();
  const [isLogoLoaded, setIsLogoLoaded] = useState(false);

  const heroLogo = assetsMap.logo_hero;
  const logoStyles = heroLogo?.style_config || {};
  
  const logoHeight = window.innerWidth < 768 
    ? (logoStyles.height_mobile || '8rem') 
    : (logoStyles.height_desktop || '10rem');

  return (
    <section id="home" className="relative min-h-screen flex flex-col justify-between overflow-hidden bg-matriz-black pt-28 scroll-mt-28 gap-8">
      {/* Abstract Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-matriz-purple/20 rounded-full blur-[128px]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-[96px]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
      </div>

      {/* Main Content Wrapper */}
      <div className="flex-grow flex items-center justify-center container mx-auto px-6 relative z-10 py-4">
        <div className="text-center w-full max-w-4xl mx-auto flex flex-col items-center">
            
            <div className="mb-6 flex justify-center animate-fade-in-down relative" style={{ height: logoHeight }}>
                {/* Skeleton for Hero Logo */}
                {!isLogoLoaded && (
                    <div 
                        className="bg-white/5 animate-pulse rounded-md"
                        style={{ height: logoHeight, width: `calc(${logoHeight} * 1.5)` }}
                    ></div>
                )}
                
                <img 
                    src={heroLogo?.image_url} 
                    alt="Matriz Visual Emblem" 
                    onLoad={() => setIsLogoLoaded(true)}
                    style={{ 
                        height: logoHeight, 
                        filter: logoStyles.glow ? 'drop-shadow(0 0 30px rgba(139,92,246,0.5))' : 'none'
                    }}
                    className={`w-auto object-contain transition-all duration-700 hover:scale-105 ${
                        isLogoLoaded ? 'opacity-100' : 'opacity-0 absolute'
                    }`}
                />
            </div>

            {/* Status Indicator Badge */}
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-md animate-fade-in delay-100 hover:border-matriz-purple/50 transition-colors cursor-default group">
              <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span className="text-gray-300 text-xs font-medium tracking-[0.2em] uppercase group-hover:text-white transition-colors">
                  Disponível para Projetos
              </span>
            </div>
            
            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-black text-white mb-6 leading-tight animate-fade-in-down delay-200 w-full">
              DESTAQUE <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-matriz-silver via-white to-matriz-silver drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                  SUA MARCA
              </span>
            </h1>

            <p className="font-sans text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in delay-300">
              Profissionalismo para vender mais. Transformamos o visual da sua empresa em uma ferramenta de negócios poderosa.
            </p>

            <div className="flex flex-col md:flex-row justify-center gap-4 animate-fade-in delay-500 w-full">
              <a 
                  href="#portfolio" 
                  onClick={(e) => smoothScrollTo(e, '#portfolio')}
                  className="group relative px-8 py-4 bg-matriz-purple text-white font-bold tracking-widest uppercase overflow-hidden cursor-pointer"
              >
                  <div className="absolute inset-0 w-0 bg-white transition-all duration-[250ms] ease-out group-hover:w-full opacity-10"></div>
                  <span className="relative flex items-center justify-center gap-2">
                  Ver Portfólio <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
              </a>
              <a 
                  href="#contact" 
                  onClick={(e) => smoothScrollTo(e, '#contact')}
                  className="px-8 py-4 border border-matriz-gray text-white hover:border-matriz-silver transition-colors duration-300 font-bold tracking-widest uppercase bg-transparent cursor-pointer text-center"
              >
                  Pedir Orçamento
              </a>
            </div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="relative z-10 pb-8 md:pb-12 shrink-0 w-full flex justify-center">
        <a 
            href="#services" 
            onClick={(e) => smoothScrollTo(e, '#services')}
            className="flex flex-col items-center gap-2 group cursor-pointer"
            aria-label="Rolar para baixo"
        >
            <div className="w-[30px] h-[50px] rounded-full border-2 border-white/20 flex justify-center p-2 box-border bg-black/20 backdrop-blur-sm group-hover:border-matriz-purple group-hover:shadow-[0_0_20px_rgba(139,92,246,0.4)] transition-all duration-300">
              <div className="w-1 h-2 bg-matriz-purple rounded-full animate-scroll"></div>
            </div>
        </a>
      </div>
    </section>
  );
};

export default Hero;
