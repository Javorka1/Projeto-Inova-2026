import { Truck, TrafficIncident } from '../types';
import { INITIAL_TRUCKS, INITIAL_INCIDENTS } from '../data/mockData';

const TRUCKS_KEY = 'coa_ctt_trucks_v1';
const INCIDENTS_KEY = 'coa_ctt_incidents_v1';
const OFFLINE_MODE_KEY = 'coa_ctt_offline_mode_v1';
const PENDING_SYNC_KEY = 'coa_ctt_pending_sync_v1';

export interface PendingAction {
  id: string;
  type: 'CREATE_TRUCK' | 'UPDATE_TRUCK' | 'DELETE_TRUCK' | 'REPORT_INCIDENT' | 'RESOLVE_INCIDENT';
  timestamp: string;
  payload: any;
}

export const storageService = {
  // Inicialização e Carga de Caminhões
  getTrucks(): Truck[] {
    try {
      const stored = localStorage.getItem(TRUCKS_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Erro ao ler caminhões do cache local', e);
    }
    this.saveTrucks(INITIAL_TRUCKS);
    return INITIAL_TRUCKS;
  },

  saveTrucks(trucks: Truck[]) {
    try {
      localStorage.setItem(TRUCKS_KEY, JSON.stringify(trucks));
    } catch (e) {
      console.error('Erro ao gravar caminhões no cache local', e);
    }
  },

  // Incidentes
  getIncidents(): TrafficIncident[] {
    try {
      const stored = localStorage.getItem(INCIDENTS_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Erro ao ler incidentes do cache', e);
    }
    this.saveIncidents(INITIAL_INCIDENTS);
    return INITIAL_INCIDENTS;
  },

  saveIncidents(incidents: TrafficIncident[]) {
    try {
      localStorage.setItem(INCIDENTS_KEY, JSON.stringify(incidents));
    } catch (e) {
      console.error('Erro ao gravar incidentes no cache', e);
    }
  },

  // Modo Offline-First
  isOffline(): boolean {
    const stored = localStorage.getItem(OFFLINE_MODE_KEY);
    return stored ? JSON.parse(stored) : false;
  },

  setOffline(offline: boolean) {
    localStorage.setItem(OFFLINE_MODE_KEY, JSON.stringify(offline));
  },

  // Fila de Sincronização Pendente
  getPendingSyncActions(): PendingAction[] {
    try {
      const stored = localStorage.getItem(PENDING_SYNC_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  enqueuePendingAction(action: Omit<PendingAction, 'id' | 'timestamp'>) {
    const current = this.getPendingSyncActions();
    const newAction: PendingAction = {
      ...action,
      id: 'action-' + Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toISOString(),
    };
    current.push(newAction);
    localStorage.setItem(PENDING_SYNC_KEY, JSON.stringify(current));
    return current;
  },

  clearPendingSyncActions() {
    localStorage.removeItem(PENDING_SYNC_KEY);
  },

  getEstimatedStorageUsageKb(): number {
    try {
      let total = 0;
      for (const key in localStorage) {
        if (key.startsWith('coa_ctt_')) {
          total += (localStorage.getItem(key) || '').length * 2;
        }
      }
      return Math.max(12, Math.round(total / 1024));
    } catch {
      return 18;
    }
  }
};

