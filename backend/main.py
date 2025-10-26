import os
import base64
import httpx
from fastapi import FastAPI, UploadFile, File, HTTPException, status, Form
import pandas as pd
import traceback
import io 
from azure.storage.blob import BlobServiceClient # Blob Storage için gerekli
from fastapi.middleware.cors import CORSMiddleware

# --- AYARLAR ---

# Azure Llama/Meta Ayarları
AZURE_LLAMA_ENDPOINT = os.getenv("AZURE_LLAMA_ENDPOINT")
AZURE_LLAMA_KEY = os.getenv("AZURE_LLAMA_KEY")
LLAMA_DEPLOYMENT_NAME = os.getenv("LLAMA_DEPLOYMENT_NAME") 

# Azure FLUX Ayarları
AZURE_FLUX_ENDPOINT = os.getenv("AZURE_FLUX_ENDPOINT")
AZURE_FLUX_KEY = os.getenv("AZURE_FLUX_KEY")
FLUX_DEPLOYMENT_NAME = os.getenv("FLUX_DEPLOYMENT_NAME") 
FLUX_API_VERSION = os.getenv("FLUX_API_VERSION")

# [Blob Ayarları Kalsın] Azure Blob Storage ayarları
AZURE_STORAGE_CONNECTION_STRING = os.getenv("AZURE_STORAGE_CONNECTION_STRING")
AZURE_STORAGE_CONTAINER_NAME = os.getenv("AZURE_STORAGE_CONTAINER_NAME")
AZURE_STORAGE_BLOB_NAME = os.getenv("AZURE_STORAGE_BLOB_NAME") 

# Yeni Kontrol: Tüm gerekli ortam değişkenlerinin varlığını kontrol et
if not all([AZURE_LLAMA_ENDPOINT, AZURE_LLAMA_KEY, LLAMA_DEPLOYMENT_NAME, 
             AZURE_STORAGE_CONNECTION_STRING, AZURE_STORAGE_CONTAINER_NAME, AZURE_STORAGE_BLOB_NAME,
             AZURE_FLUX_ENDPOINT, AZURE_FLUX_KEY, FLUX_DEPLOYMENT_NAME]):
    raise EnvironmentError("Gerekli Azure Llama ayarlarından biri veya birkaçı (LLAMA_ENDPOINT/KEY/DEPLOYMENT, STORAGE_CONNECTION/CONTAINER/BLOB) bulunamadı.")


# [YENİ] Tüm veriyi hafızaya yüklemek için global değişken
GLOBAL_MOCK_DF = None

# --- FastAPI Uygulaması ---
app = FastAPI(
    # [GÜNCELLENDİ]
    title="Sosyal Medya AI Asistanı (Azure Llama)",
    description="Python, FastAPI ve Azure AI Studio/Meta Llama kullanarak fotoğraf başlığı oluşturan ve veriye göre paylaşım zamanı öneren API.",
    version="1.3.0"
)

origins = [
    "http://localhost:3000", # React'in çalıştığı yer
    "https://sellama-dxfqa7akcxhsa8gv.eastasia-01.azurewebsites.net" # Kendi domaininiz (opsiyonel ama iyi olur)
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins, 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Performans için Asenkron HTTP İstemcisi ---
client = httpx.AsyncClient(timeout=1000.0) 

@app.on_event("startup")
async def startup_event():
    global GLOBAL_MOCK_DF
    print("Uygulama başlıyor, mock data lokal 'mock_data.csv' dosyasından yükleniyor...")
    
    try:
        # ... (mock data yükleme kısmı aynı kalır)
        GLOBAL_MOCK_DF = pd.read_csv("mock_data.csv")
        print(f"'mock_data.csv' dosyasından '{GLOBAL_MOCK_DF.shape[0]}' satır başarıyla hafızaya yüklendi.")
        
    except FileNotFoundError:
        print("HATA: Lokal 'mock_data.csv' bulunamadı. Lütfen 'generate_data.py' script'ini çalıştırın ve dosyayı Azure'a yükleyin.")
        GLOBAL_MOCK_DF = pd.DataFrame() 
    except Exception as e:
        print(f"!!! KRİTİK BAŞLANGIÇ HATASI: {e}")
        traceback.print_exc()
        GLOBAL_MOCK_DF = pd.DataFrame()
            
    # Düzeltildi: Tek alt çizgi yerine çift alt çizgi kullanın.
    await client.__aenter__()

@app.on_event("shutdown")
async def shutdown_event():
    # Düzeltildi: Tek alt çizgi yerine çift alt çizgi kullanın.
    await client.__aexit__(None, None, None)


# --- YETENEK 1: Fotoğrafa Başlık Oluşturma (Azure Llama Vision) ---
@app.post(
    "/generate-caption/",
    # [GÜNCELLENDİ]
    summary="Fotoğrafa Başlık Oluştur (Azure Meta Llama Vision)",
)
async def create_caption(
    file: UploadFile = File(..., description="Ürün görseli"), # Dosya
    category: str = Form(..., description="Ürün kategorisi"), # Form verisi
    target_audience: str = Form(..., description="Hedef kitle"), # Form verisi
    prompt: str = Form(..., description="Kullanıcıdan gelen ek prompt"), # Form verisi
):
    
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Geçersiz dosya türü.")

    try:
        image_bytes = await file.read()
        mime_type = file.content_type if file.content_type in ["image/jpeg", "image/png"] else "image/jpeg"
        base64_image = base64.b64encode(image_bytes).decode("utf-8")
        
        # [DEĞİŞTİ] Azure Llama API Başlıkları
        headers = {
            "Content-Type": "application/json",
            "api-key": AZURE_LLAMA_KEY # Llama Key'i kullan
        }
        
        # [DEĞİŞTİ] API URL'si
        # Llama MaaS URL'si genellikle direkt REST Endpoint'in tamamıdır.
        AZURE_API_URL = f"{AZURE_LLAMA_ENDPOINT.rstrip('/')}/chat/completions"

        user_text_prompt = "Check out this photo. Create a creative caption and 3 hashtags in Turkish."

        user_text_prompt += f" My target audience: {target_audience}. " 
        user_text_prompt += f" Please match the {category} category." 

        if prompt:
            user_text_prompt += f" User added: {prompt}"
        # [DİKKAT] Llama 3.2 Vision payload'ı, GPT-4o ile UYUMLU ve aynı kalacak!
        payload = {
            "messages": [
                {
                    "role": "system",
                    "content": "You are a creative social media expert. Analyze the image and immediately generate the final output. YOU MUST NOT provide any analysis, introduction, explanation, or translation in your final output. Your ENTIRE output must only be the catchy TURKISH caption with 3 hashtags."
                },
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": user_text_prompt},
                        {"type": "image_url", "image_url": {"url": f"data:{mime_type};base64,{base64_image}"}}
                    ]
                }
            ],
            # [ÖNEMLİ] Llama'da bu alan zorunlu olabilir.
            "model": LLAMA_DEPLOYMENT_NAME, 
            "max_tokens": 500
        }
        
        response = await client.post(AZURE_API_URL, json=payload, headers=headers)
        response.raise_for_status() 
        
        api_data = response.json()
        # [DEĞİŞTİ] Yanıtı Llama JSON yapısından çekme (GPT ile aynı yapı)
        caption = api_data['choices'][0]['message']['content'].strip() 
        
        # [GÜNCELLENDİ]
        return {"platform": "Azure Meta Llama", "model": LLAMA_DEPLOYMENT_NAME, "filename": file.filename, "caption": caption}
    
    except Exception as e:
        print(f"!!! HATA (CAPTION - LLAMA) !!!: {type(e)} - {e}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Azure Llama API hatası: {type(e)} - {str(e)}")


# --- YETENEK 2: Paylaşım Zamanı Önermesi (Azure Llama Text) ---

def analyze_sample_to_report(df_sample: pd.DataFrame) -> str:
    # Bu fonksiyon (Pandas analizi) aynı kalır, modelden bağımsızdır.
    try:
        # 1. Yeni 'engagement' metriğini hesapla 
        df_sample['engagement_rate'] = (
            (df_sample['likes'] + df_sample['comments'] + df_sample['shares'] + df_sample['saves']) / df_sample['followers_at_post_time']
        ) * 100
        gunluk_analiz = df_sample.groupby("day_of_week")["engagement_rate"].mean().sort_values(ascending=False)
        saatlik_analiz = df_sample.groupby("hour")["engagement_rate"].mean().sort_values(ascending=False)

        # 3. Raporu oluştur
        report = "--- GÖNDERİ ANALİZ RAPORU (RASTGELE 30 ÖRNEKLEM) ---\n"
        report += "Tanımlar: 'Engagement Rate' = (Beğeni + Yorum + Paylaşım + Kaydetme) / Takipçi Sayısı\n\n"
        report += "Günlere Göre Ortalama Engagement Rate (En Yüksekten Düşüğe):\n"
        for day, rate in gunluk_analiz.items():
            report += f"- {day}: %{rate:.2f}\n"
        report += "\nSaatlere Göre Ortalama Engagement Rate (En Yüksekten Düşüğe):\n"
        for hour, rate in saatlik_analiz.items():
            report += f"- Saat {int(hour):02d}:00 civarı: %{rate:.2f}\n"
        report += "\nAnaliz Edilen Örneklemdeki En Başarılı 3 Gönderi:\n"
        top_3 = df_sample.nlargest(3, 'engagement_rate')
        for _, post in top_3.iterrows():
            report += f"  - ID {post['post_id']} ({post['day_of_week']}, {post['time_posted']}) -> %{post['engagement_rate']:.2f} Engagement (Reach: {post['reach']})\n"
        report += "--- RAPOR SONU ---"
        return report

    except Exception as e:
        print(f"Pandas analizi hatası: {e}")
        raise

@app.get(
    "/get-posting-advice/",
    summary="En İyi Paylaşım Zamanı Tavsiyesi Al (30 Rastgele Örneklem)",
    description="Anlık veriyi analiz eder ve Llama'dan danışmanlık alır."
)
async def get_posting_advice():
    
    if GLOBAL_MOCK_DF is None or GLOBAL_MOCK_DF.empty:
        raise HTTPException(status_code=500, detail="'mock_data.csv' yüklenemedi. Lütfen önce 'generate_data.py' script'ini çalıştırın.")
    
    try:
        # Adım 1 & 2 (Hızlı): Örneklem al ve Pandas ile analiz et
        sample_df = GLOBAL_MOCK_DF.sample(n=30)
        analiz_raporu = analyze_sample_to_report(sample_df)
        print("Analiz raporu oluşturuldu:\n", analiz_raporu)

        # [DEĞİŞTİ] Llama API Başlıkları ve URL
        headers = {
            "Content-Type": "application/json",
            "api-key": AZURE_LLAMA_KEY
        }
        AZURE_API_URL = f"{AZURE_LLAMA_ENDPOINT.rstrip('/')}/chat/completions"

        # --- Adım 3: Llama'dan Yorumlama (Danışmanlık) İste ---
        payload = {
            "model": LLAMA_DEPLOYMENT_NAME, # Llama modeli kullan
            "messages": [
                {
                    "role": "system",
                    "content": "You are a senior social media consultant analyzing Instagram data. I will provide you with an analysis report. Your job is to interpret this report and give the user clear, actionable, and friendly advice. Your final response MUST be in TURKISH only. Emphasize which days and hours are best, and why."
                },
                {
                    "role": "user",
                    "content": f"Here is the analysis report from a random sample of 30 posts. Please interpret this and give me advice on the best times to post. Remember, your response must be in TURKISH.\n\n{analiz_raporu}"
                }
            ],
            "max_tokens": 500
        }

        print(f"'{LLAMA_DEPLOYMENT_NAME}' modelinden danışmanlık isteniyor...")
        response = await client.post(AZURE_API_URL, json=payload, headers=headers)
        response.raise_for_status()
        
        api_data = response.json()
        advice = api_data['choices'][0]['message']['content']

        return {
            # [GÜNCELLENDİ]
            "platform": "Azure Meta Llama (Danışman)",
            "model": LLAMA_DEPLOYMENT_NAME,
            "tavsiye": advice.strip(),
            "kullanilan_rapor": analiz_raporu
        }

    except Exception as e:
        print(f"!!! HATA (ADVICE - LLAMA) !!!: {type(e)} - {e}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Azure Llama API hatası: {type(e)} - {str(e)}")

# --- YETENEK 3: Görsel Arka Plan Silme/Düzenleme (AZURE FLUX.1 - LLAMA/CHAT API Yapısıyla Düzeltildi) ---
@app.post(
    "/remove-background/",
    summary="Görsel Arka Plan Silme/Düzenleme (Azure FLUX.1 Kontext Pro)",
    description="Yüklenen görseldeki ana nesneyi koruyarak arka planı prompt'a göre değiştirir. LLama/Chat formatı kullanılır."
)
async def remove_background(
    file: UploadFile = File(..., description="Düzenlenecek görsel."),
    removal_prompt: str = "transparent background, high quality, professional product photo", # Varsayılan: Şeffaf arka plan
    # image_size parametresi Chat API'de genellikle kullanılmaz.
):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Geçersiz dosya türü.")

    try:
        image_bytes = await file.read()
        mime_type = file.content_type if file.content_type in ["image/jpeg", "image/png"] else "image/jpeg"
        base64_image = base64.b64encode(image_bytes).decode("utf-8")
        
        # FLUX API Başlıkları (Llama/Chat yapısı ile aynı)
        headers = {
            "Content-Type": "application/json",
            "api-key": AZURE_FLUX_KEY # FLUX Key'i kullan
        }
        
        # [DÜZELTİLDİ] API URL'si: Llama ile aynı /chat/completions endpoint'ini kullanıyoruz.
        # Bu, FLUX'ın de bu endpoint üzerinden görsel düzenleme komutlarını anlayacağını varsayar.
        FLUX_API_URL = f"{AZURE_FLUX_ENDPOINT.rstrip('/')}/openai/deployments/{FLUX_DEPLOYMENT_NAME}/chat/completions?api-version=2024-02-15-preview" 
        # API versiyonunu, multi-modal destekleyen GPT-4o veya Llama'daki gibi güncel bir versiyonla değiştirdik.
        
        # [DÜZELTİLDİ] Payload: LLAMA/GPT-V Vision formatıyla uyumlu hale getirildi.
        # Çalışan 4. fonksiyon (generate-caption) ile aynı yapıyı kullanıyoruz.
        payload = {
            "messages": [
                {
                    "role": "system",
                    # Modelin rolü: Ana nesneyi koruyarak arkayı prompt'a göre değiştir.
                    "content": "You are an expert image manipulation AI. Your task is to analyze the provided image and generate the modified image according to the user's prompt. You MUST maintain the original foreground subject/object and completely replace the background based on the user's request. Output ONLY the new base64 image data."
                },
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": f"Remove the background and replace it with: {removal_prompt}. Return ONLY the new base64 image data."},
                        # Görsel verisi
                        {"type": "image_url", "image_url": {"url": f"data:{mime_type};base64,{base64_image}"}}
                    ]
                }
            ],
            "model": FLUX_DEPLOYMENT_NAME, 
            "max_tokens": 4096 # Base64 görsel çıktısı için yüksek token gerekir.
        }
        
        print(f"'{FLUX_DEPLOYMENT_NAME}' modelinden arka plan silme/düzenleme (Chat API) isteniyor...")
        response = await client.post(FLUX_API_URL, json=payload, headers=headers)
        response.raise_for_status() 
        
        api_data = response.json()
        
        # Yanıtı Çekme: Çalışan 4. fonksiyondaki gibi ChatCompletion formatından çekiyoruz.
        base64_result = api_data['choices'][0]['message']['content'].strip() 
        
        # Yanıt sadece base64 metni olmalıdır, Data URI formatını temizleyelim.
        if base64_result.startswith("data:"):
            base64_result = base64_result.split(",", 1)[-1]
        
        return {
            "platform": "Azure FLUX.1 Kontext Pro (Chat Emülasyonu)",
            "model": FLUX_DEPLOYMENT_NAME,
            "prompt": removal_prompt,
            "base64_image": base64_result
        }
    
    except httpx.HTTPStatusError as e:
        print(f"!!! HATA (FLUX API - Chat) !!!: {e.response.text}")
        try:
            error_detail = e.response.json().get('error', {}).get('message', e.response.text)
        except:
            error_detail = e.response.text
        raise HTTPException(status_code=e.response.status_code, detail=f"Azure FLUX API Hatası (Chat): {error_detail}")
    except Exception as e:
        print(f"!!! HATA (FLUX.1 DÜZENLEME) !!!: {type(e)} - {e}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Sunucu hatası: {type(e)} - {str(e)}")
    
# --- YETENEK 4: Metinden Görsel Üretme (FLUX.1) ---
@app.post(
    "/generate-image/",
    summary="Metin İsteminden Yeni Görsel Üretme (FLUX.1)",
    description="Girilen metin istemini (prompt) kullanarak sıfırdan yeni bir görsel oluşturur."
)
async def generate_image_from_prompt(
    prompt: str,
    size: str = "1024x1024" # Örn: 1024x1024, 1792x1024, 1024x1792
):
    if not prompt:
        raise HTTPException(status_code=400, detail="Görsel üretim istemi (prompt) boş olamaz.")

    try:
        # FLUX API Başlıkları (Key aynı kalır)
        headers = {
            "Content-Type": "application/json",
            "api-key": AZURE_FLUX_KEY 
        }
        
        # [ÖNEMLİ] FLUX Görsel Üretim (Image Generation) API URL'si
        # Bu URL, Azure'daki DALL-E ve FLUX gibi modellerin görsel üretim endpoint'i için standarttır.
        FLUX_API_URL = f"{AZURE_FLUX_ENDPOINT.rstrip('/')}/openai/deployments/{FLUX_DEPLOYMENT_NAME}/images/generations?api-version={FLUX_API_VERSION}"

        # API'nin beklediği standart Görsel Üretim Payload'u
        payload = {
            "prompt": prompt,          # Metin istemi
            "n": 1,                    # Üretilecek görsel sayısı
            "size": size,              # Görsel çözünürlüğü (desteklenen bir değer olmalı)
            "response_format": "b64_json", # Base64 formatında geri dönüş
            "model": FLUX_DEPLOYMENT_NAME # Model adı (zorunlu olabilir)
        }
        
        print(f"'{FLUX_DEPLOYMENT_NAME}' modelinden görsel üretimi isteniyor...")
        response = await client.post(FLUX_API_URL, json=payload, headers=headers)
        response.raise_for_status() 
        
        api_data = response.json()
        
        # Yanıtı Çekme: Standart görsel üretim yanıt yapısında, üretilen görseller
        # 'data' listesi içinde yer alır ve her birinde 'b64_json' alanı bulunur.
        
        if 'data' not in api_data or not api_data['data']:
             raise Exception("API, 'data' alanında sonuç döndüremedi.")
             
        # İlk üretilen görselin base64 verisini al
        base64_result = api_data['data'][0]['b64_json'].strip() 
        
        return {
            "platform": "Azure FLUX.1",
            "model": FLUX_DEPLOYMENT_NAME,
            "prompt": prompt,
            "size": size,
            "base64_image": base64_result # Üretilen base64 görsel
        }
    
    except httpx.HTTPStatusError as e:
        print(f"!!! HATA (FLUX IMAGE GENERATION API) !!!: {e.response.text}")
        raise HTTPException(status_code=e.response.status_code, detail=f"FLUX Görsel Üretim API Hatası: {e.response.text}")
    except Exception as e:
        print(f"!!! HATA (IMAGE GENERATION) !!!: {type(e)} - {e}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Sunucu hatası: {type(e)} - {str(e)}")

# [Mevcut kodunuzun devamı]

# --- YETENEK 5: Görsel Üretim Prompt'u İyileştirme (Azure Llama Text) ---
@app.post(
    "/enhance-image-prompt/",
    summary="Görsel Üretim İstemini İyileştir (Azure Meta Llama)",
    description="Kullanıcının basit metin istemini (prompt) alarak, Görsel Üretim AI'lerinin (FLUX.1 vb.) daha iyi sonuç vermesi için detaylı ve sanatsal bir istem oluşturur."
)
async def enhance_image_prompt(
    prompt: str = Form(..., description="İyileştirilecek orijinal görsel üretim istemi."),
    # Değişken adı 'style' olarak değiştirildi
    style: str = Form("cinematic, highly detailed, photorealistic", description="İstenen görsel stilini belirten anahtar kelimeler.")
):
    if not prompt:
        raise HTTPException(status_code=400, detail="Görsel üretim istemi (prompt) boş olamaz.")
    
    try:
        # Llama API Başlıkları ve URL (Yetenek 2'deki ile aynı, Text/Chat için)
        headers = {
            "Content-Type": "application/json",
            "api-key": AZURE_LLAMA_KEY
        }
        AZURE_API_URL = f"{AZURE_LLAMA_ENDPOINT.rstrip('/')}/chat/completions"

        # --- Adım 1: Llama'dan Prompt İyileştirmesi İste ---
        system_content = (
            "You are an expert prompt engineer for image generation AI. "
            "Your task is to take a simple, short user prompt and convert it into a highly detailed, "
            "effective and creative prompt that will yield a stunning image. "
            # Sistem mesajı, modelin hangi stili kullanacağını açıkça belirtmeli.
            "You must incorporate details about lighting, composition, texture, and the requested style. "
            f"The core style keywords to be used are: '{style}'. " 
            "Your response MUST contain ONLY the enhanced prompt text, without any explanation, introduction, or formatting."
        )
        
        user_content = (
            "Enhance this simple image generation prompt into a detailed, professional one, "
            f"incorporating the style keywords: '{style}'. "
            f"Original prompt: '{prompt}'"
        )
        
        payload = {
            "model": LLAMA_DEPLOYMENT_NAME, 
            "messages": [
                {
                    "role": "system",
                    "content": system_content
                },
                {
                    "role": "user",
                    "content": user_content
                }
            ],
            "max_tokens": 700,
            "temperature": 0.8 
        }

        print(f"'{LLAMA_DEPLOYMENT_NAME}' modelinden görsel prompt iyileştirmesi isteniyor...")
        response = await client.post(AZURE_API_URL, json=payload, headers=headers)
        response.raise_for_status()
        
        api_data = response.json()
        enhanced_prompt = api_data['choices'][0]['message']['content']

        return {
            "platform": "Azure Meta Llama (Prompt İyileştirme)",
            "model": LLAMA_DEPLOYMENT_NAME,
            "original_prompt": prompt,
            "style": style, # Değişken adı güncellendi
            "enhanced_prompt": enhanced_prompt.strip()
        }

    except Exception as e:
        print(f"!!! HATA (PROMPT ENHANCE - LLAMA) !!!: {type(e)} - {e}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Azure Llama API hatası: {type(e)} - {str(e)}")
    
@app.get("/")
async def root():
    return {"message": "Sosyal Medya AI Asistanı (Azure Llama) çalışıyor! /docs adresine gidin."}

# Kök dizin
@app.get("/")
async def root():
    return {"message": "Sosyal Medya AI Asistanı (Azure Llama) çalışıyor! /docs adresine gidin."}

