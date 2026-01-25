import os
import google.generativeai as genai
from PIL import Image # 이미지 처리를 위한 Pillow 라이브러리
import pandas as pd
import json

import datetime as dt
import os.path

from tkinter import Tk
from tkinter.filedialog import askopenfilenames

from google.auth.transport.requests import Request 
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

import re
import hashlib


SCOPES = ['https://www.googleapis.com/auth/calendar']

API_KEY = os.getenv("GOOGLE_CALENDAR_API")
API_KEY = os.getenv("GOOGLE_GEMINI_API")

# 키 설정
genai.configure(api_key=API_KEY)

# 모델 선택
model = genai.GenerativeModel('gemini-flash-latest')

prompt = "Summarize all the academic schedules from this {file} file and organize them into a JSON format in English. \
                However, make sure to strictly comply with the following requirements: \
                1. Things to be excluded: TA office hour, professor office hour, assignment release date. \
                2. Things to be included: midterm, final exam, project deadline, assignment submission deadline, no class, holiday, semester break.\
                3. Do not contain any other information except the schedule information.\
                4. Finally, the keys of JSON object must be: summary, location, description, colorId, start, end.\
                5. **The start key and end key must be a dictionary object with only the 'date' key (YYYY-MM-DD format). Do NOT include 'timeZone' or 'dateTime'. The 'end' date must be one day after the 'start' date to ensure it is displayed as an all-day event.** \
                    For example: **'start': {{'date': '2025-09-01'}}, 'end': {{'date': '2025-09-02'}}**. \
                6. If same schedule lasts for couple of consecutive days, you must not make those separately, but make them in one object.\
                    For example, if the semester break is from June 1 to June 10, then the start date must be June 1 and the end date must be June 11.\
                7. The colorId field must be set to {colorId}.\
                8. The summary field must have the file name \"{name}\" at the beginning with brackets wrapped. But if the schedule is related to one of these three categories: holiday, semester break, no class, then do not include the file name.\
                9. The description field must have the brief description of the schedule in 3 ~ 4 words. If a particular schedule has a description in the {file}, use that description. But if not, make the description on your own within 3 ~ 4 words. \
                10. If the schedule is related to one of these categories: holiday, semester break, no class, then choose one of them and include it in the description. \
                11. The output must be a valid JSON format only, without any additional words." 

#파일 읽고 응답 생성 (이미 json 형태이기는 함)
def integrated_file_reader(file_path, file_type, file_name, color):
    try:
        # Pillow를 사용하여 이미지 파일 열기
        if file_type == ".jpg" or file_type == ".jpeg" or file_type == ".png":
            processed_file = Image.open(file_path)
        elif file_type == ".pdf":
            processed_file = genai.upload_file(path=file_path, display_name="syllabus PDF")
            
    except FileNotFoundError:
        print(f"오류: '{file_path}' 경로에서 파일을 찾을 수 없습니다.")
        exit()
        
    file_prompt = prompt.format(file=file_type, name=file_name, colorId=color)
    response = model.generate_content([processed_file, file_prompt])
    return response.text

#생성된 응답 json 형태 파싱 (정리만 하는 용도)
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

#구글 캘린더에 이벤트 추가
def googleCalendar(response):
    #print(response)
    
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
            flow = InstalledAppFlow.from_client_secrets_file('C:/firstButton/firstbutton/src/backend/demo/secret/google_calendar_credentials.json', SCOPES)
            credentials = flow.run_local_server(port=0)
            
        with open('token.json', 'w') as token:
            token.write(credentials.to_json())
    
            
    try:
        service = build('calendar', 'v3', credentials=credentials)
        
        for event_data in response:
            #print(event_data)
            #print()
            try:
                # 단일 이벤트 딕셔너리(event_data)를 body에 전달
                if is_common_event(event_data):
                    #print(1234)
                    eid = make_common_event_id(event_data)
                    event_body = dict(event_data)
                    event_body["id"] = eid
                    #print(event_body)
                    
                    event = service.events().insert(calendarId="primary", body=event_body).execute()
                else:
                    event = service.events().insert(calendarId="primary", body=event_data).execute()
                
                print(f"✅ Event created successfully: {event.get('htmlLink')}")
                
            except HttpError as inner_error:
                if inner_error.resp.status == 409 and is_common_event(event_data):
                    print(f"Skipped duplicate common event: {event_data.get('summary')}")
                    continue
                
                else: 
                    print(f"An error occurred while creating event '{event_data.get('summary')}': {inner_error}")
        
    except HttpError as error:
        print('An error occurred: %s' % error)

def file_selector():
    allowed = {".jpg", ".jpeg", ".png", ".pdf"}
    root = Tk()
    root.withdraw()

    file_paths = askopenfilenames(title="Select files", filetypes=[("Image & PDF", "*.*")])

    files = list(file_paths)

    # 확장자 검증
    invalid_files = [
        f for f in files
        if os.path.splitext(f)[1].lower() not in allowed
    ]

    if invalid_files:
        raise ValueError(f"허용되지 않은 파일 형식이 포함되어 있습니다:\n" + "\n".join(invalid_files))

    return files

def is_common_event(event_data): #여기서 종류에 따라 event ID 부여해서 리턴
    description = event_data.get("description", "").lower()

    keywords = ["holiday", "break", "no class"] 

    return keywords[0] in description or keywords[1] in description or keywords[2] in description

def make_common_event_id(event_data):
    start = event_data["start"]["date"][4:].replace("-", "")
    end = event_data["end"]["date"][4:].replace("-", "")
    
    summary_title = (event_data.get("summary", "").lower()).replace(" ", "")
    raw_id = f"{summary_title}{start}{end}"
    
    safe_id = hashlib.md5(raw_id.encode()).hexdigest()
    
    return safe_id

if __name__ == "__main__":
    # 파일 경로 지정
    file_paths = file_selector()
    print(file_paths)
    
    if not file_paths:
        print("No files selected. Exiting.")
        exit()
    
    for file in file_paths:
        color = input("Choose a color for the events (e.g., 1-11): ") #파일별 색 정하기
        
    
    # 파일 확장자에 따라 파일 타입 결정
    for file_path in file_paths:
        try:
            file_name_with_ext = os.path.basename(file_path)
            file_name, ext = os.path.splitext(file_name_with_ext)
            ext = ext.lower()
            
            response = integrated_file_reader(file_path, ext, file_name, color) #file reader를 통해 모델이 생성한 응답 받기
            events_json = parse_response_to_events(response) #응답을 구글 캘린더 json 형식에 맞게 파싱
                
            googleCalendar(events_json)
            
        except Exception as e:
            print(f"Error processing file '{file_path}': {e}")
            continue  
        