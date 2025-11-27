import React from 'react';
import { Mail, Phone, MapPin, Instagram, Linkedin, Twitter } from 'lucide-react';

const Contact: React.FC = () => {
  return (
    <footer id="contact" className="bg-matriz-black border-t border-white/10 scroll-mt-28">
      {/* Contact Section */}
      <div className="py-24 container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* Info */}
          <div>
            <h2 className="font-display text-4xl font-bold text-white mb-2">Vamos criar algo <br/><span className="text-matriz-purple">Extraordinário?</span></h2>
            <p className="text-gray-400 mb-10">Conte-nos sobre seu projeto. Estamos prontos para materializar suas ideias.</p>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-white/5 rounded-sm text-matriz-purple">
                  <Mail size={24} />
                </div>
                <div>
                  <h4 className="text-white font-bold">Email</h4>
                  <p className="text-gray-400">contato@matrizvisual.com</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="p-3 bg-white/5 rounded-sm text-matriz-purple">
                  <Phone size={24} />
                </div>
                <div>
                  <h4 className="text-white font-bold">Telefone</h4>
                  <p className="text-gray-400">+55 (11) 99999-9999</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="p-3 bg-white/5 rounded-sm text-matriz-purple">
                  <MapPin size={24} />
                </div>
                <div>
                  <h4 className="text-white font-bold">Localização</h4>
                  <p className="text-gray-400">São Paulo, SP - Brasil</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="bg-matriz-dark p-8 border border-white/5 relative">
            <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-matriz-purple"></div>
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-matriz-purple"></div>
            
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-gray-500">Nome</label>
                  <input type="text" className="w-full bg-black/50 border border-white/10 p-3 text-white focus:border-matriz-purple outline-none transition-colors" placeholder="Seu nome" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-gray-500">Empresa</label>
                  <input type="text" className="w-full bg-black/50 border border-white/10 p-3 text-white focus:border-matriz-purple outline-none transition-colors" placeholder="Sua empresa" />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-gray-500">Email</label>
                <input type="email" className="w-full bg-black/50 border border-white/10 p-3 text-white focus:border-matriz-purple outline-none transition-colors" placeholder="seu@email.com" />
              </div>
              
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-gray-500">Serviço de Interesse</label>
                <select className="w-full bg-black/50 border border-white/10 p-3 text-white focus:border-matriz-purple outline-none transition-colors">
                  <option>Design Gráfico</option>
                  <option>Desenvolvimento Web</option>
                  <option>Vídeo & Motion</option>
                  <option>Outro</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-gray-500">Mensagem</label>
                <textarea rows={4} className="w-full bg-black/50 border border-white/10 p-3 text-white focus:border-matriz-purple outline-none transition-colors" placeholder="Descreva seu projeto..."></textarea>
              </div>
              
              <button type="submit" className="w-full py-4 bg-matriz-purple hover:bg-purple-600 text-white font-bold uppercase tracking-widest transition-colors duration-300">
                Enviar Mensagem
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10 bg-black py-8">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="font-display font-bold text-lg text-white">MATRIZ</span>
            <span className="text-xs text-gray-500">© 2024. Todos os direitos reservados.</span>
          </div>
          
          <div className="flex space-x-6">
            <a href="#" className="text-gray-500 hover:text-white transition-colors"><Instagram size={20} /></a>
            <a href="#" className="text-gray-500 hover:text-white transition-colors"><Linkedin size={20} /></a>
            <a href="#" className="text-gray-500 hover:text-white transition-colors"><Twitter size={20} /></a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Contact;