import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

interface DropdownProps {
  onSelect: (form: string) => void; // A prop 'onSelect' agora aceita uma função para selecionar o formulário
}

const Dropdown = ({ onSelect }: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="fixed top-4 right-4">
      <div className="relative">
        <button
          onClick={toggleDropdown}
          className="bg-blue-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-700 transition"
        >
          Menu
        </button>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg"
            >
              <ul className="py-2">
                <li>
                  <button
                    onClick={() => onSelect('login')} // Passa 'login' para o handleSelectForm
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Login
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onSelect('register')} // Passa 'register' para o handleSelectForm
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Register
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onSelect('dashboard')} // Passa 'dashboard' para o handleSelectForm
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Dashboard
                  </button>
                </li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Dropdown;
