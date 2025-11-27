import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { useSiteAssets } from '../src/hooks/useSiteAssets';
import { smoothScrollTo } from '../src/lib/scroll';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { assetsMap } = useSiteAssets();
  const [isLogoLoaded, setIsLogoLoaded] = useState(false);

  const navbarLogo = assetsMap.logo_navbar;
  const logoStyles = navbarLogo?.style_config || {};

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    setIsOpen(false);
    smoothScrollTo(e, href);
  };

  const navLinks = [
    { name: 'Início', href: '#home' },
    { name: 'Serviços', href: '#services' },
    { name: 'Portfólio', href: '#portfolio' },
    { name: 'Sobre', href: '#about' },
    { name: 'Contato', href: '#contact' },
  ];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled || isOpen ? 'bg-matriz-black/95 backdrop-blur-md border-b border-white/10 py-2' : 'bg-transparent py-4'}`}>
      <div className="container mx-auto px-6 flex justify-between items-center h-full">
        <a 
          href="#home" 
          className="flex items-center gap-2 group cursor-pointer h-full py-1 relative" 
          onClick={(e) => handleNavClick(e, '#home')}
          style={{ 
            height: window.innerWidth < 768 
              ? (logoStyles.height_mobile || '3rem') 
              : (logoStyles.height_desktop || '4rem'),
          }}
        >
           {/* Skeleton Loader */}
           {!isLogoLoaded && (
             <div 
               className="bg-white/10 animate-pulse rounded-sm h-full"
               style={{ width: '120px' }} // Approximate width
             ></div>
           )}

           <img 
             src={navbarLogo?.image_url} 
             alt="Matriz Visual" 
             onLoad={() => setIsLogoLoaded(true)}
             className={`h-full w-auto object-contain transition-all duration-500 hover:opacity-90 ${
               isLogoLoaded ? 'opacity-100' : 'opacity-0 absolute'
             }`}
           />
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
