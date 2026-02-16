import { create } from 'zustand'
import { supabase } from '../lib/supabase'

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true, // Commence à true pour éviter le flash du formulaire
  setUser: (user) => set({ user, loading: false }),
  setLoading: (loading) => set({ loading }),

  signUp: async (email, password, username) => {
    const { data, error } = await supabase.auth.signUp({ 
      email, 
      password,
      options:{
        data: {
          username: username,
        }
      }
    })
    if (error) throw error
    return data
  },

  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
   if (error) {
    if (error.message === 'Invalid login credentials') {
      throw new Error("L'adresse email ou le mot de passe est incorrect.");
    }
    throw error;
  }
  return data;
},

logout: async () => {
  console.log("Déconnexion en cours...");
  await supabase.auth.signOut();
  set({ user: null, loading: false }); // <-- SI CETTE LIGNE MANQUE, RIEN NE BOUGE
  console.log("Store vidé !");
}
}))