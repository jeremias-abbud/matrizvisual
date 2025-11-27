import React from 'react';
import { CheckCircle2 } from 'lucide-react';

const About: React.FC = () => {
  return (
    <section id="about" className="py-24 bg-matriz-dark border-y border-white/5 relative overflow-hidden scroll-mt-28">
        {/* Decorative giant text */}
        <div className="absolute -left-20 top-10 select-none opacity-20 pointer-events-none">
            <span className="font-display font-black text-[200px] text-outline whitespace-nowrap">MATRIZ VISUAL</span>
        </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative">
             {/* Abstract grid composition */}
             <div className="relative z-10 grid grid-cols-2 gap-4">
                 <img src="https://picsum.photos/400/500?random=10" alt="Studio" className="w-full h-64 object-cover rounded-sm grayscale hover:grayscale-0 transition-all duration-500 border border-white/10" />
                 <img src="https://picsum.photos/400/500?random=11" alt="Team" className="w-full h-64 object-cover rounded-sm grayscale hover:grayscale-0 transition-all duration-500 border border-white/10 mt-12" />
             </div>
             <div className="absolute -top-4 -left-4 w-24 h-24 border-t-2 border-l-2 border-matriz-purple"></div>
             <div className="absolute -bottom-4 -right-4 w-24 h-24 border-b-2 border-r-2 border-matriz-purple"></div>
          </div>

          <div>
            <h2 className="font-display text-4xl font-bold mb-6 text-white">
              Onde a Tecnologia encontra <br/> <span className="text-matriz-purple">a Arte.</span>
            </h2>
            <p className="text-gray-400 mb-6 leading-relaxed">
              A Matriz Visual não é apenas uma agência; somos arquitetos digitais. Nascemos da necessidade de fundir design gráfico de alta precisão com tecnologia web de ponta e narrativas audiovisuais envolventes.
            </p>
            <p className="text-gray-400 mb-8 leading-relaxed">
              Nossa missão é transformar conceitos abstratos em experiências visuais tangíveis que elevam o valor da sua marca no mercado digital competitivo de hoje.
            </p>

            <div className="space-y-4">
                <div className="flex items-center gap-3">
                    <CheckCircle2 className="text-matriz-purple" />
                    <span className="text-white">Design centrado no usuário</span>
                </div>
                <div className="flex items-center gap-3">
                    <CheckCircle2 className="text-matriz-purple" />
                    <span className="text-white">Tecnologias de última geração</span>
                </div>
                <div className="flex items-center gap-3">
                    <CheckCircle2 className="text-matriz-purple" />
                    <span className="text-white">Entrega ágil e transparente</span>
                </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;