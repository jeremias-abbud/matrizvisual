
import React, { useState, useEffect } from 'react';
import { supabase } from '../../src/lib/supabase';
import Login from './Login';
import ProjectManager from './ProjectManager';
import LogoManager from './LogoManager';
import SiteAssetsManager from './SiteAssetsManager';
import { LogOut, LayoutGrid, Image, Settings, Palette, ArrowLeft } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const [session, setSession] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'projects' | 'logos' | 'assets' | 'settings'>('projects');
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

  return (
    <div className="min-h-screen bg-matriz-black flex flex-col md:flex-row text-white">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-matriz-dark border-r border-white/10 flex flex-col">
        <div className="p-6 border-b border-white/10 flex items-center gap-3">
             <img src="/logo.png" alt="Logo" className="h-8 w-auto object-contain" />
             <span className="font-display font-bold text-lg">Admin</span>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
            <button 
                onClick={() => setActiveTab('projects')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-sm transition-colors ${activeTab === 'projects' ? 'bg-matriz-purple text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
            >
                <LayoutGrid size={20} /> Portfólio
            </button>
            <button 
                onClick={() => setActiveTab('logos')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-sm transition-colors ${activeTab === 'logos' ? 'bg-matriz-purple text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
            >
                <Image size={20} /> Logotipos
            </button>
            <button 
                onClick={() => setActiveTab('assets')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-sm transition-colors ${activeTab === 'assets' ? 'bg-matriz-purple text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
            >
                <Palette size={20} /> Imagens do Site
            </button>
            {/* 
            <button 
                onClick={() => setActiveTab('settings')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-sm transition-colors ${activeTab === 'settings' ? 'bg-matriz-purple text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
            >
                <Settings size={20} /> Configurações
            </button>
            */}
        </nav>

        <div className="p-4 border-t border-white/10">
            <div className="text-xs text-gray-500 mb-3 truncate px-2 text-center">{session.user.email}</div>
            
            <button 
                onClick={handleExit}
                className="w-full flex items-center gap-2 px-4 py-2 text-white bg-white/5 hover:bg-white/10 rounded transition-colors mb-2 text-sm font-bold border border-white/5"
            >
                <ArrowLeft size={18} /> Voltar ao Site
            </button>

            <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-2 text-red-400 hover:bg-red-500/10 rounded transition-colors text-sm"
            >
                <LogOut size={18} /> Sair (Logout)
            </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto max-h-screen bg-black/50">
        <div className="p-8">
            {activeTab === 'projects' && <ProjectManager />}
            {activeTab === 'logos' && <LogoManager />}
            {activeTab === 'assets' && <SiteAssetsManager />}
            {activeTab === 'settings' && <div>Configurações em desenvolvimento...</div>}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
