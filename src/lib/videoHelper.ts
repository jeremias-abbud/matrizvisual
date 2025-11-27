
export const getEmbedUrl = (url: string): string => {
  if (!url) return '';
  
  // Regex robusto para YouTube (suporta youtube.com/watch?v=, youtube.com/embed/, youtu.be/)
  const ytMatch = url.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  
  if (ytMatch && ytMatch[1]) {
    // Parâmetros: autoplay=1 (toca auto), mute=0 (com som), rel=0 (sem vídeos relacionados de terceiros)
    return `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1&mute=0&rel=0&showinfo=0&modestbranding=1`;
  }

  // Regex para Vimeo
  const vimeoMatch = url.match(/(?:https?:\/\/)?(?:www\.)?vimeo\.com\/(\d+)/);
  if (vimeoMatch && vimeoMatch[1]) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1&muted=0`;
  }

  // Se não for nenhum dos dois, retorna a URL original (pode ser um link direto .mp4 ou embed já pronto)
  return url;
};
