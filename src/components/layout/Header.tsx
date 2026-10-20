import React, { useState, useRef, useEffect } from 'react';
import { 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  Cloud, 
  CloudOff, 
  Volume2, 
  VolumeX, 
  Sun, 
  Moon, 
  Radio,
  Building2,
  HardDrive,
  Dice5,
  Trash2,
  RotateCcw,
  Sparkles,
  ChevronDown,
  X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PLANT_COA } from '../../data/mockData';

export const Header: React.FC = () => {
  const {
    isOffline,
    toggleOfflineMode,
    pendingSyncCount,
    lastSyncTime,
    isSyncing,
    syncNow,
    storageUsageKb,
    soundEnabled,
    toggleSound,
    theme,
    toggleTheme,
    addRandomTruck,
    addRandomIncident,
    fillRandomBatch,
    removeAllRandom,
    resetToDefaultData,
    randomStats
  } = useApp();

  const [isDemoMenuOpen, setIsDemoMenuOpen] = useState(false);
  const demoMenuRef = useRef<HTMLDivElement>(null);

  // Fechar ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (demoMenuRef.current && !demoMenuRef.current.contains(event.target as Node)) {
        setIsDemoMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const totalRandomCount = randomStats.randomTrucksCount + randomStats.randomIncidentsCount;

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-slate-100 sticky top-0 z-40 px-4 py-2.5 shadow-md">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        
        {/* Lado Esquerdo: Identificação COA & Usina */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold shadow-inner">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold tracking-tight text-white flex items-center gap-1.5">
                COA LOGÍSTICA CTT
                <span className="text-xs px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 font-mono font-medium">
                  MINAS GERAIS
                </span>
              </h1>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Building2 className="w-3.5 h-3.5 text-slate-500" />
              <span className="font-medium text-slate-300">{PLANT_COA.name}</span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-400">{PLANT_COA.locationName}</span>
            </div>
          </div>
        </div>

        {/* Lado Direito: Indicadores Offline-First e Controles de Operação */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs">
          
          {/* BOTÃO GERADOR DE DADOS ALEATÓRIOS (DEMO / TESTES) */}
          <div className="relative" ref={demoMenuRef}>
            <button
              onClick={() => setIsDemoMenuOpen(!isDemoMenuOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-medium shadow transition"
              title="Inserir e retirar valores aleatórios de teste"
            >
              <Dice5 className="w-3.5 h-3.5" />
              <span className="font-semibold">Dados Aleatórios</span>
              {totalRandomCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-slate-950/80 text-cyan-300 font-mono text-[10px] font-bold">
                  {totalRandomCount}
                </span>
              )}
              <ChevronDown className="w-3 h-3 text-emerald-200" />
            </button>

            {/* Menu Popover */}
            {isDemoMenuOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-3 text-xs text-slate-200 z-50 space-y-2 animate-in fade-in zoom-in-95">
                <div className="flex items-center justify-between pb-1.5 border-b border-slate-800">
                  <span className="font-bold text-white flex items-center gap-1 text-[13px]">
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                    Gerador de Testes (Demo)
                  </span>
                  <button 
                    onClick={() => setIsDemoMenuOpen(false)}
                    className="text-slate-400 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <p className="text-[11px] text-slate-400">
                  Insira ou retire dados gerados aleatoriamente para simular a operação do COA.
                </p>

                <div className="space-y-1.5 pt-1">
                  <button
                    onClick={() => {
                      addRandomTruck();
                      setIsDemoMenuOpen(false);
                    }}
                    className="w-full text-left p-2 rounded-lg bg-slate-800 hover:bg-emerald-600/20 hover:border-emerald-500/50 border border-slate-700 transition flex items-center justify-between"
                  >
                    <div>
                      <div className="font-semibold text-white">🚚 + Caminhão Aleatório</div>
                      <div className="text-[10px] text-slate-400">Gera rodotrem com motorista e rota</div>
                    </div>
                    <span className="text-emerald-400 font-bold">+1</span>
                  </button>

                  <button
                    onClick={() => {
                      addRandomIncident();
                      setIsDemoMenuOpen(false);
                    }}
                    className="w-full text-left p-2 rounded-lg bg-slate-800 hover:bg-amber-600/20 hover:border-amber-500/50 border border-slate-700 transition flex items-center justify-between"
                  >
                    <div>
                      <div className="font-semibold text-white">⚠️ + Incidente Aleatório</div>
                      <div className="text-[10px] text-slate-400">Atoleiro, ponte ou poeira em vicinal</div>
                    </div>
                    <span className="text-amber-400 font-bold">+1</span>
                  </button>

                  <button
                    onClick={() => {
                      fillRandomBatch();
                      setIsDemoMenuOpen(false);
                    }}
                    className="w-full text-left p-2 rounded-lg bg-emerald-950/70 hover:bg-emerald-900 border border-emerald-600/50 text-emerald-200 transition font-medium flex items-center justify-between"
                  >
                    <div>
                      <div className="font-bold text-white">⚡ Preencher Lote Aleatório</div>
                      <div className="text-[10px] text-emerald-300">3 caminhões + 1 incidente</div>
                    </div>
                    <span className="text-emerald-300 font-mono text-[11px]">+4</span>
                  </button>
                </div>

                {/* Seção de Retirada */}
                <div className="pt-2 border-t border-slate-800 space-y-1.5">
                  {totalRandomCount > 0 ? (
                    <button
                      onClick={() => {
                        removeAllRandom();
                        setIsDemoMenuOpen(false);
                      }}
                      className="w-full p-2 rounded-lg bg-rose-950/70 hover:bg-rose-900 text-rose-200 border border-rose-800/60 font-semibold transition flex items-center justify-center gap-1.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Retirar Todos os Aleatórios ({totalRandomCount})</span>
                    </button>
                  ) : (
                    <div className="text-[11px] text-slate-500 text-center py-1 italic">
                      Nenhum dado aleatório adicionado no momento.
                    </div>
                  )}

                  <button
                    onClick={() => {
                      resetToDefaultData();
                      setIsDemoMenuOpen(false);
                    }}
                    className="w-full p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition flex items-center justify-center gap-1.5 text-[11px]"
                  >
                    <RotateCcw className="w-3 h-3 text-slate-400" />
                    <span>Restaurar Valores Padrão</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Indicador de Status de Rede (Online / Offline) */}
          <div className="flex items-center bg-slate-800/80 border border-slate-700/80 rounded-lg p-1.5 px-2.5 gap-2 shadow-sm">
            <button
              onClick={toggleOfflineMode}
              title={isOffline ? 'Alternar para Modo Online' : 'Simular Perda de Conectividade Rural'}
              className={`flex items-center gap-1.5 font-medium px-2 py-1 rounded transition-colors ${
                isOffline
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
              }`}
            >
              {isOffline ? (
                <>
                  <WifiOff className="w-3.5 h-3.5 text-amber-400" />
                  <span>OFFLINE (Cache Local)</span>
                </>
              ) : (
                <>
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                  <span>ONLINE (Starlink / 4G)</span>
                </>
              )}
            </button>

            {/* Simulador Toggle */}
            <label className="flex items-center gap-1.5 cursor-pointer text-slate-400 hover:text-slate-200 border-l border-slate-700 pl-2">
              <input
                type="checkbox"
                checked={isOffline}
                onChange={toggleOfflineMode}
                className="sr-only peer"
              />
              <div className="w-7 h-4 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-amber-600 relative"></div>
              <span className="text-[11px]">Simular Rural</span>
            </label>
          </div>

          {/* Fila de Sincronização & Botão de Sincronizar */}
          <div className="flex items-center bg-slate-800/80 border border-slate-700/80 rounded-lg p-1.5 px-2.5 gap-2">
            {pendingSyncCount > 0 ? (
              <span className="flex items-center gap-1 px-1.5 py-0.5 bg-amber-900/60 border border-amber-500/30 text-amber-300 rounded font-mono font-medium">
                <CloudOff className="w-3 h-3 text-amber-400" />
                {pendingSyncCount} em fila
              </span>
            ) : (
              <span className="flex items-center gap-1 text-slate-400">
                <Cloud className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden lg:inline">{lastSyncTime}</span>
              </span>
            )}

            <button
              onClick={syncNow}
              disabled={isSyncing}
              title="Sincronizar dados com o servidor central"
              className={`p-1.5 rounded bg-slate-700 hover:bg-slate-600 text-slate-200 transition ${
                isSyncing ? 'opacity-60 cursor-not-allowed' : ''
              }`}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-emerald-400' : ''}`} />
            </button>

            {/* Storage Local */}
            <div className="hidden xl:flex items-center gap-1 text-slate-400 text-[11px] border-l border-slate-700 pl-2">
              <HardDrive className="w-3 h-3 text-slate-500" />
              <span>{storageUsageKb} KB DB</span>
            </div>
          </div>

          {/* Botões de Acessibilidade / Áudio / Tema */}
          <div className="flex items-center gap-1 bg-slate-800/80 border border-slate-700/80 rounded-lg p-1">
            <button
              onClick={toggleSound}
              title={soundEnabled ? 'Silenciar Áudio COA' : 'Ativar Rádio Beep COA'}
              className="p-1.5 rounded hover:bg-slate-700 text-slate-300 hover:text-white transition"
            >
              {soundEnabled ? (
                <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <VolumeX className="w-3.5 h-3.5 text-slate-500" />
              )}
            </button>

            <button
              onClick={toggleTheme}
              title="Alternar Tema Claro / Escuro"
              className="p-1.5 rounded hover:bg-slate-700 text-slate-300 hover:text-white transition"
            >
              {theme === 'dark' ? (
                <Sun className="w-3.5 h-3.5 text-amber-400" />
              ) : (
                <Moon className="w-3.5 h-3.5 text-slate-400" />
              )}
            </button>
          </div>

        </div>

      </div>
    </header>
  );
};
