import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Layout/Header';
import { FaGoogle } from 'react-icons/fa';

export default function Login() {
  const { user, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/'); // Se já estiver logado, manda pra Home
    }
  }, [user, navigate]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-950 text-white">
      <Header />
      
      <main className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md bg-gray-900 border border-gray-800 p-8 rounded-2xl shadow-2xl text-center">
          <h1 className="text-2xl font-black mb-2">Bem-vindo de volta!</h1>
          <p className="text-gray-400 mb-8">Faça login para salvar seus layouts na nuvem.</p>

          <button 
            onClick={signInWithGoogle}
            className="w-full bg-white text-gray-900 hover:bg-gray-100 font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-3 transition-transform active:scale-95"
          >
            <FaGoogle className="text-red-500" />
            Entrar com Google
          </button>
          
          <p className="mt-6 text-xs text-gray-600">
            Ao continuar, você concorda com os termos de uso do Stockermann Tools.
          </p>
        </div>
      </main>
    </div>
  );
}