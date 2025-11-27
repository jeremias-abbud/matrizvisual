
import React, { useState, useEffect } from 'react';
import { supabase } from '../src/lib/supabase';
import { Star } from 'lucide-react';

interface FeaturedLogo {
  id: string;
  name: string;
  url: string;
}

const FeaturedLogos: React.FC = () => {
  const [logos, setLogos] = useState<FeaturedLogo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedLogos = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('logos')
        .select('id, name, url')
        .eq('is_featured', true)
        .order('display_order', { ascending: true });
      
      if (error) {
        console.error("Error fetching featured logos:", error);
      } else if (data) {
        setLogos(data);
      }
      setLoading(false);
    };

    fetchFeaturedLogos();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-matriz-purple"></div>
      </div>
    );
  }

  if (logos.length === 0) {
    return null; // Não renderiza nada se não houver logos em destaque
  }

  return (
    <div className="mt-16 animate-fade-in">
      <div className="flex items-center gap-4 mb-8">
        <Star className="text-matriz-purple" size={24} />
        <h3 className="font-display text-2xl font-bold text-white">Logotipos em Destaque</h3>
        <div className="flex-grow h-px bg-white/10"></div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
        {logos.map(logo => (
          <div key={logo.id} className="group relative aspect-square bg-matriz-dark border border-white/5 rounded-sm flex items-center justify-center p-4 overflow-hidden transition-all duration-300 hover:border-matriz-purple/50 hover:bg-white/5">
            <img src={logo.url} alt={logo.name} className="w-full h-full object-contain opacity-70 group-hover:opacity-100 transition-all duration-500 transform group-hover:scale-110" />
            <div className="absolute bottom-2 left-0 w-full text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 px-2">
              <span className="text-[10px] uppercase tracking-widest text-matriz-purple font-bold block truncate">{logo.name}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedLogos;
