import React, { useState, useEffect } from 'react';
import { Truck, VehicleType, MachineStatus } from '../../types';
import { X, Truck as TruckIcon, User, Clock, Fuel, Shield } from 'lucide-react';

interface FleetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (truckData: any) => void;
  truckToEdit?: Truck | null;
}

export const FleetModal: React.FC<FleetModalProps> = ({
  isOpen,
  onClose,
  onSave,
  truckToEdit,
}) => {
  const [prefix, setPrefix] = useState('');
  const [plate, setPlate] = useState('');
  const [model, setModel] = useState('Scania R540 6x4 (Rodotrem 9 Eixos)');
  const [type, setType] = useState<VehicleType>('rodotrem_9eixos');
  const [capacityTons, setCapacityTons] = useState(74);
  const [currentLoadTons, setCurrentLoadTons] = useState(0);
  const [status, setStatus] = useState<MachineStatus>('em_transito_vicinal');
  const [fuelLevelPercent, setFuelLevelPercent] = useState(85);
  const [fuelConsumptionLPerH, setFuelConsumptionLPerH] = useState(28.0);
  const [speedCurrentKmH, setSpeedCurrentKmH] = useState(35);
  const [speedRecommendedKmH, setSpeedRecommendedKmH] = useState(35);

  // Motorista
  const [driverName, setDriverName] = useState('');
  const [driverRegistration, setDriverRegistration] = useState('');
  const [driverCnh, setDriverCnh] = useState('');
  const [shiftHours, setShiftHours] = useState(3.5);
  const [continuousDrivingHours, setContinuousDrivingHours] = useState(1.5);
  const [radioChannel, setRadioChannel] = useState('CH-03 Vicinal Sul');
  const [driverPhone, setDriverPhone] = useState('(34) 998');

  useEffect(() => {
    if (truckToEdit) {
      setPrefix(truckToEdit.prefix);
      setPlate(truckToEdit.plate);
      setModel(truckToEdit.model);
      setType(truckToEdit.type);
      setCapacityTons(truckToEdit.capacityTons);
      setCurrentLoadTons(truckToEdit.currentLoadTons);
      setStatus(truckToEdit.status);
      setFuelLevelPercent(truckToEdit.fuelLevelPercent);
      setFuelConsumptionLPerH(truckToEdit.fuelConsumptionLPerH);
      setSpeedCurrentKmH(truckToEdit.speedCurrentKmH);
      setSpeedRecommendedKmH(truckToEdit.speedRecommendedKmH);

      setDriverName(truckToEdit.driver.name);
      setDriverRegistration(truckToEdit.driver.registration);
      setDriverCnh(truckToEdit.driver.cnh);
      setShiftHours(truckToEdit.driver.shiftHours);
      setContinuousDrivingHours(truckToEdit.driver.continuousDrivingHours);
      setRadioChannel(truckToEdit.driver.radioChannel);
      setDriverPhone(truckToEdit.driver.phone);
    } else {
      // Valores padrão para novo
      setPrefix('TR-' + Math.floor(100 + Math.random() * 900));
      setPlate('BRA' + Math.floor(1 + Math.random() * 9) + 'E' + Math.floor(10 + Math.random() * 89));
      setModel('Scania R540 6x4 (Rodotrem 9 Eixos)');
      setType('rodotrem_9eixos');
      setCapacityTons(74);
      setCurrentLoadTons(0);
      setStatus('em_transito_vicinal');
      setFuelLevelPercent(90);
      setFuelConsumptionLPerH(25.0);
      setSpeedCurrentKmH(35);
      setSpeedRecommendedKmH(35);

      setDriverName('Novo Motorista CTT');
      setDriverRegistration('MAT-' + Math.floor(1000 + Math.random() * 9000));
      setDriverCnh('0' + Math.floor(1000000000 + Math.random() * 9000000000) + ' - E');
      setShiftHours(2.0);
      setContinuousDrivingHours(1.0);
      setRadioChannel('CH-03 Vicinal Sul');
      setDriverPhone('(34) 99820-1100');
    }
  }, [truckToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      prefix,
      plate,
      model,
      type,
      capacityTons: Number(capacityTons),
      currentLoadTons: Number(currentLoadTons),
      status,
      fuelLevelPercent: Number(fuelLevelPercent),
      fuelConsumptionLPerH: Number(fuelConsumptionLPerH),
      speedCurrentKmH: Number(speedCurrentKmH),
      speedRecommendedKmH: Number(speedRecommendedKmH),
      coordinates: truckToEdit ? truckToEdit.coordinates : ([-19.8400, -48.1200] as [number, number]),
      directionAngle: truckToEdit ? truckToEdit.directionAngle : 45,
      etaMinutes: truckToEdit ? truckToEdit.etaMinutes : 20,
      scheduledMoegaSlot: truckToEdit ? truckToEdit.scheduledMoegaSlot : '15:30',
      distanceToDestKm: truckToEdit ? truckToEdit.distanceToDestKm : 12.0,
      driver: {
        id: truckToEdit ? truckToEdit.driver.id : 'drv-' + Math.random().toString(36).substring(2, 7),
        name: driverName,
        registration: driverRegistration,
        cnh: driverCnh,
        shiftHours: Number(shiftHours),
        maxAllowedHours: 8.0,
        continuousDrivingHours: Number(continuousDrivingHours),
        radioChannel,
        phone: driverPhone,
        photoUrl: truckToEdit?.driver?.photoUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      }
    };

    onSave(payload);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden text-slate-100 my-8">
        
        {/* Cabeçalho do Modal */}
        <div className="flex items-center justify-between p-4 bg-slate-800/80 border-b border-slate-700">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
              <TruckIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                {truckToEdit ? `Editar Caminhão ${truckToEdit.prefix}` : 'Cadastrar Novo Caminhão de Transporte CTT'}
              </h2>
              <p className="text-xs text-slate-400">
                Identificação veicular, alocação de motorista e jornada de tacógrafo.
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
        <form onSubmit={handleSubmit} className="p-5 space-y-5 max-h-[75vh] overflow-y-auto">
          
          {/* Seção 1: Dados do Veículo */}
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2.5 flex items-center gap-1.5">
              <Shield className="w-4 h-4" />
              <span>1. Identificação do Equipamento</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs text-slate-300 mb-1">Prefixo Operacional *</label>
                <input
                  type="text"
                  value={prefix}
                  onChange={e => setPrefix(e.target.value)}
                  required
                  placeholder="Ex: TR-409"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-300 mb-1">Placa do Cavalo *</label>
                <input
                  type="text"
                  value={plate}
                  onChange={e => setPlate(e.target.value)}
                  required
                  placeholder="Ex: RTA-9B21"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-300 mb-1">Tipo de Composição</label>
                <select
                  value={type}
                  onChange={e => setType(e.target.value as VehicleType)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="rodotrem_9eixos">Rodotrem 9 Eixos (74t)</option>
                  <option value="treminhao_cana">Treminhão Canavieiro (74t)</option>
                  <option value="bitrem_articulado">Bitrem 7 Eixos (57t)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
              <div>
                <label className="block text-xs text-slate-300 mb-1">Modelo do Caminhão</label>
                <input
                  type="text"
                  value={model}
                  onChange={e => setModel(e.target.value)}
                  required
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-300 mb-1">Status Operacional CTT</label>
                <select
                  value={status}
                  onChange={e => setStatus(e.target.value as MachineStatus)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="em_transito_vicinal">Em Trânsito Vicinal</option>
                  <option value="fila_virtual_jit">Fila Virtual JIT (Modulando)</option>
                  <option value="em_carregamento">Em Carregamento no Talhão</option>
                  <option value="descarregando_moega">Descarregando na Moega</option>
                  <option value="disponivel_patio">Disponível no Pátio</option>
                  <option value="manutencao">Manutenção / Oficina</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
              <div>
                <label className="block text-xs text-slate-300 mb-1">Capacidade (Tons)</label>
                <input
                  type="number"
                  value={capacityTons}
                  onChange={e => setCapacityTons(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-300 mb-1">Carga Atual (Tons)</label>
                <input
                  type="number"
                  value={currentLoadTons}
                  onChange={e => setCurrentLoadTons(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-300 mb-1">Consumo Telemetria (L/h)</label>
                <input
                  type="number"
                  step="0.1"
                  value={fuelConsumptionLPerH}
                  onChange={e => setFuelConsumptionLPerH(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>
            </div>
          </div>

          {/* Seção 2: Dados do Motorista & Tacógrafo */}
          <div className="pt-4 border-t border-slate-800">
            <div className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-2.5 flex items-center gap-1.5">
              <User className="w-4 h-4" />
              <span>2. Motorista Alocado e Jornada de Trabalho</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs text-slate-300 mb-1">Nome Completo do Motorista *</label>
                <input
                  type="text"
                  value={driverName}
                  onChange={e => setDriverName(e.target.value)}
                  required
                  placeholder="Nome do condutor"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-300 mb-1">Matrícula Funcional</label>
                <input
                  type="text"
                  value={driverRegistration}
                  onChange={e => setDriverRegistration(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
              <div>
                <label className="block text-xs text-slate-300 mb-1">CNH (Categoria E)</label>
                <input
                  type="text"
                  value={driverCnh}
                  onChange={e => setDriverCnh(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-300 mb-1">Canal Rádio VHF</label>
                <input
                  type="text"
                  value={radioChannel}
                  onChange={e => setRadioChannel(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-300 mb-1">Contato / Celular</label>
                <input
                  type="text"
                  value={driverPhone}
                  onChange={e => setDriverPhone(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3 p-3 rounded-lg bg-slate-800/40 border border-slate-800">
              <div>
                <label className="block text-xs text-slate-300 mb-1 flex items-center justify-between">
                  <span>Jornada Total Hoje (Horas)</span>
                  <span className="font-mono text-slate-400">Limite: 8h</span>
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={shiftHours}
                  onChange={e => setShiftHours(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-300 mb-1 flex items-center justify-between">
                  <span>Direção Contínua (Horas)</span>
                  <span className="font-mono text-amber-400">Alerta se &gt; 4h</span>
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={continuousDrivingHours}
                  onChange={e => setContinuousDrivingHours(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>
            </div>
          </div>

          {/* Botões do Rodapé */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-lg shadow-emerald-950"
            >
              {truckToEdit ? 'Salvar Alterações' : 'Cadastrar Caminhão'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

