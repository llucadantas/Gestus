import React from 'react';
import { Assento } from '@/src/types/assento';
import { SEAT_STATUS, SEAT_TYPES } from '@/src/constants/assentoConfig';

interface SeatItemProps {
  assento: Assento;
  onClick: () => void;
}

export function SeatItem({ assento, onClick }: SeatItemProps) {
  // Busca a configuração visual correspondente ou usa um fallback caso o banco retorne algo inesperado
  const statusConfig = SEAT_STATUS[assento.status] || SEAT_STATUS['ok'];
  const typeConfig = SEAT_TYPES[assento.tipo] || SEAT_TYPES['standard'];
  const TypeIcon = typeConfig.icon;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        relative flex flex-col items-center justify-center w-12 h-14 
        rounded-t-lg rounded-b-sm transition-all duration-200 group
        ${statusConfig.bg} border-2 ${statusConfig.border} 
        shadow-sm hover:shadow-md hover:-translate-y-1
      `}
      title={`Assento ${assento.id} - ${statusConfig.label} (${typeConfig.label})`}
    >
      <TypeIcon size={18} className={`${typeConfig.color} mb-1`} />
      
      {/* Assumindo que seu tipo Assento tem a propriedade "numero", ajuste se for "number" */}
      <span className={`text-[10px] font-bold ${statusConfig.text} bg-white/60 px-1.5 rounded-full`}>
        {assento.codigoPosicao}
      </span>

      {/* Tooltip Hover */}
      <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10 shadow-xl">
        Assento {assento.codigoPosicao} | {statusConfig.label}
      </div>
    </button>
  );
}