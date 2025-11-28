import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

export interface SiteAsset {
  key: string;
  label: string;
  image_url: string;
  style_config?: any; // JSONB do banco
}

// Configuração padrão (Fallback) se o banco falhar
const FALLBACK_ASSETS: Record<string, SiteAsset> = {
  logo_navbar: { key: 'logo_navbar', label: 'Logo (Barra de Navegação)', image_url: '/logo.png', style_config: { height_desktop: '4rem', height_mobile: '3rem' } },
  logo_hero: { key: 'logo_hero', label: 'Logo (Seção Principal/Hero)', image_url: '/logo.png', style_config: { height_desktop: '10rem', height_mobile: '8rem', glow: true } },
  favicon: { key: 'favicon', label: 'Ícone da Aba (Favicon)', image_url: '/logo.png' },
  about_img_1: { key: 'about_img_1', label: 'Imagem Sobre Nós (Esquerda/Topo)', image_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop' },
  about_img_2: { key: 'about_img_2', label: 'Imagem Sobre Nós (Direita/Baixo)', image_url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=600&auto=format&fit=crop' },
  social_share: { key: 'social_share', label: 'Imagem de Compartilhamento (Social)', image_url: '/social-share.jpg' },
};

export const useSiteAssets = () => {
  const [assetsMap, setAssetsMap] = useState<Record<string, SiteAsset>>(FALLBACK_ASSETS);
  const [loading, setLoading] = useState(true);

  // Efeito para aplicar o Favicon dinamicamente
  useEffect(() => {
    const faviconUrl = assetsMap.favicon?.image_url;
    if (faviconUrl) {
      let link: HTMLLinkElement | null = document.querySelector("link[rel*='icon']");
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.getElementsByTagName('head')[0].appendChild(link);
      }
      link.href = faviconUrl;
    }
  }, [assetsMap.favicon]);

  const fetchAssets = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('site_assets').select('*');
      
      if (error) {
        console.error('Error fetching assets, using fallback:', error);
        setAssetsMap(FALLBACK_ASSETS); // Usa o fallback em caso de erro
        return;
      }

      if (data && data.length > 0) {
        // Converte o array do banco em um mapa para acesso fácil (ex: assetsMap['logo_navbar'])
        const newAssetsMap = data.reduce((acc, item) => {
          acc[item.key] = {
            ...item,
            // Garante que style_config seja sempre um objeto para evitar erros
            style_config: item.style_config || {},
          };
          return acc;
        }, {} as Record<string, SiteAsset>);
        
        // Garante que todos os fallbacks existam se não vierem do banco
        const finalMap = { ...FALLBACK_ASSETS, ...newAssetsMap };
        setAssetsMap(finalMap);
      } else {
         setAssetsMap(FALLBACK_ASSETS); // Usa fallback se o banco estiver vazio
      }
    } catch (err) {
      console.error('Critical error in useSiteAssets:', err);
      setAssetsMap(FALLBACK_ASSETS); // Usa fallback em caso de erro crítico
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAssets();
  }, [fetchAssets]);

  return { assetsMap, loading, refreshAssets: fetchAssets };
};