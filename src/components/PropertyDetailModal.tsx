import React, { useState } from 'react';
import { Property } from '../types';
import { 
  X, 
  MapPin, 
  Maximize, 
  Bed, 
  Bath, 
  Car, 
  ShieldCheck, 
  Sparkles, 
  PhoneCall, 
  Video, 
  FileText, 
  Compass, 
  Check, 
  ArrowUpRight, 
  TrendingUp, 
  Building2,
  CalendarCheck,
  Share2
} from 'lucide-react';
import { formatPrice, formatCOP } from '../utils/formatters';

interface PropertyDetailModalProps {
  property: Property;
  onClose: () => void;
  onOpenVirtualTour: (p: Property) => void;
  onOpenLiveTour: (p: Property) => void;
  onOpenSchedule?: (p: Property) => void;
  currency: 'COP' | 'USD';
  onToggleFavorite: (id: string) => void;
  isFavorite: boolean;
}

export const PropertyDetailModal: React.FC<PropertyDetailModalProps> = ({
  property,
  onClose,
  onOpenVirtualTour,
  onOpenLiveTour,
  onOpenSchedule,
  currency,
  onToggleFavorite,
  isFavorite
}) => {
  const [activeImageIdx, setActiveImageIdx] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsApp = () => {
    const text = encodeURIComponent(`¡Hola ViREALTY! Estoy interesado en el inmueble "${property.title}" (${property.address}) con valor ${formatPrice(property.price, currency)}. Deseo más información y agendar visita.`);
    window.open(`https://wa.me/573100000000?text=${text}`, '_blank');
  };

  return (
    <div 
      id="property-detail-modal"
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-2 sm:p-4 overflow-y-auto"
    >
      <div className="relative w-full max-w-5xl bg-[#111827] border border-slate-700 rounded-3xl overflow-hidden shadow-2xl flex flex-col my-auto max-h-[92vh]">
        {/* TOP HEADER */}
        <div className="px-6 py-4 bg-[#0B0F19] border-b border-slate-800 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <span className="bg-[#06B6D4]/20 border border-[#06B6D4]/40 text-[#06B6D4] text-xs font-bold px-3 py-1 rounded-full uppercase">
              {property.category}
            </span>
            <h2 className="text-white font-extrabold text-lg sm:text-xl truncate max-w-md">
              {property.title}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all border border-slate-700"
              title="Compartir"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all border border-slate-700 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* MODAL BODY (Scrollable) */}
        <div className="overflow-y-auto p-6 space-y-8">
          {/* Main Gallery Stage */}
          <div className="space-y-3">
            <div className="relative h-72 sm:h-96 rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 group">
              <img 
                src={property.images[activeImageIdx]} 
                alt={property.title} 
                className="w-full h-full object-cover transition-all duration-500"
              />

              {/* Badges overlay */}
              <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                <span className="bg-[#0B0F19]/80 backdrop-blur-md text-[#06B6D4] border border-[#06B6D4]/30 text-xs px-3 py-1 rounded-full font-semibold flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5" /> Estrato {property.stratum}
                </span>
                <span className="bg-[#D946EF]/20 border border-[#D946EF]/40 text-[#D946EF] text-xs px-3 py-1 rounded-full font-bold">
                  ROI Est. {property.financialHighlights.capRate}%
                </span>
              </div>

              {/* Floating 3D Tour launch button */}
              <button
                id="modal-launch-3d"
                onClick={() => {
                  onClose();
                  onOpenVirtualTour(property);
                }}
                className="absolute bottom-4 right-4 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#06B6D4] to-[#D946EF] text-white font-bold text-xs hover:opacity-90 transition-all glow-effect flex items-center gap-2 cursor-pointer shadow-2xl"
              >
                <Sparkles className="w-4 h-4" />
                Abrir Tour Virtual 360°
              </button>
            </div>

            {/* Thumbnail selector */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
              {property.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIdx(idx)}
                  className={`w-24 h-16 rounded-xl overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${
                    activeImageIdx === idx ? 'border-[#06B6D4] opacity-100 scale-105' : 'border-slate-800 opacity-60 hover:opacity-90'
                  }`}
                >
                  <img src={img} alt="Miniatura" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Quick Specs Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-900/80 p-4 sm:p-6 rounded-2xl border border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#06B6D4]/10 text-[#06B6D4] flex items-center justify-center">
                <Maximize className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block">Área Total</span>
                <strong className="text-white text-sm">{property.area} m²</strong>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#D946EF]/10 text-[#D946EF] flex items-center justify-center">
                <Bed className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block">Habitaciones</span>
                <strong className="text-white text-sm">{property.bedrooms} Dormitorios</strong>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#8B5CF6]/10 text-[#8B5CF6] flex items-center justify-center">
                <Bath className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block">Baños</span>
                <strong className="text-white text-sm">{property.bathrooms} Baños</strong>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
                <Car className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block">Parqueaderos</span>
                <strong className="text-white text-sm">{property.parking} Cubiertos</strong>
              </div>
            </div>
          </div>

          {/* Details & Features */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h3 className="text-lg font-bold text-white mb-2">Descripción General</h3>
                <p className="text-slate-300 text-sm leading-relaxed">{property.description}</p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white mb-3">Características & Equipamiento</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {property.features.map((feat, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-slate-300 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                      <Check className="w-4 h-4 text-[#06B6D4] shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Neighborhood Scores */}
              <div>
                <h3 className="text-lg font-bold text-white mb-3">Índice del Sector ({property.zone})</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-slate-900/70 p-3 rounded-xl border border-slate-800 text-center">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Seguridad</span>
                    <span className="text-emerald-400 font-black text-lg">{property.neighborhoodScores.safety}/100</span>
                  </div>
                  <div className="bg-slate-900/70 p-3 rounded-xl border border-slate-800 text-center">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Vías de Acceso</span>
                    <span className="text-[#06B6D4] font-black text-lg">{property.neighborhoodScores.access}/100</span>
                  </div>
                  <div className="bg-slate-900/70 p-3 rounded-xl border border-slate-800 text-center">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Comercio</span>
                    <span className="text-[#D946EF] font-black text-lg">{property.neighborhoodScores.commerce}/100</span>
                  </div>
                  <div className="bg-slate-900/70 p-3 rounded-xl border border-slate-800 text-center">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Zonas Verdes</span>
                    <span className="text-emerald-400 font-black text-lg">{property.neighborhoodScores.greenAreas}/100</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Price & Purchase Card */}
            <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-3xl space-y-6 h-fit">
              <div>
                <span className="text-xs text-slate-400 block mb-1">Precio de Venta</span>
                <div className="text-2xl sm:text-3xl font-black text-[#D946EF] font-display">
                  {formatPrice(property.price, currency)}
                </div>
                <span className="text-xs text-slate-400">
                  {formatCOP(Math.round(property.price / property.area))} / m²
                </span>
              </div>

              <div className="space-y-3 pt-3 border-t border-slate-800 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>Administración mensual:</span>
                  <strong className="text-white font-mono">{formatCOP(property.financialHighlights.adminFee)}</strong>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Impuesto predial anual:</span>
                  <strong className="text-white font-mono">{formatCOP(property.financialHighlights.predialTaxYear)}</strong>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Renta mensual estimada:</span>
                  <strong className="text-emerald-400 font-mono">{formatCOP(property.financialHighlights.estimatedMonthlyRent)}</strong>
                </div>
              </div>

              <div className="space-y-2.5 pt-2">
                <button
                  id="detail-schedule-btn"
                  onClick={() => {
                    onClose();
                    if (onOpenSchedule) onOpenSchedule(property);
                  }}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-[#06B6D4] to-[#D946EF] text-white font-bold text-xs hover:opacity-90 transition-all glow-effect flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-cyan-500/20"
                >
                  <CalendarCheck className="w-4 h-4" />
                  Agendar Visita Virtual
                </button>

                <button
                  id="detail-whatsapp-btn"
                  onClick={handleWhatsApp}
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all cursor-pointer"
                >
                  <PhoneCall className="w-4 h-4" />
                  Contactar por WhatsApp
                </button>

                <button
                  id="detail-live-advisor-btn"
                  onClick={() => {
                    onClose();
                    onOpenLiveTour(property);
                  }}
                  className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Video className="w-4 h-4 text-[#06B6D4]" />
                  Conectar con Asesor Live
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
