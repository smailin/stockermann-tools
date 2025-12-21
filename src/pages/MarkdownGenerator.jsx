import React, { useState, useRef, useEffect } from 'react';
import Header from '../components/Layout/Header';
import ReactMarkdown from 'react-markdown';
import { supabase } from '../services/supabase';
import { useAuth } from '../context/AuthContext';
import { 
  FaBold, FaItalic, FaHeading, FaLink, FaListUl, FaQuoteRight, 
  FaCode, FaCopy, FaTrash, FaGamepad, FaDesktop, FaExclamationTriangle,
  FaSave, FaFolderOpen, FaSmile, FaMoneyBillWave, FaTerminal, FaUser
} from 'react-icons/fa';
import Footer from '../components/Layout/Footer'; 
import toast from 'react-hot-toast'; 
import { Helmet } from 'react-helmet-async';
import AdUnit from '../components/AdUnit';

const QUICK_EMOJIS = [
  "🎮", "🔴", "📹", "🎙️", "🎧", "👾", "🕹️", "🎲", 
  "⚠️", "🚫", "✅", "❌", "🔥", "💯", "🚀", "💎",
  "💰", "💳", "💲", "⏰", "📅", "📢", "💬", "❤️",
  "💜", "💙", "💚", "💛", "🧡", "🖤", "🤍", "⭐"
];

export default function MarkdownGenerator() {
  const { user } = useAuth();
  const [markdown, setMarkdown] = useState("# Sobre Mim\nOlá! Sou o Stockermann.\n\n### 🎮 O que eu jogo?\n* RPGs\n* FPS\n* Estratégia");
  const [title, setTitle] = useState(""); 
  const [savedBios, setSavedBios] = useState([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const textAreaRef = useRef(null);

  useEffect(() => {
    if (user) fetchSavedBios();
  }, [user]);

  const fetchSavedBios = async () => {
    const { data } = await supabase.from('twitch_bios').select('*').order('updated_at', { ascending: false });
    if (data) setSavedBios(data);
  };

  const insertText = (before, after = "") => {
    const textarea = textAreaRef.current;
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const previousText = textarea.value;
    const selectedText = previousText.substring(start, end);
    const newText = previousText.substring(0, start) + before + selectedText + after + previousText.substring(end);
    
    setMarkdown(newText);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, end + before.length);
    }, 10);
    setShowEmojiPicker(false); 
  };

  const loadTemplate = (type) => {
    let tpl = "";
    switch(type) {
      case 'pc': tpl = "### 🖥️ MEU SETUP\n\n* **Processador:** Intel Core i9\n* **GPU:** RTX 4090\n* **RAM:** 32GB\n* **Mouse:** Logitech G Pro"; break;
      case 'social': tpl = "### 📱 REDES SOCIAIS\n\nMe siga para novidades:\n\n* [Instagram](https://instagram.com)\n* [Twitter](https://twitter.com)\n* [Discord](https://discord.gg)"; break;
      case 'rules': tpl = "### ⚠️ REGRAS DO CHAT\n\n1. **Sem Spam** ou Flood.\n2. **Respeito** é essencial.\n3. Sem links suspeitos.\n4. Divirta-se!"; break;
      case 'donate': tpl = "### 💰 APOIE A LIVE\n\nDoações ajudam a melhorar a stream!\n\n* **PIX:** chave@email.com\n* **PicPay:** @usuario\n\n> *Mensagens de voz ativas acima de R$ 5,00*"; break;
      case 'commands': tpl = "### 🤖 COMANDOS DO CHAT\n\n* **!loja** - Veja itens da loja\n* **!uptime** - Tempo de live\n* **!pc** - Configuração\n* **!discord** - Link do server"; break;
      case 'about': tpl = "### 👤 QUEM SOU EU?\n\nMe chamo **[Nome]**, tenho **[Idade]** anos.\nFaço lives de **RPG e Terror**.\n\n* **Moro em:** São Paulo\n* **Hobbie:** Programação e Gatos\n* **Sonho:** Viver de live!"; break;
      default: break;
    }
    if(confirm("Isso vai substituir o texto atual. Continuar?")) setMarkdown(tpl);
  };

  const handleSave = async () => {
    if (!user) return toast.error("Faça login para salvar!");
    if (!title.trim()) return toast.error("Dê um nome para sua criação antes de salvar (campo acima do editor).");
    
    if (savedBios.length >= 5) {
      const isUpdate = savedBios.some(b => b.title.toLowerCase() === title.toLowerCase());
      if (!isUpdate) return toast.error("Limite de 5 criações atingido! Delete uma antiga para salvar uma nova.");
    }

    setIsLoading(true);
    try {
      const existing = savedBios.find(b => b.title.toLowerCase() === title.toLowerCase());
      
      const payload = {
        user_id: user.id,
        title: title,
        content: markdown,
        updated_at: new Date()
      };

      if (existing) payload.id = existing.id; 

      const { error } = await supabase.from('twitch_bios').upsert(payload);
      if (error) throw error;

      toast.success("Salvo com sucesso!");
      fetchSavedBios();
    } catch (error) {
      console.error(error);
      toast.error("Erro ao salvar.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if(!confirm("Tem certeza que quer deletar?")) return;
    await supabase.from('twitch_bios').delete().eq('id', id);
    fetchSavedBios();
  };

  const loadBio = (bio) => {
    if(confirm(`Carregar "${bio.title}"? O texto atual será perdido.`)) {
      setMarkdown(bio.content);
      setTitle(bio.title);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(markdown);
    toast.success("Copiado! Cole na Twitch.");
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">

      <Helmet>
  <title>Gerador de Bio e Descrição para Twitch (Markdown) - Stockermann Tools</title>
  <meta name="description" content="Gere descrições organizadas, com ícones e formatação para o painel 'Sobre Mim' do seu canal da Twitch. Copie e cole fácil." />
      </Helmet>
      
      <Header />

      <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* COLUNA ESQUERDA: EDITOR */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          
          {user && (
            <div className="flex gap-2 bg-gray-900 p-2 rounded-lg border border-gray-800 items-center">
              <input 
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Nome da criação (Ex: Regras RPG)..."
                className="flex-1 bg-transparent border-none outline-none text-sm px-2 text-white placeholder-gray-500"
              />
              <span className="text-xs text-gray-500 font-mono">{savedBios.length}/5 Slots</span>
              <button 
                onClick={handleSave} 
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-1.5 rounded text-xs font-bold flex items-center gap-2"
              >
                <FaSave /> {isLoading ? '...' : 'SALVAR'}
              </button>
            </div>
          )}

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 shadow-xl flex-1 flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold flex items-center gap-2 text-blue-500"><FaCode /> Editor</h2>
              <button onClick={() => setMarkdown('')} className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1"><FaTrash /> Limpar</button>
            </div>

            <div className="flex flex-wrap gap-2 mb-4 p-2 bg-gray-800 rounded-lg relative">
              <button onClick={() => insertText('**', '**')} title="Negrito" className="btn-tool"><FaBold /></button>
              <button onClick={() => insertText('*', '*')} title="Itálico" className="btn-tool"><FaItalic /></button>
              <button onClick={() => insertText('### ')} title="Título" className="btn-tool"><FaHeading /></button>
              <button onClick={() => insertText('[Link](url)')} title="Link" className="btn-tool"><FaLink /></button>
              <button onClick={() => insertText('* ')} title="Lista" className="btn-tool"><FaListUl /></button>
              <button onClick={() => insertText('> ')} title="Citação" className="btn-tool"><FaQuoteRight /></button>
              
              <div className="w-px h-6 bg-gray-600 mx-1 self-center"></div>
              
              <div className="relative">
                <button onClick={() => setShowEmojiPicker(!showEmojiPicker)} className={`btn-tool ${showEmojiPicker ? 'bg-yellow-600 text-white' : 'text-yellow-400'}`} title="Inserir Emoji"><FaSmile /></button>
                {showEmojiPicker && (
                  <div className="absolute top-10 left-0 bg-gray-800 border border-gray-600 p-2 rounded shadow-2xl w-64 grid grid-cols-8 gap-1 z-50">
                    {QUICK_EMOJIS.map(e => (
                      <button key={e} onClick={() => insertText(e)} className="hover:bg-gray-700 rounded p-1 text-lg">{e}</button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="mb-4 flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
              <TemplateBtn icon={<FaUser />} label="Quem sou eu" color="green" onClick={() => loadTemplate('about')} />
              <TemplateBtn icon={<FaDesktop />} label="Meu PC" color="purple" onClick={() => loadTemplate('pc')} />
              <TemplateBtn icon={<FaMoneyBillWave />} label="Doação" color="pink" onClick={() => loadTemplate('donate')} />
              <TemplateBtn icon={<FaTerminal />} label="Comandos" color="orange" onClick={() => loadTemplate('commands')} />
              <TemplateBtn icon={<FaGamepad />} label="Redes" color="blue" onClick={() => loadTemplate('social')} />
              <TemplateBtn icon={<FaExclamationTriangle />} label="Regras" color="yellow" onClick={() => loadTemplate('rules')} />
            </div>

            <textarea
              ref={textAreaRef}
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              className="flex-1 w-full bg-gray-950 border border-gray-700 rounded-lg p-4 font-mono text-sm focus:border-blue-500 outline-none resize-none custom-scrollbar leading-relaxed min-h-[400px]"
              placeholder="Escreva aqui..."
            ></textarea>
          </div>
        </div>

        {/* COLUNA DIREITA: PREVIEW + SAVES */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          <div className="bg-[#18181b] border border-gray-800 rounded-xl p-6 shadow-xl relative min-h-[300px]">
            <div className="flex justify-between items-center mb-6 border-b border-gray-700 pb-4">
              <h2 className="text-xl font-bold text-[#bf94ff]">Preview</h2>
              <button onClick={copyToClipboard} className="bg-[#9146ff] hover:bg-[#772ce8] text-white px-3 py-1.5 rounded font-bold text-xs flex items-center gap-2 shadow-lg transition-all">
                <FaCopy /> COPIAR
              </button>
            </div>
            <div className="prose prose-invert max-w-none prose-headings:text-white prose-a:text-[#bf94ff] prose-a:no-underline hover:prose-a:underline prose-strong:text-white prose-ul:text-gray-300 text-gray-300 font-sans text-sm">
              <ReactMarkdown>{markdown}</ReactMarkdown>
            </div>
          </div>

          {user && (
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <h3 className="text-sm font-bold text-gray-400 uppercase mb-3 flex items-center gap-2"><FaFolderOpen /> Minhas Criações</h3>
              {savedBios.length === 0 ? (
                <p className="text-xs text-gray-600 text-center py-4">Nenhum texto salvo ainda.</p>
              ) : (
                <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar pr-2">
                  {savedBios.map(bio => (
                    <div key={bio.id} className="flex items-center justify-between bg-gray-800 p-3 rounded hover:bg-gray-700 transition-colors group">
                      <div className="flex flex-col overflow-hidden" onClick={() => loadBio(bio)} role="button">
                        <span className="text-sm font-bold text-white truncate w-full cursor-pointer hover:text-blue-400">{bio.title}</span>
                        <span className="text-[10px] text-gray-500">Editado em: {new Date(bio.updated_at).toLocaleDateString()}</span>
                      </div>
                      <button onClick={() => handleDelete(bio.id)} className="text-gray-600 hover:text-red-500 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <FaTrash size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="w-full h-64 bg-gray-900 border border-gray-800 border-dashed rounded-xl flex items-center justify-center text-gray-600 font-bold text-xs">
            <AdUnit slotId="1883173635" />
          </div>
        </div>

      </main>
      <Footer />
    </div>
  );
}

function TemplateBtn({ icon, label, color, onClick }) {
  const colors = {
    purple: 'bg-purple-900/40 border-purple-500/30 hover:bg-purple-900 text-purple-200',
    blue: 'bg-blue-900/40 border-blue-500/30 hover:bg-blue-900 text-blue-200',
    yellow: 'bg-yellow-900/40 border-yellow-500/30 hover:bg-yellow-900 text-yellow-200',
    green: 'bg-green-900/40 border-green-500/30 hover:bg-green-900 text-green-200',
    pink: 'bg-pink-900/40 border-pink-500/30 hover:bg-pink-900 text-pink-200',
    orange: 'bg-orange-900/40 border-orange-500/30 hover:bg-orange-900 text-orange-200',
  };
  
  return (
    <button onClick={onClick} className={`text-xs px-3 py-1.5 rounded border flex items-center gap-1.5 whitespace-nowrap transition-colors ${colors[color] || colors.blue}`}>
      {icon} {label}
    </button>
  );
}