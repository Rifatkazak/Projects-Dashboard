// src/api.js

// API base URL
const API_URL = "http://127.0.0.1:5000";  // Flask backend URL'ini belirtin

// Expense Tracker API istekleri
export const getExpenses = async () => {
    try {
        const response = await fetch(`${API_URL}/expense-tracker/list-expenses`);
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching expenses:", error);
        return { expenses: [] };
    }
};

export const addExpense = async (expense) => {
    try {
        const response = await fetch(`${API_URL}/expense-tracker/add-expense`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(expense),
        });
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error adding expense:", error);
        return null;
    }
};

// Task Manager API istekleri
export const getTasks = async () => {
    try {
        const response = await fetch(`${API_URL}/task-manager/list-tasks`);
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching tasks:", error);
        return { tasks: [] };
    }
};

export const addTask = async (task) => {
    try {
        const response = await fetch(`${API_URL}/task-manager/add-task`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(task),
        });
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error adding task:", error);
        return null;
    }
};

// GitHub User Activity API istekleri
export const getGitHubActivity = async (username) => {
    try {
        const response = await fetch(`${API_URL}/github-activities/activity/${username}`);
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching GitHub activity:", error);
        return { activities: [] };
    }
};
