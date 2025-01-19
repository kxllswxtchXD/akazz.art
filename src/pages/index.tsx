import { motion } from 'framer-motion';
import UploadForm from '@/components/Upload/Form';

export default function Home() {
  return (
    <motion.div className="flex items-center justify-center min-h-screen p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <div className="border border-border shadow-md rounded-lg p-8 w-full max-w-lg">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          <UploadForm />
        </motion.div>
      </div>
    </motion.div>
  );
}