import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Clock, 
  Gauge, 
  Fuel, 
  CheckCircle2, 
  AlertTriangle, 
  Zap, 
  Timer, 
  Truck as TruckIcon,
  Layers,
  ArrowRight,
  TrendingDown,
  Info,
  Radio
} from 'lucide-react';
import { Truck } from '../../types';

export const VirtualQueueModule: React.FC = () => {
  const { trucks, moegas, setSelectedTruck, setActiveTab } = useApp();

  // Simulador de modulação rápida interativo
  const [simDistanceKm, setSimDistanceKm] = useState(14);
  const [simTargetMinutes, setSimTargetMinutes] = useState(25);
  const calculatedIdealSpeed = Math.round((simDistanceKm / (simTargetMinutes / 60)));

  // Caminhões em trânsito com destino à moega
  const trucksEnRoute = trucks.filter(
    t => t.status === 'fila_virtual_jit' || t.status === 'em_transito_vicinal'
  );

  return (
    <div className="p-4 space-y-5 max-w-7xl mx-auto text-slate-100">
      
      {/* Cabeçalho da Fila Virtual JIT */}
      <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-400" />
              Fila Virtual e Agendamento Just-in-Time (JIT)
            </h2>
            <span className="px-2 py-0.5 rounded-full bg-amber-950 text-amber-400 border border-amber-700/50 text-xs font-mono font-semibold">
              Cadência CTT Ativa
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Modulação preditiva da velocidade média nas estradas vicinais. Os caminhões chegam exatamente no minuto de liberação da moega, eliminando filas no pátio e ociosidade com motor em marcha lenta.
          </p>
        </div>

        {/* Resumo de Eficiência */}
        <div className="flex items-center gap-3 bg-slate-950/60 border border-slate-800 p-2.5 rounded-xl text-xs shrink-0">
          <div className="flex items-center gap-2 text-emerald-400 font-medium">
            <Fuel className="w-4 h-4" />
            <div>
              <div className="text-[10px] text-slate-400">Diesel Poupado Hoje:</div>
              <div className="font-mono font-bold text-white text-sm">1.420 Litros</div>
            </div>
          </div>
          <div className="border-l border-slate-800 pl-3">
            <div className="text-[10px] text-slate-400">Tempo Médio Espera:</div>
            <div className="font-mono font-bold text-emerald-400 text-sm">2.4 min (Meta &lt; 5m)</div>
          </div>
        </div>
      </div>

      {/* Monitor de Moegas e Slots Disponíveis */}
      <div>
        <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center gap-2">
          <Layers className="w-4 h-4 text-emerald-400" />
          <span>Capacidade e Fluxo das Moegas Industriais (Usina Vale do Grande)</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {moegas.map(moega => {
            const currentTruck = trucks.find(t => t.prefix === moega.currentTruckPrefix);
            return (
              <div
                key={moega.id}
                className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 relative overflow-hidden shadow-sm"
              >
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <div>
                    <h3 className="text-xs font-bold text-white">{moega.name}</h3>
                    <div className="text-[11px] text-slate-400">Vazão: {moega.maxCapacityTonsPerHour} t/h</div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950 text-emerald-400 border border-emerald-700/50">
                    OPERANDO
                  </span>
                </div>

                <div className="mt-3 space-y-2">
                  <div className="p-2 rounded-lg bg-slate-800/60 border border-slate-700/50 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-slate-400">Caminhão no Tombador:</div>
                      <div className="text-xs font-mono font-bold text-white flex items-center gap-1.5">
                        <TruckIcon className="w-3.5 h-3.5 text-blue-400" />
                        {moega.currentTruckPrefix ? `${moega.currentTruckPrefix} (${currentTruck?.model || 'Rodotrem'})` : 'Livre para descarga'}
                      </div>
                    </div>
                    {moega.currentTruckPrefix && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800 font-mono animate-pulse">
                        Descarga
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="text-slate-400">Fila Física no Pátio:</span>
                    <span className="font-mono font-bold text-emerald-400">{moega.queueCount} veículo</span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Agendados na Fila Virtual:</span>
                    <span className="font-mono font-bold text-amber-400">{moega.virtualQueueCount} a caminho</span>
                  </div>

                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-slate-400">Próximo Slot Livre:</span>
                    <span className="font-mono font-bold text-white bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                      {moega.nextAvailableSlot}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tabela de Modulação de Velocidade JIT */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 bg-slate-950/60 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Gauge className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white">
              Painel de Modulação de Velocidade Dinâmica (Frente de Transporte ➔ Moega)
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {trucksEnRoute.length} caminhões em trânsito sincronizado
          </span>
        </div>

        <div className="divide-y divide-slate-800/80">
          {trucksEnRoute.map(truck => {
            const isFasterThanRecommended = truck.speedCurrentKmH > truck.speedRecommendedKmH + 2;
            const isSlowerThanRecommended = truck.speedCurrentKmH < truck.speedRecommendedKmH - 2;

            return (
              <div
                key={truck.id}
                className="p-4 hover:bg-slate-800/40 transition flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
              >
                {/* Veículo & Motorista */}
                <div className="flex items-center gap-3 min-w-[240px]">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-mono font-bold text-emerald-400 text-sm shrink-0">
                    {truck.prefix}
                  </div>
                  <div>
                    <div className="font-bold text-white text-xs flex items-center gap-2">
                      <span>{truck.model}</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 font-mono">
                        {truck.currentLoadTons}t
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      Motorista: <strong className="text-slate-200">{truck.driver.name}</strong> • Canal {truck.driver.radioChannel}
                    </div>
                  </div>
                </div>

                {/* Slot Alvo na Moega */}
                <div className="flex items-center gap-4 text-xs font-mono">
                  <div className="p-2 rounded-lg bg-slate-800/70 border border-slate-700/60 text-center">
                    <div className="text-[10px] text-slate-400">Slot Reservado</div>
                    <div className="font-bold text-amber-400 text-sm mt-0.5">
                      {truck.scheduledMoegaSlot || '15:15'}
                    </div>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-800/70 border border-slate-700/60 text-center">
                    <div className="text-[10px] text-slate-400">Distância Vicinal</div>
                    <div className="font-bold text-white text-sm mt-0.5">
                      {truck.distanceToDestKm} km
                    </div>
                  </div>
                </div>

                {/* Modulação de Velocidade (Atual vs Recomendada) */}
                <div className="flex-1 max-w-md">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-slate-300 font-medium flex items-center gap-1">
                      <Gauge className="w-3.5 h-3.5 text-amber-400" />
                      Velocidade Atual: <strong className="text-white font-mono">{truck.speedCurrentKmH} km/h</strong>
                    </span>
                    <span className="font-mono font-bold text-xs text-emerald-400">
                      Ideal JIT: {truck.speedRecommendedKmH} km/h
                    </span>
                  </div>

                  {/* Orientação ao Motorista */}
                  <div className={`p-2 rounded-lg text-xs leading-relaxed border ${
                    isFasterThanRecommended
                      ? 'bg-amber-950/50 border-amber-500/40 text-amber-200'
                      : isSlowerThanRecommended
                      ? 'bg-blue-950/50 border-blue-500/40 text-blue-200'
                      : 'bg-emerald-950/50 border-emerald-500/40 text-emerald-200'
                  }`}>
                    {isFasterThanRecommended ? (
                      <div className="flex items-start gap-1.5">
                        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                        <div>
                          <strong>Orientação Rádio COA:</strong> Reduzir velocidade média para <strong>{truck.speedRecommendedKmH} km/h</strong>. Se mantiver {truck.speedCurrentKmH} km/h, chegará 6 minutos antes da liberação da moega, gerando fila e desperdício de diesel em marcha lenta.
                        </div>
                      </div>
                    ) : isSlowerThanRecommended ? (
                      <div className="flex items-start gap-1.5">
                        <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                        <div>
                          <strong>Orientação Rádio COA:</strong> Incrementar para <strong>{truck.speedRecommendedKmH} km/h</strong> na vicinal para garantir chegada pontual às {truck.scheduledMoegaSlot} e evitar desabastecimento da esteira.
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <div>
                          <strong>Cadência Perfeita:</strong> Velocidade perfeitamente sincronizada com o tombador. Chegada pontual sem parada.
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Botão de Localização */}
                <div className="shrink-0">
                  <button
                    onClick={() => {
                      setSelectedTruck(truck);
                      setActiveTab('map');
                    }}
                    className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-emerald-600 hover:text-white text-slate-300 text-xs font-semibold transition flex items-center gap-1.5"
                  >
                    <span>Ver no Mapa</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      </div>

      {/* Calculador Interativo de Cadência JIT */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <Zap className="w-4 h-4 text-amber-400" />
          <h3 className="text-sm font-bold text-white">
            Simulador COA: Cálculo Dinâmico de Modulação de Velocidade
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs text-slate-300 mb-1">
              Distância na Estrada Vicinal: <strong className="text-white font-mono">{simDistanceKm} km</strong>
            </label>
            <input
              type="range"
              min="5"
              max="40"
              value={simDistanceKm}
              onChange={e => setSimDistanceKm(Number(e.target.value))}
              className="w-full accent-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-300 mb-1">
              Tempo até Liberação da Moega: <strong className="text-white font-mono">{simTargetMinutes} min</strong>
            </label>
            <input
              type="range"
              min="10"
              max="60"
              value={simTargetMinutes}
              onChange={e => setSimTargetMinutes(Number(e.target.value))}
              className="w-full accent-amber-500"
            />
          </div>

          <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/80 flex items-center justify-between">
            <div>
              <div className="text-[10px] text-slate-400">Velocidade Vicinal Recomendada:</div>
              <div className="text-xl font-bold font-mono text-emerald-400">
                {calculatedIdealSpeed} km/h
              </div>
            </div>
            <div className="text-right text-[11px] text-slate-300">
              Zero espera na moega
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

