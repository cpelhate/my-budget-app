import React, { useState } from 'react';

function AddExpense({ data, setData, categories = [] }) {
  const [label, setLabel] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [category, setCategory] = useState('');
  const [newCategory, setNewCategory] = useState('');

  const alreadyExists = updatedCategories.some(
  (cat) => cat.trim().toLowerCase() === trimmedCategory.toLowerCase()
  );

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

      finalCategory = trimmedCategory;

      if (!updatedCategories.includes(trimmedCategory)) {
        updatedCategories.push(trimmedCategory);
      }
    }

    const newExpense = {
      id: Date.now(),
      label,
      amount: parseFloat(amount),
      date,
      category: finalCategory,
    };

    setData({
      ...data,
      categories: updatedCategories,
      expenses: [...(data.expenses || []), newExpense],
    });

    setLabel('');
    setAmount('');
    setDate('');
    setCategory('');
    setNewCategory('');
  };

  return (
    <div className="page-container">
      <h2>🛒 Ajouter une dépense</h2>

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

        <button type="submit" className="btn-primary">
          Ajouter la dépense
        </button>
      </form>
    </div>
  );
}

export default AddExpense;