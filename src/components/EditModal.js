import React, { useState, useEffect } from 'react';

function EditModal({ isOpen, item, itemType, categories, onSave, onClose }) {
  const [form, setForm] = useState({
    description: '',
    amount: '',
    category: '',
    recurring: false,
    date: ''
  });

  useEffect(() => {
    if (item) {
      setForm({
        description: item.description || '',
        amount: item.amount || '',
        category: item.category || (categories && categories[0]) || '',
        recurring: item.recurring || false,
        date: item.date || ''
      });
    }
  }, [item, categories]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...item,
      ...form,
      amount: parseFloat(form.amount)
    });
  };

  if (!isOpen || !item) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>✏️ Modifier {itemType === 'income' ? 'le revenu' : itemType === 'charge' ? 'la charge' : 'la dépense'}</h2>
          <button onClick={onClose} className="modal-close">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Description</label>
            <input
              type="text"
              name="description"
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
              step="0.01"
              value={form.amount}
              onChange={handleChange}
              required
            />
          </div>

          {itemType === 'income' && (
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
          )}

          {itemType === 'expense' && (
            <div className="form-group">
              <label>Catégorie</label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
              >
                {categories && categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          )}

          <div className="form-group">
            <label>Date</label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
            />
          </div>

          <div className="modal-buttons">
            <button type="submit" className="btn btn-primary">💾 Enregistrer</button>
            <button type="button" onClick={onClose} className="btn btn-secondary">❌ Annuler</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditModal;
