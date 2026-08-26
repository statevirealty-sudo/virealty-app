import React, { useState, useEffect } from 'react';
import { PROPERTIES_DATA } from './data/properties';
import { Property, SearchFilters } from './types';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { PropertiesSection } from './components/PropertiesSection';
import { RoiCalculatorSection } from './components/RoiCalculatorSection';
import { SellPropertySection } from './components/SellPropertySection';
import { Footer } from './components/Footer';
import { VirtualTourModal } from './components/VirtualTourModal';
import { LiveTourModal } from './components/LiveTourModal';
import { PropertyDetailModal } from './components/PropertyDetailModal';
import { FavoritesDrawer } from './components/FavoritesDrawer';
import { HdPhotoGalleryModal } from './components/HdPhotoGalleryModal';
import { ScheduleModal } from './components/ScheduleModal';
import { AdminPublishModal } from './components/AdminPublishModal';
import { AiAssistantWidget } from './components/AiAssistantWidget';

export default function App() {
  const [properties, setProperties] = useState<Property[]>(PROPERTIES_DATA);
  const [currency, setCurrency] = useState<'COP' | 'USD'>('COP');
  
  // Modals state
  const [activeVirtualTourProperty, setActiveVirtualTourProperty] = useState<Property | null>(null);
  const [activeGalleryProperty, setActiveGalleryProperty] = useState<Property | null>(null);
  const [activeLiveTourProperty, setActiveLiveTourProperty] = useState<Property | null>(null);
  const [isLiveTourModalOpen, setIsLiveTourModalOpen] = useState<boolean>(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState<boolean>(false);
  const [isAdminPublishOpen, setIsAdminPublishOpen] = useState<boolean>(false);
  const [activeScheduleProperty, setActiveScheduleProperty] = useState<Property | null>(null);
  const [activeDetailProperty, setActiveDetailProperty] = useState<Property | null>(null);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState<boolean>(false);

  // Favorites state
  const [favoriteIds, setFavoriteIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('virealty_favs');
      return saved ? JSON.parse(saved) : ['prop-1'];
    } catch {
      return ['prop-1'];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('virealty_favs', JSON.stringify(favoriteIds));
    } catch {
      // ignore
    }
  }, [favoriteIds]);

  const toggleFavorite = (id: string) => {
    setFavoriteIds(prev => 
      prev.includes(id) ? prev.filter(fId => fId !== id) : [...prev, id]
    );
  };

  // Expose global window methods for external scripts / direct onclick triggers
  useEffect(() => {
    const ADMIN_PASSWORD_CORRECTA = "ViRealty2026*";

    window.solicitarAccesoAdmin = function() {
      const password = prompt("🔒 Acceso Restringido: Ingresa la clave de administración de ViREALTY:");
      
      if (password === ADMIN_PASSWORD_CORRECTA) {
        setIsAdminPublishOpen(true);
        const modal = document.getElementById('modal-admin-publicar');
        if (modal) {
          modal.classList.remove('hidden');
          modal.classList.add('flex');
        }
      } else if (password !== null && password.trim() !== "") {
        alert("Contraseña incorrecta. Acceso denegado.");
      }
    };

    window.closeModalAdmin = function() {
      setIsAdminPublishOpen(false);
      const modal = document.getElementById('modal-admin-publicar');
      if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
      }
    };

    return () => {
      delete window.solicitarAccesoAdmin;
      delete window.closeModalAdmin;
    };
  }, []);

  // Search Filter state
  const [filters, setFilters] = useState<SearchFilters>({
    operationType: 'Todos',
    zone: 'Todas',
    budgetRange: '',
    category: 'Todas',
    minBedrooms: 0,
    only3D: false,
    experienceType: 'all',
    searchTerm: '',
    sortBy: 'featured'
  });

  const handleFilterUpdate = (newFilters: Partial<SearchFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const favoriteProperties = properties.filter(p => favoriteIds.includes(p.id));

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 font-sans selection:bg-[#D946EF] selection:text-white">
      {/* Top Navbar */}
      <Navbar
        onOpenLiveTour={() => {
          setActiveScheduleProperty(properties[0]);
          setIsScheduleModalOpen(true);
        }}
        currency={currency}
        onToggleCurrency={() => setCurrency(prev => prev === 'COP' ? 'USD' : 'COP')}
        favoritesCount={favoriteIds.length}
        onOpenFavorites={() => setIsFavoritesOpen(true)}
      />

      {/* Main Sections */}
      <main>
        {/* 1. Hero Section & Search Wizard */}
        <Hero
          onSearchSubmit={handleFilterUpdate}
          onOpenLiveTourModal={() => {
            setActiveLiveTourProperty(properties[0]);
            setIsLiveTourModalOpen(true);
          }}
        />

        {/* 2. Propiedades Catalog (Hybrid 360° + HD Photos) */}
        <PropertiesSection
          properties={properties}
          filters={filters}
          onFilterChange={handleFilterUpdate}
          onOpenVirtualTour={(prop) => setActiveVirtualTourProperty(prop)}
          onOpenPhotoGallery={(prop) => setActiveGalleryProperty(prop)}
          onOpenPropertyDetail={(prop) => setActiveDetailProperty(prop)}
          onOpenLiveTour={(prop) => {
            setActiveLiveTourProperty(prop);
            setIsLiveTourModalOpen(true);
          }}
          currency={currency}
          favoriteIds={favoriteIds}
          onToggleFavorite={toggleFavorite}
        />

        {/* 3. Calculadora ROI Section */}
        <RoiCalculatorSection
          properties={properties}
          currency={currency}
          onSelectPropertyForTour={(prop) => setActiveVirtualTourProperty(prop)}
        />

        {/* 4. Vender Inmueble Section */}
        <SellPropertySection currency={currency} />
      </main>

      {/* Footer */}
      <Footer onOpenAdmin={() => setIsAdminPublishOpen(true)} />

      {/* MODALS */}
      {/* 3D Virtual Tour Modal with Pannellum URL & JSON Customizer */}
      {activeVirtualTourProperty && (
        <VirtualTourModal
          property={activeVirtualTourProperty}
          onClose={() => setActiveVirtualTourProperty(null)}
          onOpenLiveTour={(prop) => {
            setActiveVirtualTourProperty(null);
            setActiveLiveTourProperty(prop);
            setIsLiveTourModalOpen(true);
          }}
          currency={currency}
        />
      )}

      {/* HD Photo Gallery Modal */}
      {activeGalleryProperty && (
        <HdPhotoGalleryModal
          property={activeGalleryProperty}
          onClose={() => setActiveGalleryProperty(null)}
          onOpenVirtualTour={(prop) => {
            setActiveGalleryProperty(null);
            setActiveVirtualTourProperty(prop);
          }}
          currency={currency}
        />
      )}

      {/* Live Tour Modal */}
      {isLiveTourModalOpen && (
        <LiveTourModal
          property={activeLiveTourProperty || properties[0]}
          allProperties={properties}
          onClose={() => setIsLiveTourModalOpen(false)}
          currency={currency}
        />
      )}

      {/* Property Detail Modal */}
      {activeDetailProperty && (
        <PropertyDetailModal
          property={activeDetailProperty}
          onClose={() => setActiveDetailProperty(null)}
          onOpenVirtualTour={(prop) => {
            setActiveDetailProperty(null);
            setActiveVirtualTourProperty(prop);
          }}
          onOpenLiveTour={(prop) => {
            setActiveDetailProperty(null);
            setActiveLiveTourProperty(prop);
            setIsLiveTourModalOpen(true);
          }}
          onOpenSchedule={(prop) => {
            setActiveDetailProperty(null);
            setActiveScheduleProperty(prop);
            setIsScheduleModalOpen(true);
          }}
          currency={currency}
          onToggleFavorite={toggleFavorite}
          isFavorite={favoriteIds.includes(activeDetailProperty.id)}
        />
      )}

      {/* Favorites Drawer */}
      <FavoritesDrawer
        isOpen={isFavoritesOpen}
        onClose={() => setIsFavoritesOpen(false)}
        favoriteProperties={favoriteProperties}
        onRemoveFavorite={toggleFavorite}
        onOpenVirtualTour={(prop) => {
          setIsFavoritesOpen(false);
          setActiveVirtualTourProperty(prop);
        }}
        currency={currency}
      />

      {/* Schedule Virtual Tour Modal */}
      <ScheduleModal
        isOpen={isScheduleModalOpen}
        onClose={() => {
          setIsScheduleModalOpen(false);
          setActiveScheduleProperty(null);
        }}
        selectedProperty={activeScheduleProperty}
        allProperties={properties}
      />

      {/* Admin Publish Property Modal */}
      <AdminPublishModal
        isOpen={isAdminPublishOpen}
        onClose={() => setIsAdminPublishOpen(false)}
        onPublishProperty={(newProp) => {
          setProperties(prev => [newProp, ...prev]);
        }}
      />

      {/* Floating AI Assistant Widget - Deshabilitado según solicitud */}
      {/* 
      <AiAssistantWidget
        properties={properties}
        onOpenBookingModal={(prop) => {
          if (prop) setActiveScheduleProperty(prop);
          setIsScheduleModalOpen(true);
        }}
        onOpenVirtualTour={(prop) => setActiveVirtualTourProperty(prop)}
        currency={currency}
      />
      */}
    </div>
  );
}
