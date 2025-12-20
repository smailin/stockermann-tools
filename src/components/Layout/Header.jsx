import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaUserCircle, FaSignOutAlt, FaTools, FaMagic, FaRobot } from 'react-icons/fa';

export default function Header() {
  const { user, signOut } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path ? "text-blue-400 bg-blue-500/10" : "text-gray-400 hover:text-white hover:bg-gray-800";
  const linkClass = "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-bold transition-all";

  return (
    <header className="h-16 border-b border-gray-800 bg-[#09090b]/80 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto h-full flex items-center justify-between px-4">
        
        {/* LOGO */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center font-bold text-white shadow-lg group-hover:scale-105 transition-transform">S</div>
          <span className="font-bold text-lg tracking-tight hidden md:block">STOCKERMANN.COM.BR</span>
        </Link>

        {/* NAVEGAÇÃO CENTRAL (Adicionado Dimensionador) */}
        <nav className="flex items-center gap-1 md:gap-2">
          <Link to="/editor" className={`${linkClass} ${isActive('/editor')}`}>
            <FaTools /> <span className="hidden md:inline">Editor</span>
          </Link>
          <Link to="/generator" className={`${linkClass} ${isActive('/generator')}`}>
            <FaMagic /> <span className="hidden md:inline">Bio</span>
          </Link>
          <Link to="/emotes" className={`${linkClass} ${isActive('/emotes')}`}>
            <FaRobot /> <span className="hidden md:inline">Dimensionador</span>
          </Link>
        </nav>

        {/* ÁREA DO USUÁRIO */}
        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3 bg-gray-900 border border-gray-800 pl-3 pr-1 py-1 rounded-full">
              <span className="text-xs text-gray-300 font-medium truncate max-w-[100px]">{user.user_metadata?.full_name || user.email}</span>
              <img 
                src={user.user_metadata?.avatar_url || "https://api.dicebear.com/7.x/avataaars/svg?seed=Stockermann"} 
                alt="Avatar" 
                className="w-8 h-8 rounded-full border border-gray-700"
              />
              <button onClick={signOut} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-red-500/20 text-gray-400 hover:text-red-500 transition-colors" title="Sair">
                <FaSignOutAlt size={14} />
              </button>
            </div>
          ) : (
            <Link to="/login" className="bg-white text-black px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-200 transition-colors">
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}