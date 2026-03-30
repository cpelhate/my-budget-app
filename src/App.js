import React, { useState, useEffect, useRef } from 'react';
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
  const [saveStatus, setSaveStatus] = useState(''); // '', 'saving', 'saved'
  const debounceTimer = useRef(null);
  const isFirstLoad = useRef(true);

  // Authentification
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const firestoreData = await loadDataFromFirestore(currentUser.uid);
        if (firestoreData) {
          setData(firestoreData);
        }
      } else {
        setData(loadDataFromStorage());
      }
      setLoading(false);
      isFirstLoad.current = true;
    });
    return unsubscribe;
  }, []);

  // Auto-save avec debounce à chaque changement de données
  useEffect(() => {
    if (loading) return;

    // Toujours sauvegarder en local
    saveDataToStorage(data);

    // Éviter la sauvegarde au premier chargement
    if (isFirstLoad.current) {
      isFirstLoad.current = false;
      return;
    }

    // Si connecté, auto-save dans Firebase avec debounce 800ms
    if (user) {
      setSaveStatus('saving');

      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }

      debounceTimer.current = setTimeout(async () => {
        await saveDataToFirestore(user.uid, data);
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus(''), 2000);
      }, 800);
    }

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [data, user, loading]);

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Chargement...</p>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return (
    <div className="App">
      <header className="header">
        <div className="header-top">
          <h1>💰 Mon Budget Personnel</h1>
          <div className="user-info">
            {saveStatus === 'saving' && (
              <span className="save-status saving">⏳ Sauvegarde...</span>
            )}
            {saveStatus === 'saved' && (
              <span className="save-status saved">✅ Sauvegardé</span>
            )}
            <p>👤 {user.email}</p>
            <button
              className="btn-logout"
              onClick={() => auth.signOut()}
            >
              Déconnexion
            </button>
          </div>
        </div>

        <nav className="navbar">
          <button className={currentPage === 'dashboard' ? 'nav-btn active' : 'nav-btn'} onClick={() => setCurrentPage('dashboard')}>📊 Tableau de bord</button>
          <button className={currentPage === 'income' ? 'nav-btn active' : 'nav-btn'} onClick={() => setCurrentPage('income')}>💵 Revenus</button>
          <button className={currentPage === 'charge' ? 'nav-btn active' : 'nav-btn'} onClick={() => setCurrentPage('charge')}>📋 Charges</button>
          <button className={currentPage === 'expense' ? 'nav-btn active' : 'nav-btn'} onClick={() => setCurrentPage('expense')}>🛒 Dépenses</button>
          <button className={currentPage === 'stats' ? 'nav-btn active' : 'nav-btn'} onClick={() => setCurrentPage('stats')}>📈 Statistiques</button>
          <button className={currentPage === 'settings' ? 'nav-btn active' : 'nav-btn'} onClick={() => setCurrentPage('settings')}>⚙️ Paramètres</button>
        </nav>
      </header>

      <main className="main-content">
        {currentPage === 'dashboard' && <Dashboard data={data} />}
        {currentPage === 'income' && <AddIncome data={data} setData={setData} />}
        {currentPage === 'charge' && <AddCharge data={data} setData={setData} />}
        {currentPage === 'expense' && <AddExpense data={data} setData={setData} categories={data.categories} />}
        {currentPage === 'stats' && <Statistics data={data} />}
        {currentPage === 'settings' && <Settings data={data} setData={setData} />}
      </main>
    </div>
  );
}

export default App;
