import React, { useState } from 'react';
import './TrendAnalysis.css';

const TrendAnalysis = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState(null);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    setError(null);
    setAnalysisResult(null);

    try {
      const response = await fetch('http://localhost:8000/get-posting-advice/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Trend analizi yapılamadı');
      }

      const data = await response.json();
      setAnalysisResult(data);
    } catch (error) {
      console.error('API Hatası:', error);
      setError(`Hata: ${error.message}. Lütfen backend sunucusunun çalıştığından emin olun.`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="trend-analysis">
      <div className="analysis-header">
        <h2>Trend Analizi</h2>
        <p>AI ile en iyi paylaşım zamanlarını analiz edin</p>
      </div>

      <div className="analysis-content">
        <button 
          className="analyze-btn"
          onClick={handleAnalyze}
          disabled={isAnalyzing}
        >
          {isAnalyzing ? 'Analiz Yapılıyor...' : 'Trend Analizi Başlat'}
        </button>

        {error && (
          <div className="error-message">
            <h3>Hata:</h3>
            <p>{error}</p>
          </div>
        )}

        {analysisResult && (
          <div className="analysis-result">
            <h3>AI Tavsiyesi:</h3>
            <div className="advice-content">
              <p>{analysisResult.tavsiye}</p>
            </div>
            
            <div className="analysis-details">
              <h4>Analiz Detayları:</h4>
              <p><strong>Platform:</strong> {analysisResult.platform}</p>
              <p><strong>Model:</strong> {analysisResult.model}</p>
            </div>

            {analysisResult.kullanilan_rapor && (
              <details className="technical-report">
                <summary>Teknik Rapor (Gelişmiş Kullanıcılar İçin)</summary>
                <pre>{analysisResult.kullanilan_rapor}</pre>
              </details>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TrendAnalysis;
