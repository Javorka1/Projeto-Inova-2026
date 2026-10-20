import React from 'react';
import { 
  Map, 
  Truck, 
  Clock, 
  AlertTriangle, 
  Compass, 
  Radio, 
  ShieldCheck, 
  Flame,
  ChevronRight,
  TrendingDown
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Sidebar: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    trucks, 
    incidents, 
    moegas 
  } = useApp();

  const activeIncidentsCount = incidents.filter(i => !i.isResolved).length;
  const criticalIncidentsCount = incidents.filter(i => !i.isResolved && i.severity === 'critica').length;
  const trucksInJitCount = trucks.filter(t => t.status === 'fila_virtual_jit').length;

  const navItems = [
    {
      id: 'map' as const,
      label: 'Despacho Dinâmico',
      sublabel: 'Mapa Vicinal de MG',
      icon: Map,
      badge: `${trucks.length} Frotas`,
      badgeColor: 'bg-emerald-950 text-emerald-400 border-emerald-700/50',
    },
    {
      id: 'fleet' as const,
      label: 'Gestão de Frotas',
      sublabel: 'Caminhões e Motoristas',
      icon: Truck,
      badge: `${trucks.length} Ativos`,
      badgeColor: 'bg-slate-800 text-slate-300 border-slate-700',
    },
    {
      id: 'jit' as const,
      label: 'Fila Virtual JIT',
      sublabel: 'Modulação de Velocidade',
      icon: Clock,
      badge: `${trucksInJitCount} em Cadência`,
      badgeColor: 'bg-amber-950 text-amber-400 border-amber-700/50',
    },
    {
      id: 'traffic' as const,
      label: 'Tráfego & Incidentes',
      sublabel: 'Atoleiros e Pontes',
      icon: AlertTriangle,
      badge: activeIncidentsCount > 0 ? `${activeIncidentsCount} Alertas` : 'Livre',
      badgeColor: criticalIncidentsCount > 0 
        ? 'bg-rose-950 text-rose-400 border-rose-700/50 animate-pulse' 
        : 'bg-amber-950 text-amber-400 border-amber-700/50',
    },
    {
      id: 'supply_area' as const,
      label: 'Área de Abastecimento',
      sublabel: 'Raio e Produtividade CTT',
      icon: Compass,
      badge: 'Isochronas MG',
      badgeColor: 'bg-blue-950 text-blue-400 border-blue-700/50',
    },
  ];

  return (
    <aside className="w-full md:w-64 bg-slate-900 border-r border-slate-800 flex flex-col shrink-0 shadow-lg h-full max-h-full">
      <div className="p-3 space-y-3 flex-1 min-h-0 overflow-y-auto">
        {/* Banner de Operação CTT */}
        <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-950/70 to-slate-900 border border-emerald-800/40 text-xs">
          <div className="flex items-center justify-between font-semibold text-emerald-300 mb-1">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              Frente de Moagem CTT
            </span>
            <span className="text-[11px] font-mono text-emerald-400">100% ATIVA</span>
          </div>
          <p className="text-slate-400 text-[11px]">
            Sincronia Colheita ➔ Transbordo ➔ Transporte em estradas vicinais.
          </p>
        </div>

        {/* Links de Navegação */}
        <nav className="space-y-1">
          <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Painéis Operacionais
          </div>
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between p-2.5 rounded-lg text-left transition-all group ${
                  isActive
                    ? 'bg-emerald-600/15 text-white border border-emerald-500/40 shadow-sm'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`p-1.5 rounded-md ${
                      isActive
                        ? 'bg-emerald-500 text-slate-950 shadow-sm'
                        : 'bg-slate-800 text-slate-400 group-hover:text-emerald-400'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-semibold truncate leading-tight">
                      {item.label}
                    </div>
                    <div className="text-[10px] text-slate-400 truncate leading-tight">
                      {item.sublabel}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0 ml-2">
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded border font-mono font-medium ${item.badgeColor}`}
                  >
                    {item.badge}
                  </span>
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Widget Rádio VHF & Canal de Despacho */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/70 shrink-0 space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1.5 font-medium text-slate-300">
            <Radio className="w-3.5 h-3.5 text-emerald-400" />
            Canal COA Rádio
          </span>
          <span className="text-[11px] font-mono text-emerald-400 font-bold">148.650 MHz</span>
        </div>
        <div className="p-2 rounded bg-slate-900 border border-slate-800 text-[11px] text-slate-400 space-y-1">
          <div className="flex justify-between">
            <span>Moegas em Operação:</span>
            <span className="font-mono text-slate-200">
              {moegas.filter(m => m.status === 'operando_normal').length} / {moegas.length}
            </span>
          </div>
          <div className="flex justify-between text-emerald-400">
            <span>Economia Diesel JIT:</span>
            <span className="font-mono font-semibold">-8.0% (-1.420L)</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

