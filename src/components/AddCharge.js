import React, { useState } from 'react';
import EditModal from './EditModal';

function AddCharge({ data, setData }) {
  const [form, setForm] = useState({
    description: '',
    amount: '',
    date: new Date().toISOString().split('T')[0]
  });

  const [editingCharge, setEditingCharge] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.description && form.amount) {
      const newCharge = {
        id: Date.now(),
        ...form,
        amount: parseFloat(form.amount)
      };
      setData({
        ...data,
        charges: [...data.charges, newCharge]
      });
      setForm({
        description: '',
        amount: '',
        date: new Date().toISOString().split('T')[0]
      });
      alert('✅ Charge ajoutée !');
    }
  };

  const handleEdit = (charge) => {
    setEditingCharge(charge);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = (updatedCharge) => {
    setData({
      ...data,
      charges: data.charges.map(ch => 
        ch.id === updatedCharge.id ? updatedCharge : ch
      )
    });
    setIsEditModalOpen(false);
    alert('✅ Charge modifiée !');
  };

  const handleDelete = (chargeId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette charge ?')) {
      setData({
        ...data,
        charges: data.charges.filter(ch => ch.id !== chargeId)
      });
      alert('✅ Charge supprimée !');
    }
  };

  return (
    <div className="page-container">
      <h2>📋 Ajouter une charge</h2>
      <p className="help-text">Les charges sont généralement répercutées chaque mois</p>
      
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label>Description de la charge</label>
          <input
            type="text"
            name="description"
            placeholder="Ex: Loyer, Électricité, Internet..."
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
            placeholder="Ex: 800"
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

        <button type="submit" className="btn btn-primary">✅ Ajouter la charge</button>
      </form>

      <div className="list-section">
        <h3>📋 Vos charges</h3>
        {data.charges.length === 0 ? (
          <p className="empty-state">Aucune charge ajoutée</p>
        ) : (
          <ul className="items-list">
            {data.charges.map(charge => (
              <li key={charge.id} className="list-item">
                <span className="item-desc">{charge.description}</span>
                <div className="item-actions">
                  <span className="item-amount">{charge.amount.toFixed(2)} €</span>
                  <button 
                    onClick={() => handleEdit(charge)}
                    className="btn-edit"
                    title="Modifier"
                  >
                    ✏️
                  </button>
                  <button 
                    onClick={() => handleDelete(charge.id)}
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
        item={editingCharge}
        itemType="charge"
        categories={[]}
        onSave={handleSaveEdit}
        onClose={() => setIsEditModalOpen(false)}
      />
    </div>
  );
}

export default AddCharge;
