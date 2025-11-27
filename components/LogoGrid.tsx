import React from 'react';
import { LOGOS } from '../constants';

const LogoGrid: React.FC = () => {
  return (
    <section className="py-20 bg-matriz-black relative border-b border-white/5">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
           <span className="text-matriz-purple text-xs font-bold uppercase tracking-[0.3em]">Galeria de Logotipos</span>
           <h3 className="font-display text-2xl md:text-3xl font-bold text-white mt-2">
             Logos e Marcas que <span className="text-gray-500">Criamos</span>
           </h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {LOGOS.map((logo) => (
            <div 
              key={logo.id} 
              className="group relative aspect-square bg-matriz-dark border border-white/5 rounded-sm flex items-center justify-center p-4 overflow-hidden transition-all duration-300 hover:border-matriz-purple/50 hover:bg-white/5"
            >
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-matriz-purple/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              {/* Logo Image */}
              <img 
                src={logo.url} 
                alt={logo.name} 
                className="w-full h-full object-contain filter grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-110 relative z-10" 
              />
              
              {/* Tooltip Name (Optional) */}
              <div className="absolute bottom-2 left-0 w-full text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                <span className="text-[10px] text-white font-bold uppercase tracking-widest bg-black/80 px-2 py-1 rounded-full">
                  {logo.name}
                </span>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-10 flex justify-center">
            <p className="text-gray-500 text-sm max-w-xl text-center">
                Cada logotipo é construído com geometria sagrada e psicologia das cores para garantir aplicabilidade e reconhecimento instantâneo.
            </p>
        </div>
      </div>
    </section>
  );
};

export default LogoGrid;