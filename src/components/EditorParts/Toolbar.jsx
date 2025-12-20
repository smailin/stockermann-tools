import React, { useState } from 'react';
import { 
  FaCamera, FaFont, FaShapes, FaImage, FaUndo, 
  FaFileImage, FaCode, FaFile, FaSquare, FaCircle, FaStar, FaHeart, FaPlay
} from 'react-icons/fa';

export default function Toolbar({ 
  onAddWebcam, onAddText, onAddShape, onUploadImage, 
  onUndo, canUndo, onSavePNG, onSaveHTML, onNewLayout 
}) {
  const [showShapes, setShowShapes] = useState(false);

  // Estilo base dos botões
  const btnClass = "w-14 h-14 flex flex-col items-center justify-center rounded-xl text-gray-500 hover:text-white hover:bg-gray-800 transition-all cursor-pointer group active:scale-95 outline-none focus:outline-none relative";
  const labelClass = "text-[10px] font-medium mt-1 group-hover:text-white transition-colors";

  return (
    // MUDANÇA 1: 'overflow-visible' permite o menu sair para fora. 
    // Removi 'overflow-y-auto' que cortava o menu.
    // Aumentei z-index para 40 para garantir que fique acima do canvas.
    <aside className="w-[80px] bg-[#09090b] border-r border-gray-800 flex flex-col items-center py-4 gap-2 z-40 shrink-0 h-full select-none overflow-visible">
      
      {/* BOTÃO NOVO */}
      <div className="mb-2">
         <button 
           onClick={onNewLayout} 
           className="w-14 h-14 flex flex-col items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 hover:bg-blue-600 hover:text-white transition-all active:scale-95 border border-blue-500/20 hover:border-transparent group outline-none focus:outline-none"
           title="Limpar Tela / Novo Projeto"
         >
            <FaFile size={18} className="mb-0.5" />
            <span className="text-[9px] font-bold uppercase tracking-wide group-hover:text-white">NOVO</span>
         </button>
      </div>
      
      <div className="w-8 h-[1px] bg-gray-800 rounded mb-2"></div>

      {/* FERRAMENTAS */}
      <div className="flex flex-col gap-1 w-full items-center">
        <button onClick={onAddWebcam} className={btnClass} title="Adicionar Webcam">
          <FaCamera size={22} />
          <span className={labelClass}>Webcam</span>
        </button>
        
        <button onClick={onAddText} className={btnClass} title="Adicionar Texto">
          <FaFont size={22} />
          <span className={labelClass}>Texto</span>
        </button>
        
        {/* MENU DE FORMAS */}
        <div 
          className="relative flex justify-center w-full"
          onMouseEnter={() => setShowShapes(true)}
          onMouseLeave={() => setShowShapes(false)}
        >
          <button className={`${btnClass} ${showShapes ? 'bg-gray-800 text-white' : ''}`}>
            <FaShapes size={22} />
            <span className={labelClass}>Formas</span>
          </button>
          
          {/* Submenu Flutuante (Agora visível) */}
          {showShapes && (
            <div className="absolute left-[90%] top-0 ml-2 bg-[#09090b] border border-gray-800 p-2 rounded-xl shadow-2xl grid grid-cols-1 gap-2 w-36 z-[100]">
              <div className="text-[9px] text-gray-500 font-bold uppercase px-2 mb-1 tracking-wider">Escolher Forma</div>
              
              <button onClick={() => { onAddShape('rectangle'); setShowShapes(false); }} className="flex items-center gap-3 p-2 hover:bg-gray-800 rounded text-gray-400 hover:text-white transition-colors text-left group">
                <FaSquare className="group-hover:text-blue-400" /> <span className="text-xs font-medium">Quadrado</span>
              </button>
              
              <button onClick={() => { onAddShape('circle'); setShowShapes(false); }} className="flex items-center gap-3 p-2 hover:bg-gray-800 rounded text-gray-400 hover:text-white transition-colors text-left group">
                <FaCircle className="group-hover:text-blue-400" /> <span className="text-xs font-medium">Círculo</span>
              </button>
              
              <button onClick={() => { onAddShape('triangle'); setShowShapes(false); }} className="flex items-center gap-3 p-2 hover:bg-gray-800 rounded text-gray-400 hover:text-white transition-colors text-left group">
                <FaPlay className="-rotate-90 group-hover:text-blue-400" size={12} /> <span className="text-xs font-medium">Triângulo</span>
              </button>
              
              <button onClick={() => { onAddShape('star'); setShowShapes(false); }} className="flex items-center gap-3 p-2 hover:bg-gray-800 rounded text-gray-400 hover:text-white transition-colors text-left group">
                <FaStar className="group-hover:text-blue-400" /> <span className="text-xs font-medium">Estrela</span>
              </button>
              
              <button onClick={() => { onAddShape('heart'); setShowShapes(false); }} className="flex items-center gap-3 p-2 hover:bg-gray-800 rounded text-gray-400 hover:text-white transition-colors text-left group">
                <FaHeart className="group-hover:text-blue-400" /> <span className="text-xs font-medium">Coração</span>
              </button>
            </div>
          )}
        </div>
        
        <label className={btnClass} title="Upload de Imagem">
          <input type="file" className="hidden" accept="image/*" onChange={onUploadImage} />
          <FaImage size={22} />
          <span className={labelClass}>Imagem</span>
        </label>
      </div>

      {/* RODAPÉ */}
      <div className="mt-auto flex flex-col items-center gap-2 w-full pb-4">
        <div className="w-8 h-[1px] bg-gray-800 rounded my-1"></div>
        
        {/* MUDANÇA 3: Texto "AÇÕES" acima do Desfazer */}
        <span className="text-[8px] text-gray-600 font-bold uppercase tracking-wider mb-[-4px]">Ações</span>
        
        {/* MUDANÇA 2: Texto corrigido para "Desfazer" */}
        <button 
          onClick={onUndo} 
          disabled={!canUndo} 
          className={`${btnClass} ${!canUndo ? 'opacity-30 cursor-not-allowed hover:bg-transparent hover:text-gray-500' : ''}`}
          title="Desfazer última ação"
        >
          <FaUndo size={16} />
          <span className={labelClass}>Desfazer</span>
        </button>

        {/* Texto "SALVAR" separando os grupos */}
        <span className="text-[8px] text-gray-600 font-bold uppercase tracking-wider mt-1 mb-[-4px]">Salvar</span>

        <button onClick={onSavePNG} className="w-14 h-14 flex flex-col items-center justify-center rounded-xl text-green-600 hover:text-white hover:bg-green-600 transition-all cursor-pointer active:scale-95 bg-green-900/10 border border-green-900/20 hover:border-transparent outline-none focus:outline-none">
          <FaFileImage size={18} className="mb-0.5" />
          <span className="text-[9px] font-bold uppercase">PNG</span>
        </button>
        
        <button onClick={onSaveHTML} className="w-14 h-14 flex flex-col items-center justify-center rounded-xl text-purple-500 hover:text-white hover:bg-purple-600 transition-all cursor-pointer active:scale-95 bg-purple-900/10 border border-purple-900/20 hover:border-transparent outline-none focus:outline-none">
          <FaCode size={18} className="mb-0.5" />
          <span className="text-[9px] font-bold uppercase">HTML</span>
        </button>
      </div>
    </aside>
  );
}