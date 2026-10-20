import React, { useState } from 'react';
import { TrafficIncident, IncidentType, IncidentSeverity } from '../../types';
import { VICINAL_ROADS } from '../../data/mockData';
import { AlertTriangle, X, ShieldAlert, CloudRain, Construction } from 'lucide-react';

interface ReportIncidentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export const ReportIncidentModal: React.FC<ReportIncidentModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [type, setType] = useState<IncidentType>('atoleiro');
  const [title, setTitle] = useState('Pista com formação de atoleiro');
  const [vicinalRoad, setVicinalRoad] = useState(VICINAL_ROADS[1].name);
  const [kmMarker, setKmMarker] = useState('KM 12.4');
  const [severity, setSeverity] = useState<IncidentSeverity>('critica');
  const [description, setDescription] = useState('Trecho de baixada com lamaçal profundo. Risco iminente de atolamento de composições carregadas de 74t.');
  const [reportedBy, setReportedBy] = useState('TR-401 (Claudinei Silveira)');
  const [detourActive, setDetourActive] = useState(true);
  const [suggestedDetourVicinal, setSuggestedDetourVicinal] = useState('Desvio Vicinal Carreador Alto (MG-V03-ALT)');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Localização baseada na vicinal
    const selectedRoad = VICINAL_ROADS.find(r => r.name === vicinalRoad) || VICINAL_ROADS[0];
    const coords = selectedRoad.coordinates[Math.floor(selectedRoad.coordinates.length / 2)] || [-19.8500, -48.1500];

    onSubmit({
      type,
      title,
      vicinalRoad,
      kmMarker,
      severity,
      description,
      reportedBy,
      coordinates: coords,
      detourActive,
      suggestedDetourVicinal: detourActive ? suggestedDetourVicinal : undefined,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden text-slate-100 my-8 animate-in zoom-in-95">
        
        {/* Cabeçalho */}
        <div className="flex items-center justify-between p-4 bg-slate-800/80 border-b border-slate-700">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-rose-500/20 text-rose-400 border border-rose-500/40">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                Reportar Alerta de Tráfego Rural CTT
              </h2>
              <p className="text-xs text-slate-400">
                Atoleiro, ponte danificada, chuva localizada ou bloqueio em estrada vicinal.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-300 mb-1">Tipo de Incidente</label>
              <select
                value={type}
                onChange={e => {
                  const val = e.target.value as IncidentType;
                  setType(val);
                  if (val === 'atoleiro') setTitle('Trecho de atoleiro na vicinal');
                  if (val === 'ponte_avariada') setTitle('Ponte com avaria ou prancha solta');
                  if (val === 'chuva_localizada') setTitle('Chuva torrencial localizada');
                  if (val === 'erosao_valeta') setTitle('Erosão ou valeta na pista');
                  if (val === 'porteira_fechada') setTitle('Porteira trancada ou gado na pista');
                  if (val === 'veiculo_parado') setTitle('Caminhão em pane mecânica na pista');
                }}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
              >
                <option value="atoleiro">Atoleiro / Lamaçal Profundo</option>
                <option value="ponte_avariada">Ponte de Madeira Danificada</option>
                <option value="chuva_localizada">Chuva Forte Localizada</option>
                <option value="erosao_valeta">Erosão / Valeta por Enxurrada</option>
                <option value="porteira_fechada">Porteira Fechada / Gado</option>
                <option value="veiculo_parado">Veículo Quebrado na Pista</option>
              </select>
            </div>

            <div>
              <label className="block text-xs text-slate-300 mb-1">Gravidade Operacional</label>
              <select
                value={severity}
                onChange={e => setSeverity(e.target.value as IncidentSeverity)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
              >
                <option value="critica">Crítica (Interdição / Risco Alto)</option>
                <option value="media">Média (Tráfego Lento 10 km/h)</option>
                <option value="baixa">Baixa (Atenção / Pista Úmida)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-300 mb-1">Título do Alerta</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-300 mb-1">Estrada Vicinal Afetada</label>
              <select
                value={vicinalRoad}
                onChange={e => setVicinalRoad(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
              >
                {VICINAL_ROADS.map(r => (
                  <option key={r.id} value={r.name}>
                    {r.name} ({r.code})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs text-slate-300 mb-1">Ponto Quilométrico / Marco</label>
              <input
                type="text"
                value={kmMarker}
                onChange={e => setKmMarker(e.target.value)}
                required
                placeholder="Ex: KM 14.8 ou Perto do Córrego"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-300 mb-1">Descrição Detalhada do Trecho</label>
            <textarea
              rows={3}
              value={description}
              onChange={e => setDescription(e.target.value)}
              required
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-300 mb-1">Reportado por (Prefixo ou Rádio)</label>
            <input
              type="text"
              value={reportedBy}
              onChange={e => setReportedBy(e.target.value)}
              required
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
            />
          </div>

          {/* Opção de Desvio Automático */}
          <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60 space-y-2">
            <label className="flex items-center gap-2 text-xs text-slate-200 cursor-pointer">
              <input
                type="checkbox"
                checked={detourActive}
                onChange={e => setDetourActive(e.target.checked)}
                className="rounded border-slate-600 text-emerald-600 focus:ring-0"
              />
              <span className="font-semibold text-emerald-400">
                Ativar Roteirização Automática de Desvio no Mapa
              </span>
            </label>

            {detourActive && (
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Estrada / Carreador Alternativo:</label>
                <input
                  type="text"
                  value={suggestedDetourVicinal}
                  onChange={e => setSuggestedDetourVicinal(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition shadow-lg shadow-rose-950"
            >
              Emitir Alerta COA
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

