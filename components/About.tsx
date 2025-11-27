import React from 'react';
import { CheckCircle2 } from 'lucide-react';

const About: React.FC = () => {
  return (
    <section id="about" className="py-16 md:py-20 bg-matriz-dark border-y border-white/5 relative overflow-hidden scroll-mt-28">
        {/* Decorative giant text */}
        <div className="absolute -left-20 top-10 select-none opacity-20 pointer-events-none">
            <span className="font-display font-black text-[200px] text-outline whitespace-nowrap">MATRIZ VISUAL</span>
        </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 items-center">
          <div className="relative">
             {/* Abstract grid composition */}
             <div className="relative z-10 grid grid-cols-2 gap-4">
                 <img 
                    src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=600&auto=format&fit=crop" 
                    alt="Ambiente Criativo Tech" 
                    className="w-full h-64 object-cover rounded-sm grayscale hover:grayscale-0 transition-all duration-500 border border-white/10" 
                 />
                 <img 
                    src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=600&auto=format&fit=crop" 
                    alt="Estratégia e Colaboração" 
                    className="w-full h-64 object-cover rounded-sm grayscale hover:grayscale-0 transition-all duration-500 border border-white/10 mt-12" 
                 />
             </div>
             <div className="absolute -top-4 -left-4 w-24 h-24 border-t-2 border-l-2 border-matriz-purple"></div>
             <div className="absolute -bottom-4 -right-4 w-24 h-24 border-b-2 border-r-2 border-matriz-purple"></div>
          </div>

          <div>
            <h2 className="font-display text-4xl font-bold mb-6 text-white">
              Transformamos ideias <br/> <span className="text-matriz-purple">em resultados.</span>
            </h2>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Sabemos que empreender é um desafio. Por isso, a Matriz Visual existe para ser parceira do seu negócio. Não entregamos apenas "artes bonitas", entregamos ferramentas para você vender mais.
            </p>
            <p className="text-gray-400 mb-8 leading-relaxed">
              Seja um site que funciona rápido no celular, um logotipo que passa credibilidade ou vídeos que engajam no Instagram, nosso foco é ajudar sua empresa a crescer de forma sólida e profissional.
            </p>

            <div className="space-y-4">
                <div className="flex items-center gap-3">
                    <CheckCircle2 className="text-matriz-purple" />
                    <span className="text-white">Foco no seu crescimento</span>
                </div>
                <div className="flex items-center gap-3">
                    <CheckCircle2 className="text-matriz-purple" />
                    <span className="text-white">Qualidade que impressiona clientes</span>
                </div>
                <div className="flex items-center gap-3">
                    <CheckCircle2 className="text-matriz-purple" />
                    <span className="text-white">Entrega rápida e sem enrolação</span>
                </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;