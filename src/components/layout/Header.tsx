import React from 'react';
import { 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  Cloud, 
  CloudOff, 
  Database, 
  Volume2, 
  VolumeX, 
  Sun, 
  Moon, 
  Radio,
  Building2,
  HardDrive
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
  } = useApp();

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

