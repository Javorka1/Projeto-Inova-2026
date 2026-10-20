import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { OfflineBanner } from './components/common/OfflineBanner';
import { KpiCards } from './components/dashboard/KpiCards';
import { DynamicDispatchMap } from './components/dashboard/DynamicDispatchMap';
import { FleetManagement } from './components/fleet/FleetManagement';
import { VirtualQueueModule } from './components/jit/VirtualQueueModule';
import { TrafficIncidentsFeed } from './components/traffic/TrafficIncidentsFeed';
import { SupplyAreaView } from './components/dashboard/SupplyAreaView';

const MainLayout: React.FC = () => {
  const { activeTab } = useApp();

  return (
    <div className="h-screen max-h-screen w-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950 overflow-hidden">
      {/* Cabeçalho com Indicadores Offline-First */}
      <Header />

      {/* Faixa Informativa se estiver em Modo Offline */}
      <OfflineBanner />

      {/* Conteúdo Principal com Sidebar */}
      <div className="flex-1 min-h-0 flex flex-col md:flex-row overflow-hidden">
        {/* Menu Lateral de Navegação (com scroll interno seguro caso a tela seja baixa) */}
        <Sidebar />

        {/* Área Central de Conteúdo e Telas */}
        <main className={`flex-1 flex flex-col min-w-0 min-h-0 bg-slate-950 ${
          activeTab === 'map' ? 'overflow-hidden' : 'overflow-y-auto'
        }`}>
          {/* Cartões Numéricos de Métricas (KPIs CTT COA) no Topo */}
          <KpiCards />

          {/* Telas Selecionadas pelo Menu Lateral */}
          <div className="flex-1 min-h-0 relative flex flex-col">
            {activeTab === 'map' && <DynamicDispatchMap />}
            {activeTab === 'fleet' && <FleetManagement />}
            {activeTab === 'jit' && <VirtualQueueModule />}
            {activeTab === 'traffic' && <TrafficIncidentsFeed />}
            {activeTab === 'supply_area' && <SupplyAreaView />}
          </div>
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
