from fastapi import APIRouter, Query, Depends
from fastapi.responses import FileResponse, StreamingResponse
from gtts import gTTS
from sqlalchemy.orm import Session
from pathlib import Path
import io
import models
from database import SessionLocal
# from googletrans import Translator

router = APIRouter()
# translator = Translator()

CACHE_DIR = Path("tts_cache")
CACHE_DIR.mkdir(exist_ok=True)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/tts")
def generate_tts(text: str = Query(..., min_length=1), lang: str = "en"):
    filename = CACHE_DIR / f"tts_{hash(text)}_{lang}.mp3"
    if not filename.exists():
        tts = gTTS(text=text, lang=lang)
        tts.save(str(filename))
    return FileResponse(str(filename), media_type="audio/mpeg")

@router.get("/tts/stream")
def stream_tts(text: str = Query(..., min_length=1), lang: str = "en", db: Session = Depends(get_db)):
    mp3_fp = io.BytesIO()
    gTTS(text=text, lang=lang).write_to_fp(mp3_fp)
    mp3_fp.seek(0)

    history = models.TTSHistory(text=text, language=lang, file_path=None, user_id=1)
    db.add(history)
    db.commit()
    db.refresh(history)

    return StreamingResponse(mp3_fp, media_type="audio/mpeg")

# @router.get("/tts/translate")
# def tts_with_translation(text: str = Query(...), lang: str = "en"):
#     try:
#         # Step 1: Translate text
#         translated = translator.translate(text, dest=lang)
#         translated_text = translated.text

#         # Step 2: Generate speech from translated text
#         mp3_fp = io.BytesIO()
#         gTTS(text=translated_text, lang=lang).write_to_fp(mp3_fp)
#         mp3_fp.seek(0)

#         return StreamingResponse(mp3_fp, media_type="audio/mpeg")

#     except Exception as e:
#         return {"error": str(e)}
