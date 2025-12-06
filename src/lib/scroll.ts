import React from 'react';

/**
 * Realiza uma rolagem suave para o ID especificado, 
 * compensando exatamente a altura do cabeçalho fixo dinamicamente.
 */
export const smoothScrollTo = (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>, href: string) => {
  e.preventDefault();
  
  const targetId = href.replace('#', '');
  
  // Se for Home/Início, rola para o topo absoluto para não cortar o Hero
  if (targetId === 'home') {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    return;
  }

  const element = document.getElementById(targetId);
  
  if (element) {
    // Calcula a altura real da barra de navegação no momento do clique
    const nav = document.querySelector('nav');
    // Usa a altura do nav + 20px de respiro, ou 100px como fallback seguro se o nav não for encontrado
    const headerOffset = nav ? nav.offsetHeight + 20 : 100; 
    
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }
};