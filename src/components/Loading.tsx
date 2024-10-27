// src/components/Loading.tsx
import { motion } from 'framer-motion';
import React from 'react';

const Loading: React.FC = () => {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="w-14 h-14 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
      </div>
    </motion.div>
  );
};

export default Loading;
