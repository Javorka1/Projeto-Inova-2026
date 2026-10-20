import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Truck, MachineStatus } from '../../types';
import { FleetModal } from './FleetModal';
import { DeleteConfirmModal } from './DeleteConfirmModal';
import { 
  Truck as TruckIcon, 
  Plus, 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  Clock, 
  Fuel, 
  User, 
  Radio, 
  MapPin, 
  CheckCircle2, 
  AlertCircle, 
  Zap,
  Gauge
} from 'lucide-react';

export const FleetManagement: React.FC = () => {
  const { 
    trucks, 
    addTruck, 
    updateTruck, 
    deleteTruck, 
    setSelectedTruck, 
    setActiveTab 
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('todos');

  // Controle de Modais
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedTruckForAction, setSelectedTruckForAction] = useState<Truck | null>(null);

  // Filtragem
  const filteredTrucks = trucks.filter(truck => {
    const matchesSearch = 
      truck.prefix.toLowerCase().includes(searchTerm.toLowerCase()) ||
      truck.plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      truck.driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      truck.model.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'todos' || truck.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: MachineStatus) => {
    switch (status) {
      case 'em_transito_vicinal':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-950/80 text-emerald-400 border border-emerald-500/40">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Em Trânsito Vicinal
          </span>
        );
      case 'fila_virtual_jit':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-amber-950/80 text-amber-400 border border-amber-500/40">
            <Gauge className="w-3 h-3 text-amber-400" />
            Fila Virtual JIT
          </span>
        );
      case 'descarregando_moega':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-blue-950/80 text-blue-400 border border-blue-500/40">
            <CheckCircle2 className="w-3 h-3 text-blue-400" />
            Descarregando Moega
          </span>
        );
      case 'em_carregamento':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-purple-950/80 text-purple-400 border border-purple-500/40">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
            No Talhão / Transbordo
          </span>
        );
      case 'manutencao':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-rose-950/80 text-rose-400 border border-rose-500/40">
            <AlertCircle className="w-3 h-3 text-rose-400" />
            Oficina / Manutenção
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-800 text-slate-300 border border-slate-700">
            Disponível Pátio
          </span>
        );
    }
  };

  const handleEditClick = (truck: Truck, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedTruckForAction(truck);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (truck: Truck, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedTruckForAction(truck);
    setIsDeleteModalOpen(true);
  };

  const handleViewOnMap = (truck: Truck, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedTruck(truck);
    setActiveTab('map');
  };

  return (
    <div className="p-4 space-y-4 max-w-7xl mx-auto text-slate-100">
      
      {/* Cabeçalho da Seção de Frotas */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-slate-900/90 border border-slate-800 p-4 rounded-2xl shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <TruckIcon className="w-5 h-5 text-emerald-400" />
              Gestão de Frota e Motoristas CTT
            </h2>
            <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-700/50 text-xs font-mono font-semibold">
              {trucks.length} composições
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Monitoramento em tempo real de rodotrens, tacógrafo de jornada (Lei 13.103/15) e alocação de motoristas nas frentes de colheita.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-lg shadow-emerald-950/60 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Cadastrar Caminhão</span>
        </button>
      </div>

      {/* Barra de Filtros e Busca */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 bg-slate-900/60 border border-slate-800 p-3 rounded-xl">
        {/* Barra de Pesquisa */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por prefixo, motorista ou placa..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Abas Rápidas de Filtro de Status */}
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto text-xs">
          {[
            { id: 'todos', label: 'Todos' },
            { id: 'em_transito_vicinal', label: 'Em Trânsito' },
            { id: 'fila_virtual_jit', label: 'Fila Virtual JIT' },
            { id: 'descarregando_moega', label: 'Na Moega' },
            { id: 'em_carregamento', label: 'No Talhão' },
            { id: 'manutencao', label: 'Manutenção' },
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setStatusFilter(f.id)}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                statusFilter === f.id
                  ? 'bg-emerald-600 text-white font-semibold'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tabela de Frotas e Motoristas */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-200">
            <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider text-[11px] border-b border-slate-800 font-semibold">
              <tr>
                <th className="py-3 px-4">Veículo & Composição</th>
                <th className="py-3 px-4">Motorista Alocado</th>
                <th className="py-3 px-4">Jornada / Tacógrafo</th>
                <th className="py-3 px-4">Status CTT</th>
                <th className="py-3 px-4">Modulação JIT</th>
                <th className="py-3 px-4">Carga & Combustível</th>
                <th className="py-3 px-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredTrucks.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    Nenhum caminhão encontrado com os filtros selecionados.
                  </td>
                </tr>
              ) : (
                filteredTrucks.map(truck => (
                  <tr
                    key={truck.id}
                    onClick={() => {
                      setSelectedTruck(truck);
                      setActiveTab('map');
                    }}
                    className="hover:bg-slate-800/50 transition cursor-pointer group"
                  >
                    {/* Veículo & Prefixo */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center font-mono font-bold text-emerald-400 shrink-0">
                          {truck.prefix}
                        </div>
                        <div>
                          <div className="font-semibold text-white group-hover:text-emerald-300 transition">
                            {truck.model}
                          </div>
                          <div className="text-[11px] text-slate-400 font-mono">
                            Placa: <strong className="text-slate-200">{truck.plate}</strong> • {truck.capacityTons}t
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Motorista Alocado */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={truck.driver.photoUrl}
                          alt={truck.driver.name}
                          className="w-8 h-8 rounded-full object-cover border border-slate-700 shrink-0"
                        />
                        <div>
                          <div className="font-medium text-slate-100">{truck.driver.name}</div>
                          <div className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                            <Radio className="w-3 h-3 text-slate-500" />
                            <span>{truck.driver.radioChannel}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Jornada / Tacógrafo (Lei 13.103/15) */}
                    <td className="py-3 px-4">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-slate-400">Turno Hoje:</span>
                          <span className="font-mono font-bold text-slate-200">
                            {truck.driver.shiftHours.toFixed(1)}h / 8.0h
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-slate-400">Direção Contínua:</span>
                          <span className={`font-mono font-bold ${
                            truck.driver.continuousDrivingHours > 3.0 ? 'text-amber-400' : 'text-emerald-400'
                          }`}>
                            {truck.driver.continuousDrivingHours.toFixed(1)}h / 4.0h
                          </span>
                        </div>
                        <div className="w-28 bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              truck.driver.shiftHours > 7.0 ? 'bg-amber-500' : 'bg-emerald-500'
                            }`}
                            style={{ width: `${Math.min(100, (truck.driver.shiftHours / 8.0) * 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>

                    {/* Status Operacional */}
                    <td className="py-3 px-4">
                      {getStatusBadge(truck.status)}
                    </td>

                    {/* Modulação JIT (Velocidade Recomendada vs Atual) */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="font-mono">
                          <div className="text-slate-400 text-[10px]">Atual vs Alvo:</div>
                          <div className="text-xs font-bold text-white">
                            {truck.speedCurrentKmH} km/h ➔{' '}
                            <span className="text-amber-400">{truck.speedRecommendedKmH} km/h</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Carga & Combustível */}
                    <td className="py-3 px-4 font-mono">
                      <div className="text-white font-bold text-xs">
                        {truck.currentLoadTons} t <span className="text-slate-400 text-[11px]">({((truck.currentLoadTons / truck.capacityTons) * 100).toFixed(0)}%)</span>
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <Fuel className="w-3 h-3 text-emerald-400" />
                        <span>{truck.fuelLevelPercent}% ({truck.fuelConsumptionLPerH} L/h)</span>
                      </div>
                    </td>

                    {/* Ações */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={e => handleViewOnMap(truck, e)}
                          title="Localizar no Mapa"
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-emerald-600/20 hover:text-emerald-400 text-slate-300 transition"
                        >
                          <MapPin className="w-4 h-4" />
                        </button>
                        <button
                          onClick={e => handleEditClick(truck, e)}
                          title="Editar Registro"
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={e => handleDeleteClick(truck, e)}
                          title="Remover Caminhão"
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-600/20 hover:text-rose-400 text-slate-300 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modais de Ação */}
      <FleetModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={addTruck}
      />

      <FleetModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedTruckForAction(null);
        }}
        onSave={updatedData => {
          if (selectedTruckForAction) {
            updateTruck(selectedTruckForAction.id, updatedData);
          }
        }}
        truckToEdit={selectedTruckForAction}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedTruckForAction(null);
        }}
        onConfirm={() => {
          if (selectedTruckForAction) {
            deleteTruck(selectedTruckForAction.id);
          }
        }}
        truck={selectedTruckForAction}
      />

    </div>
  );
};

