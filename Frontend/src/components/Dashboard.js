import React, { useState } from 'react';
import './Dashboard.css';
import Sidebar from './Sidebar';
import axios from 'axios'; // Dosya başına ekleyin

const Dashboard = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [prompt, setPrompt] = useState('');
  const [generatedDescription, setGeneratedDescription] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTool, setActiveTool] = useState('content-generator');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [result, setResult] = useState(null); // Add this new state
  const [videoPrompt, setVideoPrompt] = useState('');
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [videoResult, setVideoResult] = useState(null);
  const [isEnhancingPrompt, setIsEnhancingPrompt] = useState(false); // yeni
  const [isEnhancingImagePrompt, setIsEnhancingImagePrompt] = useState(false); // yeni
  const AZURE_BACKEND_BASE_URL = 'https://sellama-dxfqa7akcxhsa8gv.eastasia-01.azurewebsites.net';

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setSelectedImage(ev.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!selectedImage) {
      alert('Lütfen önce bir fotoğraf yükleyin!');
      return;
    }

    setIsGenerating(true);
    
    try {
      // Fotoğrafı FormData ile backend'e gönder
      const formData = new FormData();
      const response = await fetch(selectedImage);
      const blob = await response.blob();
      formData.append('file', blob, 'uploaded-image.jpg');
      formData.append('category', selectedCategory);
      formData.append('target_audience', targetAudience);
      formData.append('prompt', prompt);

      const captionResponse = await fetch(`${AZURE_BACKEND_BASE_URL}/generate-caption/`, {
        method: 'POST',
        body: formData,
      });

      if (!captionResponse.ok) {
        throw new Error('Caption oluşturulamadı');
      }

      const captionData = await captionResponse.json();
      setGeneratedDescription(captionData.caption);
    } catch (error) {
      console.error('API Hatası:', error);
      setGeneratedDescription(`Hata: ${error.message}. Lütfen backend sunucusunun çalıştığından emin olun.`);
    } finally {
      setIsGenerating(false);
    }
  };

  // Yeni: Paylaşım zamanı tavsiyesi alma fonksiyonu
  const [postingAdvice, setPostingAdvice] = useState('');
  const [isLoadingAdvice, setIsLoadingAdvice] = useState(false);

  // Yeni state'ler: arka plan düzenleme
  const [backgroundPrompt, setBackgroundPrompt] = useState('');
  const [isApplyingBackground, setIsApplyingBackground] = useState(false);
  const [isRemovingBackground, setIsRemovingBackground] = useState(false);
  const [editedImage, setEditedImage] = useState(null);
  const [error, setError] = useState('');

  // handleGetCaptionAdvice fonksiyonunu güncelle
const handleGetCaptionAdvice = async () => {
  setIsLoadingAdvice(true);
  try {
    // API çağrısı - artık formData göndermeye gerek yok
    const adviceResponse = await fetch(`${AZURE_BACKEND_BASE_URL}/get-posting-advice/`, {
      method: 'GET'
    });

    if (!adviceResponse.ok) {
      throw new Error('Tavsiye alınamadı');
    }

    const adviceData = await adviceResponse.json();
    setPostingAdvice(adviceData.tavsiye);
  } catch (error) {
    console.error('Tavsiye API Hatası:', error);
    setPostingAdvice(`Hata: ${error.message}`);
  } finally {
    setIsLoadingAdvice(false);
  }
};

  const handleClear = () => {
    setSelectedImage(null);
    setPrompt('');
    setGeneratedDescription('');
    setPostingAdvice('');
    setSelectedCategory('');
    setTargetAudience('');
    // setAbility1Result(''); // Kaldırıldı
  };

  const handleToolSelect = (toolId) => {
    setActiveTool(toolId);
  };

  const handleEnhancePrompt = async (currentPrompt, style = 'cinematic, photorealistic', setTarget = setVideoPrompt) => {
    if (!currentPrompt || !currentPrompt.trim()) {
      setError('Lütfen önce bir kısa prompt girin');
      return;
    }
    setIsEnhancingPrompt(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('prompt', currentPrompt);
      // Backend API'nizdeki parametre adını kullanın: 
      // Eğer backend'de 'style' ise 'style' kullanın. Eğer 'promptBasic' ise 'promptBasic' kullanın.
      // Benim önceki önerimde 'style' idi, sizinkinde 'promptBasic'e çevrilmişti.
      formData.append('promptBasic', style); // <--- DÜZELTME 1: Parametre adını backend ile eşleştirme

      const res = await axios.post(`${AZURE_BACKEND_BASE_URL}/enhance-image-prompt/`, formData, { // <--- DÜZELTME 2: Doğru Azure URL'si kullanıldı
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data && res.data.enhanced_prompt) {
        // hedef setter ile geliştirilen metni ilgili alana yaz
        setTarget(res.data.enhanced_prompt.trim());
      } else {
        setError('Geliştirilmiş prompt alınamadı');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || err.message || 'Bir hata oluştu');
    } finally {
      setIsEnhancingPrompt(false);
    }
  };

  // Video creator bölümündeki prompt enhancement butonu kodunu güncelleyin
const handleVideoEnhancePrompt = async () => {
  if (!videoPrompt.trim()) {
    setError('Lütfen önce bir açıklama yazın');
    return;
  }
  
  setError('');
  setIsEnhancingPrompt(true);
  
  try {
    const formData = new FormData();
    // Backend'deki parametre isimleriyle eşleştirme
    formData.append('prompt', videoPrompt); 
    formData.append('style', 'cinematic, professional video, smooth transitions');

    const response = await axios.post('http://localhost:8001/enhance-image-prompt', formData);

    if (response.data && response.data.enhanced_prompt) {
      setVideoPrompt(response.data.enhanced_prompt);
    } else {
      throw new Error('Prompt iyileştirilemedi');
    }
  } catch (err) {
    console.error('Prompt Enhancement Error:', err);
    setError(err.response?.data?.detail || 'Prompt iyileştirme sırasında bir hata oluştu');
  } finally {
    setIsEnhancingPrompt(false);
  }
};

  return (
    <div className="dashboard">
      <Sidebar onToolSelect={handleToolSelect} activeTool={activeTool} />
      <div className="dashboard-container">
        <div className={`dashboard-content ${activeTool === 'image-editor' ? 'wide' : ''}`}>
          {/* Ürün fotoğrafı ve açıklaması sadece İçerik Üretimi ve Otomatik Paylaşım sayfalarında göster */}
          {(activeTool === 'content-generator' || activeTool === 'auto-scheduler') && (
            <>
              <div className="upload-section">
                <div className="upload-area">
                  {selectedImage ? (
                    <div className="image-preview">
                      <img src={selectedImage} alt="Uploaded" />
                      <button 
                        className="remove-image"
                        onClick={() => setSelectedImage(null)}
                      >
                        ×
                      </button>
                    </div>
                  ) : (
                    <div className="upload-placeholder">
                      <h3>Ürün Fotoğrafı Yükle</h3>
                      <p>Sürükle bırak veya tıklayarak seç</p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="file-input"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="prompt-section">
                <label htmlFor="prompt" className="prompt-label">
                  Ürün Açıklaması
                </label>
                <textarea
                  id="prompt"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Örnek: Bu ürün için Instagram postu oluştur, müşteri odaklı, satış yönelimli açıklama..."
                  className="prompt-input"
                  rows="4"
                />
              </div>
            </>
          )}

          {/* Aktif tool'a göre içerik göster */}
          {activeTool === 'content-generator' && generatedDescription && (
            <div className="result-section">
              <div className="result-header">
                <h3>Oluşturulan İçerik</h3>
                <button 
                  className="copy-btn" 
                  onClick={() => navigator.clipboard.writeText(generatedDescription)}
                >
                  Kopyala
                </button>
              </div>
              <div className="result-content">
                <p>{generatedDescription}</p>
              </div>
              <div className="result-actions">
                <button className="action-btn primary">Instagram'a Paylaş</button>
                <button className="action-btn secondary">Facebook'a Paylaş</button>
                <button className="action-btn secondary">Otomatik Zamanla</button>
                </div>
            </div>
          )}

          {activeTool === 'trend-analyzer' && (
            <div className="trend-analysis-section">
              <div className="section-header">
                <h3>En İyi Paylaşım Analizi</h3>
                <p>AI analizine göre en etkili paylaşım zamanlarını öğrenin</p>
              </div>
              
              <div className="advice-actions">
                <button 
                  className={`advice-btn ${isLoadingAdvice ? 'loading' : ''}`}
                  onClick={handleGetCaptionAdvice}
                  disabled={isLoadingAdvice}
                >
                  {isLoadingAdvice ? 'Analiz Yapılıyor...' : 'AI Analiz Yap'}
                </button>
              </div>

              {/* Analiz sonucunu göster */}
              {postingAdvice && (
                <div className="advice-result">
                  <h4>AI Analiz Sonucu</h4>
                  <div className="advice-content">
                    <p>{postingAdvice}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTool === 'auto-scheduler' && (
            <div className="scheduler-section">
              <div className="section-header">
                <h3>Otomatik Paylaşım Zamanlayıcısı</h3>
                <p>AI'ın önerdiği zamanda otomatik paylaşım yapın</p>
              </div>
              
              <div className="scheduler-options">
                <div className="schedule-card">
                  <h4>Instagram Paylaşımı</h4>
                  <p>En iyi zamanda otomatik paylaşım</p>
                  <button className="schedule-btn">Zamanla</button>
                </div>
                
                <div className="schedule-card">
                  <h4>Facebook Paylaşımı</h4>
                  <p>En iyi zamanda otomatik paylaşım</p>
                  <button className="schedule-btn">Zamanla</button>
                </div>
                
                <div className="schedule-card">
                  <h4>Çoklu Platform</h4>
                  <p>Tüm platformlarda senkronize paylaşım</p>
                  <button className="schedule-btn primary">Zamanla</button>
                </div>
              </div>
            </div>
          )}

          {/* Kategori ve Hedef Kitle sadece İçerik Üretimi ve Otomatik Paylaşım sayfalarında göster */}
          {(activeTool === 'content-generator' || activeTool === 'auto-scheduler') && (
            <>
              <div className="category-section">
                <label htmlFor="category" className="category-label">
                  Kategori
                </label>
                <select
                  id="category"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="category-select"
                >
                  <option value="">Kategori Seçin</option>
                  <option value="fashion">Moda & Giyim</option>
                  <option value="electronics">Elektronik</option>
                  <option value="home">Ev & Yaşam</option>
                  <option value="beauty">Güzellik & Bakım</option>
                  <option value="sports">Spor & Fitness</option>
                  <option value="food">Yemek & İçecek</option>
                  <option value="books">Kitap & Eğitim</option>
                  <option value="automotive">Otomotiv</option>
                  <option value="jewelry">Mücevher & Aksesuar</option>
                  <option value="toys">Oyuncak & Hobi</option>
                </select>
              </div>

              <div className="target-audience-section">
                <label htmlFor="targetAudience" className="target-audience-label">
                  Hedef Kitle
                </label>
                <select
                  id="targetAudience"
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  className="target-audience-select"
                >
                  <option value="">Hedef Kitle Seçin</option>
                  <option value="gen-z">Gen Z (18-25 yaş)</option>
                  <option value="millennials">Millennials (26-40 yaş)</option>
                  <option value="gen-x">Gen X (41-55 yaş)</option>
                  <option value="boomers">Boomers (55+ yaş)</option>
                  <option value="professionals">Profesyoneller</option>
                  <option value="students">Öğrenciler</option>
                  <option value="parents">Ebeveynler</option>
                  <option value="entrepreneurs">Girişimciler</option>
                  <option value="luxury">Lüks Tüketiciler</option>
                  <option value="budget">Bütçe Odaklı</option>
                </select>
              </div>
            </>
          )}


          {/* Generate butonu sadece İçerik Üretimi sayfasında göster */}
          {activeTool === 'content-generator' && (
            <div className="generate-section">
              <button 
                className={`generate-btn ${isGenerating ? 'generating' : ''}`}
                onClick={handleGenerate}
                disabled={isGenerating || !selectedImage || !prompt.trim() || !selectedCategory || !targetAudience}
              >
                {isGenerating ? 'Açıklama Oluşturuluyor...' : 'Açıklama Oluştur'}
              </button>
            </div>
          )}

          {activeTool === 'image-editor' && (
            <div className="image-editor-section">
              <div className="section-header">
                <h3>Resim Düzenleme</h3>
                <p>İstediğiniz düzenleme türünü seçin</p>
              </div>

              <div className="editor-cards">
                <div className="editor-card" onClick={() => setActiveTool('background-editor')}>
                  <div className="card-icon">🖼️</div>
                  <h4>Arka Plan Düzenle</h4>
                  <p>Fotoğrafın arka planını değiştir, kaldır veya bulanıklaştır.</p>
                </div>

                <div className="editor-card" onClick={() => setActiveTool('theme-editor')}>
                  <div className="card-icon">🎨</div>
                  <h4>Tema Uygula</h4>
                  <p>Tek bir kelime ile resme sanatsal veya mevsimsel temalar ekle.</p>
                </div>

                <div className="editor-card" onClick={() => setActiveTool('lighting-editor')}>
                  <div className="card-icon">💡</div>
                  <h4>Işıklandırma Ekle</h4>
                  <p>Resme gün batımı, stüdyo veya dramatik ışık efektleri uygula.</p>
                </div>

                <div className="editor-card premium" onClick={() => setActiveTool('free-editor')}>
                  <div className="premium-badge">Premium</div>
                  <div className="card-icon">✨</div>
                  <h4>Serbest Düzenleme</h4>
                  <p>Yazılı komutlarla (prompt) istediğin her türlü değişikliği yap.</p>
                </div>
              </div>
            </div>
          )}

          {/* Arka plan düzenleme sayfası: fotoğraf yükleme + arka plan string */}
          {activeTool === 'background-editor' && (
            <div className="background-editor-section">
              <div className="section-header">
                <h3>Arka Plan Düzenle</h3>
                <p>Fotoğraf yükleyin ve nasıl değiştirmek istediğinizi yazın</p>
              </div>

              <div className="upload-section">
                <div className="upload-area">
                  {selectedImage ? (
                    <div className="image-preview">
                      <img src={selectedImage} alt="Uploaded" />
                      <button
                        className="remove-image"
                        onClick={() => {
                          setSelectedImage(null);
                          setEditedImage(null);
                          setError('');
                        }}
                      >
                        ×
                      </button>
                    </div>
                  ) : (
                    <div className="upload-placeholder">
                      <h3>Fotoğraf Yükle</h3>
                      <p>Sürükle bırak veya tıklayarak seç</p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="file-input"
                      />
                    </div>
                  )}
                </div>
              </div>

              {error && <div className="error-message">{error}</div>}

              <div className="prompt-section">
                <label htmlFor="backgroundPrompt" className="prompt-label">
                  Nasıl değiştirmek istiyorsunuz? (İngilizce)
                </label>
                <input
                  id="backgroundPrompt"
                  type="text"
                  value={backgroundPrompt}
                  onChange={(e) => setBackgroundPrompt(e.target.value)}
                  placeholder="Örn: make the background beach, forest, mountains..."
                  className="prompt-input"
                />
              </div>

              <div className="generate-section" style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                <button
                  className={`generate-btn ${isApplyingBackground ? 'generating' : ''}`}
                  onClick={async () => {
                    if (!selectedImage) {
                      setError('Lütfen bir fotoğraf yükleyin');
                      return;
                    }
                    if (!backgroundPrompt.trim()) {
                      setError('Lütfen bir açıklama yazın');
                      return;
                    }
                    
                    setError('');
                    setIsApplyingBackground(true);
                    setResult(null); // Reset previous result
                    
                    try {
                      const formData = new FormData();
                      const response = await fetch(selectedImage);
                      const blob = await response.blob();
                      formData.append('image', blob, 'image.jpg');
                      formData.append('prompt', backgroundPrompt);

                      const result = await axios.post('http://localhost:8001/edit-image', formData, {
                        headers: {
                          'Content-Type': 'multipart/form-data',
                        },
                      });

                      if (result.data.success) {
                        setResult(result.data);
                      } else {
                        throw new Error('Fotoğraf düzenlenemedi');
                      }
                    } catch (err) {
                      console.error(err);
                      setError(err.response?.data?.detail || 'Bir hata oluştu');
                    } finally {
                      setIsApplyingBackground(false);
                    }
                  }}
                  disabled={isApplyingBackground}
                >
                  {isApplyingBackground ? 'Düzenleniyor...' : 'Arka Planı Değiştir'}
                </button>

                <button
                  className="clear-btn"
                  onClick={() => {
                    setSelectedImage(null);
                    setBackgroundPrompt('');
                    setError('');
                    setResult(null);
                    setActiveTool('image-editor');
                  }}
                >
                  Kapat
                </button>
              </div>

              {/* Sonuç bölümü */}
              {result && (
                <div className="result-section">
                  <h2>Düzenlenmiş Fotoğraf</h2>
                  <p><strong>Açıklama:</strong> {result.prompt}</p>
                  <img 
                    src={result.edited_image} 
                    alt="Düzenlenmiş fotoğraf" 
                    className="result-image"
                  />
                </div>
              )}
            </div>
          )}

          {activeTool === 'theme-editor' && (
  <div className="background-editor-section">
    <div className="section-header">
      <h3>Tema Uygula</h3>
      <p>Fotoğraf yükleyin ve uygulamak istediğiniz temayı seçin</p>
    </div>

    <div className="upload-section">
      <div className="upload-area">
        {selectedImage ? (
          <div className="image-preview">
            <img src={selectedImage} alt="Uploaded" />
            <button
              className="remove-image"
              onClick={() => {
                setSelectedImage(null);
                setError('');
                setResult(null);
              }}
            >
              ×
            </button>
          </div>
        ) : (
          <div className="upload-placeholder">
            <h3>Fotoğraf Yükle</h3>
            <p>Sürükle bırak veya tıklayarak seç</p>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="file-input"
            />
          </div>
        )}
      </div>
    </div>

    {error && <div className="error-message">{error}</div>}

    <div className="prompt-section">
      <label htmlFor="themePrompt" className="prompt-label">
        Tema seçin (İngilizce)
      </label>
      <input
        type="text"
        value={backgroundPrompt}
        onChange={(e) => setBackgroundPrompt(e.target.value)}
        placeholder="Örn: vintage, summer, winter, cyberpunk..."
        className="prompt-input"
      />
    </div>

    <div className="generate-section" style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
      <button
        className={`generate-btn ${isApplyingBackground ? 'generating' : ''}`}
        onClick={async () => {
          if (!selectedImage) {
            setError('Lütfen bir fotoğraf yükleyin');
            return;
          }
          if (!backgroundPrompt.trim()) {
            setError('Lütfen bir tema yazın');
            return;
          }
          
          setError('');
          setIsApplyingBackground(true);
          setResult(null);
          
          try {
            const formData = new FormData();
            const response = await fetch(selectedImage);
            const blob = await response.blob();
            formData.append('image', blob, 'image.jpg');
            formData.append('prompt', `apply ${backgroundPrompt} theme`);

            const result = await axios.post('http://localhost:8001/edit-image', formData, {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            });

            if (result.data.success) {
              setResult(result.data);
            } else {
              throw new Error('Tema uygulanamadı');
            }
          } catch (err) {
            console.error(err);
            setError(err.response?.data?.detail || 'Bir hata oluştu');
          } finally {
            setIsApplyingBackground(false);
          }
        }}
        disabled={isApplyingBackground}
      >
        {isApplyingBackground ? 'Tema Uygulanıyor...' : 'Tema Uygula'}
      </button>

      <button
        className="clear-btn"
        onClick={() => {
          setSelectedImage(null);
          setBackgroundPrompt('');
          setError('');
          setResult(null);
          setActiveTool('image-editor');
        }}
      >
        Kapat
      </button>
    </div>

    {result && (
      <div className="result-section">
        <h2>Düzenlenmiş Fotoğraf</h2>
        <p><strong>Uygulanan Tema:</strong> {result.prompt}</p>
        <img 
          src={result.edited_image} 
          alt="Düzenlenmiş fotoğraf" 
          className="result-image"
        />
      </div>
    )}
  </div>
)}

{activeTool === 'lighting-editor' && (
  <div className="background-editor-section">
    <div className="section-header">
      <h3>Işıklandırma Ekle</h3>
      <p>Fotoğraf yükleyin ve ışık efekti ekleyin</p>
    </div>

    {/* Same upload section */}
    <div className="upload-section">
      <div className="upload-area">
        {selectedImage ? (
          <div className="image-preview">
            <img src={selectedImage} alt="Uploaded" />
            <button
              className="remove-image"
              onClick={() => {
                setSelectedImage(null);
                setError('');
                setResult(null);
              }}
            >
              ×
            </button>
          </div>
        ) : (
          <div className="upload-placeholder">
            <h3>Fotoğraf Yükle</h3>
            <p>Sürükle bırak veya tıklayarak seç</p>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="file-input"
            />
          </div>
        )}
      </div>
    </div>

    {error && <div className="error-message">{error}</div>}

    <div className="prompt-section">
      <label htmlFor="lightingPrompt" className="prompt-label">
        Işık efekti seçin (İngilizce)
      </label>
      <input
        type="text"
        value={backgroundPrompt}
        onChange={(e) => setBackgroundPrompt(e.target.value)}
        placeholder="Örn: sunset, studio lighting, dramatic, soft..."
        className="prompt-input"
      />
    </div>

    <div className="generate-section" style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
      <button
        className={`generate-btn ${isApplyingBackground ? 'generating' : ''}`}
        onClick={async () => {
          if (!selectedImage) {
            setError('Lütfen bir fotoğraf yükleyin');
            return;
          }
          if (!backgroundPrompt.trim()) {
            setError('Lütfen bir ışık efekti yazın');
            return;
          }
          
          setError('');
          setIsApplyingBackground(true);
          setResult(null);
          
          try {
            const formData = new FormData();
            const response = await fetch(selectedImage);
            const blob = await response.blob();
            formData.append('image', blob, 'image.jpg');
            formData.append('prompt', `add ${backgroundPrompt} lighting effect`);

            const result = await axios.post('http://localhost:8001/edit-image', formData, {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            });

            if (result.data.success) {
              setResult(result.data);
            } else {
              throw new Error('Işık efekti uygulanamadı');
            }
          } catch (err) {
            console.error(err);
            setError(err.response?.data?.detail || 'Bir hata oluştu');
          } finally {
            setIsApplyingBackground(false);
          }
        }}
        disabled={isApplyingBackground}
      >
        {isApplyingBackground ? 'Efekt Uygulanıyor...' : 'Efekt Uygula'}
      </button>

      <button
        className="clear-btn"
        onClick={() => {
          setSelectedImage(null);
          setBackgroundPrompt('');
          setError('');
          setResult(null);
          setActiveTool('image-editor');
        }}
      >
        Kapat
      </button>
    </div>

    {result && (
      <div className="result-section">
        <h2>Düzenlenmiş Fotoğraf</h2>
        <p><strong>Uygulanan Efekt:</strong> {result.prompt}</p>
        <img 
          src={result.edited_image} 
          alt="Düzenlenmiş fotoğraf" 
          className="result-image"
        />
      </div>
    )}
  </div>
)}

{activeTool === 'free-editor' && (
  <div className="background-editor-section">
    <div className="section-header">
      <h3>Serbest Düzenleme</h3>
      <p>Fotoğraf yükleyin ve istediğiniz değişikliği yazın</p>
      <div className="premium-badge">Premium Özellik</div>
    </div>

    {/* Same upload section */}
    <div className="upload-section">
      <div className="upload-area">
        {selectedImage ? (
          <div className="image-preview">
            <img src={selectedImage} alt="Uploaded" />
            <button
              className="remove-image"
              onClick={() => {
                setSelectedImage(null);
                setError('');
                setResult(null);
              }}
            >
              ×
            </button>
          </div>
        ) : (
          <div className="upload-placeholder">
            <h3>Fotoğraf Yükle</h3>
            <p>Sürükle bırak veya tıklayarak seç</p>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="file-input"
            />
          </div>
        )}
      </div>
    </div>

    {error && <div className="error-message">{error}</div>}

    <div className="prompt-section">
      <label htmlFor="freePrompt" className="prompt-label">
        İstediğiniz değişikliği yazın (İngilizce)
      </label>
      <textarea
        id="freePrompt"
        value={backgroundPrompt}
        onChange={(e) => setBackgroundPrompt(e.target.value)}
        placeholder="Örn: make it look like an oil painting, add snow effect..."
        className="prompt-input"
        rows="4"
      />
      <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 10 }}>
        <button
          className="generate-btn"
          type="button"
          onClick={() => handleEnhancePrompt(backgroundPrompt, 'photorealistic', setBackgroundPrompt)} 
          disabled={isEnhancingPrompt || !backgroundPrompt.trim()}
        >
          {isEnhancingPrompt ? 'Geliştiriliyor...' : 'Gelişmiş Prompt Al'}
        </button>
        <button
          className="clear-btn"
          type="button"
          onClick={() => { setBackgroundPrompt(''); setError(''); }}
        >
          Temizle
        </button>
      </div>
    </div>

    <div className="generate-section" style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
      <button
        className={`generate-btn premium ${isApplyingBackground ? 'generating' : ''}`}
        onClick={async () => {
          if (!selectedImage) {
            setError('Lütfen bir fotoğraf yükleyin');
            return;
          }
          if (!backgroundPrompt.trim()) {
            setError('Lütfen yapmak istediğiniz değişikliği yazın');
            return;
          }
          
          setError('');
          setIsApplyingBackground(true);
          setResult(null);
          
          try {
            const formData = new FormData();
            const response = await fetch(selectedImage);
            const blob = await response.blob();
            formData.append('image', blob, 'image.jpg');
            formData.append('prompt', backgroundPrompt);

            const result = await axios.post('http://localhost:8001/edit-image', formData, {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            });

            if (result.data.success) {
              setResult(result.data);
            } else {
              throw new Error('Düzenleme yapılamadı');
            }
          } catch (err) {
            console.error(err);
            setError(err.response?.data?.detail || 'Bir hata oluştu');
          } finally {
            setIsApplyingBackground(false);
          }
        }}
        disabled={isApplyingBackground}
      >
        {isApplyingBackground ? 'Düzenleniyor...' : 'Değişiklikleri Uygula'}
      </button>

      <button
        className="clear-btn"
        onClick={() => {
          setSelectedImage(null);
          setBackgroundPrompt('');
          setError('');
          setResult(null);
          setActiveTool('image-editor');
        }}
      >
        Kapat
      </button>
    </div>

    {result && (
      <div className="result-section">
        <h2>Düzenlenmiş Fotoğraf</h2>
        <p><strong>Yapılan Değişiklik:</strong> {result.prompt}</p>
        <img 
          src={result.edited_image} 
          alt="Düzenlenmiş fotoğraf" 
          className="result-image"
        />
      </div>
    )}
  </div>
)}

{activeTool === 'video-creator' && (
  <div className="video-creator-section">
    <div className="section-header">
      <h3>Video Oluştur</h3>
      <p>Fotoğraf yükleyin ve video için açıklama yazın</p>
    </div>

    <div className="upload-section">
      <div className="upload-area">
        {selectedImage ? (
          <div className="image-preview">
            <img src={selectedImage} alt="Uploaded" />
            <button
              className="remove-image"
              onClick={() => {
                setSelectedImage(null);
                setVideoResult(null);
                setError('');
              }}
            >
              ×
            </button>
          </div>
        ) : (
          <div className="upload-placeholder">
            <h3>Fotoğraf Yükle</h3>
            <p>Sürükle bırak veya tıklayarak seç</p>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="file-input"
            />
          </div>
        )}
      </div>
    </div>

    {error && <div className="error-message">{error}</div>}

    <div className="prompt-section">
      <label htmlFor="videoPrompt" className="prompt-label">
        Video için açıklama yazın (İngilizce)
      </label>
      <textarea
        id="videoPrompt"
        value={videoPrompt}
        onChange={(e) => setVideoPrompt(e.target.value)}
        placeholder="Örn: create a product showcase video with modern transitions..."
        className="prompt-input"
        rows="4"
      />
     <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 10 }}>
       <button
         className="generate-btn"
         type="button"
         onClick={() => handleEnhancePrompt(videoPrompt)}
         disabled={isEnhancingPrompt || !videoPrompt.trim()}
       >
         {isEnhancingPrompt ? 'Geliştiriliyor...' : 'Gelişmiş Prompt Al'}
       </button>
       <button
         className="clear-btn"
         type="button"
         onClick={() => { setVideoPrompt(''); setError(''); }}
       >
         Temizle
       </button>
     </div>
    </div>

    <div className="generate-section" style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
      <button
        className={`generate-btn ${isGeneratingVideo ? 'generating' : ''}`}
        onClick={async () => {
          if (!selectedImage) {
            setError('Lütfen bir fotoğraf yükleyin');
            return;
          }
          if (!videoPrompt.trim()) {
            setError('Lütfen bir açıklama yazın');
            return;
          }

          setError('');
          setIsGeneratingVideo(true);
          setVideoResult(null);

          try {
            const formData = new FormData();
            const resp = await fetch(selectedImage);
            const blob = await resp.blob();
            formData.append('image', blob, 'image.jpg'); // backend expects 'image'
            formData.append('prompt', videoPrompt);

            const res = await axios.post('http://localhost:8002/image-to-video', formData, {
              headers: { 'Content-Type': 'multipart/form-data' },
            });

            if (res.data && res.data.success) {
              setVideoResult(res.data);
            } else {
              throw new Error(res.data?.detail || 'Video oluşturulamadı');
            }
          } catch (err) {
            console.error(err);
            setError(err.response?.data?.detail || err.message || 'Bir hata oluştu');
          } finally {
            setIsGeneratingVideo(false);
          }
        }}
        disabled={isGeneratingVideo}
      >
        {isGeneratingVideo ? 'Video Oluşturuluyor...' : 'Video Oluştur'}
      </button>

      <button
        className="clear-btn"
        onClick={() => {
          setSelectedImage(null);
          setVideoPrompt('');
          setError('');
          setVideoResult(null);
          setActiveTool('content-generator');
        }}
      >
        Kapat
      </button>
    </div>

    {/* Video Result Section */}
    {videoResult && (
      <div className="result-section">
        <h2>Oluşturulan Video</h2>
        <p><strong>Açıklama:</strong> {videoResult.prompt}</p>
        <div className="video-preview">
          <video 
            controls 
            src={videoResult.video_url}
            className="result-video"
            style={{ width: '100%', maxWidth: 720 }}
          />
        </div>
      </div>
    )}
  </div>
)}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;