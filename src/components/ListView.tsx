import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom'; // Ajout de useNavigate
import { useListStore } from '../store/useListStore';
import { useBookStore } from '../store/useBookStore';
// Ajout de Globe et Lock dans les imports ci-dessous
import { Settings, ArrowLeft, Plus, Book as BookIcon, Inbox, Lock, LockOpen } from 'lucide-react';
import AddBookModal from './AddBookModal';
import BookDetailsModal from './BookDetailsModal';
import ListSettingsModal from './ListSettingsModal';

export default function ListView() {
  const { listId } = useParams();
  const navigate = useNavigate(); // Initialisation du hook de navigation
  const { lists, updateList, deleteList } = useListStore(); // Regroupement des imports du store
  const { 
    booksByList, 
    fetchBooksForList, 
    addBookToList, 
    createAndAddBook, 
    updateBookStatus, 
    deleteBookFromList 
  } = useBookStore();

  const [showAddModal, setShowAddModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);

  const currentList = lists.find(l => l.id === listId);
  const books = booksByList[listId!] || [];

  useEffect(() => {
    if (listId) fetchBooksForList(listId);
  }, [listId, fetchBooksForList]);

  if (!currentList) return <div className="p-10 text-center opacity-50">Chargement de la collection...</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link 
            to="/list" 
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors text-slate-500 hover:text-indigo-600"
          >
            <ArrowLeft size={24} />
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-black tracking-tight">{currentList.title}</h1>
            <div className="opacity-40">
              {currentList.is_public ? <LockOpen size={18} /> : <Lock size={18} />}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => setShowSettingsModal(true)}
            className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-xl transition-all"
            title="Paramètres de la liste"
          >
            <Settings size={22} />
          </button>
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/20 active:scale-95"
          >
            <Plus size={20} /> <span className="hidden sm:inline">Ajouter</span>
          </button>
        </div>
      </div>
      {books.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-6 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl space-y-4">
          <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-full text-slate-300">
            <Inbox size={48} />
          </div>
          <div className="text-center">
            <p className="text-xl font-bold opacity-80">Aucun livre pour le moment</p>
            <p className="text-sm opacity-50">Commencez à remplir votre collection.</p>
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="mt-4 flex items-center gap-2 bg-slate-900 dark:bg-white dark:text-slate-900 text-white px-6 py-3 rounded-2xl font-black hover:scale-105 transition-transform"
          >
            <Plus size={20} /> Ajouter mon premier livre
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {books.map((item: any) => (
            <div 
              key={item.id} 
              className="group cursor-pointer"
              onClick={() => setSelectedBook(item)}
            >
              <div className="aspect-[2/3] rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 shadow-sm group-hover:shadow-xl group-hover:-translate-y-2 transition-all duration-300 relative">
                {item.books.cover_url ? (
                  <img src={item.books.cover_url} alt={item.books.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center opacity-10 bg-slate-100"><BookIcon size={40}/></div>
                )}
                <div className="absolute top-3 right-3">
                  <span className="px-2 py-1 text-[10px] font-black uppercase tracking-widest bg-white/90 dark:bg-slate-900/90 backdrop-blur shadow-sm rounded-lg border border-slate-100 dark:border-slate-700">
                    {item.status || 'à lire'}
                  </span>
                </div>
              </div>
              <div className="mt-4 space-y-1">
                <h4 className="font-bold text-sm leading-tight group-hover:text-indigo-600 transition-colors line-clamp-2">{item.books.title}</h4>
                <p className="text-xs opacity-50 truncate">{item.books.author}</p>
              </div>
            </div>
          ))}
        </div>
      )}
      {showAddModal && (
        <AddBookModal 
          listId={listId!} 
          onClose={() => setShowAddModal(false)} 
          onAdd={addBookToList}
          onCreateAndAdd={createAndAddBook}
        />
      )}

      {selectedBook && (
        <BookDetailsModal 
          item={selectedBook} 
          onClose={() => setSelectedBook(null)}
          onStatusChange={async (id, status) => {
            await updateBookStatus(id, status);
            fetchBooksForList(listId!);
          }}
          onDelete={async (id) => {
            await deleteBookFromList(id);
            fetchBooksForList(listId!);
          }}
        />
      )}

      {showSettingsModal && (
        <ListSettingsModal 
          list={currentList}
          onClose={() => setShowSettingsModal(false)}
          onUpdate={updateList}
          onDelete={async (id) => {
            await deleteList(id);
            navigate('/list'); 
          }}
        />
      )}
    </div>
  );
}