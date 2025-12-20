import React, { useState, useRef, useEffect, useCallback } from 'react';
import { toPng } from 'html-to-image';
import { saveAs } from 'file-saver';
import toast from 'react-hot-toast';
import { Helmet } from 'react-helmet-async';

// Imports
import { supabase } from '../services/supabase';     
import { useAuth } from '../context/AuthContext';    
import Header from '../components/Layout/Header';  
import Toolbar from '../components/EditorParts/Toolbar';     
import Canvas from '../components/EditorParts/Canvas';       
import PropertiesPanel from '../components/EditorParts/PropertiesPanel'; 

export default function Editor() {
  const { user } = useAuth();
  <Helmet>
  <title>Editor de Layouts OBS Online Grátis - Stockermann Tools</title>
  <meta name="description" content="Crie overlays, cenas e layouts para sua live no OBS Studio direto no navegador. Sem instalar nada. Exporte em PNG ou HTML." />
  <meta name="keywords" content="criar overlay twitch, editor overlay obs, layout stream grátis, maker overlay" />
</Helmet>
  // Estados
  const [canvasSize, setCanvasSize] = useState({ width: 1920, height: 1080 });
  const [elements, setElements] = useState([]); 
  const [selectedId, setSelectedId] = useState(null);
  const [clipboard, setClipboard] = useState(null);
  const [zoom, setZoom] = useState(1.0);

  // Histórico e Save
  const [history, setHistory] = useState([[]]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const canvasRef = useRef(null);

  // --- UNDO/REDO ---
  const setElementsWithHistory = (newElements) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newElements);
    if (newHistory.length > 20) newHistory.shift();
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    setElements(newElements);
  };

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setElements(history[newIndex]);
    }
  }, [historyIndex, history]);

  // --- ATALHOS ---
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedId) {
          const newEls = elements.filter(el => el.id !== selectedId);
          setElementsWithHistory(newEls);
          setSelectedId(null);
        }
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') { e.preventDefault(); undo(); }
      if ((e.ctrlKey || e.metaKey) && e.key === 'c' && selectedId) setClipboard(elements.find(el => el.id === selectedId));
      if ((e.ctrlKey || e.metaKey) && e.key === 'v' && clipboard) {
        const newEl = { ...clipboard, id: Date.now(), x: clipboard.x + 20, y: clipboard.y + 20 };
        setElementsWithHistory([...elements, newEl]);
        setSelectedId(newEl.id);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [elements, selectedId, clipboard, historyIndex, undo]);

  // --- CRUD ---
  const addElement = (el) => { setElementsWithHistory([...elements, el]); setSelectedId(el.id); };
  
  const addWebcam = () => addElement({ id: Date.now(), type: 'webcam', subtype: 'simple', x: 50, y: 50, width: 480, height: 270, borderColor: '#00FF00', borderWidth: 5, aspectRatio: true, windowTitle: 'Webcam', borderRadius: 0 });
  const addText = () => addElement({ id: Date.now(), type: 'text', content: 'TEXTO', x: 100, y: 100, fontSize: 80, width: 300, height: 120, fontFamily: "'Roboto', sans-serif", color: '#ffffff', shadow: true });
  const addShape = (subtype = 'rectangle') => { addElement({ id: Date.now(), type: 'box', subtype: subtype, x: 150, y: 150, width: 150, height: 150, bg: '#3b82f6', bgType: 'solid', borderRadius: 0, opacity: 1 }); };
  
  const handleImageUpload = (e) => { 
    const file = e.target.files[0]; 
    if(!file) return;
    const reader = new FileReader();
    reader.onload = (event) => addElement({ id: Date.now(), type: 'image', src: event.target.result, x: 200, y: 200, width: 300, height: 'auto' });
    reader.readAsDataURL(file);
  };

  const updateElement = (id, data) => setElements(elements.map(el => el.id === id ? { ...el, ...data } : el));
  const updateProperty = (key, value) => { if(selectedId) { const newEls = elements.map(el => el.id === selectedId ? { ...el, [key]: value } : el); setElementsWithHistory(newEls); }};
  const handleDragStop = (id, d) => setElementsWithHistory(elements.map(el => el.id === id ? { ...el, x: d.x, y: d.y } : el));
  const handleResizeStop = (id, ref, pos) => {
    const el = elements.find(e => e.id === id); if (!el) return;
    const newWidth = parseInt(ref.style.width); const newHeight = parseInt(ref.style.height);
    let updates = { width: newWidth, height: newHeight, ...pos };
    if (el.type === 'text') {
      const oldHeight = el.height || 100; const scaleFactor = newHeight / oldHeight;
      updates.fontSize = Math.round(el.fontSize * scaleFactor);
    }
    setElementsWithHistory(elements.map(e => e.id === id ? { ...e, ...updates } : e));
  };

  const deleteElement = () => { setElementsWithHistory(elements.filter(el => el.id !== selectedId)); setSelectedId(null); };
  const moveLayer = (direction) => {
    if (!selectedId) return;
    const index = elements.findIndex(el => el.id === selectedId);
    const newElements = [...elements];
    if (direction === 'up' && index < elements.length - 1) [newElements[index], newElements[index + 1]] = [newElements[index + 1], newElements[index]];
    else if (direction === 'down' && index > 0) [newElements[index], newElements[index - 1]] = [newElements[index - 1], newElements[index]];
    else return;
    setElementsWithHistory(newElements);
  };

  // --- ACTIONS ---
  const handleNewLayout = () => {
    if (elements.length > 0 && !confirm("Apagar tudo e criar novo?")) return;
    setElements([]); setSelectedId(null); setHistory([[]]); setHistoryIndex(0);
    toast.success("Tela limpa!");
  };

  const handleLoadLayout = async () => {
    if(!user) return toast.error("Faça login.");
    const toastId = toast.loading("Carregando...");
    const { data, error } = await supabase.from('layouts').select('*').eq('user_id', user.id).single();
    if (data && !error) {
      setElements(data.elements || []); setCanvasSize(data.canvas_size || { width: 1920, height: 1080 });
      toast.success("Carregado!", { id: toastId });
    } else { toast.error("Nada salvo.", { id: toastId }); }
  };

  const saveToCloud = async () => {
    if (!user) return toast.error("Faça login.");
    setIsSaving(true); const toastId = toast.loading("Salvando...");
    try {
      const { error } = await supabase.from('layouts').upsert({ user_id: user.id, elements: elements, canvas_size: canvasSize, updated_at: new Date() });
      if (error) throw error;
      toast.success("Salvo!", { id: toastId });
    } catch (error) { toast.error("Erro ao salvar.", { id: toastId }); } 
    finally { setIsSaving(false); }
  };

  const handleSavePNG = async () => {
    if (!canvasRef.current) return toast.error("Canvas erro.");
    const prevSelection = selectedId; setSelectedId(null); const toastId = toast.loading("Gerando PNG...");
    try {
      await new Promise(r => setTimeout(r, 500));
      let fontCss = '';
      try {
        const links = document.querySelectorAll('link[href*="fonts.googleapis.com"]');
        for (const link of links) { fontCss += await (await fetch(link.href)).text() + '\n'; }
      } catch(e) {}
      
      const dataUrl = await toPng(canvasRef.current, { 
        width: canvasSize.width, height: canvasSize.height, pixelRatio: 1, skipAutoScale: true, cacheBust: true, fontEmbedCSS: fontCss,
        filter: (node) => !(node.tagName === 'LINK' || node.classList?.contains('export-hidden'))
      });
      saveAs(dataUrl, 'overlay.png'); toast.success("Baixando...", { id: toastId });
    } catch (err) { toast.error("Erro PNG.", { id: toastId }); } 
    finally { if(prevSelection) setSelectedId(prevSelection); }
  };

  const handleSaveHTML = () => {
    try {
      // (Código HTML mantido igual, resumido aqui)
      const htmlContent = `<!DOCTYPE html><html><body><div style="position:relative;width:${canvasSize.width}px;height:${canvasSize.height}px;">${elements.map(el => `<div style="position:absolute;left:${el.x}px;top:${el.y}px;width:${el.width}px;height:${el.height}px;border:${el.borderWidth}px solid ${el.borderColor};background:${el.bg};color:${el.color};font-size:${el.fontSize}px;">${el.content||''}</div>`).join('')}</div></body></html>`;
      const blob = new Blob([htmlContent], { type: "text/html" }); saveAs(blob, "overlay.html"); toast.success("HTML Gerado!");
    } catch (e) { toast.error("Erro HTML"); }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-950 text-white overflow-hidden">
      <Header />
      
      <div className="flex flex-1 overflow-hidden relative">
        <Toolbar 
          onAddWebcam={addWebcam} onAddText={addText} onAddShape={addShape} onUploadImage={handleImageUpload} 
          onUndo={undo} canUndo={historyIndex > 0} 
          onSavePNG={handleSavePNG} onSaveHTML={handleSaveHTML} 
          onNewLayout={handleNewLayout} 
        />

        <Canvas 
          elements={elements} canvasSize={canvasSize} selectedId={selectedId} setSelectedId={setSelectedId} 
          updateElement={updateElement} handleDragStop={handleDragStop} handleResizeStop={handleResizeStop} 
          canvasRef={canvasRef} zoom={zoom}
        />
        
        {/* Passamos as funções de salvar/carregar para o painel */}
        <PropertiesPanel 
          selectedElement={elements.find(el => el.id === selectedId)} 
          updateProperty={updateProperty} deleteElement={deleteElement} moveLayer={moveLayer} 
          canvasSize={canvasSize} setCanvasSize={setCanvasSize}
          onSaveCloud={saveToCloud} onLoadCloud={handleLoadLayout} isSaving={isSaving} user={user}
        />
      </div>
    </div>
  );
}