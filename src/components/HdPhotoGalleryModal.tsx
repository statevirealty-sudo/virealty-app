import React, { useState, useEffect } from 'react';
import { Property } from '../types';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Maximize2, 
  Box, 
  Image as ImageIcon, 
  MapPin, 
  Bed, 
  Bath, 
  Maximize, 
  Download,
  Share2,
  Check
} from 'lucide-react';
import { formatPrice } from '../utils/formatters';

interface HdPhotoGalleryModalProps {
  property: Property;
  onClose: () => void;
  onOpenVirtualTour?: (property: Property) => void;
  currency: 'COP' | 'USD';
}

export const HdPhotoGalleryModal: React.FC<HdPhotoGalleryModalProps> = ({
  property,
  onClose,
  onOpenVirtualTour,
  currency
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);
  const images = property.images && property.images.length > 0 
    ? property.images 
    : ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'];

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, images.length]);

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div 
      id="modal-fotos-hd"
      className="fixed inset-0 z-50 bg-[#0B0F19]/95 backdrop-blur-2xl flex flex-col justify-between p-3 sm:p-6 animate-in fade-in duration-200"
    >
      {/* Top Header Bar */}
      <div className="flex items-center justify-between z-20 gap-4">
        <div className="flex items-center gap-3">
          <span className="bg-slate-800/90 text-white border border-slate-700 px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-2 shadow-lg">
            <ImageIcon className="w-3.5 h-3.5 text-[#06B6D4]" /> 
            Galería {images.length} Fotos HD
          </span>
          <span className="text-xs text-slate-400 font-mono hidden sm:inline-block">
            Foto {currentIndex + 1} de {images.length}
          </span>
        </div>

        {/* Center Title */}
        <div className="hidden md:block text-center truncate max-w-md">
          <h4 className="text-white text-sm font-bold truncate">{property.title}</h4>
          <span className="text-xs text-slate-400">{property.address}</span>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {property.has3DVirtualTour && onOpenVirtualTour && (
            <button
              id="btn-switch-to-3d-from-gallery"
              onClick={() => {
                onClose();
                onOpenVirtualTour(property);
              }}
              className="bg-gradient-to-r from-[#06B6D4] to-[#D946EF] text-white px-3 py-1.5 rounded-xl text-xs font-bold hover:opacity-90 transition-all flex items-center gap-1.5 shadow-lg shadow-cyan-500/20 cursor-pointer"
            >
              <Box className="w-3.5 h-3.5" />
              <span>Ver Tour 360°</span>
            </button>
          )}

          <button
            onClick={handleShare}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all border border-slate-700 cursor-pointer"
            title="Copiar enlace"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
          </button>

          <button
            id="close-hd-gallery-btn"
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white transition-all border border-slate-700 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Image Stage */}
      <div className="relative flex-1 flex items-center justify-center my-2 sm:my-4 overflow-hidden rounded-2xl">
        {/* Navigation Arrow Left */}
        <button
          id="gallery-prev-btn"
          onClick={prevImage}
          className="absolute left-2 sm:left-4 z-20 p-3 rounded-full bg-slate-900/80 hover:bg-slate-800 text-white border border-slate-700/80 backdrop-blur-md transition-all hover:scale-105 cursor-pointer shadow-2xl"
          title="Foto anterior"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Current HD Photo */}
        <div className="w-full h-full max-w-6xl max-h-[72vh] flex items-center justify-center relative">
          <img
            id="foto-activa"
            src={images[currentIndex]}
            alt={`${property.title} - Foto ${currentIndex + 1}`}
            className="max-w-full max-h-[72vh] w-auto h-auto object-contain rounded-2xl border border-slate-800 shadow-2xl transition-all duration-300"
          />

          {/* Overlay Tag in bottom left of image */}
          <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-700 text-xs text-white max-w-sm">
            <span className="font-bold block text-[#06B6D4]">{property.title}</span>
            <span className="text-[11px] text-slate-300">{property.category} • {property.zone}</span>
          </div>
        </div>

        {/* Navigation Arrow Right */}
        <button
          id="gallery-next-btn"
          onClick={nextImage}
          className="absolute right-2 sm:right-4 z-20 p-3 rounded-full bg-slate-900/80 hover:bg-slate-800 text-white border border-slate-700/80 backdrop-blur-md transition-all hover:scale-105 cursor-pointer shadow-2xl"
          title="Foto siguiente"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Bottom Filmstrip & Quick Property Specs */}
      <div className="z-20 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/90 border border-slate-800/80 rounded-2xl p-3 backdrop-blur-xl">
        {/* Thumbnails Filmstrip */}
        <div className="flex items-center gap-2 overflow-x-auto max-w-full sm:max-w-xl pb-1 sm:pb-0 scrollbar-none">
          {images.map((imgUrl, idx) => (
            <button
              key={idx}
              id={`thumb-${idx}`}
              onClick={() => setCurrentIndex(idx)}
              className={`relative shrink-0 w-16 h-12 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                idx === currentIndex
                  ? 'border-[#06B6D4] ring-2 ring-cyan-500/40 scale-105'
                  : 'border-slate-700/80 opacity-60 hover:opacity-100'
              }`}
            >
              <img src={imgUrl} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>

        {/* Property Specs summary */}
        <div className="flex items-center gap-4 text-xs text-slate-300 shrink-0">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 font-semibold text-white">
              <Maximize className="w-3.5 h-3.5 text-slate-400" /> {property.area} m²
            </span>
            <span className="flex items-center gap-1 font-semibold text-white">
              <Bed className="w-3.5 h-3.5 text-slate-400" /> {property.bedrooms} Hab
            </span>
            <span className="flex items-center gap-1 font-semibold text-white">
              <Bath className="w-3.5 h-3.5 text-slate-400" /> {property.bathrooms} Baños
            </span>
          </div>

          <div className="text-right pl-4 border-l border-slate-800">
            <span className="text-sm sm:text-base font-black text-[#D946EF] font-display">
              {formatPrice(property.price, currency)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
