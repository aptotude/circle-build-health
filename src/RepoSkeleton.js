import React from 'react';

import './Repo.css';

export default ({name}) => (
    <div className="Repo Repo-skeleton">
        <div className="Repo-body">
        <div className="Repo-name">
            {name}
        </div>
        </div>
    </div> 
);