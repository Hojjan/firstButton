import { motion } from "motion/react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { CheckCircle, RotateCcw } from "lucide-react";

interface CompletionDialogProps {
  isOpen: boolean;
  onRestart: () => void;
  onClose: () => void;
}

export function CompletionDialog({ isOpen, onRestart, onClose }: CompletionDialogProps) {
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
          <CardHeader className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5, type: "spring", bounce: 0.6 }}
              className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <span className="text-white font-bold text-xl">W</span>
            </motion.div>
            <CardTitle className="text-2xl">튜토리얼 완료!</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-muted-foreground"
            >
              첫단추의 주요 기능들을 모두 확인하셨습니다. 
              이제 문서를 업로드해서 일정을 자동으로 관리해보세요!
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-muted/50 rounded-lg p-4"
            >
              <h4 className="font-medium mb-2">도움이 필요하시면:</h4>
              <p className="text-sm text-muted-foreground">
                고객지원 채팅을 이용하거나 
                help@firstbutton.co.kr로 문의해주세요.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex space-x-3 pt-4"
            >
              <Button 
                variant="outline" 
                onClick={onRestart} 
                className="flex-1 flex items-center space-x-2"
              >
                <RotateCcw className="h-4 w-4" />
                <span>다시보기</span>
              </Button>
              <Button onClick={onClose} className="flex-1 bg-orange-500 hover:bg-orange-600">
                첫단추 시작하기
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}