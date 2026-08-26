import React, { useState } from 'react';
import { 
  Video, 
  Menu, 
  X, 
  Heart, 
  Sparkles, 
  Globe 
} from 'lucide-react';
import virealtyLogo from '../assets/images/virealty_logo_1787766589987.jpg';

interface NavbarProps {
  onOpenLiveTour: () => void;
  currency: 'COP' | 'USD';
  onToggleCurrency: () => void;
  favoritesCount: number;
  onOpenFavorites: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenLiveTour,
  currency,
  onToggleCurrency,
  favoritesCount,
  onOpenFavorites
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  return (
    <header className="fixed top-0 w-full z-40 bg-[#0B0F19]/85 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* LOGO VIREALTY EN EL HEADER */}
        <a href="#inicio" className="flex items-center gap-3 group">
          <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-[#06B6D4]/40 p-0.5 bg-slate-900 group-hover:border-[#06B6D4] transition-all flex-shrink-0">
            <img 
              src="/logo.jpg" 
              alt="ViREALTY Logo" 
              className="w-full h-full object-cover rounded-lg" 
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-extrabold tracking-wider text-white leading-none font-display">
              Vi<span className="gradient-text">REALTY</span>
            </span>
            <span className="text-[9px] text-slate-400 tracking-widest uppercase mt-0.5">Inmobiliaria Virtual</span>
          </div>
        </a>

        {/* DESKTOP MENU */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-300">
          <a href="#inicio" className="hover:text-[#06B6D4] transition-colors">Inicio</a>
          <a href="#propiedades" className="hover:text-[#06B6D4] transition-colors">Propiedades</a>
          <a href="#calculadora" className="hover:text-[#06B6D4] transition-colors">Calculadora ROI</a>
          <a
            href="https://www.pse.com.co/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-300 hover:text-[#06B6D4] text-xs font-semibold transition-colors flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900/60 border border-slate-800 hover:border-[#06B6D4]/40"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Paga tu Arriendo
          </a>
        </nav>

        {/* RIGHT CONTROLS */}
        <div className="hidden md:flex items-center gap-4">
          {/* Currency Switcher */}
          <button
            id="btn-toggle-currency"
            onClick={onToggleCurrency}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-bold text-slate-300 transition-all cursor-pointer"
            title="Cambiar Moneda (COP / USD)"
          >
            <Globe className="w-3.5 h-3.5 text-[#06B6D4]" />
            <span>{currency}</span>
          </button>

          {/* Favorites Counter */}
          {favoritesCount > 0 && (
            <button
              id="btn-navbar-favorites"
              onClick={onOpenFavorites}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#D946EF]/10 border border-[#D946EF]/30 text-[#D946EF] text-xs font-bold cursor-pointer hover:bg-[#D946EF]/20 transition-all"
            >
              <Heart className="w-3.5 h-3.5 fill-current" />
              <span>{favoritesCount}</span>
            </button>
          )}

          {/* CTA: Agendar Cita Virtual */}
          <button
            id="navbar-live-tour-btn"
            onClick={onOpenLiveTour}
            className="bg-gradient-to-r from-[#06B6D4] to-[#D946EF] text-white font-semibold px-5 py-2.5 rounded-xl hover:opacity-90 transition-all glow-effect flex items-center gap-2 text-sm cursor-pointer shadow-lg shadow-cyan-500/20"
          >
            <Video className="w-4 h-4" />
            Agendar Cita Virtual
          </button>
        </div>

        {/* MOBILE MENU TOGGLE */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={onToggleCurrency}
            className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-bold text-slate-300"
          >
            {currency}
          </button>

          <button
            id="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU DRAWER */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0B0F19] border-b border-slate-800 px-6 py-6 space-y-4">
          <nav className="flex flex-col gap-4 text-base font-semibold text-slate-200">
            <a 
              href="#inicio" 
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-[#06B6D4]"
            >
              Inicio
            </a>
            <a 
              href="#propiedades" 
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-[#06B6D4]"
            >
              Propiedades 3D
            </a>
            <a 
              href="#calculadora" 
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-[#06B6D4]"
            >
              Calculadora ROI
            </a>
            <a
              href="https://www.pse.com.co/"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              className="text-slate-300 hover:text-[#06B6D4] text-sm font-semibold transition-colors flex items-center gap-2 pt-2 border-t border-slate-800/80"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Paga tu Arriendo (PSE)
            </a>
          </nav>

          <div className="pt-4 border-t border-slate-800">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenLiveTour();
              }}
              className="w-full bg-gradient-to-r from-[#06B6D4] to-[#D946EF] text-white font-semibold py-3 rounded-xl hover:opacity-90 transition-all glow-effect flex items-center justify-center gap-2 text-sm"
            >
              <Video className="w-4 h-4" />
              Tour Virtual Live
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
