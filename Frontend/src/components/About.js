import React from 'react';
import { Link } from 'react-router-dom';
import './About.css';

const About = () => {
  return (
    <div className="about-page">
      <div className="about-container">
        <div className="about-hero">
          <h1>Hikayeni dünyaya ulaştıran yapay zekâ.</h1>
          <p className="about-description">
            Sellama, küçük ve orta ölçekli markaların sosyal medya yönetimini kolaylaştırmak için geliştirildi. 
            Yapay zekâ destekli sistemimiz, markaların içerik üretimini, paylaşımını ve analizini tek bir panelden otomatikleştirir. 
            Bizim hedefimiz, herkesin profesyonel bir dijital görünüme sahip olmasını sağlamak — zaman kaybetmeden, ek maliyet olmadan.
          </p>
        </div>

        <div className="about-content">
          <div className="vision-mission">
            <div className="vision">
              <h2>Vizyonumuz</h2>
              <p>
                Yapay zekâyı herkesin erişebileceği sade, güvenilir ve yaratıcı bir yardımcıya dönüştürmek.
              </p>
            </div>

            <div className="mission">
              <h2>Misyonumuz</h2>
              <p>
                Markaların hikayelerini en doğru şekilde anlatmalarını sağlamak — çünkü her markanın anlatılacak bir hikayesi vardır.
              </p>
            </div>
          </div>

          <div className="about-tagline">
            <h3>"We ship your story."</h3>
          </div>

          <div className="about-cta">
            <Link to="/dashboard" className="cta-button">
              Platformu Keşfet
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
