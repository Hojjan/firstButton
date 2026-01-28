import os
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from routers import schedule # 우리가 만든 라우터 가져오기

app = FastAPI(title="첫단추 API")

# 1. 라우터 연결 (API 정의가 먼저!)
app.include_router(schedule.router)

# 2. 경로 설정 (dist 폴더 위치)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DIST_PATH = os.path.abspath(os.path.join(BASE_DIR, "../../../../dist"))


# 3. 정적 파일 마운트 (가장 아래에!)
if os.path.exists(DIST_PATH):
    app.mount("/assets", StaticFiles(directory=os.path.join(DIST_PATH, "assets")), name="assets")
    app.mount("/", StaticFiles(directory=DIST_PATH, html=True), name="static")

@app.get("/")
async def read_index():
    return FileResponse(os.path.join(DIST_PATH, "index.html"))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)