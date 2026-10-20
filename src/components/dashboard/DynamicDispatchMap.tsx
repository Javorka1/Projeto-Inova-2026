import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { useApp } from '../../context/AppContext';
import { 
  PLANT_COA, 
  VICINAL_ROADS, 
  INITIAL_MOEGAS 
} from '../../data/mockData';
import { 
  Truck, 
  TrafficIncident, 
  FieldTalhao 
} from '../../types';
import { 
  MapPin, 
  Layers, 
  Compass, 
  Gauge, 
  Radio, 
  Fuel, 
  Clock, 
  AlertTriangle, 
  ChevronRight,
  Eye,
  CheckCircle2,
  Navigation,
  RefreshCw
} from 'lucide-react';

export const DynamicDispatchMap: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layersGroupRef = useRef<{
    roads?: L.LayerGroup;
    talhoes?: L.LayerGroup;
    trucks?: L.LayerGroup;
    harvesters?: L.LayerGroup;
    incidents?: L.LayerGroup;
    supplyZones?: L.LayerGroup;
  }>({});

  const { 
    trucks, 
    harvesters, 
    transshipments, 
    talhoes, 
    incidents, 
    selectedTruck, 
    setSelectedTruck,
    toggleIncidentDetour,
    setActiveTab
  } = useApp();

  // Filtros de camadas no mapa
  const [showRoads, setShowRoads] = useState<boolean>(true);
  const [showTalhoes, setShowTalhoes] = useState<boolean>(true);
  const [showTrucks, setShowTrucks] = useState<boolean>(true);
  const [showIncidents, setShowIncidents] = useState<boolean>(true);
  const [showSupplyRadius, setShowSupplyRadius] = useState<boolean>(true);
  const [mapTileType, setMapTileType] = useState<'radar_leve' | 'dark' | 'satellite' | 'street'>('radar_leve');

  // Inicializar o Mapa Leaflet com Aceleração Canvas GPU
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Coordenadas centrais no polo agrícola de Minas Gerais (Uberaba/Conceição das Alagoas)
    const map = L.map(mapContainerRef.current, {
      center: [-19.8400, -48.1200],
      zoom: 12,
      zoomControl: false,
      preferCanvas: true, // Renderiza estradas e talhões no Canvas GPU (ultra leve e rápido!)
      wheelDebounceTime: 80,
      wheelPxPerZoomLevel: 100,
      fadeAnimation: false, // Desativa animação pesada de fade
    });

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    mapInstanceRef.current = map;

    // Grupos de camadas
    layersGroupRef.current.roads = L.layerGroup().addTo(map);
    layersGroupRef.current.talhoes = L.layerGroup().addTo(map);
    layersGroupRef.current.trucks = L.layerGroup().addTo(map);
    layersGroupRef.current.harvesters = L.layerGroup().addTo(map);
    layersGroupRef.current.incidents = L.layerGroup().addTo(map);
    layersGroupRef.current.supplyZones = L.layerGroup().addTo(map);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Atualizar Tile Layer (Radar Leve / Dark / Satellite / OpenStreetMap)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Remover tile layers existentes
    map.eachLayer(layer => {
      if (layer instanceof L.TileLayer) {
        map.removeLayer(layer);
      }
    });

    // Modo Radar Leve: Não faz download de imagens pesadas da internet!
    if (mapTileType === 'radar_leve') {
      setTimeout(() => map.invalidateSize(), 50);
      return;
    }

    let tileUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}';
    let attribution = '&copy; Esri &mdash; Base Cartográfica COA';
    let subdomains = 'abc';

    if (mapTileType === 'satellite') {
      tileUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
      attribution = '&copy; Esri &mdash; Imagens de Satélite CTT';
    } else if (mapTileType === 'street') {
      tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
      attribution = '&copy; OpenStreetMap';
      subdomains = 'abc';
    }

    L.tileLayer(tileUrl, {
      attribution,
      maxZoom: 17,
      subdomains: subdomains,
      updateWhenIdle: true, // Só faz requisição de imagem após parar de mover
      updateWhenZooming: false, // Não sobrecarrega a CPU durante o zoom
      keepBuffer: 1, // Mantém consumo mínimo de memória RAM
    }).addTo(map);

    setTimeout(() => {
      map.invalidateSize();
    }, 100);
  }, [mapTileType]);

  // Listener para redimensionamento da janela
  useEffect(() => {
    const handleResize = () => {
      mapInstanceRef.current?.invalidateSize();
    };
    window.addEventListener('resize', handleResize);
    const timer = setTimeout(handleResize, 300);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timer);
    };
  }, []);

  // Renderizar Usina e Raio de Abastecimento Econômico
  useEffect(() => {
    const map = mapInstanceRef.current;
    const supplyGroup = layersGroupRef.current.supplyZones;
    if (!map || !supplyGroup) return;

    supplyGroup.clearLayers();

    if (showSupplyRadius) {
      // Usina Marker
      const plantIcon = L.divIcon({
        className: 'custom-plant-icon',
        html: `
          <div class="relative flex items-center justify-center">
            <div class="absolute w-12 h-12 bg-emerald-500/15 rounded-full border border-emerald-500/30"></div>
            <div class="w-10 h-10 bg-slate-900 border-2 border-emerald-400 rounded-lg shadow-xl flex items-center justify-center text-emerald-400">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect width="16" height="20" x="4" y="2" rx="2" ry="2"/>
                <path d="M9 22v-4h6v4"/>
                <path d="M8 6h.01"/>
                <path d="M16 6h.01"/>
                <path d="M12 6h.01"/>
                <path d="M12 10h.01"/>
                <path d="M12 14h.01"/>
                <path d="M16 10h.01"/>
                <path d="M16 14h.01"/>
                <path d="M8 10h.01"/>
                <path d="M8 14h.01"/>
              </svg>
            </div>
          </div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 20],
      });

      const plantMarker = L.marker(PLANT_COA.coordinates, { icon: plantIcon })
        .bindPopup(`
          <div class="p-2 text-slate-100 font-sans">
            <div class="text-xs font-bold text-emerald-400 uppercase tracking-wider">Unidade Industrial COA</div>
            <div class="text-sm font-bold text-white">${PLANT_COA.name}</div>
            <div class="text-xs text-slate-300 mt-1">Capacidade de Moagem: <strong>22.000 t/dia</strong></div>
            <div class="text-xs text-slate-300">Taxa Atual: <span class="text-emerald-400 font-mono font-bold">${PLANT_COA.currentCrushingRateTonsPerHour} t/h</span></div>
            <div class="mt-2 pt-2 border-t border-slate-700 text-[11px] text-slate-400">
              Moega 01: Operando | Moega 02: Operando
            </div>
          </div>
        `);
      supplyGroup.addLayer(plantMarker);

      // Círculos de Raio Econômico de Abastecimento (10km, 20km, 30km)
      const zone10km = L.circle(PLANT_COA.coordinates, {
        radius: 10000,
        color: '#10b981',
        weight: 1.5,
        dashArray: '4, 8',
        fillColor: '#10b981',
        fillOpacity: 0.04,
      }).bindTooltip('Raio Primário CTT: 10 km (Custo Mínimo de Frete Vicinal)', { permanent: false });

      const zone20km = L.circle(PLANT_COA.coordinates, {
        radius: 20000,
        color: '#f59e0b',
        weight: 1.5,
        dashArray: '4, 8',
        fillColor: '#f59e0b',
        fillOpacity: 0.03,
      }).bindTooltip('Raio Secundário CTT: 20 km (Modulação JIT Crítica)', { permanent: false });

      supplyGroup.addLayer(zone10km);
      supplyGroup.addLayer(zone20km);
    }
  }, [showSupplyRadius]);

  // Renderizar Estradas Vicinais Não Pavimentadas
  useEffect(() => {
    const roadsGroup = layersGroupRef.current.roads;
    if (!roadsGroup) return;

    roadsGroup.clearLayers();

    if (showRoads) {
      VICINAL_ROADS.forEach(road => {
        const isDetour = road.id.includes('detour');
        const color = isDetour ? '#22c55e' : (road.condition.includes('Crítica') ? '#ef4444' : '#d97706');
        const dashArray = isDetour ? '6, 6' : '3, 6';

        const polyline = L.polyline(road.coordinates, {
          color: color,
          weight: isDetour ? 5 : 4,
          opacity: 0.85,
          dashArray: dashArray,
        }).bindPopup(`
          <div class="p-2 font-sans text-slate-100">
            <div class="flex items-center justify-between gap-2">
              <span class="text-xs font-mono font-bold text-amber-400">${road.code}</span>
              <span class="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-medium">
                ${road.surface}
              </span>
            </div>
            <div class="text-sm font-bold text-white mt-1">${road.name}</div>
            <div class="text-xs text-slate-300 mt-1">Velocidade Máx. Sugerida: <strong>${road.speedLimitKmH} km/h</strong></div>
            <div class="text-xs text-slate-300">Condição do Leito: 
              <span class="${road.condition.includes('Crítica') ? 'text-red-400 font-bold' : 'text-slate-200'}">
                ${road.condition}
              </span>
            </div>
          </div>
        `);

        roadsGroup.addLayer(polyline);
      });
    }
  }, [showRoads]);

  // Renderizar Polígonos dos Talhões
  useEffect(() => {
    const talhoesGroup = layersGroupRef.current.talhoes;
    if (!talhoesGroup) return;

    talhoesGroup.clearLayers();

    if (showTalhoes) {
      talhoes.forEach(talhao => {
        const polygon = L.polygon(talhao.coordinates, {
          color: '#16a34a',
          weight: 2,
          fillColor: '#15803d',
          fillOpacity: 0.25,
        }).bindPopup(`
          <div class="p-2 font-sans text-slate-100">
            <div class="text-xs font-bold text-emerald-400 uppercase tracking-wider">${talhao.farmName}</div>
            <div class="text-sm font-bold text-white">${talhao.name}</div>
            <div class="mt-2 space-y-1 text-xs text-slate-300">
              <div class="flex justify-between"><span>Cultura:</span><span class="font-medium text-white">${talhao.cropType}</span></div>
              <div class="flex justify-between"><span>Área:</span><span class="font-medium text-white">${talhao.areaHectares} ha</span></div>
              <div class="flex justify-between"><span>Produtividade Est.:</span><span class="font-medium text-emerald-400 font-mono">${talhao.predictedYieldTonsPerHa} t/ha</span></div>
              <div class="flex justify-between"><span>Produção Total Est.:</span><span class="font-medium text-white font-mono">${talhao.totalProductionEstimatedTons.toLocaleString()} t</span></div>
              <div class="flex justify-between"><span>Distância à Usina:</span><span class="font-medium text-amber-400 font-mono">${talhao.distanceToPlantKm} km via ${talhao.primaryVicinalRoad}</span></div>
            </div>
            <div class="mt-2 pt-2 border-t border-slate-700">
              <div class="text-[11px] text-slate-400 flex justify-between mb-1">
                <span>Progresso Colheita:</span>
                <span class="font-mono font-bold text-white">${talhao.harvestedPercentage}%</span>
              </div>
              <div class="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div class="bg-emerald-500 h-full rounded-full" style="width: ${talhao.harvestedPercentage}%"></div>
              </div>
            </div>
          </div>
        `);

        talhoesGroup.addLayer(polygon);
      });
    }
  }, [showTalhoes, talhoes]);

  // Renderizar Caminhões (Frotas CTT)
  useEffect(() => {
    const trucksGroup = layersGroupRef.current.trucks;
    if (!trucksGroup) return;

    trucksGroup.clearLayers();

    if (showTrucks) {
      trucks.forEach(truck => {
        // Cores por status
        let borderColor = '#22c55e'; // verde normal
        let bgColor = '#052e16';
        let statusBadge = 'Trânsito';

        if (truck.status === 'fila_virtual_jit') {
          borderColor = '#f59e0b'; // amarelo JIT
          bgColor = '#451a03';
          statusBadge = 'JIT';
        } else if (truck.status === 'descarregando_moega') {
          borderColor = '#3b82f6'; // azul moega
          bgColor = '#172554';
          statusBadge = 'Moega';
        } else if (truck.status === 'em_carregamento') {
          borderColor = '#a855f7'; // roxo talhão
          bgColor = '#3b0764';
          statusBadge = 'Talhão';
        } else if (truck.status === 'manutencao') {
          borderColor = '#ef4444'; // vermelho oficina
          bgColor = '#450a0a';
          statusBadge = 'Oficina';
        }

        const truckIcon = L.divIcon({
          className: 'custom-truck-marker',
          html: `
            <div class="cursor-pointer transform hover:scale-110 transition-transform flex flex-col items-center">
              <div class="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold text-white border shadow-md" style="background-color: ${bgColor}; border-color: ${borderColor};">
                ${truck.prefix}
              </div>
              <div class="w-7 h-7 rounded-full flex items-center justify-center text-white border-2 shadow-lg" style="background-color: ${bgColor}; border-color: ${borderColor}; transform: rotate(${truck.directionAngle}deg);">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z"/>
                </svg>
              </div>
              <div class="text-[9px] font-mono font-bold px-1 rounded text-slate-200 bg-slate-900/90 border border-slate-700">
                ${truck.speedCurrentKmH} km/h
              </div>
            </div>
          `,
          iconSize: [44, 48],
          iconAnchor: [22, 24],
        });

        const marker = L.marker(truck.coordinates, { icon: truckIcon });

        marker.on('click', () => {
          setSelectedTruck(truck);
        });

        trucksGroup.addLayer(marker);
      });
    }
  }, [showTrucks, trucks, setSelectedTruck]);

  // Renderizar Colhedoras e Transbordos
  useEffect(() => {
    const harvestersGroup = layersGroupRef.current.harvesters;
    if (!harvestersGroup) return;

    harvestersGroup.clearLayers();

    if (showTrucks) {
      // Colhedoras no Talhão
      harvesters.forEach(colh => {
        const colhIcon = L.divIcon({
          className: 'custom-harvester-icon',
          html: `
            <div class="flex flex-col items-center">
              <div class="px-1 py-0.2 rounded text-[9px] font-mono font-bold text-emerald-300 bg-emerald-950 border border-emerald-500/50">
                ${colh.prefix}
              </div>
              <div class="w-6 h-6 rounded-md bg-emerald-700 border border-emerald-300 flex items-center justify-center text-white shadow-md">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                </svg>
              </div>
            </div>
          `,
          iconSize: [36, 40],
          iconAnchor: [18, 20],
        });

        const colhMarker = L.marker(colh.coordinates, { icon: colhIcon })
          .bindPopup(`
            <div class="p-2 font-sans text-slate-100">
              <div class="text-xs font-bold text-emerald-400 uppercase">Frente de Colheita CTT</div>
              <div class="text-sm font-bold text-white">${colh.prefix} - ${colh.model}</div>
              <div class="text-xs text-slate-300 mt-1">Operador: <strong>${colh.operatorName}</strong></div>
              <div class="text-xs text-slate-300">Taxa de Corte: <span class="text-emerald-400 font-mono font-bold">${colh.tonsCutPerHour} t/h</span> (${colh.cuttingSpeedKmH} km/h)</div>
              <div class="text-[11px] text-slate-400 mt-1">Status: ${colh.status === 'cortando' ? 'Cortando com Transbordo' : 'Aguardando Transbordo'}</div>
            </div>
          `);

        harvestersGroup.addLayer(colhMarker);
      });

      // Tratores com Transbordo
      transshipments.forEach(trb => {
        const trbIcon = L.divIcon({
          className: 'custom-transshipment-icon',
          html: `
            <div class="flex flex-col items-center">
              <div class="px-1 py-0.2 rounded text-[9px] font-mono font-bold text-amber-300 bg-amber-950 border border-amber-500/50">
                ${trb.prefix}
              </div>
              <div class="w-5 h-5 rounded-full bg-amber-600 border border-amber-300 flex items-center justify-center text-white shadow-md">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
              </div>
            </div>
          `,
          iconSize: [32, 36],
          iconAnchor: [16, 18],
        });

        const trbMarker = L.marker(trb.coordinates, { icon: trbIcon })
          .bindPopup(`
            <div class="p-2 font-sans text-slate-100">
              <div class="text-xs font-bold text-amber-400 uppercase">Transbordo de Carreador</div>
              <div class="text-sm font-bold text-white">${trb.prefix} - ${trb.tractorModel}</div>
              <div class="text-xs text-slate-300 mt-1">Operador: <strong>${trb.operatorName}</strong></div>
              <div class="text-xs text-slate-300">Carga Atual: <span class="font-mono text-white">${trb.currentLoadTons} t / ${trb.capacityTons} t</span></div>
              <div class="text-[11px] text-amber-300 mt-1">Operação: ${trb.status.replace(/_/g, ' ')}</div>
            </div>
          `);

        harvestersGroup.addLayer(trbMarker);
      });
    }
  }, [showTrucks, harvesters, transshipments]);

  // Renderizar Incidentes de Tráfego Rural (Atoleiros, Pontes, Chuva)
  useEffect(() => {
    const incidentsGroup = layersGroupRef.current.incidents;
    if (!incidentsGroup) return;

    incidentsGroup.clearLayers();

    if (showIncidents) {
      incidents.filter(i => !i.isResolved).forEach(incident => {
        const isCritical = incident.severity === 'critica';
        const color = isCritical ? '#ef4444' : (incident.severity === 'media' ? '#f59e0b' : '#3b82f6');

        const incidentIcon = L.divIcon({
          className: 'custom-incident-icon',
          html: `
            <div class="relative flex items-center justify-center cursor-pointer">
              <div class="absolute w-8 h-8 rounded-full ${isCritical ? 'bg-red-500/20 border border-red-500/60' : 'bg-amber-500/20 border border-amber-500/40'}"></div>
              <div class="w-7 h-7 rounded-lg flex items-center justify-center text-white font-bold border shadow-xl" style="background-color: ${color}; border-color: #ffffff;">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
                  <line x1="12" y1="9" x2="12" y2="13"/>
                  <line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
              </div>
            </div>
          `,
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        });

        const marker = L.marker(incident.coordinates, { icon: incidentIcon });

        marker.bindPopup(`
          <div class="p-2.5 font-sans text-slate-100 max-w-xs">
            <div class="flex items-center justify-between mb-1">
              <span class="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${
                isCritical ? 'bg-red-950 text-red-400 border border-red-800' : 'bg-amber-950 text-amber-400 border border-amber-800'
              }">
                Incidente Vicinal (${incident.severity.toUpperCase()})
              </span>
              <span class="text-[11px] text-slate-400 font-mono">${incident.reportedAt}</span>
            </div>
            <div class="text-sm font-bold text-white">${incident.title}</div>
            <div class="text-xs text-amber-300 font-medium mt-0.5">${incident.vicinalRoad} - ${incident.kmMarker}</div>
            <p class="text-xs text-slate-300 mt-1.5 leading-relaxed">${incident.description}</p>
            <div class="mt-2 text-[11px] text-slate-400">Reportado por: <span class="text-slate-200">${incident.reportedBy}</span></div>
            ${
              incident.suggestedDetourVicinal ? `
                <div class="mt-2 p-1.5 bg-emerald-950/80 border border-emerald-600/40 rounded text-[11px] text-emerald-300">
                  <strong>Desvio Sugerido:</strong> ${incident.suggestedDetourVicinal}
                </div>
              ` : ''
            }
          </div>
        `);

        incidentsGroup.addLayer(marker);
      });
    }
  }, [showIncidents, incidents]);

  // Função para recentralizar o mapa
  const handleRecenter = () => {
    mapInstanceRef.current?.flyTo([-19.8400, -48.1200], 12, { duration: 1.2 });
  };

  return (
    <div className="relative w-full h-full flex-1 min-h-0 flex flex-col bg-slate-950 overflow-hidden">
      
      {/* Controles Flutuantes Superiores do Mapa */}
      <div className="absolute top-3 left-3 z-[1000] flex flex-wrap items-center gap-2">
        {/* Seletor de Tipo de Mapa */}
        <div className="bg-slate-900/90 border border-slate-700/80 rounded-lg p-1 flex items-center gap-1 shadow-lg text-xs">
          <button
            onClick={() => setMapTileType('radar_leve')}
            className={`px-2.5 py-1 rounded font-medium transition flex items-center gap-1 ${
              mapTileType === 'radar_leve' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-300 hover:text-white'
            }`}
          >
            <span>⚡ Radar Leve</span>
          </button>
          <button
            onClick={() => setMapTileType('dark')}
            className={`px-2.5 py-1 rounded font-medium transition ${
              mapTileType === 'dark' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-300 hover:text-white'
            }`}
          >
            Escuro COA
          </button>
          <button
            onClick={() => setMapTileType('satellite')}
            className={`px-2.5 py-1 rounded font-medium transition ${
              mapTileType === 'satellite' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-300 hover:text-white'
            }`}
          >
            Satélite Rural
          </button>
          <button
            onClick={() => setMapTileType('street')}
            className={`px-2.5 py-1 rounded font-medium transition ${
              mapTileType === 'street' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-300 hover:text-white'
            }`}
          >
            Topográfico
          </button>
        </div>

        {/* Recentralizar */}
        <button
          onClick={handleRecenter}
          className="bg-slate-900/90 backdrop-blur border border-slate-700/80 hover:bg-slate-800 text-slate-200 px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 shadow-lg transition"
        >
          <Compass className="w-3.5 h-3.5 text-emerald-400" />
          <span>Frente MG</span>
        </button>
      </div>

      {/* Seletor Flutuante de Camadas (Topo Direito) */}
      <div className="absolute top-3 right-3 z-[1000] bg-slate-900/90 backdrop-blur border border-slate-700/80 rounded-lg p-2 shadow-lg text-xs flex flex-col gap-1.5">
        <div className="flex items-center gap-1.5 font-bold text-slate-200 border-b border-slate-800 pb-1">
          <Layers className="w-3.5 h-3.5 text-emerald-400" />
          <span>Camadas CTT</span>
        </div>
        <label className="flex items-center gap-2 text-slate-300 cursor-pointer hover:text-white">
          <input
            type="checkbox"
            checked={showRoads}
            onChange={e => setShowRoads(e.target.checked)}
            className="rounded border-slate-700 text-emerald-600 focus:ring-0"
          />
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-0.5 bg-amber-500 inline-block"></span>
            Vicinais de Terra
          </span>
        </label>
        <label className="flex items-center gap-2 text-slate-300 cursor-pointer hover:text-white">
          <input
            type="checkbox"
            checked={showTalhoes}
            onChange={e => setShowTalhoes(e.target.checked)}
            className="rounded border-slate-700 text-emerald-600 focus:ring-0"
          />
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 bg-emerald-600 inline-block rounded-xs"></span>
            Talhões em Colheita
          </span>
        </label>
        <label className="flex items-center gap-2 text-slate-300 cursor-pointer hover:text-white">
          <input
            type="checkbox"
            checked={showTrucks}
            onChange={e => setShowTrucks(e.target.checked)}
            className="rounded border-slate-700 text-emerald-600 focus:ring-0"
          />
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 bg-blue-500 rounded-full inline-block"></span>
            Caminhões & Frotas
          </span>
        </label>
        <label className="flex items-center gap-2 text-slate-300 cursor-pointer hover:text-white">
          <input
            type="checkbox"
            checked={showIncidents}
            onChange={e => setShowIncidents(e.target.checked)}
            className="rounded border-slate-700 text-emerald-600 focus:ring-0"
          />
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 bg-red-500 inline-block rounded-xs"></span>
            Alertas de Atoleiro
          </span>
        </label>
        <label className="flex items-center gap-2 text-slate-300 cursor-pointer hover:text-white">
          <input
            type="checkbox"
            checked={showSupplyRadius}
            onChange={e => setShowSupplyRadius(e.target.checked)}
            className="rounded border-slate-700 text-emerald-600 focus:ring-0"
          />
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 border border-emerald-400 rounded-full inline-block"></span>
            Raio de Abastecimento
          </span>
        </label>
      </div>

      {/* Elemento DOM onde o Leaflet monta o mapa */}
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Drawer Lateral / Modal de Inspeção do Caminhão Selecionado */}
      {selectedTruck && (
        <div className="absolute bottom-4 left-4 right-4 md:right-auto md:w-96 z-[1000] bg-slate-900/95 backdrop-blur-md border border-slate-700 rounded-xl shadow-2xl p-4 text-slate-100 transition-all animate-in slide-in-from-bottom-4">
          <div className="flex items-start justify-between border-b border-slate-800 pb-2.5">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-mono font-bold">
                {selectedTruck.prefix}
              </div>
              <div>
                <div className="text-sm font-bold text-white flex items-center gap-2">
                  {selectedTruck.model}
                </div>
                <div className="text-xs text-slate-400 font-mono">
                  Placa: <strong className="text-slate-200">{selectedTruck.plate}</strong>
                </div>
              </div>
            </div>
            <button
              onClick={() => setSelectedTruck(null)}
              className="text-slate-400 hover:text-white text-lg font-bold p-1 leading-none"
            >
              ✕
            </button>
          </div>

          {/* Dados do Motorista & Tacógrafo */}
          <div className="mt-3 p-2 rounded-lg bg-slate-800/60 border border-slate-700/60 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <img
                src={selectedTruck.driver.photoUrl}
                alt={selectedTruck.driver.name}
                className="w-9 h-9 rounded-full object-cover border border-slate-600"
              />
              <div>
                <div className="text-xs font-semibold text-white">{selectedTruck.driver.name}</div>
                <div className="text-[11px] text-slate-400">Rádio: {selectedTruck.driver.radioChannel}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-[11px] text-slate-400">Jornada Contínua:</div>
              <div className="text-xs font-mono font-bold text-amber-400">
                {selectedTruck.driver.continuousDrivingHours.toFixed(1)}h / 4.0h
              </div>
            </div>
          </div>

          {/* Modulação de Velocidade Just-in-Time */}
          <div className="mt-3 p-2.5 rounded-lg bg-emerald-950/60 border border-emerald-500/30">
            <div className="flex items-center justify-between text-xs text-emerald-300 font-medium">
              <span className="flex items-center gap-1">
                <Gauge className="w-3.5 h-3.5 text-emerald-400" />
                Modulação JIT Recomendada
              </span>
              <span className="font-mono text-white text-sm font-bold">
                {selectedTruck.speedRecommendedKmH} km/h
              </span>
            </div>
            <p className="text-[11px] text-slate-300 mt-1 leading-tight">
              {selectedTruck.speedCurrentKmH > selectedTruck.speedRecommendedKmH ? (
                <span className="text-amber-300">
                  ⚠️ Reduzir para {selectedTruck.speedRecommendedKmH} km/h. Moega liberará exatamente às {selectedTruck.scheduledMoegaSlot || '15:15'} (elimina espera com motor ligado).
                </span>
              ) : (
                <span className="text-emerald-300">
                  ✓ Velocidade sincronizada com a moega. Tempo estimado: {selectedTruck.etaMinutes} min.
                </span>
              )}
            </p>
          </div>

          {/* Telemetria CTT */}
          <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
            <div className="p-2 rounded bg-slate-800/80 border border-slate-700/50">
              <div className="text-[10px] text-slate-400">Carga Atual</div>
              <div className="font-mono font-bold text-white text-xs mt-0.5">
                {selectedTruck.currentLoadTons} t / {selectedTruck.capacityTons} t
              </div>
            </div>
            <div className="p-2 rounded bg-slate-800/80 border border-slate-700/50">
              <div className="text-[10px] text-slate-400">Consumo L/h</div>
              <div className="font-mono font-bold text-emerald-400 text-xs mt-0.5">
                {selectedTruck.fuelConsumptionLPerH} L/h
              </div>
            </div>
            <div className="p-2 rounded bg-slate-800/80 border border-slate-700/50">
              <div className="text-[10px] text-slate-400">Distância Moega</div>
              <div className="font-mono font-bold text-amber-400 text-xs mt-0.5">
                {selectedTruck.distanceToDestKm} km
              </div>
            </div>
          </div>

          {/* Botão de Ação Rápida */}
          <div className="mt-3 flex gap-2">
            <button
              onClick={() => {
                setActiveTab('jit');
              }}
              className="w-full py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition flex items-center justify-center gap-1.5 shadow-md"
            >
              <span>Ver na Fila Virtual JIT</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Legenda Resumida no Rodapé */}
      <div className="absolute bottom-3 right-3 z-[990] hidden md:flex items-center gap-3 bg-slate-900/90 backdrop-blur border border-slate-800 px-3 py-1.5 rounded-lg text-[11px] text-slate-400 shadow-md">
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Trânsito Normal
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Fila Virtual JIT
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span> Moega
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span> Alerta de Estrada
        </span>
      </div>

    </div>
  );
};

