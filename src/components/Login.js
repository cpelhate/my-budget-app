import React, { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../config/firebase';

function Login({ user, onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(null);
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');

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

  const handlePasswordReset = async () => {
  try {
    await sendPasswordResetEmail(auth, resetEmail);
    alert('Email de réinitialisation envoyé !');
    setShowResetModal(false);
  } catch (error) {
    alert('Erreur : ' + error.message);
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
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                const result = validatePassword(e.target.value);
                setPasswordStrength(result);
              }}
              className={`form-input ${passwordStrength?.isValid ? 'valid' : passwordStrength?.errors.length === 0 ? '' : 'invalid'}`}
            />
            {passwordStrength && (
              <div className={`password-strength ${passwordStrength.strength}`}>
                <div className="strength-bar">
                  <div className={`bar-${passwordStrength.strength}`}></div>
                </div>
                <small>{passwordStrength.isValid ? '✅ Mot de passe valide' : passwordStrength.errors.join(', ')}</small>
              </div>
            )}
          </div>

          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? '⏳ Chargement...' : (isLogin ? '🔓 Connexion' : '✅ S\'inscrire')}
          </button>
        </form>

        <div className="login-footer">
          <a href="#" onClick={(e) => {e.preventDefault(); setShowResetModal(true);}}>
           Mot de passe oublié ?
           </a>
        </div>

        // Modal Réinitialisation du mot de passe
        {showResetModal && (
          <div className="modal-overlay">
            <div className="modal">
              <h3>Réinitialiser le mot de passe</h3>
              <input 
                type="email" 
                placeholder="Votre email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                className="form-input"
              />
              <div className="modal-actions">
                <button className="btn-secondary" onClick={() => setShowResetModal(false)}>
                  Annuler
                </button>
                <button className="btn-primary" onClick={handlePasswordReset}>
                  Envoyer
                </button>
              </div>
            </div>
          </div>
        )}

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
