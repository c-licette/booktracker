import { useState } from 'react'; 
import { X, Check, Trash2 } from 'lucide-react';

export default function BookDetailsModal({ item, onClose, onStatusChange, onDelete }) {
  const statusOptions = ['à lire', 'lu', 'en cours', 'acheté'];
  const [currentStatus, setCurrentStatus] = useState(item.status || 'à lire');
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const handleSave = async () => {
    setIsSaving(true);
    await onStatusChange(item.id, currentStatus);
    setIsSaving(false);
    onClose(); 
  };

  const handleDelete = async () => {
    if (confirm("Supprimer ce livre de votre collection ?")) {
      setIsDeleting(true);
      try {
        await onDelete(item.id);
        onClose();
      } catch (error) {
        alert("Erreur lors de la suppression");
      } finally {
        setIsDeleting(false);
      }
    }
};

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl flex flex-col md:flex-row">
        <div className="w-full md:w-1/2 bg-slate-100 dark:bg-slate-800">
          <img 
            src={item.books.cover_url} 
            className="w-full h-full object-cover min-h-[300px]" 
            alt={item.books.title}
          />
        </div>
        <div className="p-8 w-full md:w-1/2 relative flex flex-col">
          <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
            <X size={20} />
          </button>

          <h2 className="text-2xl font-bold mb-2">{item.books.title}</h2>
          <p className="text-slate-500 mb-6 italic">{item.books.author || 'Auteur inconnu'}</p>

          <div className="space-y-4 flex-grow">
            <label className="block text-sm font-semibold uppercase tracking-wider text-slate-400">
              Statut du livre
            </label>
            <select 
              value={currentStatus}
              onChange={(e) => setCurrentStatus(e.target.value)}
              className="w-full p-4 rounded-2xl border-2 border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold cursor-pointer focus:border-indigo-500 outline-none transition-all"
            >
              {statusOptions.map(opt => (
                <option 
                  key={opt} 
                  value={opt}
                  className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  {opt.charAt(0).toUpperCase() + opt.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div className="mt-8 pt-6 border-t border-slate-50 dark:border-slate-800">
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/30 transition-all active:scale-95 disabled:opacity-50"
            >
              {isSaving ? "Enregistrement..." : (
                <>
                  <Check size={20} />
                  Valider les modifications
                </>
              )}
            </button>

            <button 
              onClick={handleDelete}
              disabled={isSaving || isDeleting}
              className="w-full bg-transparent hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all"
            >
              <Trash2 size={18} />
              {isDeleting ? "Suppression..." : "Supprimer de la liste"}
            </button>
            
            <p className="mt-4 text-[10px] text-slate-400 text-center uppercase tracking-widest">
              Ajouté le {new Date(item.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}