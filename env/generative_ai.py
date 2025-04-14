import google.generativeai as genai
from typing import List, Dict
import json

GOOGLE_API_KEY = "AIzaSyAzFosuFo3LI8AE95d7qIgxHxaeBSOWqow"
genai.configure(api_key=GOOGLE_API_KEY)
model = genai.GenerativeModel('gemini-1.5-flash')

def evaluate_answer_with_ai(question: str, answer: str, marks_possible: int) -> int:
    try:
        prompt = (
            f"Question: {question}\n"
            f"Student Answer: {answer}\n"
            f"Evaluate the answer and give marks out of {marks_possible} in numerical format. "
            f"Provide only the marks."
        )
        
        response = model.generate_content(prompt)
        print("API Response:", response.text)  # Debugging line
        score = int(response.text.strip())
        return score

    except Exception as e:
        print(f"Error evaluating answer with AI: {e}")
        return 0

def get_recommendations(course: List[str]) -> Dict[str, List[str]]:
    combined_prompt = f"Provide 5 job recommendations with links and 5 relevant course recommendations with links for the following courses: {', '.join(course)}. Return output in the format of '{{\"jobs\" : [{{\"name\": \"job1\", \"link\": \"url1\"}}, {{\"name\": \"job2\", \"link\": \"url2\"}}, ...], \"courses\" : [{{\"name\": \"course1\", \"link\": \"url1\"}}, {{\"name\": \"course2\", \"link\": \"url2\"}}, ...]}}' without using bold font."
    response = model.generate_content(combined_prompt)
    response = response.text
    print(response)
    response = response[7:-4]
    print(response)
    response = json.loads(response)
    jobs = response["jobs"]
    courses = response['courses']
    return jobs, courses


def generate_questions(data, type, number_of_questions):
    prompt = f"""
    Given the following question data:
    {data}

    Generate {number_of_questions} questions for a {type} test. The output should be in the following JSON format:

    [
      {{
        "question_id": "id",
        "question": "question",
        "options": [
          "option1",
          "option2",
          "option3",
          "option4"
        ],
        "correct_answer": "correct_answer",
        "difficulty": "difficulty"
      }},
      ...
    ]
    """
    questions = model.generate_content(prompt)
    return questions.text