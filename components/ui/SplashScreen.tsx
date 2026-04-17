"use client";
import React, { useEffect, useState } from 'react';
import { MonitorPlay } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const SplashScreen = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0b0d11]"
        >
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <MonitorPlay size={80} className="text-blue-500 shadow-[0_0_30px_rgba(59,130,246,0.6)]" />
          </motion.div>
          
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-6 text-2xl font-bold tracking-[0.2em] text-white uppercase"
          >
            Yangon TV <span className="text-blue-500">Lab</span>
          </motion.h1>
          
          <div className="mt-10 w-48 h-[1px] bg-white/10 overflow-hidden rounded-full">
            <motion.div 
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-full h-full bg-blue-500 shadow-[0_0_10px_#3b82f6]"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};