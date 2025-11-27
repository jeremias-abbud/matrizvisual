import imageCompression from 'browser-image-compression';

/**
 * Otimiza imagens para upload no Supabase visando o plano gratuito.
 * Metas:
 * - Tamanho máximo: ~300KB (0.3MB)
 * - Dimensão máxima: 1600px (Largura ou Altura)
 * 
 * Isso evita estouro do limite de Egress (Banda) do Supabase.
 */
export async function optimizeImageForSupabase(file: File): Promise<File> {
  // Configurações rígidas de otimização
  const options = {
    maxSizeMB: 0.3,          // Limite de 300KB
    maxWidthOrHeight: 1600,  // Redimensiona se for maior que 1600px (4K vira Full HD+)
    useWebWorker: true,      // Usa thread separada para não travar o site
    initialQuality: 0.8,     // Começa com 80% de qualidade
  };

  try {
    console.log(`[Otimizador] Iniciando compressão. Original: ${(file.size / 1024 / 1024).toFixed(2)} MB`);
    
    // Se o arquivo já for menor que 300KB, a biblioteca geralmente retorna o original ou comprime levemente.
    const compressedFile = await imageCompression(file, options);
    
    console.log(`[Otimizador] Sucesso. Final: ${(compressedFile.size / 1024 / 1024).toFixed(2)} MB`);
    
    // Retorna o arquivo comprimido
    return compressedFile;

  } catch (error) {
    console.error('[Otimizador] Erro ao comprimir imagem:', error);
    // Em caso de erro crítico na compressão, retorna o arquivo original para não impedir o upload,
    // mas avisa no console.
    return file; 
  }
}