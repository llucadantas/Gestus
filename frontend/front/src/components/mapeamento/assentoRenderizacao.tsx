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
        rounded-t-lg rounded-b-sm transition-all duration-300 group
        ${statusConfig.bg} border ${statusConfig.border} 
        hover:shadow-[0_0_15px_rgba(124,58,237,0.2)] hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-[#7C3AED] focus:ring-offset-2 focus:ring-offset-[#0B0710]
      `}
      title={`Assento ${assento.id} - ${statusConfig.label} (${typeConfig.label})`}
    >
      <TypeIcon size={18} className={`${typeConfig.color} mb-1 transition-colors`} />
      
      {/* Assumindo que seu tipo Assento tem a propriedade "numero", ajuste se for "number" */}
      <span className={`text-[10px] font-bold ${statusConfig.text} bg-[#0B0710]/80 border border-violet-500/20 px-1.5 rounded-full shadow-sm`}>
        {assento.codigoPosicao}
      </span>

      {/* Tooltip Hover */}
      <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[#120B18] text-[#F8F8F8] border border-violet-500/20 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10 shadow-lg shadow-purple-900/20">
        Assento {assento.codigoPosicao} | {statusConfig.label}
      </div>
    </button>
  );
}