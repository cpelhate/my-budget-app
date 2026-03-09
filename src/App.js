import React, { useState, useEffect } from 'react';
import './App.css';
import { auth } from './config/firebase';
import { onAuthStateChanged } from 'firebase/auth';

import Login from './components/Login';
import Dashboard from './components/Dashboard';
import AddIncome from './components/AddIncome';
import AddExpense from './components/AddExpense';
import AddCharge from './components/AddCharge';
import Statistics from './components/Statistics';
import Settings from './components/Settings';

import { loadDataFromStorage, saveDataToStorage } from './utils/storage';
import { saveDataToFirestore, loadDataFromFirestore } from './services/firestoreService';

function App() {
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [data, setData] = useState(() => loadDataFromStorage());
  const [loading, setLoading] = useState(true);

  // Vérifier l'authentification
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        console.log('Utilisateur connecté :', currentUser.email);
        const firestoreData = await loadDataFromFirestore(currentUser.uid);
        if (firestoreData) {
          setData(firestoreData);
        }
      } else {
        console.log('Utilisateur déconnecté');
        const localData = loadDataFromStorage();
        setData(localData);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Sauvegarder les données
  useEffect(() => {
    if (loading) return;

    // Toujours sauvegarder en local
    saveDataToStorage(data);

    // Si connecté, sauvegarder aussi dans Firestore
    if (user) {
      saveDataToFirestore(user.uid, data);
    }
  }, [data, user, loading]);

  const handleLoginSuccess = () => {
    // Rien de spécial pour l’instant
  };

  // Écran de chargement
  if (loading) {
    return (
      <div className="App">
        <div className="loading-screen">
          <div className="loading-spinner"></div>
          <h2>⏳ Chargement de votre budget...</h2>
        </div>
      </div>
    );
  }

  // Écran de connexion
  if (!user) {
    return (
      <div className="App">
        <Login user={user} onLoginSuccess={handleLoginSuccess} />
      </div>
    );
  }

  // Application principale
  return (
    <div className="App">
      <header className="header">
        <div className="header-top">
          <h1>💰 Mon Budget Personnel</h1>
          <Login user={user} onLoginSuccess={handleLoginSuccess} />
        </div>
        

        <nav className="navbar">
          <button
            className={currentPage === 'dashboard' ? 'nav-btn active' : 'nav-btn'}
            onClick={() => setCurrentPage('dashboard')}
          >
            📊 Tableau de bord
          </button>
          <button
            className={currentPage === 'income' ? 'nav-btn active' : 'nav-btn'}
            onClick={() => setCurrentPage('income')}
          >
            💵 Revenus
          </button>
          <button
            className={currentPage === 'charge' ? 'nav-btn active' : 'nav-btn'}
            onClick={() => setCurrentPage('charge')}
          >
            📋 Charges
          </button>
          <button
            className={currentPage === 'expense' ? 'nav-btn active' : 'nav-btn'}
            onClick={() => setCurrentPage('expense')}
          >
            🛒 Dépenses
          </button>
          <button
            className={currentPage === 'stats' ? 'nav-btn active' : 'nav-btn'}
            onClick={() => setCurrentPage('stats')}
          >
            📈 Statistiques
          </button>
          <button
            className={currentPage === 'settings' ? 'nav-btn active' : 'nav-btn'}
            onClick={() => setCurrentPage('settings')}
          >
            ⚙️ Paramètres
          </button>
        </nav>
        </header>

      <main className="main-content">
        {currentPage === 'dashboard' && <Dashboard data={data} />}
        {currentPage === 'income' && <AddIncome data={data} setData={setData} />}
        {currentPage === 'charge' && <AddCharge data={data} setData={setData} />}
        {currentPage === 'expense' && (
          <AddExpense data={data} setData={setData} categories={data.categories} />
        )}
        {currentPage === 'stats' && <Statistics data={data} />}
        {currentPage === 'settings' && <Settings data={data} setData={setData} />}
      </main>
    </div>
  );
}

export default App;
