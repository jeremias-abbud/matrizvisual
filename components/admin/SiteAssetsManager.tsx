
import React, { useState, useEffect } from 'react';
import { supabase, uploadImage } from '../../src/lib/supabase';
import { Upload, RefreshCw, Save, Sliders, Monitor, Smartphone, Moon, Sun, Image as ImageIcon } from 'lucide-react';

interface AssetRow {
  key: string;
  label: string;
  image_url: string;
  style_config?: any;
}

const SiteAssetsManager: React.FC = () => {
  const [assets, setAssets] = useState<AssetRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);
  const [savingStyles, setSavingStyles] = useState(false);

  // Local state para edição de estilos
  const [styles, setStyles] = useState<Record<string, any>>({});

  useEffect(() => {
    fetchAssets();
  }, []);

  const fetchAssets = async () => {
    setLoading(true);
    const { data } = await supabase.from('site_assets').select('*').order('key');
    
    if (data && data.length > 0) {
      setAssets(data);
      
      // Flatten styles for easier editing
      const flattenedStyles: Record<string, any> = {};
      data.forEach((item: any) => {
        if (item.style_config) {
          Object.assign(flattenedStyles, item.style_config);
        }
      });
      setStyles(flattenedStyles);
    } else {
      // Defaults initiais se banco vazio
      setAssets([
        { key: 'logo_main', label: 'Logo Principal', image_url: '/logo.png' },
        { key: 'favicon', label: 'Favicon (Ícone Aba)', image_url: '/logo.png' },
        { key: 'about_img_1', label: 'Sobre: Foto 1', image_url: '...' },
        { key: 'about_img_2', label: 'Sobre: Foto 2', image_url: '...' },
      ]);
    }
    setLoading(false);
  };

  const handleImageUpload = async (key: string, file: File) => {
    setUploadingKey(key);
    const publicUrl = await uploadImage(file);

    if (publicUrl) {
      const assetToUpdate = assets.find(a => a.key === key);
      
      const { error } = await supabase
        .from('site_assets')
        .upsert({ 
          key: key, 
          image_url: publicUrl,
          label: assetToUpdate?.label || key 
          // Note: upsert might overwrite style_config if not handled carefully, 
          // but usually we want to preserve it or update it separately.
          // In Supabase upsert updates columns passed.
        });

      if (!error) {
        setAssets(prev => prev.map(a => a.key === key ? { ...a, image_url: publicUrl } : a));
      } else {
        alert('Erro ao salvar imagem.');
      }
    }
    setUploadingKey(null);
  };

  const handleStyleChange = (key: string, value: any) => {
    setStyles(prev => ({ ...prev, [key]: value }));
  };

  const saveStyles = async () => {
    setSavingStyles(true);
    
    try {
      // Update Logo Configs
      await supabase.from('site_assets').update({
        style_config: {
          logo_height_desktop: styles.logo_height_desktop || '6rem',
          logo_height_mobile: styles.logo_height_mobile || '4rem',
          logo_glow: styles.logo_glow || false
        }
      }).eq('key', 'logo_main');

      // Update About Configs
      // We assume about_img_1 holds the config for the section
      await supabase.from('site_assets').update({
        style_config: {
          about_grayscale: styles.about_grayscale
        }
      }).eq('key', 'about_img_1');

      alert('Estilos salvos com sucesso!');
    } catch (error) {
      console.error(error);
      alert('Erro ao salvar estilos.');
    } finally {
      setSavingStyles(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-display font-bold text-white">Visual do Site</h2>
        <button onClick={fetchAssets} className="p-2 bg-white/5 rounded hover:bg-white/10 text-white"><RefreshCw size={20} /></button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* COLUNA 1: Configurações de Estilo (CONTROLES) */}
        <div className="lg:col-span-1 bg-matriz-dark border border-matriz-purple/30 p-6 rounded-lg h-fit sticky top-6">
          <div className="flex items-center gap-2 mb-6 text-matriz-purple">
            <Sliders size={24} />
            <h3 className="font-bold uppercase tracking-wider">Personalização</h3>
          </div>

          <div className="space-y-6">
            {/* Logo Controls */}
            <div className="space-y-3">
              <label className="text-xs uppercase font-bold text-gray-400 block mb-2">Tamanho do Logo</label>
              
              <div className="flex items-center gap-3">
                <Monitor size={16} className="text-gray-500" />
                <input 
                  type="text" 
                  value={styles.logo_height_desktop || '6rem'}
                  onChange={(e) => handleStyleChange('logo_height_desktop', e.target.value)}
                  className="bg-black border border-white/10 rounded px-2 py-1 text-white text-sm w-full"
                  placeholder="Ex: 6rem"
                />
              </div>
              
              <div className="flex items-center gap-3">
                <Smartphone size={16} className="text-gray-500" />
                <input 
                  type="text" 
                  value={styles.logo_height_mobile || '4rem'}
                  onChange={(e) => handleStyleChange('logo_height_mobile', e.target.value)}
                  className="bg-black border border-white/10 rounded px-2 py-1 text-white text-sm w-full"
                  placeholder="Ex: 4rem"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-sm text-gray-300">Efeito Neon (Glow)</span>
                <button 
                  onClick={() => handleStyleChange('logo_glow', !styles.logo_glow)}
                  className={`w-10 h-5 rounded-full relative transition-colors ${styles.logo_glow ? 'bg-matriz-purple' : 'bg-gray-700'}`}
                >
                  <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-transform ${styles.logo_glow ? 'left-6' : 'left-1'}`}></div>
                </button>
              </div>
            </div>

            <div className="w-full h-[1px] bg-white/10"></div>

            {/* About Controls */}
            <div className="space-y-3">
              <label className="text-xs uppercase font-bold text-gray-400 block mb-2">Imagens "Sobre"</label>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">Preto e Branco (Grayscale)</span>
                <button 
                  onClick={() => handleStyleChange('about_grayscale', !styles.about_grayscale)}
                  className={`w-10 h-5 rounded-full relative transition-colors ${styles.about_grayscale ? 'bg-matriz-purple' : 'bg-gray-700'}`}
                >
                  <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-transform ${styles.about_grayscale ? 'left-6' : 'left-1'}`}></div>
                </button>
              </div>
            </div>

            <button 
              onClick={saveStyles}
              disabled={savingStyles}
              className="w-full py-3 bg-white text-black font-bold uppercase tracking-widest hover:bg-gray-200 mt-4 flex items-center justify-center gap-2 rounded-sm"
            >
              <Save size={18} /> {savingStyles ? 'Salvando...' : 'Aplicar Estilos'}
            </button>
          </div>
        </div>

        {/* COLUNA 2 & 3: Gerenciador de Arquivos (IMAGENS) */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          {assets.map((asset) => (
            <div key={asset.key} className="bg-matriz-dark border border-white/10 rounded-lg p-4 flex flex-col gap-4 relative overflow-hidden group">
               {/* Label */}
               <div className="flex items-center gap-2 z-10">
                 {asset.key === 'favicon' ? <ImageIcon size={16} className="text-matriz-purple"/> : <ImageIcon size={16} className="text-gray-500"/>}
                 <h3 className="font-bold text-white text-xs uppercase tracking-wider">{asset.label}</h3>
               </div>

               {/* Preview */}
               <div className="aspect-video bg-black/50 rounded border border-white/5 flex items-center justify-center overflow-hidden relative">
                  <img 
                    src={asset.image_url} 
                    className={`max-w-full max-h-full ${asset.key.includes('logo') || asset.key === 'favicon' ? 'object-contain p-8' : 'object-cover w-full h-full'}`}
                    alt={asset.key}
                  />
                  {uploadingKey === asset.key && (
                    <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-matriz-purple"></div>
                    </div>
                  )}
               </div>

               {/* Upload */}
               <div className="relative">
                  <input 
                    type="file" 
                    id={`file-${asset.key}`}
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files?.[0]) handleImageUpload(asset.key, e.target.files[0]);
                    }}
                    disabled={uploadingKey === asset.key}
                  />
                  <label 
                    htmlFor={`file-${asset.key}`}
                    className="w-full py-2 border border-white/10 hover:bg-white/5 text-gray-400 hover:text-white text-xs uppercase font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors"
                  >
                    <Upload size={14} /> Trocar Imagem
                  </label>
               </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default SiteAssetsManager;
