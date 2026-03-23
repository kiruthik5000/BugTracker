from fastapi import FastAPI
from pydantic import BaseModel
from DuplicateChecker import CheckDuplicate

app = FastAPI()

cd = CheckDuplicate('all-MiniLM-L6-v2')

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
