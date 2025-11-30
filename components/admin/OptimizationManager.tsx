import React, { useState } from 'react';
import { supabase, uploadImage } from '../../src/lib/supabase';
import { Zap, CheckCircle, RefreshCw, AlertTriangle, ArrowLeft } from 'lucide-react';
import { convertWebPToPNG } from '../../src/lib/imageOptimizer';

interface AssetToOptimize {
  table: 'projects' | 'logos' | 'site_assets';
  id: string; // ID ou Key do registro
  title: string;
  currentUrl: string;
  isWebP: boolean;
  status: 'pending' | 'processing' | 'done' | 'error';
  // Campos extras para atualização de arrays (galeria)
  itemIndex?: number; // Índice do item na galeria
  originalRecord?: any; // O registro original completo
}

const OptimizationManager: React.FC = () => {
  const [assets, setAssets] = useState<AssetToOptimize[]>([]);
  const [scanning, setScanning] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (msg: string) => setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev]);

  const scanAssets = async () => {
    setScanning(true);
    setAssets([]);
    setLogs([]);
    addLog('Iniciando varredura...');

    try {
      const foundAssets: AssetToOptimize[] = [];

      // 1. Scan Projects
      const { data: projects } = await supabase.from('projects').select('id, title, image_url, gallery');
      if (projects) {
        projects.forEach(p => {
          if (p.image_url) {
            foundAssets.push({
              table: 'projects', id: p.id, title: `Projeto: ${p.title} (Capa)`,
              currentUrl: p.image_url, isWebP: p.image_url.toLowerCase().endsWith('.webp'), status: 'pending'
            });
          }
          if (p.gallery && Array.isArray(p.gallery)) {
            p.gallery.forEach((url: string, idx: number) => {
               foundAssets.push({
                table: 'projects', id: p.id, title: `Projeto: ${p.title} (Galeria #${idx + 1})`,
                currentUrl: url, isWebP: url.toLowerCase().endsWith('.webp'), status: 'pending',
                itemIndex: idx, originalRecord: p
              });
            });
          }
        });
      }

      // 2. Scan Logos
      const { data: logos } = await supabase.from('logos').select('id, name, url');
      if (logos) {
        logos.forEach(l => {
          if (l.url) {
            foundAssets.push({
              table: 'logos', id: l.id, title: `Logo: ${l.name}`,
              currentUrl: l.url, isWebP: l.url.toLowerCase().endsWith('.webp'), status: 'pending'
            });
          }
        });
      }

      // 3. Scan Site Assets
      const { data: siteAssets } = await supabase.from('site_assets').select('key, label, image_url');
      if (siteAssets) {
        siteAssets.forEach(a => {
          if (a.image_url) {
            foundAssets.push({
              table: 'site_assets', id: a.key, title: `Asset: ${a.label}`,
              currentUrl: a.image_url, isWebP: a.image_url.toLowerCase().endsWith('.webp'), status: 'pending'
            });
          }
        });
      }

      setAssets(foundAssets);
      addLog(`Varredura completa. Encontrados: ${foundAssets.length} itens.`);
      const nonOptimized = foundAssets.filter(a => !a.isWebP).length;
      addLog(`Itens que podem ser otimizados (não-WebP): ${nonOptimized}`);

    } catch (err) {
      console.error(err);
      addLog('Erro durante a varredura.');
    } finally {
      setScanning(false);
    }
  };

  const processAsset = async (asset: AssetToOptimize, reverseToPng = false) => {
     setAssets(prev => prev.map(a => a.currentUrl === asset.currentUrl ? { ...a, status: 'processing' } : a));
    
    try {
        addLog(`Processando: ${asset.title}...`);
        
        let fileToUpload: File | null;
        if (reverseToPng) {
            addLog('Revertendo para PNG...');
            fileToUpload = await convertWebPToPNG(asset.currentUrl);
        } else {
            addLog('Otimizando para WebP...');
            const response = await fetch(asset.currentUrl);
            const blob = await response.blob();
            fileToUpload = new File([blob], "temp_image", { type: blob.type });
        }
        
        if (!fileToUpload) throw new Error("Falha ao preparar arquivo.");

        // Upload, pulando otimização se for reversão para PNG
        const newUrl = await uploadImage(fileToUpload, reverseToPng);
        if (!newUrl) throw new Error("Falha no upload");

        addLog(`Atualizando banco de dados...`);
        let error;

        // Lógica de atualização
        if (asset.itemIndex !== undefined && asset.originalRecord) { // É item de galeria
            const updatedGallery = [...asset.originalRecord.gallery];
            updatedGallery[asset.itemIndex] = newUrl;
            ({ error } = await supabase.from('projects').update({ gallery: updatedGallery }).eq('id', asset.id));
        } else { // É um campo simples
            const fieldToUpdate = asset.table === 'logos' ? 'url' : 'image_url';
            ({ error } = await supabase.from(asset.table).update({ [fieldToUpdate]: newUrl }).eq(asset.table === 'site_assets' ? 'key' : 'id', asset.id));
        }

        if (error) throw error;
        
        addLog(`Sucesso: ${asset.title}`);
        setAssets(prev => prev.map(a => a.currentUrl === asset.currentUrl ? { ...a, status: 'done', isWebP: !reverseToPng, currentUrl: newUrl } : a));
    } catch (err) {
        console.error(err);
        addLog(`Erro ao processar ${asset.title}`);
        setAssets(prev => prev.map(a => a.currentUrl === asset.currentUrl ? { ...a, status: 'error' } : a));
    }
  };
  
  const runOptimizationBatch = async () => {
    const toOptimize = assets.filter(a => !a.isWebP);
    if (toOptimize.length === 0 || !window.confirm(`Isso irá converter ${toOptimize.length} imagem(ns) para WebP. Deseja continuar?`)) return;

    setProcessing(true);
    addLog(`Iniciando lote de otimização para ${toOptimize.length} imagens...`);
    for (const asset of toOptimize) {
        await processAsset(asset, false);
    }
    setProcessing(false);
    addLog('Processo de otimização em lote finalizado.');
  };

  const toOptimizeCount = assets.filter(a => !a.isWebP).length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
            <h2 className="text-2xl font-display font-bold text-white flex items-center gap-2">
                <Zap className="text-yellow-500" /> Otimizador de Imagens
            </h2>
            <p className="text-sm text-gray-400 mt-1">
                Converta imagens para WebP para economizar banda ou reverta para PNG se necessário.
            </p>
        </div>
        <div className="flex gap-3">
             <button 
                onClick={scanAssets}
                disabled={scanning || processing}
                className="flex items-center gap-2 px-4 py-2 rounded bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold uppercase text-xs"
             >
                <RefreshCw size={16} className={scanning ? 'animate-spin' : ''} /> Escanear Imagens
             </button>
             {toOptimizeCount > 0 && (
                 <button 
                    onClick={runOptimizationBatch}
                    disabled={processing}
                    className="flex items-center gap-2 px-4 py-2 rounded bg-matriz-purple text-white font-bold uppercase text-xs hover:bg-purple-600 shadow-[0_0_15px_rgba(139,92,246,0.4)]"
                 >
                    <Zap size={16} /> Otimizar {toOptimizeCount} Itens
                 </button>
             )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-matriz-dark border border-white/10 rounded-lg p-4 h-[600px] overflow-y-auto custom-scrollbar">
               {assets.length === 0 ? (
                   <div className="h-full flex flex-col items-center justify-center text-gray-500 gap-4 opacity-50">
                       <Zap size={48} />
                       <p>Clique em Escanear para buscar imagens.</p>
                   </div>
               ) : (
                   <div className="space-y-2">
                       {assets.map((asset, idx) => (
                           <div key={`${asset.id}-${idx}`} className="flex items-center justify-between p-3 bg-black/40 rounded border border-white/5 text-sm">
                               <div className="flex items-center gap-3 overflow-hidden">
                                   <div className={`w-2 h-2 rounded-full flex-shrink-0 ${asset.isWebP ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                                   <span className="truncate max-w-[200px] md:max-w-md text-gray-300" title={asset.title}>{asset.title}</span>
                               </div>
                               <div className="flex items-center gap-4">
                                   {asset.isWebP ? (
                                     <button onClick={() => processAsset(asset, true)} disabled={processing} className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 disabled:opacity-50">
                                       <ArrowLeft size={12}/> Reverter p/ PNG
                                     </button>
                                   ) : (
                                     <button onClick={() => processAsset(asset, false)} disabled={processing} className="text-xs text-green-400 hover:text-green-300 disabled:opacity-50">
                                       Otimizar p/ WebP
                                     </button>
                                   )}
                                   {asset.status === 'processing' && <RefreshCw size={14} className="animate-spin text-matriz-purple" />}
                                   {asset.status === 'done' && <CheckCircle size={14} className="text-green-500" />}
                                   {asset.status === 'error' && <AlertTriangle size={14} className="text-red-500" />}
                               </div>
                           </div>
                       ))}
                   </div>
               )}
          </div>

          <div className="bg-black border border-white/10 rounded-lg p-4 h-[600px] overflow-y-auto custom-scrollbar font-mono text-xs">
              <h3 className="text-gray-400 uppercase font-bold mb-4 sticky top-0 bg-black pb-2 border-b border-white/10">Logs do Processo</h3>
              <div className="space-y-1">
                  {logs.map((log, i) => (
                      <div key={i} className="text-gray-500 border-b border-white/5 pb-1 mb-1">{log}</div>
                  ))}
                  {logs.length === 0 && <span className="text-gray-700">Aguardando início...</span>}
              </div>
          </div>
      </div>
    </div>
  );
};

export default OptimizationManager;
