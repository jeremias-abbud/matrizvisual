import imageCompression from 'browser-image-compression';

/**
 * Otimiza imagens para upload no Supabase visando o plano gratuito.
 * Metas:
 * - Formato: WebP (Melhor compressão, suportado por todos navegadores modernos)
 * - Tamanho máximo: ~300KB
 * - Dimensão máxima: 1600px
 * 
 * Isso evita estouro do limite de Egress (Banda) do Supabase.
 */
export async function optimizeImageForSupabase(file: File): Promise<File> {
  const options = {
    maxSizeMB: 0.3,          // Limite de 300KB
    maxWidthOrHeight: 1600,  // Redimensiona se for maior que 1600px
    useWebWorker: true,
    initialQuality: 0.8,
    fileType: 'image/webp',  // FORÇA conversão para WebP
  };

  try {
    console.log(`[Otimizador] Iniciando compressão WebP. Original: ${(file.size / 1024 / 1024).toFixed(2)} MB`);
    
    const compressedFile = await imageCompression(file, options);
    
    console.log(`[Otimizador] Sucesso. Final: ${(compressedFile.size / 1024 / 1024).toFixed(2)} MB`);
    
    // Alguns browsers podem não renomear automaticamente o arquivo para .webp no objeto File
    const newFileName = file.name.replace(/\.[^/.]+$/, "") + ".webp";
    const finalFile = new File([compressedFile], newFileName, { type: 'image/webp' });

    return finalFile;

  } catch (error) {
    console.error('[Otimizador] Erro ao comprimir imagem:', error);
    return file; 
  }
}


/**
 * Converte uma imagem WebP de volta para PNG usando a API de Canvas.
 * Essencial para a funcionalidade de "reverter otimização".
 */
export async function convertWebPToPNG(webpUrl: string): Promise<File | null> {
  try {
    // Adiciona um timestamp para evitar problemas de cache do navegador ao baixar a imagem
    const response = await fetch(`${webpUrl}?t=${new Date().getTime()}`);
    if (!response.ok) throw new Error(`Failed to fetch image: ${response.statusText}`);

    const blob = await response.blob();
    const imageBitmap = await createImageBitmap(blob);
    
    const canvas = document.createElement('canvas');
    canvas.width = imageBitmap.width;
    canvas.height = imageBitmap.height;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not get canvas context');
    
    ctx.drawImage(imageBitmap, 0, 0);
    
    const pngBlob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, 'image/png', 1.0); // Qualidade máxima para PNG
    });
    
    if (!pngBlob) throw new Error('Failed to convert canvas to PNG blob');

    // Gera um nome de arquivo aleatório para evitar conflitos de cache
    const newFileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.png`;
    
    return new File([pngBlob], newFileName, { type: 'image/png' });

  } catch (error) {
    console.error('[Otimizador] Erro ao reverter para PNG:', error);
    return null;
  }
}
