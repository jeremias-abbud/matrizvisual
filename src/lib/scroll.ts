import React from 'react';

/**
 * Realiza uma rolagem suave para o ID especificado, 
 * compensando exatamente a altura do cabeçalho fixo.
 */
export const smoothScrollTo = (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>, href: string) => {
  e.preventDefault();
  
  const targetId = href.replace('#', '');
  const element = document.getElementById(targetId);
  
  if (element) {
    const headerOffset = 100; // Altura segura do Header + Respiro
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }
};