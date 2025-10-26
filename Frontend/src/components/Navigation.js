import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navigation.css';

const Navigation = ({ isLoggedIn, setIsLoggedIn }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeLink, setActiveLink] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    // set parent state, close menu and redirect to home
    setIsLoggedIn(false);
    setIsMenuOpen(false);
    try { localStorage.removeItem('authToken'); } catch {}
    navigate('/');
  };

  const handleLinkClick = (linkName) => {
    setActiveLink(linkName);
    setIsMenuOpen(false);
  };

  const handleFeaturesClick = (e) => {
    e.preventDefault();
    navigate('/features');
    
    // Sayfa yüklendikten sonra features bölümüne scroll yap
    setTimeout(() => {
      const featuresSection = document.getElementById('features');
      if (featuresSection) {
        featuresSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handleAuthButton = () => {
    const loggedNow = Boolean(localStorage.getItem('authToken')) || isLoggedIn;
    if (loggedNow) {
      // logout
      try { localStorage.removeItem('authToken'); } catch {}
      setIsLoggedIn(false);
      setIsMenuOpen(false);
      navigate('/');
    } else {
      // go to login (do not change auth state)
      setIsMenuOpen(false);
      navigate('/login');
    }
  };

  return (
    <nav className={`navigation ${isScrolled ? 'scrolled' : ''}`}>
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          <div className="logo-container">
            <div className="logo-icon">
              <img src="/assets/sellama-logo.png" alt="seLlama Logo" className="logo-image" />
              <div className="logo-glow"></div>
            </div>
            <div className="logo-text">
              <span className="logo-main">seLlama</span>
              <span className="logo-tagline">We ship your story</span>
            </div>
          </div>
        </Link>
        
        <div className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
          <Link 
            to="/" 
            className={`nav-link ${activeLink === 'home' ? 'active' : ''}`}
            onClick={() => handleLinkClick('home')}
          >
            <span>Ana Sayfa</span>
          </Link>
          <a 
            href="/features" 
            className={`nav-link ${activeLink === 'features' ? 'active' : ''}`}
            onClick={(e) => {
              handleFeaturesClick(e);
              handleLinkClick('features');
            }}
          >
            <span>Özellikler</span>
          </a>
          <Link 
            to="/pricing" 
            className={`nav-link ${activeLink === 'pricing' ? 'active' : ''}`}
            onClick={() => handleLinkClick('pricing')}
          >
            <span>Fiyatlandırma</span>
          </Link>
          <Link 
            to="/about" 
            className={`nav-link ${activeLink === 'about' ? 'active' : ''}`}
            onClick={() => handleLinkClick('about')}
          >
            <span>Hakkımızda</span>
          </Link>
          <Link 
            to="/contact" 
            className={`nav-link ${activeLink === 'contact' ? 'active' : ''}`}
            onClick={() => handleLinkClick('contact')}
          >
            <span>İletişim</span>
          </Link>
        </div>
        
        <div className="nav-auth">
          { /* Show button label based on local token OR parent prop so navigation to /login
               doesn't incorrectly change the label when user is actually logged in */ }
          <button onClick={handleAuthButton} className="btn btn-secondary">
            <span>{Boolean(localStorage.getItem('authToken')) || isLoggedIn ? 'Çıkış Yap' : 'Giriş'}</span>
          </button>
        </div>
        
        <button 
          className={`nav-toggle ${isMenuOpen ? 'active' : ''}`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>
  );
};

export default Navigation;