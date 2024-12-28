// src/components/Forms/Login.tsx

import { useState } from 'react';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Aqui você pode adicionar a lógica de autenticação
    if (!username || !password) {
      setErrorMessage('Por favor, preencha todos os campos.');
    } else {
      setErrorMessage('');
      console.log('Login bem-sucedido', { username, password });
      // Redirecionar ou realizar login
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-mediumslate mb-4">Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="username" className="block text-mediumslate mb-2">Usuário:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Digite seu nome de usuário"
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
            placeholder="Digite sua senha"
            className="w-full p-2 border border-darkcarbon rounded-md"
          />
        </div>
        {errorMessage && <div className="text-red-500 mb-4">{errorMessage}</div>}
        <button type="submit" className="mt-4 bg-blue-500 text-white p-2 rounded-md w-full">
          Entrar
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
