from pydantic import BaseModel, EmailStr, Field
from typing import List

class StudentCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    Type: str

class StudentLogin(BaseModel):
    email: EmailStr
    password: str

class Student(BaseModel):
    name : str
    student_id: int
    email: str

    class Config:
        orm_mode = True
from pydantic import BaseModel

class MCQSubmission(BaseModel):
    Q_id: list[str]
    Student_answer: list[str]
    correct_answer: list[str]
    student_id: int
    test_id: int


    class Config:
        orm_mode = True

class MCQResult(BaseModel):
    id: int
    student_id: int
    Q_id: List[int]
    Student_answer: List[str]
    correct_answer: List[str]
    score: int
    correct_count: int
    incorrect_count: int

    class Config:
        orm_mode = True

class DescriptiveData(BaseModel):
    question_id: int
    question: str
    Student_answer: str = Field(..., max_length=2000)
    marks: int
    student_id: int

    class Config:
        orm_mode = True


class DescriptiveDataList(BaseModel):
    data: List[DescriptiveData]

class DescriptiveResult(BaseModel):
    question_id: int
    student_answer: str
    marks: int
    student_id: int
    
    
    
class CoursesRequest(BaseModel):
    courses: List[str]
    
class QuestionRequest(BaseModel):
    file_path: str