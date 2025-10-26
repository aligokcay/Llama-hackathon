from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import requests
import os
from dotenv import load_dotenv
import base64
from io import BytesIO
from PIL import Image

load_dotenv()

app = FastAPI()

# CORS ayarları
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React uygulamasının adresi
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Image to Video API'si"}

@app.post("/image-to-video")
async def image_to_video(
    image: UploadFile = File(...),
    prompt: str = Form(...)
):
    try:
        # API key kontrolü
        api_key = os.getenv("FAL_API_KEY")
        if not api_key or api_key == "your_fal_api_key_here":
            raise HTTPException(status_code=500, detail="FAL_API_KEY ayarlanmamış. Lütfen .env dosyasında API key'inizi ayarlayın.")
        
        # Görüntüyü okuma
        image_data = await image.read()
        if not image_data:
            raise HTTPException(status_code=400, detail="Görüntü dosyası boş")
        
        # Base64'e çevirme
        image_base64 = base64.b64encode(image_data).decode('utf-8')
        
        # Fal AI Image-to-Video API'sine istek gönderme
        url = "https://fal.run/fal-ai/wan/v2.2-a14b/image-to-video/lora"
        headers = {
            "Authorization": f"Key {api_key}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "image_url": f"data:image/jpeg;base64,{image_base64}",
            "prompt": prompt,
            "num_inference_steps": 28,
            "guidance_scale": 3.5,
            "seed": None
        }
        
        print(f"API'ye istek gönderiliyor: {url}")
        response = requests.post(url, headers=headers, json=payload)
        
        print(f"API yanıt kodu: {response.status_code}")
        print(f"API yanıt içeriği: {response.text}")
        
        if response.status_code != 200:
            raise HTTPException(status_code=response.status_code, detail=f"Fal AI API hatası: {response.text}")
        
        result = response.json()
        
        # Oluşturulan videoyu döndürme
        return {
            "success": True,
            "video_url": result.get("video", {}).get("url", ""),
            "prompt": prompt
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Beklenmeyen hata: {str(e)}")
        raise HTTPException(status_code=500, detail=f"İşlem sırasında hata: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8002)
