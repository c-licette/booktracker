import { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { AlertCircle, Loader2 } from 'lucide-react'; 

export default function AuthForm() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [errorMsg, setErrorMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  const { signIn, signUp } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      if (isSignUp) {
        if (username.length < 3) throw new Error("Le pseudo doit faire au moins 3 caractères.");
        await signUp(email, password, username);
        alert("Inscription réussie ! Vous pouvez vous connecter.");
        setIsSignUp(false);
      } else {
        await signIn(email, password);
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-slate-50 dark:bg-slate-950">
      
      {/* En-tête avec le titre de l'App */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-black text-indigo-600 tracking-tighter mb-2">
          BookTracker
        </h1>
        <div className="h-1 w-12 bg-indigo-600 mx-auto rounded-full"></div>
      </div>

      {/* Carte du formulaire */}
      <div className="glass-card p-8 rounded-2xl w-full max-w-md space-y-6 shadow-xl border border-white/20 bg-white dark:bg-slate-900">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
            {isSignUp ? 'Créer un compte' : 'Bienvenue !'}
          </h2>
          <p className="text-sm opacity-60 mt-1 text-slate-500 dark:text-slate-400">
            Gérez votre bibliothèque personnelle
          </p>
        </div>

        {errorMsg && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-3 rounded-lg flex items-center gap-3 text-red-600 dark:text-red-400 text-sm animate-in fade-in zoom-in duration-200">
            <AlertCircle size={18} />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <input
              type="text"
              placeholder="Pseudo"
              className="input-field w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          )}
          <input 
            type="email" 
            placeholder="Email" 
            className="input-field w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent" 
            value={email}
            onChange={(e) => setEmail(e.target.value)} 
            required
          />
          <input 
            type="password" 
            placeholder="Mot de passe" 
            className="input-field w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent" 
            value={password}
            onChange={(e) => setPassword(e.target.value)} 
            required
          />
          
          <button 
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/20"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {isSignUp ? "S'inscrire" : "Se connecter"}
          </button>
        </form>

        <button 
          onClick={() => {
            setIsSignUp(!isSignUp);
            setErrorMsg(null);
          }}
          className="w-full text-sm font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
        >
          {isSignUp ? "Déjà membre ? Connexion" : "Pas encore de compte ? S'inscrire"}
        </button>
      </div>
    </div>
  );
}