import { Truck, TrafficIncident, VicinalRoad, FieldTalhao, VehicleType, MachineStatus, IncidentType, IncidentSeverity } from '../types';

// Calcula a distância total em quilômetros de uma rota vicinal
export const calculateRouteDistanceKm = (coordinates: [number, number][]): number => {
  if (coordinates.length < 2) return 0;
  
  let totalKm = 0;
  for (let i = 0; i < coordinates.length - 1; i++) {
    const [lat1, lon1] = coordinates[i];
    const [lat2, lon2] = coordinates[i + 1];
    
    // Fórmula de Haversine
    const R = 6371; // Raio da Terra em km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    totalKm += R * c;
  }
  return parseFloat(totalKm.toFixed(1));
};

const TRUCK_MODELS: { model: string; type: VehicleType; capacity: number }[] = [
  { model: 'Scania R540 6x4 (Rodotrem 9 Eixos)', type: 'rodotrem_9eixos', capacity: 74 },
  { model: 'Volvo FH540 6x4 (Treminhão Canavieiro)', type: 'treminhao_cana', capacity: 74 },
  { model: 'Mercedes-Benz Actros 2651 6x4 (Bitrem 7 Eixos)', type: 'bitrem_articulado', capacity: 57 },
  { model: 'DAF XF 530 6x4 (Rodotrem Graneleiro)', type: 'rodotrem_9eixos', capacity: 74 },
  { model: 'Iveco S-Way 540 6x4 (Treminhão 74t)', type: 'treminhao_cana', capacity: 74 },
  { model: 'Volvo FMX 500 6x4 (Bitrem Canavieiro)', type: 'bitrem_articulado', capacity: 62 },
];

const DRIVER_FIRST_NAMES = ['Rogério', 'Marcos', 'Tiago', 'Fernando', 'Lucas', 'Paulo', 'Valdomiro', 'Wellington', 'Cristiano', 'Alexandre', 'Sebastião', 'Geraldo'];
const DRIVER_LAST_NAMES = ['Silveira', 'Duarte', 'Peixoto', 'Alcantara', 'Medeiros', 'Borges', 'Cruz', 'Faria', 'Barreto', 'Rezende', 'Guimarães', 'Siqueira'];

const DRIVER_PHOTOS = [
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
];

const INCIDENT_TEMPLATES: {
  type: IncidentType;
  titles: string[];
  descriptions: string[];
  severities: IncidentSeverity[];
}[] = [
  {
    type: 'atoleiro',
    titles: ['Atoleiro com Barro Denso', 'Trecho com Rodotrem Patinando', 'Barro Escorregadio na Subida'],
    descriptions: [
      'Chuva na cabeceira da fazenda deixou a vicinal de terra intransitável para veículos pesados.',
      'Solo argiloso muito fofo provocando perda de tração nos rodotrens.',
      'Caminhão articulado em L precisando de trator de apoio para transposição.'
    ],
    severities: ['critica', 'media'],
  },
  {
    type: 'ponte_avariada',
    titles: ['Ponte de Madeira com Pranchas Soltas', 'Cabeceira de Ponte Cedendo', 'Estrutura de Madeira em Manutenção'],
    descriptions: [
      'Passagem de peso acima de 50t com risco de ruptura. Necessário utilizar desvio pelo carreador.',
      'Vigas mestras soltas após enxurrada. Tráfego em meia pista com cautela.',
      'Equipe de infraestrutura da usina acionada para reparo emergencial das pranchas.'
    ],
    severities: ['critica', 'media'],
  },
  {
    type: 'chuva_localizada',
    titles: ['Pancada de Chuva Torrencial', 'Temporal Isolado no Talhão', 'Neblina e Pista Molhada'],
    descriptions: [
      'Precipitação de 35mm nos últimos 20 minutos. Redução preventiva de velocidade recomendada.',
      'Chuva forte com rajadas de vento reduzindo a visibilidade nos carreadores.',
      'Frente de corte paralisada temporariamente aguardando secagem do leito.'
    ],
    severities: ['media', 'baixa'],
  },
  {
    type: 'poeira_densa',
    titles: ['Poeirão Denso no Carreador', 'Baixa Visibilidade por Poeira', 'Redemoinho de Terra na Vicinal'],
    descriptions: [
      'Vento forte levantando nuvem espessa de terra. Caminhões devem manter distância mínima de 150m.',
      'Visibilidade inferior a 30 metros. Exigido acendimento dos faróis e giroflex.',
      'Carretas cruzando em velocidade reduzida para evitar acidentes.'
    ],
    severities: ['media', 'baixa'],
  },
  {
    type: 'erosao_valeta',
    titles: ['Valeta Aberta por Enxurrada', 'Erosão no Acostamento Vicinal', 'Costela de Vaca Severa'],
    descriptions: [
      'Enxurrada abriu canaleta transversal de 30cm no leito da estrada. Risco de quebra de feixe de molas.',
      'Desmoronamento parcial da borda da estrada vicinal.',
      'Ondulações severas (costela de vaca) exigindo trânsito a menos de 20 km/h.'
    ],
    severities: ['media', 'critica'],
  },
  {
    type: 'veiculo_parado',
    titles: ['Caminhão em Pane Elétrica', 'Pneu Estourado Bloqueando Pista', 'Superaquecimento em Subida'],
    descriptions: [
      'Rodotrem parado ocupando meia pista na estrada vicinal. Sinalizado com triângulo e folhas.',
      'Troca de rodado duplo em andamento. Trânsito lento no trecho.',
      'Oficina volante do COA já em deslocamento com mecânico de plantão.'
    ],
    severities: ['media', 'baixa'],
  }
];

// Gera um caminhão aleatório realista
export const createRandomTruck = (
  existingTrucks: Truck[],
  vicinalRoads: VicinalRoad[],
  talhoes: FieldTalhao[]
): Truck => {
  // Gerar prefixo único
  const existingPrefixes = new Set(existingTrucks.map(t => t.prefix));
  let prefixNum = Math.floor(Math.random() * 800) + 200;
  while (existingPrefixes.has(`TR-${prefixNum}`)) {
    prefixNum = Math.floor(Math.random() * 800) + 200;
  }
  const prefix = `TR-${prefixNum}`;

  // Placa estilo Mercosul
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const rL = () => letters[Math.floor(Math.random() * letters.length)];
  const rN = () => Math.floor(Math.random() * 10);
  const plate = `${rL()}${rL()}${rL()}-${rN()}${rL()}${rN()}${rN()}`;

  // Modelo e tipo
  const template = TRUCK_MODELS[Math.floor(Math.random() * TRUCK_MODELS.length)];

  // Rota associada e coordenadas
  const road = vicinalRoads.length > 0
    ? vicinalRoads[Math.floor(Math.random() * vicinalRoads.length)]
    : null;

  let coordinates: [number, number] = [-19.8200, -48.1200];
  let directionAngle = Math.floor(Math.random() * 360);

  if (road && road.coordinates.length > 0) {
    // Escolhe um ponto intermediário da rota com pequeno desvio natural
    const ptIdx = Math.floor(Math.random() * road.coordinates.length);
    const basePt = road.coordinates[ptIdx];
    const jitterLat = (Math.random() - 0.5) * 0.003;
    const jitterLng = (Math.random() - 0.5) * 0.003;
    coordinates = [
      parseFloat((basePt[0] + jitterLat).toFixed(4)),
      parseFloat((basePt[1] + jitterLng).toFixed(4)),
    ];
  }

  // Status e carga
  const statuses: MachineStatus[] = [
    'fila_virtual_jit',
    'em_transito_vicinal',
    'em_carregamento',
    'descarregando_moega',
  ];
  const status = statuses[Math.floor(Math.random() * statuses.length)];

  let currentLoadTons = 0;
  let speedCurrentKmH = 0;
  let speedRecommendedKmH = 0;

  if (status === 'fila_virtual_jit') {
    currentLoadTons = parseFloat((template.capacity * (0.94 + Math.random() * 0.06)).toFixed(1));
    speedCurrentKmH = Math.floor(Math.random() * 12) + 24; // 24-35 km/h
    speedRecommendedKmH = 28;
  } else if (status === 'em_transito_vicinal') {
    const isLoaded = Math.random() > 0.3;
    currentLoadTons = isLoaded ? parseFloat((template.capacity * 0.95).toFixed(1)) : 0;
    speedCurrentKmH = Math.floor(Math.random() * 18) + 28;
    speedRecommendedKmH = 35;
  } else if (status === 'em_carregamento') {
    currentLoadTons = parseFloat((template.capacity * (Math.random() * 0.6)).toFixed(1));
    speedCurrentKmH = 0;
    speedRecommendedKmH = 0;
  } else if (status === 'descarregando_moega') {
    currentLoadTons = parseFloat((template.capacity * 0.9).toFixed(1));
    speedCurrentKmH = 0;
    speedRecommendedKmH = 0;
  }

  const randomField = talhoes.length > 0 ? talhoes[Math.floor(Math.random() * talhoes.length)] : undefined;
  const distanceToDestKm = parseFloat((Math.random() * 14 + 3).toFixed(1));
  const etaMinutes = speedCurrentKmH > 0
    ? Math.max(4, Math.round((distanceToDestKm / speedCurrentKmH) * 60))
    : 0;

  // Motorista
  const firstName = DRIVER_FIRST_NAMES[Math.floor(Math.random() * DRIVER_FIRST_NAMES.length)];
  const lastName = DRIVER_LAST_NAMES[Math.floor(Math.random() * DRIVER_LAST_NAMES.length)];
  const photoUrl = DRIVER_PHOTOS[Math.floor(Math.random() * DRIVER_PHOTOS.length)];

  const now = new Date();
  const scheduledHour = now.getHours() + (Math.random() > 0.5 ? 1 : 0);
  const scheduledMinute = Math.floor(Math.random() * 59);
  const scheduledMoegaSlot = `${String(scheduledHour).padStart(2, '0')}:${String(scheduledMinute).padStart(2, '0')}`;

  return {
    id: 'truck-rand-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 6),
    prefix,
    plate,
    model: template.model,
    type: template.type,
    capacityTons: template.capacity,
    currentLoadTons,
    status,
    currentFieldId: randomField?.id || 'talhao-402',
    targetMoegaId: Math.random() > 0.5 ? 'moega-01' : 'moega-02',
    fuelLevelPercent: Math.floor(Math.random() * 60) + 35, // 35% a 95%
    fuelConsumptionLPerH: parseFloat((Math.random() * 14 + 18).toFixed(1)),
    speedCurrentKmH,
    speedRecommendedKmH,
    coordinates,
    directionAngle,
    etaMinutes,
    scheduledMoegaSlot,
    distanceToDestKm,
    lastTelemetryUpdate: new Date().toISOString(),
    assignedRouteId: road?.id,
    isRandom: true,
    driver: {
      id: 'drv-rand-' + Math.random().toString(36).substring(2, 7),
      name: `${firstName} ${lastName}`,
      cnh: `${Math.floor(Math.random() * 90000000000 + 10000000000)} - E`,
      registration: `MAT-${Math.floor(Math.random() * 8000 + 1000)}`,
      shiftHours: parseFloat((Math.random() * 5 + 1.5).toFixed(1)),
      maxAllowedHours: 8.0,
      continuousDrivingHours: parseFloat((Math.random() * 3.5 + 0.4).toFixed(1)),
      radioChannel: `CH-0${Math.floor(Math.random() * 4 + 1)} Vicinal Central`,
      phone: `(34) 99${Math.floor(Math.random() * 899 + 100)}-${Math.floor(Math.random() * 8999 + 1000)}`,
      photoUrl,
    }
  };
};

// Gera um incidente aleatório na estrada vicinal
export const createRandomIncident = (
  existingIncidents: TrafficIncident[],
  vicinalRoads: VicinalRoad[]
): TrafficIncident => {
  const road = vicinalRoads.length > 0
    ? vicinalRoads[Math.floor(Math.random() * vicinalRoads.length)]
    : null;

  const template = INCIDENT_TEMPLATES[Math.floor(Math.random() * INCIDENT_TEMPLATES.length)];
  const title = template.titles[Math.floor(Math.random() * template.titles.length)];
  const description = template.descriptions[Math.floor(Math.random() * template.descriptions.length)];
  const severity = template.severities[Math.floor(Math.random() * template.severities.length)];

  let coordinates: [number, number] = [-19.8400, -48.1400];
  if (road && road.coordinates.length > 0) {
    const ptIdx = Math.floor(Math.random() * road.coordinates.length);
    coordinates = road.coordinates[ptIdx];
  }

  const now = new Date();
  const timeFormatted = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  const km = (Math.random() * 22 + 2).toFixed(1);

  return {
    id: 'inc-rand-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 6),
    type: template.type,
    title,
    description,
    vicinalRoad: road ? `${road.name} (${road.code})` : 'Vicinal Rural de Terra',
    kmMarker: `KM ${km}`,
    coordinates,
    severity,
    reportedBy: `TR-${Math.floor(Math.random() * 500 + 100)} (Rádio VHF)`,
    reportedAt: timeFormatted,
    detourActive: severity === 'critica',
    suggestedDetourVicinal: road?.id.includes('03') ? 'Desvio Vicinal Carreador Alto (MG-V03-ALT)' : 'Vicinal das Palmeiras (MG-V01)',
    isResolved: false,
    isRandom: true,
  };
};
