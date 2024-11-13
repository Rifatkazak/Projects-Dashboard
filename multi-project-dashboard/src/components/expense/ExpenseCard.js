// src/components/ExpenseCard.js
import React from 'react';

const ExpenseCard = ({ expense, onUpdateExpense, onDeleteExpense }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
      <h4 className="text-xl font-semibold mb-2">{expense.description}</h4>
      <p className="text-lg text-gray-700 mb-2">Amount: <span className="font-bold">${expense.amount}</span></p>
      <p className="text-gray-600 mb-2">Category: {expense.category}</p>
      <p className="text-gray-500 mb-4">Date: {expense.date}</p>
      <div className="flex gap-2">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-300"
          onClick={() => onUpdateExpense(expense.id, expense)}
        >
          Update
        </button>
        <button
          className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors duration-300"
          onClick={() => onDeleteExpense(expense.id)}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default ExpenseCard;
