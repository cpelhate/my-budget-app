import React, { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '../config/firebase';

function Login({ user, onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAuth = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        // Connexion
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        // Inscription
        await createUserWithEmailAndPassword(auth, email, password);
      }
      setEmail('');
      setPassword('');
      onLoginSuccess();
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        setError('Cet email est déjà utilisé');
      } else if (err.code === 'auth/wrong-password') {
        setError('Mot de passe incorrect');
      } else if (err.code === 'auth/user-not-found') {
        setError('Cet email n\'existe pas');
      } else if (err.code === 'auth/weak-password') {
        setError('Le mot de passe doit avoir au moins 6 caractères');
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      onLoginSuccess();
    } catch (err) {
      setError(err.message);
    }
  };

  if (user) {
    return (
      <div className="auth-container user-info">
        <div className="user-display">
          <p>👤 Connecté : <strong>{user.email}</strong></p>
          <button onClick={handleLogout} className="btn btn-danger">
            🚪 Se déconnecter
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>{isLogin ? '🔐 Se connecter' : '📝 S\'inscrire'}</h2>
        
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleAuth} className="form">
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="votre@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Mot de passe</label>
            <input
              type="password"
              placeholder="Minimum 6 caractères"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? '⏳ Chargement...' : (isLogin ? '🔓 Connexion' : '✅ S\'inscrire')}
          </button>
        </form>

        <p className="auth-toggle">
          {isLogin ? "Pas encore inscrit ? " : "Déjà inscrit ? "}
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="toggle-btn"
          >
            {isLogin ? 'S\'inscrire' : 'Se connecter'}
          </button>
        </p>
      </div>
    </div>
  );
}

export default Login;
