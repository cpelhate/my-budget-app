import React, { useState } from 'react';
import EditModal from './EditModal';

function AddExpense({ data, setData, categories }) {
  const [form, setForm] = useState({
    description: '',
    amount: '',
    category: categories[0] || 'Autres',
    date: new Date().toISOString().split('T')[0]
  });

  const [newCategory, setNewCategory] = useState('');
  const [editingExpense, setEditingExpense] = useState(null);
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
      const newExpense = {
        id: Date.now(),
        ...form,
        amount: parseFloat(form.amount)
      };
      setData({
        ...data,
        expenses: [...data.expenses, newExpense]
      });
      setForm({
        description: '',
        amount: '',
        category: categories[0] || 'Autres',
        date: new Date().toISOString().split('T')[0]
      });
      alert('✅ Dépense ajoutée !');
    }
  };

  const handleAddCategory = () => {
    if (newCategory && !categories.includes(newCategory)) {
      setData({
        ...data,
        categories: [...categories, newCategory]
      });
      setNewCategory('');
      alert('✅ Catégorie ajoutée !');
    }
  };

  const handleEdit = (expense) => {
    setEditingExpense(expense);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = (updatedExpense) => {
    setData({
      ...data,
      expenses: data.expenses.map(exp => 
        exp.id === updatedExpense.id ? updatedExpense : exp
      )
    });
    setIsEditModalOpen(false);
    alert('✅ Dépense modifiée !');
  };

  const handleDelete = (expenseId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette dépense ?')) {
      setData({
        ...data,
        expenses: data.expenses.filter(exp => exp.id !== expenseId)
      });
      alert('✅ Dépense supprimée !');
    }
  };

  return (
    <div className="page-container">
      <h2>🛒 Ajouter une dépense</h2>
      
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label>Description de la dépense</label>
          <input
            type="text"
            name="description"
            placeholder="Ex: Courses, Restaurant..."
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
            placeholder="Ex: 45.50"
            step="0.01"
            value={form.amount}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Catégorie</label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
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

        <button type="submit" className="btn btn-primary">✅ Ajouter la dépense</button>
      </form>

      <div className="category-management">
        <h3>➕ Gérer les catégories</h3>
        <div className="form-group">
          <input
            type="text"
            placeholder="Nouvelle catégorie"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
          />
          <button onClick={handleAddCategory} className="btn btn-secondary">
            ➕ Ajouter
          </button>
        </div>
        <div className="categories-display">
          {categories.map(cat => (
            <span key={cat} className="category-tag">{cat}</span>
          ))}
        </div>
      </div>

      <div className="list-section">
        <h3>🛒 Vos dépenses</h3>
        {data.expenses.length === 0 ? (
          <p className="empty-state">Aucune dépense ajoutée</p>
        ) : (
          <ul className="items-list">
            {data.expenses.map(expense => (
              <li key={expense.id} className="list-item">
                <span className="item-desc">
                  {expense.description}
                  <span className="category-badge">{expense.category}</span>
                </span>
                <div className="item-actions">
                  <span className="item-amount">{expense.amount.toFixed(2)} €</span>
                  <button 
                    onClick={() => handleEdit(expense)}
                    className="btn-edit"
                    title="Modifier"
                  >
                    ✏️
                  </button>
                  <button 
                    onClick={() => handleDelete(expense.id)}
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
        item={editingExpense}
        itemType="expense"
        categories={categories}
        onSave={handleSaveEdit}
        onClose={() => setIsEditModalOpen(false)}
      />
    </div>
  );
}

export default AddExpense;
