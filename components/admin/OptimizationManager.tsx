
import React, { useState } from 'react';
import { supabase, uploadImage } from '../../src/lib/supabase';
import { Zap, CheckCircle, RefreshCw, AlertTriangle, ArrowRight } from 'lucide-react';

interface AssetToOptimize {
  table: 'projects' | 'logos' | 'site_assets';
  id: string;
  title: string;
  currentUrl: string;
  isWebP: boolean;
  status: 'pending' | 'processing' | 'done' | 'error';
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
              table: 'projects',
              id: p.id,
              title: `Projeto: ${p.title} (Capa)`,
              currentUrl: p.image_url,
              isWebP: p.image_url.toLowerCase().includes('.webp'),
              status: 'pending'
            });
          }
          if (p.gallery && Array.isArray(p.gallery)) {
            p.gallery.forEach((url: string, idx: number) => {
               foundAssets.push({
                table: 'projects',
                id: `${p.id}_gallery_${idx}`, // Virtual ID for gallery items
                title: `Projeto: ${p.title} (Galeria #${idx + 1})`,
                currentUrl: url,
                isWebP: url.toLowerCase().includes('.webp'),
                status: 'pending'
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
              table: 'logos',
              id: l.id,
              title: `Logo: ${l.name}`,
              currentUrl: l.url,
              isWebP: l.url.toLowerCase().includes('.webp'),
              status: 'pending'
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
              table: 'site_assets',
              id: a.key,
              title: `Asset: ${a.label}`,
              currentUrl: a.image_url,
              isWebP: a.image_url.toLowerCase().includes('.webp'),
              status: 'pending'
            });
          }
        });
      }

      setAssets(foundAssets);
      addLog(`Varredura completa. Encontrados: ${foundAssets.length} itens.`);
      const nonOptimized = foundAssets.filter(a => !a.isWebP).length;
      addLog(`Itens fora do padrão WebP: ${nonOptimized}`);

    } catch (err) {
      console.error(err);
      addLog('Erro durante a varredura.');
    } finally {
      setScanning(false);
    }
  };

  const processAsset = async (asset: AssetToOptimize) => {
    // Se for item de galeria, a lógica é complexa (precisaria atualizar array), vamos simplificar para Capas e Logos por enquanto
    if (asset.id.includes('_gallery_')) {
        addLog(`Ignorando galeria por segurança: ${asset.title}`);
        return 'skipped';
    }

    try {
      addLog(`Baixando: ${asset.title}...`);
      
      // 1. Baixar imagem original
      const response = await fetch(asset.currentUrl);
      const blob = await response.blob();
      const file = new File([blob], "temp_image", { type: blob.type });

      // 2. Upload (A função uploadImage já roda o otimizador e converte para WebP)
      addLog(`Otimizando e Convertendo: ${asset.title}...`);
      const newUrl = await uploadImage(file);

      if (!newUrl) throw new Error("Falha no upload");

      // 3. Atualizar Banco
      addLog(`Atualizando Banco de Dados...`);
      const { error } = await supabase
        .from(asset.table)
        .update(
            asset.table === 'site_assets' 
            ? { image_url: newUrl } 
            : asset.table === 'logos' 
                ? { url: newUrl } 
                : { image_url: newUrl } // projects
        )
        .eq(asset.table === 'site_assets' ? 'key' : 'id', asset.id);

      if (error) throw error;

      return 'success';

    } catch (err) {
      console.error(err);
      addLog(`Erro ao processar ${asset.title}`);
      return 'error';
    }
  };

  const runOptimization = async () => {
    if (!window.confirm("Isso irá baixar, converter para WebP e re-enviar as imagens selecionadas. Deseja continuar? Mantenha esta janela aberta.")) return;

    setProcessing(true);
    const toOptimize = assets.filter(a => !a.isWebP && !a.id.includes('_gallery_')); // Filtra o que precisa
    
    addLog(`Iniciando lote de ${toOptimize.length} imagens...`);

    for (let i = 0; i < toOptimize.length; i++) {
      const asset = toOptimize[i];
      
      setAssets(prev => prev.map(a => a.id === asset.id ? { ...a, status: 'processing' } : a));
      
      const result = await processAsset(asset);
      
      setAssets(prev => prev.map(a => a.id === asset.id ? { 
          ...a, 
          status: result === 'success' ? 'done' : 'error',
          isWebP: result === 'success' ? true : a.isWebP 
      } : a));
    }

    setProcessing(false);
    addLog('Processo finalizado.');
  };

  const pendingCount = assets.filter(a => !a.isWebP && !a.id.includes('_gallery_')).length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
            <h2 className="text-2xl font-display font-bold text-white flex items-center gap-2">
                <Zap className="text-yellow-500" /> Otimizador de Egress
            </h2>
            <p className="text-sm text-gray-400 mt-1">
                Converte imagens antigas para WebP. Isso reduz drasticamente o consumo de banda (Egress) do Supabase.
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
             {pendingCount > 0 && (
                 <button 
                    onClick={runOptimization}
                    disabled={processing}
                    className="flex items-center gap-2 px-4 py-2 rounded bg-matriz-purple text-white font-bold uppercase text-xs hover:bg-purple-600 shadow-[0_0_15px_rgba(139,92,246,0.4)]"
                 >
                    <Zap size={16} /> Otimizar {pendingCount} Itens
                 </button>
             )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* List Area */}
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
                                   <div className={`w-2 h-2 rounded-full flex-shrink-0 ${asset.isWebP ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                   <span className="truncate max-w-[200px] md:max-w-md text-gray-300" title={asset.title}>{asset.title}</span>
                                   <span className="text-xs px-2 py-0.5 bg-white/5 rounded text-gray-500 uppercase">{asset.table}</span>
                               </div>
                               <div className="flex items-center gap-4">
                                   <span className={`text-xs font-bold uppercase ${asset.isWebP ? 'text-green-500' : 'text-yellow-500'}`}>
                                       {asset.isWebP ? 'WebP (OK)' : 'JPG/PNG'}
                                   </span>
                                   {asset.status === 'processing' && <RefreshCw size={14} className="animate-spin text-matriz-purple" />}
                                   {asset.status === 'done' && <CheckCircle size={14} className="text-green-500" />}
                                   {asset.status === 'error' && <AlertTriangle size={14} className="text-red-500" />}
                               </div>
                           </div>
                       ))}
                   </div>
               )}
          </div>

          {/* Logs Area */}
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
