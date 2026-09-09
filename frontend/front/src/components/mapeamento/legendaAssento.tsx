import React from 'react';
import { SEAT_STATUS, SEAT_TYPES } from '@/src/constants/assentoConfig';

export function SeatLegend() {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-5">
        Legenda do Mapa
      </h3>

      <div className="space-y-5">
        {/* SITUAÇÃO */}
        <div>
          <h4 className="text-[11px] font-semibold text-slate-400 mb-2.5 uppercase tracking-wider">
            Situação
          </h4>
          <div className="grid grid-cols-2 gap-3">
            {Object.values(SEAT_STATUS).map((status) => (
              <div key={status.id} className="flex items-center gap-2.5 text-sm text-slate-600">
                <div
                  className={`w-3.5 h-3.5 rounded-full ${status.bg.split(' ')[0]} border ${status.border}`}
                />
                {status.label}
              </div>
            ))}
          </div>
        </div>

        {/* TIPOS */}
        <div className="pt-5 border-t border-slate-100">
          <h4 className="text-[11px] font-semibold text-slate-400 mb-2.5 uppercase tracking-wider">
            Tipos
          </h4>
          <div className="grid grid-cols-2 gap-3">
            {Object.values(SEAT_TYPES).map((type) => {
              const Icon = type.icon;
              return (
                <div key={type.id} className="flex items-center gap-2.5 text-sm text-slate-600">
                  <Icon size={16} className={type.color} />
                  {type.label}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}