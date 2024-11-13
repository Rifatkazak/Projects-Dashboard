// src/pages/ProjectDetail.js
import React from 'react';
import { useParams } from 'react-router-dom';

const ProjectDetail = () => {
    const { projectName } = useParams();

    return (
        <div className="project-detail">
            <h1>{projectName} Details</h1>
            <p>This is the detail page for {projectName}.</p>
            {/* Burada proje detaylarını API çağrıları ile getirebilirsiniz */}
        </div>
    );
};

export default ProjectDetail;