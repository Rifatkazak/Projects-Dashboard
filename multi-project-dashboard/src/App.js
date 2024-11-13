// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import './App.css';  // CSS dosyasını import ediyoruz
import ProjectDetail from './pages/ProjectDetail';
import ExpenseTracker from './pages/ExpenseTracker';

const App = () => {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/ExpenseTracker" element={<ExpenseTracker />} />
                    <Route path="/project/:projectName" element={<ProjectDetail />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
