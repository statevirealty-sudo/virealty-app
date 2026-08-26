import React, { useState, useEffect, useRef } from 'react';
import { Property } from '../types';
import { 
  X, 
  Video, 
  Mic, 
  MicOff, 
  VideoOff, 
  Send, 
  Calendar, 
  Clock, 
  CheckCircle, 
  Sparkles, 
  User, 
  ShieldCheck, 
  MessageSquare,
  Compass,
  PhoneCall
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { formatPrice } from '../utils/formatters';

interface LiveTourModalProps {
  property?: Property;
  allProperties: Property[];
  onClose: () => void;
  currency: 'COP' | 'USD';
}

export const LiveTourModal: React.FC<LiveTourModalProps> = ({
  property,
  allProperties,
  onClose,
  currency
}) => {
  const [selectedProperty, setSelectedProperty] = useState<Property>(property || allProperties[0]);
  const [mode, setMode] = useState<'instant' | 'schedule'>('instant');
  const [inCall, setInCall] = useState<boolean>(false);
  const [micOn, setMicOn] = useState<boolean>(true);
  const [cameraOn, setCameraOn] = useState<boolean>(true);
  const [laserPos, setLaserPos] = useState<{ x: number; y: number }>({ x: 50, y: 50 });
  const [activeRoomIndex, setActiveRoomIndex] = useState<number>(0);
  
  // Chat messages
  const [messages, setMessages] = useState<{ sender: 'advisor' | 'user'; text: string; time: string }[]>([
    {
      sender: 'advisor',
      text: '¡Hola! Soy Valentina Morales, tu especialista en propiedades virtuales en Pereira y Cerritos. ¿Qué te gustaría conocer en detalle?',
      time: 'Ahora'
    }
  ]);
  const [inputText, setInputText] = useState('');

  // Schedule state
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('10:00 AM');
  const [userName, setUserName] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [scheduleSuccess, setScheduleSuccess] = useState(false);

  // Laser pointer wandering animation during live call
  useEffect(() => {
    if (!inCall) return;
    const interval = setInterval(() => {
      setLaserPos({
        x: 30 + Math.random() * 40,
        y: 30 + Math.random() * 40,
      });
    }, 2800);
    return () => clearInterval(interval);
  }, [inCall]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg = inputText.trim();
    const newMessages = [
      ...messages,
      { sender: 'user' as const, text: userMsg, time: 'Ahora' }
    ];
    setMessages(newMessages);
    setInputText('');

    // Simulated advisor instant responses
    setTimeout(() => {
      let reply = `Excelente pregunta sobre ${selectedProperty.title}. Los acabados son de primera línea y la valorización proyectada en esta zona es de ${selectedProperty.financialHighlights.annualAppreciation}% anual.`;
      
      const lower = userMsg.toLowerCase();
      if (lower.includes('precio') || lower.includes('costo') || lower.includes('descuento')) {
        reply = `El precio de lista es ${formatPrice(selectedProperty.price, currency)}. Además contamos con facilidades de pago y aprobación de crédito hipotecario 100% digital en 24 horas.`;
      } else if (lower.includes('renta') || lower.includes('airbnb') || lower.includes('roi')) {
        reply = `Este inmueble tiene un Cap Rate estimado del ${selectedProperty.financialHighlights.capRate}%. En Airbnb proyectamos una tarifa promedio de $${selectedProperty.financialHighlights.estimatedAirbnbDaily.toLocaleString('es-CO')} COP por noche.`;
      } else if (lower.includes('visita') || lower.includes('cita') || lower.includes('ver')) {
        reply = `Podemos agendar una sesión privada con el propietario o realizar la reserva digital con firma electrónica notarizada.`;
      }

      setMessages(prev => [
        ...prev,
        { sender: 'advisor', text: reply, time: 'Ahora' }
      ]);
    }, 1000);
  };

  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName || !userPhone) return;

    setScheduleSuccess(true);
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  return (
    <div 
      id="live-tour-modal"
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-2 sm:p-4 overflow-y-auto"
    >
      <div className="relative w-full max-w-5xl bg-[#111827] border border-slate-700 rounded-3xl overflow-hidden shadow-2xl flex flex-col my-auto max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-[#0B0F19] border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#06B6D4] to-[#D946EF] flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
              <Video className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-white font-extrabold text-lg">Tour Virtual Live</h3>
                <span className="flex items-center gap-1 bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  Asesores Disponibles
                </span>
              </div>
              <p className="text-slate-400 text-xs">
                Recorrido guiado en tiempo real con puntero láser interactivo y audio en vivo.
              </p>
            </div>
          </div>

          <button
            id="close-live-modal"
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Tabs */}
        <div className="flex border-b border-slate-800 bg-[#0F172A]/80 px-6 pt-3">
          <button
            id="tab-instant-tour"
            onClick={() => setMode('instant')}
            className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 cursor-pointer ${
              mode === 'instant'
                ? 'border-[#06B6D4] text-[#06B6D4]'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Conectar en Vivo Ahora
          </button>
          <button
            id="tab-schedule-tour"
            onClick={() => setMode('schedule')}
            className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 cursor-pointer ${
              mode === 'schedule'
                ? 'border-[#D946EF] text-[#D946EF]'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Agendar Cita Privada
          </button>
        </div>

        {/* BODY */}
        {mode === 'instant' ? (
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 overflow-hidden">
            {/* Left: 3D Co-Browsing Screen */}
            <div className="lg:col-span-2 p-4 sm:p-6 flex flex-col gap-4 bg-[#0B0F19]/50 overflow-y-auto">
              {/* Property Selector Bar */}
              <div className="flex items-center justify-between gap-3 bg-slate-900/80 p-3 rounded-2xl border border-slate-800">
                <div className="flex-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                    Inmueble en Presentación:
                  </label>
                  <select
                    id="live-property-selector"
                    value={selectedProperty.id}
                    onChange={(e) => {
                      const found = allProperties.find(p => p.id === e.target.value);
                      if (found) {
                        setSelectedProperty(found);
                        setActiveRoomIndex(0);
                      }
                    }}
                    className="w-full bg-[#111827] border border-slate-700 text-white text-xs font-semibold rounded-xl px-3 py-1.5 focus:outline-none focus:border-[#06B6D4]"
                  >
                    {allProperties.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.title} - {formatPrice(p.price, currency)} ({p.zone})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="text-right">
                  <span className="text-[#D946EF] font-bold text-sm block">
                    {formatPrice(selectedProperty.price, currency)}
                  </span>
                  <span className="text-slate-400 text-[10px]">
                    {selectedProperty.area} m² • Estrato {selectedProperty.stratum}
                  </span>
                </div>
              </div>

              {/* Live Co-Browsing Stage */}
              <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 aspect-video group">
                <img 
                  src={selectedProperty.images[activeRoomIndex % selectedProperty.images.length]} 
                  alt={selectedProperty.title}
                  className="w-full h-full object-cover opacity-90 transition-all duration-700"
                />

                {/* Laser Pointer Simulated Element */}
                {inCall && (
                  <div 
                    style={{ left: `${laserPos.x}%`, top: `${laserPos.y}%` }}
                    className="absolute pointer-events-none transition-all duration-1000 ease-out -translate-x-1/2 -translate-y-1/2"
                  >
                    <div className="w-6 h-6 rounded-full bg-[#06B6D4]/30 animate-ping absolute -inset-1" />
                    <div className="w-4 h-4 rounded-full bg-[#06B6D4] border-2 border-white shadow-lg shadow-cyan-400/80 flex items-center justify-center text-[8px] text-white font-bold" />
                    <span className="absolute left-5 top-0 bg-black/80 backdrop-blur-md text-[#06B6D4] text-[9px] font-bold px-2 py-0.5 rounded whitespace-nowrap border border-[#06B6D4]/40">
                      Valentina señalando acabados
                    </span>
                  </div>
                )}

                {/* Advisor Video PiP (Picture in Picture) */}
                <div className="absolute top-3 right-3 w-28 sm:w-36 rounded-xl overflow-hidden border-2 border-[#06B6D4]/60 bg-slate-900 shadow-2xl">
                  <div className="relative aspect-square">
                    <img 
                      src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80" 
                      alt="Valentina Morales - Asesor ViREALTY" 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-1 left-1 bg-black/70 px-1.5 py-0.5 rounded text-[9px] text-white font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Valentina
                    </div>
                  </div>
                </div>

                {/* Room Switcher Pills */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center gap-1.5 overflow-x-auto bg-black/60 backdrop-blur-md p-2 rounded-xl border border-slate-800">
                  {selectedProperty.panoramas.map((pano, idx) => (
                    <button
                      key={pano.id}
                      onClick={() => setActiveRoomIndex(idx)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold whitespace-nowrap transition-all ${
                        activeRoomIndex === idx
                          ? 'bg-[#06B6D4] text-white'
                          : 'bg-slate-800/80 text-slate-300 hover:text-white'
                      }`}
                    >
                      {pano.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Call Controls */}
              <div className="flex items-center justify-between bg-slate-900/90 p-3 rounded-2xl border border-slate-800">
                <div className="flex items-center gap-2">
                  <button
                    id="toggle-mic"
                    onClick={() => setMicOn(!micOn)}
                    className={`p-2.5 rounded-xl border transition-all ${
                      micOn ? 'bg-slate-800 border-slate-700 text-white' : 'bg-rose-500/20 border-rose-500 text-rose-400'
                    }`}
                  >
                    {micOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                  </button>
                  <button
                    id="toggle-camera"
                    onClick={() => setCameraOn(!cameraOn)}
                    className={`p-2.5 rounded-xl border transition-all ${
                      cameraOn ? 'bg-slate-800 border-slate-700 text-white' : 'bg-rose-500/20 border-rose-500 text-rose-400'
                    }`}
                  >
                    {cameraOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                  </button>
                </div>

                {!inCall ? (
                  <button
                    id="start-live-call-btn"
                    onClick={() => setInCall(true)}
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-xs hover:opacity-90 transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2 cursor-pointer"
                  >
                    <PhoneCall className="w-4 h-4" />
                    Iniciar Sesión en Vivo
                  </button>
                ) : (
                  <button
                    id="end-live-call-btn"
                    onClick={() => setInCall(false)}
                    className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-all cursor-pointer"
                  >
                    Finalizar Llamada
                  </button>
                )}
              </div>
            </div>

            {/* Right: Live Chat & Specs */}
            <div className="p-4 sm:p-6 border-t lg:border-t-0 lg:border-l border-slate-800 flex flex-col bg-[#111827] justify-between">
              <div>
                <div className="flex items-center gap-2 pb-3 mb-3 border-b border-slate-800">
                  <MessageSquare className="w-4 h-4 text-[#06B6D4]" />
                  <h4 className="text-white font-bold text-xs uppercase tracking-wide">Chat Interactivo en Tiempo Real</h4>
                </div>

                {/* Message stream */}
                <div className="flex flex-col gap-3 h-64 sm:h-72 overflow-y-auto pr-1">
                  {messages.map((m, i) => (
                    <div
                      key={i}
                      className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`max-w-[88%] p-3 rounded-2xl text-xs leading-relaxed ${
                          m.sender === 'user'
                            ? 'bg-gradient-to-r from-[#06B6D4] to-[#D946EF] text-white rounded-br-none'
                            : 'bg-slate-800/90 text-slate-200 border border-slate-700 rounded-bl-none'
                        }`}
                      >
                        {m.text}
                      </div>
                      <span className="text-[9px] text-slate-500 mt-1 px-1">{m.time}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSendMessage} className="mt-4 flex gap-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Escribe tu pregunta sobre acabados, precio, crédito..."
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#06B6D4]"
                />
                <button
                  type="submit"
                  className="p-2.5 rounded-xl bg-[#06B6D4] text-white hover:bg-cyan-400 transition-all cursor-pointer shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        ) : (
          /* SCHEDULE MODE */
          <div className="p-6 sm:p-8 max-w-2xl mx-auto w-full">
            {scheduleSuccess ? (
              <div className="text-center py-10">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500 text-emerald-400 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h4 className="text-2xl font-bold text-white mb-2">¡Cita Virtual Agendada con Éxito!</h4>
                <p className="text-slate-400 text-sm max-w-md mx-auto mb-6">
                  Hemos programado tu tour virtual guiado para el día <strong className="text-white">{scheduledDate || 'Mañana'}</strong> a las <strong className="text-white">{scheduledTime}</strong>. Te enviamos el enlace a tu correo y WhatsApp.
                </p>
                <button
                  onClick={() => {
                    setScheduleSuccess(false);
                    onClose();
                  }}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#06B6D4] to-[#D946EF] text-white font-bold text-xs"
                >
                  Entendido
                </button>
              </div>
            ) : (
              <form onSubmit={handleScheduleSubmit} className="space-y-4">
                <div className="text-center mb-6">
                  <h4 className="text-xl font-bold text-white">Agenda una Sesión Privada 3D</h4>
                  <p className="text-slate-400 text-xs mt-1">
                    Un asesor inmobiliario sénior se conectará contigo para responder dudas financieras, legales y de valorización.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1.5">Fecha Preferida</label>
                    <input
                      type="date"
                      required
                      value={scheduledDate}
                      onChange={(e) => setScheduledDate(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#06B6D4]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1.5">Hora</label>
                    <select
                      value={scheduledTime}
                      onChange={(e) => setScheduledTime(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#06B6D4]"
                    >
                      <option>09:00 AM</option>
                      <option>10:00 AM</option>
                      <option>11:30 AM</option>
                      <option>02:00 PM</option>
                      <option>04:00 PM</option>
                      <option>06:00 PM</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1.5">Nombre Completo</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. Carlos Andrés Restrepo"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#06B6D4]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1.5">WhatsApp / Teléfono</label>
                    <input
                      type="tel"
                      required
                      placeholder="+57 310 123 4567"
                      value={userPhone}
                      onChange={(e) => setUserPhone(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#06B6D4]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">Correo Electrónico</label>
                  <input
                    type="email"
                    required
                    placeholder="tucorreo@ejemplo.com"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#06B6D4]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-[#06B6D4] to-[#D946EF] text-white font-bold text-xs hover:opacity-90 transition-all glow-effect mt-4 cursor-pointer flex items-center justify-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  Confirmar Reserva de Tour 3D
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
