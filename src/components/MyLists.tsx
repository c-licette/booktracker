import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useListStore } from '../store/useListStore';
import { Lock, LockOpen, Folder, ChevronRight, Plus } from 'lucide-react';
import AddListModal from './AddListModal';

export default function MyLists() {
  const { lists, fetchLists, addList } = useListStore();
  const [showAddList, setShowAddList] = useState(false);

  useEffect(() => { 
    fetchLists(); 
  }, [fetchLists]);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-black">Mes Collections</h1>
        <button 
          onClick={() => setShowAddList(true)}
          className="bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 transition-transform active:scale-95 shadow-lg shadow-indigo-500/20"
        >
          <Plus size={24} />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {lists.map((list) => (
          <Link 
            key={list.id} 
            to={`/list/${list.id}`}
            className="group glass-card p-6 hover:border-indigo-500 transition-all cursor-pointer border-2 border-transparent"
          >
            <div className="flex items-start justify-between">
              <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 rounded-2xl group-hover:scale-110 transition-transform">
                <Folder size={24} fill="currentColor" className="opacity-20" />
              </div>
              <ChevronRight className="opacity-20 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </div>
            <div className="mt-6">
              <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold">{list.title}</h3>
              <span className="flex-shrink-0 opacity-30 group-hover:opacity-60 transition-opacity">
                {list.is_public ? (
                  <LockOpen size={14} title="Publique" />
                ) : (
                  <Lock size={14} title="Privée" />
                )}
              </span>
              
            </div>
              <p className="text-sm opacity-50">Cliquez pour voir les livres</p>
            </div>
          </Link>
        ))}
      </div>

      {showAddList && (
        <AddListModal 
          onClose={() => setShowAddList(false)} 
          onAdd={addList} 
        />
      )}
    </div>
  );
}