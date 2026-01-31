import React from 'react';
// IMPORT STATIC LOGOS
import googleImg from '../assets/google.png';
import flipkartImg from '../assets/flipkart.png';
import microsoftImg from '../assets/microsoft.png';
import atlassianImg from '../assets/atlassian.png';
import zomatoImg from '../assets/zomato.png';   
import appleImg from '../assets/apple.png';     
import uberImg from '../assets/uber.png';      
import amazonImg from '../assets/amazon.png';   
import netflixImg from '../assets/netflix.png'; 
import defaultImg from '../assets/default.png'; 

const CompanyLogo = ({ company, className }) => {
    
    // 1. Determine the Company Name & Custom Logo URL
    let companyName = '';
    let customLogoUrl = null;

    if (typeof company === 'object' && company !== null) {
        // It's a full company object
        companyName = company.name || '';
        if (company.logo) {
            customLogoUrl = `http://localhost:5000/${company.logo.replace(/\\/g, '/')}`;
        }
    } else {
        // It's just a string
        companyName = company || '';
    }

    // 2. Logic: Which Image to Show?
    const lowerName = companyName.toLowerCase().trim();
    let logoSrc = defaultImg; // Default fallback

    // A. Priority: Recruiter Uploaded Logo
    if (customLogoUrl) {
        return (
            <img 
                src={customLogoUrl} 
                alt={`${companyName} logo`} 
                className={`object-contain bg-white ${className}`} 
            />
        );
    }

    // B. Static Brand Logos
    if (lowerName.includes('google')) {
        logoSrc = googleImg;
    } else if (lowerName.includes('flipkart')) {
        logoSrc = flipkartImg;
    } else if (lowerName.includes('microsoft')) {
        logoSrc = microsoftImg;
    } else if (lowerName.includes('atlassian')) {
        logoSrc = atlassianImg;
    } else if (lowerName.includes('zomato')) {
        logoSrc = zomatoImg;
    } else if (lowerName.includes('apple')) {
        logoSrc = appleImg;
    } else if (lowerName.includes('uber')) {
        logoSrc = uberImg;
    } else if (lowerName.includes('amazon')) {
        logoSrc = amazonImg;
    } else if (lowerName.includes('netflix')) {
        logoSrc = netflixImg;
    }

    // C. Render Final Logo
    return (
        <img 
            src={logoSrc} 
            alt={`${companyName} logo`} 
            className={`object-contain bg-white ${className}`} 
        />
    );
};

export default CompanyLogo;