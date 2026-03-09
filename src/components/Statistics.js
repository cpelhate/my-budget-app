import React, { useState } from 'react';

function Statistics({ data }) {
  const [filter, setFilter] = useState('month'); // 'day', 'week', 'month', 'year'

  const getDateRange = () => {
    const today = new Date();
    let start, end;

    switch(filter) {
      case 'day':
        start = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        end = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
        break;
      case 'week':
        const day = today.getDay();
        start = new Date(today.setDate(today.getDate() - day));
        end = new Date(today.setDate(today.getDate() + 7));
        break;
      case 'month':
        start = new Date(today.getFullYear(), today.getMonth(), 1);
        end = new Date(today.getFullYear(), today.getMonth() + 1, 1);
        break;
      case 'year':
        start = new Date(today.getFullYear(), 0, 1);
        end = new Date(today.getFullYear() + 1, 0, 1);
        break;
      default:
        return { start, end };
    }
    return { start, end };
  };

  const filterByDate = (items) => {
    const { start, end } = getDateRange();
    return items.filter(item => {
      const itemDate = new Date(item.date);
      return itemDate >= start && itemDate < end;
    });
  };

  const filteredIncomes = filterByDate(data.incomes);
  const filteredCharges = filterByDate(data.charges);
  const filteredExpenses = filterByDate(data.expenses);

  const totalIncomes = filteredIncomes.reduce((sum, inc) => sum + parseFloat(inc.amount || 0), 0);
  const totalCharges = filteredCharges.reduce((sum, ch) => sum + parseFloat(ch.amount || 0), 0);
  const totalExpenses = filteredExpenses.reduce((sum, exp) => sum + parseFloat(exp.amount || 0), 0);

  return (
    <div className="page-container">
      <h2>📈 Statistiques</h2>

      <div className="filter-section">
        <label>Filtrer par :</label>
        <div className="filter-buttons">
          <button 
            className={filter === 'day' ? 'filter-btn active' : 'filter-btn'}
            onClick={() => setFilter('day')}
          >
            📅 Jour
          </button>
          <button 
            className={filter === 'week' ? 'filter-btn active' : 'filter-btn'}
            onClick={() => setFilter('week')}
          >
            📆 Semaine
          </button>
          <button 
            className={filter === 'month' ? 'filter-btn active' : 'filter-btn'}
            onClick={() => setFilter('month')}
          >
            📋 Mois
          </button>
          <button 
            className={filter === 'year' ? 'filter-btn active' : 'filter-btn'}
            onClick={() => setFilter('year')}
          >
            📊 Année
          </button>
        </div>
      </div>

      <div className="stats-cards">
        <div className="stat-card">
          <h3>💵 Revenus</h3>
          <p className="stat-value">{totalIncomes.toFixed(2)} €</p>
        </div>
        <div className="stat-card">
          <h3>📋 Charges</h3>
          <p className="stat-value">{totalCharges.toFixed(2)} €</p>
        </div>
        <div className="stat-card">
          <h3>🛒 Dépenses</h3>
          <p className="stat-value">{totalExpenses.toFixed(2)} €</p>
        </div>
        <div className="stat-card">
          <h3>💰 Bilan</h3>
          <p className="stat-value" style={{color: (totalIncomes - totalCharges - totalExpenses) >= 0 ? '#27ae60' : '#e74c3c'}}>
            {(totalIncomes - totalCharges - totalExpenses).toFixed(2)} €
          </p>
        </div>
      </div>

      <div className="detailed-stats">
        <div className="stat-detail">
          <h3>💵 Détail des revenus</h3>
          {filteredIncomes.length === 0 ? (
            <p>Aucun revenu</p>
          ) : (
            <ul>
              {filteredIncomes.map(income => (
                <li key={income.id}>
                  {income.description}: <strong>{income.amount.toFixed(2)} €</strong>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="stat-detail">
          <h3>📋 Détail des charges</h3>
          {filteredCharges.length === 0 ? (
            <p>Aucune charge</p>
          ) : (
            <ul>
              {filteredCharges.map(charge => (
                <li key={charge.id}>
                  {charge.description}: <strong>{charge.amount.toFixed(2)} €</strong>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="stat-detail">
          <h3>🛒 Détail des dépenses</h3>
          {filteredExpenses.length === 0 ? (
            <p>Aucune dépense</p>
          ) : (
            <ul>
              {filteredExpenses.map(expense => (
                <li key={expense.id}>
                  {expense.description} ({expense.category}): <strong>{expense.amount.toFixed(2)} €</strong>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default Statistics;
