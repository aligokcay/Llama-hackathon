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
    return {"message": "Fotoğraf Düzenleme API'si"}

@app.post("/edit-image")
async def edit_image(
    image: UploadFile = File(...),
    prompt: str = Form(...)
):
    try:
        # API key kontrolü
        api_key = os.getenv("FAL_API_KEY")
        if not api_key:
            raise HTTPException(status_code=500, detail="API key bulunamadı")
        
        # Görüntüyü okuma
        image_data = await image.read()
        
        # Base64'e çevirme
        image_base64 = base64.b64encode(image_data).decode('utf-8')
        
        # Fal AI API'sine istek gönderme
        url = "https://fal.run/fal-ai/flux-pro/kontext/max"
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
        
        response = requests.post(url, headers=headers, json=payload)
        
        if response.status_code != 200:
            raise HTTPException(status_code=response.status_code, detail="Fal AI API hatası")
        
        result = response.json()
        
        # Düzenlenmiş görüntüyü döndürme
        return {
            "success": True,
            "edited_image": result.get("images", [{}])[0].get("url", ""),
            "prompt": prompt
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"İşlem sırasında hata: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
