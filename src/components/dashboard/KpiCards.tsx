import React, { useState } from 'react';
import { 
  Fuel, 
  Clock, 
  TimerReset, 
  TrendingDown, 
  Scale, 
  Zap,
  CheckCircle2,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const KpiCards: React.FC = () => {
  const { kpis, trucks } = useApp();
  const [isExpanded, setIsExpanded] = useState(true);

  // Cálculo da variação de diesel vs meta
  const dieselDiff = ((kpis.dieselLitrosPerTon - kpis.dieselTargetLitrosPerTon) / kpis.dieselTargetLitrosPerTon) * 100;
  // Variação do tempo de ciclo vs meta
  const cycleDiff = ((kpis.totalCycleTimeMinutes - kpis.targetCycleTimeMinutes) / kpis.targetCycleTimeMinutes) * 100;

  return (
    <div className="bg-slate-950/80 border-b border-slate-800 shrink-0">
      {/* Barra de título compacta com toggle opcional para telas menores */}
      <div className="px-3 py-1 bg-slate-900/60 border-b border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
        <span className="font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          Indicadores de Performance Operacional COA CTT
        </span>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="hover:text-white flex items-center gap-1 text-[10px] text-slate-400 px-1.5 py-0.5 rounded hover:bg-slate-800 transition"
        >
          <span>{isExpanded ? 'Recolher KPIs' : 'Expandir KPIs'}</span>
          {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>
      </div>

      {isExpanded && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 p-2.5">
          {/* 1. Eficiência Energética (L/t) */}
          <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 shadow-sm relative overflow-hidden group hover:border-slate-700 transition">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-300">
                Eficiência Energética
              </span>
              <div className="p-1 rounded bg-emerald-500/10 text-emerald-400">
                <Fuel className="w-3.5 h-3.5" />
              </div>
            </div>

            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-bold font-mono text-white tracking-tight">
                {kpis.dieselLitrosPerTon.toFixed(2)}
              </span>
              <span className="text-[11px] font-medium text-slate-400">L / t transportada</span>
            </div>

            <div className="mt-1.5 flex items-center justify-between text-[10px] pt-1.5 border-t border-slate-800/80">
              <div className="flex items-center gap-1 text-emerald-400 font-medium">
                <TrendingDown className="w-3 h-3" />
                <span>{Math.abs(dieselDiff).toFixed(1)}% abaixo meta</span>
              </div>
              <span className="text-slate-500 font-mono text-[10px]">Meta: {kpis.dieselTargetLitrosPerTon.toFixed(2)}</span>
            </div>
          </div>

          {/* 2. Tempo Total de Ciclo (Lead Time CTT) */}
          <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 shadow-sm relative overflow-hidden group hover:border-slate-700 transition">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-300">
                Lead Time CTT (Ciclo)
              </span>
              <div className="p-1 rounded bg-blue-500/10 text-blue-400">
                <Clock className="w-3.5 h-3.5" />
              </div>
            </div>

            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-bold font-mono text-white tracking-tight">
                {Math.floor(kpis.totalCycleTimeMinutes / 60)}h {kpis.totalCycleTimeMinutes % 60}m
              </span>
              <span className="text-[11px] font-medium text-slate-400">por viagem</span>
            </div>

            <div className="mt-1.5 flex items-center justify-between text-[10px] pt-1.5 border-t border-slate-800/80">
              <div className="flex items-center gap-1 text-emerald-400 font-medium">
                <TrendingDown className="w-3 h-3" />
                <span>{Math.abs(cycleDiff).toFixed(1)}% mais rápido</span>
              </div>
              <span className="text-slate-500 font-mono text-[10px]">
                Meta: {Math.floor(kpis.targetCycleTimeMinutes / 60)}h{kpis.targetCycleTimeMinutes % 60}m
              </span>
            </div>
          </div>

          {/* 3. Índice de Ociosidade em Espera */}
          <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 shadow-sm relative overflow-hidden group hover:border-slate-700 transition">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-300">
                Ociosidade em Espera
              </span>
              <div className="p-1 rounded bg-amber-500/10 text-amber-400">
                <TimerReset className="w-3.5 h-3.5" />
              </div>
            </div>

            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-bold font-mono text-amber-400 tracking-tight">
                {kpis.idlingPercentage.toFixed(1)}%
              </span>
              <span className="text-[11px] font-medium text-slate-400">tempo motor ligado</span>
            </div>

            <div className="mt-1.5 flex items-center justify-between text-[10px] pt-1.5 border-t border-slate-800/80">
              <div className="flex items-center gap-1 text-emerald-400 font-medium">
                <CheckCircle2 className="w-3 h-3" />
                <span>Fila Virtual JIT ativa</span>
              </div>
              <span className="text-slate-500 font-mono text-[10px]">Tol &lt; {kpis.targetIdlingPercentage}%</span>
            </div>
          </div>

          {/* 4. Moagem Diária & Economia JIT */}
          <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 shadow-sm relative overflow-hidden group hover:border-slate-700 transition">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-300">
                Moagem do Dia
              </span>
              <div className="p-1 rounded bg-purple-500/10 text-purple-400">
                <Scale className="w-3.5 h-3.5" />
              </div>
            </div>

            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-bold font-mono text-white tracking-tight">
                {(kpis.tonsDeliveredToday / 1000).toFixed(1)}k
              </span>
              <span className="text-[11px] font-medium text-slate-400">/ {(kpis.targetTonsToday / 1000).toFixed(0)}k t</span>
            </div>

            <div className="mt-1.5 flex items-center justify-between text-[10px] pt-1.5 border-t border-slate-800/80">
              <div className="flex items-center gap-1 text-emerald-400 font-medium font-mono text-[10px]">
                <Zap className="w-3 h-3" />
                <span>+{kpis.jitSavingsDieselLiters.toLocaleString()} L poupados</span>
              </div>
              <span className="text-slate-400 font-mono text-[10px]">
                {((kpis.tonsDeliveredToday / kpis.targetTonsToday) * 100).toFixed(0)}%
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
