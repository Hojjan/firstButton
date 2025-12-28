import os
import google.generativeai as genai
from PIL import Image # 이미지 처리를 위한 Pillow 라이브러리
import pandas as pd
import json

import datetime as dt
import os.path

from google.auth.transport.requests import Request 
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError


SCOPES = ['https://www.googleapis.com/auth/calendar']

API_KEY = os.getenv("GOOGLE_CALENDAR_API")
API_KEY = os.getenv("GOOGLE_GEMINI_API")

# 키 설정
genai.configure(api_key=API_KEY)

# 모델 선택
model = genai.GenerativeModel('gemini-flash-latest')

prompt = "Summarize all the academic schedules from this {file} file and organize them into a JSON format in English. \
                However, make sure to strictly comply with the following requirements: \
                1. Things to be excluded: TA office hour, professor office hour, assignment release date \
                2. Things to be included: midterm, final exam, project deadline, assignment submission deadline, no class, holiday\
                3. Do not contain any other information except the schedule information.\
                4. Finally, the keys of JSON object must be: summary, location, description, colorId, start, end.\
                5. **The start key and end key must be a dictionary object with only the 'date' key (YYYY-MM-DD format). Do NOT include 'timeZone' or 'dateTime'. The 'end' date must be one day after the 'start' date to ensure it is displayed as an all-day event.** \
                   For example: **'start': {{'date': '2025-09-01'}}, 'end': {{'date': '2025-09-02'}}**. \
                6. The colorId field must be set to 6. \
                7. The description field must briefly describe the schedule in 3 ~ 4 words. If a particular schedule has a description in the {file}, use that description.\
                8. If a particular schedule does not have such a description, make the description on your own within 3 ~ 4 words. \
                9. The output must be a valid JSON format only, without any additional words." 

#5. The start key and end key are datetime objects which the timezone is America/New_York. \
#6. The colorId field must be set to 6.\
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

def integrated_file_reader(file_path, file_type):
    try:
        # Pillow를 사용하여 이미지 파일 열기
        if ext == ".jpg" or ext == ".jpeg" or ext == ".png":
            processed_file = Image.open(file_path)
        elif ext == ".pdf":
            processed_file = genai.upload_file(path=file_path, display_name="syllabus PDF")
            
    except FileNotFoundError:
        print(f"오류: '{file_path}' 경로에서 파일을 찾을 수 없습니다.")
        exit()
        
    file_prompt = prompt.format(file=file_type)
    response = model.generate_content([processed_file, file_prompt])
    return response.text


#응답 json 형태 파싱
def parse_response_to_events(response_text):
    if not response_text:
        raise ValueError("Empty response_text")
    
    start = response_text.find('[')
    end = response_text.rfind(']')
    if start == -1 or end == -1 or end <= start:
        #print("JSON array '[]' not found in response. preview:", repr(response_text)[:1000])
        return 0

    candidate = response_text[start:end+1]
    
    try:
        data = json.loads(candidate)
    except Exception as e2:
        print("Failed to parse extracted JSON array. candidate preview:", repr(candidate)[:1000])
        raise ValueError("Failed to parse JSON array from model response") from e2
    
    
    # Ensure we always return a list of event dicts
    if isinstance(data, dict):
        return [data]
    if isinstance(data, list):
        return data
    raise ValueError("Parsed JSON is not an object or list of objects")


# google Calendar에 넣기 위한 이벤트 파싱 함수
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


def googleCalendar(response):
    print(response)
    
    credentials = None
    
    ###구글 API에 접근하기 위한 사용자 인증 및 로그인 상태 관리 코드 (자동 로그인)
    
    #기존의 발급받은 토큰 확인
    if os.path.exists('token.json'):
        credentials = Credentials.from_authorized_user_file('token.json', SCOPES)
    
    #출입증의 유효성 검사    
    if not credentials or not credentials.valid:
        
        #만료되었을시, 갱신 토큰 유무 확인 후 갱신
        if credentials and credentials.expired and credentials.refresh_token:
            credentials.refresh(Request())
        
        #token이 없는 최초 실행의 경우, 또는 유효하지 않고 갱신도 불가능한 경우
        else:
            flow = InstalledAppFlow.from_client_secrets_file('./demo/secret/google_calendar_credentials.json', SCOPES)
            credentials = flow.run_local_server(port=0)
            
        with open('token.json', 'w') as token:
            token.write(credentials.to_json())
    
            
    try:
        service = build('calendar', 'v3', credentials=credentials)
        
        for event_data in response:
            try:
                # 단일 이벤트 딕셔너리(event_data)를 body에 전달
                event = service.events().insert(calendarId='primary', body=event_data).execute()
                print(f"✅ Event created successfully: {event.get('htmlLink')}")
            except HttpError as inner_error:
                # 개별 이벤트 삽입 중 오류가 발생해도 나머지 이벤트를 시도합니다.
                print(f"An error occurred while creating event '{event_data.get('summary')}': {inner_error}")
        
            
    except HttpError as error:
        print('An error occurred: %s' % error)




if __name__ == "__main__":
    # 파일 경로 지정
    #pdf_path = "C:/firstButton/demo/pdfs/cse300.pdf"  
    #image_path = "C:/firstButton/demo/images/cse310_1.png" 
    
    file_path = "C:/firstButton/demo/images/cse310_2.png" # 실전에서는 사용자가 파일을 직접 고르는 것으로 할것.
    
    """
    # 사용자 인풋 받기
    user_input = input("PDF 파일을 읽으려면 '1', 이미지 파일을 읽으려면 '2'를 입력하세요: ")
    if user_input == '1' or user_input == '2':
        file_type = int(user_input)
        file_path = pdf_path if file_type == 1 else image_path
        response = get_parsed_events(file_path, file_type)
    else:
        print("잘못된 입력입니다. '1' 또는 '2'를 입력하세요.")
        exit()
    """
    
    # 파일 확장자에 따라 파일 타입 결정
    _, ext = os.path.splitext(file_path)
    ext = ext.lower()
    
    response = integrated_file_reader(file_path, ext) #file reader를 통해 모델이 생성한 응답 받기
    events_json = parse_response_to_events(response) #응답을 구글 캘린더 json 형식에 맞게 파싱
    
    googleCalendar(events_json)
        
        