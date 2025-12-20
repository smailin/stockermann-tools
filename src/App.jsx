import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Pages
import Home from './pages/Home';
import Editor from './pages/Editor';
import MarkdownGenerator from './pages/MarkdownGenerator'; // <--- O NOME CERTO
import Login from './pages/Login';
import EmoteFactory from './pages/EmoteFactory';

// Auth
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-950 text-white font-sans antialiased">
          <Toaster 
            position="bottom-right" 
            toastOptions={{ 
              style: { background: '#18181b', color: '#fff', border: '1px solid #27272a' } 
            }} 
          />
          
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/editor" element={<Editor />} />
            {/* Rota atualizada para usar o arquivo correto */}
            <Route path="/generator" element={<MarkdownGenerator />} /> 
            <Route path="/emotes" element={<EmoteFactory />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;