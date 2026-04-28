'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface ServiceCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  details: string[];
}

export default function ServiceCard({ title, description, icon: Icon, color, details }: ServiceCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      className="relative cursor-pointer"
      onClick={() => setIsExpanded(!isExpanded)}
      layout
    >
      <motion.div
        className="relative bg-surface rounded-2xl p-8 overflow-hidden"
        whileHover={{
          scale: 1.05,
          rotateY: 5,
        }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 20,
        }}
        style={{
          boxShadow: isExpanded
            ? `0 20px 60px ${color}66`
            : `0 10px 30px ${color}33`,
        }}
      >
        <div
          className="absolute inset-0 opacity-10"
          style={{
            background: `radial-gradient(circle at top right, ${color}, transparent)`,
          }}
        />

        <div className="relative z-10">
          <motion.div
            className="w-16 h-16 rounded-xl flex items-center justify-center mb-6"
            style={{ backgroundColor: `${color}22` }}
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.6 }}
          >
            <Icon size={32} style={{ color }} />
          </motion.div>

          <h3 className="text-2xl font-bold mb-3" style={{ color }}>
            {title}
          </h3>

          <p className="text-gray-300 mb-4">{description}</p>

          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="border-t border-gray-700 pt-4 mt-4">
                  <h4 className="text-lg font-semibold mb-3">Features:</h4>
                  <ul className="space-y-2">
                    {details.map((detail, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center gap-2"
                      >
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                        <span className="text-gray-300">{detail}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            className="mt-4 text-sm font-semibold"
            style={{ color }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {isExpanded ? 'Click to collapse' : 'Click to learn more'}
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}
