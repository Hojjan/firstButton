import { useState } from "react";
import { motion } from "motion/react";
import { DocumentCalendarWebsite } from "./components/DocumentCalendarWebsite";
import { FeaturesGuide } from "./components/FeaturesGuide";
import { Button } from "./components/ui/button";
import { HelpCircle } from "lucide-react";

export default function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'guide'>('home');

  const navigateToGuide = () => {
    setCurrentPage('guide');
  };

  const navigateToHome = () => {
    setCurrentPage('home');
  };

  // 이용법 가이드 페이지 전환 로직
  if (currentPage === 'guide') {
    return <FeaturesGuide onBack={navigateToHome} />;
  }

  return (
    <div className="relative min-h-screen">
      {/* 메인 웹사이트: 접속 시 바로 노출되도록 변경 */}
      <DocumentCalendarWebsite onNavigateToGuide={navigateToGuide} />

      {/* Floating Help Button: 애니메이션 효과 유지 */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, duration: 0.3 }}
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

      {/* Background Animation: 프로젝트의 미적 요소를 위해 유지 */}
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