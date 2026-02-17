import { useEffect } from 'react';
import { useFeedStore } from '../store/useFeedStore'; 
import { User, Clock } from 'lucide-react';

export default function FeedView() {
  const { activities, loading, fetchGlobalFeed } = useFeedStore();

  useEffect(() => {
    fetchGlobalFeed();
  }, [fetchGlobalFeed]);

  if (loading && activities.length === 0) {
    return <div className="p-10 text-center opacity-50">Chargement du fil d'actualité...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-black">Fil d'actualité</h1>
        <p className="text-slate-500">Découvrez les dernières pépites de la communauté.</p>
      </div>

      <div className="space-y-6">
        {activities.map((activity) => (
          <div key={activity.id} className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 flex gap-6 hover:shadow-md transition-shadow">
            <div className="w-20 h-28 flex-shrink-0 rounded-xl overflow-hidden shadow-md bg-slate-100">
              <img 
                src={activity.books?.cover_url} 
                className="w-full h-full object-cover" 
                alt={activity.books?.title} 
              />
            </div>
            <div className="flex flex-col justify-center">
              <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 mb-1">
                <User size={14} />
                <span className="font-black text-[10px] uppercase tracking-widest">
                  {activity.lists?.profiles?.username || "Anonyme"}
                </span>
              </div>

              <p className="text-slate-900 dark:text-white font-medium leading-tight">
                a ajouté <span className="font-bold">"{activity.books?.title}"</span> 
                <span className="text-slate-500 text-sm font-normal"> à sa liste </span>
                <span className="font-bold text-indigo-600/80">#{activity.lists?.title}</span>
              </p>

              <div className="flex items-center gap-1.5 mt-3 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                <Clock size={12} />
                <span>{new Date(activity.created_at).toLocaleDateString()}</span>
                <span>•</span>
                <span className="text-indigo-500/50">{activity.status}</span>
              </div>
            </div>
          </div>
        ))}

        {activities.length === 0 && !loading && (
          <div className="text-center py-20 opacity-50 italic">
            Aucune activité publique pour le moment.
          </div>
        )}
      </div>
    </div>
  );
}