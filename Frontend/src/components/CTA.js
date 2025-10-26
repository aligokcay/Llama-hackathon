import React, { useState } from 'react';
import './CTA.css';

const CTA = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Form submission logic would go here
    alert('Demo talebiniz alındı! En kısa sürede sizinle iletişime geçeceğiz.');
    setFormData({ name: '', email: '', company: '', phone: '' });
  };

  return (
    <section id="demo" className="cta section">
      <div className="container">
        <div className="cta-content">
          <div className="cta-text">
            <h2 className="cta-title">
              Ücretsiz Demo İsteyin
            </h2>
            <p className="cta-description">
              AI sosyal medya otomasyon platformumuzu 14 gün ücretsiz deneyin. 
              Hiçbir kredi kartı bilgisi gerektirmez.
            </p>
            <div className="cta-features">
              <div className="cta-feature">
                <span className="check-icon">✓</span>
                <span>14 gün ücretsiz deneme</span>
              </div>
              <div className="cta-feature">
                <span className="check-icon">✓</span>
                <span>Kredi kartı gerektirmez</span>
              </div>
              <div className="cta-feature">
                <span className="check-icon">✓</span>
                <span>Ücretsiz kurulum desteği</span>
              </div>
              <div className="cta-feature">
                <span className="check-icon">✓</span>
                <span>7/24 müşteri desteği</span>
              </div>
            </div>
          </div>
          
          <div className="cta-form-container">
            <form className="cta-form" onSubmit={handleSubmit}>
              <h3>Demo Talep Formu</h3>
              <div className="form-group">
                <input
                  type="text"
                  name="name"
                  placeholder="Ad Soyad"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="email"
                  name="email"
                  placeholder="E-posta Adresi"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  name="company"
                  placeholder="Şirket Adı"
                  value={formData.company}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="tel"
                  name="phone"
                  placeholder="Telefon Numarası"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary cta-submit">
                Ücretsiz Demo İste
              </button>
              <p className="form-note">
                Bilgileriniz güvenli şekilde saklanır ve üçüncü taraflarla paylaşılmaz.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
