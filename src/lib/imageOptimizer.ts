
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
