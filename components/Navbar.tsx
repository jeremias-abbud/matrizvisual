import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault(); // Prevent URL change and default jump
    setIsOpen(false);
    
    const targetId = href.replace('#', '');
    const element = document.getElementById(targetId);
    
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  const navLinks = [
    { name: 'Início', href: '#home' },
    { name: 'Serviços', href: '#services' },
    { name: 'Portfólio', href: '#portfolio' },
    { name: 'Sobre', href: '#about' },
    { name: 'Contato', href: '#contact' },
  ];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled || isOpen ? 'bg-matriz-black/95 backdrop-blur-md border-b border-white/10 py-3' : 'bg-transparent py-5'}`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        {/* Logo Text/Icon */}
        <a 
          href="#home" 
          className="flex items-center gap-2 group cursor-pointer" 
          onClick={(e) => handleNavClick(e, '#home')}
        >
           <div className="relative w-8 h-8 border border-matriz-silver flex items-center justify-center overflow-hidden group-hover:border-matriz-purple transition-colors duration-300">
             <div className="absolute w-[120%] h-[1px] bg-matriz-purple rotate-45"></div>
             <span className="font-display font-bold text-lg text-white z-10">M</span>
           </div>
           <div className="flex flex-col">
             <span className="font-display font-bold text-xl tracking-wider text-white leading-none">MATRIZ</span>
             <span className="font-sans text-[10px] tracking-[0.3em] text-matriz-purple uppercase leading-none">Visual</span>
           </div>
        </a>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href} 
              onClick={(e) => handleNavClick(e, link.href)}
              className="text-sm uppercase tracking-wider text-gray-300 hover:text-matriz-purple transition-colors duration-300 relative after:content-[''] after:absolute after:w-0 after:h-[1px] after:bg-matriz-purple after:bottom-0 after:left-0 after:transition-all hover:after:w-full cursor-pointer"
            >
              {link.name}
            </a>
          ))}
          <a 
            href="#contact" 
            onClick={(e) => handleNavClick(e, '#contact')}
            className="px-5 py-2 border border-matriz-purple text-matriz-purple hover:bg-matriz-purple hover:text-white transition-all duration-300 text-sm uppercase font-bold tracking-widest clip-path-slant cursor-pointer"
          >
            Orçamento
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-white hover:text-matriz-purple transition-colors" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-matriz-black border-b border-matriz-gray/50 animate-fade-in-down shadow-2xl h-screen bg-black/95 backdrop-blur-xl">
          <div className="flex flex-col px-6 py-6 space-y-4">
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href} 
                className="text-white hover:text-matriz-purple py-3 border-b border-white/5 text-lg font-display tracking-wider cursor-pointer"
                onClick={(e) => handleNavClick(e, link.href)}
              >
                {link.name}
              </a>
            ))}
            <a 
              href="#contact" 
              onClick={(e) => handleNavClick(e, '#contact')}
              className="mt-4 text-center py-3 bg-matriz-purple/10 border border-matriz-purple text-matriz-purple font-bold uppercase tracking-widest cursor-pointer"
            >
              Orçamento
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;