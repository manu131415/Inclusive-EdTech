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
from routers import tts, lessons, auth



# Create tables in MySQL
models.Base.metadata.create_all(bind=engine)

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

app.include_router(tts.router)
app.include_router(lessons.router)
app.include_router(auth.router)

# Root endpoint
@app.get("/")
def root():
    return {"message": "Read4All TTS API running"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

