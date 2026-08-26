import React, { useState } from 'react';
import { Property, PropertyCategory, ZoneLocation } from '../types';
import { 
  X, 
  CheckCircle2, 
  Sparkles,
  Building2,
  MapPin,
  DollarSign
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface AdminPublishModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPublishProperty?: (newProp: Property) => void;
}

export const AdminPublishModal: React.FC<AdminPublishModalProps> = ({
  isOpen,
  onClose,
  onPublishProperty
}) => {
  const [titulo, setTitulo] = useState('');
  const [zona, setZona] = useState<'cerritos' | 'circunvalar' | 'dosquebradas'>('cerritos');
  const [precio, setPrecio] = useState('');
  const [specs, setSpecs] = useState('');
  const [tour360, setTour360] = useState('');
  const [fotosPreviews, setFotosPreviews] = useState<string[]>([]);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const previsualizarFotos = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const filesArray: File[] = Array.from(e.target.files);

    filesArray.forEach((file: File) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setFotosPreviews(prev => [...prev, event.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeFoto = (indexToRemove: number) => {
    setFotosPreviews(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const publicarInmuebleAdmin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!titulo || !precio) return;

    const zonaNombreMap: Record<string, { zone: ZoneLocation; city: 'Pereira' | 'Dosquebradas'; address: string }> = {
      cerritos: { zone: 'Cerritos', city: 'Pereira', address: 'Km 9 Vía Cerritos, Pereira' },
      circunvalar: { zone: 'Circunvalar', city: 'Pereira', address: 'Av. Circunvalar con Calle 14, Pereira' },
      dosquebradas: { zone: 'Dosquebradas', city: 'Dosquebradas', address: 'Sector Los Rosales, Dosquebradas' }
    };

    const cleanPrice = parseInt(precio.replace(/[^0-9]/g, ''), 10) || 450000000;
    
    // Parse specs (e.g. 3 Hab • 2 Baños • 110 m²)
    const bedroomsMatch = specs.match(/(\d+)\s*hab/i);
    const bathroomsMatch = specs.match(/(\d+)\s*bañ/i);
    const areaMatch = specs.match(/(\d+)\s*m/i);

    const bedrooms = bedroomsMatch ? parseInt(bedroomsMatch[1], 10) : 3;
    const bathrooms = bathroomsMatch ? parseInt(bathroomsMatch[1], 10) : 2;
    const area = areaMatch ? parseInt(areaMatch[1], 10) : 110;

    const defaultImages = [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80'
    ];

    const finalImages = fotosPreviews.length > 0 ? fotosPreviews : defaultImages;
    const locInfo = zonaNombreMap[zona] || zonaNombreMap.cerritos;

    const panoramaUrl = tour360.trim() || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2048&q=80';

    const newProperty: Property = {
      id: `prop-custom-${Date.now()}`,
      title: titulo,
      tagline: 'Publicado recientemente vía Panel Inmobiliario ViREALTY',
      slug: titulo.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      operationType: 'comprar',
      category: 'Apartamento',
      price: cleanPrice,
      zone: locInfo.zone,
      city: locInfo.city,
      address: locInfo.address,
      area: area,
      bedrooms: bedrooms,
      bathrooms: bathrooms,
      parking: 2,
      stratum: 6,
      has3DVirtualTour: true,
      featured: true,
      images: finalImages,
      panoramas: [
        {
          id: 'room-main',
          name: 'Sala & Espacios Principales',
          roomType: 'living',
          url: panoramaUrl,
          description: 'Vista inmersiva 360° de la propiedad.',
          hotspots: []
        }
      ],
      description: `Exclusiva propiedad publicada en ${locInfo.address}. Diseñada con arquitectura de vanguardia, acabados de lujo y vistas inigualables. ${specs}`,
      features: [
        'Vigilancia 24/7',
        'Piscina Infinity',
        'Club House',
        'Zonas Verdes',
        'Smart Home Ready',
        'Acabados de Lujo'
      ],
      virtualTourLiveAvailable: true,
      financialHighlights: {
        adminFee: 450000,
        predialTaxYear: Math.round(cleanPrice * 0.008),
        estimatedMonthlyRent: Math.round(cleanPrice * 0.008),
        estimatedAirbnbDaily: Math.round((cleanPrice * 0.008) / 18),
        expectedOccupancyRate: 78,
        annualAppreciation: 9.8,
        capRate: 8.5
      },
      neighborhoodScores: {
        safety: 9.4,
        access: 9.1,
        commerce: 8.8,
        greenAreas: 9.6
      }
    };

    if (onPublishProperty) {
      onPublishProperty(newProperty);
    }

    setIsSuccess(true);
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.6 }
    });
  };

  const handleFinish = () => {
    setIsSuccess(false);
    setTitulo('');
    setPrecio('');
    setSpecs('');
    setTour360('');
    setFotosPreviews([]);
    onClose();
  };

  return (
    <div 
      id="modal-admin-publicar" 
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="bg-[#111827] max-w-2xl w-full p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl relative my-8 text-white animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          id="btn-close-modal-admin"
          onClick={onClose} 
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-slate-800/60 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto mb-2">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <span className="inline-block text-emerald-400 text-xs font-bold uppercase tracking-wider bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              ¡Publicación Exitosa!
            </span>
            <h3 className="text-2xl font-black text-white">Inmueble Activo en ViREALTY</h3>
            <p className="text-slate-300 text-xs leading-relaxed max-w-md mx-auto">
              La propiedad <strong className="text-white">"{titulo}"</strong> ha sido añadida correctamente al catálogo de propiedades con sus fotografías y recorrido inmersivo.
            </p>

            <div className="pt-3">
              <button
                onClick={handleFinish}
                className="w-full bg-gradient-to-r from-[#06B6D4] to-[#D946EF] text-white font-bold py-3 rounded-xl hover:opacity-90 transition-all text-xs cursor-pointer shadow-lg shadow-cyan-500/20"
              >
                Ver Inmueble en el Catálogo
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-[#06B6D4]/20 text-[#06B6D4] text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                Panel Inmobiliario
              </span>
            </div>
            <h3 className="text-xl font-bold text-white mb-1">Publicar Nuevo Inmueble en ViREALTY</h3>
            <p className="text-slate-400 text-xs mb-6">Sube las fotografías de la propiedad o vincula el recorrido virtual 360°.</p>

            <form id="form-publicar-admin" onSubmit={publicarInmuebleAdmin} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Título del Inmueble</label>
                  <input 
                    type="text" 
                    id="admin-titulo" 
                    required 
                    placeholder="Ej: Penthouse Moderno en Cerritos" 
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#06B6D4]" 
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Zona / Ubicación</label>
                  <select 
                    id="admin-zona" 
                    value={zona}
                    onChange={(e) => setZona(e.target.value as any)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#06B6D4]"
                  >
                    <option value="cerritos">Cerritos</option>
                    <option value="circunvalar">Circunvalar</option>
                    <option value="dosquebradas">Dosquebradas</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Precio de Lista (COP)</label>
                  <input 
                    type="text" 
                    id="admin-precio" 
                    required 
                    placeholder="$450.000.000" 
                    value={precio}
                    onChange={(e) => setPrecio(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#06B6D4]" 
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Especificaciones (Hab / Baños / m²)</label>
                  <input 
                    type="text" 
                    id="admin-specs" 
                    required 
                    placeholder="3 Hab • 2 Baños • 110 m²" 
                    value={specs}
                    onChange={(e) => setSpecs(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#06B6D4]" 
                  />
                </div>
              </div>

              {/* CARGA DE IMÁGENES / FOTOS DE LA PROPIEDAD */}
              <div>
                <label className="text-xs text-slate-400 block mb-1">Fotografías del Inmueble (Subir archivos)</label>
                <input 
                  type="file" 
                  id="admin-fotos" 
                  accept="image/*" 
                  multiple 
                  onChange={previsualizarFotos} 
                  className="w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-[#06B6D4] hover:file:bg-slate-700 cursor-pointer bg-slate-900 border border-slate-700 rounded-xl" 
                />
                
                {/* Contenedor de Previews */}
                <div id="contenedor-previews" className="flex gap-2 mt-3 overflow-x-auto py-1 empty:hidden">
                  {fotosPreviews.map((previewUrl, idx) => (
                    <div key={idx} className="relative group shrink-0 w-20 h-20 rounded-xl overflow-hidden border border-slate-700">
                      <img src={previewUrl} alt={`Foto ${idx + 1}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeFoto(idx)}
                        className="absolute top-1 right-1 bg-red-500/80 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Eliminar foto"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* ENLACE A RECORRIDO VIRTUAL 360° */}
              <div className="pt-2 border-t border-slate-800">
                <label className="text-xs text-[#06B6D4] font-semibold block mb-1">Enlace / iFrame Recorrido 360° (Matterport, Kuula, etc.)</label>
                <input 
                  type="url" 
                  id="admin-tour360" 
                  placeholder="https://my.matterport.com/show/?m=ejemplo" 
                  value={tour360}
                  onChange={(e) => setTour360(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#D946EF]" 
                />
                <span className="text-[10px] text-slate-500 block mt-1">Si cuentas con recorrido virtual 360°, pega la URL aquí para habilitar la experiencia inmersiva.</span>
              </div>

              <button 
                type="submit" 
                className="w-full bg-gradient-to-r from-[#06B6D4] to-[#D946EF] text-white font-semibold py-3 rounded-xl hover:opacity-90 transition-all text-xs mt-4 cursor-pointer shadow-lg shadow-cyan-500/20"
              >
                🚀 Publicar Inmueble en el Catálogo
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
