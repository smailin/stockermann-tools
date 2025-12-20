import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import toast from 'react-hot-toast';
import { FaCloudUploadAlt, FaDownload, FaFileArchive, FaTrash } from 'react-icons/fa';
import Header from '../components/Layout/Header';
import { Helmet } from 'react-helmet-async';

export default function EmoteFactory() {
  const [originalImage, setOriginalImage] = useState(null);
  const [resizedImages, setResizedImages] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);

  const sizes = [
    { size: 112, label: 'Twitch (112px)' },
    { size: 56, label: 'Twitch (56px)' },
    { size: 28, label: 'Twitch (28px)' },
    { size: 128, label: 'Discord (128px)' },
  ];

  const resizeImage = (file, targetSize) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = targetSize;
        canvas.height = targetSize;
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, targetSize, targetSize);
        resolve(canvas.toDataURL('image/png'));
      };
      img.src = URL.createObjectURL(file);
    });
  };

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setIsProcessing(true);
    setOriginalImage(URL.createObjectURL(file));
    setResizedImages({});

    const newImages = {};
    const toastId = toast.loading("Dimensionando...");

    try {
      await Promise.all(
        sizes.map(async ({ size }) => {
          const resizedDataUrl = await resizeImage(file, size);
          newImages[size] = resizedDataUrl;
        })
      );
      setResizedImages(newImages);
      toast.success("Pronto!", { id: toastId });
    } catch (error) {
      console.error(error);
      toast.error("Erro ao processar.", { id: toastId });
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/png': ['.png'], 'image/jpeg': ['.jpg', '.jpeg'] },
    maxFiles: 1,
    multiple: false
  });

  const handleDownloadZip = async () => {
    const zip = new JSZip();
    const folder = zip.folder("emotes_pack");
    sizes.forEach(({ size }) => {
      if (resizedImages[size]) {
        const imgData = resizedImages[size].split(',')[1];
        folder.file(`emote_${size}px.png`, imgData, { base64: true });
      }
    });
    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, "emotes.zip");
    toast.success("ZIP baixado!");
  };

  const reset = () => {
    setOriginalImage(null);
    setResizedImages({});
  };
<Helmet>
  <title>Redimensionar Emotes Twitch e Discord Online - Stockermann Tools</title>
  <meta name="description" content="Converta e redimensione imagens automaticamente para os tamanhos de emote da Twitch (112px, 56px, 28px) e Discord. Download grátis." />
  <meta name="keywords" content="redimensionar emotes, tamanho emote twitch, criar emotes discord, resizer emote" />
</Helmet>
  return (
    <div className="flex flex-col min-h-screen bg-gray-950 text-white">
      <Header />

      <main className="flex-1 container mx-auto p-8 flex flex-col items-center">
        {/* TÍTULO ATUALIZADO */}
        <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500 mb-2 uppercase tracking-wider text-center">
          Dimensionador de Emotes
        </h1>
        <p className="text-gray-400 mb-8 text-center max-w-md">
          Gere automaticamente tamanhos para Twitch e Discord.
        </p>

        {/* UPLOAD */}
        {!originalImage && (
          <div 
            {...getRootProps()} 
            className={`w-full max-w-xl p-12 border-2 border-dashed rounded-2xl text-center cursor-pointer transition-all group ${isDragActive ? 'border-green-500 bg-green-500/10' : 'border-gray-700 hover:border-green-400 hover:bg-gray-900'}`}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center gap-4 text-gray-500 group-hover:text-green-400 transition-colors">
              <FaCloudUploadAlt size={64} />
              <div className="text-lg font-bold">
                {isDragActive ? "Solte aqui..." : "Arraste sua imagem"}
              </div>
              <p className="text-sm">Recomendado: 500x500px ou maior</p>
            </div>
          </div>
        )}

        {/* RESULTADO */}
        {originalImage && (
          <div className="w-full max-w-4xl animate-fade-in-up">
            <div className="flex justify-between items-center mb-6 bg-gray-900 p-4 rounded-xl border border-gray-800">
              <div className="flex items-center gap-4">
                <img src={originalImage} alt="Original" className="w-16 h-16 object-contain rounded border border-gray-700 bg-[#18181b]" />
                <div className="text-sm text-gray-400">Original</div>
              </div>
              <div className="flex gap-3">
                 <button onClick={reset} className="px-4 py-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-lg flex items-center gap-2 font-bold transition-all"><FaTrash /> Limpar</button>
                 {Object.keys(resizedImages).length > 0 && (
                    <button onClick={handleDownloadZip} className="px-6 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg flex items-center gap-2 font-bold transition-all"><FaFileArchive /> Baixar ZIP</button>
                 )}
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {sizes.map(({ size, label }) => {
                const imgSrc = resizedImages[size];
                return (
                  <div key={size} className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex flex-col items-center group hover:border-green-500/50 transition-all">
                    <div className="text-[10px] text-green-300 mb-2 font-mono">{size}x{size}</div>
                    <h3 className="text-xs font-bold text-gray-400 uppercase mb-4 text-center">{label}</h3>
                    <div className="flex gap-2 mb-4 justify-center">
                      <div className="w-16 h-16 bg-[#18181b] rounded flex items-center justify-center border border-gray-700">
                         {imgSrc && <img src={imgSrc} style={{ width: size, height: size }} className="object-contain" />}
                      </div>
                      <div className="w-16 h-16 bg-[#e5e5e5] rounded flex items-center justify-center border border-gray-300">
                         {imgSrc && <img src={imgSrc} style={{ width: size, height: size }} className="object-contain" />}
                      </div>
                    </div>
                    <button onClick={() => saveAs(imgSrc, `emote_${size}px.png`)} disabled={!imgSrc} className="w-full py-2 bg-green-600/10 text-green-400 hover:bg-green-600 hover:text-white rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2"><FaDownload /> Baixar PNG</button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}