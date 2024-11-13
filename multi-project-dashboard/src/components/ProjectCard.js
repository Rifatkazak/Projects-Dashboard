// src/components/ProjectCard.js
import React from 'react';
import { Link } from 'react-router-dom';

const ProjectCard = ({ projectName, description, link }) => {
    return (
        <div className="project-card">
            <Link to={link} className="project-card-link">
                <h3>{projectName}</h3>
                <p>{description}</p>
            </Link>
        </div>
    );
};

export default ProjectCard;
