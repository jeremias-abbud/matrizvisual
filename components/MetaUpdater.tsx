import React, { useEffect } from 'react';
import { useSiteAssets } from '../src/hooks/useSiteAssets';

const MetaUpdater: React.FC = () => {
  const { assetsMap } = useSiteAssets();

  useEffect(() => {
    // 1. Update Favicon (Ícone da aba)
    const faviconUrl = assetsMap.favicon?.image_url;
    if (faviconUrl) {
      let link: HTMLLinkElement | null = document.querySelector("link[rel*='icon']");
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.getElementsByTagName('head')[0].appendChild(link);
      }
      link.href = faviconUrl;
      link.type = 'image/png'; // Garante que o navegador saiba que é um PNG
    }

    // 2. Update Social Share Image (OG & Twitter)
    const shareUrl = assetsMap.social_share?.image_url;
    if (shareUrl) {
      // OG:Image (Facebook/WhatsApp)
      let ogImage: HTMLMetaElement | null = document.querySelector("meta[property='og:image']");
      if (ogImage) {
        ogImage.content = shareUrl;
      } else {
        const meta = document.createElement('meta');
        meta.setAttribute('property', 'og:image');
        meta.content = shareUrl;
        document.getElementsByTagName('head')[0].appendChild(meta);
      }

      // Twitter:Image
      let twitterImage: HTMLMetaElement | null = document.querySelector("meta[property='twitter:image']");
      if (twitterImage) {
        twitterImage.content = shareUrl;
      } else {
        const meta = document.createElement('meta');
        meta.setAttribute('property', 'twitter:image');
        meta.content = shareUrl;
        document.getElementsByTagName('head')[0].appendChild(meta);
      }
    }
  }, [assetsMap]);

  return null; // Este componente não renderiza nada visualmente
};

export default MetaUpdater;