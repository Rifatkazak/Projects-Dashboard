// src/pages/TaskTrackerPage.js
import React, { useState, useEffect } from 'react';
import ExpenseForm from '../components/expense/ExpenseForm.js';
import ExpenseCard from '../components/expense/ExpenseCard';
import '../styles/ExpenseTracker.css';

const ExpenseTrackerPage = () => {
  const [expenses, setExpenses] = useState([]);

  

  useEffect(() => {
    getExpenses();
  }, []);

  const getExpenses = async () => {
    try {
        const response = await fetch(`http://127.0.0.1:5000/expense-tracker/list-expenses`);
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setExpenses(data.expenses);
    } catch (error) {
        console.error("Error fetching expenses:", error);
        return { expenses: [] };
    }
};

  const addExpense = async (expense) => {
    const response = await fetch('http://127.0.0.1:5000/expense-tracker/add-expense', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(expense),
    });
    const data = await response.json();
    setExpenses(data.data);
  };

  const updateExpense = async (id, updatedExpense) => {
    const response = await fetch(`http://127.0.0.1:5000/expense-tracker/update-expense/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedExpense),
    });
    const data = await response.json();
    if (data.data) {
      setExpenses(data.data);  // Update the state with the new list of expenses
    }
  };

  const deleteExpense = async (id) => {
    const response = await fetch(`http://127.0.0.1:5000/expense-tracker/delete-expense/${id}`, {
      method: 'DELETE',
    });
    const data = await response.json();
    if (data.data) {
      setExpenses(data.data);  // Remove the deleted expense from the state
    }
  };

  return (
    <div className="task-tracker-page">
      <h2>Expense Tracker</h2>
      <ExpenseForm onAddExpense={addExpense} />
      <div className="expense-cards-container">
        {expenses.map((expense) => (
          <ExpenseCard key={expense.id} expense={expense} onUpdateExpense={updateExpense}  onDeleteExpense={deleteExpense}/>
        ))}
      </div>
    </div>
  );
};

export default ExpenseTrackerPage;
