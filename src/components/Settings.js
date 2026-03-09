import React from 'react';

function Settings({ data, setData }) {
  const handleClearAllData = () => {
    if (window.confirm('⚠️ Êtes-vous sûr ? Cette action supprimera TOUTES vos données !')) {
      setData({
        incomes: [],
        charges: [],
        expenses: [],
        categories: ['Alimentation', 'Transport', 'Logement', 'Loisirs', 'Santé', 'Autres']
      });
      alert('✅ Toutes les données ont été supprimées !');
    }
  };

  const handleExportData = () => {
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `budget_backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  const handleImportData = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const importedData = JSON.parse(event.target.result);
          setData(importedData);
          alert('✅ Données importées avec succès !');
        } catch (error) {
          alert('❌ Erreur lors de l\'import du fichier');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="page-container">
      <h2>⚙️ Paramètres</h2>

      <div className="settings-section">
        <h3>📊 Statistiques générales</h3>
        <div className="stats-info">
          <p><strong>Total des revenus :</strong> {data.incomes.reduce((sum, inc) => sum + parseFloat(inc.amount || 0), 0).toFixed(2)} €</p>
          <p><strong>Total des charges :</strong> {data.charges.reduce((sum, ch) => sum + parseFloat(ch.amount || 0), 0).toFixed(2)} €</p>
          <p><strong>Total des dépenses :</strong> {data.expenses.reduce((sum, exp) => sum + parseFloat(exp.amount || 0), 0).toFixed(2)} €</p>
          <p><strong>Nombre de revenus :</strong> {data.incomes.length}</p>
          <p><strong>Nombre de charges :</strong> {data.charges.length}</p>
          <p><strong>Nombre de dépenses :</strong> {data.expenses.length}</p>
          <p><strong>Catégories :</strong> {data.categories.length}</p>
        </div>
      </div>

      <div className="settings-section">
        <h3>💾 Sauvegarder & Restaurer</h3>
        <div className="settings-buttons">
          <button onClick={handleExportData} className="btn btn-secondary">
            💾 Exporter mes données (JSON)
          </button>
          <label className="btn btn-secondary import-btn">
            📂 Importer mes données
            <input 
              type="file" 
              accept=".json"
              onChange={handleImportData}
              style={{ display: 'none' }}
            />
          </label>
        </div>
      </div>

      <div className="settings-section danger">
        <h3>🗑️ Zone dangereuse</h3>
        <p>Attention : Les actions ci-dessous sont définitives !</p>
        <button onClick={handleClearAllData} className="btn btn-danger">
          🗑️ Supprimer TOUTES les données
        </button>
      </div>
    </div>
  );
}

export default Settings;
