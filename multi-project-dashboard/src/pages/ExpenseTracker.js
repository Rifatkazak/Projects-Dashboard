// src/pages/TaskTrackerPage.js
import React, { useState, useEffect } from 'react';
import ExpenseForm from '../components/expense/ExpenseForm.js';
import ExpenseCard from '../components/expense/ExpenseCard';
import '../styles/ExpenseTracker.css';
import { getExpenses } from '../api.js';

const TaskTrackerPage = () => {
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
        console.log("data",data)
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

  return (
    <div className="task-tracker-page">
      <h2>Expense Tracker</h2>
      <ExpenseForm onAddExpense={addExpense} />
      <div className="expense-cards-container">
        {expenses.map((expense) => (
          <ExpenseCard key={expense.id} expense={expense} />
        ))}
      </div>
    </div>
  );
};

export default TaskTrackerPage;
