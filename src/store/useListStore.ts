import { create } from 'zustand'
import { supabase } from '../lib/supabase'

interface List {
  id: string;
  title: string;
  is_public: boolean;
  user_id: string;
}

interface ListState {
  lists: List[];
  loading: boolean;
  fetchLists: () => Promise<void>;
  addList: (title: string, isPublic?: boolean) => Promise<void>;
}

export const useListStore = create<ListState>((set, get) => ({
  lists: [],
  loading: false,

  fetchLists: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('lists')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true });

    if (!error && data) {
      set({ lists: data, loading: false });
    } else {
      set({ loading: false });
    }
  },

  addList: async (title: string, isPublic = false) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        console.error("Pas d'utilisateur connecté");
        return;
    }

    const { error } = await supabase
      .from('lists')
      .insert([{ title, user_id: user.id, is_public: isPublic }]);

    if (!error) {
      get().fetchLists(); // On rafraîchit la liste après l'ajout
    }else{
        console.error("Erreur Supabase:", error.message);
    }
  },
  // Dans useListStore.ts
updateList: async (listId, updates) => {
  const { error } = await supabase
    .from('lists')
    .update(updates)
    .eq('id', listId);

  if (error) throw error;
  
  // Mise à jour locale de l'état pour un rendu instantané
  set((state) => ({
    lists: state.lists.map((l) => (l.id === listId ? { ...l, ...updates } : l))
  }));
},

deleteList: async (listId) => {
  const { error } = await supabase
    .from('lists')
    .delete()
    .eq('id', listId);

  if (error) throw error;
  set((state) => ({
    lists: state.lists.filter((l) => l.id !== listId)
  }));
}
}));
