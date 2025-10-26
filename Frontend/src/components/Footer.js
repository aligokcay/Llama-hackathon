import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3 className="footer-logo">seLlama</h3>
            <p className="footer-description">
              E-ticaret işletmeleriniz için AI destekli sosyal medya otomasyon platformu.
            </p>
            <div className="social-links">
              <a href="https://facebook.com" className="social-link" target="_blank" rel="noopener noreferrer">📘</a>
              <a href="https://instagram.com" className="social-link" target="_blank" rel="noopener noreferrer">📷</a>
              <a href="https://twitter.com" className="social-link" target="_blank" rel="noopener noreferrer">🐦</a>
              <a href="https://linkedin.com" className="social-link" target="_blank" rel="noopener noreferrer">💼</a>
            </div>
          </div>
          
          <div className="footer-section">
            <h4 className="footer-title">Ürün</h4>
            <ul className="footer-links">
              <li><a href="#features">Özellikler</a></li>
              <li><a href="#demo">Demo</a></li>
              <li><a href="/pricing">Fiyatlandırma</a></li>
              <li><a href="/api">API</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4 className="footer-title">İletişim</h4>
            <div className="contact-info">
              <div className="contact-item">
                <span className="contact-icon">📧</span>
                <a href="mailto:info@sellama.co" className="contact-link">info@sellama.co</a>
              </div>
              <div className="contact-item">
                <span className="contact-icon">📞</span>
                <a href="tel:+908503084623" className="contact-link">+90 (850) 308 46 23</a>
              </div>
              <div className="contact-item">
                <span className="contact-icon">📍</span>
                <span className="contact-text">Yıldız Teknopark, Yıldız Teknik Üniversitesi<br/>Davutpaşa Kampüsü, 34220 Esenler/İstanbul</span>
              </div>
            </div>
          </div>
          
          <div className="footer-section">
            <h4 className="footer-title">Şirket</h4>
            <ul className="footer-links">
              <li><a href="/about">Hakkımızda</a></li>
              <li><a href="/blog">Blog</a></li>
              <li><a href="/careers">Kariyer</a></li>
              <li><a href="/press">Basın</a></li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p className="copyright">
              © 2024 seLlama. Tüm hakları saklıdır.
            </p>
            <div className="footer-legal">
              <a href="/privacy">Gizlilik Politikası</a>
              <a href="/terms">Kullanım Şartları</a>
              <a href="/cookies">Çerez Politikası</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
