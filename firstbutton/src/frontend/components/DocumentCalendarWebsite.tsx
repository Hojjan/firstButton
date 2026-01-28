import { useState, useRef } from "react";
import { Calendar, FileText, Image, CheckCircle, ArrowRight, X, Trash2, Zap } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import calendarImage from "../assets/calendar.jpg";
import { AnimatePresence, motion } from "motion/react"; // 애니메이션 효과

interface DocumentCalendarWebsiteProps {
  highlightElement?: string;
  onNavigateToGuide?: () => void;
}

// 파일 정보 타입 정의
interface SelectedFile {
  file: File;
  color: string;
}

export function DocumentCalendarWebsite({ highlightElement }: DocumentCalendarWebsiteProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // 선택된 파일들의 목록 상태 관리
  const [selectedFiles, setSelectedFiles] = useState<SelectedFile[]>([]);
  // 모달(팝업창) 표시 여부
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 1. 파일 선택 시 실행 (모달 열기)
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    // 새로 선택된 파일들을 기존 목록에 추가하지 않고 새로 세팅 (원하면 추가 방식으로 변경 가능)
    const newFiles = Array.from(files).map(file => ({
      file,
      color: "1" // 기본 색상 1번
    }));

    setSelectedFiles(newFiles);
    setIsModalOpen(true); // 파일 선택 즉시 모달 띄우기
    
    // 같은 파일 재선택 가능하도록 input 초기화
    event.target.value = "";
  };

  // 2. 개별 파일 색상 변경 핸들러
  const handleColorChange = (index: number, newColor: string) => {
    setSelectedFiles(prev => prev.map((item, i) => 
      i === index ? { ...item, color: newColor } : item
    ));
  };

  // 3. 목록에서 파일 삭제 핸들러
  const handleRemoveFile = (index: number) => {
    setSelectedFiles(prev => {
      const newFiles = prev.filter((_, i) => i !== index);
      if (newFiles.length === 0) setIsModalOpen(false); // 다 지우면 창 닫기
      return newFiles;
    });
  };

  // 4. "등록하기" 버튼 클릭 시 (백엔드 전송)
  const handleFinalUpload = async () => {
    if (selectedFiles.length === 0) return;

    try {
      alert(`${selectedFiles.length}개의 파일을 처리합니다...`);
      
      // 여러 파일을 순서대로 전송 (또는 백엔드가 다중 파일을 지원하면 한 번에 전송)
      for (const item of selectedFiles) {
        const formData = new FormData();
        formData.append("file", item.file);
        formData.append("color", item.color);

        const response = await fetch("/api/schedule/upload", {
          method: "POST",
          body: formData,
        });
        
        if (!response.ok) {
           throw new Error(`${item.file.name} 처리 실패`);
        }
      }

      alert("모든 일정이 성공적으로 등록되었습니다!");
      setIsModalOpen(false);
      setSelectedFiles([]);

    } catch (error) {
      console.error(error);
      alert("일부 파일 처리에 실패했습니다.");
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="min-h-screen bg-background relative">
      {/* Header */}
      <header 
        className={`border-b px-6 py-4 ${highlightElement === 'header' ? 'relative z-10' : ''}`}
        data-tutorial="header"
      >
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">W</span>
            </div>
            <h1 className="text-2xl font-bold">첫단추</h1>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline" data-tutorial="login">로그인</Button>
            <Button data-tutorial="signup">시작하기</Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section 
        className={`px-6 py-16 ${highlightElement === 'hero' ? 'relative z-10' : ''}`}
        data-tutorial="hero"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge className="bg-orange-100 text-orange-800 border-orange-200">
                  <Zap className="w-3 h-3 mr-1" />
                  AI 문서 인식
                </Badge>
                <h1 className="text-4xl lg:text-5xl font-bold leading-tight">
                  복잡한 수업 일정,<br />
                  이제 세 줄어 넘 봐.
                </h1>
                <p className="text-xl text-muted-foreground">
                  PDF, Word, 이미지 속 일정을 AI가 자동으로 인식해서<br />
                  Google 캘린더에 바로 추가해드립니다.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  style={{ display: 'none' }} 
                  accept=".jpg,.jpeg,.png,.pdf"
                  multiple // 여러 파일 선택 가능하게 변경
                />

                <Button 
                  size="lg" 
                  className="bg-orange-500 hover:bg-orange-600" 
                  data-tutorial="start"
                  onClick={handleUploadClick}
                >
                  파일 업로드하기
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>

              <div className="flex items-center space-x-8 text-sm text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>공짜로 사용가능</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>설치 불필요</span>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-orange-100 to-orange-50">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1633526543814-9718c8922b7a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2N1bWVudHMlMjBjYWxlbmRhciUyMHBsYW5uaW5nfGVufDF8fHx8MTc1OTI0NzE5OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="문서 및 캘린더"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-xl">W</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={`px-6 py-16 bg-muted/30 ${highlightElement === 'features' ? 'relative z-10' : ''}`} data-tutorial="features">
        <div className="max-w-7xl mx-auto">
           {/* (기존 Features 내용은 동일하므로 생략하지 않고 그대로 둠 - 위쪽 코드 참고) */}
           <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">복잡한 수업 일정, 이제 세 줄어 넘 봐</h2>
            <p className="text-lg text-muted-foreground">
              어떤 형태의 문서든 AI가 자동으로 일정을 찾아 캘린더에 추가합니다
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
             {/* ... Card 컴포넌트들 (기존과 동일) ... */}
              <Card className="relative overflow-hidden">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle>PDF 문서 인식</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  수업 계획서, 강의 일정표 등 PDF 속 모든 일정을 자동으로 추출합니다.
                </p>
                 <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                   {/* 이미지 태그 생략 가능하지만 구조 유지 */}
                   <div className="w-full h-full bg-slate-200" />
                </div>
              </CardContent>
            </Card>
             <Card className="relative overflow-hidden">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Image className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle>이미지 텍스트 인식</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  사진으로 찍은 일정표나 화이트보드의 일정도 정확하게 인식합니다.
                </p>
                 <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                   <div className="w-full h-full bg-slate-200" />
                </div>
              </CardContent>
            </Card>
            <Card className="relative overflow-hidden">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Calendar className="w-6 h-6 text-purple-600" />
                </div>
                <CardTitle>자동 캘린더 연동</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  인식된 일정을 Google 캘린더에 자동으로 추가하고 알림까지 설정합니다.
                </p>
                 <div className="aspect-video bg-white rounded-lg overflow-hidden flex items-center justify-center p-4">
                  <img src={calendarImage} alt="Calendar" className="w-full h-full object-contain" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* 5. 파일 선택 확인 모달 (AnimatePresence로 부드럽게) */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
            >
              {/* 모달 헤더 */}
              <div className="bg-orange-500 p-4 flex justify-between items-center text-white">
                <h3 className="font-bold text-lg flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  선택된 파일 목록
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="hover:bg-orange-600 p-1 rounded-full transition">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* 파일 리스트 영역 */}
              <div className="p-6 max-h-[60vh] overflow-y-auto space-y-4">
                {selectedFiles.map((item, index) => (
                  <div key={index} className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-200 shadow-sm">
                    {/* 왼쪽: 파일 정보 */}
                    <div className="flex items-center space-x-3 overflow-hidden">
                      <div className="w-10 h-10 bg-white rounded-lg border flex items-center justify-center shrink-0">
                        {item.file.name.endsWith('.pdf') ? (
                          <FileText className="text-red-500 w-6 h-6" />
                        ) : (
                          <Image className="text-blue-500 w-6 h-6" />
                        )}
                      </div>
                      <div className="truncate">
                        <p className="font-medium text-sm truncate max-w-[150px]" title={item.file.name}>
                          {item.file.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {(item.file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>

                    {/* 오른쪽: 색상 선택 및 삭제 버튼 */}
                    <div className="flex items-center space-x-2 shrink-0">
                      <select
                        value={item.color}
                        onChange={(e) => handleColorChange(index, e.target.value)}
                        className="text-sm border rounded px-2 py-1 bg-white focus:ring-2 focus:ring-orange-500 outline-none cursor-pointer"
                        title="캘린더 색상"
                      >
                         {Array.from({ length: 11 }, (_, i) => i + 1).map((num) => (
                          <option key={num} value={num}>Color {num}</option>
                        ))}
                      </select>
                      
                      <button 
                        onClick={() => handleRemoveFile(index)}
                        className="text-slate-400 hover:text-red-500 transition p-1"
                        title="파일 삭제"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* 모달 하단 버튼 */}
              <div className="p-4 border-t bg-slate-50 flex justify-end space-x-3">
                <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
                  취소
                </Button>
                <Button className="bg-orange-500 hover:bg-orange-600" onClick={handleFinalUpload}>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  일정 등록하기
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}