import React from 'react';
import './Hero.css';

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-container">
        <div className="hero-content">
          <div className="hero-logo">
            <div className="logo-container">
              <img src="/assets/sellama-logo.png" alt="seLlama Logo" className="logo-image" />
              <div className="logo-text">
                <span className="logo-main">seLlama</span>
                <span className="logo-tagline">Hikayeni dünyaya ulaştır</span>
              </div>
            </div>
          </div>
          <h1 className="hero-title">
            Yapay Zeka ile Sosyal Medya Otomasyonu
          </h1>
          <p className="hero-description">
            E-ticaret işletmenizi akıllı içerik üretimi, otomatik paylaşım ve gelişmiş analizlerle dönüştürün. 
            Zaman kazanın, satışlarınızı artırın.
          </p>
          <div className="hero-buttons">
            <a href="#demo" className="btn btn-primary">
              Ücretsiz Demo Al
            </a>
            <a href="#features" className="btn btn-secondary">
              Daha Fazla Bilgi
            </a>
          </div>
          <div className="hero-stats">
            <div className="stat">
              <div className="stat-number">500+</div>
              <div className="stat-label">Mutlu Müşteri</div>
            </div>
            <div className="stat">
              <div className="stat-number">300%</div>
              <div className="stat-label">Satış Artışı</div>
            </div>
            <div className="stat">
              <div className="stat-number">7/24</div>
              <div className="stat-label">Otomatik Yayın</div>
            </div>
          </div>
        </div>
        <div className="hero-visual">
          <div className="dashboard-preview">
            <div className="preview-header">
              <div className="preview-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
            <div className="preview-content">
              <div className="preview-sidebar">
                <div className="sidebar-item active">Dashboard</div>
                <div className="sidebar-item">Content</div>
                <div className="sidebar-item">Analytics</div>
                <div className="sidebar-item">Settings</div>
              </div>
              <div className="preview-main">
                <div className="chart-area">
                  <div className="chart-bars">
                    <div className="bar" style={{height: '60%'}}></div>
                    <div className="bar" style={{height: '80%'}}></div>
                    <div className="bar" style={{height: '45%'}}></div>
                    <div className="bar" style={{height: '90%'}}></div>
                  </div>
                </div>
                <div className="metrics">
                  <div className="metric">
                    <div className="metric-value">+127%</div>
                    <div className="metric-label">Growth</div>
                  </div>
                  <div className="metric">
                    <div className="metric-value">2.4K</div>
                    <div className="metric-label">Engagement</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;