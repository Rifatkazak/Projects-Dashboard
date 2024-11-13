// src/components/ExpenseCard.js
import React from 'react';

const ExpenseCard = ({ expense }) => {
  return (
    <div className="expense-card">
      <h3>{expense.description}</h3>
      <p>Amount: ${expense.amount}</p>
      <p>Category: {expense.category}</p>
      <p>Date: {expense.date}</p>
    </div>
  );
};

export default ExpenseCard;