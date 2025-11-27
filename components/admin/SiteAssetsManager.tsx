
import React, { useState, useEffect } from 'react';
import { supabase, uploadImage } from '../../src/lib/supabase';
import { Upload, Save, RefreshCw } from 'lucide-react';

interface AssetRow {
  key: string;
  label: string;
  image_url: string;
}

const SiteAssetsManager: React.FC = () => {
  const [assets, setAssets] = useState<AssetRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);

  useEffect(() => {
    fetchAssets();
  }, []);

  const fetchAssets = async () => {
    setLoading(true);
    // Busca os assets do banco. Se a tabela estiver vazia, usamos uma lista base para permitir o primeiro upload.
    const { data } = await supabase.from('site_assets').select('*').order('key');
    
    if (data && data.length > 0) {
      setAssets(data);
    } else {
      // Se não tiver nada no banco, inicializa com a estrutura padrão para o usuário poder editar
      setAssets([
        { key: 'logo_main', label: 'Logo Principal (Navbar e Hero)', image_url: '/logo.png' },
        { key: 'about_img_1', label: 'Imagem Sobre Nós (Topo/Esq)', image_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop' },
        { key: 'about_img_2', label: 'Imagem Sobre Nós (Baixo/Dir)', image_url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=600&auto=format&fit=crop' },
        { key: 'social_share', label: 'Imagem Compartilhamento Social', image_url: '/social-share.jpg' },
      ]);
    }
    setLoading(false);
  };

  const handleImageUpload = async (key: string, file: File) => {
    setUploadingKey(key);
    
    // 1. Otimiza e faz Upload
    const publicUrl = await uploadImage(file);

    if (publicUrl) {
      // 2. Atualiza ou Insere no banco (Upsert)
      const assetToUpdate = assets.find(a => a.key === key);
      
      const { error } = await supabase
        .from('site_assets')
        .upsert({ 
          key: key, 
          image_url: publicUrl,
          label: assetToUpdate?.label || key 
        });

      if (error) {
        alert('Erro ao atualizar imagem no banco.');
        console.error(error);
      } else {
        // Atualiza estado local
        setAssets(prev => prev.map(a => a.key === key ? { ...a, image_url: publicUrl } : a));
      }
    } else {
      alert('Erro no upload da imagem.');
    }
    setUploadingKey(null);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-display font-bold text-white">Imagens do Site</h2>
        <button 
          onClick={fetchAssets}
          className="p-2 bg-white/5 rounded hover:bg-white/10 text-white transition-colors"
          title="Atualizar lista"
        >
          <RefreshCw size={20} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {assets.map((asset) => (
          <div key={asset.key} className="bg-matriz-dark border border-white/10 rounded-lg p-4 flex flex-col gap-4">
            <div className="flex justify-between items-start">
              <h3 className="font-bold text-white text-sm uppercase tracking-wider">{asset.label}</h3>
              <span className="text-xs text-gray-500 font-mono">{asset.key}</span>
            </div>

            {/* Preview Area */}
            <div className="aspect-video bg-black/50 rounded border border-white/5 flex items-center justify-center overflow-hidden relative group">
              <img 
                src={asset.image_url} 
                alt={asset.label} 
                className={`max-w-full max-h-full object-contain ${asset.key === 'logo_main' ? 'p-8' : ''}`}
              />
              
              {/* Overlay Loader */}
              {uploadingKey === asset.key && (
                <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-10">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-matriz-purple"></div>
                </div>
              )}
            </div>

            {/* Upload Control */}
            <div className="relative">
              <input 
                type="file" 
                id={`file-${asset.key}`}
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    handleImageUpload(asset.key, e.target.files[0]);
                  }
                }}
                disabled={uploadingKey === asset.key}
              />
              <label 
                htmlFor={`file-${asset.key}`}
                className={`w-full flex items-center justify-center gap-2 py-3 border border-dashed border-white/20 rounded cursor-pointer hover:bg-white/5 hover:border-matriz-purple transition-all ${uploadingKey === asset.key ? 'opacity-50 pointer-events-none' : ''}`}
              >
                <Upload size={18} className="text-matriz-purple" />
                <span className="text-sm text-gray-300 font-bold uppercase">Trocar Imagem</span>
              </label>
            </div>
            
            <p className="text-xs text-gray-500 text-center">
                A imagem será otimizada automaticamente (Max 300KB).
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SiteAssetsManager;
