import React, { useState } from 'react';
import { supabase } from '../../src/lib/supabase';
import { Lock, LogIn } from 'lucide-react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      // Recarregar para atualizar estado e entrar no dashboard
      window.location.reload();
      
    } catch (err: any) {
      console.error(err);
      if (err.message === 'Invalid login credentials') {
        setError('E-mail ou senha incorretos.');
      } else {
        setError('Ocorreu um erro ao tentar entrar.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-matriz-black flex items-center justify-center p-4">
      <div className="bg-matriz-dark border border-white/10 p-8 rounded-lg max-w-md w-full shadow-2xl relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-20 h-20 bg-matriz-purple/10 rounded-bl-full -mr-10 -mt-10"></div>
        <div className="absolute bottom-0 left-0 w-20 h-20 bg-matriz-purple/10 rounded-tr-full -ml-10 -mb-10"></div>

        <div className="text-center mb-8 relative z-10">
          <div className="bg-matriz-purple/20 p-4 rounded-full inline-flex mb-4 text-matriz-purple border border-matriz-purple/30 shadow-[0_0_15px_rgba(139,92,246,0.2)]">
            <Lock size={32} />
          </div>
          <h2 className="text-2xl font-display font-bold text-white">
            Área Restrita
          </h2>
          <p className="text-gray-400 text-sm mt-2">Acesso Administrativo Matriz Visual</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded mb-4 text-sm text-center animate-fade-in relative z-10">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6 relative z-10">
          <div>
            <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2 font-bold">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black/50 border border-white/10 p-3 text-white focus:border-matriz-purple outline-none rounded-sm transition-all focus:shadow-[0_0_10px_rgba(139,92,246,0.3)]"
              placeholder="admin@matrizvisual.com"
              required
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2 font-bold">Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black/50 border border-white/10 p-3 text-white focus:border-matriz-purple outline-none rounded-sm transition-all focus:shadow-[0_0_10px_rgba(139,92,246,0.3)]"
              placeholder="••••••"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-matriz-purple hover:bg-purple-600 text-white font-bold uppercase tracking-widest rounded-sm transition-all hover:shadow-[0_0_20px_rgba(139,92,246,0.4)] disabled:opacity-50 flex items-center justify-center gap-2 mt-4"
          >
            {loading ? (
                'Verificando...' 
            ) : (
                <>
                    <LogIn size={18} /> Acessar Painel
                </>
            )}
          </button>
        </form>
        
        <div className="mt-8 text-center relative z-10">
            <a href="/" className="text-gray-600 hover:text-gray-400 text-xs transition-colors border-b border-transparent hover:border-gray-400 pb-0.5">
                Voltar para o site principal
            </a>
        </div>
      </div>
    </div>
  );
};

export default Login;