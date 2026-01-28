from fastapi import APIRouter, UploadFile, File, Form, HTTPException
import os
import shutil
# 상위 폴더에 있는 startButton을 가져옵니다.
from startButton import integrated_file_reader, parse_response_to_events, google_calendar

router = APIRouter(
    prefix="/api/schedule", # 이 라우터의 모든 주소 앞에 붙을 공통 주소
    tags=["Schedule"]       # API 문서(docs)에서 보여줄 그룹 이름
)

@router.post("/upload") # 실제 전체 주소는 /api/schedule/upload
async def upload_schedule(
    file: UploadFile = File(...),
    color: str = Form(...)
):
    temp_path = f"temp_{file.filename}"
    try:
        # 1. 파일 임시 저장
        with open(temp_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        ext = os.path.splitext(file.filename)[1].lower()
        file_name = os.path.splitext(file.filename)[0]
        
        # 2. AI 분석 (startButton.py의 기능 사용)
        response_text = integrated_file_reader(temp_path, ext, file_name, color)
        events_json = parse_response_to_events(response_text)
        
        # 3. 구글 캘린더 등록
        if events_json:
            google_calendar(events_json) # 함수 이름은 본인의 코드에 맞게 수정
            return {"status": "success", "message": f"{len(events_json)}개 일정 등록 완료!"}
            
        return {"status": "error", "message": "일정을 찾지 못했습니다."}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)