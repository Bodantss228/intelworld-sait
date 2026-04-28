'use client';

import { useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export default function MagneticButton({ children, className = '', onClick }: MagneticButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [transform, setTransform] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = buttonRef.current?.getBoundingClientRect();
    if (!rect) return;

    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const distanceX = e.clientX - centerX;
    const distanceY = e.clientY - centerY;

    setTransform({
      x: distanceX * 0.3,
      y: distanceY * 0.3,
    });
  };

  const handleMouseLeave = () => {
    setTransform({ x: 0, y: 0 });
  };

  return (
    <motion.button
      ref={buttonRef}
      className={`relative overflow-hidden ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      animate={{
        x: transform.x,
        y: transform.y,
      }}
      transition={{
        type: 'spring',
        stiffness: 150,
        damping: 15,
        mass: 0.1,
      }}
    >
      {children}
    </motion.button>
  );
}
