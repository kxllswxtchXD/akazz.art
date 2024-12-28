import { useState } from 'react';
import { motion } from 'framer-motion';
import UploadForm from '@/components/Upload/Form';
import Dropdown from '@/components/Dropdown';
import LoginForm from '@/components/Forms/Login';
import Dashboard from '@/components/Dashboard';
import RegisterForm from '@/components/Forms/Register';

export default function Home() {
  const [selectedForm, setSelectedForm] = useState<string>('upload'); // 'upload', 'login', 'register', 'dashboard'

  const handleSelectForm = (form: string) => {
    setSelectedForm(form); // Atualiza o estado selecionado com a escolha do formulário
  };

  return (
    <>
      <motion.div
        className="flex items-center justify-center min-h-screen p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="border border-darkcarbon shadow-md rounded-lg p-8 w-full max-w-lg">
          <h1 className="text-3xl font-bold text-center text-mediumslate mb-6 font-varela">
            Akazz — Host
          </h1>
          <motion.div
            key={selectedForm}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Dropdown onSelect={handleSelectForm} />
            {selectedForm === 'upload' && <UploadForm />}
            {selectedForm === 'login' && <LoginForm />}
            {selectedForm === 'register' && <RegisterForm />}
            {selectedForm === 'dashboard' && <Dashboard />}
          </motion.div>
        </div>
      </motion.div>
    </>
  );
}
