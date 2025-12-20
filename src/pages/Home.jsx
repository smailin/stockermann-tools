import React from 'react';
import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';
import { FaRobot, FaMagic, FaTools } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

export default function Home() {
  const channelName = "stockermann2"; 
<Helmet>
  <title>Stockermann Tools | Ferramentas Grátis para Streamers</title>
  <meta name="description" content="Suíte de ferramentas gratuitas para criadores de conteúdo: Editor de Overlays para OBS, Gerador de Bio para Twitch e Redimensionador de Emotes." />
  <meta name="keywords" content="streamer tools, overlay obs grátis, gerador bio twitch, emotes twitch, ferramentas stream" />
</Helmet>
  return (
    <div className="flex flex-col min-h-screen bg-gray-950 text-white">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        
        {/* HERO SECTION */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-black mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
            STOCKERMANN TOOLS
          </h1>
          <p className="text-gray-400 text-lg">
            Sua suíte de ferramentas para criação de conteúdo.
          </p>
        </div>

        {/* SEÇÃO DA LIVE + CHAT (Centralizada e contida) */}
        <div className="w-full max-w-6xl mx-auto bg-black rounded-xl overflow-hidden border border-gray-800 shadow-2xl grid grid-cols-1 lg:grid-cols-4 h-[500px] mb-12">
          
          {/* Player (3 partes) */}
          <div className="lg:col-span-3 relative w-full h-full bg-black">
            <iframe
              src={`https://player.twitch.tv/?channel=${channelName}&parent=localhost&parent=${window.location.hostname}`}
              height="100%"
              width="100%"
              allowFullScreen={true}
              className="absolute inset-0 w-full h-full"
            ></iframe>
          </div>

          {/* Chat (1 parte) */}
          <div className="hidden lg:block lg:col-span-1 border-l border-gray-800 bg-[#18181b]">
            <iframe
              src={`https://www.twitch.tv/embed/${channelName}/chat?parent=localhost&parent=${window.location.hostname}&darkpopout`}
              height="100%"
              width="100%"
              className="w-full h-full"
            ></iframe>
          </div>
        </div>

        {/* ATALHOS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-12">
          
          <Link to="/editor" className="p-6 bg-gray-900 border border-gray-800 rounded-2xl hover:border-blue-500 transition-all group text-center">
            <div className="w-14 h-14 mx-auto bg-blue-900/20 text-blue-500 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <FaTools size={24} />
            </div>
            <h3 className="text-lg font-bold mb-1">Editor de Layouts</h3>
            <p className="text-xs text-gray-500">Overlays para OBS.</p>
          </Link>

          <Link to="/generator" className="p-6 bg-gray-900 border border-gray-800 rounded-2xl hover:border-purple-500 transition-all group text-center">
            <div className="w-14 h-14 mx-auto bg-purple-900/20 text-purple-500 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <FaMagic size={24} />
            </div>
            <h3 className="text-lg font-bold mb-1">Gerador de Bio</h3>
            <p className="text-xs text-gray-500">Markdown e textos.</p>
          </Link>

          <Link to="/emotes" className="p-6 bg-gray-900 border border-gray-800 rounded-2xl hover:border-green-500 transition-all group text-center">
            <div className="w-14 h-14 mx-auto bg-green-900/20 text-green-500 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <FaRobot size={24} />
            </div>
            <h3 className="text-lg font-bold mb-1">Dimensionador</h3>
            <p className="text-xs text-gray-500">Ajuste seus emotes.</p>
          </Link>
        </div>

      </main>

      <Footer />
    </div>
  );
}