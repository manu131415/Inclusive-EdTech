from pydantic import BaseModel, EmailStr

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

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

class UserOut(BaseModel):
    id: int
    name: str
    email: EmailStr

    class Config:
        orm_mode = True
