import { 
  collection, 
  getDocs, 
  setDoc, 
  doc
} from 'firebase/firestore';
import { db } from '../config/firebase';

// Sauvegarder les données dans Firestore
export const saveDataToFirestore = async (userId, data) => {
  try {
    await setDoc(doc(db, 'users', userId, 'data', 'budget'), data);
    console.log('✅ Données sauvegardées dans Firestore');
    return true;
  } catch (error) {
    console.error('Erreur lors de la sauvegarde :', error);
    return false;
  }
};

// Charger les données depuis Firestore
export const loadDataFromFirestore = async (userId) => {
  try {
    
    const docSnap = await getDocs(collection(db, 'users', userId, 'data'));
    
    if (docSnap.empty) {
      console.log('Aucune donnée trouvée');
      return null;
    }

    // Récupérer le premier document
    let budgetData = null;
    docSnap.forEach(doc => {
      if (doc.id === 'budget') {
        budgetData = doc.data();
      }
    });

    if (budgetData) {
      console.log('✅ Données chargées depuis Firestore');
      return budgetData;
    }
    return null;
  } catch (error) {
    console.error('Erreur lors du chargement :', error);
    return null;
  }
};
