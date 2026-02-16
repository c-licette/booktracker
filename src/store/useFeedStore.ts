import { create } from 'zustand'
import { supabase } from '../lib/supabase'

export const useFeedStore = create((set) => ({
  activities: [],
  loading: false,

  fetchGlobalFeed: async () => {
    set({ loading: true });
    
    const { data, error } = await supabase
      .from('list_books')
      .select(`
        id,
        created_at,
        status,
        books (
          title, 
          author, 
          cover_url
        ),
        lists!inner (
          title,
          is_public,
          user_id,
          profiles!inner (username) 
        )
      `)
      .eq('lists.is_public', true)
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) {
      console.error("Erreur Feed:", error);
      set({ loading: false });
      return;
    }

    set({ activities: data, loading: false });
  }
}));