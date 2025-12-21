import React, { useEffect } from 'react';

export default function AdUnit({ slotId, style = {} }) {
  useEffect(() => {
    try {
      // Tenta carregar o anúncio (push no array do Google)
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error("Erro AdSense:", e);
    }
  }, []);

  return (
    <div className="w-full flex justify-center my-4 bg-gray-900/50 rounded-lg overflow-hidden min-h-[100px] border border-gray-800">
      <span className="text-[10px] text-gray-600 absolute mt-1 ml-1">Publicidade</span>
      <ins 
        className="adsbygoogle"
        style={{ display: 'block', width: '100%', ...style }}
        data-ad-client="ca-pub-1820793200457880"  // <--- COLOQUE SEU ID AQUI TAMBÉM
        data-ad-slot={slotId}
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>
    </div>
  );
}