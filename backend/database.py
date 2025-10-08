from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# MySQL connection string
# Replace 'root' and 'yourpassword' with your MySQL username/password
# Database must already exist
DATABASE_URL = "mysql+mysqlconnector://root:yourpassword@127.0.0.1:3306/read4all"

engine = create_engine(DATABASE_URL, echo=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()
