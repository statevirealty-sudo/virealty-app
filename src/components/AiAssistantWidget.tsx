import React, { useState, useRef, useEffect } from 'react';
import { Property } from '../types';
import { 
  Bot, 
  X, 
  Send, 
  Sparkles, 
  Calendar, 
  Box, 
  Calculator, 
  Building2, 
  ArrowRight,
  MessageSquare
} from 'lucide-react';
import { formatPrice } from '../utils/formatters';

interface AiAssistantWidgetProps {
  properties: Property[];
  onOpenBookingModal: (property?: Property) => void;
  onOpenVirtualTour: (property: Property) => void;
  currency: 'COP' | 'USD';
}

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  propertySuggestion?: Property;
  actionType?: 'book' | 'tour' | 'calc';
  time: string;
}

export const AiAssistantWidget: React.FC<AiAssistantWidgetProps> = ({
  properties,
  onOpenBookingModal,
  onOpenVirtualTour,
  currency
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [unreadCount, setUnreadCount] = useState(1);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'ai',
      text: '¡Hola! 👋 Soy tu asistente virtual ViREALTY. ¿En qué te puedo ayudar hoy? Puedo resolver dudas sobre los inmuebles, guiarte por los tours 360° o ayudarte a agendar una visita por videollamada.',
      time: 'Ahora'
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0);
      scrollToBottom();
    }
  }, [isOpen, messages]);

  const handleSend = (textToSend?: string) => {
    const query = (textToSend || inputText).trim();
    if (!query) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');

    // AI intelligent answer engine
    setTimeout(() => {
      const q = query.toLowerCase();
      let reply = '';
      let propSuggestion: Property | undefined;
      let action: 'book' | 'tour' | 'calc' | undefined;

      if (q.includes('360') || q.includes('tour') || q.includes('virtual') || q.includes('recorrido')) {
        const tourProps = properties.filter(p => p.has3DVirtualTour);
        propSuggestion = tourProps[0];
        reply = `Tenemos ${tourProps.length} propiedades con Tour 360° interactivo de ultra alta definición. Por ejemplo, "${tourProps[0]?.title}" en ${tourProps[0]?.zone}. ¿Te gustaría probar el visor 3D ahora mismo?`;
        action = 'tour';
      } else if (q.includes('agendar') || q.includes('cita') || q.includes('visita') || q.includes('asesor') || q.includes('llamada')) {
        reply = '¡Con gusto! Puedes agendar una visita virtual 100% digital con uno de nuestros especialistas por videollamada.';
        action = 'book';
      } else if (q.includes('cerritos') || q.includes('campestre')) {
        const cerritosProp = properties.find(p => p.zone.toLowerCase().includes('cerritos'));
        propSuggestion = cerritosProp;
        reply = `En el sector Cerritos contamos con exclusivas casas campestres como "${cerritosProp?.title}" (${formatPrice(cerritosProp?.price || 0, currency)}). Excelente clima y alta plusvalía.`;
        action = 'tour';
      } else if (q.includes('calculadora') || q.includes('cuota') || q.includes('credito') || q.includes('precio') || q.includes('roi')) {
        reply = 'Con nuestra Calculadora Financiera & ROI puedes simular tu cuota mensual hipotecaria y la rentabilidad estimada para Airbnb o arriendo tradicional.';
        action = 'calc';
      } else if (q.includes('planos') || q.includes('proyecto')) {
        const planosProps = properties.filter(p => p.onPlans || p.operationType === 'planos');
        propSuggestion = planosProps[0];
        reply = `Los proyectos sobre planos permiten pagar la cuota inicial hasta en 36 meses con valorización garantizada. Mira por ejemplo "${planosProps[0]?.title}".`;
        action = 'tour';
      } else {
        reply = `Entendido. En ViREALTY gestionamos compraventas 100% digitales en Pereira y el Eje Cafetero. Puedes recorrer los inmuebles en 360°, revisar planos HD o solicitar una videollamada guiada.`;
      }

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: reply,
        propertySuggestion: propSuggestion,
        actionType: action,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMsg]);
    }, 450);
  };

  const quickQuestions = [
    '¿Qué inmuebles tienen Tour 360°?',
    'Ver casas en Cerritos',
    'Agendar cita virtual',
    'Calcular cuota mensual'
  ];

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {/* Chatbox Window */}
      {isOpen && (
        <div 
          id="chat-box" 
          className="mb-4 w-80 sm:w-96 bg-[#111827] border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col transition-all animate-in zoom-in-95 fade-in duration-200"
        >
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-[#06B6D4] to-[#D946EF] p-4 flex items-center justify-between shadow-md">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center font-bold text-white text-xs border border-white/30 shadow">
                AI
              </div>
              <div>
                <h4 className="text-white font-bold text-sm leading-tight">Asistente ViREALTY</h4>
                <span className="text-[10px] text-white/90 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-300 rounded-full animate-pulse"></span> En línea 24/7
                </span>
              </div>
            </div>
            <button 
              id="btn-close-ai-chat"
              onClick={() => setIsOpen(false)} 
              className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* Messages Area */}
          <div className="p-4 h-72 overflow-y-auto space-y-3 text-xs bg-slate-950/70 scrollbar-none">
            {messages.map((msg) => (
              <div 
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div 
                  className={`p-3 rounded-2xl max-w-[88%] leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-[#06B6D4] to-[#D946EF] text-white rounded-br-none shadow-md'
                      : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none shadow'
                  }`}
                >
                  {msg.text}

                  {/* Optional Interactive Property Card inside Chat */}
                  {msg.propertySuggestion && (
                    <div className="mt-2.5 pt-2.5 border-t border-slate-800/80 bg-slate-950/80 rounded-xl p-2.5">
                      <div className="flex items-center gap-2 mb-2">
                        <img 
                          src={msg.propertySuggestion.images[0]} 
                          alt={msg.propertySuggestion.title}
                          className="w-12 h-12 rounded-lg object-cover" 
                        />
                        <div className="overflow-hidden">
                          <strong className="block text-white text-[11px] truncate">{msg.propertySuggestion.title}</strong>
                          <span className="text-[10px] text-slate-400 block">{msg.propertySuggestion.zone}</span>
                          <span className="text-[10px] font-bold text-[#D946EF]">{formatPrice(msg.propertySuggestion.price, currency)}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          if (msg.propertySuggestion) {
                            onOpenVirtualTour(msg.propertySuggestion);
                          }
                        }}
                        className="w-full bg-[#06B6D4]/20 hover:bg-[#06B6D4]/30 text-[#06B6D4] border border-[#06B6D4]/40 py-1.5 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1 cursor-pointer transition-colors"
                      >
                        <Box className="w-3 h-3" /> Abrir Tour 360°
                      </button>
                    </div>
                  )}

                  {/* Action Button for booking */}
                  {msg.actionType === 'book' && (
                    <button
                      onClick={() => onOpenBookingModal()}
                      className="mt-2.5 w-full bg-gradient-to-r from-[#06B6D4] to-[#D946EF] text-white py-1.5 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1 cursor-pointer hover:opacity-90 transition-all shadow"
                    >
                      <Calendar className="w-3 h-3" /> Agendar Cita Virtual Ahora
                    </button>
                  )}
                </div>
                <span className="text-[9px] text-slate-500 mt-1 px-1">{msg.time}</span>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions Pills */}
          <div className="px-3 py-2 bg-slate-900/90 border-t border-slate-800/80 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            {quickQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(q)}
                className="whitespace-nowrap px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-[10px] text-cyan-300 border border-slate-700 hover:border-cyan-500/40 transition-colors shrink-0 cursor-pointer"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Chat Input */}
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-[#111827] border-t border-slate-800 flex gap-2"
          >
            <input 
              type="text" 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Escribe tu consulta..." 
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#06B6D4]" 
            />
            <button 
              id="btn-send-ai-message"
              type="submit" 
              className="bg-gradient-to-r from-[#06B6D4] to-[#D946EF] text-white font-bold p-2.5 rounded-xl hover:opacity-90 transition-all cursor-pointer shrink-0 shadow-md shadow-cyan-500/20"
              title="Enviar mensaje"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* Floating Action Launcher Button */}
      <button 
        id="btn-ai-assistant-toggle"
        onClick={() => setIsOpen(!isOpen)} 
        className="relative bg-gradient-to-tr from-[#06B6D4] to-[#D946EF] p-4 rounded-full text-white shadow-2xl hover:scale-105 transition-all glow-effect flex items-center justify-center cursor-pointer group"
        title="Asistente Virtual ViREALTY"
      >
        <Bot className="w-6 h-6 transition-transform group-hover:rotate-12" />

        {/* Pulse Indicator */}
        {!isOpen && unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 text-[9px] font-bold text-white items-center justify-center">
              1
            </span>
          </span>
        )}
      </button>
    </div>
  );
};
