import React from 'react';
import { Rnd } from 'react-rnd';
import { FaCamera, FaWindowMaximize, FaTimes } from 'react-icons/fa';

const globalStyles = `
  @keyframes neonPulse {
    0% { box-shadow: 0 0 5px var(--neon-color), 0 0 10px var(--neon-color); }
    50% { box-shadow: 0 0 20px var(--neon-color), 0 0 30px var(--neon-color); }
    100% { box-shadow: 0 0 5px var(--neon-color), 0 0 10px var(--neon-color); }
  }
`;

export default function Canvas({ 
  elements, canvasSize, selectedId, setSelectedId, 
  handleDragStop, handleResizeStop, canvasRef 
}) {

  const renderElementContent = (el) => {
    const globalStyle = { opacity: el.opacity !== undefined ? el.opacity : 1 };

    switch (el.type) {
      case 'webcam':
        const webcamBase = { width: '100%', height: '100%', position: 'relative', boxSizing: 'border-box', opacity: el.opacity ?? 1, borderRadius: `${el.borderRadius || 0}px` };
        const commonWebcam = <div className="export-hidden absolute inset-0 flex items-center justify-center bg-gray-900/20 text-white/50 z-0"><FaCamera size={32} /></div>;
        
        if (el.subtype === 'neon') return <div style={{ ...webcamBase, border: `${el.borderWidth}px solid ${el.borderColor}`, boxShadow: `0 0 10px ${el.borderColor}, 0 0 20px ${el.borderColor}`, animation: 'neonPulse 2s infinite alternate', '--neon-color': el.borderColor }}>{commonWebcam}</div>;
        if (el.subtype === 'windows') return <div style={{ ...webcamBase, border: `${Math.max(2, el.borderWidth)}px solid ${el.borderColor}`, display: 'flex', flexDirection: 'column' }}><div style={{ height: '32px', backgroundColor: el.borderColor, color: '#fff', display: 'flex', alignItems: 'center', padding: '0 8px', justifyContent: 'space-between' }}><span className="text-xs font-bold truncate">{el.windowTitle}</span><div className="flex gap-1"><FaWindowMaximize size={10} /><FaTimes size={10} /></div></div><div className="flex-1 relative bg-transparent">{commonWebcam}</div></div>;
        if (el.subtype === 'pastel') return <div style={{ ...webcamBase, border: `${el.borderWidth}px dashed ${el.borderColor}`, backgroundColor: 'rgba(255,255,255,0.1)' }}>{commonWebcam}</div>;
        return <div style={{ ...webcamBase, border: `${el.borderWidth}px solid ${el.borderColor}` }}>{commonWebcam}</div>;

      case 'box':
        // LÓGICA DE ESTILO DA FORMA
        const shapeStyle = { 
          width: '100%', height: '100%', 
          opacity: el.opacity !== undefined ? el.opacity : 1,
          boxSizing: 'border-box' // Importante para a borda não estourar o tamanho
        };

        // 1. FUNDO
        if (el.bgType === 'transparent') {
           shapeStyle.background = 'transparent';
        } else if (el.bgType === 'gradient') {
           shapeStyle.background = `linear-gradient(${el.gradientDir || '90deg'}, ${el.bgStart || '#3b82f6'}, ${el.bgEnd || '#9333ea'})`;
        } else {
           shapeStyle.background = el.bg || '#3b82f6';
        }

        // 2. BORDA (Funciona perfeitamente em Quadrado e Círculo. Em outros é limitado pelo CSS Clip-path)
        if (el.borderWidth > 0) {
           shapeStyle.border = `${el.borderWidth}px solid ${el.borderColor || '#fff'}`;
        }

        // 3. RECORTES (SUBTIPOS)
        if(el.subtype === 'circle') {
           shapeStyle.borderRadius = '50%';
        } 
        else if(el.subtype === 'triangle') {
           // Clip-path remove a borda CSS padrão. Para triângulos com borda, seria necessário SVG.
           // Mantemos o recorte, mas a borda ficará quadrada se aplicada.
           // Solução paliativa: Se tiver clip-path, removemos a borda CSS para não ficar feio
           // OU deixamos o usuário decidir. Por padrão, clip-path mata a borda visualmente.
           shapeStyle.clipPath = 'polygon(50% 0%, 0% 100%, 100% 100%)';
           shapeStyle.border = 'none'; // Remove borda pois clip-path corta
        }
        else if(el.subtype === 'star') {
           shapeStyle.clipPath = 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)';
           shapeStyle.border = 'none';
        }
        else if(el.subtype === 'heart') {
           shapeStyle.clipPath = 'path("M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z")';
           // Adaptação do path para viewBox 0 0 24 24 esticado... Clip-path complexo.
           // Vamos usar um polygon de coração simplificado para funcionar responsivo
           shapeStyle.clipPath = 'polygon(50% 0%, 100% 38%, 82% 100%, 50% 80%, 18% 100%, 0% 38%)'; // Diamante "coração"
           // Para um coração real precisaríamos de SVG inline, não div.
           // Vamos usar o SVG inline abaixo no return se for coração
        }
        else {
           // Retângulo padrão
           shapeStyle.borderRadius = `${el.borderRadius || 0}px`;
        }
        
        // Renderização Especial para formas complexas (SVG) se necessário, ou DIV padrão
        if (el.subtype === 'heart') {
           // Renderiza um SVG de coração para ficar bonito e aceitar cor (mas sem borda CSS fácil)
           return (
             <div style={{...shapeStyle, clipPath: 'none', background: 'transparent', border: 'none'}}>
                <svg viewBox="0 0 24 24" style={{width:'100%', height:'100%', fill: shapeStyle.background, dropShadow: '0 0 5px rgba(0,0,0,0.5)'}}>
                   <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
             </div>
           );
        }

        return <div style={shapeStyle} />;

      case 'text':
        const textStyle = {
          ...globalStyle,
          width: '100%', height: '100%', 
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: `${el.fontSize}px`, 
          fontFamily: el.fontFamily, 
          lineHeight: 1.2, fontWeight: 'bold', whiteSpace: 'nowrap',
          WebkitTextStroke: el.strokeWidth ? `${el.strokeWidth}px ${el.strokeColor || '#000'}` : '0px',
        };
        if (el.textGradient) {
          textStyle.background = `linear-gradient(${el.gradientDir || '90deg'}, ${el.colorStart || '#ffffff'}, ${el.colorEnd || '#ff0000'})`;
          textStyle.WebkitBackgroundClip = 'text'; textStyle.WebkitTextFillColor = 'transparent';
        } else { textStyle.color = el.color; }
        if (el.neon) {
          const color = el.color || '#fff';
          textStyle.textShadow = `0 0 10px ${color}, 0 0 20px ${color}, 0 0 30px ${color}, 0 0 40px ${color}`;
        } else if (el.shadow) { textStyle.textShadow = '3px 3px 0px #000000'; }
        return <div style={textStyle}>{el.content}</div>;

      case 'image':
        return <img src={el.src} alt="" className="w-full h-full object-contain pointer-events-none" style={{ ...globalStyle, borderRadius: `${el.borderRadius || 0}px` }} />;

      default: return null;
    }
  };

  return (
    <main 
      className="flex-1 bg-gray-900 overflow-auto flex relative p-8 custom-scrollbar justify-center items-center" 
      onClick={(e) => { if(e.target === e.currentTarget) setSelectedId(null); }}
    >
      <style>{globalStyles}</style>

      <div 
        ref={canvasRef}
        style={{ width: canvasSize.width, height: canvasSize.height }}
        className="relative bg-gray-950 shadow-2xl border border-gray-700 shrink-0"
      >
        <div className="absolute inset-0 z-0 pointer-events-none" style={{
          backgroundImage: 'linear-gradient(45deg, #1f2937 25%, transparent 25%), linear-gradient(-45deg, #1f2937 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #1f2937 75%), linear-gradient(-45deg, transparent 75%, #1f2937 75%)',
          backgroundSize: '20px 20px', backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px', opacity: 0.3
        }} />

        {elements.map((el, index) => (
          <Rnd
            key={el.id}
            size={{ width: el.width, height: el.height }}
            position={{ x: el.x, y: el.y }}
            enableResizing={true}
            lockAspectRatio={(el.type === 'webcam' && el.aspectRatio) || el.subtype === 'circle' || el.subtype === 'star' || el.type === 'text' || el.subtype === 'heart'}
            onDragStop={(e, d) => handleDragStop(el.id, d)}
            onResizeStop={(e, dir, ref, d, pos) => handleResizeStop(el.id, ref, pos)}
            onClick={() => setSelectedId(el.id)}
            style={{ zIndex: index }}
            bounds="parent" 
            className={`border-2 ${selectedId === el.id ? 'border-blue-500' : 'border-transparent'} hover:border-blue-300 transition-colors group`}
          >
            {renderElementContent(el)}
          </Rnd>
        ))}
      </div>
    </main>
  );
}