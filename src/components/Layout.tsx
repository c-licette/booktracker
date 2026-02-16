import { useState } from 'react';
import { Book, LayoutDashboard, Rss, User, Settings, List, Menu, X } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

export default function Layout({ children, currentView, setView, onLogout, userEmail }: any) {
  const [isOpen, setIsOpen] = useState(false); // Pour le menu mobile
  const { logout } = useAuthStore();
  const menuItems = [
    { id: 'dashboard', label: 'Tableau de bord', icon: <LayoutDashboard size={20} />},
    //{ label: 'Mes Livres', icon: <Book size={20} /> },
    { id: 'fil', label: 'Fil d’actu', icon: <Rss size={20} /> },
    { id: 'list', label: 'Mes listes', icon: <List size={20} /> },
    { id: 'profil', label: 'Profil', icon: <User size={20} /> },
  ];
return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-900 transition-colors duration-300 relative">
      
      {/* 1. L'OVERLAY (Modifié : supprimé 'lg:hidden' pour qu'il soit partout) */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 z-40 transition-opacity duration-300"
          onClick={() => setIsOpen(false)} 
        />
      )}

      {/* 2. SIDEBAR (Modifié : 'lg:fixed' pour qu'elle survole aussi sur PC quand elle s'ouvre) */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 glass-effect border-r transition-transform duration-300 ease-in-out transform
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
        /* Ici, on garde fixed même sur grand écran pour l'effet de survol */
        lg:translate-x-0 lg:fixed 
        ${!isOpen && 'lg:-translate-x-full'} 
      `}>
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="p-6 flex items-center gap-3 border-b">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">B</div>
            <span className="text-xl font-bold tracking-tight">BookTracker</span>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 p-4 space-y-2">
            {menuItems.map((item) => {
            return (
              <NavLink
                  key={item.id}
                  to={`/${item.id}`} // Ex: /dashboard ou /mes-livres
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) => `
                    w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all
                    ${isActive 
                      ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-semibold'
                      : 'hover:bg-slate-100 dark:hover:bg-slate-800 opacity-70 hover:opacity-100'}
                  `}
              >
                  {item.icon}
                  {item.label}
              </NavLink>
    );
  })}
          </nav>

          {/* User Section */}
          <div className="p-4 border-t space-y-4">
             <div className="px-4 py-2">
                <p className="text-xs uppercase tracking-wider opacity-50 font-bold">Utilisateur</p>
                <p className="text-sm truncate font-medium">{userEmail}</p>
             </div>
             <button 
               onClick={() => logout()}
               className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
             >
               <Settings size={20} />
               Déconnexion
             </button>
          </div>
        </div>
      </aside>

      {/* 3. MAIN CONTENT AREA (Modifié : ajout de 'lg:pl-0' car la sidebar ne pousse plus le contenu) */}
      <div className="flex-1 flex flex-col min-w-0 w-full">
        {/* Header (Modifié : supprimé 'lg:hidden' pour avoir le bouton burger sur PC aussi) */}
        <header className="glass-effect border-b px-4 py-3 flex items-center sticky top-0 z-30">
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className="p-2 -ml-2 mr-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <span className="font-bold tracking-tight text-indigo-600 dark:text-indigo-400">BookTracker</span>
        </header>

        <main className="flex-1 p-6 lg:p-10">
          <div className="max-w-5xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
);
}