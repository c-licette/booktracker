import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { supabase } from './lib/supabase'
import { useAuthStore } from './store/useAuthStore'
import AuthForm from './components/AuthForm'
import Layout from './components/Layout'
import MyLists from './components/MyLists'
import ListView from './components/ListView'
import FeedView from './components/FeedView'

export default function App() {
  const { user, setUser, loading, setLoading } = useAuthStore()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [setUser, setLoading])

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center font-bold text-indigo-600">
        Vérification de la session...
      </div>
    )
  }

  return (
    <Routes>
      {!user ? (
        <>
          <Route path="/auth" element={<AuthForm />} />
          <Route path="*" element={<Navigate to="/auth" replace />} />
        </>
      ) : (
        <Route element={<Layout />}>
          <Route path="/list" element={<MyLists />} />
          <Route path="/dashboard" element={<div>Tableau de bord</div>} />
          <Route path="/profil" element={<div>Profil</div>} />
          <Route path="/fil" element={<FeedView />} />
          <Route path="/list/:listId" element={<ListView />} />
          <Route path="/auth" element={<Navigate to="/list" replace />} />
          <Route path="/" element={<Navigate to="/list" replace />} />
          <Route path="*" element={<Navigate to="/list" replace />} />
        </Route>
      )}
    </Routes>
  )
}