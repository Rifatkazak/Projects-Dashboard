// src/components/ExpenseCard.js
import React from 'react';

const ExpenseCard = ({ expense, onUpdateExpense, onDeleteExpense }) => {
  return (
    <div className="expense-card">
      <h4>{expense.description}</h4>
      <p>Amount: ${expense.amount}</p>
      <p>Category: {expense.category}</p>
      <p>Date: {expense.date}</p>
      <button onClick={() => onUpdateExpense(expense.id, expense)}>Update</button>
      <button onClick={() => onDeleteExpense(expense.id)}>Delete</button>
    </div>
  );
};

export default ExpenseCard;