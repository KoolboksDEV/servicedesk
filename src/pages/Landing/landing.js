import React from 'react';
import '../Landing/landing.css'; 
import logo2 from '../../image/landing-image.png' ;
import logo1 from '../../image/koolboks.png';
import { Link } from 'react-router-dom';
import '@fontsource/roboto';  
import '@fontsource/open-sans'; 


const Landing = () => {
  return (
    <div className="landing-page">
      <nav className="navbar">
        <img src={logo1} alt="ServiceDesk Logo" className="logo" />
      </nav>

      <div className="landing-content">
        <div className="text-content">
          <h1>Unified Service Management</h1>
          <p>Design, automate, deliver and manage critical IT and business services</p>
          <Link to='/user'><button className="cta-button">Get started</button></Link>
        </div>
        <div className="image-content">
          <img src={logo2} alt="Service Management" className="landing-image" />
        </div>
      </div>
    </div>
  );
};

export default Landing;

