
import React, { useState, useEffect } from 'react';
import { supabase } from '../../src/lib/supabase';
import Login from './Login';
import ProjectManager from './ProjectManager';
import LogoManager from './LogoManager';
import SiteAssetsManager from './SiteAssetsManager';
import OptimizationManager from './OptimizationManager';
import { LogOut, LayoutGrid, Palette, ArrowLeft, Grid, Zap, Monitor, Video, Users } from 'lucide-react';
import { ProjectCategory } from '../../types';

const AdminDashboard: React.FC = () => {
  const [session, setSession] = useState<any>(null);
  // Novos estados para navegação granular
  const [activeTab, setActiveTab] = useState<'overview' | 'logos' | 'sites' | 'design' | 'video' | 'models' | 'assets' | 'optimization'>('overview');
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setCheckingAuth(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/'; // Redirect to home
  };

  const handleExit = () => {
    window.location.hash = ''; // Just clear the hash to go back to main site
  };

  if (checkingAuth) return <div className="min-h-screen bg-matriz-black flex items-center justify-center text-white">Carregando...</div>;

  if (!session) {
    return <Login />;
  }

  const MenuButton = ({ id, label, icon: Icon, active }: { id: string, label: string, icon: any, active: boolean }) => (
    <button 
        onClick={() => setActiveTab(id as any)}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-sm transition-colors text-sm font-medium ${
            active 
            ? 'bg-matriz-purple text-white shadow-[0_0_15px_rgba(139,92,246,0.3)]' 
            : 'text-gray-400 hover:bg-white/5 hover:text-white'
        }`}
    >
        <Icon size={18} /> {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-matriz-black flex flex-col md:flex-row text-white">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-matriz-dark border-r border-white/10 flex flex-col h-screen sticky top-0">
        <div className="p-6 border-b border-white/10 flex flex-col justify-center min-h-[80px]">
             {/* TEXT ONLY HEADER - No Image */}
             <h1 className="font-display font-bold text-xl text-white tracking-wide">Matriz Visual</h1>
             <p className="text-xs text-matriz-purple font-bold uppercase tracking-widest mt-1">Painel Admin</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto custom-scrollbar">
            <div className="text-[10px] uppercase tracking-widest text-gray-600 font-bold px-4 mb-2 mt-2">Portfólio</div>
            
            <MenuButton id="overview" label="Visão Geral (Tudo)" icon={LayoutGrid} active={activeTab === 'overview'} />
            <MenuButton id="logos" label="Logotipos" icon={Grid} active={activeTab === 'logos'} />
            <MenuButton id="sites" label="Websites" icon={Monitor} active={activeTab === 'sites'} />
            <MenuButton id="design" label="Design Gráfico" icon={Palette} active={activeTab === 'design'} />
            <MenuButton id="video" label="Vídeos" icon={Video} active={activeTab === 'video'} />
            <MenuButton id="models" label="Personagens" icon={Users} active={activeTab === 'models'} />

            <div className="w-full h-px bg-white/5 my-4"></div>
            
            <div className="text-[10px] uppercase tracking-widest text-gray-600 font-bold px-4 mb-2">Configurações</div>
            <MenuButton id="assets" label="Visual do Site" icon={Palette} active={activeTab === 'assets'} />
            <MenuButton id="optimization" label="Otimização" icon={Zap} active={activeTab === 'optimization'} />
        </nav>

        <div className="p-4 border-t border-white/10 bg-black/20">
            <div className="text-xs text-gray-500 mb-3 truncate px-2 text-center">{session.user.email}</div>
            
            <button 
                onClick={handleExit}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 text-white bg-white/5 hover:bg-white/10 rounded transition-colors mb-2 text-sm font-bold border border-white/5"
            >
                <ArrowLeft size={16} /> Voltar ao Site
            </button>

            <button 
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 text-red-400 hover:bg-red-500/10 rounded transition-colors text-sm"
            >
                <LogOut size={16} /> Sair
            </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto max-h-screen bg-black/50 scroll-smooth">
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
            {/* O ProjectManager agora é reutilizado com filtros específicos */}
            {activeTab === 'overview' && <ProjectManager />}
            
            {/* Gerenciador de Logotipos Dedicado (Tabela Logos) */}
            {activeTab === 'logos' && <LogoManager />}
            
            {/* Gerenciadores Específicos (Tabela Projects com Filtro) */}
            {activeTab === 'sites' && <ProjectManager forcedCategory={ProjectCategory.WEB} />}
            {activeTab === 'design' && <ProjectManager forcedCategory={ProjectCategory.DESIGN} />}
            {activeTab === 'video' && <ProjectManager forcedCategory={ProjectCategory.VIDEO} />}
            {activeTab === 'models' && <ProjectManager forcedCategory={ProjectCategory.MODELS} />}
            
            {/* Outros */}
            {activeTab === 'assets' && <SiteAssetsManager />}
            {activeTab === 'optimization' && <OptimizationManager />}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
