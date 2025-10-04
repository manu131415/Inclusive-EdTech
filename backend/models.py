from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base  # absolute import

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)        # length added
    email = Column(String(255), unique=True, index=True)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(50), default="student")     # length added

class Lesson(Base):
    __tablename__ = "lessons"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)  # added length
    text = Column(Text, nullable=False)
    language = Column(String(10), default="en")  # language codes are short
    created_by = Column(Integer, ForeignKey("users.id"))
    creator = relationship("User")


class TTSHistory(Base):
    __tablename__ = "tts_history"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    text = Column(Text, nullable=False)
    language = Column(String(10), default="en")
    file_path = Column(String(255), nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    user = relationship("User")
