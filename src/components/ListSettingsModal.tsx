import { useState } from 'react';
import { X, Save, Trash2, Globe, Lock } from 'lucide-react';

export default function ListSettingsModal({ list, onClose, onUpdate, onDelete }) {
  const [title, setTitle] = useState(list.title);
  const [isPublic, setIsPublic] = useState(list.is_public || false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onUpdate(list.id, { title, is_public: isPublic });
      onClose();
    } catch (error) {
      alert("Erreur lors de la mise à jour");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-8 shadow-2xl border border-white/10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-black">Paramètres de la liste</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"><X size={20}/></button>
        </div>

        <div className="space-y-6">
          {/* Nom de la liste */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Nom de la collection</label>
            <input 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-indigo-500 outline-none font-bold"
            />
          </div>

          {/* Toggle Public/Privé */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800">
            <div className="flex items-center gap-3">
              {isPublic ? <Globe className="text-indigo-500" size={20}/> : <Lock className="text-slate-400" size={20}/>}
              <div>
                <p className="font-bold text-sm">{isPublic ? 'Liste publique' : 'Liste privée'}</p>
                <p className="text-[10px] opacity-50">Visible par les autres utilisateurs</p>
              </div>
            </div>
            <button 
              onClick={() => setIsPublic(!isPublic)}
              className={`w-12 h-6 rounded-full transition-colors relative ${isPublic ? 'bg-indigo-600' : 'bg-slate-300'}`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isPublic ? 'left-7' : 'left-1'}`} />
            </button>
          </div>

          <div className="pt-4 space-y-3">
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2"
            >
              {isSaving ? "Enregistrement..." : <><Save size={20}/> Enregistrer</>}
            </button>
            
            <button 
              onClick={() => { if(confirm("Supprimer toute la liste ?")) onDelete(list.id); }}
              className="w-full text-red-500 py-2 text-sm font-bold opacity-50 hover:opacity-100 transition-opacity"
            >
              Supprimer la collection
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}