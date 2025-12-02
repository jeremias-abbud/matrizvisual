
export const getEmbedUrl = (url: string): string => {
  if (!url) return '';
  
  // Regex robusto para YouTube (suporta youtube.com/watch?v=, youtube.com/embed/, youtu.be/)
  const ytMatch = url.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  
  if (ytMatch && ytMatch[1]) {
    // Parâmetros: autoplay=1 (toca auto), mute=0 (com som), rel=0 (sem vídeos relacionados), modesta (sem logo yt)
    return `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1&mute=0&rel=0&showinfo=0&modestbranding=1`;
  }

  // Regex para Vimeo
  const vimeoMatch = url.match(/(?:https?:\/\/)?(?:www\.)?vimeo\.com\/(\d+)/);
  if (vimeoMatch && vimeoMatch[1]) {
    // Parâmetros Vimeo:
    // title=0: Remove título
    // byline=0: Remove autor
    // portrait=0: Remove foto do autor
    // autoplay=1: Toca automático ao abrir modal
    return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1&title=0&byline=0&portrait=0`;
  }

  // Se não for nenhum dos dois, retorna a URL original
  return url;
};
