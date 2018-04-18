import React from 'react';

import './Button.css';

export default ({ children, onClick, title, size="md", type = 'primary'}) => (
    <button title={title} onClick={onClick} className={`Button Button-${type} Button--${size}`}>
        {children}
    </button>
)