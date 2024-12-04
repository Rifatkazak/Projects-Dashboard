// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import './App.css';  // CSS dosyasını import ediyoruz
import ProjectDetail from './pages/ProjectDetail';
import ExpenseTracker from './pages/ExpenseTracker';
import TaskManager from './pages/TaskManager';
import GithubActivity from './pages/GithubActivitiy';
import UnitConverter from './pages/UnitConverter';
import GuessNumber from './pages/GuessNumber';
import PersonalBlog from './pages/PersonalBlog';
import Weather from './pages/Weather';
import BlogPlatform from './pages/BlogPlatform';

const App = () => {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/ExpenseTracker" element={<ExpenseTracker />} />
                    <Route path="/TaskManager" element={<TaskManager />} />
                    <Route path="/GithubActivity" element={<GithubActivity />} />
                    <Route path="/UnitConverter" element={<UnitConverter />} />
                    <Route path="/GuessNumber" element={<GuessNumber />} />
                    <Route path="/PersonalBlog" element={<PersonalBlog />} />
                    <Route path="/Weather" element={<Weather />} />
                    <Route path="/BlogPlatform" element={<BlogPlatform />} />
                    <Route path="/project/:projectName" element={<ProjectDetail />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
