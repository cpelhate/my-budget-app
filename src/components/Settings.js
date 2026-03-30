import React, { useState } from 'react';
import { auth } from '../config/firebase';
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
  sendPasswordResetEmail,
} from 'firebase/auth';

function Settings({ data, setData }) {
  const user = auth.currentUser;

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [passwordMessage, setPasswordMessage] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [resetMessage, setResetMessage] = useState('');
  const [resetError, setResetError] = useState('');

  const [newCategory, setNewCategory] = useState('');

  const categories = Array.isArray(data?.categories) ? data.categories : [];

  const validatePassword = (password) => {
    const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;
    return regex.test(password);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordMessage('');
    setPasswordError('');
    setResetMessage('');
    setResetError('');

    if (!user || !user.email) {
      setPasswordError('Utilisateur non connecté.');
      return;
    }

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError('Merci de remplir tous les champs.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('La confirmation du mot de passe ne correspond pas.');
      return;
    }

    if (!validatePassword(newPassword)) {
      setPasswordError(
        'Le nouveau mot de passe doit contenir au moins 8 caractères, avec lettres, chiffres et caractère spécial.'
      );
      return;
    }

    try {
      const credential = EmailAuthProvider.credential(
        user.email,
        currentPassword
      );

      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);

      setPasswordMessage('Mot de passe mis à jour avec succès.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      setPasswordError(
        "Impossible de modifier le mot de passe. Vérifie ton mot de passe actuel."
      );
    }
  };

  const handleSendResetEmail = async () => {
    setResetMessage('');
    setResetError('');
    setPasswordMessage('');
    setPasswordError('');

    if (!user || !user.email) {
      setResetError("Aucun email utilisateur n'est disponible.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, user.email);
      setResetMessage(
        `Un email de réinitialisation a été envoyé à ${user.email}.`
      );
    } catch (error) {
      setResetError(
        "Impossible d'envoyer l'email de réinitialisation."
      );
    }
  };

  const handleAddCategory = () => {
    const trimmed = newCategory.trim();

    if (!trimmed) return;
    if (categories.includes(trimmed)) {
      setNewCategory('');
      return;
    }

    setData({
      ...data,
      categories: [...categories, trimmed],
    });

    setNewCategory('');
  };

  const handleDeleteCategory = (categoryToDelete) => {
    const updatedCategories = categories.filter(
      (cat) => cat !== categoryToDelete
    );

    setData({
      ...data,
      categories: updatedCategories,
    });
  };

  return (
    <div className="settings-page">
      <h2>⚙️ Paramètres</h2>

      <section className="settings-section">
        <h3>Informations utilisateur</h3>
        <p>
          <strong>Email :</strong> {user?.email || 'Non disponible'}
        </p>
        <p>
          <strong>UID :</strong> {user?.uid || 'Non disponible'}
        </p>
      </section>

      <section className="settings-section">
        <h3>Sécurité du compte</h3>

        <form onSubmit={handleChangePassword} className="settings-form">
          <input
            type="password"
            placeholder="Mot de passe actuel"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />

          <input
            type="password"
            placeholder="Nouveau mot de passe"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />

          <input
            type="password"
            placeholder="Confirmer le nouveau mot de passe"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <button type="submit" className="btn-primary">
            Mettre à jour le mot de passe
          </button>
        </form>

        <div style={{ marginTop: '12px' }}>
          <button
            type="button"
            className="btn-secondary"
            onClick={handleSendResetEmail}
          >
            Envoyer un email de réinitialisation
          </button>
        </div>

        {passwordMessage && (
          <p style={{ color: 'green', marginTop: '10px' }}>
            {passwordMessage}
          </p>
        )}

        {passwordError && (
          <p style={{ color: 'red', marginTop: '10px' }}>
            {passwordError}
          </p>
        )}

        {resetMessage && (
          <p style={{ color: 'green', marginTop: '10px' }}>
            {resetMessage}
          </p>
        )}

        {resetError && (
          <p style={{ color: 'red', marginTop: '10px' }}>
            {resetError}
          </p>
        )}
      </section>

      <section className="settings-section">
        <h3>Catégories de dépense</h3>

        <div className="category-add">
          <input
            type="text"
            placeholder="Nouvelle catégorie"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
          />
          <button
            type="button"
            className="btn-primary"
            onClick={handleAddCategory}
          >
            Ajouter
          </button>
        </div>

        {categories.length === 0 ? (
          <p>Aucune catégorie enregistrée.</p>
        ) : (
          <ul className="category-list">
            {categories.map((category, index) => (
              <li key={`${category}-${index}`} className="category-item">
                <span>{category}</span>
                <button
                  type="button"
                  className="btn-delete"
                  onClick={() => handleDeleteCategory(category)}
                >
                  Supprimer
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

export default Settings;
