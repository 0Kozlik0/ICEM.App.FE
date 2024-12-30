import React from 'react';
import './Footer.css';

function Footer() {
    const currentYear = new Date().getFullYear();
    
    return (
        <footer className="footer">
            <p>©<a href="https://vgg.fiit.stuba.sk/" target="_blank" rel="noopener noreferrer">Vision & Graphics Group</a> {currentYear}</p>
        </footer>
    );
}

export default Footer; 