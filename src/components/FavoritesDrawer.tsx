import React from 'react';
import { Property } from '../types';
import { X, Box, Trash2, ArrowRight } from 'lucide-react';
import { formatPrice } from '../utils/formatters';

interface FavoritesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  favoriteProperties: Property[];
  onRemoveFavorite: (id: string) => void;
  onOpenVirtualTour: (p: Property) => void;
  currency: 'COP' | 'USD';
}

export const FavoritesDrawer: React.FC<FavoritesDrawerProps> = ({
  isOpen,
  onClose,
  favoriteProperties,
  onRemoveFavorite,
  onOpenVirtualTour,
  currency
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-md bg-[#111827] border-l border-slate-800 h-full flex flex-col p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-white font-extrabold text-lg">Inmuebles Guardados</h3>
            <p className="text-slate-400 text-xs">{favoriteProperties.length} propiedades seleccionadas</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4">
          {favoriteProperties.length === 0 ? (
            <div className="text-center py-16 text-slate-400 text-xs">
              <p>Aún no has guardado propiedades favoritas.</p>
              <p className="mt-1 text-slate-500">Haz clic en el ícono de corazón en cualquier inmueble.</p>
            </div>
          ) : (
            favoriteProperties.map((prop) => (
              <div
                key={prop.id}
                className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3 flex gap-3 items-center group hover:border-[#06B6D4]/40 transition-all"
              >
                <img
                  src={prop.images[0]}
                  alt={prop.title}
                  className="w-20 h-20 rounded-xl object-cover shrink-0"
                />

                <div className="flex-1 min-w-0">
                  <h4 className="text-white font-bold text-xs truncate">{prop.title}</h4>
                  <div className="text-[#D946EF] font-bold text-xs mt-0.5">
                    {formatPrice(prop.price, currency)}
                  </div>
                  <div className="text-slate-400 text-[10px] truncate mt-0.5">
                    {prop.zone} • {prop.area} m²
                  </div>

                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => {
                        onClose();
                        onOpenVirtualTour(prop);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-[#06B6D4]/20 hover:bg-[#06B6D4]/30 text-[#06B6D4] text-[10px] font-bold flex items-center gap-1 transition-all"
                    >
                      <Box className="w-3 h-3" /> Tour 3D
                    </button>
                    <button
                      onClick={() => onRemoveFavorite(prop.id)}
                      className="p-1 rounded-lg text-slate-500 hover:text-rose-400 transition-colors"
                      title="Eliminar de favoritos"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
