import React, { useMemo, useState } from 'react';

function AddExpense({ data, setData, categories = [] }) {
  const expenses = Array.isArray(data?.expenses) ? data.expenses : [];

  const [label, setLabel] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [category, setCategory] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [editingId, setEditingId] = useState(null);

  const [filterCategory, setFilterCategory] = useState('');
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');
  const [filterText, setFilterText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!label || !amount || !date || !category) {
      alert('Merci de remplir tous les champs.');
      return;
    }

    let finalCategory = category;
    let updatedCategories = [...categories];

    if (category === '__new__') {
      const trimmedCategory = newCategory.trim();

      if (!trimmedCategory) {
        alert('Merci de saisir le nom de la nouvelle catégorie.');
        return;
      }

      const alreadyExists = updatedCategories.some(
        (cat) => cat.trim().toLowerCase() === trimmedCategory.toLowerCase()
      );

      finalCategory = trimmedCategory;

      if (!alreadyExists) {
        updatedCategories.push(trimmedCategory);
      }
    }

    const expenseData = {
      id: editingId || Date.now(),
      label,
      amount: parseFloat(amount),
      date,
      category: finalCategory,
    };

    let updatedExpenses;

    if (editingId) {
      updatedExpenses = expenses.map((expense) =>
        expense.id === editingId ? expenseData : expense
      );
    } else {
      updatedExpenses = [...expenses, expenseData];
    }

    setData({
      ...data,
      categories: updatedCategories,
      expenses: updatedExpenses,
    });

    resetForm();
  };

  const resetForm = () => {
    setLabel('');
    setAmount('');
    setDate('');
    setCategory('');
    setNewCategory('');
    setEditingId(null);
  };

  const handleDeleteExpense = (id) => {
    const confirmed = window.confirm('Supprimer cette dépense ?');
    if (!confirmed) return;

    setData({
      ...data,
      expenses: expenses.filter((expense) => expense.id !== id),
    });

    if (editingId === id) {
      resetForm();
    }
  };

  const handleEditExpense = (expense) => {
    setLabel(expense.label);
    setAmount(String(expense.amount));
    setDate(expense.date);
    setCategory(expense.category);
    setNewCategory('');
    setEditingId(expense.id);
  };

  const filteredExpenses = useMemo(() => {
    return expenses
      .filter((expense) => {
        if (filterCategory && expense.category !== filterCategory) return false;
        if (filterStartDate && expense.date < filterStartDate) return false;
        if (filterEndDate && expense.date > filterEndDate) return false;
        if (
          filterText &&
          !expense.label.toLowerCase().includes(filterText.toLowerCase())
        ) {
          return false;
        }
        return true;
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [expenses, filterCategory, filterStartDate, filterEndDate, filterText]);

  return (
    <div className="page-container">
      <h2>🛒 Dépenses</h2>

      <form onSubmit={handleSubmit} className="form-card">
        <input
          type="text"
          placeholder="Libellé de la dépense"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
        />

        <input
          type="number"
          step="0.01"
          placeholder="Montant"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">Sélectionner une catégorie</option>
          {categories.map((cat, index) => (
            <option key={`${cat}-${index}`} value={cat}>
              {cat}
            </option>
          ))}
          <option value="__new__">➕ Nouvelle catégorie</option>
        </select>

        {category === '__new__' && (
          <input
            type="text"
            placeholder="Nom de la nouvelle catégorie"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
          />
        )}

        <div className="form-actions">
          <button type="submit" className="btn-primary">
            {editingId ? 'Enregistrer les modifications' : 'Ajouter la dépense'}
          </button>

          {editingId && (
            <button
              type="button"
              className="btn-secondary"
              onClick={resetForm}
            >
              Annuler la modification
            </button>
          )}
        </div>
      </form>

      <div className="filter-card">
        <h3>Filtres</h3>

        <div className="filters-grid">
          <input
            type="text"
            placeholder="Rechercher un libellé"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
          />

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="">Toutes les catégories</option>
            {categories.map((cat, index) => (
              <option key={`${cat}-filter-${index}`} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <input
            type="date"
            value={filterStartDate}
            onChange={(e) => setFilterStartDate(e.target.value)}
          />

          <input
            type="date"
            value={filterEndDate}
            onChange={(e) => setFilterEndDate(e.target.value)}
          />

          <button
            type="button"
            className="btn-secondary"
            onClick={() => {
              setFilterText('');
              setFilterCategory('');
              setFilterStartDate('');
              setFilterEndDate('');
            }}
          >
            Réinitialiser les filtres
          </button>
        </div>
      </div>

      <div className="table-card">
        <h3>Liste des dépenses</h3>

        {filteredExpenses.length === 0 ? (
          <p>Aucune dépense trouvée.</p>
        ) : (
          <div className="table-wrapper">
            <table className="expense-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Libellé</th>
                  <th>Catégorie</th>
                  <th>Montant</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredExpenses.map((expense) => (
                  <tr key={expense.id}>
                    <td>{expense.date}</td>
                    <td>{expense.label}</td>
                    <td>{expense.category}</td>
                    <td>{Number(expense.amount).toFixed(2)} €</td>
                    <td>
                      <div className="row-actions">
                        <button
                          type="button"
                          className="btn-secondary"
                          onClick={() => handleEditExpense(expense)}
                        >
                          Modifier
                        </button>
                        <button
                          type="button"
                          className="btn-delete"
                          onClick={() => handleDeleteExpense(expense.id)}
                        >
                          Supprimer
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AddExpense;