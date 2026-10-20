import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TrafficIncident, IncidentType } from '../../types';
import { ReportIncidentModal } from './ReportIncidentModal';
import { 
  AlertTriangle, 
  CloudRain, 
  ShieldAlert, 
  CheckCircle2, 
  Plus, 
  MapPin, 
  Navigation, 
  Clock, 
  Radio,
  Share2,
  Compass
} from 'lucide-react';

export const TrafficIncidentsFeed: React.FC = () => {
  const { 
    incidents, 
    reportIncident, 
    toggleIncidentDetour, 
    resolveIncident, 
    setActiveTab 
  } = useApp();

  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [filter, setFilter] = useState<'ativos' | 'todos' | 'criticos'>('ativos');

  const filteredIncidents = incidents.filter(incident => {
    if (filter === 'ativos') return !incident.isResolved;
    if (filter === 'criticos') return !incident.isResolved && incident.severity === 'critica';
    return true;
  });

  const getIncidentIcon = (type: IncidentType) => {
    switch (type) {
      case 'atoleiro':
        return <AlertTriangle className="w-5 h-5 text-amber-400" />;
      case 'chuva_localizada':
        return <CloudRain className="w-5 h-5 text-blue-400" />;
      case 'ponte_avariada':
        return <ShieldAlert className="w-5 h-5 text-rose-400" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-amber-400" />;
    }
  };

  return (
    <div className="p-4 space-y-4 max-w-7xl mx-auto text-slate-100">
      
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-slate-900/90 border border-slate-800 p-4 rounded-2xl shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-400" />
              Mapeamento Colaborativo de Tráfego e Ocorrências Vicinais
            </h2>
            <span className="px-2 py-0.5 rounded-full bg-rose-950 text-rose-400 border border-rose-700/50 text-xs font-mono font-semibold">
              {incidents.filter(i => !i.isResolved).length} Alertas Ativos
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Feed operacional alimentado por motoristas de rodotrem e fiscais de campo via rádio VHF/satélite rural. Atoleiros, pontes frágeis e chuvas em Minas Gerais.
          </p>
        </div>

        <button
          onClick={() => setIsReportModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition shadow-lg shadow-rose-950/60 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Reportar Alerta de Estrada</span>
        </button>
      </div>

      {/* Filtros Rápidos */}
      <div className="flex items-center gap-2 bg-slate-900/60 border border-slate-800 p-2 rounded-xl text-xs">
        <button
          onClick={() => setFilter('ativos')}
          className={`px-3 py-1.5 rounded-lg font-medium transition ${
            filter === 'ativos' ? 'bg-rose-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
          }`}
        >
          Ocorrências Ativas ({incidents.filter(i => !i.isResolved).length})
        </button>
        <button
          onClick={() => setFilter('criticos')}
          className={`px-3 py-1.5 rounded-lg font-medium transition ${
            filter === 'criticos' ? 'bg-rose-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
          }`}
        >
          Atoleiros Críticos ({incidents.filter(i => !i.isResolved && i.severity === 'critica').length})
        </button>
        <button
          onClick={() => setFilter('todos')}
          className={`px-3 py-1.5 rounded-lg font-medium transition ${
            filter === 'todos' ? 'bg-rose-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
          }`}
        >
          Histórico Completo ({incidents.length})
        </button>
      </div>

      {/* Lista de Incidentes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredIncidents.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-400 bg-slate-900/50 rounded-2xl border border-slate-800">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2 opacity-80" />
            <div className="text-sm font-semibold text-white">Nenhum incidente ativo no momento!</div>
            <div className="text-xs text-slate-400 mt-1">Todas as estradas vicinais estão com tráfego normal e liberado.</div>
          </div>
        ) : (
          filteredIncidents.map(incident => {
            const isCritical = incident.severity === 'critica';
            return (
              <div
                key={incident.id}
                className={`p-4 rounded-2xl border transition-all shadow-md flex flex-col justify-between ${
                  incident.isResolved
                    ? 'bg-slate-900/40 border-slate-800/80 opacity-70'
                    : isCritical
                    ? 'bg-rose-950/20 border-rose-700/60 shadow-rose-950/20'
                    : 'bg-slate-900/90 border-slate-800'
                }`}
              >
                <div>
                  {/* Topo do Card */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className={`p-2 rounded-xl border ${
                        incident.isResolved
                          ? 'bg-slate-800 text-slate-400 border-slate-700'
                          : isCritical
                          ? 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                          : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                      }`}>
                        {getIncidentIcon(incident.type)}
                      </div>
                      <div>
                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${
                          incident.isResolved
                            ? 'bg-slate-800 text-slate-400 border-slate-700'
                            : isCritical
                            ? 'bg-rose-950 text-rose-400 border-rose-800'
                            : 'bg-amber-950 text-amber-400 border-amber-800'
                        }`}>
                          {incident.isResolved ? 'Resolvido / Pista Seca' : `Gravidade ${incident.severity.toUpperCase()}`}
                        </span>
                        <h3 className="text-sm font-bold text-white mt-1 leading-tight">
                          {incident.title}
                        </h3>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs font-mono text-slate-400 flex items-center gap-1 justify-end">
                        <Clock className="w-3 h-3 text-slate-500" />
                        {incident.reportedAt}
                      </span>
                    </div>
                  </div>

                  {/* Localização Vicinal */}
                  <div className="mt-3 p-2 rounded-lg bg-slate-800/60 border border-slate-700/50 flex items-center justify-between text-xs">
                    <span className="font-semibold text-amber-300 flex items-center gap-1">
                      <Compass className="w-3.5 h-3.5" />
                      {incident.vicinalRoad}
                    </span>
                    <span className="font-mono text-slate-300 font-bold bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                      {incident.kmMarker}
                    </span>
                  </div>

                  {/* Descrição */}
                  <p className="text-xs text-slate-300 mt-2.5 leading-relaxed">
                    {incident.description}
                  </p>

                  {/* Detour Alert Box */}
                  {incident.detourActive && incident.suggestedDetourVicinal && (
                    <div className="mt-3 p-2.5 rounded-xl bg-emerald-950/70 border border-emerald-600/40 text-xs">
                      <div className="flex items-center gap-1.5 font-bold text-emerald-400 mb-0.5">
                        <Navigation className="w-3.5 h-3.5" />
                        <span>Desvio de Rota Automático Ativo</span>
                      </div>
                      <p className="text-[11px] text-emerald-200">
                        {incident.suggestedDetourVicinal}
                      </p>
                    </div>
                  )}
                </div>

                {/* Rodapé do Card com Ações */}
                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2 text-xs">
                  <span className="text-[11px] text-slate-400 truncate">
                    Por: <strong className="text-slate-300">{incident.reportedBy}</strong>
                  </span>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {!incident.isResolved && (
                      <>
                        <button
                          onClick={() => toggleIncidentDetour(incident.id)}
                          title="Alternar desvio automático de rota"
                          className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                            incident.detourActive
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-600/50'
                              : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                          }`}
                        >
                          {incident.detourActive ? 'Desvio Ativo' : 'Ativar Desvio'}
                        </button>

                        <button
                          onClick={() => resolveIncident(incident.id)}
                          title="Marcar incidente como resolvido"
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-emerald-600 hover:text-white text-slate-300 text-xs font-semibold transition flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Liberar</span>
                        </button>
                      </>
                    )}

                    <button
                      onClick={() => setActiveTab('map')}
                      title="Ver localização no mapa"
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                    >
                      <MapPin className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

              </div>
            );
          })
        )}
      </div>

      {/* Modal de Novo Incidente */}
      <ReportIncidentModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onSubmit={reportIncident}
      />

    </div>
  );
};

