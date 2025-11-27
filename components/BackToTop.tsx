import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

const BackToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 500) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-8 right-8 z-[49] p-3 bg-matriz-purple text-white shadow-[0_0_15px_rgba(139,92,246,0.5)] border border-white/10 hover:bg-white hover:text-matriz-purple hover:shadow-[0_0_25px_rgba(255,255,255,0.5)] transition-all duration-300 transform group ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'
      }`}
      aria-label="Voltar ao topo"
    >
      <ArrowUp size={24} className="group-hover:-translate-y-1 transition-transform duration-300" />
    </button>
  );
};

export default BackToTop;