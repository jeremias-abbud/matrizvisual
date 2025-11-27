import React, { useState } from 'react';
import { supabase } from '../../src/lib/supabase';
import { Lock } from 'lucide-react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError('Erro ao entrar. Verifique suas credenciais.');
    } else {
        // Reload to trigger auth state change in App or Dashboard
        window.location.reload();
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-matriz-black flex items-center justify-center p-4">
      <div className="bg-matriz-dark border border-white/10 p-8 rounded-lg max-w-md w-full shadow-2xl">
        <div className="text-center mb-8">
          <div className="bg-matriz-purple/20 p-4 rounded-full inline-flex mb-4 text-matriz-purple">
            <Lock size={32} />
          </div>
          <h2 className="text-2xl font-display font-bold text-white">Área Administrativa</h2>
          <p className="text-gray-400 text-sm mt-2">Matriz Visual</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded mb-4 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black/50 border border-white/10 p-3 text-white focus:border-matriz-purple outline-none rounded-sm transition-colors"
              required
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black/50 border border-white/10 p-3 text-white focus:border-matriz-purple outline-none rounded-sm transition-colors"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-matriz-purple hover:bg-purple-600 text-white font-bold uppercase tracking-widest rounded-sm transition-colors disabled:opacity-50"
          >
            {loading ? 'Entrando...' : 'Acessar Painel'}
          </button>
        </form>
        
        <div className="mt-6 text-center">
            <a href="/" className="text-gray-500 hover:text-white text-sm underline">Voltar para o site</a>
        </div>
      </div>
    </div>
  );
};

export default Login;