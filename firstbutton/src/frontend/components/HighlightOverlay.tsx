import { motion } from "motion/react";
import { useEffect, useState } from "react";

interface HighlightOverlayProps {
  targetElement?: string;
  isActive: boolean;
}

export function HighlightOverlay({ targetElement, isActive }: HighlightOverlayProps) {
  const [position, setPosition] = useState({ x: 0, y: 0, width: 0, height: 0 });

  useEffect(() => {
    if (!targetElement || !isActive) return;

    const updatePosition = () => {
      const element = document.querySelector(`[data-tutorial="${targetElement}"]`);
      if (element) {
        const rect = element.getBoundingClientRect();
        setPosition({
          x: rect.left,
          y: rect.top,
          width: rect.width,
          height: rect.height,
        });
      }
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition);

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition);
    };
  }, [targetElement, isActive]);

  if (!isActive || !targetElement) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {/* Dark overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.8 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black"
      />
      
      {/* Spotlight */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ 
          opacity: 1, 
          scale: 1,
          x: position.x - 8,
          y: position.y - 8,
        }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        style={{
          width: position.width + 16,
          height: position.height + 16,
        }}
        className="absolute bg-transparent border-4 border-blue-400 rounded-lg shadow-2xl"
      >
        {/* Pulsing glow effect */}
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.6, 0.8, 0.6],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute inset-0 bg-blue-400/20 rounded-lg"
        />
        
        {/* Cut out the background */}
        <div 
          className="absolute inset-1 bg-white/10 rounded"
          style={{
            boxShadow: `0 0 0 9999px rgba(0, 0, 0, 0.8)`,
          }}
        />
      </motion.div>

      {/* Animated pointer */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ 
          opacity: 1, 
          scale: 1,
          x: position.x + position.width / 2,
          y: position.y - 40,
        }}
        exit={{ opacity: 0, scale: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className="absolute"
      >
        <motion.div
          animate={{
            y: [0, -10, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="w-0 h-0 border-l-[12px] border-r-[12px] border-t-[16px] border-l-transparent border-r-transparent border-t-blue-400"
        />
      </motion.div>
    </div>
  );
}