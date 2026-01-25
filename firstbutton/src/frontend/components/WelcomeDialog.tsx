// 사이트 처음 들어갔을때 나오는 튜토리얼
import { motion } from "motion/react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Play, X } from "lucide-react";

interface WelcomeDialogProps {
  isOpen: boolean;
  onStartTutorial: () => void;
  onClose: () => void;
}

export function WelcomeDialog({ isOpen, onStartTutorial, onClose }: WelcomeDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 20 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="w-96 shadow-2xl">
          <CardHeader className="text-center relative">
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute right-2 top-2"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5, type: "spring", bounce: 0.6 }}
              className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <span className="text-white font-bold text-xl">W</span>
            </motion.div>
            <CardTitle className="text-2xl">첫단추 이용법 안내</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">
              첫단추의 주요 기능들을 단계별로 안내해드릴게요. 
              약 2분 정도 소요됩니다.
            </p>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-3 text-sm">
                <div className="w-2 h-2 bg-orange-500 rounded-full" />
                <span>문서 업로드 및 일정 인식 방법</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <div className="w-2 h-2 bg-orange-500 rounded-full" />
                <span>Google 캘린더 연동 기능</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <div className="w-2 h-2 bg-orange-500 rounded-full" />
                <span>주요 메뉴 및 기능 소개</span>
              </div>
            </div>

            <div className="flex space-x-3 pt-4">
              <Button variant="outline" onClick={onClose} className="flex-1">
                나중에
              </Button>
              <Button onClick={onStartTutorial} className="flex-1">
                시작하기
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}