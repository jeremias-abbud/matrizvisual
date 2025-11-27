
import React, { useState } from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import { useSiteAssets } from '../src/hooks/useSiteAssets';

const Contact: React.FC = () => {
  const { assets } = useSiteAssets();
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    contact: '',
    need: 'Criar um Logotipo/Identidade',
    details: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
        ...formData,
        [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const message = `Olá! Me chamo *${formData.name}* ${formData.company ? `da empresa *${formData.company}*` : ''}.
Gostaria de um orçamento para: *${formData.need}*.

*Meus contatos:* ${formData.contact}

*Detalhes do pedido:*
${formData.details}`;

    const whatsappUrl = `https://wa.me/5531986752884?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <footer id="contact" className="bg-matriz-black border-t border-white/10 scroll-mt-28">
      {/* Contact Section */}
      <div className="py-16 md:py-20 container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Info */}
          <div>
            <h2 className="font-display text-4xl font-bold text-white mb-2">Quer atrair mais <br/><span className="text-matriz-purple">Clientes?</span></h2>
            <p className="text-gray-400 mb-8">Mande uma mensagem e conte o que você precisa. Vamos encontrar a melhor solução para o seu orçamento.</p>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-white/5 rounded-sm text-matriz-purple">
                  <Mail size={24} />
                </div>
                <div>
                  <h4 className="text-white font-bold">Email</h4>
                  <p className="text-gray-400">agenciamatrizvisual@gmail.com</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="p-3 bg-white/5 rounded-sm text-matriz-purple">
                  <Phone size={24} />
                </div>
                <div>
                  <h4 className="text-white font-bold">WhatsApp / Telefone</h4>
                  <p className="text-gray-400">+55 (31) 98675-2884</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="p-3 bg-white/5 rounded-sm text-matriz-purple">
                  <MapPin size={24} />
                </div>
                <div>
                  <h4 className="text-white font-bold">Atendimento</h4>
                  <p className="text-gray-400">Brasil (Online)</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="bg-matriz-dark p-8 border border-white/5 relative">
            <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-matriz-purple"></div>
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-matriz-purple"></div>
            
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-gray-500">Nome</label>
                  <input 
                    type="text" 
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-black/50 border border-white/10 p-3 text-white focus:border-matriz-purple outline-none transition-colors" 
                    placeholder="Seu nome" 
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-gray-500">Nome da Empresa</label>
                  <input 
                    type="text" 
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full bg-black/50 border border-white/10 p-3 text-white focus:border-matriz-purple outline-none transition-colors" 
                    placeholder="Sua empresa" 
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-gray-500">Email ou WhatsApp</label>
                <input 
                    type="text" 
                    name="contact"
                    value={formData.contact}
                    onChange={handleChange}
                    className="w-full bg-black/50 border border-white/10 p-3 text-white focus:border-matriz-purple outline-none transition-colors" 
                    placeholder="Seu contato" 
                    required
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-gray-500">O que você precisa?</label>
                <select 
                    name="need"
                    value={formData.need}
                    onChange={handleChange}
                    className="w-full bg-black/50 border border-white/10 p-3 text-white focus:border-matriz-purple outline-none transition-colors"
                >
                  <option>Criar um Logotipo/Identidade</option>
                  <option>Criar um Site</option>
                  <option>Vídeos para Redes Sociais</option>
                  <option>Pacote Completo</option>
                  <option>Outro</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-gray-500">Detalhes do pedido</label>
                <textarea 
                    name="details"
                    value={formData.details}
                    onChange={handleChange}
                    rows={4} 
                    className="w-full bg-black/50 border border-white/10 p-3 text-white focus:border-matriz-purple outline-none transition-colors" 
                    placeholder="Me conte um pouco sobre sua ideia..."
                ></textarea>
              </div>
              
              <button type="submit" className="w-full py-4 bg-matriz-purple hover:bg-purple-600 text-white font-bold uppercase tracking-widest transition-colors duration-300">
                Solicitar Orçamento Grátis
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10 bg-black py-8">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-center items-center gap-6 text-center">
          <div className="flex flex-col md:flex-row items-center gap-2">
             <img 
               src={assets.logo_main} 
               alt="Matriz Visual" 
               className="h-8 w-auto object-contain opacity-60 hover:opacity-100 transition-opacity"
             />
            <span className="text-xs text-gray-500 md:ml-4 mt-2 md:mt-0">© {new Date().getFullYear()}. Todos os direitos reservados.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Contact;
