import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Search, Plus, BookPlus, X, Check } from 'lucide-react';

export default function AddBookModal({ listId, onClose, onAdd, onCreateAndAdd }: any) {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [showManualForm, setShowManualForm] = useState(false);
  const [formData, setFormData] = useState({ title: '', author: '', type: 'Roman', cover_url: '', isbn: '' });

  // Recherche en temps réel dans la table 'books'
  useEffect(() => {
    const searchBooks = async () => {
      if (searchTerm.length < 2) {
        setResults([]);
        return;
      }
      const { data } = await supabase
        .from('books')
        .select('*')
        .or(`title.ilike.%${searchTerm}%,author.ilike.%${searchTerm}%`)
        .limit(5);
      setResults(data || []);
    };
    const timer = setTimeout(searchBooks, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="glass-card w-full max-w-md p-6 relative overflow-hidden">
        <button onClick={onClose} className="absolute top-4 right-4 opacity-50"><X /></button>
        
        {!showManualForm ? (
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Ajouter un livre</h3>
            <div className="relative">
              <Search className="absolute left-3 top-3 opacity-30" size={20} />
              <input 
                autoFocus
                placeholder="Chercher un titre ou un auteur..."
                className="input-field pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Résultats de recherche */}
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {results.map(book => (
                <button 
                  key={book.id}
                  onClick={() => { onAdd(listId, book.id); onClose(); }}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-900/20 text-left transition-all border border-transparent hover:border-indigo-200"
                >
                  <div className="w-10 h-14 bg-slate-100 rounded overflow-hidden flex-shrink-0">
                    {book.cover_url && <img src={book.cover_url} className="object-cover w-full h-full" />}
                  </div>
                  <div>
                    <p className="font-bold text-sm line-clamp-1">{book.title}</p>
                    <p className="text-xs opacity-50">{book.author}</p>
                  </div>
                  <Plus size={18} className="ml-auto text-indigo-600" />
                </button>
              ))}

              {searchTerm.length >= 2 && (
                <button 
                  onClick={() => {
                    setFormData({ ...formData, title: searchTerm });
                    setShowManualForm(true);
                  }}
                  className="w-full p-4 border-2 border-dashed rounded-xl text-sm font-bold text-indigo-600 flex items-center justify-center gap-2 hover:bg-indigo-50"
                >
                  <BookPlus size={18} /> " {searchTerm} " n'est pas là ? Créez-le.
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Formulaire de création manuelle */
          <form onSubmit={(e) => { 
            e.preventDefault(); 
            onCreateAndAdd(listId, formData); 
            onClose(); 
          }} className="space-y-4 animate-in slide-in-from-right-4 duration-300">
            <h3 className="text-xl font-bold">Nouveau dans le catalogue</h3>
            <input required placeholder="Titre" className="input-field" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
            <input required placeholder="Auteur" className="input-field" value={formData.author} onChange={e => setFormData({...formData, author: e.target.value})} />
            <select className="input-field" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
              <option value="Roman">Roman</option>
              <option value="Manga">Manga</option>
              <option value="BD">BD</option>
            </select>
            <input required placeholder="URL de couverture" className="input-field" value={formData.cover_url} onChange={e => setFormData({...formData, cover_url: e.target.value})} />
            <input required placeholder="Code ISBN" className="input-field" value={formData.isbn} onChange={e => setFormData({...formData, isbn: e.target.value})} />
            <div className="flex gap-2">
              <button type="button" onClick={() => setShowManualForm(false)} className="flex-1 py-3 bg-slate-100 dark:bg-slate-800 rounded-xl font-bold">Retour</button>
              <button type="submit" className="flex-[2] py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/20">Enregistrer et ajouter</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}