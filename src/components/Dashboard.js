import React from 'react';
import ChartContainer from './ChartContainer';

function Dashboard({ data }) {
  // Calculs
  const totalIncomes = data.incomes.reduce((sum, inc) => sum + parseFloat(inc.amount || 0), 0);
  const totalCharges = data.charges.reduce((sum, ch) => sum + parseFloat(ch.amount || 0), 0);
  const totalExpenses = data.expenses.reduce((sum, exp) => sum + parseFloat(exp.amount || 0), 0);
  const balance = totalIncomes - totalCharges - totalExpenses;

  // Répartition des dépenses par catégorie
  const expensesByCategory = {};
  data.expenses.forEach(exp => {
    const cat = exp.category || 'Autres';
    expensesByCategory[cat] = (expensesByCategory[cat] || 0) + parseFloat(exp.amount || 0);
  });

  return (
    <div className="dashboard">
      <div className="summary-cards">
        <div className="card card-income">
          <h3>💵 Revenus</h3>
          <p className="amount">{totalIncomes.toFixed(2)} €</p>
        </div>
        <div className="card card-charge">
          <h3>📋 Charges</h3>
          <p className="amount">{totalCharges.toFixed(2)} €</p>
        </div>
        <div className="card card-expense">
          <h3>🛒 Dépenses</h3>
          <p className="amount">{totalExpenses.toFixed(2)} €</p>
        </div>
        <div className={`card card-balance ${balance >= 0 ? 'positive' : 'negative'}`}>
          <h3>💰 Solde</h3>
          <p className="amount">{balance.toFixed(2)} €</p>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <ChartContainer 
            type="expensesByCategory" 
            data={data} 
            title="Répartition des dépenses par catégorie"
          />
        </div>
        <div className="chart-card">
          <ChartContainer 
            type="monthlyBalance" 
            data={data} 
            title="Évolution mensuelle"
          />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
