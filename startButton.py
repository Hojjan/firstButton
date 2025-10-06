import os
import google.generativeai as genai
from PIL import Image # 이미지 처리를 위한 Pillow 라이브러리

API_KEY = os.getenv("GOOGLE_GEMINI_API")
print(API_KEY)

# 키 설정
genai.configure(api_key=API_KEY)

# 모델 선택
model = genai.GenerativeModel('gemini-flash-latest')

def file_distinguish(user_input, pdf_path, image_path):
    if user_input == '1':
        print("PDF 파일을 읽습니다...")
        response = pdf_file_reader(pdf_path)
        
    elif user_input == '2':
        print("이미지 파일을 읽습니다...")
        response = image_file_reader(image_path)
        
    else:
        response = "잘못된 입력입니다. '1' 또는 '2'를 입력하세요."
    
    return response
        
# pdf 읽기
def pdf_file_reader(pdf_path):    
    # 파일 구글 서버에 업로드
    try:
        pdf_file = genai.upload_file(path=pdf_path, display_name="syllabus PDF")

    except FileNotFoundError:
        print(f"오류: '{pdf_path}' 경로에서 파일을 찾을 수 없습니다.")
        exit()
        
    prompt = f"이 PDF 문서에 나온 모든 학사 일정을 요약하고, 언어는 영어인 표 형식으로 정리해줘. {pdf_file.uri}"
    response = model.generate_content([pdf_file,prompt])
    return response.text

# 이미지 읽기   
def image_file_reader(image_path):
    try:
        # Pillow를 사용하여 이미지 파일 열기
        img = Image.open(image_path)
    except FileNotFoundError:
        print(f"오류: '{image_path}' 경로에서 파일을 찾을 수 없습니다.")
        exit()
        
    prompt = "이 이미지에 나온 모든 학사 일정을 요약하고, 언어는 영어인 표 형식으로 정리해줘."
    response = model.generate_content([img, prompt])
    return response.text



    

if __name__ == "__main__":
    # 파일 경로 지정
    pdf_path = "C:/Users/hocha/OneDrive/바탕 화면/첫단추/pdfs/161syllabus.pdf"  # 읽고 싶은 파일 경로로 변경
    image_path = "C:/Users/hocha/OneDrive/바탕 화면/첫단추/images/cse310_1.png" # 이미지 파일 경로
    
    # 사용자 인풋 받기
    user_input = input("PDF 파일을 읽으려면 '1', 이미지 파일을 읽으려면 '2'를 입력하세요: ")
    response = file_distinguish(user_input, pdf_path, image_path)
    print("응답:", response)
        
        