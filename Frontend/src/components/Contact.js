import React, { useState } from 'react';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Mesajınız başarıyla gönderildi! En kısa sürede size dönüş yapacağız.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="contact-page">
      <div className="contact-container">
        <div className="contact-hero">
          <h1>İletişim</h1>
          <p>Bizimle iletişime geçin, sorularınızı yanıtlayalım</p>
        </div>

        <div className="contact-content">
          <div className="contact-info-section">
            <h2>İletişim Bilgileri</h2>
            
            <div className="contact-info-grid">
              <div className="contact-info-item">
                <div className="contact-icon">📧</div>
                <div className="contact-details">
                  <h3>E-posta</h3>
                  <a href="mailto:info@sellama.co">info@sellama.co</a>
                  <p>7/24 destek için bize yazın</p>
                </div>
              </div>

              <div className="contact-info-item">
                <div className="contact-icon">📞</div>
                <div className="contact-details">
                  <h3>Telefon</h3>
                  <a href="tel:+908503084623">+90 (850) 308 46 23</a>
                  <p>Pazartesi - Cuma: 09:00 - 18:00</p>
                </div>
              </div>

              <div className="contact-info-item">
                <div className="contact-icon">📍</div>
                <div className="contact-details">
                  <h3>Adres</h3>
                  <p>Yıldız Teknopark, Yıldız Teknik Üniversitesi<br/>
                  Davutpaşa Kampüsü, 34220 Esenler/İstanbul</p>
                </div>
              </div>
            </div>

            <div className="contact-features">
              <h3>Neden Bizimle İletişime Geçmelisiniz?</h3>
              <div className="features-list">
                <div className="feature-item">
                  <span className="check-icon">✓</span>
                  <span>7/24 teknik destek</span>
                </div>
                <div className="feature-item">
                  <span className="check-icon">✓</span>
                  <span>Ücretsiz danışmanlık</span>
                </div>
                <div className="feature-item">
                  <span className="check-icon">✓</span>
                  <span>Hızlı yanıt süresi</span>
                </div>
                <div className="feature-item">
                  <span className="check-icon">✓</span>
                  <span>Uzman ekibimiz</span>
                </div>
              </div>
            </div>
          </div>

          <div className="contact-form-section">
            <h2>Bize Mesaj Gönderin</h2>
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Ad Soyad *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Adınız ve soyadınız"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">E-posta *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="ornek@email.com"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="subject">Konu *</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  placeholder="Mesajınızın konusu"
                />
              </div>

              <div className="form-group">
                <label htmlFor="message">Mesaj *</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="6"
                  placeholder="Mesajınızı buraya yazın..."
                />
              </div>

              <button type="submit" className="btn btn-primary">
                Mesaj Gönder
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
