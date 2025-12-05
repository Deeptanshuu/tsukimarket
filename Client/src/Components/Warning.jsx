import React, { useState } from 'react';
import './Warning.css';

function Warning() {
    const [clicked, setClicked] = useState(false);

    const dismissWarning = () => {
        setClicked(true);
    }

    return (
        <div className='warning-container' style={{ display: clicked ? "none" : "flex" }}>
            <div className='warning-content'>
                <div className='warning-icon'>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 9V13M12 17H12.01M5.07183 19H18.9282C20.4678 19 21.4301 17.3333 20.6603 16L13.7321 4C12.9623 2.66667 11.0377 2.66667 10.2679 4L3.33975 16C2.56995 17.3333 3.53223 19 5.07183 19Z" 
                              stroke="currentColor" 
                              strokeWidth="2" 
                              strokeLinecap="round" 
                              strokeLinejoin="round" />
                    </svg>
                </div>
                <div className='warning-text-content'>
                    <h3 className='warning-title'>Demo Website</h3>
                    <p className='warning-text'>This is not a real website. I made it for fun and learning react and nodejs. Sorry, Felix</p>
                </div>
                <div className='close-button' onClick={dismissWarning}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18 6L6 18M6 6L18 18" 
                              stroke="currentColor" 
                              strokeWidth="2" 
                              strokeLinecap="round" 
                              strokeLinejoin="round" />
                    </svg>
                </div>
            </div>
        </div>
    );
}

export default Warning;
