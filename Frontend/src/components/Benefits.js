import React from 'react';
import './Benefits.css';

const Benefits = () => {
  const benefits = [
    {
      title: 'Zaman Tasarrufu',
      description: 'Günde 5-6 saat sosyal medya yönetimi yerine, sadece 30 dakika ayırın.',
      icon: '⏰',
      stat: '95% Zaman Tasarrufu'
    },
    {
      title: 'Satış Artışı',
      description: 'AI destekli içerikler ile ortalama %300 satış artışı elde edin.',
      icon: '📈',
      stat: '+300% Satış'
    },
    {
      title: 'Maliyet Azaltma',
      description: 'Sosyal medya ajansı maliyetlerini %80 azaltın.',
      icon: '💰',
      stat: '%80 Maliyet Azaltma'
    }
  ];

  return (
    <section className="benefits section">
      <div className="container">
        <h2 className="section-title">Neden AI Sosyal Medya?</h2>
        <p className="section-subtitle">
          Küçük ve orta ölçekli işletmeler için özel olarak tasarlandı
        </p>
        
        <div className="benefits-grid">
          {benefits.map((benefit, index) => (
            <div key={index} className="benefit-card">
              <div className="benefit-icon">{benefit.icon}</div>
              <div className="benefit-content">
                <h3 className="benefit-title">{benefit.title}</h3>
                <p className="benefit-description">{benefit.description}</p>
                <div className="benefit-stat">{benefit.stat}</div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="testimonial">
          <div className="testimonial-content">
            <div className="quote-icon">"</div>
            <blockquote>
              "Bu platform sayesinde sosyal medya yönetimimiz tamamen otomatikleşti. 
              Satışlarımız %250 arttı ve haftada 20 saat zaman kazandık."
            </blockquote>
            <div className="testimonial-author">
              <div className="author-info">
                <div className="author-name">Ahmet Yılmaz</div>
                <div className="author-title">CEO, Moda Mağazası</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Benefits;
