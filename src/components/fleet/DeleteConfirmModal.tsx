import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { Truck } from '../../types';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  truck: Truck | null;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  truck,
}) => {
  if (!isOpen || !truck) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden text-slate-100 animate-in fade-in zoom-in-95">
        <div className="p-5 text-center">
          <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 mx-auto flex items-center justify-center mb-3">
            <AlertTriangle className="w-6 h-6" />
          </div>

          <h3 className="text-base font-bold text-white mb-1">
            Remover Caminhão {truck.prefix}?
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed mb-4">
            Você está prestes a desativar a composição <strong>{truck.model}</strong> (Placa {truck.plate}) alocada ao motorista <strong>{truck.driver.name}</strong>.
            Esta alteração será registrada no banco de dados local.
          </p>

          <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/60 text-xs text-left text-slate-300 mb-5 space-y-1">
            <div className="flex justify-between">
              <span>Status Operacional:</span>
              <span className="font-semibold text-white capitalize">{truck.status.replace(/_/g, ' ')}</span>
            </div>
            <div className="flex justify-between">
              <span>Carga Atual:</span>
              <span className="font-mono text-white">{truck.currentLoadTons} toneladas</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3">
            <button
              onClick={onClose}
              className="w-1/2 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
            >
              Cancelar
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="w-1/2 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-lg shadow-rose-950"
            >
              <Trash2 className="w-4 h-4" />
              <span>Sim, Remover</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

