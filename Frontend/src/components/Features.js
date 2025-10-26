import React from 'react';
import './Features.css';

const Features = () => {
  const features = [
    {
      icon: '🤖',
      title: 'AI İçerik Üretimi',
      description: 'Yapay zeka ile otomatik post, hikaye ve reklam metinleri oluşturun. Marka sesinizi öğrenir ve tutarlı içerik üretir.'
    },
    {
      icon: '📱',
      title: 'Çoklu Platform Yönetimi',
      description: 'Instagram, Facebook, Twitter, LinkedIn ve TikTok hesaplarınızı tek yerden yönetin. Otomatik paylaşım ve zamanlama.'
    },
    {
      icon: '📊',
      title: 'Detaylı Analiz',
      description: 'Performans metrikleri, etkileşim oranları ve ROI analizi. Hangi içeriklerin daha etkili olduğunu öğrenin.'
    },
    {
      icon: '🎯',
      title: 'Hedef Kitle Analizi',
      description: 'Müşteri segmentasyonu ve kişiselleştirilmiş içerik önerileri. Doğru zamanda doğru kişilere ulaşın.'
    },
    {
      icon: '⚡',
      title: 'Otomatik Zamanlama',
      description: 'En yüksek etkileşim saatlerini analiz eder ve içeriklerinizi otomatik olarak optimize edilmiş zamanlarda paylaşır.'
    },
    {
      icon: '💰',
      title: 'ROI Takibi',
      description: 'Sosyal medya yatırımlarınızın geri dönüşünü ölçün. Hangi kampanyaların daha karlı olduğunu görün.'
    }
  ];

  return (
    <section id="features" className="features section">
      <div className="container">
        <h2 className="section-title">Güçlü Özellikler</h2>
        <p className="section-subtitle">
          AI teknolojisi ile sosyal medya yönetiminizi tamamen otomatikleştirin
        </p>
        
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
        
        <div className="features-cta">
          <h3>Hemen Başlayın</h3>
          <p>14 gün ücretsiz deneme ile tüm özellikleri keşfedin</p>
          <a href="#demo" className="btn btn-primary">Ücretsiz Deneme Başlat</a>
        </div>
      </div>
    </section>
  );
};

export default Features;
