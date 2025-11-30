import { createClient } from '@supabase/supabase-js';
import { optimizeImageForSupabase } from './imageOptimizer';

// Configuração direta com as credenciais fornecidas
const SUPABASE_URL = 'https://jnogzzroccgoerjgmdtw.supabase.co';
const SUPABASE_KEY = 'sb_publishable_eGx9KBwWN2UBURj7BE_F9A_znn0eHeF';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

/**
 * Faz upload de um arquivo para o Bucket 'portfolio-images' do Supabase.
 * OTIMIZA para WebP por padrão, a menos que skipOptimization seja true.
 */
export const uploadImage = async (file: File, skipOptimization = false): Promise<string | null> => {
  try {
    let fileToUpload = file;
    
    if (!skipOptimization) {
      // 1. Otimização Padrão (WebP)
      fileToUpload = await optimizeImageForSupabase(file);
    }

    // 2. Preparar nome do arquivo
    const fileExt = fileToUpload.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    // 3. Upload do arquivo
    const { error: uploadError } = await supabase.storage
      .from('portfolio-images')
      .upload(filePath, fileToUpload);

    if (uploadError) {
      throw uploadError;
    }

    // 4. Obter URL pública
    const { data } = supabase.storage
      .from('portfolio-images')
      .getPublicUrl(filePath);

    return data.publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    return null;
  }
};
