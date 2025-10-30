import datetime as dt
import os.path

from google.auth.transport.requests import Request 
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

SCOPES = ['https://www.googleapis.com/auth/calendar']

API_KEY = os.getenv("GOOGLE_CALENDAR_API")

def main():
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
            flow = InstalledAppFlow.from_client_secrets_file('secret/google_calendar_credentials.json', SCOPES)
            credentials = flow.run_local_server(port=0)
            
        with open('token.json', 'w') as token:
            token.write(credentials.to_json())
    
            
    try:
        service = build('calendar', 'v3', credentials=credentials)
        
        event = {
            "summary": "My Python Event",
            "location": "Somewhere",
            "description": "This is a test event created using Python.",
            "colorId": 6,
            "start": {
                "dateTime": "2025-10-28T09:00:00",
                "timeZone": "America/New_York"
            },
            "end": {
                "dateTime": "2025-10-28T17:00:00",
                "timeZone": "America/New_York"
            },
            "recurrence": [
                "RRULE:FREQ=DAILY;COUNT=1"
            ],
        }
        
        event = service.events().insert(calendarId='primary', body=event).execute()
        
        print(f"Event created: {event.get('htmlLink')}")
        
        """ # 오늘 날짜와 시간
        now = dt.datetime.now().isoformat() + 'Z'
        print('Getting the upcoming 10 events')
        
        events_result = service.events().list(calendarId='primary', timeMin=now, maxResults=10, singleEvents=True, orderBy='startTime').execute()
        events = events_result.get('items', [])
        
        if not events:
            print('No upcoming events found.')
            return
        
        for event in events:
            start = event['start'].get('dateTime', event['start'].get('date'))
            print(start, event['summary'])"""
            
    except HttpError as error:
        print('An error occurred: %s' % error)
        
if __name__ == '__main__':
    main()