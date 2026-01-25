import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { DocumentCalendarWebsite } from "./components/DocumentCalendarWebsite";
import { FeaturesGuide } from "./components/FeaturesGuide";
import { Tutorial } from "./components/Tutorial";
import { WelcomeDialog } from "./components/WelcomeDialog";
import { CompletionDialog } from "./components/CompletionDialog";
import { Button } from "./components/ui/button";
import { HelpCircle } from "lucide-react";

export default function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'guide'>('home');
  const [showWelcome, setShowWelcome] = useState(true); //사이트 첫 진입 시 웰컴이 기본으로 켜짐
  const [showTutorial, setShowTutorial] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);

  const startTutorial = () => {
    setShowWelcome(false);
    setShowTutorial(true);
  };

  const completeTutorial = () => {
    setShowTutorial(false);
    setShowCompletion(true);
  };

  const restartTutorial = () => {
    setShowCompletion(false);
    setShowTutorial(true);
  };

  const closeAll = () => {
    setShowWelcome(false);
    setShowTutorial(false);
    setShowCompletion(false);
  };

  const openWelcome = () => {
    setShowWelcome(true);
  };

  const navigateToGuide = () => {
    setCurrentPage('guide');
  };

  const navigateToHome = () => {
    setCurrentPage('home');
  };

  // Show Features Guide page
  if (currentPage === 'guide') {
    return <FeaturesGuide onBack={navigateToHome} />;
  }

  return (
    <div className="relative min-h-screen">
      {/* Main Website - 웰컴 modal 뒤에 랜딩 페이지 띄우기*/}
      <DocumentCalendarWebsite onNavigateToGuide={navigateToGuide} />

      {/* Tutorial Overlay - 처음에는 false로 설정되어있어 안뜸*/}
      <Tutorial 
        isActive={showTutorial}
        onComplete={completeTutorial}
      />

      {/* Welcome Dialogs - 초기값 true로 되어있어 바로 뜸*/}
      <AnimatePresence>
        {showWelcome && (
          <WelcomeDialog key="welcome-dialog" isOpen={showWelcome} onStartTutorial={startTutorial} onClose={closeAll} />
        )}
        
        {showCompletion && (
          <CompletionDialog key="completion-dialog" isOpen={showCompletion} onRestart={restartTutorial} onClose={closeAll} />
        )}
      </AnimatePresence>

      {/* Floating Help Button */}
      {!showWelcome && !showTutorial && !showCompletion && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, duration: 0.3 }}
          className="fixed bottom-6 right-6 z-40"
        >
          <Button
            onClick={navigateToGuide}
            size="lg"
            className="rounded-full shadow-lg hover:shadow-xl transition-shadow flex items-center space-x-2"
          >
            <HelpCircle className="h-5 w-5" />
            <span>이용법 보기</span>
          </Button>
        </motion.div>
      )}

      {/* Background Animation */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-blue-400/20 rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              scale: 0,
            }}
            animate={{
              y: [null, -100],
              scale: [0, 1, 0],
              opacity: [0, 0.6, 0],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeOut",
            }}
          />
        ))}
      </div>
    </div>
  );
}