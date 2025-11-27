
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface SiteAsset {
  key: string;
  label: string;
  image_url: string;
}

// Configuração padrão (Fallback) caso o banco esteja vazio ou carregando
const DEFAULT_ASSETS: Record<string, string> = {
  logo_main: '/logo.png',
  about_img_1: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop',
  about_img_2: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=600&auto=format&fit=crop',
  social_share: '/social-share.jpg',
};

export const useSiteAssets = () => {
  const [assets, setAssets] = useState<Record<string, string>>(DEFAULT_ASSETS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAssets();
  }, []);

  const fetchAssets = async () => {
    try {
      const { data, error } = await supabase.from('site_assets').select('*');
      
      if (error) {
        console.error('Error fetching assets:', error);
        return;
      }

      if (data && data.length > 0) {
        // Converte o array do banco em um objeto { chave: url }
        const assetMap = data.reduce((acc: Record<string, string>, item: SiteAsset) => {
          acc[item.key] = item.image_url;
          return acc;
        }, { ...DEFAULT_ASSETS }); // Inicia com os defaults para garantir que nada falte

        setAssets(assetMap);
      }
    } catch (err) {
      console.error('Error in useSiteAssets:', err);
    } finally {
      setLoading(false);
    }
  };

  return { assets, loading, refreshAssets: fetchAssets };
};
