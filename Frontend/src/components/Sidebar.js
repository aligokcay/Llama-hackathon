import React from 'react';
import './Sidebar.css';

const Sidebar = ({ onToolSelect, activeTool }) => {
  const tools = [
    {
      id: 'content-generator',
      name: 'Caption Üretimi',
      description: 'Ürün fotoğrafından AI ile sosyal medya captionu oluştur'
    },
    {
      id: 'trend-analyzer',
      name: 'Trend Analizi',
      description: 'Meta trendlerini analiz et, en iyi paylaşım saatini bul'
    },
    {
      id: 'auto-scheduler',
      name: 'Otomatik Paylaşım',
      description: 'AI\'ın önerdiği zamanda otomatik paylaşım yap'
    },
    {
      id: 'image-editor',
      name: 'Resim Düzenleme',
      description: 'AI ile resimleri profesyonel kalitede, satışa hazır fotoğraflara dönüştür.'
    },
    {
      id: 'video-creator',
      name: 'Video Oluştur',
      description: 'AI ile profesyonel kalitede video üret.'
    }
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <div className="logo-text">
            <span className="logo-main">seLlama</span>
            <span className="logo-tagline">We ship your story</span>
          </div>
        </div>
      </div>
      
      <div className="sidebar-content">
        <nav className="tools-nav">
          {tools.map((tool) => (
            <div
              key={tool.id}
              className={`tool-item ${activeTool === tool.id ? 'active' : ''}`}
              onClick={() => onToolSelect(tool.id)}
            >
              <div className="tool-info">
                <h4>{tool.name}</h4>
                <p>{tool.description}</p>
              </div>
            </div>
          ))}
        </nav>
      </div>
      
      <div className="sidebar-footer">
        <div className="user-info">
          <div className="user-avatar"></div>
          <div className="user-details">
            <p className="user-name">E-Ticaret Kullanıcısı</p>
            <p className="user-plan">Business Plan</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
