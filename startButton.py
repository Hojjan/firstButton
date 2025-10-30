import os
import google.generativeai as genai
from PIL import Image # 이미지 처리를 위한 Pillow 라이브러리
import pandas as pd
import json

API_KEY = os.getenv("GOOGLE_GEMINI_API")

# 키 설정
genai.configure(api_key=API_KEY)

# 모델 선택
model = genai.GenerativeModel('gemini-flash-latest')

prompt = "Summarize all the academic schedules listed in this {file} file and organize them into a JSON format in English. \
                However, make sure to strictly comply with the following requirements: \
                1. Things to be excluded: TA office hour, professor office hour, assignment release date \
                2. Things to be included: midterm, final exam, project deadline, assignment submission deadline, no class, holiday\
                3. Do not contain any other information except the schedule information.\
                4. Finally, the keys of JSON object must be: summary, location, description, colorId, start, end.\
                5. The start key and end key are date/time objects that indicate start time and the end time of the schedule.\
                    The dateTime field is based on the syllabus, and the timezone field must be 'America/New_York'.\
                6. The colorId field must be set to 6.\
                7. The description field must briefly describe the schedule in 3 ~ 4 words. If a particular schedule has a description in the {file}, use that description.\
                8. If a particular schedule does not have such a description, make the description on your own within 3 ~ 4 words. " 

#pdf 읽기
def pdf_file_reader(pdf_path):    
    # 파일 구글 서버에 업로드
    try:
        pdf_file = genai.upload_file(path=pdf_path, display_name="syllabus PDF")

    except FileNotFoundError:
        print(f"오류: '{pdf_path}' 경로에서 파일을 찾을 수 없습니다.")
        exit()

    pdf_prompt = prompt.format(file="PDF")   
     
    response = model.generate_content([pdf_file,pdf_prompt])
    return response.text


# 이미지 읽기   
def image_file_reader(image_path):
    try:
        # Pillow를 사용하여 이미지 파일 열기
        img_file = Image.open(image_path)
    except FileNotFoundError:
        print(f"오류: '{image_path}' 경로에서 파일을 찾을 수 없습니다.")
        exit()
        
    img_prompt = prompt.format(file="image")
    response = model.generate_content([img_file, img_prompt])
    return response.text


#응답 json 형태 파싱
def parse_response_to_events(response_text):
    try:
        data = json.loads(response_text)
    except Exception as e:
        raise ValueError("Failed to parse JSON from model response") from e

    # Ensure we always return a list of event dicts
    if isinstance(data, dict):
        return [data]
    if isinstance(data, list):
        return data
    raise ValueError("Parsed JSON is not an object or list of objects")

#
def get_parsed_events(file_path, file_type):
    """
    file_type: "pdf" or "image"
    Returns: list of event dicts ready to insert into Google Calendar
    """
    if file_type == 1:
        resp = pdf_file_reader(file_path)
    elif file_type == 2:
        resp = image_file_reader(file_path)
    else:
        raise ValueError("file_type must be 'pdf' or 'image'")

    return parse_response_to_events(resp)


if __name__ == "__main__":
    # 파일 경로 지정
    pdf_path = "C:/Users/hocha/OneDrive/바탕 화면/첫단추/pdfs/161syllabus.pdf"  # 읽고 싶은 파일 경로로 변경
    image_path = "C:/Users/hocha/OneDrive/바탕 화면/첫단추/images/cse310_1.png" # 이미지 파일 경로
    
    # 사용자 인풋 받기
    user_input = input("PDF 파일을 읽으려면 '1', 이미지 파일을 읽으려면 '2'를 입력하세요: ")
    if user_input == '1':
        response = pdf_file_reader(pdf_path)
    elif user_input == '2':
        response = image_file_reader(image_path)
    else:
        print("잘못된 입력입니다. '1' 또는 '2'를 입력하세요.")
        exit()
    
    print("응답:", response)
        
        