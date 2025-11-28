import React, { useState, useEffect } from 'react';
import { supabase, uploadImage } from '../../src/lib/supabase';
import { Upload, RefreshCw, Save, Sliders, Monitor, Smartphone, Moon, Sun, Image as ImageIcon, Navigation, Star, Box, Link2 } from 'lucide-react';
import { useSiteAssets } from '../../src/hooks/useSiteAssets';
import type { SiteAsset } from '../../src/hooks/useSiteAssets';

type AssetKey = 'logo_navbar' | 'logo_hero' | 'logo_footer' | 'favicon' | 'about_img_1' | 'about_img_2' | 'social_share';

const SiteAssetsManager: React.FC = () => {
  const { assetsMap, loading, refreshAssets } = useSiteAssets();
  const [activeTab, setActiveTab] = useState('navbar');
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  
  // Local state for edits
  const [localAssets, setLocalAssets] = useState<Record<string, SiteAsset>>({});

  useEffect(() => {
    // Sync local state when hook data loads
    if (!loading) {
      setLocalAssets(assetsMap);
    }
  }, [loading, assetsMap]);

  const handleImageUpload = async (key: AssetKey, file: File) => {
    setUploadingKey(key);
    const publicUrl = await uploadImage(file);
    if (publicUrl) {
      const assetToUpdate = localAssets[key];
      const updatedAsset = { ...assetToUpdate, image_url: publicUrl };
      
      const { error } = await supabase
        .from('site_assets')
        .update({ image_url: publicUrl })
        .eq('key', key);
        
      if (!error) {
        setLocalAssets(prev => ({ ...prev, [key]: updatedAsset }));
      } else {
        alert('Erro ao salvar imagem.');
      }
    }
    setUploadingKey(null);
  };

  const handleStyleChange = (key: AssetKey, styleKey: string, value: any) => {
    setLocalAssets(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        style_config: {
          ...prev[key]?.style_config,
          [styleKey]: value
        }
      }
    }));
  };

  const saveAssetConfig = async (key: AssetKey) => {
    setSaving(true);
    const assetToSave = localAssets[key];
    
    if (!assetToSave) return;
    
    const { error } = await supabase
      .from('site_assets')
      .update({ style_config: assetToSave.style_config })
      .eq('key', key);
      
    if (error) {
      alert(`Erro ao salvar configurações para ${assetToSave.label}`);
    } else {
      alert(`${assetToSave.label} salvo com sucesso!`);
      refreshAssets(); // Refresh global state
    }
    setSaving(false);
  };

  const renderUploader = (key: AssetKey) => {
    const asset = localAssets[key];
    if (!asset) return null;

    return (
      <div className="bg-matriz-dark border border-white/10 rounded-lg p-4 flex flex-col gap-4 relative group">
        <h3 className="font-bold text-white text-xs uppercase tracking-wider">{asset.label}</h3>
        <div className="aspect-video bg-black/50 rounded border border-white/5 flex items-center justify-center overflow-hidden relative">
          <img 
            src={asset.image_url} 
            className="max-w-full max-h-full object-contain p-4"
            alt={asset.label}
          />
          {uploadingKey === key && (
            <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-matriz-purple"></div>
            </div>
          )}
        </div>
        <div className="relative">
          <input 
            type="file" id={`file-${key}`} accept="image/*" className="hidden"
            onChange={(e) => { if (e.target.files?.[0]) handleImageUpload(key, e.target.files[0]); }}
            disabled={uploadingKey === key}
          />
          <label htmlFor={`file-${key}`} className="w-full py-2 border border-white/10 hover:bg-white/5 text-gray-400 hover:text-white text-xs uppercase font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors">
            <Upload size={14} /> Trocar Imagem
          </label>
        </div>
      </div>
    );
  };
  
  const renderStyleEditor = (key: AssetKey, controls: ('height' | 'glow')[]) => {
     const asset = localAssets[key];
     if (!asset) return null;
     const styles = asset.style_config || {};

     return (
        <div className="bg-matriz-dark border border-white/10 p-6 rounded-lg space-y-4">
             <h3 className="font-bold text-white text-sm uppercase tracking-wider mb-4">{asset.label} - Estilos</h3>
             
             {controls.includes('height') && (
                <div className="space-y-3">
                    <label className="text-xs uppercase font-bold text-gray-400 block">Altura da Imagem (Logo)</label>
                    <div className="flex items-center gap-3">
                        <Monitor size={16} className="text-gray-500 shrink-0" title="Desktop" />
                        <input 
                            type="text" 
                            value={styles.height_desktop || ''} 
                            onChange={(e) => handleStyleChange(key, 'height_desktop', e.target.value)} 
                            className="bg-black border border-white/10 rounded px-3 py-2 text-white text-sm w-full" 
                            placeholder="Ex: 10rem ou 160px" 
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <Smartphone size={16} className="text-gray-500 shrink-0" title="Mobile" />
                        <input 
                            type="text" 
                            value={styles.height_mobile || ''} 
                            onChange={(e) => handleStyleChange(key, 'height_mobile', e.target.value)} 
                            className="bg-black border border-white/10 rounded px-3 py-2 text-white text-sm w-full" 
                            placeholder="Ex: 8rem ou 128px" 
                        />
                    </div>
                    <p className="text-xs text-gray-500 pt-1">
                        Use unidades como 'rem' ou 'px'. Isso controla a altura da imagem. Deixe em branco para usar o padrão.
                    </p>
                </div>
             )}
             
             {controls.includes('glow') && (
                <div className="flex items-center justify-between pt-2">
                    <span className="text-sm text-gray-300">Efeito Neon (Glow)</span>
                    <button onClick={() => handleStyleChange(key, 'glow', !styles.glow)} className={`w-10 h-5 rounded-full relative transition-colors ${styles.glow ? 'bg-matriz-purple' : 'bg-gray-700'}`}>
                        <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-transform ${styles.glow ? 'left-6' : 'left-1'}`}></div>
                    </button>
                </div>
             )}

             <button onClick={() => saveAssetConfig(key)} disabled={saving} className="w-full mt-4 py-2 bg-white/10 text-white font-bold text-xs uppercase tracking-widest hover:bg-matriz-purple flex items-center justify-center gap-2 rounded-sm transition-colors">
                <Save size={14} /> {saving ? 'Salvando...' : 'Salvar Estilos'}
             </button>
        </div>
     )
  }

  const TABS = [
    { id: 'navbar', label: 'Navbar', icon: <Navigation size={18} /> },
    { id: 'hero', label: 'Principal (Hero)', icon: <Star size={18} /> },
    { id: 'footer', label: 'Rodapé', icon: <Box size={18} /> },
    { id: 'about', label: 'Sobre', icon: <ImageIcon size={18} /> },
    { id: 'other', label: 'Outros', icon: <Link2 size={18} /> },
  ];

  return (
    <div>
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-display font-bold text-white">Visual do Site</h2>
            <button onClick={refreshAssets} className="p-2 bg-white/5 rounded hover:bg-white/10 text-white" disabled={loading}>
                <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
            </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-white/10 mb-8 overflow-x-auto">
            {TABS.map(tab => (
                <button 
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-3 text-sm font-bold uppercase tracking-wider border-b-2 transition-colors flex-shrink-0 ${
                        activeTab === tab.id
                        ? 'border-matriz-purple text-white'
                        : 'border-transparent text-gray-500 hover:text-white hover:border-white/20'
                    }`}
                >
                    {tab.icon} {tab.label}
                </button>
            ))}
        </div>

        {loading ? (
             <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-matriz-purple"></div></div>
        ) : (
            <div className="animate-fade-in">
                {activeTab === 'navbar' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {renderUploader('logo_navbar')}
                        {renderStyleEditor('logo_navbar', ['height'])}
                    </div>
                )}
                {activeTab === 'hero' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                         {renderUploader('logo_hero')}
                         {renderStyleEditor('logo_hero', ['height', 'glow'])}
                    </div>
                )}
                {activeTab === 'footer' && (
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                         {renderUploader('logo_footer')}
                         <div className="bg-matriz-dark border border-white/10 p-6 rounded-lg space-y-4">
                           <h3 className="font-bold text-white text-sm uppercase tracking-wider mb-4">Logo do Rodapé - Estilos</h3>
                           <div className="space-y-3">
                               <label className="text-xs uppercase font-bold text-gray-400 block">Altura do Logo</label>
                               <div className="flex items-center gap-3">
                                   <Box size={16} className="text-gray-500 shrink-0" />
                                   <input 
                                       type="text" 
                                       value={localAssets.logo_footer?.style_config?.height || ''} 
                                       onChange={(e) => handleStyleChange('logo_footer', 'height', e.target.value)} 
                                       className="bg-black border border-white/10 rounded px-3 py-2 text-white text-sm w-full" 
                                       placeholder="Ex: 2rem ou 32px" 
                                   />
                               </div>
                               <p className="text-xs text-gray-500 pt-1">
                                   Use unidades como 'rem' ou 'px'. Deixe em branco para o padrão.
                               </p>
                           </div>
                           <button onClick={() => saveAssetConfig('logo_footer')} disabled={saving} className="w-full mt-4 py-2 bg-white/10 text-white font-bold text-xs uppercase tracking-widest hover:bg-matriz-purple flex items-center justify-center gap-2 rounded-sm transition-colors">
                              <Save size={14} /> {saving ? 'Salvando...' : 'Salvar Estilos'}
                           </button>
                         </div>
                    </div>
                )}
                {activeTab === 'about' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {renderUploader('about_img_1')}
                        {renderUploader('about_img_2')}
                    </div>
                )}
                {activeTab === 'other' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {renderUploader('favicon')}
                        {renderUploader('social_share')}
                    </div>
                )}
            </div>
        )}
    </div>
  );
};

export default SiteAssetsManager;