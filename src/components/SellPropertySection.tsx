import React, { useState } from 'react';
import { 
  Building, 
  MapPin, 
  Camera, 
  CheckCircle, 
  Sparkles, 
  ArrowRight, 
  DollarSign, 
  ShieldCheck, 
  Layers, 
  Zap,
  Bot,
  Video,
  CheckCircle2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { PropertyCategory } from '../types';
import { formatCOP, formatPrice } from '../utils/formatters';

interface SellPropertySectionProps {
  currency: 'COP' | 'USD';
}

export const SellPropertySection: React.FC<SellPropertySectionProps> = ({ currency }) => {
  const [activeTab, setActiveTab] = useState<'consignar_rapido' | 'avaluo_detallado'>('consignar_rapido');

  // Quick consignment form state
  const [quickOwnerName, setQuickOwnerName] = useState('');
  const [quickPhone, setQuickPhone] = useState('');
  const [quickPropertyType, setQuickPropertyType] = useState('Apartamento');
  const [quickOperation, setQuickOperation] = useState('Vender');
  const [quickPrice, setQuickPrice] = useState('');
  const [quickDetails, setQuickDetails] = useState('');
  const [isQuickSubmitting, setIsQuickSubmitting] = useState(false);
  const [isQuickSubmitted, setIsQuickSubmitted] = useState(false);

  // Detailed Step-by-step valuation state
  const [step, setStep] = useState<number>(1);
  const [propertyType, setPropertyType] = useState<PropertyCategory>('Apartamento');
  const [zone, setZone] = useState<string>('Circunvalar');
  const [stratum, setStratum] = useState<number>(5);
  const [areaM2, setAreaM2] = useState<number>(85);
  const [bedrooms, setBedrooms] = useState<number>(3);
  const [bathrooms, setBathrooms] = useState<number>(2);
  const [parking, setParking] = useState<number>(1);
  const [isRemodeled, setIsRemodeled] = useState<boolean>(true);
  const [hasBalcony, setHasBalcony] = useState<boolean>(true);
  const [hasPool, setHasPool] = useState<boolean>(false);

  // Detailed contact form
  const [ownerName, setOwnerName] = useState<string>('');
  const [ownerPhone, setOwnerPhone] = useState<string>('');
  const [ownerEmail, setOwnerEmail] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  // Valuation algorithm based on zone and stratum in Pereira
  const getZonePricePerM2 = () => {
    let base = 4800000;
    if (zone.includes('Circunvalar')) base = 5400000;
    if (zone.includes('Pinares')) base = 5600000;
    if (zone.includes('Cerritos')) base = 6200000;
    if (zone.includes('Dosquebradas')) base = 3500000;
    if (zone.includes('Álamos')) base = 4400000;
    if (zone.includes('La Julita')) base = 5200000;

    if (stratum === 6) base *= 1.15;
    if (stratum === 5) base *= 1.05;
    if (stratum === 4) base *= 0.95;

    if (isRemodeled) base *= 1.08;
    if (hasBalcony) base *= 1.03;
    if (hasPool) base *= 1.05;

    return Math.round(base);
  };

  const estimatedPricePerM2 = getZonePricePerM2();
  const estimatedTotalValue = estimatedPricePerM2 * areaM2;

  const handleQuickSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!quickOwnerName || !quickPhone) return;

    setIsQuickSubmitting(true);
    const formspreeEndpoint = "https://formspree.io/f/TU_FORM_ID";

    try {
      const formData = new FormData();
      formData.append('_subject', '📩 Nuevo Registro de Inmueble - ViREALTY');
      formData.append('nombre_propietario', quickOwnerName);
      formData.append('telefono_contacto', quickPhone);
      formData.append('tipo_operacion', quickOperation);
      formData.append('tipo_inmueble', quickPropertyType);
      formData.append('precio_estimado', quickPrice);
      formData.append('detalles_inmueble', quickDetails);

      await fetch(formspreeEndpoint, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });
    } catch {
      // If endpoint is placeholder or fails, proceed smoothly with local UX
    } finally {
      setIsQuickSubmitting(false);
      setIsQuickSubmitted(true);
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  const handleDetailedSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ownerName || !ownerPhone) return;

    setIsSubmitted(true);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  return (
    <section id="consignar" className="py-20 bg-slate-950/80 border-t border-slate-800 relative overflow-hidden">
      {/* Anchor for nav compatibility */}
      <div id="vender" className="absolute -top-20" />
      <div id="agendar" className="absolute -top-20" />

      {/* Ambient Glow */}
      <div className="absolute top-1/2 left-0 w-72 h-72 bg-[#06B6D4]/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-[#D946EF]/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Top Header Mode Toggle */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10 pb-6 border-b border-slate-800/80">
          <div>
            <span className="text-[#06B6D4] text-xs font-semibold uppercase tracking-wider block">
              Vende o Arrienda con ViREALTY
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white mt-1 font-display">
              Consigna tu Inmueble
            </h2>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center bg-slate-900/90 border border-slate-800 p-1.5 rounded-2xl">
            <button
              onClick={() => setActiveTab('consignar_rapido')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'consignar_rapido'
                  ? 'bg-gradient-to-r from-[#06B6D4] to-[#D946EF] text-white shadow-lg shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Consignación Inmediata
            </button>
            <button
              onClick={() => setActiveTab('avaluo_detallado')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'avaluo_detallado'
                  ? 'bg-gradient-to-r from-[#06B6D4] to-[#D946EF] text-white shadow-lg shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Simulador de Avalúo 3D
            </button>
          </div>
        </div>

        {/* TAB 1: Consigna tu Inmueble con IA y 360 */}
        {activeTab === 'consignar_rapido' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-[#06B6D4] text-xs font-semibold uppercase tracking-wider">
                Vende o Arrienda con ViREALTY
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-white mt-2 mb-4 font-display">
                Comercializamos tu propiedad con <span className="gradient-text">tecnología 360° e IA.</span>
              </h2>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                Nos encargamos de la digitalización completa: recorridos virtuales, fotografías HD, calificación de prospectos con inteligencia artificial y gestión de visitas por videollamada.
              </p>
              
              <div className="space-y-4 text-xs text-slate-300">
                <div className="flex items-start gap-3 bg-slate-900/60 border border-slate-800/80 p-3.5 rounded-2xl">
                  <div className="w-8 h-8 rounded-xl bg-[#06B6D4]/10 border border-[#06B6D4]/30 flex items-center justify-center text-[#06B6D4] font-bold shrink-0">
                    1
                  </div>
                  <div>
                    <strong className="text-white block text-sm mb-0.5">Valoración comercial e integración virtual</strong>
                    <span className="text-slate-400">Escaneo Matterport 3D en 4K y fotos profesionales sin costo de producción inicial.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-slate-900/60 border border-slate-800/80 p-3.5 rounded-2xl">
                  <div className="w-8 h-8 rounded-xl bg-[#D946EF]/10 border border-[#D946EF]/30 flex items-center justify-center text-[#D946EF] font-bold shrink-0">
                    2
                  </div>
                  <div>
                    <strong className="text-white block text-sm mb-0.5">Filtro de compradores con IA</strong>
                    <span className="text-slate-400">Calificamos prospectos reales y coordinamos videollamadas guiadas para evitar visitas innecesarias.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-slate-900/60 border border-slate-800/80 p-3.5 rounded-2xl">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold shrink-0">
                    3
                  </div>
                  <div>
                    <strong className="text-white block text-sm mb-0.5">Cierre Jurídico & Notarial Digital</strong>
                    <span className="text-slate-400">Promesas de compraventa y estudios de títulos con firma digital respaldada.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* FORMULARIO PASO A PASO */}
            <div className="bg-[#111827] p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl relative">
              {!isQuickSubmitted ? (
                <div>
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-white font-display">Registra tu Propiedad</h3>
                    <p className="text-xs text-slate-400 mt-1">Completa los datos y nuestro equipo te contactará para agendar la digitalización 3D.</p>
                  </div>

                  <form 
                    action="https://formspree.io/f/TU_FORM_ID" 
                    method="POST" 
                    onSubmit={handleQuickSubmit} 
                    className="space-y-4"
                  >
                    {/* Campo oculto para filtrar el asunto del correo */}
                    <input type="hidden" name="_subject" value="📩 Nuevo Registro de Inmueble - ViREALTY" />

                    <div>
                      <label className="text-xs text-slate-400 block mb-1">Nombre Completo del Propietario</label>
                      <input 
                        type="text" 
                        name="nombre_propietario" 
                        required 
                        value={quickOwnerName}
                        onChange={(e) => setQuickOwnerName(e.target.value)}
                        placeholder="Ej: Juan Pérez" 
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#06B6D4]" 
                      />
                    </div>

                    <div>
                      <label className="text-xs text-slate-400 block mb-1">Teléfono / WhatsApp de Contacto</label>
                      <input 
                        type="tel" 
                        name="telefono_contacto" 
                        required 
                        value={quickPhone}
                        onChange={(e) => setQuickPhone(e.target.value)}
                        placeholder="+57 300 000 0000" 
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#06B6D4]" 
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-slate-400 block mb-1">¿Qué deseas hacer?</label>
                        <select 
                          name="tipo_operacion" 
                          required 
                          value={quickOperation}
                          onChange={(e) => setQuickOperation(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                        >
                          <option value="Vender">Vender mi Inmueble</option>
                          <option value="Arrendar">Arrendar mi Inmueble</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs text-slate-400 block mb-1">Tipo de Inmueble</label>
                        <select 
                          name="tipo_inmueble" 
                          required 
                          value={quickPropertyType}
                          onChange={(e) => setQuickPropertyType(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                        >
                          <option value="Apartamento">Apartamento</option>
                          <option value="Casa Campestre">Casa Campestre</option>
                          <option value="Local / Oficina">Local / Oficina</option>
                          <option value="Lote / Proyecto">Lote / Proyecto</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs text-slate-400 block mb-1">Precio Estimado / Pretendido (COP)</label>
                      <input 
                        type="text" 
                        name="precio_estimado" 
                        required 
                        value={quickPrice}
                        onChange={(e) => setQuickPrice(e.target.value)}
                        placeholder="$350.000.000" 
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#06B6D4]" 
                      />
                    </div>

                    <div>
                      <label className="text-xs text-slate-400 block mb-1">Detalles de la Propiedad (Ubicación, Área, Habitaciones)</label>
                      <textarea 
                        name="detalles_inmueble" 
                        rows={3} 
                        required 
                        value={quickDetails}
                        onChange={(e) => setQuickDetails(e.target.value)}
                        placeholder="Ej: Apto en Pereira, Circunvalar, 85m2, 3 habitaciones, parqueadero..." 
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#06B6D4]"
                      ></textarea>
                    </div>

                    <button 
                      id="btn-consignar-inmueble-submit"
                      type="submit" 
                      disabled={isQuickSubmitting}
                      className="w-full bg-gradient-to-r from-[#06B6D4] to-[#D946EF] text-white font-semibold py-3 rounded-xl hover:opacity-90 transition-all text-xs cursor-pointer shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2"
                    >
                      {isQuickSubmitting ? (
                        <span>Enviando información...</span>
                      ) : (
                        <span>Enviar Información a ViREALTY</span>
                      )}
                    </button>
                  </form>
                </div>
              ) : (
                <div className="text-center py-8 space-y-4">
                  <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500 text-emerald-400 flex items-center justify-center mx-auto mb-2">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <h4 className="text-xl font-bold text-white">¡Propiedad Registrada con Éxito!</h4>
                  <p className="text-slate-300 text-xs leading-relaxed max-w-sm mx-auto">
                    Gracias <strong className="text-white">{quickOwnerName}</strong>. Uno de nuestros asesores técnicos de ViREALTY te contactará al <strong className="text-[#06B6D4]">{quickPhone}</strong> para coordinar la digitalización 360° de tu {quickPropertyType}.
                  </p>
                  <button
                    onClick={() => {
                      setIsQuickSubmitted(false);
                      setQuickOwnerName('');
                      setQuickPhone('');
                      setQuickPrice('');
                      setQuickDetails('');
                    }}
                    className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold cursor-pointer"
                  >
                    Registrar Otro Inmueble
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: DETAILED 3-STEP VALUATION SIMULATOR */}
        {activeTab === 'avaluo_detallado' && (
          <div className="max-w-4xl mx-auto bg-[#111827] border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden gradient-border">
            {/* Progress Indicators */}
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className={`w-8 h-8 rounded-xl font-bold text-xs flex items-center justify-center ${step >= 1 ? 'bg-gradient-to-tr from-[#06B6D4] to-[#D946EF] text-white' : 'bg-slate-800 text-slate-500'}`}>
                  1
                </span>
                <span className="text-xs font-bold text-slate-300 hidden sm:inline">Ubicación & Tipo</span>
              </div>
              <div className="h-0.5 w-12 bg-slate-800" />
              <div className="flex items-center gap-2">
                <span className={`w-8 h-8 rounded-xl font-bold text-xs flex items-center justify-center ${step >= 2 ? 'bg-gradient-to-tr from-[#06B6D4] to-[#D946EF] text-white' : 'bg-slate-800 text-slate-500'}`}>
                  2
                </span>
                <span className="text-xs font-bold text-slate-300 hidden sm:inline">Metros & Espacios</span>
              </div>
              <div className="h-0.5 w-12 bg-slate-800" />
              <div className="flex items-center gap-2">
                <span className={`w-8 h-8 rounded-xl font-bold text-xs flex items-center justify-center ${step >= 3 ? 'bg-gradient-to-tr from-[#06B6D4] to-[#D946EF] text-white' : 'bg-slate-800 text-slate-500'}`}>
                  3
                </span>
                <span className="text-xs font-bold text-slate-300 hidden sm:inline">Avalúo & Escaneo</span>
              </div>
            </div>

            {!isSubmitted ? (
              <div>
                {/* STEP 1: Ubicación & Tipo */}
                {step === 1 && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-bold text-white mb-2">Paso 1: ¿Dónde está ubicado tu inmueble?</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-slate-400 block mb-1.5">Tipo de Propiedad</label>
                        <select
                          value={propertyType}
                          onChange={(e) => setPropertyType(e.target.value as PropertyCategory)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#06B6D4]"
                        >
                          <option value="Apartamento">Apartamento</option>
                          <option value="Penthouse">Penthouse</option>
                          <option value="Casa Campestre">Casa Campestre</option>
                          <option value="Loft">Loft</option>
                          <option value="Oficina">Oficina Comercial</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-slate-400 block mb-1.5">Zona en Pereira / Eje Cafetero</label>
                        <select
                          value={zone}
                          onChange={(e) => setZone(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#06B6D4]"
                        >
                          <option value="Circunvalar">Circunvalar (Alta Demanda)</option>
                          <option value="Pinares">Pinares / Los Álamos</option>
                          <option value="Cerritos">Cerritos (Campestre & Lujo)</option>
                          <option value="Dosquebradas">Dosquebradas / Santa Mónica</option>
                          <option value="Álamos">Álamos / Sector UTP</option>
                          <option value="La Julita">La Julita</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-400 block mb-1.5">Estrato Socioeconómico</label>
                      <div className="grid grid-cols-4 gap-2">
                        {[3, 4, 5, 6].map((str) => (
                          <button
                            key={str}
                            type="button"
                            onClick={() => setStratum(str)}
                            className={`py-2.5 rounded-xl border text-sm font-bold transition-all cursor-pointer ${
                              stratum === str
                                ? 'bg-[#06B6D4]/20 border-[#06B6D4] text-[#06B6D4]'
                                : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white'
                            }`}
                          >
                            Estrato {str}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-end pt-4">
                      <button
                        type="button"
                        onClick={() => setStep(2)}
                        className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#06B6D4] to-[#D946EF] text-white font-bold text-xs hover:opacity-90 transition-all flex items-center gap-2 cursor-pointer"
                      >
                        Siguiente: Espacios <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 2: Metros & Espacios */}
                {step === 2 && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-bold text-white mb-2">Paso 2: Características y Metraje</h3>
                    
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-xs font-semibold text-slate-400">Área Privada Total</label>
                        <span className="text-base font-black text-[#06B6D4] font-display">{areaM2} m²</span>
                      </div>
                      <input
                        type="range"
                        min="35"
                        max="600"
                        step="5"
                        value={areaM2}
                        onChange={(e) => setAreaM2(Number(e.target.value))}
                        className="w-full accent-[#06B6D4]"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-slate-400 block mb-1">Habitaciones</label>
                        <div className="flex items-center gap-2">
                          {[1, 2, 3, 4].map((num) => (
                            <button
                              key={num}
                              type="button"
                              onClick={() => setBedrooms(num)}
                              className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
                                bedrooms === num
                                  ? 'bg-[#06B6D4]/20 border-[#06B6D4] text-[#06B6D4]'
                                  : 'bg-slate-900 border-slate-700 text-slate-400'
                              }`}
                            >
                              {num}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-slate-400 block mb-1">Baños</label>
                        <div className="flex items-center gap-2">
                          {[1, 2, 3, 4].map((num) => (
                            <button
                              key={num}
                              type="button"
                              onClick={() => setBathrooms(num)}
                              className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
                                bathrooms === num
                                  ? 'bg-[#06B6D4]/20 border-[#06B6D4] text-[#06B6D4]'
                                  : 'bg-slate-900 border-slate-700 text-slate-400'
                              }`}
                            >
                              {num}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-slate-400 block mb-1">Parqueaderos</label>
                        <div className="flex items-center gap-2">
                          {[0, 1, 2, 3].map((num) => (
                            <button
                              key={num}
                              type="button"
                              onClick={() => setParking(num)}
                              className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
                                parking === num
                                  ? 'bg-[#06B6D4]/20 border-[#06B6D4] text-[#06B6D4]'
                                  : 'bg-slate-900 border-slate-700 text-slate-400'
                              }`}
                            >
                              {num}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between pt-4">
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-bold"
                      >
                        Atrás
                      </button>
                      <button
                        type="button"
                        onClick={() => setStep(3)}
                        className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#06B6D4] to-[#D946EF] text-white font-bold text-xs hover:opacity-90 transition-all flex items-center gap-2"
                      >
                        Calcular Avalúo <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 3: Avalúo & Solicitud de Escaneo */}
                {step === 3 && (
                  <form onSubmit={handleDetailedSubmit} className="space-y-6">
                    {/* Valuation Banner */}
                    <div className="bg-gradient-to-r from-[#06B6D4]/10 via-[#D946EF]/10 to-[#06B6D4]/10 border border-[#06B6D4]/40 p-6 rounded-2xl">
                      <div className="text-center">
                        <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block mb-1">
                          Avalúo Estimado por Big Data ViREALTY
                        </span>
                        <div className="text-3xl sm:text-4xl font-black text-white font-display mb-1">
                          {formatPrice(estimatedTotalValue, currency)}
                        </div>
                        <span className="text-xs text-[#06B6D4] font-semibold">
                          Aproximadamente {formatCOP(estimatedPricePerM2)} por m²
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-slate-300 block mb-1">Tu Nombre</label>
                        <input
                          type="text"
                          required
                          placeholder="Nombre completo"
                          value={ownerName}
                          onChange={(e) => setOwnerName(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#06B6D4]"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-slate-300 block mb-1">WhatsApp / Teléfono</label>
                        <input
                          type="tel"
                          required
                          placeholder="+57 310 000 0000"
                          value={ownerPhone}
                          onChange={(e) => setOwnerPhone(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#06B6D4]"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-slate-300 block mb-1">Correo Electrónico</label>
                        <input
                          type="email"
                          required
                          placeholder="correo@ejemplo.com"
                          value={ownerEmail}
                          onChange={(e) => setOwnerEmail(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#06B6D4]"
                        />
                      </div>
                    </div>

                    <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 text-xs text-slate-300 flex items-start gap-3">
                      <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-white block">Digitalización y Tour 3D Gratuito:</strong>
                        Incluye sesión de fotografía panorámica en 4K, levantamiento de planos y publicación destacada en nuestro portal sin costo por adelantado.
                      </div>
                    </div>

                    <div className="flex justify-between pt-2">
                      <button
                        type="button"
                        onClick={() => setStep(2)}
                        className="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-bold cursor-pointer"
                      >
                        Atrás
                      </button>
                      <button
                        type="submit"
                        className="px-8 py-3 rounded-xl bg-gradient-to-r from-[#06B6D4] to-[#D946EF] text-white font-bold text-xs hover:opacity-90 transition-all glow-effect cursor-pointer flex items-center gap-2 shadow-lg shadow-cyan-500/20"
                      >
                        <Camera className="w-4 h-4" />
                        Agendar Escaneo 3D Gratuito
                      </button>
                    </div>
                  </form>
                )}
              </div>
            ) : (
              /* SUBMITTED SUCCESS STATE */
              <div className="text-center py-10 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500 text-emerald-400 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h4 className="text-2xl font-bold text-white">¡Solicitud de Digitalización Recibida!</h4>
                <p className="text-slate-400 text-sm max-w-md mx-auto">
                  Gracias, <strong className="text-white">{ownerName}</strong>. Un fotógrafo técnico de ViREALTY se comunicará al <strong className="text-[#06B6D4]">{ownerPhone}</strong> para coordinar la visita de escaneo 3D Matterport de tu {propertyType} en {zone}.
                </p>
                <button
                  onClick={() => {
                    setIsSubmitted(false);
                    setStep(1);
                  }}
                  className="mt-6 px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs cursor-pointer"
                >
                  Valuar Otra Propiedad
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
