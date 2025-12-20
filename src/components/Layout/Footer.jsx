import React, { useState } from 'react';
import { FaYoutube, FaTwitter, FaHashtag, FaEnvelope, FaPaperPlane, FaTwitch } from 'react-icons/fa';
import { supabase } from '../../services/supabase';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email.includes('@')) return;
    setStatus('loading');

    try {
      const { error } = await supabase.from('newsletter_subscribers').insert({ email });
      if (error) {
        if (error.code === '23505') throw new Error("Você já está inscrito!");
        throw error;
      }
      setStatus('success');
      setEmail('');
    } catch (err) {
      console.error(err);
      setStatus('error');
      alert(err.message || "Erro ao inscrever.");
    } finally {
      if(status !== 'success') setStatus('idle');
    }
  };

  return (
    <footer className="bg-gray-900 border-t border-gray-800 pt-12 pb-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12">
        
        {/* COLUNA 1: MARCA */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center font-bold text-white">S</div>
            <h2 className="font-bold text-xl text-white">STOCKERMANN</h2>
          </div>
          <p className="text-gray-400 text-sm">
            Ferramentas gratuitas para streamers. Desenvolvido com carinho para a comunidade.
          </p>
        </div>

        {/* COLUNA 2: SOCIAL */}
        <div>
          <h3 className="text-white font-bold mb-4 uppercase tracking-wider text-sm">Minhas Redes</h3>
          <ul className="space-y-3">
            {/* LINK DA TWITCH ADICIONADO AQUI */}
            <li>
              <a href="https://www.twitch.tv/stockermann2" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-gray-400 hover:text-purple-500 transition-colors">
                <FaTwitch size={20} /> Twitch
              </a>
            </li>
            <li>
              <a href="https://www.youtube.com/@stockermannlive" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-gray-400 hover:text-red-500 transition-colors">
                <FaYoutube size={20} /> YouTube
              </a>
            </li>
            <li>
              <a href="https://twitter.com/stockermann" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-gray-400 hover:text-blue-400 transition-colors">
                <FaTwitter size={20} /> X / Twitter
              </a>
            </li>
            <li>
              <a href="https://threads.net/@stockermann" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                <FaHashtag size={20} /> Threads
              </a>
            </li>
          </ul>
        </div>

        {/* COLUNA 3: NEWSLETTER */}
        <div>
          <h3 className="text-white font-bold mb-4 uppercase tracking-wider text-sm">Novidades</h3>
          <p className="text-gray-400 text-xs mb-4">Receba dicas de stream e atualizações das ferramentas.</p>
          
          {status === 'success' ? (
            <div className="bg-green-900/30 text-green-400 p-3 rounded border border-green-500/30 text-sm">
              ✅ Obrigado! Você está na lista.
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
              <div className="flex bg-gray-950 border border-gray-700 rounded-lg overflow-hidden focus-within:border-blue-500 transition-colors">
                <div className="pl-3 py-3 text-gray-500"><FaEnvelope /></div>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com" 
                  className="bg-transparent border-none text-white text-sm w-full p-3 focus:ring-0 outline-none placeholder-gray-600"
                  required
                />
              </div>
              <button 
                type="submit" 
                disabled={status === 'loading'}
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors"
              >
                {status === 'loading' ? 'Enviando...' : <><FaPaperPlane /> Inscrever-se</>}
              </button>
            </form>
          )}
        </div>
      </div>

      <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-600 text-xs">
        &copy; {new Date().getFullYear()} Stockermann Tools.
      </div>
    </footer>
  );
}