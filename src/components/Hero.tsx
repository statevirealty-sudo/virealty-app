import React, { useState } from 'react';
import { 
  Sparkles, 
  Compass, 
  MapPin, 
  Search, 
  Camera, 
  Video 
} from 'lucide-react';
import { SearchFilters } from '../types';

interface HeroProps {
  onSearchSubmit: (filters: Partial<SearchFilters>) => void;
  onOpenLiveTourModal: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onSearchSubmit, onOpenLiveTourModal }) => {
  const [operationType, setOperationType] = useState<string>('comprar');
  const [zone, setZone] = useState<string>('Todas');
  const [experienceType, setExperienceType] = useState<'all' | '3d' | 'photos'>('all');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchSubmit({
      operationType: operationType === 'todos' ? 'Todos' : operationType,
      zone: zone === 'Todas' ? '' : zone,
      experienceType,
      only3D: experienceType === '3d'
    });
    // Scroll smoothly to properties section
    const el = document.getElementById('propiedades');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="inicio" className="pt-32 pb-16 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#06B6D4]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-[#D946EF]/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Main Title & Hero Copy */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#06B6D4]/30 bg-[#06B6D4]/10 text-[#06B6D4] text-xs font-semibold tracking-wide uppercase mb-6 shadow-lg shadow-cyan-500/10">
            <Sparkles className="w-3.5 h-3.5" /> Inmobiliaria 100% Digital
          </span>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white mb-6 leading-tight font-display">
            El futuro inmobiliario es <span className="gradient-text">sin desplazamientos.</span>
          </h1>
          <p className="text-slate-400 text-lg sm:text-xl leading-relaxed">
            Explora inmuebles en fotos HD o tours 360°, calcula tu cuota mensual en vivo y agenda visitas guiadas por videollamada.
          </p>
        </div>

        {/* BUSCADOR INTELIGENTE */}
        <div className="max-w-4xl mx-auto bg-[#111827]/90 backdrop-blur-xl p-6 sm:p-8 rounded-3xl gradient-border shadow-2xl">
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Paso 1: Operación */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-[#06B6D4]" /> Operación
              </label>
              <select
                id="hero-search-operation"
                value={operationType}
                onChange={(e) => setOperationType(e.target.value)}
                className="bg-slate-900 border border-slate-700 text-white text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#06B6D4]"
              >
                <option value="comprar">Comprar Inmueble</option>
                <option value="planos">Sobre Planos</option>
                <option value="renta">Rentar</option>
              </select>
            </div>

            {/* Paso 2: Ubicación */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#D946EF]" /> Ubicación
              </label>
              <select
                id="hero-search-zone"
                value={zone}
                onChange={(e) => setZone(e.target.value)}
                className="bg-slate-900 border border-slate-700 text-white text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#D946EF]"
              >
                <option value="Todas">Todas las Zonas</option>
                <option value="Circunvalar">Pereira (Circunvalar)</option>
                <option value="Cerritos">Cerritos</option>
                <option value="Dosquebradas">Dosquebradas</option>
                <option value="Pinares">Pinares</option>
                <option value="Álamos">Álamos / UTP</option>
                <option value="La Julita">La Julita</option>
              </select>
            </div>

            {/* Paso 3: Experiencia */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-[#06B6D4]" /> Experiencia
              </label>
              <select
                id="hero-search-experience"
                value={experienceType}
                onChange={(e) => setExperienceType(e.target.value as any)}
                className="bg-slate-900 border border-slate-700 text-white text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#06B6D4]"
              >
                <option value="all">Todas las propiedades</option>
                <option value="3d">Solo con Tour 360°</option>
                <option value="photos">Galería Fotos HD</option>
              </select>
            </div>

            {/* Botón Buscar */}
            <div className="flex items-end">
              <button
                id="hero-search-btn"
                type="submit"
                className="w-full bg-gradient-to-r from-[#06B6D4] to-[#D946EF] text-white font-semibold py-2.5 rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-cyan-500/20"
              >
                <Search className="w-4 h-4" /> Buscar
              </button>
            </div>
          </form>
        </div>

        {/* Quick Highlights Stats */}
        <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <div className="bg-[#111827]/60 border border-slate-800/80 rounded-2xl p-4 text-center backdrop-blur-md">
            <span className="text-2xl sm:text-3xl font-black text-white font-display block mb-1">100%</span>
            <span className="text-xs text-slate-400">Digital & Sin Filas</span>
          </div>
          <div className="bg-[#111827]/60 border border-slate-800/80 rounded-2xl p-4 text-center backdrop-blur-md">
            <span className="text-2xl sm:text-3xl font-black text-[#06B6D4] font-display block mb-1">360°</span>
            <span className="text-xs text-slate-400">Tours en 4K UHD</span>
          </div>
          <div className="bg-[#111827]/60 border border-slate-800/80 rounded-2xl p-4 text-center backdrop-blur-md">
            <span className="text-2xl sm:text-3xl font-black text-[#D946EF] font-display block mb-1">+14.2%</span>
            <span className="text-xs text-slate-400">ROI Máximo Proyectado</span>
          </div>
          <div className="bg-[#111827]/60 border border-slate-800/80 rounded-2xl p-4 text-center backdrop-blur-md">
            <span className="text-2xl sm:text-3xl font-black text-[#8B5CF6] font-display block mb-1">24h</span>
            <span className="text-xs text-slate-400">Aprobación de Crédito</span>
          </div>
        </div>
      </div>
    </section>
  );
};
