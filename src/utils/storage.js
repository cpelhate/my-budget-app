// Débounce la sauvegarde pour éviter trop d'écritures simultanées
let saveTimeout;

export const loadDataFromStorage = () => {
  try {
    const savedData = localStorage.getItem('budgetAppData');
    if (savedData) {
      console.log('✅ Données chargées depuis localStorage');
      return JSON.parse(savedData);
    }
  } catch (error) {
    console.error('Erreur lors du chargement des données:', error);
  }
  
  // Données par défaut
  return {
    incomes: [],
    charges: [],
    expenses: [],
    categories: ['Alimentation', 'Transport', 'Logement', 'Loisirs', 'Santé', 'Autres']
  };
};

export const saveDataToStorage = (data) => {
  // Efface le timeout précédent
  clearTimeout(saveTimeout);
  
  // Remet un nouveau timeout (sauvegarde après 500ms d'inactivité)
  saveTimeout = setTimeout(() => {
    try {
      localStorage.setItem('budgetAppData', JSON.stringify(data));
      console.log('✅ Données sauvegardées dans localStorage');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  }, 500);
};

// Sauvegarder immédiatement avant de fermer la page
window.addEventListener('beforeunload', () => {
  if (window.budgetData) {
    localStorage.setItem('budgetAppData', JSON.stringify(window.budgetData));
  }
});
