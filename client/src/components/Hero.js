import React from 'react';
import './Hero.css';
import newsImage from '../img/selfcare.png';

function Hero() {
  return (
    <div className="blue-strap">
      <section id="hero" className="hero-section">
        <div className="container">
          <div className="row">
            {/* Text Section */}
            <div className="hero-text col-lg-6">
              <h1>Stay Informed in Seconds</h1>
              <h2 style={{color:'rgb(1, 37, 147)',opacity:'0.9'}}>
                NewsSnap delivers AI-powered news summaries — get the latest headlines in a flash,
                without the clutter.
              </h2>
              <div className="hero-buttons">
                <a href="#get-started" className="btn-get-started" style={{color:'rgb(1, 37, 147)',opacity:'0.9'}}>Get Started</a>
              </div>
            </div>

            {/* Image Section */}
            <div className="hero-img">
              <img src={newsImage} className="img-fluid" alt="News Summary" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Hero;
