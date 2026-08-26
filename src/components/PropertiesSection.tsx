import React, { useState } from 'react';
import { Property, SearchFilters } from '../types';
import { 
  Box, 
  Eye, 
  MapPin, 
  Maximize, 
  Bed, 
  Bath, 
  Sparkles, 
  Video, 
  SlidersHorizontal, 
  Heart,
  Layers,
  Image as ImageIcon,
  Images
} from 'lucide-react';
import { formatPrice } from '../utils/formatters';

interface PropertiesSectionProps {
  properties: Property[];
  filters: SearchFilters;
  onFilterChange: (newFilters: Partial<SearchFilters>) => void;
  onOpenVirtualTour: (property: Property) => void;
  onOpenPhotoGallery: (property: Property) => void;
  onOpenPropertyDetail: (property: Property) => void;
  onOpenLiveTour: (property: Property) => void;
  currency: 'COP' | 'USD';
  favoriteIds: string[];
  onToggleFavorite: (id: string) => void;
}

export const PropertiesSection: React.FC<PropertiesSectionProps> = ({
  properties,
  filters,
  onFilterChange,
  onOpenVirtualTour,
  onOpenPhotoGallery,
  onOpenPropertyDetail,
  onOpenLiveTour,
  currency,
  favoriteIds,
  onToggleFavorite
}) => {
  const [activeTab, setActiveTab] = useState<'all' | '3d' | 'photos' | 'planos'>('all');

  // Filter properties based on search state and active tab
  const filteredProperties = properties.filter((p) => {
    if (activeTab === '3d' && !p.has3DVirtualTour) return false;
    if (activeTab === 'photos' && p.has3DVirtualTour && p.operationType === 'planos') return false;
    if (activeTab === 'planos' && p.operationType !== 'planos') return false;

    if (filters.experienceType === '3d' && !p.has3DVirtualTour) return false;
    if (filters.experienceType === 'photos' && p.onPlans) return false;

    if (filters.operationType && filters.operationType !== 'Todos' && p.operationType !== filters.operationType) {
      return false;
    }
    if (filters.zone && filters.zone !== 'Todas' && !p.zone.includes(filters.zone)) {
      return false;
    }
    if (filters.category && filters.category !== 'Todas' && p.category !== filters.category) {
      return false;
    }
    if (filters.minBedrooms > 0 && p.bedrooms < filters.minBedrooms) {
      return false;
    }
    if (filters.budgetRange) {
      if (filters.budgetRange === 'under250' && p.price > 250000000) return false;
      if (filters.budgetRange === '250to500' && (p.price < 250000000 || p.price > 500000000)) return false;
      if (filters.budgetRange === 'over500' && p.price < 500000000) return false;
    }
    return true;
  });

  return (
    <section id="propiedades" className="py-16 bg-slate-950/50 border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2 font-display">
              Catálogo Inmobiliario
            </h2>
            <p className="text-slate-400 text-sm">
              Combina recorridos virtuales 3D o galerías fotográficas de alta resolución.
            </p>
          </div>

          {/* Quick Filter Tabs */}
          <div className="flex flex-wrap gap-2">
            <button
              id="filter-tab-all"
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-slate-800 text-white border border-slate-700 shadow-md'
                  : 'bg-slate-900/60 text-slate-400 hover:text-white border border-transparent'
              }`}
            >
              Todos ({properties.length})
            </button>
            <button
              id="filter-tab-3d"
              onClick={() => setActiveTab('3d')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === '3d'
                  ? 'bg-[#06B6D4]/20 text-[#06B6D4] border border-[#06B6D4]/50 font-bold shadow-lg shadow-cyan-500/10'
                  : 'bg-slate-900/60 text-slate-400 hover:text-white border border-transparent'
              }`}
            >
              <Box className="w-3.5 h-3.5" /> Con Tour 360°
            </button>
            <button
              id="filter-tab-photos"
              onClick={() => setActiveTab('photos')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'photos'
                  ? 'bg-slate-800 text-slate-200 border border-slate-600 font-bold shadow-md'
                  : 'bg-slate-900/60 text-slate-400 hover:text-white border border-transparent'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" /> Galerías Fotos HD
            </button>
            <button
              id="filter-tab-planos"
              onClick={() => setActiveTab('planos')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'planos'
                  ? 'bg-[#D946EF]/20 text-[#D946EF] border border-[#D946EF]/50 font-bold shadow-lg shadow-fuchsia-500/10'
                  : 'bg-slate-900/60 text-slate-400 hover:text-white border border-transparent'
              }`}
            >
              Sobre Planos
            </button>
          </div>
        </div>

        {/* FILTROS POR ZONA */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button 
            id="filtro-zona-todas"
            onClick={() => onFilterChange({ zone: 'Todas' })} 
            className={`btn-filtro text-xs px-4 py-2 rounded-xl transition-all cursor-pointer ${
              filters.zone === 'Todas' || !filters.zone
                ? 'bg-[#06B6D4] text-white border border-[#06B6D4] font-semibold shadow-md shadow-cyan-500/20'
                : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
            }`}
          >
            Todas
          </button>
          <button 
            id="filtro-zona-cerritos"
            onClick={() => onFilterChange({ zone: 'Cerritos' })} 
            className={`btn-filtro text-xs px-4 py-2 rounded-xl transition-all cursor-pointer ${
              filters.zone === 'Cerritos'
                ? 'bg-[#06B6D4] text-white border border-[#06B6D4] font-semibold shadow-md shadow-cyan-500/20'
                : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
            }`}
          >
            Cerritos
          </button>
          <button 
            id="filtro-zona-circunvalar"
            onClick={() => onFilterChange({ zone: 'Circunvalar' })} 
            className={`btn-filtro text-xs px-4 py-2 rounded-xl transition-all cursor-pointer ${
              filters.zone === 'Circunvalar'
                ? 'bg-[#06B6D4] text-white border border-[#06B6D4] font-semibold shadow-md shadow-cyan-500/20'
                : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
            }`}
          >
            Circunvalar
          </button>
          <button 
            id="filtro-zona-dosquebradas"
            onClick={() => onFilterChange({ zone: 'Dosquebradas' })} 
            className={`btn-filtro text-xs px-4 py-2 rounded-xl transition-all cursor-pointer ${
              filters.zone === 'Dosquebradas'
                ? 'bg-[#06B6D4] text-white border border-[#06B6D4] font-semibold shadow-md shadow-cyan-500/20'
                : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
            }`}
          >
            Dosquebradas
          </button>
        </div>

        {/* PROPERTY CARDS GRID */}
        {filteredProperties.length === 0 ? (
          <div className="bg-[#111827] border border-slate-800 rounded-3xl p-12 text-center my-6">
            <SlidersHorizontal className="w-10 h-10 text-slate-500 mx-auto mb-3" />
            <h4 className="text-white font-bold text-lg mb-1">No se encontraron propiedades con estos filtros</h4>
            <p className="text-slate-400 text-xs mb-4">Intenta restablecer tus criterios de búsqueda o explorar todas las opciones.</p>
            <button
              onClick={() => {
                setActiveTab('all');
                onFilterChange({ operationType: 'Todos', zone: 'Todas', budgetRange: '', category: 'Todas', experienceType: 'all' });
              }}
              className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold cursor-pointer"
            >
              Ver Todas las Propiedades
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProperties.map((property, idx) => {
              const isFav = favoriteIds.includes(property.id);
              const is3D = property.has3DVirtualTour;
              const photoCount = property.images?.length || 8;

              return (
                <div
                  key={property.id}
                  id={`property-card-${property.id}`}
                  className="bg-[#111827] rounded-2xl overflow-hidden border border-slate-800 hover:border-[#06B6D4]/50 transition-all duration-300 group shadow-xl flex flex-col justify-between"
                >
                  {/* Top Image & Interactive Launch */}
                  <div>
                    <div 
                      className="relative h-64 bg-slate-900 overflow-hidden cursor-pointer"
                      onClick={() => is3D ? onOpenVirtualTour(property) : onOpenPhotoGallery(property)}
                    >
                      <img
                        src={property.images[0]}
                        alt={property.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                      />

                      {/* Badge in top left */}
                      {is3D ? (
                        <span className="absolute top-4 left-4 bg-[#0B0F19]/90 backdrop-blur-md text-[#06B6D4] border border-[#06B6D4]/30 text-xs px-3 py-1 rounded-full font-semibold flex items-center gap-1.5 shadow-lg">
                          <Box className="w-3.5 h-3.5" /> Tour Virtual 360°
                        </span>
                      ) : (
                        <span className="absolute top-4 left-4 bg-[#0B0F19]/90 backdrop-blur-md text-slate-300 border border-slate-700 text-xs px-3 py-1 rounded-full font-semibold flex items-center gap-1.5 shadow-lg">
                          <ImageIcon className="w-3.5 h-3.5" /> Galería {photoCount} Fotos HD
                        </span>
                      )}

                      {/* Favorite Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleFavorite(property.id);
                        }}
                        className={`absolute top-4 right-4 p-2.5 rounded-full backdrop-blur-md border transition-all cursor-pointer z-10 ${
                          isFav
                            ? 'bg-[#D946EF]/20 border-[#D946EF] text-[#D946EF]'
                            : 'bg-black/40 border-white/20 text-white hover:bg-black/60'
                        }`}
                        title="Guardar favorito"
                      >
                        <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
                      </button>

                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#111827] via-transparent to-transparent pointer-events-none" />

                      {/* Bottom action trigger on image */}
                      {is3D ? (
                        <div className="absolute bottom-4 right-4 bg-[#06B6D4]/20 hover:bg-[#06B6D4]/40 text-[#06B6D4] border border-[#06B6D4]/40 backdrop-blur-md p-2 rounded-xl transition-all flex items-center gap-1.5 text-xs font-semibold px-3.5 shadow-lg">
                          <Eye className="w-3.5 h-3.5" /> Probar 360°
                        </div>
                      ) : (
                        <div className="absolute bottom-4 right-4 bg-slate-800/80 hover:bg-slate-700/80 text-white border border-slate-600 backdrop-blur-md p-2 rounded-xl transition-all flex items-center gap-1.5 text-xs font-semibold px-3.5 shadow-lg">
                          <Images className="w-3.5 h-3.5" /> Ver Galería
                        </div>
                      )}
                    </div>

                    {/* Card Content */}
                    <div className="p-6">
                      <div className="text-[#D946EF] font-bold text-xl mb-1 font-display">
                        {formatPrice(property.price, currency)}
                      </div>

                      <h3 className="text-white font-semibold text-lg mb-2 line-clamp-1 group-hover:text-[#06B6D4] transition-colors">
                        {property.title} {property.onPlans ? '(Sobre Planos)' : '(Disponible)'}
                      </h3>

                      <p className="text-slate-400 text-xs mb-4 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#06B6D4] shrink-0" />
                        <span className="truncate">{property.address}</span>
                      </p>

                      {/* Specs Row */}
                      <div className="flex items-center justify-between text-xs text-slate-300 pt-4 border-t border-slate-800">
                        <span className="flex items-center gap-1">
                          <Maximize className="w-4 h-4 text-slate-500" /> {property.area} m²
                        </span>
                        <span className="flex items-center gap-1">
                          <Bed className="w-4 h-4 text-slate-500" /> {property.bedrooms} Hab
                        </span>
                        <span className="flex items-center gap-1">
                          <Bath className="w-4 h-4 text-slate-500" /> {property.bathrooms} Baños
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card Actions Bottom */}
                  <div className="p-6 pt-0 flex gap-2">
                    {is3D ? (
                      <button
                        id={`btn-card-tour-${property.id}`}
                        onClick={() => onOpenVirtualTour(property)}
                        className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#06B6D4] to-[#D946EF] text-white font-bold text-xs hover:opacity-90 transition-all glow-effect flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-cyan-500/10"
                      >
                        <Box className="w-4 h-4" />
                        Tour 360°
                      </button>
                    ) : (
                      <button
                        id={`btn-card-gallery-${property.id}`}
                        onClick={() => onOpenPhotoGallery(property)}
                        className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-all border border-slate-700 flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <ImageIcon className="w-4 h-4" />
                        Ver Fotos HD
                      </button>
                    )}

                    <button
                      id={`btn-card-detail-${property.id}`}
                      onClick={() => onOpenPropertyDetail(property)}
                      className="px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold transition-all border border-slate-800 cursor-pointer"
                    >
                      Detalles
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
