import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Pricing.css';

const Pricing = () => {
  const navigate = useNavigate();
  const [isYearly, setIsYearly] = useState(false);

  const handlePlanSelect = (planName) => {
    navigate('/#features');
    setTimeout(() => {
      const featuresSection = document.getElementById('features');
      if (featuresSection) {
        featuresSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const plans = [
    {
      name: 'Basic',
      icon: '🟢',
      monthlyPrice: 9.99,
      yearlyPrice: 8.49,
      features: [
        'Ayda 10 içerik',
        'Temel trend analizi',
        'Manuel paylaşım',
        'Temel veriler',
        '1 hesap',
        'E-posta desteği'
      ],
      color: '#10B981',
      popular: false
    },
    {
      name: 'Plus',
      icon: '🔵',
      monthlyPrice: 24.99,
      yearlyPrice: 19.99,
      features: [
        'Ayda 50 içerik',
        'Gerçek zamanlı analiz',
        'Zamanlama desteği',
        'Detaylı istatistikler',
        '3 hesap',
        'Chat + E-posta'
      ],
      color: '#3B82F6',
      popular: true
    },
    {
      name: 'Pro',
      icon: '🟣',
      monthlyPrice: 49.99,
      yearlyPrice: 37.49,
      features: [
        'Sınırsız içerik',
        'AI destekli analiz',
        'Tam otomatik',
        'Gelişmiş rapor',
        '10 hesap',
        'Öncelikli destek'
      ],
      color: '#8B5CF6',
      popular: false
    }
  ];

  return (
    <div className="pricing-page">
      <div className="container">
        <div className="pricing-header">
          <h1>Fiyatlandırma Planları</h1>
          <p>İhtiyacınıza en uygun planı seçin</p>
          
          <div className="billing-switch">
            <span className={!isYearly ? 'active' : ''}>Aylık</span>
            <label className="switch">
              <input 
                type="checkbox" 
                checked={isYearly}
                onChange={(e) => setIsYearly(e.target.checked)}
              />
              <span className="slider"></span>
            </label>
            <span className={isYearly ? 'active' : ''}>
              Yıllık <span className="discount">%15-25 İndirim</span>
            </span>
          </div>
        </div>

        <div className="pricing-cards">
          {plans.map((plan, index) => (
            <div 
              key={plan.name}
              className={`pricing-card ${plan.popular ? 'popular' : ''}`}
              style={{ '--plan-color': plan.color }}
            >
              {plan.popular && (
                <div className="popular-badge">En Popüler</div>
              )}
              
              <div className="card-header">
                <div className="plan-icon">{plan.icon}</div>
                <h3>{plan.name}</h3>
                <div className="price">
                  <span className="amount">
                    ${isYearly ? plan.yearlyPrice : plan.monthlyPrice}
                  </span>
                  <span className="period">/ {isYearly ? 'yıl' : 'ay'}</span>
                </div>
                {isYearly && (
                  <div className="savings">
                    Yıllık tasarruf: ${((plan.monthlyPrice * 12) - plan.yearlyPrice).toFixed(2)}
                  </div>
                )}
              </div>

              <div className="features">
                {plan.features.map((feature, idx) => (
                  <div key={idx} className="feature">
                    <span className="check">✓</span>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              <button 
                className="select-plan-btn"
                onClick={() => handlePlanSelect(plan.name)}
              >
                {plan.popular ? 'Hemen Başla' : 'Planı Seç'}
              </button>
            </div>
          ))}
        </div>

        <div className="pricing-info">
          <div className="info-grid">
            <div className="info-item">
              <div className="info-icon">🆓</div>
              <div className="info-text">
                <h4>7 Gün Ücretsiz</h4>
                <p>Tüm planları risk almadan deneyin</p>
              </div>
            </div>
            <div className="info-item">
              <div className="info-icon">🔄</div>
              <div className="info-text">
                <h4>Esnek İptal</h4>
                <p>İstediğiniz zaman iptal edebilirsiniz</p>
              </div>
            </div>
            <div className="info-item">
              <div className="info-icon">🔒</div>
              <div className="info-text">
                <h4>Güvenli Ödeme</h4>
                <p>SSL şifreleme ile güvenli işlemler</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;