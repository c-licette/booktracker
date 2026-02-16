import { useState } from 'react';
import { X, FolderPlus } from 'lucide-react';

export default function AddListModal({ onClose, onAdd }: any) {
  const [title, setTitle] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Tentative d'ajout de:", title)
    if (title.trim()) {
      onAdd(title);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="glass-card w-full max-w-sm p-6 relative animate-in fade-in zoom-in duration-200">
        <button onClick={onClose} className="absolute top-4 right-4 opacity-50 hover:opacity-100">
          <X size={20} />
        </button>
        
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 rounded-lg">
            <FolderPlus size={24} />
          </div>
          <h3 className="text-xl font-bold">Nouvelle collection</h3>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold uppercase opacity-50 ml-1">Nom de la collection</label>
            <input 
              autoFocus
              required 
              placeholder="Ex: Mangas à lire, Favoris..." 
              className="input-field mt-1" 
              value={title}
              onChange={e => setTitle(e.target.value)} 
            />
          </div>
          
          <button type="submit" className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/20">
            Créer la collection
          </button>
        </form>
      </div>
    </div>
  );
}