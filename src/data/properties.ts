import { Property } from '../types';

export const PROPERTIES_DATA: Property[] = [
  {
    id: 'prop-1',
    title: 'Apartamento Penthouse Reserva',
    tagline: 'Exclusivo dúplex con terraza 360° panorámica sobre la Cordillera Central',
    slug: 'apartamento-penthouse-reserva',
    operationType: 'comprar',
    category: 'Penthouse',
    price: 450000000,
    zone: 'Circunvalar',
    city: 'Pereira',
    address: 'Cra 14 # 11-45, Sector Circunvalar',
    area: 95,
    bedrooms: 3,
    bathrooms: 2,
    parking: 2,
    stratum: 6,
    has3DVirtualTour: true,
    featured: true,
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80'
    ],
    panoramas: [
      {
        id: 'pano-1',
        name: 'Sala & Comedor Panorámico',
        roomType: 'living',
        url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=80',
        description: 'Amplia sala de doble altura con ventanales de piso a techo y luz natural directa.',
        hotspots: [
          {
            id: 'hs-1-1',
            targetPanoramaId: 'pano-2',
            label: 'Cocina Tipo Isla Italiana',
            type: 'navigation',
            x: 2.5,
            y: 0.1,
            z: -4.0
          },
          {
            id: 'hs-1-2',
            targetPanoramaId: 'pano-3',
            label: 'Terraza & Jacuzzi Privado',
            type: 'navigation',
            x: -3.8,
            y: 0.2,
            z: 2.0
          },
          {
            id: 'hs-1-3',
            label: 'Pisos en Porcelanato Español 120x60',
            type: 'info',
            x: 0.5,
            y: -1.8,
            z: -2.0,
            info: 'Acabados de primera línea importados de Valencia, España con resistencia de alto tránsito.'
          }
        ]
      },
      {
        id: 'pano-2',
        name: 'Cocina Gourmet Equipada',
        roomType: 'kitchen',
        url: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=2000&q=80',
        description: 'Mesón en Neolith calacatta, torre de hornos y campana extractora oculta.',
        hotspots: [
          {
            id: 'hs-2-1',
            targetPanoramaId: 'pano-1',
            label: 'Volver a Sala Principal',
            type: 'navigation',
            x: -2.5,
            y: 0.0,
            z: 4.0
          },
          {
            id: 'hs-2-2',
            targetPanoramaId: 'pano-4',
            label: 'Habitación Master',
            type: 'navigation',
            x: 3.5,
            y: 0.1,
            z: -1.5
          }
        ]
      },
      {
        id: 'pano-3',
        name: 'Terraza Sky Lounge',
        roomType: 'terrace',
        url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=2000&q=80',
        description: 'Espacio al aire libre con vista a 180 grados hacia el Valle de Maraya y la Circunvalar.',
        hotspots: [
          {
            id: 'hs-3-1',
            targetPanoramaId: 'pano-1',
            label: 'Entrar a la Sala',
            type: 'navigation',
            x: 3.8,
            y: -0.2,
            z: -2.0
          }
        ]
      },
      {
        id: 'pano-4',
        name: 'Habitación Principal King',
        roomType: 'master_bedroom',
        url: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=2000&q=80',
        description: 'Espacioso dormitorio con vestier independiente y baño privado en mármol.',
        hotspots: [
          {
            id: 'hs-4-1',
            targetPanoramaId: 'pano-1',
            label: 'Volver a Sala',
            type: 'navigation',
            x: -3.5,
            y: 0.0,
            z: 1.5
          }
        ]
      }
    ],
    description: 'Penthouse moderno ubicado en el corazón financiero y gastronómico de Pereira. Diseñado para maximizar la entrada de luz y brindar vistas despejadas a las montañas. Cuenta con automatización domótica (luces, sonido, persianas), 2 parqueaderos cubiertos y depósito.',
    features: [
      'Automatización domótica total',
      'Cocina abierta con isla en Neolith',
      'Terraza privada con conexión a gas BBQ',
      'Gimnasio & Zona Húmeda en edificio',
      'Vigilancia 24/7 con control biométrico',
      'Planta eléctrica de suplencia total'
    ],
    virtualTourLiveAvailable: true,
    financialHighlights: {
      adminFee: 380000,
      predialTaxYear: 1950000,
      estimatedMonthlyRent: 3800000,
      estimatedAirbnbDaily: 280000,
      expectedOccupancyRate: 74,
      annualAppreciation: 10.5,
      capRate: 9.2
    },
    neighborhoodScores: {
      safety: 96,
      access: 98,
      commerce: 95,
      greenAreas: 85
    }
  },
  {
    id: 'prop-2',
    title: 'Villa Campestre Los Samanes',
    tagline: 'Lujosa casa campestre en Cerritos con piscina infinita y lote privado de 1.800 m²',
    slug: 'villa-campestre-los-samanes',
    operationType: 'comprar',
    category: 'Casa Campestre',
    price: 980000000,
    zone: 'Cerritos',
    city: 'Pereira',
    address: 'Condominio Campestre Los Samanes, Km 9 Vía Cerritos',
    area: 340,
    bedrooms: 4,
    bathrooms: 5,
    parking: 4,
    stratum: 6,
    has3DVirtualTour: true,
    featured: true,
    images: [
      'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?auto=format&fit=crop&w=1200&q=80'
    ],
    panoramas: [
      {
        id: 'pano-2-1',
        name: 'Jardín & Piscina Horizon',
        roomType: 'exterior',
        url: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=2000&q=80',
        description: 'Espectacular deck en madera teca con piscina climatizada sin fin y quiosco BBQ.',
        hotspots: [
          {
            id: 'hs-21-1',
            targetPanoramaId: 'pano-2-2',
            label: 'Entrar al Gran Salón',
            type: 'navigation',
            x: 0.0,
            y: 0.1,
            z: -4.5
          }
        ]
      },
      {
        id: 'pano-2-2',
        name: 'Gran Salón Integrado',
        roomType: 'living',
        url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=2000&q=80',
        description: 'Techos en madera tratada a 5 metros de altura con ventilación cruzada natural.',
        hotspots: [
          {
            id: 'hs-22-1',
            targetPanoramaId: 'pano-2-1',
            label: 'Salir al Deck y Piscina',
            type: 'navigation',
            x: 0.0,
            y: -0.1,
            z: 4.5
          }
        ]
      }
    ],
    description: 'Propiedad de ensueño en el sector más valorizado del Eje Cafetero. Clima cálido todo el año, seguridad perimetral privada, senderos ecológicos internos y acabados minimalistas integrados con la naturaleza.',
    features: [
      'Piscina privada con cascada y calefacción solar',
      'Lote plano de 1.800 m² con árboles frutales',
      '4 suites completas con baño privado y vestier',
      'Zona BBQ con horno de leña y pérgola',
      'Pozo de aguas subterráneas y paneles solares',
      'Seguridad privada con patrullaje 24 horas'
    ],
    virtualTourLiveAvailable: true,
    financialHighlights: {
      adminFee: 490000,
      predialTaxYear: 3600000,
      estimatedMonthlyRent: 8500000,
      estimatedAirbnbDaily: 850000,
      expectedOccupancyRate: 68,
      annualAppreciation: 12.8,
      capRate: 10.4
    },
    neighborhoodScores: {
      safety: 99,
      access: 92,
      commerce: 80,
      greenAreas: 100
    }
  },
  {
    id: 'prop-3',
    title: 'Sky Tower Pinares - Preventa Sobre Planos',
    tagline: 'Invierte con cuota inicial a 24 meses y plusvalía asegurada del 18%',
    slug: 'sky-tower-pinares-preventa',
    operationType: 'planos',
    category: 'Apartamento',
    price: 285000000,
    discountPrice: 269000000,
    zone: 'Pinares',
    city: 'Pereira',
    address: 'Av. Juan B. Gutiérrez con Calle 10, Pinares Alto',
    area: 68,
    bedrooms: 2,
    bathrooms: 2,
    parking: 1,
    stratum: 6,
    has3DVirtualTour: true,
    featured: true,
    onPlans: true,
    deliveryDate: 'Q4 2027',
    images: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80'
    ],
    panoramas: [
      {
        id: 'pano-3-1',
        name: 'Showroom 3D Sala & Balcón',
        roomType: 'living',
        url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=2000&q=80',
        description: 'Render fotorrealista 360 interactivo del modelo terminado tipo A.',
        hotspots: [
          {
            id: 'hs-31-1',
            label: 'Rendimiento Proyectado',
            type: 'info',
            x: 1.5,
            y: 0.2,
            z: -3.0,
            info: 'Apto para licencias turísticas (Airbnb / Renta corta) con operador hotelero en lobby.'
          }
        ]
      }
    ],
    description: 'Proyecto de alta rentabilidad ideal para inversionistas nacionales y en el exterior. Ubicación privilegiada en Pinares con fácil acceso a la Clínica Comfamiliar, centros médicos y restaurantes de alta gama.',
    features: [
      'Permiso para rentas cortas y Airbnb certificado',
      'Lobby tipo hotel con concierge 24/7',
      'Rooftop bar con piscina de borde infinito',
      'Coworking space con internet de fibra simétrica',
      'Cuota inicial diferida a 24 meses sin intereses'
    ],
    virtualTourLiveAvailable: true,
    financialHighlights: {
      adminFee: 290000,
      predialTaxYear: 1350000,
      estimatedMonthlyRent: 2700000,
      estimatedAirbnbDaily: 210000,
      expectedOccupancyRate: 80,
      annualAppreciation: 14.2,
      capRate: 11.8
    },
    neighborhoodScores: {
      safety: 97,
      access: 96,
      commerce: 94,
      greenAreas: 90
    }
  },
  {
    id: 'prop-4',
    title: 'Loft Industrial Álamos University Hub',
    tagline: 'Excelente opción de inversión para renta a ejecutivos y profesores UTP',
    slug: 'loft-industrial-alamos',
    operationType: 'comprar',
    category: 'Loft',
    price: 210000000,
    zone: 'Álamos',
    city: 'Pereira',
    address: 'Calle 14 # 25-18, Sector Álamos',
    area: 52,
    bedrooms: 1,
    bathrooms: 1,
    parking: 1,
    stratum: 5,
    has3DVirtualTour: true,
    featured: false,
    images: [
      'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?auto=format&fit=crop&w=1200&q=80'
    ],
    panoramas: [
      {
        id: 'pano-4-1',
        name: 'Espacio Loft Abierto',
        roomType: 'living',
        url: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=2000&q=80',
        description: 'Concepto loft neoyorquino con concreto a la vista y carpintería en roble oscuro.',
        hotspots: [
          {
            id: 'hs-41-1',
            label: 'Eficiencia de Espacio',
            type: 'info',
            x: -2.0,
            y: 0.1,
            z: -3.0,
            info: 'Mobiliario modular retráctil incluido en la venta.'
          }
        ]
      }
    ],
    description: 'Loft vanguardista en el vibrante sector de Álamos. A pocos pasos de la Universidad Tecnológica de Pereira y parques naturales. Alta demanda de alquiler continuo con cero vacancia histórica.',
    features: [
      'Completamente amoblado y listo para rentar',
      'Bajos costos de administración',
      'Terraza comunal con zona BBQ',
      'Lavandería comunal automatizada',
      'Parqueadero privado cubierto'
    ],
    virtualTourLiveAvailable: true,
    financialHighlights: {
      adminFee: 180000,
      predialTaxYear: 950000,
      estimatedMonthlyRent: 1850000,
      estimatedAirbnbDaily: 155000,
      expectedOccupancyRate: 85,
      annualAppreciation: 9.8,
      capRate: 10.1
    },
    neighborhoodScores: {
      safety: 93,
      access: 95,
      commerce: 90,
      greenAreas: 96
    }
  },
  {
    id: 'prop-5',
    title: 'Condominio Bambú Campestre Dosquebradas',
    tagline: 'Hermoso apartamento con vista a reserva forestal y clima fresco',
    slug: 'condominio-bambu-dosquebradas',
    operationType: 'comprar',
    category: 'Apartamento',
    price: 240000000,
    zone: 'Dosquebradas',
    city: 'Dosquebradas',
    address: 'Av. Molinos con Calle 35, Dosquebradas',
    area: 76,
    bedrooms: 3,
    bathrooms: 2,
    parking: 1,
    stratum: 4,
    has3DVirtualTour: true,
    featured: false,
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80'
    ],
    panoramas: [
      {
        id: 'pano-5-1',
        name: 'Sala Comedor & Vista Verde',
        roomType: 'living',
        url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=2000&q=80',
        description: 'Ambiente tranquilo con vista directa a la quebrada y guaduales protegidos.',
        hotspots: []
      }
    ],
    description: 'Apartamento familiar en conjunto cerrado con club house: piscina semiolímpica, canchas sintéticas, senderos para mascotas y zonas verdes. Excelente ubicación a 7 minutos del centro de Pereira por el viaducto.',
    features: [
      'Club house con 3 piscinas y sauna',
      'Cancha de fútbol 5 y squash',
      'Parque infantil y pet zone',
      'Gas domiciliario y calentador de paso',
      'Estrato 4 con servicios económicos'
    ],
    virtualTourLiveAvailable: true,
    financialHighlights: {
      adminFee: 210000,
      predialTaxYear: 1100000,
      estimatedMonthlyRent: 1700000,
      estimatedAirbnbDaily: 140000,
      expectedOccupancyRate: 70,
      annualAppreciation: 8.5,
      capRate: 8.3
    },
    neighborhoodScores: {
      safety: 90,
      access: 91,
      commerce: 88,
      greenAreas: 98
    }
  },
  {
    id: 'prop-6',
    title: 'Residencia de Lujo La Julita Hillside',
    tagline: 'Arquitectura contemporánea con vista al atardecer sobre Pereira',
    slug: 'residencia-la-julita-hillside',
    operationType: 'comprar',
    category: 'Apartamento',
    price: 680000000,
    zone: 'La Julita',
    city: 'Pereira',
    address: 'Transversal 12 # 4-80, Sector La Julita',
    area: 142,
    bedrooms: 3,
    bathrooms: 4,
    parking: 2,
    stratum: 6,
    has3DVirtualTour: true,
    featured: true,
    images: [
      'https://images.unsplash.com/photo-1574362848149-11496d93a7c7?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80'
    ],
    panoramas: [
      {
        id: 'pano-6-1',
        name: 'Sala Principal & Ventanales',
        roomType: 'living',
        url: 'https://images.unsplash.com/photo-1574362848149-11496d93a7c7?auto=format&fit=crop&w=2000&q=80',
        description: 'Acabados en cedro y mármol crema marfil con vista infinita al cañón.',
        hotspots: []
      }
    ],
    description: 'Exclusiva propiedad en La Julita, la zona residencial más tranquila y campestre dentro del perímetro urbano de Pereira. Cuenta con ascensor privado directo al apartamento, zona de servicio completa y acabados de lujo.',
    features: [
      'Ascensor directo privado al recibidor',
      'Estudio privado con aislamiento acústico',
      'Habitación de servicio con baño',
      '2 parqueaderos independientes paralelos',
      'Depósito amplio de 8 m²'
    ],
    virtualTourLiveAvailable: true,
    financialHighlights: {
      adminFee: 520000,
      predialTaxYear: 2800000,
      estimatedMonthlyRent: 5500000,
      estimatedAirbnbDaily: 420000,
      expectedOccupancyRate: 72,
      annualAppreciation: 11.2,
      capRate: 9.4
    },
    neighborhoodScores: {
      safety: 98,
      access: 94,
      commerce: 89,
      greenAreas: 95
    }
  }
];

export const ZONES_LIST = [
  'Pereira (Centro / Circunvalar)',
  'Cerritos / Campestre',
  'Pinares',
  'Álamos / UTP',
  'Dosquebradas',
  'La Julita'
];
