import { motion } from "motion/react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

interface TutorialStepProps {
  title: string;
  description: string;
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onPrevious: () => void;
  onSkip: () => void;
  position: { x: number; y: number };
}

export function TutorialStep({
  title,
  description,
  currentStep,
  totalSteps,
  onNext,
  onPrevious,
  onSkip,
  position,
}: TutorialStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ 
        opacity: 1, 
        scale: 1, 
        x: position.x,
        y: position.y,
      }}
      exit={{ opacity: 0, scale: 0.8, y: 20 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="fixed z-50 pointer-events-auto"
      style={{ 
        maxWidth: '320px',
        transform: 'translate(-50%, 100%)',
      }}
    >
      <Card className="shadow-2xl border-blue-200">
        <CardContent className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full" />
              <span className="text-sm text-muted-foreground">
                {currentStep} / {totalSteps}
              </span>
            </div>
            <Button variant="ghost" size="icon" onClick={onSkip}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Content */}
          <div className="mb-6">
            <h3 className="font-bold mb-2">{title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {description}
            </p>
          </div>

          {/* Progress bar */}
          <div className="mb-4">
            <div className="flex space-x-1">
              {Array.from({ length: totalSteps }).map((_, i) => (
                <div
                  key={i}
                  className={`h-1 flex-1 rounded-full transition-colors ${
                    i < currentStep ? 'bg-blue-500' : 'bg-muted'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={onPrevious}
              disabled={currentStep === 1}
              className="flex items-center space-x-1"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>이전</span>
            </Button>

            <Button variant="ghost" size="sm" onClick={onSkip}>
              건너뛰기
            </Button>

            <Button
              size="sm"
              onClick={onNext}
              className="flex items-center space-x-1"
            >
              <span>{currentStep === totalSteps ? '완료' : '다음'}</span>
              {currentStep !== totalSteps && <ChevronRight className="h-4 w-4" />}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}