import { Truck, Harvester, Transshipment, FieldTalhao, Moega, TrafficIncident, CttKpis } from '../types';

// Usina Central de Operações Agrícolas (COA - Minas Gerais)
export const PLANT_COA = {
  name: 'Usina Vale do Grande - Unidade Triângulo Mineiro',
  locationName: 'Conceição das Alagoas / Uberaba - MG',
  coordinates: [-19.8200, -48.1200] as [number, number],
  nominalCrushingCapacityTonsPerDay: 22000,
  currentCrushingRateTonsPerHour: 1850,
  operationalStatus: 'Operando em Capacidade Plena',
};

export const INITIAL_MOEGAS: Moega[] = [
  {
    id: 'moega-01',
    name: 'Moega 01 - Tombador Hidráulico A',
    maxCapacityTonsPerHour: 950,
    currentTruckPrefix: 'TR-402',
    unloadingTimeAverageMinutes: 11,
    status: 'operando_normal',
    queueCount: 1,
    virtualQueueCount: 3,
    nextAvailableSlot: '15:15',
  },
  {
    id: 'moega-02',
    name: 'Moega 02 - Tombador Hidráulico B',
    maxCapacityTonsPerHour: 900,
    currentTruckPrefix: 'TR-308',
    unloadingTimeAverageMinutes: 12,
    status: 'operando_normal',
    queueCount: 0,
    virtualQueueCount: 2,
    nextAvailableSlot: '15:22',
  },
  {
    id: 'moega-03',
    name: 'Moega 03 - Descarga Graneleira Secundária',
    maxCapacityTonsPerHour: 650,
    currentTruckPrefix: undefined,
    unloadingTimeAverageMinutes: 15,
    status: 'operando_normal',
    queueCount: 0,
    virtualQueueCount: 1,
    nextAvailableSlot: '15:08',
  }
];

export const INITIAL_TALHOES: FieldTalhao[] = [
  {
    id: 'talhao-402',
    name: 'Talhão 402 - Fz. Santa Maria',
    farmName: 'Fazenda Santa Maria (Setor Sul)',
    cropType: 'Cana-de-açúcar (3º Corte)',
    areaHectares: 142.5,
    predictedYieldTonsPerHa: 96.8,
    totalProductionEstimatedTons: 13794,
    harvestedPercentage: 68,
    centerCoordinates: [-19.8950, -48.1950],
    coordinates: [
      [-19.8880, -48.2030],
      [-19.8860, -48.1880],
      [-19.9020, -48.1850],
      [-19.9040, -48.2010],
      [-19.8880, -48.2030]
    ],
    primaryVicinalRoad: 'Vicinal MG-V03 (Córrego Fundo)',
    distanceToPlantKm: 16.4,
  },
  {
    id: 'talhao-318',
    name: 'Talhão 318 - Fz. Barreiro Alto',
    farmName: 'Fazenda Barreiro Alto (Setor Norte)',
    cropType: 'Cana-de-açúcar (3º Corte)',
    areaHectares: 185.0,
    predictedYieldTonsPerHa: 104.2,
    totalProductionEstimatedTons: 19277,
    harvestedPercentage: 42,
    centerCoordinates: [-19.7600, -48.0650],
    coordinates: [
      [-19.7520, -48.0740],
      [-19.7500, -48.0560],
      [-19.7680, -48.0540],
      [-19.7700, -48.0720],
      [-19.7520, -48.0740]
    ],
    primaryVicinalRoad: 'Vicinal das Palmeiras (MG-V01)',
    distanceToPlantKm: 13.8,
  },
  {
    id: 'talhao-512',
    name: 'Talhão 512 - Fz. Alvorada',
    farmName: 'Fazenda Alvorada (Setor Leste)',
    cropType: 'Cana-de-açúcar (3º Corte)',
    areaHectares: 120.0,
    predictedYieldTonsPerHa: 88.5,
    totalProductionEstimatedTons: 10620,
    harvestedPercentage: 81,
    centerCoordinates: [-19.8700, -48.0500],
    coordinates: [
      [-19.8620, -48.0590],
      [-19.8600, -48.0420],
      [-19.8780, -48.0410],
      [-19.8790, -48.0580],
      [-19.8620, -48.0590]
    ],
    primaryVicinalRoad: 'Vicinal dos Buritis (MG-V07)',
    distanceToPlantKm: 17.9,
  },
  {
    id: 'talhao-205',
    name: 'Talhão 205 - Fz. Boa Vista',
    farmName: 'Fazenda Boa Vista (Setor Sudoeste)',
    cropType: 'Cana-de-açúcar (3º Corte)',
    areaHectares: 160.0,
    predictedYieldTonsPerHa: 92.0,
    totalProductionEstimatedTons: 14720,
    harvestedPercentage: 25,
    centerCoordinates: [-19.9300, -48.1400],
    coordinates: [
      [-19.9210, -48.1500],
      [-19.9200, -48.1300],
      [-19.9390, -48.1290],
      [-19.9400, -48.1480],
      [-19.9210, -48.1500]
    ],
    primaryVicinalRoad: 'Vicinal da Estiva (MG-V04)',
    distanceToPlantKm: 22.1,
  }
];

// Estradas Vicinais Não Pavimentadas (Terra e Cascalho) em Minas Gerais
export interface VicinalRoad {
  id: string;
  name: string;
  code: string;
  surface: 'Terra Cascalhada' | 'Terra Argilosa' | 'Cascalho Batido';
  speedLimitKmH: number;
  condition: 'Ótima' | 'Atenção (Costela de Vaca)' | 'Crítica (Barro/Atoleiro)';
  coordinates: [number, number][];
}

export const VICINAL_ROADS: VicinalRoad[] = [
  {
    id: 'vic-01',
    name: 'Vicinal das Palmeiras',
    code: 'MG-V01',
    surface: 'Terra Cascalhada',
    speedLimitKmH: 45,
    condition: 'Ótima',
    coordinates: [
      [-19.7580, -48.0670],
      [-19.7720, -48.0800],
      [-19.7890, -48.0980],
      [-19.8050, -48.1120],
      [-19.8200, -48.1200]
    ]
  },
  {
    id: 'vic-03',
    name: 'Vicinal do Córrego Fundo',
    code: 'MG-V03',
    surface: 'Terra Argilosa',
    speedLimitKmH: 35,
    condition: 'Crítica (Barro/Atoleiro)',
    coordinates: [
      [-19.8930, -48.1930],
      [-19.8780, -48.1750],
      [-19.8620, -48.1600],
      [-19.8450, -48.1400],
      [-19.8300, -48.1280],
      [-19.8200, -48.1200]
    ]
  },
  {
    id: 'vic-03-detour',
    name: 'Desvio Vicinal Carreador Alto (Alternativo)',
    code: 'MG-V03-ALT',
    surface: 'Terra Cascalhada',
    speedLimitKmH: 40,
    condition: 'Ótima',
    coordinates: [
      [-19.8930, -48.1930],
      [-19.8820, -48.2100],
      [-19.8550, -48.1900],
      [-19.8350, -48.1550],
      [-19.8200, -48.1200]
    ]
  },
  {
    id: 'vic-04',
    name: 'Vicinal da Estiva e Ponte Velha',
    code: 'MG-V04',
    surface: 'Terra Cascalhada',
    speedLimitKmH: 40,
    condition: 'Atenção (Costela de Vaca)',
    coordinates: [
      [-19.9280, -48.1380],
      [-19.9050, -48.1340],
      [-19.8750, -48.1300],
      [-19.8480, -48.1240],
      [-19.8200, -48.1200]
    ]
  },
  {
    id: 'vic-07',
    name: 'Vicinal dos Buritis',
    code: 'MG-V07',
    surface: 'Terra Cascalhada',
    speedLimitKmH: 42,
    condition: 'Ótima',
    coordinates: [
      [-19.8680, -48.0520],
      [-19.8550, -48.0720],
      [-19.8400, -48.0950],
      [-19.8280, -48.1100],
      [-19.8200, -48.1200]
    ]
  }
];

export const INITIAL_TRUCKS: Truck[] = [
  {
    id: 'truck-401',
    prefix: 'TR-401',
    plate: 'RTA-9B21',
    model: 'Scania R540 6x4 (Rodotrem 9 Eixos)',
    type: 'rodotrem_9eixos',
    capacityTons: 74,
    currentLoadTons: 72.8,
    status: 'fila_virtual_jit',
    currentFieldId: 'talhao-402',
    targetMoegaId: 'moega-01',
    fuelLevelPercent: 78,
    fuelConsumptionLPerH: 26.4,
    speedCurrentKmH: 28,
    speedRecommendedKmH: 28, // Modulação recomendada JIT
    coordinates: [-19.8520, -48.1480],
    directionAngle: 42,
    etaMinutes: 14,
    scheduledMoegaSlot: '15:15',
    distanceToDestKm: 6.2,
    lastTelemetryUpdate: new Date().toISOString(),
    driver: {
      id: 'drv-01',
      name: 'Claudinei Silveira',
      cnh: '04918274610 - E',
      registration: 'MAT-8841',
      shiftHours: 5.2,
      maxAllowedHours: 8.0,
      continuousDrivingHours: 1.8,
      radioChannel: 'CH-03 Vicinal Sul',
      phone: '(34) 99872-4411',
      photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    }
  },
  {
    id: 'truck-402',
    prefix: 'TR-402',
    plate: 'RKT-4C88',
    model: 'Volvo FH540 6x4 (Treminhão Canavieiro)',
    type: 'treminhao_cana',
    capacityTons: 74,
    currentLoadTons: 74.0,
    status: 'descarregando_moega',
    currentFieldId: 'talhao-402',
    targetMoegaId: 'moega-01',
    fuelLevelPercent: 62,
    fuelConsumptionLPerH: 8.2, // Em marcha lenta na descarga
    speedCurrentKmH: 0,
    speedRecommendedKmH: 0,
    coordinates: [-19.8192, -48.1190],
    directionAngle: 0,
    etaMinutes: 0,
    scheduledMoegaSlot: '15:00',
    distanceToDestKm: 0.0,
    lastTelemetryUpdate: new Date().toISOString(),
    driver: {
      id: 'drv-02',
      name: 'Valdemar Ribeiro',
      cnh: '02819472655 - E',
      registration: 'MAT-7120',
      shiftHours: 6.8,
      maxAllowedHours: 8.0,
      continuousDrivingHours: 2.3,
      radioChannel: 'CH-01 Pátio/Moega',
      phone: '(34) 99763-9122',
      photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    }
  },
  {
    id: 'truck-308',
    prefix: 'TR-308',
    plate: 'GYE-7H45',
    model: 'Mercedes-Benz Actros 2651 6x4',
    type: 'rodotrem_9eixos',
    capacityTons: 74,
    currentLoadTons: 73.5,
    status: 'descarregando_moega',
    currentFieldId: 'talhao-318',
    targetMoegaId: 'moega-02',
    fuelLevelPercent: 84,
    fuelConsumptionLPerH: 7.9,
    speedCurrentKmH: 0,
    speedRecommendedKmH: 0,
    coordinates: [-19.8198, -48.1205],
    directionAngle: 180,
    etaMinutes: 0,
    scheduledMoegaSlot: '15:05',
    distanceToDestKm: 0.0,
    lastTelemetryUpdate: new Date().toISOString(),
    driver: {
      id: 'drv-03',
      name: 'Marcio Mendonça',
      cnh: '03728491022 - E',
      registration: 'MAT-6634',
      shiftHours: 3.4,
      maxAllowedHours: 8.0,
      continuousDrivingHours: 1.1,
      radioChannel: 'CH-01 Pátio/Moega',
      phone: '(34) 99912-7801',
      photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    }
  },
  {
    id: 'truck-514',
    prefix: 'TR-514',
    plate: 'BXP-3A19',
    model: 'DAF XF 530 6x4 (Rodotrem)',
    type: 'rodotrem_9eixos',
    capacityTons: 74,
    currentLoadTons: 71.2,
    status: 'em_transito_vicinal',
    currentFieldId: 'talhao-512',
    targetMoegaId: 'moega-02',
    fuelLevelPercent: 55,
    fuelConsumptionLPerH: 34.1,
    speedCurrentKmH: 38,
    speedRecommendedKmH: 32, // Deve diminuir para não formar fila
    coordinates: [-19.8450, -48.0850],
    directionAngle: 310,
    etaMinutes: 19,
    scheduledMoegaSlot: '15:24',
    distanceToDestKm: 9.8,
    lastTelemetryUpdate: new Date().toISOString(),
    driver: {
      id: 'drv-04',
      name: 'Sebastião Gonzaga',
      cnh: '01849204918 - E',
      registration: 'MAT-5409',
      shiftHours: 7.1,
      maxAllowedHours: 8.0,
      continuousDrivingHours: 3.2,
      radioChannel: 'CH-04 Vicinal Leste',
      phone: '(34) 99654-2200',
      photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    }
  },
  {
    id: 'truck-315',
    prefix: 'TR-315',
    plate: 'OMN-8E33',
    model: 'Scania G450 6x4 (Bitrem 7 Eixos)',
    type: 'bitrem_articulado',
    capacityTons: 57,
    currentLoadTons: 0,
    status: 'em_transito_vicinal',
    currentFieldId: 'talhao-318',
    fuelLevelPercent: 91,
    fuelConsumptionLPerH: 22.0,
    speedCurrentKmH: 44,
    speedRecommendedKmH: 45,
    coordinates: [-19.7820, -48.0900],
    directionAngle: 30, // Retornando vazio para o talhão
    etaMinutes: 11,
    distanceToDestKm: 5.4,
    lastTelemetryUpdate: new Date().toISOString(),
    driver: {
      id: 'drv-05',
      name: 'José Carlos Peixoto',
      cnh: '05829104922 - E',
      registration: 'MAT-9218',
      shiftHours: 4.0,
      maxAllowedHours: 8.0,
      continuousDrivingHours: 1.5,
      radioChannel: 'CH-02 Vicinal Norte',
      phone: '(34) 99881-3099',
      photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    }
  },
  {
    id: 'truck-208',
    prefix: 'TR-208',
    plate: 'PUR-1F72',
    model: 'Volvo FH540 6x4 (Rodotrem)',
    type: 'rodotrem_9eixos',
    capacityTons: 74,
    currentLoadTons: 38.0, // Em abastecimento no carreador
    status: 'em_carregamento',
    currentFieldId: 'talhao-205',
    fuelLevelPercent: 69,
    fuelConsumptionLPerH: 9.5,
    speedCurrentKmH: 0,
    speedRecommendedKmH: 0,
    coordinates: [-19.9280, -48.1380],
    directionAngle: 90,
    etaMinutes: 45,
    distanceToDestKm: 22.1,
    lastTelemetryUpdate: new Date().toISOString(),
    driver: {
      id: 'drv-06',
      name: 'Ademir Fagundes',
      cnh: '09817263510 - E',
      registration: 'MAT-4390',
      shiftHours: 2.1,
      maxAllowedHours: 8.0,
      continuousDrivingHours: 0.8,
      radioChannel: 'CH-05 Frente Sudoeste',
      phone: '(34) 99711-6644',
      photoUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    }
  },
  {
    id: 'truck-110',
    prefix: 'TR-110',
    plate: 'HMA-5B12',
    model: 'Mercedes-Benz Axor 3344 6x4',
    type: 'treminhao_cana',
    capacityTons: 74,
    currentLoadTons: 0,
    status: 'manutencao',
    fuelLevelPercent: 40,
    fuelConsumptionLPerH: 0,
    speedCurrentKmH: 0,
    speedRecommendedKmH: 0,
    coordinates: [-19.8220, -48.1230],
    directionAngle: 0,
    etaMinutes: 0,
    distanceToDestKm: 0,
    lastTelemetryUpdate: new Date().toISOString(),
    driver: {
      id: 'drv-07',
      name: 'Geraldo Magela',
      cnh: '04719284619 - E',
      registration: 'MAT-3310',
      shiftHours: 1.0,
      maxAllowedHours: 8.0,
      continuousDrivingHours: 0,
      radioChannel: 'Oficina Central',
      phone: '(34) 99800-1122',
      photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    }
  }
];

export const INITIAL_HARVESTERS: Harvester[] = [
  {
    id: 'colh-08',
    prefix: 'COLH-08',
    model: 'John Deere CH570 (Corte de Base Duplo)',
    fieldId: 'talhao-402',
    operatorName: 'Antonio Carlos Faria',
    cuttingSpeedKmH: 5.2,
    tonsCutPerHour: 92,
    status: 'cortando',
    coordinates: [-19.8960, -48.1960],
  },
  {
    id: 'colh-12',
    prefix: 'COLH-12',
    model: 'Case IH Austoft A8810 Multirrow',
    fieldId: 'talhao-318',
    operatorName: 'Renato Vasconcelos',
    cuttingSpeedKmH: 4.8,
    tonsCutPerHour: 86,
    status: 'cortando',
    coordinates: [-19.7610, -48.0640],
  },
  {
    id: 'colh-04',
    prefix: 'COLH-04',
    model: 'John Deere CH570',
    fieldId: 'talhao-205',
    operatorName: 'Wilson Guimarães',
    cuttingSpeedKmH: 0.0,
    tonsCutPerHour: 0,
    status: 'aguardando_transbordo',
    coordinates: [-19.9290, -48.1390],
  }
];

export const INITIAL_TRANSSHIPMENTS: Transshipment[] = [
  {
    id: 'trb-14',
    prefix: 'TRB-14',
    tractorModel: 'John Deere 7230J + Transbordo 14t',
    operatorName: 'Luiz Fernando Silva',
    capacityTons: 14,
    currentLoadTons: 12.5,
    status: 'transbordando_rodotrem',
    coordinates: [-19.9285, -48.1385],
  },
  {
    id: 'trb-21',
    prefix: 'TRB-21',
    tractorModel: 'Case Magnum 260 + Transbordo 18t',
    operatorName: 'Evandro Rocha',
    capacityTons: 18,
    currentLoadTons: 6.0,
    status: 'carregando_com_colhedora',
    coordinates: [-19.8965, -48.1965],
  }
];

export const INITIAL_INCIDENTS: TrafficIncident[] = [
  {
    id: 'inc-01',
    type: 'atoleiro',
    title: 'Atoleiro Crítico no Trecho da Baixada',
    description: 'Chuva localizada acumulou água e formou lamaçal profundo. Risco de patinagem para rodotrens carregados.',
    vicinalRoad: 'Vicinal MG-V03 (Córrego Fundo)',
    kmMarker: 'KM 14.8',
    coordinates: [-19.8620, -48.1600],
    severity: 'critica',
    reportedBy: 'TR-401 (Claudinei)',
    reportedAt: '14:28',
    detourActive: true,
    suggestedDetourVicinal: 'Desvio Vicinal Carreador Alto (MG-V03-ALT)',
    isResolved: false,
  },
  {
    id: 'inc-02',
    type: 'ponte_avariada',
    title: 'Prancha Deslocada na Ponte do Ribeirão',
    description: 'Ponte de madeira com prancha de rolamento lateral solta. Tráfego em velocidade reduzida (10 km/h).',
    vicinalRoad: 'Vicinal da Estiva (MG-V04)',
    kmMarker: 'KM 08.2',
    coordinates: [-19.8750, -48.1300],
    severity: 'media',
    reportedBy: 'TR-208 (Ademir)',
    reportedAt: '13:50',
    detourActive: false,
    suggestedDetourVicinal: 'Sem desvio viável. Redução obrigatória para 10 km/h.',
    isResolved: false,
  },
  {
    id: 'inc-03',
    type: 'chuva_localizada',
    title: 'Precipitação Súbita de 22mm',
    description: 'Chuva torrencial na cabeceira da Fazenda Alvorada. Pista úmida mas ainda transitável com tração 6x4.',
    vicinalRoad: 'Vicinal dos Buritis (MG-V07)',
    kmMarker: 'KM 04.5',
    coordinates: [-19.8550, -48.0720],
    severity: 'baixa',
    reportedBy: 'TR-514 (Sebastião)',
    reportedAt: '14:05',
    detourActive: false,
    isResolved: false,
  }
];

export const INITIAL_KPIS: CttKpis = {
  dieselLitrosPerTon: 1.38,
  dieselTargetLitrosPerTon: 1.50,
  totalCycleTimeMinutes: 134,
  targetCycleTimeMinutes: 145,
  idlingPercentage: 3.2,
  targetIdlingPercentage: 5.0,
  tonsDeliveredToday: 14850,
  targetTonsToday: 22000,
  activeTrucks: 24,
  jitSavingsDieselLiters: 1420,
  hoursWithoutIncidents: 6.4,
};

