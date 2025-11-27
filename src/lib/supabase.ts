import { createClient } from '@supabase/supabase-js';

// Hardcoded fallbacks provided by user to ensure connection works even if .env fails to load
const FALLBACK_URL = 'https://jnogzzroccgoerjgmdtw.supabase.co';
const FALLBACK_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impub2d6enJvY2Nnb2VyamdtZHR3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQyNTQ2ODEsImV4cCI6MjA3OTgzMDY4MX0.CKaaOIfd5CnPsCW_7cLXuRk9w94aE19dfxYww7mGKV8';

const getSupabaseConfig = () => {
  let url = FALLBACK_URL;
  let key = FALLBACK_KEY;

  try {
    // Safely attempt to read from Vite environment variables
    if (import.meta && import.meta.env) {
      if (import.meta.env.VITE_SUPABASE_URL) url = import.meta.env.VITE_SUPABASE_URL;
      if (import.meta.env.VITE_SUPABASE_ANON_KEY) key = import.meta.env.VITE_SUPABASE_ANON_KEY;
    }
  } catch (e) {
    // Ignore errors and use fallbacks
    console.warn('Could not read import.meta.env, using fallback credentials');
  }

  return { url, key };
};

const config = getSupabaseConfig();

if (!config.url || !config.key) {
  console.error('Supabase credentials missing. Check your configuration.');
}

export const supabase = createClient(config.url, config.key);

/**
 * Uploads a file to Supabase Storage bucket 'portfolio-images'
 * Returns the public URL of the uploaded file.
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
    alert('Erro ao fazer upload da imagem. Verifique se você criou o Bucket no Supabase.');
    return null;
  }
};