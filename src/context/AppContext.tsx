import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Truck, 
  Harvester, 
  Transshipment, 
  FieldTalhao, 
  Moega, 
  TrafficIncident, 
  CttKpis,
  VicinalRoad 
} from '../types';
import { 
  INITIAL_MOEGAS, 
  INITIAL_TALHOES, 
  INITIAL_HARVESTERS, 
  INITIAL_TRANSSHIPMENTS, 
  INITIAL_KPIS,
  PLANT_COA,
  VICINAL_ROADS 
} from '../data/mockData';
import { storageService, PendingAction } from '../services/storageService';
import { coaAudio } from '../utils/audio';
import { createRandomTruck, createRandomIncident } from '../utils/randomGenerators';

interface AppContextType {
  // Estado e navegação
  activeTab: 'map' | 'fleet' | 'jit' | 'traffic' | 'supply_area';
  setActiveTab: (tab: 'map' | 'fleet' | 'jit' | 'traffic' | 'supply_area') => void;
  selectedTruck: Truck | null;
  setSelectedTruck: (truck: Truck | null) => void;
  selectedField: FieldTalhao | null;
  setSelectedField: (field: FieldTalhao | null) => void;

  // Seleção e Gestão de Rotas Vicinais
  selectedRoute: VicinalRoad | null;
  setSelectedRoute: (route: VicinalRoad | null) => void;
  vicinalRoads: VicinalRoad[];
  assignTruckToRoute: (truckId: string, routeId: string) => void;

  // Frotas e CTT
  trucks: Truck[];
  harvesters: Harvester[];
  transshipments: Transshipment[];
  talhoes: FieldTalhao[];
  moegas: Moega[];
  kpis: CttKpis;

  // Operações de Frotas (CRUD)
  addTruck: (newTruckData: Omit<Truck, 'id' | 'lastTelemetryUpdate'>) => void;
  updateTruck: (truckId: string, updatedFields: Partial<Truck>) => void;
  deleteTruck: (truckId: string) => void;

  // Gerador de Dados Aleatórios (Inserir / Retirar / Resetar)
  addRandomTruck: () => Truck;
  addRandomIncident: () => TrafficIncident;
  fillRandomBatch: () => void;
  removeLastRandom: () => void;
  removeAllRandom: () => void;
  resetToDefaultData: () => void;
  randomStats: { randomTrucksCount: number; randomIncidentsCount: number };

  // Incidentes de trânsito vicinal
  incidents: TrafficIncident[];
  reportIncident: (incidentData: Omit<TrafficIncident, 'id' | 'reportedAt' | 'isResolved'>) => void;
  toggleIncidentDetour: (incidentId: string) => void;
  resolveIncident: (incidentId: string) => void;

  // Offline-first
  isOffline: boolean;
  toggleOfflineMode: () => void;
  pendingSyncCount: number;
  lastSyncTime: string;
  isSyncing: boolean;
  syncNow: () => Promise<void>;
  storageUsageKb: number;

  // Áudio & Preferências
  soundEnabled: boolean;
  toggleSound: () => void;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<'map' | 'fleet' | 'jit' | 'traffic' | 'supply_area'>('map');
  const [selectedTruck, setSelectedTruck] = useState<Truck | null>(null);
  const [selectedField, setSelectedField] = useState<FieldTalhao | null>(null);
  const [selectedRoute, setSelectedRoute] = useState<VicinalRoad | null>(null);

  // Rotas vicinais disponíveis
  const [vicinalRoads] = useState<VicinalRoad[]>(VICINAL_ROADS);

  // Dados carregados com suporte offline
  const [trucks, setTrucks] = useState<Truck[]>(() => storageService.getTrucks());
  const [incidents, setIncidents] = useState<TrafficIncident[]>(() => storageService.getIncidents());
  const [isOffline, setIsOffline] = useState<boolean>(() => storageService.isOffline());
  const [pendingSyncCount, setPendingSyncCount] = useState<number>(() => storageService.getPendingSyncActions().length);
  const [storageUsageKb, setStorageUsageKb] = useState<number>(() => storageService.getEstimatedStorageUsageKb());
  
  const [harvesters] = useState<Harvester[]>(INITIAL_HARVESTERS);
  const [transshipments] = useState<Transshipment[]>(INITIAL_TRANSSHIPMENTS);
  const [talhoes] = useState<FieldTalhao[]>(INITIAL_TALHOES);
  const [moegas, setMoegas] = useState<Moega[]>(INITIAL_MOEGAS);
  const [kpis, setKpis] = useState<CttKpis>(INITIAL_KPIS);

  const [lastSyncTime, setLastSyncTime] = useState<string>('Sincronizado há pouco');
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  // Estatísticas de dados aleatórios gerados
  const randomStats = {
    randomTrucksCount: trucks.filter(t => t.isRandom).length,
    randomIncidentsCount: incidents.filter(i => i.isRandom).length,
  };

  // Atualiza persistência de caminhões
  const persistTrucks = (updatedTrucks: Truck[]) => {
    setTrucks(updatedTrucks);
    storageService.saveTrucks(updatedTrucks);
    setStorageUsageKb(storageService.getEstimatedStorageUsageKb());
  };

  // Atualiza persistência de incidentes
  const persistIncidents = (updatedIncidents: TrafficIncident[]) => {
    setIncidents(updatedIncidents);
    storageService.saveIncidents(updatedIncidents);
    setStorageUsageKb(storageService.getEstimatedStorageUsageKb());
  };

  // Sincronização periódica do relógio de sync
  useEffect(() => {
    const timer = setInterval(() => {
      if (!isOffline) {
        setLastSyncTime('Sincronizado há ' + Math.floor(Math.random() * 20 + 5) + 's');
      }
    }, 15000);
    return () => clearInterval(timer);
  }, [isOffline]);

  // Alternar Modo Offline
  const toggleOfflineMode = () => {
    const nextState = !isOffline;
    setIsOffline(nextState);
    storageService.setOffline(nextState);
    if (!nextState) {
      syncNow();
    }
  };

  // Forçar Sincronização Manual
  const syncNow = async () => {
    if (isSyncing) return;
    setIsSyncing(true);

    // Simula roundtrip de rede via satélite rural
    await new Promise(resolve => setTimeout(resolve, 1400));

    storageService.clearPendingSyncActions();
    setPendingSyncCount(0);
    setIsSyncing(false);
    setLastSyncTime('Sincronizado agora (' + new Date().toLocaleTimeString('pt-BR') + ')');
    coaAudio.playSyncSuccess();
  };

  // Atribuir caminhão a uma rota vicinal específica
  const assignTruckToRoute = (truckId: string, routeId: string) => {
    const route = vicinalRoads.find(r => r.id === routeId);
    const updated = trucks.map(t => {
      if (t.id === truckId) {
        // Se a rota tiver coordenadas, reposiciona o caminhão perto da rota
        const newCoords = route && route.coordinates.length > 0 
          ? route.coordinates[Math.floor(route.coordinates.length / 2)] 
          : t.coordinates;

        return {
          ...t,
          assignedRouteId: routeId,
          coordinates: newCoords,
          lastTelemetryUpdate: new Date().toISOString()
        };
      }
      return t;
    });

    persistTrucks(updated);

    if (selectedTruck && selectedTruck.id === truckId) {
      const refreshed = updated.find(t => t.id === truckId);
      if (refreshed) setSelectedTruck(refreshed);
    }
    coaAudio.playRadioChime();
  };

  // CRUD: Adicionar Caminhão Manualmente
  const addTruck = (newTruckData: Omit<Truck, 'id' | 'lastTelemetryUpdate'>) => {
    const newId = 'truck-' + Date.now().toString(36);
    const newTruck: Truck = {
      ...newTruckData,
      id: newId,
      lastTelemetryUpdate: new Date().toISOString(),
    };

    const updated = [newTruck, ...trucks];
    persistTrucks(updated);

    if (isOffline) {
      storageService.enqueuePendingAction({
        type: 'CREATE_TRUCK',
        payload: newTruck,
      });
      setPendingSyncCount(prev => prev + 1);
    } else {
      coaAudio.playRadioChime();
    }
  };

  // CRUD: Atualizar Caminhão
  const updateTruck = (truckId: string, updatedFields: Partial<Truck>) => {
    const updated = trucks.map(t => {
      if (t.id === truckId) {
        return {
          ...t,
          ...updatedFields,
          lastTelemetryUpdate: new Date().toISOString()
        };
      }
      return t;
    });

    persistTrucks(updated);

    if (selectedTruck && selectedTruck.id === truckId) {
      setSelectedTruck(prev => (prev ? { ...prev, ...updatedFields } : null));
    }

    if (isOffline) {
      storageService.enqueuePendingAction({
        type: 'UPDATE_TRUCK',
        payload: { truckId, updatedFields },
      });
      setPendingSyncCount(prev => prev + 1);
    }
  };

  // CRUD: Deletar Caminhão
  const deleteTruck = (truckId: string) => {
    const updated = trucks.filter(t => t.id !== truckId);
    persistTrucks(updated);

    if (selectedTruck && selectedTruck.id === truckId) {
      setSelectedTruck(null);
    }

    if (isOffline) {
      storageService.enqueuePendingAction({
        type: 'DELETE_TRUCK',
        payload: { truckId },
      });
      setPendingSyncCount(prev => prev + 1);
    }
  };

  // ==========================================
  // GERADOR DE DADOS ALEATÓRIOS (DEMO)
  // ==========================================

  // Inserir um caminhão aleatório
  const addRandomTruck = (): Truck => {
    const newTruck = createRandomTruck(trucks, vicinalRoads, talhoes);
    const updated = [newTruck, ...trucks];
    persistTrucks(updated);
    coaAudio.playRadioChime();
    return newTruck;
  };

  // Inserir um incidente aleatório
  const addRandomIncident = (): TrafficIncident => {
    const newIncident = createRandomIncident(incidents, vicinalRoads);
    const updated = [newIncident, ...incidents];
    persistIncidents(updated);
    coaAudio.playAlertTone();
    return newIncident;
  };

  // Preencher lote de demonstração com múltiplos dados aleatórios
  const fillRandomBatch = () => {
    let curTrucks = [...trucks];
    for (let i = 0; i < 3; i++) {
      const t = createRandomTruck(curTrucks, vicinalRoads, talhoes);
      curTrucks = [t, ...curTrucks];
    }
    const inc = createRandomIncident(incidents, vicinalRoads);
    persistTrucks(curTrucks);
    persistIncidents([inc, ...incidents]);
    coaAudio.playRadioChime();
  };

  // Retirar o último item aleatório adicionado
  const removeLastRandom = () => {
    const randomTruckIdx = trucks.findIndex(t => t.isRandom);
    if (randomTruckIdx !== -1) {
      const updated = [...trucks];
      const removed = updated.splice(randomTruckIdx, 1)[0];
      persistTrucks(updated);
      if (selectedTruck && selectedTruck.id === removed.id) {
        setSelectedTruck(null);
      }
      coaAudio.playRadioChime();
      return;
    }

    const randomIncIdx = incidents.findIndex(i => i.isRandom);
    if (randomIncIdx !== -1) {
      const updated = [...incidents];
      updated.splice(randomIncIdx, 1);
      persistIncidents(updated);
      coaAudio.playRadioChime();
    }
  };

  // Retirar TODOS os dados aleatórios criados
  const removeAllRandom = () => {
    const updatedTrucks = trucks.filter(t => !t.isRandom);
    const updatedIncidents = incidents.filter(i => !i.isRandom);
    persistTrucks(updatedTrucks);
    persistIncidents(updatedIncidents);

    if (selectedTruck && selectedTruck.isRandom) {
      setSelectedTruck(null);
    }
    coaAudio.playRadioChime();
  };

  // Restaurar dados originais (Reset padrão)
  const resetToDefaultData = () => {
    const result = storageService.resetToDefaults();
    setTrucks(result.trucks);
    setIncidents(result.incidents);
    setSelectedTruck(null);
    setSelectedRoute(null);
    setStorageUsageKb(storageService.getEstimatedStorageUsageKb());
    coaAudio.playRadioChime();
  };

  // ==========================================
  // INCIDENTES DE TRÂNSITO VICINAL
  // ==========================================

  const reportIncident = (incidentData: Omit<TrafficIncident, 'id' | 'reportedAt' | 'isResolved'>) => {
    const now = new Date();
    const timeFormatted = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const newIncident: TrafficIncident = {
      ...incidentData,
      id: 'inc-' + Date.now().toString(36),
      reportedAt: timeFormatted,
      isResolved: false,
    };

    const updated = [newIncident, ...incidents];
    persistIncidents(updated);

    coaAudio.playAlertTone();

    if (isOffline) {
      storageService.enqueuePendingAction({
        type: 'REPORT_INCIDENT',
        payload: newIncident,
      });
      setPendingSyncCount(prev => prev + 1);
    }
  };

  const toggleIncidentDetour = (incidentId: string) => {
    const updated = incidents.map(inc => {
      if (inc.id === incidentId) {
        return { ...inc, detourActive: !inc.detourActive };
      }
      return inc;
    });
    persistIncidents(updated);
    coaAudio.playRadioChime();
  };

  const resolveIncident = (incidentId: string) => {
    const updated = incidents.map(inc => {
      if (inc.id === incidentId) {
        return { ...inc, isResolved: true, detourActive: false };
      }
      return inc;
    });
    persistIncidents(updated);
    coaAudio.playRadioChime();
  };

  // Áudio
  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    coaAudio.setEnabled(next);
  };

  // Tema
  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        selectedTruck,
        setSelectedTruck,
        selectedField,
        setSelectedField,
        selectedRoute,
        setSelectedRoute,
        vicinalRoads,
        assignTruckToRoute,
        trucks,
        harvesters,
        transshipments,
        talhoes,
        moegas,
        kpis,
        addTruck,
        updateTruck,
        deleteTruck,
        addRandomTruck,
        addRandomIncident,
        fillRandomBatch,
        removeLastRandom,
        removeAllRandom,
        resetToDefaultData,
        randomStats,
        incidents,
        reportIncident,
        toggleIncidentDetour,
        resolveIncident,
        isOffline,
        toggleOfflineMode,
        pendingSyncCount,
        lastSyncTime,
        isSyncing,
        syncNow,
        storageUsageKb,
        soundEnabled,
        toggleSound,
        theme,
        toggleTheme,
      }}
    >
      <div className={theme === 'dark' ? 'dark' : ''}>
        {children}
      </div>
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
