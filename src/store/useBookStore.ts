import { create } from 'zustand'
import { supabase } from '../lib/supabase'

export const useBookStore = create((set, get) => ({
  booksByList: {}, // Format: { [listId]: [livres] }
  loading: false,

  fetchBooksForList: async (listId: string) => {
    set({ loading: true })
    const { data, error } = await supabase
      .from('list_books')
      .select(`
        id,
        status,
        liked_count,
        books (
          id, title, author, type, cover_url, isbn
        )
      `)
      .eq('list_id', listId)

    if (!error) {
      set((state) => ({
        booksByList: { ...state.booksByList, [listId]: data },
        loading: false
      }))
    }
  },

// Dans useBookStore.ts
addBookToList: async (listId: string, bookId: string, status: string = 'à lire') => {
  const { error } = await supabase
    .from('list_books')
    .insert([{ list_id: listId, book_id: bookId, status }]);
  
  if (!error) get().fetchBooksForList(listId);
},

createAndAddBook: async (listId: string, bookData: any) => {
  
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return;
  
  // 1. Créer le livre dans le catalogue global
  const { data, error } = await supabase
    .from('books')
    .insert([{...bookData, created_by: user.id }])
    .select()
    .single();

  if (data) {
    // 2. L'ajouter à la liste de l'utilisateur
    await get().addBookToList(listId, data.id);
  }
},

updateBookStatus: async (userBookId: string, newStatus: string) => {
  const { error } = await supabase
    .from('list_books')
    .update({ status: newStatus })
    .eq('id', userBookId);

  if (error) throw error;
  //get().fetchBooksByList(currentListId); 
}, 

deleteBookFromList: async (userBookId: string) => {
  const { error } = await supabase
    .from('list_books')
    .delete()
    .eq('id', userBookId);

  if (error) {
    console.error("Erreur lors de la suppression du livre de la liste:", error);
    throw error;
  }
}



}))