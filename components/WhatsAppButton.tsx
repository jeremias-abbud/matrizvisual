
import React from 'react';
import { MessageCircle } from 'lucide-react';

const WhatsAppButton: React.FC = () => {
  const phoneNumber = '5531986752884';
  const message = encodeURIComponent('Olá! Vim pelo site da Matriz Visual e gostaria de solicitar um orçamento.');
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-6 left-6 z-[49] group flex items-center justify-center w-14 h-14 rounded-full bg-black/80 backdrop-blur-md border border-green-500/30 text-green-500 shadow-[0_0_15px_rgba(37,211,102,0.2)] hover:shadow-[0_0_30px_rgba(37,211,102,0.6)] hover:border-green-500 hover:bg-green-500 hover:text-black transition-all duration-300 animate-fade-in hover:-translate-y-1"
      aria-label="Falar no WhatsApp"
    >
      {/* Icon Container with Pulse */}
      <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-20 group-hover:opacity-40"></div>
      
      {/* Icon */}
      <MessageCircle size={28} strokeWidth={2.5} className="relative z-10" />
    </a>
  );
};

export default WhatsAppButton;
