# 🧠 Llama&Flux AI Image & Video Generator

Bu proje, **Llama tabanlı yapay zekâ destekli bir medya içerik üretim ve sosyal medya gönderi analiz platformudur**. Sistem hem **image-to-image** hem de **image-to-video** özelliklerini destekler ve Llama-4-Maverick aracılığıyla ürün görsellerine akıllı altyazı (caption) oluşturur, etkileşim analizleri yapar.

Uygulama, içerik üretimini destekleyen iki temel bileşenden oluşur:

- Llama-4-Maverick-17B-128E-Instruct-FP8**: Görsellerin açıklama (caption) metinlerini oluşturur ve sosyal medya etkileşim analizlerini yapar.
- FLUX.1-Kontext-pro**: Hem **image-to-image** hem **image-to-video** işlemlerinde kullanılan görsel üretim modelidir.

---

##  Ana Özellikler

-  **Image-to-Image Dönüşüm**: Kullanıcının yüklediği görseli yeniden üretir, stil değiştirir veya konseptini geliştirir.  
-  **Image-to-Video Üretimi**: Statik bir görseli hareketlendirilmiş video haline getirir.  
-  **Akıllı Caption & Etkileşim Analizi**: Llama-4-Maverick modelini kullanarak ürün görselleri için etkileyici açıklamalar, hashtag ve trend tahminleri yapar.  
-  **AI Etkileşim Tahmini**: Gönderinin olası beğeni, yorum ve görüntüleme oranlarını analiz eder.  
-  **Modüler Yapı**: Flux altyapısı üzerinden geliştirilebilir API endpoint’leri sunar.  
-  **Tamamen Lokal veya Sunucuya Dağıtılabilir**: GPU destekli ortamlarda hızlı çalışır.

---

##  Kurulum

###  Depoyu Klonla
```bash
git clone https://github.com/aligokcay/Llama-hackathon
cd llama-ai-generator
```

###  Sanal Ortam ve Bağımlılıklar
```bash
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

###  Ortam Değişkenlerini Ayarla
`.env` dosyası oluştur:
```
LLAMA_API_KEY=YOUR_LLAMA_API_KEY //Buraya Llama API Key'inizi girmeniz gerekiyor
FLUX_API_KEY=YOUR_FLUX_API_KEY   //Buraya Flux API Key'inizi girmeniz gerekiyor
PORT=5000
```

###  Sunucuyu Başlat
```bash
python app.py
```
Sunucu: `http://127.0.0.1:5000`

---

##  Kullanım

###  Image-to-Image Üretimi 

curl -X POST -F "image=@sample.jpg"      -F "prompt=Van Gogh tarzında yeniden yorumla"      http://127.0.0.1:5000/generate-image 
//Bu aşamada promptu ilgili container'a yazıp ürün görselini image box'a importlayarak AI'dan dönüş bekliyoruz.

Yanıt:
```json
{
  "status": "success",
  "model": "FLUX.1-Kontext-pro",
  "output": "/outputs/image_001.png" //Bu aşamada verdiğimiz prompta ve görsele göre bize istediğimiz görseli üreten bir AI'a sahibiz.
}

```

###  Image-to-Video Üretimi
```bash
curl -X POST -F "image=@sample.jpg"      -F "prompt=deniz kenarında gün batımı efektiyle canlandır"      http://127.0.0.1:5000/generate-video
```
Yanıt:
```json
{
  "status": "success",
  "model": "FLUX.1-Kontext-pro",
  "video_url": "/outputs/video_001.mp4"
}
```

###  Caption & Etkileşim Analizi
```bash
curl -X POST -F "image=@product.jpg"      http://127.0.0.1:5000/analyze-caption
```
Yanıt:
```json
{
  "status": "success",
  "model": "Llama-4-Maverick-17B-128E-Instruct-FP8",
  "caption": "Yeni sezon sınırlı üretim deri ceket – cesur tarzını yansıt! 🧥🔥", // Bu aşamada Llama-4-Maverick modeli görseli yorumlayarak en uygun ve etkileşim alabilecek captionu bizim için yazar.
  "engagement_prediction": {
    "likes": ">3.2K",
    "comments": ">180",
    "reach": ">25K"
  }
}
```

---

##  API Endpoint’leri

| Endpoint            | Metot  | Model                                  | Açıklama 
|-----------          |--------|---------                               |-------------
| `/generate-image`   | POST   | FLUX.1-Kontext-pro                     | Görselden yeni görsel üretir 
| `/generate-video`   | POST   | WAN2.2                                 | Görselden video üretir 
| `/analyze-caption`  | POST   | Llama-4-Maverick-17B-128E-Instruct-FP8 | Görsel caption ve etkileşim analizini yapar 
| `/status/<id>`      | GET    | -                                      | Görev durumunu sorgular

---

##  Kullanılan Yapay Zekâ Modelleri

###  **Llama-4-Maverick-17B-128E-Instruct-FP8**
- **Amaç:** Metin üretimi, caption yazma, etkileşim analizi.
- **Avantajlar:**
  - İleri düzey dil anlama ve sosyal medya metrik analiz kabiliyeti.
  - Prompt temelli ince ayar (instruction-tuned) yapısı.

###  **FLUX.1-Kontext-pro**
- **Amaç:** Görsel ve video üretimi.
- **Destek:** Image-to-Image ve Image-to-Video modları.
- **Avantajlar:**
  - Yüksek çözünürlükte hızlı üretim.
  - Görsel bağlam ve prompt uyumunu optimize eder.

  ### **wan/v2.2-a14b**
  **Amaç** Yapay zeka ile video üretimi.
  **Avantajlar** 
  - Yüksek çözünürlüklü hızlı üretilen videolar
  - Görsel bağlam ve prompta göre akan bir mp4/mkv dosyası oluşturulur.

---

##  Gereksinimler
- Python 3.10+ tabanlı bir backend
- React tabanlı bir frontend
- Llama,wan/v2.2-a14b ve Flux API key'leri
---

##  Geliştiriciler
- **Ad:** Osman Gazi Keleş, Mert Sürmeli, Yusuf Emir Altınkaynak, Mehmet Ali Gökçay
- **Teknolojiler:** Python, Flux, Llama,  
- **E-posta:** osmangkeles689@gmail.com, surmelimert2@gmail.com, altinkaynakyusufemir@gmail.com, magokcay11@gmail.com
- **Lisans:** Yıldız Teknik Üniversitesi

---

##  Lisans
Bu proje [Make It Better] altında yayınlanmıştır.

---

##  Önizleme
![Demo Screenshot](./static/demo-preview.gif)

