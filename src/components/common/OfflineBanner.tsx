import React from 'react';
import { WifiOff, Database, RefreshCw, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const OfflineBanner: React.FC = () => {
  const { isOffline, pendingSyncCount, toggleOfflineMode, storageUsageKb } = useApp();

  if (!isOffline) return null;

  return (
    <div className="bg-amber-500/15 border-b border-amber-500/30 px-4 py-2 text-xs text-amber-200">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded bg-amber-500/20 text-amber-300">
            <WifiOff className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="font-bold text-amber-300">MODO OFFLINE ATIVO (Área Rural sem Cobertura):</span>{' '}
            <span>
              O COA está operando com cache local ({storageUsageKb} KB). Todas as alterações de frota e alertas de estrada são preservados offline.
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {pendingSyncCount > 0 && (
            <span className="px-2 py-0.5 rounded bg-amber-900/80 text-amber-300 font-mono font-semibold border border-amber-600/40">
              {pendingSyncCount} {pendingSyncCount === 1 ? 'operação em fila' : 'operações em fila'}
            </span>
          )}
          <button
            onClick={toggleOfflineMode}
            className="px-2.5 py-1 rounded bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold transition text-[11px]"
          >
            Reconectar Online
          </button>
        </div>
      </div>
    </div>
  );
};

