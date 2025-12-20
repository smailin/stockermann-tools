import React from 'react';
import { FaTrash, FaArrowUp, FaArrowDown, FaLayerGroup, FaPalette, FaFont, FaDesktop, FaImage, FaCloudUploadAlt, FaCloudDownloadAlt, FaExclamationCircle } from 'react-icons/fa';

export default function PropertiesPanel({ 
  selectedElement, updateProperty, deleteElement, moveLayer, 
  canvasSize, setCanvasSize,
  onSaveCloud, onLoadCloud, isSaving, user
}) {
  
  // Classe CSS para padronizar os inputs e garantir que os números apareçam
  const inputClass = "w-full bg-[#18181b] border border-gray-700 rounded px-2 py-1.5 text-xs text-white focus:border-blue-500 outline-none font-mono";

  return (
    <aside className="w-72 bg-[#0e0e10] border-l border-gray-800 flex flex-col z-20 shrink-0 h-full">
      
      {/* 1. ÁREA DE SALVAMENTO (TOPO - Solução do problema de botões) */}
      <div className="p-4 border-b border-gray-800 bg-gray-900/50">
        <h3 className="text-[10px] font-bold text-gray-500 uppercase mb-2">Salvar na Nuvem</h3>
        {user ? (
          <div className="grid grid-cols-2 gap-2">
            <button 
              onClick={onLoadCloud}
              className="flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 text-white py-1.5 rounded text-xs font-bold transition-colors"
            >
              <FaCloudDownloadAlt /> Carregar
            </button>
            <button 
              onClick={onSaveCloud}
              disabled={isSaving}
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white py-1.5 rounded text-xs font-bold transition-colors disabled:opacity-50"
            >
              <FaCloudUploadAlt /> {isSaving ? '...' : 'Salvar'}
            </button>
          </div>
        ) : (
          <div className="text-xs text-yellow-500 flex items-center gap-1 bg-yellow-900/20 p-2 rounded">
            <FaExclamationCircle /> Faça login para salvar
          </div>
        )}
      </div>

      {/* 2. CONTEÚDO SCROLLÁVEL */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
        
        {/* Se nada selecionado, mostra config do Canvas */}
        {!selectedElement ? (
          <div>
            <h3 className="text-gray-400 font-bold text-xs uppercase tracking-wider mb-2">Tamanho do Palco</h3>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-gray-500 mb-1 block">Largura</label>
                <input type="number" value={canvasSize.width} onChange={(e) => setCanvasSize({...canvasSize, width: Number(e.target.value)})} className={inputClass} />
              </div>
              <div>
                <label className="text-[10px] text-gray-500 mb-1 block">Altura</label>
                <input type="number" value={canvasSize.height} onChange={(e) => setCanvasSize({...canvasSize, height: Number(e.target.value)})} className={inputClass} />
              </div>
            </div>
            <div className="mt-6 p-4 border border-dashed border-gray-800 rounded text-center text-xs text-gray-600">
              Clique em um elemento no palco para editar suas propriedades.
            </div>
          </div>
        ) : (
          <>
            {/* CABEÇALHO DO ELEMENTO */}
            <div className="flex items-center justify-between pb-2 border-b border-gray-800">
              <div className="flex items-center gap-2 text-blue-400 font-bold uppercase text-xs">
                {selectedElement.type === 'text' && <><FaFont /> Texto</>}
                {selectedElement.type === 'webcam' && <><FaDesktop /> Webcam</>}
                {selectedElement.type === 'box' && <><FaLayerGroup /> Forma</>}
                {selectedElement.type === 'image' && <><FaImage /> Imagem</>}
              </div>
              <button onClick={deleteElement} className="text-red-500 hover:bg-red-900/20 p-1.5 rounded transition-colors" title="Deletar">
                <FaTrash size={12} />
              </button>
            </div>

            {/* DIMENSÕES (Inputs corrigidos) */}
            <div className="space-y-2">
              <h4 className="text-gray-500 text-[10px] font-bold uppercase">Posição & Tamanho</h4>
              <div className="grid grid-cols-2 gap-2">
                <div><label className="text-[10px] text-gray-600">X</label><input type="number" value={Math.round(selectedElement.x)} onChange={(e) => updateProperty('x', Number(e.target.value))} className={inputClass} /></div>
                <div><label className="text-[10px] text-gray-600">Y</label><input type="number" value={Math.round(selectedElement.y)} onChange={(e) => updateProperty('y', Number(e.target.value))} className={inputClass} /></div>
                <div><label className="text-[10px] text-gray-600">Largura</label><input type="number" value={parseInt(selectedElement.width)} onChange={(e) => updateProperty('width', Number(e.target.value))} className={inputClass} /></div>
                <div><label className="text-[10px] text-gray-600">Altura</label><input type="number" value={parseInt(selectedElement.height)} onChange={(e) => updateProperty('height', Number(e.target.value))} className={inputClass} /></div>
              </div>
            </div>

            {/* EDITOR DE TEXTO */}
            {selectedElement.type === 'text' && (
              <div className="space-y-3 pt-2 border-t border-gray-800">
                <label className="text-[10px] text-gray-500 font-bold uppercase">Conteúdo</label>
                <textarea 
                  value={selectedElement.content} 
                  onChange={(e) => updateProperty('content', e.target.value)} 
                  className="w-full bg-[#18181b] border border-gray-700 rounded p-2 text-sm text-white resize-none h-20 focus:border-blue-500 outline-none"
                />

                <select 
                  value={selectedElement.fontFamily} 
                  onChange={(e) => updateProperty('fontFamily', e.target.value)}
                  className={inputClass}
                >
                  <option value="'Roboto', sans-serif">Roboto</option>
                  <option value="'Open Sans', sans-serif">Open Sans</option>
                  <option value="'Montserrat', sans-serif">Montserrat</option>
                  <option value="'Press Start 2P', cursive">Pixel Art</option>
                  <option value="'Bangers', cursive">Comics</option>
                  <option value="'Orbitron', sans-serif">Sci-Fi</option>
                </select>

                <div className="grid grid-cols-2 gap-2">
                  <div><label className="text-[10px] text-gray-600">Tamanho Fonte</label><input type="number" value={selectedElement.fontSize} onChange={(e) => updateProperty('fontSize', Number(e.target.value))} className={inputClass} /></div>
                  <div><label className="text-[10px] text-gray-600">Borda (Stroke)</label><input type="number" value={selectedElement.strokeWidth || 0} onChange={(e) => updateProperty('strokeWidth', Number(e.target.value))} className={inputClass} /></div>
                </div>

                {/* Efeitos de Texto */}
                <div className="bg-gray-800/20 p-2 rounded border border-gray-800 space-y-2">
                   <div className="flex items-center justify-between">
                      <label className="text-xs text-gray-400">Degradê</label>
                      <input type="checkbox" checked={selectedElement.textGradient || false} onChange={(e) => updateProperty('textGradient', e.target.checked)} />
                   </div>
                   {selectedElement.textGradient ? (
                     <div className="flex gap-1"><input type="color" value={selectedElement.colorStart||'#fff'} onChange={(e)=>updateProperty('colorStart', e.target.value)} className="w-full h-6 rounded cursor-pointer"/><input type="color" value={selectedElement.colorEnd||'#f00'} onChange={(e)=>updateProperty('colorEnd', e.target.value)} className="w-full h-6 rounded cursor-pointer"/></div>
                   ) : (
                     <div><label className="text-[10px] text-gray-600">Cor</label><input type="color" value={selectedElement.color||'#fff'} onChange={(e)=>updateProperty('color', e.target.value)} className="w-full h-8 rounded cursor-pointer bg-transparent"/></div>
                   )}
                   <div className="flex items-center justify-between pt-2 border-t border-gray-700/30">
                      <label className="text-xs text-blue-300 font-bold">⚡ Neon</label>
                      <input type="checkbox" checked={selectedElement.neon || false} onChange={(e) => updateProperty('neon', e.target.checked)} />
                   </div>
                   <div className="flex items-center justify-between">
                      <label className="text-xs text-gray-400">Sombra</label>
                      <input type="checkbox" checked={selectedElement.shadow || false} onChange={(e) => updateProperty('shadow', e.target.checked)} />
                   </div>
                </div>
              </div>
            )}

            {/* CONFIGS WEBCAM/BOX */}
            {(selectedElement.type === 'webcam' || selectedElement.type === 'box') && (
              <div className="space-y-3 pt-2 border-t border-gray-800">
                <h4 className="text-gray-500 text-[10px] font-bold uppercase">Estilo</h4>
                
                <div>
                  <label className="text-[10px] text-gray-600 mb-1 block">Cor Principal</label>
                  <div className="flex gap-2 items-center">
                    <input type="color" value={selectedElement.borderColor || selectedElement.bg || '#3b82f6'} onChange={(e) => updateProperty(selectedElement.type === 'box' ? 'bg' : 'borderColor', e.target.value)} className="w-8 h-8 rounded cursor-pointer p-0 border-0" />
                    <input type="text" readOnly value={selectedElement.borderColor || selectedElement.bg} className="flex-1 bg-transparent border-none text-xs text-gray-500" />
                  </div>
                </div>

                {selectedElement.type === 'webcam' && (
                  <div><label className="text-[10px] text-gray-600">Espessura Borda</label><input type="range" min="0" max="20" value={selectedElement.borderWidth || 0} onChange={(e) => updateProperty('borderWidth', Number(e.target.value))} className="w-full accent-blue-600" /></div>
                )}

                <div><label className="text-[10px] text-gray-600">Arredondamento</label><input type="range" min="0" max="100" value={selectedElement.borderRadius || 0} onChange={(e) => updateProperty('borderRadius', Number(e.target.value))} className="w-full accent-blue-600" /></div>
                <div><label className="text-[10px] text-gray-600">Opacidade</label><input type="range" min="0" max="1" step="0.1" value={selectedElement.opacity ?? 1} onChange={(e) => updateProperty('opacity', Number(e.target.value))} className="w-full accent-blue-600" /></div>
              </div>
            )}

            {/* CAMADAS */}
            <div className="mt-auto pt-4 border-t border-gray-800">
               <h4 className="text-gray-500 text-[10px] font-bold uppercase mb-2">Ordem</h4>
               <div className="grid grid-cols-2 gap-2">
                 <button onClick={() => moveLayer('up')} className="bg-gray-800 hover:bg-gray-700 text-gray-300 py-1.5 rounded text-xs flex items-center justify-center gap-1"><FaArrowUp size={10} /> Frente</button>
                 <button onClick={() => moveLayer('down')} className="bg-gray-800 hover:bg-gray-700 text-gray-300 py-1.5 rounded text-xs flex items-center justify-center gap-1"><FaArrowDown size={10} /> Trás</button>
               </div>
            </div>
          </>
        )}
      </div>
    </aside>
  );
}