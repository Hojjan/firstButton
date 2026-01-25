// 사이트 메인 (랜딩) 페이지
import { Upload, Calendar, FileText, Image, Clock, CheckCircle, ArrowRight, Menu, User, Zap } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import calendarImage from "../assets/calendar.jpg";

interface DocumentCalendarWebsiteProps {
  highlightElement?: string;
  onNavigateToGuide?: () => void;
}

export function DocumentCalendarWebsite({ highlightElement, onNavigateToGuide }: DocumentCalendarWebsiteProps) {
  return (
    <div className="min-h-screen bg-background">
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
                <Button size="lg" className="bg-orange-500 hover:bg-orange-600" data-tutorial="start">
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
      <section 
        className={`px-6 py-16 bg-muted/30 ${highlightElement === 'features' ? 'relative z-10' : ''}`}
        data-tutorial="features"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">복잡한 수업 일정, 이제 세 줄어 넘 봐</h2>
            <p className="text-lg text-muted-foreground">
              어떤 형태의 문서든 AI가 자동으로 일정을 찾아 캘린더에 추가합니다
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1616861771635-49063a4636ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZGYlMjBkb2N1bWVudCUyMHVwbG9hZHxlbnwxfHx8fDE3NTkyNDcyMDF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                    alt="PDF 문서"
                    className="w-full h-full object-cover"
                  />
                </div>
              </CardContent>
              <div className="absolute top-4 right-4 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xs">W</span>
              </div>
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
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1718220216044-006f43e3a9b1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvZmZpY2UlMjB3b3Jrc3BhY2UlMjBwcm9kdWN0aXZpdHl8ZW58MXx8fHwxNzU5MjIxMzM1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                    alt="워크스페이스"
                    className="w-full h-full object-cover"
                  />
                </div>
              </CardContent>
              <div className="absolute top-4 right-4 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xs">W</span>
              </div>
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
                  <img
                    src={calendarImage}
                    alt="Google 캘린더 연동 결과"
                    className="w-full h-full object-contain"
                  />
                </div>
              </CardContent>
              <div className="absolute top-4 right-4 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xs">W</span>
              </div>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}