from fastapi import FastAPI, Query, Depends
from fastapi.responses import StreamingResponse, FileResponse
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from gtts import gTTS
import io
from pathlib import Path
from fastapi import HTTPException, Depends
from pydantic import BaseModel
from typing import List

from database import SessionLocal, engine, Base
import models, schemas, utils

# Create tables in MySQL
models.Base.metadata.create_all(bind=engine)
# Pydantic schema for lessons
class LessonCreate(BaseModel):
    title: str
    text: str
    language: str = "en"
    created_by: int = 1  # temporary default user

class LessonOut(BaseModel):
    id: int
    title: str
    text: str
    language: str
    created_by: int

    class Config:
        orm_mode = True



# FastAPI setup
app = FastAPI(title="Read4All TTS API")
CACHE_DIR = Path("tts_cache")
CACHE_DIR.mkdir(exist_ok=True)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# DB session dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Root endpoint
@app.get("/")
def root():
    return {"message": "Read4All TTS API running"}

# Cached TTS endpoint
@app.get("/tts")
def generate_tts(text: str = Query(..., min_length=1), lang: str = "en"):
    filename = CACHE_DIR / f"tts_{hash(text)}_{lang}.mp3"
    if not filename.exists():
        tts = gTTS(text=text, lang=lang)
        tts.save(str(filename))
    return FileResponse(str(filename), media_type="audio/mpeg")

# Streaming TTS endpoint + store history in MySQL
@app.get("/tts/stream")
def stream_tts(text: str = Query(..., min_length=1), lang: str = "en", db: Session = Depends(get_db)):
    mp3_fp = io.BytesIO()
    gTTS(text=text, lang=lang).write_to_fp(mp3_fp)
    mp3_fp.seek(0)

    # Save TTS history in DB (dummy user_id=1 for now)
    history = models.TTSHistory(text=text, language=lang, file_path=None, user_id=1)
    db.add(history)
    db.commit()
    db.refresh(history)

    return StreamingResponse(mp3_fp, media_type="audio/mpeg")

# Create a lesson
@app.post("/lessons/", response_model=LessonOut)
def create_lesson(lesson: LessonCreate, db: Session = Depends(get_db)):
    db_lesson = models.Lesson(
        title=lesson.title,
        text=lesson.text,
        language=lesson.language,
        created_by=lesson.created_by
    )
    db.add(db_lesson)
    db.commit()
    db.refresh(db_lesson)
    return db_lesson

# Get all lessons
@app.get("/lessons/", response_model=List[LessonOut])
def get_lessons(db: Session = Depends(get_db)):
    lessons = db.query(models.Lesson).all()
    return lessons

# Get lesson by ID
@app.get("/lessons/{lesson_id}", response_model=LessonOut)
def get_lesson(lesson_id: int, db: Session = Depends(get_db)):
    lesson = db.query(models.Lesson).filter(models.Lesson.id == lesson_id).first()
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")
    return lesson

@app.post("/signup", response_model=schemas.UserOut)
def signup(user: schemas.UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(models.User).filter(models.User.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed_pw = utils.hash_password(user.password)
    db_user = models.User(username=user.username, email=user.email, password=hashed_pw)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@app.post("/login", response_model=schemas.UserOut)
def login(user: schemas.UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if not db_user or not utils.verify_password(user.password, db_user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return db_user

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8001, reload=True)

