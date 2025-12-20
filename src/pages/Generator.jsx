import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { FaCopy, FaMagic } from 'react-icons/fa';
import Header from '../components/Layout/Header';
import { Helmet } from 'react-helmet-async';

export default function Generator() {
  const [formData, setFormData] = useState({
    title: '',
    about: '',
    schedule: '',
    pcSpecs: '',
    socials: ''
  });
<Helmet>
  <title>Gerador de Bio e Descrição para Twitch (Markdown) - Stockermann Tools</title>
  <meta name="description" content="Gere descrições organizadas, com ícones e formatação para o painel 'Sobre Mim' do seu canal da Twitch. Copie e cole fácil." />
</Helmet>
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const generateMarkdown = () => {
    return `# 🎮 ${formData.title || 'Meu Canal'}

## Sobre Mim
${formData.about || 'Escreva algo sobre você...'}

## 📅 Horários
${formData.schedule || 'Seg - Sex: 19h'}

## 🖥️ Meu Setup
${formData.pcSpecs || 'PC Gamer...'}

## 🌐 Redes Sociais
${formData.socials || 'Instagram / Twitter'}

---
*Gerado por Stockermann Tools*`;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generateMarkdown());
    toast.success("Markdown copiado!");
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-950 text-white">
      <Header />
      
      <main className="flex-1 container mx-auto p-8 max-w-4xl">
        <h1 className="text-3xl font-black text-purple-500 mb-8 flex items-center gap-2">
          <FaMagic /> Gerador de Bio
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Formulário */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-400 mb-1">Título do Canal</label>
              <input name="title" onChange={handleChange} className="w-full bg-gray-900 border border-gray-700 rounded p-2 focus:border-purple-500 outline-none" placeholder="Ex: Canal do Stocker" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-400 mb-1">Sobre Mim</label>
              <textarea name="about" onChange={handleChange} className="w-full bg-gray-900 border border-gray-700 rounded p-2 h-24 focus:border-purple-500 outline-none" placeholder="Quem é você?" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-400 mb-1">Horários</label>
              <input name="schedule" onChange={handleChange} className="w-full bg-gray-900 border border-gray-700 rounded p-2 focus:border-purple-500 outline-none" placeholder="Ex: Segundas e Quartas às 20h" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-400 mb-1">PC Specs / Setup</label>
              <textarea name="pcSpecs" onChange={handleChange} className="w-full bg-gray-900 border border-gray-700 rounded p-2 h-24 focus:border-purple-500 outline-none" placeholder="Processador, Placa de vídeo..." />
            </div>
          </div>

          {/* Preview */}
          <div className="bg-[#0d1117] border border-gray-700 rounded-xl p-6 relative">
            <h3 className="text-xs font-bold text-gray-500 uppercase mb-4">Preview (Markdown)</h3>
            <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono overflow-auto h-[400px] custom-scrollbar">
              {generateMarkdown()}
            </pre>
            <button 
              onClick={copyToClipboard}
              className="absolute top-4 right-4 bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 shadow-lg transition-all"
            >
              <FaCopy /> Copiar
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}