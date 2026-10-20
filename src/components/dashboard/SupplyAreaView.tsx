import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PLANT_COA } from '../../data/mockData';
import { 
  Compass, 
  Layers, 
  BarChart3, 
  TrendingUp, 
  Truck, 
  Clock, 
  Fuel, 
  MapPin, 
  Calendar,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { FieldTalhao } from '../../types';

export const SupplyAreaView: React.FC = () => {
  const { talhoes, trucks, moegas, setActiveTab, setSelectedTruck } = useApp();
  const [selectedTalhaoId, setSelectedTalhaoId] = useState<string>(talhoes[0].id);

  const selectedTalhao = talhoes.find(t => t.id === selectedTalhaoId) || talhoes[0];

  // Cálculos preditivos de logística CTT
  const totalProductionTons = selectedTalhao.totalProductionEstimatedTons;
  const remainingProductionTons = totalProductionTons * (1 - selectedTalhao.harvestedPercentage / 100);
  const averageTruckCapacity = 74; // Rodotrem 74t
  const tripsNeeded = Math.ceil(remainingProductionTons / averageTruckCapacity);
  const trucksCurrentlyAssigned = trucks.filter(t => t.currentFieldId === selectedTalhao.id).length;

  // Lead time estimado até a moega
  const estimatedLeadTimeMinutes = Math.round(selectedTalhao.distanceToPlantKm / 32 * 60) + 30; // 30min corte/transbordo + viagem vicinal
  const estimatedDieselConsumptionLiters = Math.round(selectedTalhao.distanceToPlantKm * 1.8 * 2); // Ida e volta

  return (
    <div className="p-4 space-y-5 max-w-7xl mx-auto text-slate-100">
      
      {/* Cabeçalho */}
      <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Compass className="w-5 h-5 text-emerald-400" />
              Cálculo de Área de Abastecimento & Logística Preditiva CTT
            </h2>
            <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-700/50 text-xs font-mono font-semibold">
              Triângulo Mineiro / Alto Paranaíba
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Zoneamento do raio econômico de abastecimento da usina, previsão de produtividade agrícola (t/ha) e dimensionamento de composições de transporte.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-slate-950/60 border border-slate-800 p-2.5 rounded-xl text-xs shrink-0">
          <div className="text-[11px] text-slate-400">Capacidade da Usina:</div>
          <div className="font-mono font-bold text-emerald-400 text-sm">
            {PLANT_COA.nominalCrushingCapacityTonsPerDay.toLocaleString()} t/dia
          </div>
        </div>
      </div>

      {/* Grid de Zonas de Raio Econômico de Abastecimento */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        
        {/* Raio Primário */}
        <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-600/40 relative overflow-hidden shadow-sm">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-bold text-emerald-400 uppercase tracking-wider">
              Zona Primária (0 a 12 km)
            </span>
            <span className="px-2 py-0.5 rounded bg-emerald-900/60 text-emerald-300 font-mono font-bold text-[10px]">
              ALTA EFICIÊNCIA
            </span>
          </div>
          <div className="text-2xl font-bold font-mono text-white mb-1">R$ 18,20 <span className="text-xs font-normal text-slate-300">/ t frete</span></div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Menor consumo de diesel em estradas vicinais. Ciclo CTT rápido (~1h 35m). Abastecimento prioritário de moega em horários de pico.
          </p>
        </div>

        {/* Raio Secundário */}
        <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-600/40 relative overflow-hidden shadow-sm">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-bold text-amber-400 uppercase tracking-wider">
              Zona Secundária (12 a 24 km)
            </span>
            <span className="px-2 py-0.5 rounded bg-amber-900/60 text-amber-300 font-mono font-bold text-[10px]">
              MODULAÇÃO JIT
            </span>
          </div>
          <div className="text-2xl font-bold font-mono text-white mb-1">R$ 27,80 <span className="text-xs font-normal text-slate-300">/ t frete</span></div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Zona de maior volume da safra em Minas Gerais. A modulação de velocidade média recomendada é essencial para não gerar comboios nas vicinais.
          </p>
        </div>

        {/* Raio Terciário */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 relative overflow-hidden shadow-sm">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-bold text-slate-300 uppercase tracking-wider">
              Zona Marginal (&gt; 24 km)
            </span>
            <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono font-bold text-[10px]">
              ALERTA DE FRETE
            </span>
          </div>
          <div className="text-2xl font-bold font-mono text-white mb-1">R$ 38,50 <span className="text-xs font-normal text-slate-300">/ t frete</span></div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Maior desgaste de pneumáticos e consumo de diesel. Exige sincronia milimétrica de transbordos para evitar caminhão ocioso no carreador.
          </p>
        </div>

      </div>

      {/* Seletor e Inspetor de Talhão Agrícola */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* Lista de Talhões de Origem */}
        <div className="lg:col-span-1 bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs font-bold text-slate-200">
            <span className="flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-emerald-400" />
              Talhões Ativos na Safra
            </span>
            <span className="font-mono text-slate-400">{talhoes.length} frentes</span>
          </div>

          <div className="space-y-2">
            {talhoes.map(talhao => {
              const isSelected = talhao.id === selectedTalhaoId;
              return (
                <button
                  key={talhao.id}
                  onClick={() => setSelectedTalhaoId(talhao.id)}
                  className={`w-full p-3 rounded-xl text-left transition border ${
                    isSelected
                      ? 'bg-emerald-600/20 border-emerald-500/50 text-white shadow-md'
                      : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs">{talhao.name}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-900 text-emerald-400 border border-slate-700">
                      {talhao.predictedYieldTonsPerHa} t/ha
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    {talhao.distanceToPlantKm} km da usina via {talhao.primaryVicinalRoad}
                  </div>
                  <div className="mt-2 flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">Progresso de Colheita:</span>
                    <span className="font-mono font-bold text-white">{talhao.harvestedPercentage}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-1">
                    <div
                      className="bg-emerald-500 h-full rounded-full"
                      style={{ width: `${talhao.harvestedPercentage}%` }}
                    ></div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Painel Preditivo de Produção do Talhão Selecionado */}
        <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-start justify-between pb-3 border-b border-slate-800">
            <div>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                {selectedTalhao.farmName}
              </span>
              <h3 className="text-lg font-bold text-white mt-0.5">
                {selectedTalhao.name}
              </h3>
              <p className="text-xs text-slate-400">
                Cultura: <strong className="text-slate-200">{selectedTalhao.cropType}</strong> • Estrada Principal: <strong className="text-amber-300">{selectedTalhao.primaryVicinalRoad}</strong>
              </p>
            </div>
            <button
              onClick={() => setActiveTab('map')}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <span>Ver no Mapa</span>
            </button>
          </div>

          {/* Cards Numéricos Preditivos */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/60">
              <div className="text-[11px] text-slate-400">Área do Talhão</div>
              <div className="text-base font-bold font-mono text-white mt-0.5">
                {selectedTalhao.areaHectares} ha
              </div>
            </div>

            <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/60">
              <div className="text-[11px] text-slate-400">Produtividade Preditiva</div>
              <div className="text-base font-bold font-mono text-emerald-400 mt-0.5">
                {selectedTalhao.predictedYieldTonsPerHa} t/ha
              </div>
            </div>

            <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/60">
              <div className="text-[11px] text-slate-400">Volume Restante</div>
              <div className="text-base font-bold font-mono text-white mt-0.5">
                {Math.round(remainingProductionTons).toLocaleString()} t
              </div>
            </div>

            <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/60">
              <div className="text-[11px] text-slate-400">Giros de Rodotrem (74t)</div>
              <div className="text-base font-bold font-mono text-amber-400 mt-0.5">
                {tripsNeeded} viagens
              </div>
            </div>
          </div>

          {/* Dimensionamento de Tempo e Combustível */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              Estimativa do Ciclo Logístico CTT para este Talhão
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <Clock className="w-4 h-4 text-blue-400" />
                <div>
                  <div className="text-slate-400 text-[10px]">Lead Time Médio Viagem</div>
                  <div className="font-mono font-bold text-white text-xs">{estimatedLeadTimeMinutes} minutos</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <Fuel className="w-4 h-4 text-emerald-400" />
                <div>
                  <div className="text-slate-400 text-[10px]">Consumo Médio Diesel</div>
                  <div className="font-mono font-bold text-white text-xs">~{estimatedDieselConsumptionLiters} L / ciclo</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <Truck className="w-4 h-4 text-amber-400" />
                <div>
                  <div className="text-slate-400 text-[10px]">Frotas Atualmente Alocadas</div>
                  <div className="font-mono font-bold text-white text-xs">{trucksCurrentlyAssigned} rodotrens</div>
                </div>
              </div>
            </div>
          </div>

          {/* Recomendação da Central COA */}
          <div className="p-3 bg-emerald-950/40 border border-emerald-600/40 rounded-xl text-xs text-emerald-200 flex items-start gap-2">
            <div className="p-1 rounded bg-emerald-500/20 text-emerald-400 shrink-0 mt-0.5">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <strong className="text-emerald-300">Recomendação Preditiva de Despacho COA:</strong> Manter cadência de 1 caminhão a cada 18 minutos saindo deste talhão para compatibilizar a produção da colhedora (92 t/h) com a taxa de recepção da Moega 01 (950 t/h), assegurando que o transbordo nunca fique parado no carreador com carga cheia.
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

