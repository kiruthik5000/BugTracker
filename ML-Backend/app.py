from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from DuplicateChecker import CheckDuplicate
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("FRONTEND_URL")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

cd = CheckDuplicate('all-MiniLM-L6-v2', os.getenv("BACKEND_URL"))

class Bug(BaseModel):
    id: int
    title: str
    description: str
    steps: str

@app.get("/ai_check")
def home():
    return {"message": "Bug duplicate Detection API is running"}

@app.post("/check-duplicate")
def check_duplicate(bug: Bug):
    print("Received  Bug...")
    result = cd.main(bug.dict())

    return result
