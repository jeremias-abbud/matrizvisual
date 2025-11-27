
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface SiteAsset {
  key: string;
  label: string;
  image_url: string;
  style_config?: any; // JSONB do banco
}

// Configuração padrão (Fallback)
const DEFAULT_ASSETS: Record<string, string> = {
  logo_main: '/logo.png',
  favicon: '/logo.png',
  about_img_1: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop',
  about_img_2: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=600&auto=format&fit=crop',
  social_share: '/social-share.jpg',
};

// Estilos Padrão
const DEFAULT_STYLES = {
  logo_height_desktop: '6rem',
  logo_height_mobile: '4rem',
  logo_glow: false,
  about_grayscale: true,
};

export const useSiteAssets = () => {
  const [assets, setAssets] = useState<Record<string, string>>(DEFAULT_ASSETS);
  const [styles, setStyles] = useState<Record<string, any>>(DEFAULT_STYLES);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAssets();
  }, []);

  // Efeito para aplicar o Favicon dinamicamente
  useEffect(() => {
    if (assets.favicon) {
      const link: HTMLLinkElement | null = document.querySelector("link[rel*='icon']") || document.createElement('link');
      link.type = 'image/png';
      link.rel = 'icon';
      link.href = assets.favicon;
      document.getElementsByTagName('head')[0].appendChild(link);
    }
  }, [assets.favicon]);

  const fetchAssets = async () => {
    try {
      const { data, error } = await supabase.from('site_assets').select('*');
      
      if (error) {
        console.error('Error fetching assets:', error);
        return;
      }

      if (data && data.length > 0) {
        // Converte o array do banco em mapas de URL e Styles
        const assetMap: Record<string, string> = { ...DEFAULT_ASSETS };
        const styleMap: Record<string, any> = { ...DEFAULT_STYLES };

        data.forEach((item: SiteAsset) => {
          assetMap[item.key] = item.image_url;
          
          // Merge styles se existirem para aquela chave
          if (item.style_config) {
            Object.assign(styleMap, item.style_config);
          }
        });

        setAssets(assetMap);
        setStyles(styleMap);
      }
    } catch (err) {
      console.error('Error in useSiteAssets:', err);
    } finally {
      setLoading(false);
    }
  };

  return { assets, styles, loading, refreshAssets: fetchAssets };
};
