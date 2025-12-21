import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout/Layout';
import { FaSearch } from 'react-icons/fa';

export default function GamesList() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPlatform, setFilterPlatform] = useState('todas');
  const [filterYear, setFilterYear] = useState('todos');
  const [sortBy, setSortBy] = useState('date');

  useEffect(() => {
    fetch('/games.csv')
      .then(res => res.text())
      .then(text => {
        const rows = text.split('\n');
        const data = rows.map(row => {
            const cols = row.split(',');
            if (cols.length < 2) return null;
            return {
              title: cols[0]?.trim(),
              platform: cols[1]?.trim(),
              time: cols[2]?.trim(),
              rating: cols[3]?.trim(),
              date: cols[4]?.trim()
            };
          }).filter(item => item && item.title);
        setGames(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Filtrar e ordenar jogos
  const filteredGames = games
    .filter(g => {
      const matchesSearch = g.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            g.platform.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPlatform = filterPlatform === 'todas' || g.platform === filterPlatform;
      const gameYear = g.date?.split('/')?.pop(); // Extrai ano do formato DD/MM/YYYY
      const matchesYear = filterYear === 'todos' || gameYear === filterYear;
      return matchesSearch && matchesPlatform && matchesYear;
    })
    .sort((a, b) => {
      if (sortBy === 'date') return new Date(b.date) - new Date(a.date);
      if (sortBy === 'rating') return Number(b.rating) - Number(a.rating);
      if (sortBy === 'titulo') return a.title.localeCompare(b.title);
      return 0;
    });

  // Get unique platforms
  const platforms = ['todas', ...new Set(games.map(g => g.platform))];
  
  // Get unique years (sorted descending)
  const years = ['todos', ...new Set(games.map(g => g.date?.split('/')?.pop()).filter(Boolean))].sort((a, b) => b.localeCompare(a));

  return (
    <Layout title="Games Zerados">
      <div className="max-w-6xl mx-auto px-4 py-8 text-white">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-black mb-2 bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-500">🏆 Hall da Fama</h1>
          <p className="text-gray-400">Jogos que zerei e minha nota sincera.</p>
        </div>

        {/* FILTROS */}
        {!loading && (
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* Busca */}
              <div className="relative">
                <FaSearch className="absolute left-3 top-3.5 text-gray-500" />
                <input
                  type="text"
                  placeholder="Buscar jogo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-gray-800/50 border border-gray-700 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Filtro de Plataforma */}
              <select
                value={filterPlatform}
                onChange={(e) => setFilterPlatform(e.target.value)}
                className="bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
              >
                {platforms.map(p => (
                  <option key={p} value={p}>
                    {p === 'todas' ? '📱 Todas as Plataformas' : `🎮 ${p}`}
                  </option>
                ))}
              </select>

              {/* Filtro de Ano */}
              <select
                value={filterYear}
                onChange={(e) => setFilterYear(e.target.value)}
                className="bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
              >
                {years.map(y => (
                  <option key={y} value={y}>
                    {y === 'todos' ? '📆 Todos os Anos' : `📅 ${y}`}
                  </option>
                ))}
              </select>

              {/* Ordenação */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
              >
                <option value="date">📅 Mais Recentes</option>
                <option value="rating">⭐ Maior Nota</option>
                <option value="titulo">🔤 Título (A-Z)</option>
              </select>
            </div>

            {/* Info de resultados */}
            <div className="mt-4 text-sm text-gray-400">
              Mostrando <span className="text-blue-400 font-bold">{filteredGames.length}</span> de <span className="text-blue-400 font-bold">{games.length}</span> jogos
            </div>
          </div>
        )}

        {loading ? (
          <p className="text-center text-gray-500">Lendo arquivo CSV...</p>
        ) : filteredGames.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">Nenhum jogo encontrado com os filtros aplicados.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredGames.map((g, i) => (
              <div key={i} className="bg-gradient-to-br from-gray-900 to-[#09090b] border border-gray-800 hover:border-yellow-500/50 p-5 rounded-xl transition-all hover:shadow-lg hover:shadow-yellow-500/10 group">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-[10px] uppercase font-bold tracking-wider bg-gradient-to-r from-blue-600 to-blue-800 text-white px-3 py-1 rounded-full">{g.platform}</span>
                  <span className={`font-bold text-lg ${Number(g.rating) >= 9 ? "text-yellow-400" : Number(g.rating) >= 7 ? "text-green-400" : "text-orange-400"}`}>
                    ⭐ {g.rating}
                  </span>
                </div>
                <h3 className="font-bold text-lg text-gray-100 group-hover:text-yellow-400 transition-colors mb-4 line-clamp-2">{g.title}</h3>
                <div className="text-xs text-gray-500 flex justify-between border-t border-gray-800 pt-3">
                  <span>⏱️ {g.time}</span>
                  <span>📅 {g.date}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}