// src/components/Forms/Register.tsx

import { useState } from 'react';

const RegisterForm = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !email || !password || !confirmPassword) {
      setErrorMessage('Por favor, preencha todos os campos.');
    } else if (password !== confirmPassword) {
      setErrorMessage('As senhas não coincidem.');
    } else {
      setErrorMessage('');
      console.log('Registro bem-sucedido', { username, email, password });
      // Lógica para registrar o usuário
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-mediumslate mb-4">Registrar</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="username" className="block text-mediumslate mb-2">Usuário:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Escolha um nome de usuário"
            className="w-full p-2 border border-darkcarbon rounded-md"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-mediumslate mb-2">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Digite seu email"
            className="w-full p-2 border border-darkcarbon rounded-md"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-mediumslate mb-2">Senha:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Crie uma senha"
            className="w-full p-2 border border-darkcarbon rounded-md"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="confirmPassword" className="block text-mediumslate mb-2">Confirmar Senha:</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirme sua senha"
            className="w-full p-2 border border-darkcarbon rounded-md"
          />
        </div>
        {errorMessage && <div className="text-red-500 mb-4">{errorMessage}</div>}
        <button type="submit" className="mt-4 bg-blue-500 text-white p-2 rounded-md w-full">
          Registrar
        </button>
      </form>
    </div>
  );
};

export default RegisterForm;
