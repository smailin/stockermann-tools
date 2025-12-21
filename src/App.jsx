import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// --- PÁGINAS CONFIRMADAS ---
import Home from './pages/Home';
import Login from './pages/Login';
import GamesList from './pages/GamesList'; 
import EmoteFactory from './pages/EmoteFactory'; // <--- Nome corrigido!

// --- PÁGINAS DO EDITOR E GERADOR DE BIO ---
import Editor from './pages/Editor';
import Generator from './pages/MarkdownGenerator'; 

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* --- ROTAS QUE FUNCIONAM --- */}
        <Route path="/" element={<Home />} />
        <Route path="/games" element={<GamesList />} />
        <Route path="/login" element={<Login />} />
        
        {/* Rota de Emotes (Agora com o nome certo do arquivo) */}
        <Route path="/emotes" element={<EmoteFactory />} />

        {/* --- ROTAS DO EDITOR E BIO --- */}
        <Route path="/editor" element={<Editor />} />
        <Route path="/generator" element={<Generator />} />

        {/* Se a página não existir, volta pra Home */}
        <Route path="*" element={<Home />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;