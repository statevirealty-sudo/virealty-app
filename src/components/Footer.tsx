import React from 'react';
import { 
  Facebook,
  AtSign,
  Instagram, 
  Mail,
  Lock
} from 'lucide-react';
import virealtyLogo from '../assets/images/virealty_logo_1787766589987.jpg';

interface FooterProps {
  onOpenAdmin?: () => void;
}

// CONTRASEÑA SECRETA DE ADMINISTRADOR
const ADMIN_PASSWORD_CORRECTA = "ViRealty2026*";

export const Footer: React.FC<FooterProps> = ({ onOpenAdmin }) => {
  const solicitarAccesoAdmin = () => {
    const password = prompt("Acceso Restringido: Ingresa la clave de administración de ViREALTY:");
    
    if (password === ADMIN_PASSWORD_CORRECTA) {
      if (onOpenAdmin) {
        onOpenAdmin();
      }
    } else if (password !== null && password !== "") {
      alert("🔒 Clave incorrecta. Acceso denegado.");
    }
  };

  return (
    <footer className="bg-[#0B0F19] border-t border-slate-800 py-12 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo & Contacto Corporativo */}
          <div className="flex flex-col gap-2 items-center md:items-start">
            {/* LOGO VIREALTY EN EL FOOTER */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl overflow-hidden border border-[#06B6D4]/30 p-0.5 bg-slate-900 flex-shrink-0">
                <img 
                  src="/logo.jpg" 
                  alt="ViREALTY Logo" 
                  className="w-full h-full object-cover rounded-lg" 
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-extrabold tracking-wider text-white leading-none font-display">
                  Vi<span className="gradient-text">REALTY</span>
                </span>
                <span className="text-[10px] text-[#06B6D4] font-medium tracking-wider uppercase mt-1">
                  Tu hogar digital, posibilidades infinitas
                </span>
              </div>
            </div>
            <a 
              href="mailto:statevirealty@gmail.com" 
              className="text-slate-400 hover:text-[#06B6D4] text-xs transition-colors flex items-center gap-1.5 mt-0.5"
            >
              <Mail className="w-3.5 h-3.5 text-[#06B6D4]" />
              statevirealty@gmail.com
            </a>
          </div>

          {/* Enlaces a Redes Sociales Oficiales */}
          <div className="flex items-center gap-4 text-slate-400">
            {/* Facebook */}
            <a 
              href="https://web.facebook.com/profile.php?id=61593720123713" 
              target="_blank" 
              rel="noopener noreferrer" 
              title="Facebook" 
              className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center hover:text-[#06B6D4] hover:border-[#06B6D4]/50 transition-all cursor-pointer shadow-sm hover:scale-105"
            >
              <Facebook className="w-5 h-5" />
            </a>
            {/* Threads */}
            <a 
              href="https://threads.instagram.com/virealtystate" 
              target="_blank" 
              rel="noopener noreferrer" 
              title="Threads" 
              className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center hover:text-[#D946EF] hover:border-[#D946EF]/50 transition-all cursor-pointer shadow-sm hover:scale-105"
            >
              <AtSign className="w-5 h-5" />
            </a>
            {/* Instagram */}
            <a 
              href="https://instagram.com/virealtystate" 
              target="_blank" 
              rel="noopener noreferrer" 
              title="Instagram" 
              className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center hover:text-[#D946EF] hover:border-[#D946EF]/50 transition-all cursor-pointer shadow-sm hover:scale-105"
            >
              <Instagram className="w-5 h-5" />
            </a>
            {/* Correo Directo */}
            <a 
              href="mailto:statevirealty@gmail.com" 
              title="Enviar Correo" 
              className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center hover:text-[#06B6D4] hover:border-[#06B6D4]/50 transition-all cursor-pointer shadow-sm hover:scale-105"
            >
              <Mail className="w-5 h-5" />
            </a>
          </div>

          {/* Copyright & Acceso Discreto Admin */}
          <div className="flex flex-col items-center md:items-end gap-2 text-center md:text-right">
            <p className="text-slate-500 text-xs">
              © 2026 ViREALTY. Todos los derechos reservados.
            </p>
            {/* Botón discreto de acceso Admin en el Footer */}
            <button 
              id="btn-footer-admin"
              onClick={solicitarAccesoAdmin} 
              title="Acceso Administración" 
              className="text-slate-700 hover:text-slate-400 text-xs flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5" /> Admin
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
