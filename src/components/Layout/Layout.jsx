import React from 'react';
import Header from './Header';

export default function Layout({ children, title }) {
  // Muda o título da aba do navegador
  React.useEffect(() => {
    document.title = title ? `${title} | Stockermann Tools` : "Stockermann Tools";
  }, [title]);

  return (
    <div className="min-h-screen bg-black text-white font-sans flex flex-col">
      <Header />
      <main className="flex-1 w-full relative">
        {children}
      </main>
      
      {/* Footer Simples */}
      <footer className="border-t border-gray-900 py-6 text-center text-gray-600 text-sm">
        <p>© 2025 Stockermann Tools. Feito com 💜 e Café.</p>
      </footer>
    </div>
  );
}