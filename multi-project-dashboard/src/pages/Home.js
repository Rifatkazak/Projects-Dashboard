// src/pages/Home.js
import React, { useState, useEffect } from 'react';
import ProjectCard from '../components/ProjectCard';
import { getExpenses, getTasks, getGitHubActivity } from '../api';

const Home = () => {
    const [expenses, setExpenses] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [githubActivity, setGithubActivity] = useState([]);

    useEffect(() => {
        //fetchData();
    }, []);

    // const fetchData = async () => {
    //     const expenseData = await getExpenses();
    //     const taskData = await getTasks();
    //     //const githubData = await getGitHubActivity('yourGitHubUsername'); // GitHub kullanıcı adınızı buraya ekleyin

    //     setExpenses(expenseData.expenses);
    //     setTasks(taskData.tasks);
    //     //setGithubActivity(githubData.activities);
    // };

    return (
        <div className="home">
            <h1>Multi Project Dashboard</h1>

            <div className="projects-container">
                <ProjectCard
                    projectName="Expense Tracker"
                    description="Manage and track your expenses"
                    link="/ExpenseTracker"
                />
                <ProjectCard
                    projectName="GitHub User Activity"
                    description="View GitHub user activity"
                    link="/GithubActivity"
                />
                <ProjectCard
                    projectName="Task Manager"
                    description="Manage your tasks"
                    link="/TaskManager"
                />
            </div>

            {/* Expenses, Tasks, GitHub Activity can be shown here as well */}
        </div>
    );
};

export default Home;
