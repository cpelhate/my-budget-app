import React, { useState } from 'react';
import EditModal from './EditModal';

function AddIncome({ data, setData }) {
  const [form, setForm] = useState({
    description: '',
    amount: '',
    recurring: false,
    date: new Date().toISOString().split('T')[0]
  });

  const [editingIncome, setEditingIncome] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.description && form.amount) {
      const newIncome = {
        id: Date.now(),
        ...form,
        amount: parseFloat(form.amount)
      };
      setData({
        ...data,
        incomes: [...data.incomes, newIncome]
      });
      setForm({
        description: '',
        amount: '',
        recurring: false,
        date: new Date().toISOString().split('T')[0]
      });
      alert('✅ Revenu ajouté !');
    }
  };

  const handleEdit = (income) => {
    setEditingIncome(income);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = (updatedIncome) => {
    setData({
      ...data,
      incomes: data.incomes.map(inc => 
        inc.id === updatedIncome.id ? updatedIncome : inc
      )
    });
    setIsEditModalOpen(false);
    alert('✅ Revenu modifié !');
  };

  const handleDelete = (incomeId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce revenu ?')) {
      setData({
        ...data,
        incomes: data.incomes.filter(inc => inc.id !== incomeId)
      });
      alert('✅ Revenu supprimé !');
    }
  };

  return (
    <div className="page-container">
      <h2>💵 Ajouter un revenu</h2>
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label>Description du revenu</label>
          <input
            type="text"
            name="description"
            placeholder="Ex: Salaire, Don, Remboursement..."
            value={form.description}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Montant (€)</label>
          <input
            type="number"
            name="amount"
            placeholder="Ex: 2500"
            step="0.01"
            value={form.amount}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Date</label>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
          />
        </div>

        <div className="form-group checkbox">
          <label>
            <input
              type="checkbox"
              name="recurring"
              checked={form.recurring}
              onChange={handleChange}
            />
            Revenu récurrent (mensuel)
          </label>
        </div>

        <button type="submit" className="btn btn-primary">✅ Ajouter le revenu</button>
      </form>

      <div className="list-section">
        <h3>📋 Vos revenus</h3>
        {data.incomes.length === 0 ? (
          <p className="empty-state">Aucun revenu ajouté</p>
        ) : (
          <ul className="items-list">
            {data.incomes.map(income => (
              <li key={income.id} className="list-item">
                <span className="item-desc">
                  {income.description}
                  {income.recurring && <span className="badge">Récurrent</span>}
                </span>
                <div className="item-actions">
                  <span className="item-amount">{income.amount.toFixed(2)} €</span>
                  <button 
                    onClick={() => handleEdit(income)}
                    className="btn-edit"
                    title="Modifier"
                  >
                    ✏️
                  </button>
                  <button 
                    onClick={() => handleDelete(income.id)}
                    className="btn-delete"
                    title="Supprimer"
                  >
                    🗑️
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <EditModal 
        isOpen={isEditModalOpen}
        item={editingIncome}
        itemType="income"
        categories={[]}
        onSave={handleSaveEdit}
        onClose={() => setIsEditModalOpen(false)}
      />
    </div>
  );
}

export default AddIncome;
