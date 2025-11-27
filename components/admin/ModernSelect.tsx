import React, { useState, useMemo } from 'react';
import { ChevronDown, Search, Check, X } from 'lucide-react';

interface ModernSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder?: string;
  required?: boolean;
}

const ModernSelect: React.FC<ModernSelectProps> = ({ 
  label, 
  value, 
  onChange, 
  options, 
  placeholder = "Selecione uma opção",
  required = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOptions = useMemo(() => {
    return options.filter(option => 
      option.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [options, searchTerm]);

  const handleSelect = (option: string) => {
    onChange(option);
    setIsOpen(false);
    setSearchTerm(''); // Reset search
  };

  return (
    <div className="relative w-full">
      <label className="block text-gray-400 text-xs uppercase mb-1 font-bold">
        {label} {required && <span className="text-matriz-purple">*</span>}
      </label>
      
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={`w-full bg-black border ${isOpen ? 'border-matriz-purple' : 'border-white/10'} p-3 text-left text-sm rounded transition-all flex justify-between items-center hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-matriz-purple/50`}
      >
        <span className={value ? 'text-white font-medium' : 'text-gray-500'}>
          {value || placeholder}
        </span>
        <ChevronDown size={16} className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Modal / Dropdown Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          {/* Modal Content */}
          <div className="bg-matriz-dark border border-white/10 w-full max-w-md rounded-lg shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
            
            {/* Header */}
            <div className="p-4 border-b border-white/10 flex justify-between items-center bg-black/50">
              <h3 className="text-white font-display font-bold text-lg">{label}</h3>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Search Bar */}
            <div className="p-4 border-b border-white/5">
              <div className="relative">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input 
                  type="text" 
                  autoFocus
                  placeholder="Buscar..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded pl-10 pr-4 py-3 text-white text-sm focus:border-matriz-purple outline-none focus:ring-2 focus:ring-matriz-purple/50"
                />
              </div>
            </div>

            {/* Options List */}
            <div className="overflow-y-auto flex-1 p-2 custom-scrollbar bg-matriz-dark">
              {filteredOptions.length > 0 ? (
                <div className="space-y-1">
                    {/* Option to clear if not required */}
                    {!required && value && (
                         <button
                         type="button"
                         onClick={() => handleSelect('')}
                         className="w-full text-left px-4 py-3 text-red-400 hover:bg-white/5 rounded text-sm font-bold uppercase tracking-wider flex items-center gap-2"
                       >
                         <X size={14} /> Limpar Seleção
                       </button>
                    )}

                  {filteredOptions.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => handleSelect(option)}
                      className={`w-full text-left px-4 py-3 rounded transition-colors flex justify-between items-center group ${
                        value === option 
                          ? 'bg-matriz-purple text-white font-bold' 
                          : 'text-gray-300 hover:bg-matriz-purple/20'
                      }`}
                    >
                      <span className="text-sm">{option}</span>
                      {value === option && <Check size={16} />}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-gray-500 text-sm">
                  Nenhuma opção encontrada.
                </div>
              )}
            </div>
            
            <div className="p-3 bg-black/50 border-t border-white/5 text-center text-[10px] text-gray-600 uppercase tracking-widest">
                Mostrando {filteredOptions.length} opções
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModernSelect;