// Tipos e Interfaces para o Sistema COA CTT (Logística Agrícola)

export type MachineStatus = 
  | 'em_carregamento'       // No talhão recebendo transbordo
  | 'em_transito_vicinal'   // Em deslocamento na estrada de terra
  | 'fila_virtual_jit'      // Modulando velocidade JIT rumo à moega
  | 'descarregando_moega'   // No tombador/moega da usina
  | 'manutencao'            // Na oficina da usina ou pátio de campo
  | 'disponivel_patio';     // Vazio aguardando despacho

export type VehicleType = 
  | 'rodotrem_9eixos'       // Rodotrem canavieiro/graneleiro 74t
  | 'treminhao_cana'        // Treminhão 6x4 74t
  | 'bitrem_articulado'     // Bitrem 7 eixos 57t
  | 'trator_transbordo'     // Trator com transbordo de 14t a 20t
  | 'colhedora_esteira';    // Colhedora de cana/grãos no talhão

export interface Driver {
  id: string;
  name: string;
  cnh: string;
  registration: string;     // Matrícula funcional
  shiftHours: number;       // Horas trabalhadas na jornada atual
  maxAllowedHours: number;  // Limite da Lei 13.103/15 (ex: 8h ou 10h com prorrogação)
  continuousDrivingHours: number; // Horas de volante sem parada (alerta se > 4h)
  photoUrl?: string;
  radioChannel: string;     // Canal de rádio VHF (ex: "CH-04 Vicinal Sul")
  phone: string;
}

export interface Truck {
  id: string;
  plate: string;
  prefix: string;           // Prefixo COA (ex: TR-401)
  model: string;            // Ex: Scania R540 6x4 ou Volvo FH540
  type: VehicleType;
  capacityTons: number;     // Capacidade nominal em toneladas
  currentLoadTons: number;  // Carga atual
  driver: Driver;
  status: MachineStatus;
  currentFieldId?: string;  // Talhão de origem
  targetMoegaId?: string;   // Moega de destino (ex: Moega 01)
  fuelLevelPercent: number; // Nível do tanque (%)
  fuelConsumptionLPerH: number; // Consumo instantâneo L/h
  speedCurrentKmH: number;  // Velocidade atual GPS
  speedRecommendedKmH: number; // Velocidade modulada JIT recomendada
  coordinates: [number, number]; // [lat, lng]
  directionAngle: number;   // Ângulo de rumo (graus)
  etaMinutes: number;       // Tempo estimado até a moega
  scheduledMoegaSlot?: string; // Horário reservado na moega (ex: "15:42")
  distanceToDestKm: number; // Distância restante
  lastTelemetryUpdate: string; // ISO string
}

export interface Harvester {
  id: string;
  prefix: string;           // Ex: COLH-08
  model: string;            // Ex: John Deere CH570 / Case IH A8810
  fieldId: string;
  operatorName: string;
  cuttingSpeedKmH: number;  // Velocidade de corte (ex: 4.8 km/h)
  tonsCutPerHour: number;   // Taxa de corte atual (ex: 85 t/h)
  status: 'cortando' | 'aguardando_transbordo' | 'manutencao_faca';
  coordinates: [number, number];
}

export interface Transshipment {
  id: string;
  prefix: string;           // Ex: TRB-14
  tractorModel: string;     // Ex: John Deere 7230J
  operatorName: string;
  capacityTons: number;
  currentLoadTons: number;
  status: 'carregando_com_colhedora' | 'transbordando_rodotrem' | 'em_espera';
  coordinates: [number, number];
}

export interface FieldTalhao {
  id: string;
  name: string;             // Ex: Talhão 402 - Fazenda Santa Maria
  farmName: string;
  cropType: 'Cana-de-açúcar (3º Corte)' | 'Soja Safra' | 'Milho Safrinha';
  areaHectares: number;
  predictedYieldTonsPerHa: number; // Produtividade estimada (ex: 94 t/ha)
  totalProductionEstimatedTons: number;
  harvestedPercentage: number;
  coordinates: [number, number][]; // Polígono do talhão
  centerCoordinates: [number, number];
  primaryVicinalRoad: string; // Estrada vicinal de escoamento
  distanceToPlantKm: number;
}

export interface Moega {
  id: string;
  name: string;             // Ex: Moega 01 (Tombador Trilateral)
  maxCapacityTonsPerHour: number; // Vazão de moagem (ex: 900 t/h)
  currentTruckPrefix?: string;
  unloadingTimeAverageMinutes: number; // Tempo médio de descarga (ex: 12 min)
  status: 'operando_normal' | 'manutencao' | 'em_limpeza';
  queueCount: number;       // Caminhões aguardando fisicamente no pátio (meta = 0 a 1)
  virtualQueueCount: number; // Caminhões escalonados JIT na estrada
  nextAvailableSlot: string; // Próximo horário vago (ex: "15:24")
}

export type IncidentSeverity = 'baixa' | 'media' | 'critica';

export type IncidentType = 
  | 'atoleiro'              // Pista com barro escorregadio / caminhão patinando
  | 'chuva_localizada'      // Pancada de chuva na frente de corte
  | 'ponte_avariada'        // Ponte de madeira com pranchas soltas ou avaria
  | 'erosao_valeta'         // Valeta aberta por enxurrada na pista
  | 'poeira_densa'          // Baixa visibilidade em trecho de carreador
  | 'porteira_fechada'      // Porteira trancada ou gado solto na vicinal
  | 'veiculo_parado';       // Pane mecânica bloqueando meia pista

export interface TrafficIncident {
  id: string;
  type: IncidentType;
  title: string;
  description: string;
  vicinalRoad: string;      // Ex: Vicinal MG-V03 (Estrada do Córrego Fundo)
  kmMarker: string;         // Ex: KM 14.8
  coordinates: [number, number];
  severity: IncidentSeverity;
  reportedBy: string;       // Ex: "TR-402 (Marcos Silva)" ou "COA Central"
  reportedAt: string;       // ISO string
  detourActive: boolean;    // Se o desvio automático foi acionado
  suggestedDetourVicinal?: string; // Rota alternativa (ex: "Vicinal das Palmeiras")
  isResolved: boolean;
}

export interface CttKpis {
  dieselLitrosPerTon: number;        // Eficiência energética L/t
  dieselTargetLitrosPerTon: number;  // Meta L/t (ex: 1.50)
  totalCycleTimeMinutes: number;     // Lead Time total CTT (ex: 138 min)
  targetCycleTimeMinutes: number;    // Meta CTT (ex: 145 min)
  idlingPercentage: number;          // Índice de ociosidade com motor ligado (%)
  targetIdlingPercentage: number;    // Meta de ociosidade (%)
  tonsDeliveredToday: number;        // Toneladas entregues no dia
  targetTonsToday: number;           // Meta diária de moagem
  activeTrucks: number;              // Caminhões em giro
  jitSavingsDieselLiters: number;    // Litros poupados com JIT hoje
  hoursWithoutIncidents: number;     // Horas de fluxo ininterrupto
}

export interface OfflineSyncStatus {
  isOnline: boolean;
  pendingSyncCount: number;
  lastSyncedAt: string;
  storageUsageKb: number;
}

