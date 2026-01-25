import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { HighlightOverlay } from "./HighlightOverlay";
import { TutorialStep } from "./TutorialStep";

interface TutorialProps {
  isActive: boolean;
  onComplete: () => void;
}

const tutorialSteps = [
  {
    id: 'header',
    target: 'header',
    title: '상단 헤더',
    description: '첫단추 로고와 주요 메뉴가 위치한 헤더 영역입니다. 로그인과 회원가입도 여기서 할 수 있어요.',
    position: { x: 400, y: 120 },
  },
  {
    id: 'menu',
    target: 'menu',
    title: '메뉴 버튼',
    description: '모바일에서 네비게이션 메뉴를 열 수 있는 버튼입니다. 기능소개, 사용법 등을 확인할 수 있어요.',
    position: { x: 200, y: 160 },
  },
  {
    id: 'signup',
    target: 'signup',
    title: '시작하기 버튼',
    description: '무료로 첫단추를 시작할 수 있는 버튼입니다. 신용카드 없이도 바로 체험해보세요.',
    position: { x: 600, y: 160 },
  },
  {
    id: 'hero',
    target: 'hero',
    title: '메인 소개 섹션',
    description: '첫단추의 핵심 기능을 소개하는 영역입니다. PDF, Word, 이미지에서 일정을 자동으로 인식합니다.',
    position: { x: 400, y: 350 },
  },
  {
    id: 'start',
    target: 'start',
    title: '무료 시작하기',
    description: '지금 바로 첫단추를 무료로 체험해볼 수 있습니다. 설치나 복잡한 설정이 필요없어요.',
    position: { x: 300, y: 450 },
  },
  {
    id: 'demo',
    target: 'demo',
    title: '데모 보기',
    description: '실제 첫단추가 어떻게 작동하는지 데모를 통해 미리 확인해볼 수 있습니다.',
    position: { x: 500, y: 450 },
  },
  {
    id: 'features',
    target: 'features',
    title: '주요 기능 소개',
    description: 'PDF 문서 인식, 이미지 텍스트 인식, 자동 캘린더 연동 등 첫단추의 핵심 기능들을 소개합니다.',
    position: { x: 400, y: 600 },
  },
  {
    id: 'upload',
    target: 'upload',
    title: '파일 업로드 데모',
    description: '실제로 어떻게 파일을 업로드하고 일정이 추출되는지 확인할 수 있는 데모 섹션입니다.',
    position: { x: 400, y: 800 },
  },
  {
    id: 'cta',
    target: 'cta',
    title: '최종 행동 유도',
    description: '첫단추의 모든 기능을 확인했다면, 지금 바로 무료로 시작해보세요!',
    position: { x: 400, y: 950 },
  },
];

export function Tutorial({ isActive, onComplete }: TutorialProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isActive) {
      // 약간의 지연 후 시작
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
      setCurrentStep(0);
    }
  }, [isActive]);

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    setIsVisible(false);
    setTimeout(() => {
      onComplete();
    }, 300);
  };

  const currentTutorialStep = tutorialSteps[currentStep];

  if (!isActive) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          <HighlightOverlay 
            targetElement={currentTutorialStep?.target}
            isActive={isVisible}
          />
          
          {currentTutorialStep && (
            <TutorialStep
              title={currentTutorialStep.title}
              description={currentTutorialStep.description}
              currentStep={currentStep + 1}
              totalSteps={tutorialSteps.length}
              onNext={handleNext}
              onPrevious={handlePrevious}
              onSkip={handleComplete}
              position={currentTutorialStep.position}
            />
          )}
        </>
      )}
    </AnimatePresence>
  );
}