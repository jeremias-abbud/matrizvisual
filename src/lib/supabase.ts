import { createClient } from '@supabase/supabase-js';

// Configuração direta com as credenciais fornecidas
const SUPABASE_URL = 'https://jnogzzroccgoerjgmdtw.supabase.co';
const SUPABASE_KEY = 'sb_publishable_eGx9KBwWN2UBURj7BE_F9A_znn0eHeF';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

/**
 * Faz upload de um arquivo para o Bucket 'portfolio-images' do Supabase
 * Retorna a URL pública do arquivo.
 */
export const uploadImage = async (file: File): Promise<string | null> => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('portfolio-images')
      .upload(filePath, file);

    if (uploadError) {
      throw uploadError;
    }

    const { data } = supabase.storage
      .from('portfolio-images')
      .getPublicUrl(filePath);

    return data.publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    return null;
  }
};