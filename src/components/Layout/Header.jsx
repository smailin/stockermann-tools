import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Header() {
  const { user, signOut } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path ? "text-blue-400 bg-blue-500/10 border-blue-500/30" : "text-gray-400 hover:text-white hover:bg-gray-800/50 border-gray-700/30";
  const linkClass = "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-bold transition-all border border-transparent hover:border-gray-600/50";
  const groupLabelClass = "text-xs uppercase font-bold text-gray-500 px-3 py-1 hidden lg:block";
  const externalLinkClass = "flex items-center gap-2 px-3 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800/50 border border-transparent hover:border-gray-600/50 transition-all text-sm font-bold";
  const buttonClass = "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-bold transition-all border border-transparent";

  return (
    <header className="h-16 border-b border-gray-800 bg-[#09090b]/95 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto h-full flex items-center justify-between px-4">
        
        {/* LOGO */}
        <Link to="/" className="flex items-center gap-3 group">
          <img src="/logo.png" alt="StockerMann" className="h-10 w-auto object-contain" />
          <span className="font-bold text-lg tracking-tight hidden md:block text-white">STOCKERMANN</span>
        </Link>

        {/* NAVEGAÇÃO */}
        <nav className="hidden md:flex items-center">
          {/* FERRAMENTAS */}
          <div className="flex items-center">
            <span className={groupLabelClass}>Ferramentas</span>
            <Link to="/editor" className={`${linkClass} ${isActive('/editor')}`}>
              🛠️ <span className="hidden lg:inline">Editor de Layout</span>
            </Link>
            <Link to="/generator" className={`${linkClass} ${isActive('/generator')}`}>
              ✨ <span className="hidden lg:inline">Editor de Bio</span>
            </Link>
            <Link to="/emotes" className={`${linkClass} ${isActive('/emotes')}`}>
              🤖 <span className="hidden lg:inline">Redimensionador</span>
            </Link>
          </div>

          {/* SEPARADOR */}
          <div className="h-6 w-px bg-gray-800 mx-2"></div>

          {/* OUTROS */}
          <Link to="/games" className={`${linkClass} ${isActive('/games')}`}>
            🎮 <span className="hidden lg:inline">Jogos Zerados</span>
          </Link>
        </nav>

        {/* LINKS EXTERNOS & LOGIN */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 mr-2 border-r border-gray-700/30 pr-3">
             <a href="https://medium.com/@stockermann" target="_blank" rel="noopener" title="Blog" className={externalLinkClass}>📝 <span className="hidden lg:inline">Blog</span></a>
             <a href="https://ko-fi.com/stockermann/shop" target="_blank" rel="noopener" title="Loja Ko-Fi" className={externalLinkClass}>🛍️ <span className="hidden lg:inline">Loja Ko-Fi</span></a>
             <a href="https://ko-fi.com/stockermann" target="_blank" rel="noopener" title="Apoiar" className={externalLinkClass}>☕ <span className="hidden lg:inline">Apoiar</span></a>
          </div>

          {user ? (
            <div className="flex items-center gap-2">
               <span className="text-gray-500 text-xs hidden lg:block">{user.email}</span>
              <button onClick={signOut} className={`${buttonClass} text-red-400 border-red-900/30 hover:bg-red-500/10 hover:border-red-500/50`}>SAIR</button>
            </div>
          ) : (
            <Link to="/login" className={`${buttonClass} bg-blue-600 text-white hover:bg-blue-500 border-blue-500/50 hover:border-blue-400`}>
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}