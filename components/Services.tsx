import React from 'react';
import { Palette, Monitor, Video, Rocket } from 'lucide-react';
import { SERVICES } from '../constants';

const Services: React.FC = () => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Palette': return <Palette className="w-8 h-8" />;
      case 'Monitor': return <Monitor className="w-8 h-8" />;
      case 'Video': return <Video className="w-8 h-8" />;
      case 'Rocket': return <Rocket className="w-8 h-8" />;
      default: return <Palette className="w-8 h-8" />;
    }
  };

  return (
    <section id="services" className="py-16 md:py-20 bg-matriz-dark relative scroll-mt-28">
      <div className="container mx-auto px-6">
        <div className="mb-12 text-center">
            <h2 className="font-display text-4xl font-bold mb-4 text-white">Como Podemos <span className="text-matriz-purple">Ajudar</span></h2>
            <div className="w-24 h-1 bg-matriz-purple mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {SERVICES.map((service, index) => (
            <div key={service.id} className="group p-8 border border-white/5 bg-white/5 hover:border-matriz-purple/50 hover:bg-white/10 transition-all duration-300 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-matriz-purple/10 rounded-bl-full -mr-12 -mt-12 transition-all group-hover:scale-150"></div>
              
              <div className="mb-6 text-matriz-silver group-hover:text-matriz-purple transition-colors">
                {getIcon(service.iconName)}
              </div>
              
              <h3 className="font-display text-xl font-bold mb-3 text-white group-hover:translate-x-2 transition-transform duration-300">
                {service.title}
              </h3>
              
              <p className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-300">
                {service.description}
              </p>

              <div className="mt-6 w-full h-[1px] bg-white/10 group-hover:bg-matriz-purple transition-colors"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;