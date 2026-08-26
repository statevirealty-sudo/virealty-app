import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Property, PanoramaRoom, Hotspot } from '../types';
import { 
  X, 
  RotateCw, 
  Maximize2, 
  Minimize2, 
  Compass, 
  Layers, 
  Ruler, 
  Sparkles, 
  Video, 
  MapPin, 
  PhoneCall, 
  Check, 
  ChevronRight,
  Info,
  Glasses,
  Link2,
  Upload,
  Globe,
  AlertCircle
} from 'lucide-react';
import { formatPrice } from '../utils/formatters';

interface VirtualTourModalProps {
  property: Property;
  initialPanoramaId?: string;
  onClose: () => void;
  onOpenLiveTour: (property: Property) => void;
  currency: 'COP' | 'USD';
}

export const VirtualTourModal: React.FC<VirtualTourModalProps> = ({
  property,
  initialPanoramaId,
  onClose,
  onOpenLiveTour,
  currency
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentPanoId, setCurrentPanoId] = useState<string>(
    initialPanoramaId || property.panoramas[0]?.id || 'default'
  );
  const [customPanoramaUrl, setCustomPanoramaUrl] = useState<string | null>(null);
  const [customUrlInput, setCustomUrlInput] = useState<string>('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=80');
  const [customHotspots, setCustomHotspots] = useState<Hotspot[]>([]);
  const [pannellumJsonInput, setPannellumJsonInput] = useState<string>(`{
  "type": "equirectangular",
  "panorama": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=80",
  "autoLoad": true,
  "hotspots": [
    {
      "pitch": -10,
      "yaw": 120,
      "type": "scene",
      "text": "Ir a la Cocina",
      "sceneId": "pano-2"
    },
    {
      "pitch": 0,
      "yaw": -45,
      "type": "info",
      "text": "Ventanales termoacústicos doble vidrio"
    }
  ]
}`);
  const [showCustomUrlModal, setShowCustomUrlModal] = useState<boolean>(false);
  const [urlLoadError, setUrlLoadError] = useState<string | null>(null);
  const [activeTabConfig, setActiveTabConfig] = useState<'url' | 'pannellum_json'>('pannellum_json');

  const [isAutoRotating, setIsAutoRotating] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showFloorplan, setShowFloorplan] = useState<boolean>(false);
  const [isMeasureMode, setIsMeasureMode] = useState<boolean>(false);
  const [measurePoints, setMeasurePoints] = useState<{ x: number; y: number }[]>([]);
  const [measuredDistance, setMeasuredDistance] = useState<string | null>(null);
  const [isVrMode, setIsVrMode] = useState<boolean>(false);
  const [activeTooltip, setActiveTooltip] = useState<Hotspot | null>(null);
  const [isLoadingTexture, setIsLoadingTexture] = useState<boolean>(true);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  const defaultPano: PanoramaRoom = property.panoramas.find(p => p.id === currentPanoId) || property.panoramas[0];
  
  const currentPanorama: PanoramaRoom = customPanoramaUrl ? {
    id: 'custom-equirectangular',
    name: 'Panorama 360° Pannellum (Equirectangular)',
    roomType: 'living',
    url: customPanoramaUrl,
    description: 'Fotografía panorámica equirectangular cargada dinámicamente con hotspots interactivos.',
    hotspots: customHotspots.length > 0 ? customHotspots : defaultPano.hotspots
  } : defaultPano;

  // ThreeJS Refs
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sphereRef = useRef<THREE.Mesh | null>(null);
  const textureLoaderRef = useRef<THREE.TextureLoader | null>(null);
  const animationFrameIdRef = useRef<number | null>(null);

  // Drag interaction state
  const isUserInteractingRef = useRef<boolean>(false);
  const onPointerDownPointerXRef = useRef<number>(0);
  const onPointerDownPointerYRef = useRef<number>(0);
  const lonRef = useRef<number>(0);
  const onPointerDownLonRef = useRef<number>(0);
  const latRef = useRef<number>(0);
  const onPointerDownLatRef = useRef<number>(0);
  const phiRef = useRef<number>(0);
  const thetaRef = useRef<number>(0);

  // Projected 2D hotspot positions
  const [projectedHotspots, setProjectedHotspots] = useState<{ hotspot: Hotspot; x: number; y: number; visible: boolean }[]>([]);

  // Initialize ThreeJS Scene
  useEffect(() => {
    if (!containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(75, width / height, 1, 1100);
    camera.position.set(0, 0, 0);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const geometry = new THREE.SphereGeometry(500, 60, 40);
    geometry.scale(-1, 1, 1);

    const textureLoader = new THREE.TextureLoader();
    textureLoader.setCrossOrigin('anonymous');
    textureLoaderRef.current = textureLoader;

    // Load initial texture
    setIsLoadingTexture(true);
    textureLoader.load(
      currentPanorama.url,
      (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace;
        const material = new THREE.MeshBasicMaterial({ map: texture });
        const sphere = new THREE.Mesh(geometry, material);
        scene.add(sphere);
        sphereRef.current = sphere;
        setIsLoadingTexture(false);
        setUrlLoadError(null);
      },
      undefined,
      (err) => {
        console.warn("Could not load texture from URL:", currentPanorama.url, err);
        setUrlLoadError(`No se pudo cargar la imagen desde "${currentPanorama.url}". Se activó el render de contingencia 360.`);
        // Fallback procedural texture if network image blocked
        const canvas = document.createElement('canvas');
        canvas.width = 2048;
        canvas.height = 1024;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          const grad = ctx.createLinearGradient(0, 0, 2048, 1024);
          grad.addColorStop(0, '#0f172a');
          grad.addColorStop(0.3, '#1e1b4b');
          grad.addColorStop(0.7, '#064e3b');
          grad.addColorStop(1, '#0f172a');
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, 2048, 1024);
          
          // Grid lines for 360 reference
          ctx.strokeStyle = 'rgba(6, 182, 212, 0.2)';
          ctx.lineWidth = 2;
          for (let i = 0; i < 2048; i += 128) {
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i, 1024);
            ctx.stroke();
          }
          for (let j = 0; j < 1024; j += 128) {
            ctx.beginPath();
            ctx.moveTo(0, j);
            ctx.lineTo(2048, j);
            ctx.stroke();
          }

          ctx.fillStyle = '#06B6D4';
          ctx.font = 'bold 44px Outfit, sans-serif';
          ctx.fillText(`ViREALTY 360° | ${currentPanorama.name}`, 120, 480);
          ctx.fillStyle = '#94a3b8';
          ctx.font = '24px Plus Jakarta Sans, sans-serif';
          ctx.fillText(`Visor Equirectangular Activo (${currentPanorama.url})`, 120, 530);
        }
        const canvasTexture = new THREE.CanvasTexture(canvas);
        canvasTexture.colorSpace = THREE.SRGBColorSpace;
        const material = new THREE.MeshBasicMaterial({ map: canvasTexture });
        const sphere = new THREE.Mesh(geometry, material);
        scene.add(sphere);
        sphereRef.current = sphere;
        setIsLoadingTexture(false);
      }
    );

    // Animation Loop
    const animate = () => {
      animationFrameIdRef.current = requestAnimationFrame(animate);

      if (isAutoRotating && !isUserInteractingRef.current) {
        lonRef.current += 0.12;
      }

      latRef.current = Math.max(-85, Math.min(85, latRef.current));
      phiRef.current = THREE.MathUtils.degToRad(90 - latRef.current);
      thetaRef.current = THREE.MathUtils.degToRad(lonRef.current);

      const targetX = 500 * Math.sin(phiRef.current) * Math.cos(thetaRef.current);
      const targetY = 500 * Math.cos(phiRef.current);
      const targetZ = 500 * Math.sin(phiRef.current) * Math.sin(thetaRef.current);

      if (cameraRef.current) {
        cameraRef.current.lookAt(targetX, targetY, targetZ);
        renderer.render(scene, cameraRef.current);

        // Project hotspots to 2D screen coordinates
        if (currentPanorama?.hotspots && containerRef.current) {
          const w = containerRef.current.clientWidth;
          const h = containerRef.current.clientHeight;
          const updated = currentPanorama.hotspots.map((hs) => {
            let v: THREE.Vector3;
            if (hs.pitch !== undefined && hs.yaw !== undefined) {
              // Convert Pannellum pitch (-90 to +90) & yaw (-180 to +180) to Cartesian on sphere radius 400
              const phi = THREE.MathUtils.degToRad(90 - hs.pitch);
              const theta = THREE.MathUtils.degToRad(hs.yaw);
              const px = 400 * Math.sin(phi) * Math.cos(theta);
              const py = 400 * Math.cos(phi);
              const pz = 400 * Math.sin(phi) * Math.sin(theta);
              v = new THREE.Vector3(px, py, pz);
            } else {
              v = new THREE.Vector3((hs.x ?? 0) * 100, (hs.y ?? 0) * 100, (hs.z ?? -1) * 100);
            }

            const cameraDir = new THREE.Vector3();
            cameraRef.current!.getWorldDirection(cameraDir);
            const toHotspot = v.clone().normalize();
            const dot = cameraDir.dot(toHotspot);
            
            v.project(cameraRef.current!);
            const sx = (v.x * 0.5 + 0.5) * w;
            const sy = (-(v.y * 0.5) + 0.5) * h;
            return {
              hotspot: hs,
              x: sx,
              y: sy,
              visible: dot > 0.05 && v.z < 1
            };
          });
          setProjectedHotspots(updated);
        }
      }
    };
    animate();

    const handleResize = () => {
      if (!containerRef.current || !cameraRef.current || !rendererRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
      if (rendererRef.current && containerRef.current) {
        if (containerRef.current.contains(rendererRef.current.domElement)) {
          containerRef.current.removeChild(rendererRef.current.domElement);
        }
        rendererRef.current.dispose();
      }
    };
  }, []);

  // Texture change on room switch or custom URL
  useEffect(() => {
    if (!textureLoaderRef.current || !sphereRef.current) return;
    setIsLoadingTexture(true);

    textureLoaderRef.current.load(
      currentPanorama.url,
      (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace;
        if (sphereRef.current) {
          const material = sphereRef.current.material as THREE.MeshBasicMaterial;
          if (material.map) material.map.dispose();
          material.map = texture;
          material.needsUpdate = true;
        }
        setIsLoadingTexture(false);
        setUrlLoadError(null);
      },
      undefined,
      (err) => {
        console.warn("Could not load texture from URL:", currentPanorama.url, err);
        setUrlLoadError(`No se pudo cargar la imagen desde "${currentPanorama.url}". Se activó el render de contingencia 360.`);
        // Fallback canvas texture
        const canvas = document.createElement('canvas');
        canvas.width = 2048;
        canvas.height = 1024;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          const grad = ctx.createLinearGradient(0, 0, 2048, 1024);
          grad.addColorStop(0, '#0b0f19');
          grad.addColorStop(0.5, '#1e1b4b');
          grad.addColorStop(1, '#064e3b');
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, 2048, 1024);
          
          ctx.strokeStyle = 'rgba(6, 182, 212, 0.25)';
          ctx.lineWidth = 2;
          for (let i = 0; i < 2048; i += 128) {
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i, 1024);
            ctx.stroke();
          }
          for (let j = 0; j < 1024; j += 128) {
            ctx.beginPath();
            ctx.moveTo(0, j);
            ctx.lineTo(2048, j);
            ctx.stroke();
          }

          ctx.fillStyle = '#06B6D4';
          ctx.font = 'bold 44px Outfit, sans-serif';
          ctx.fillText(`ViREALTY 360° | ${currentPanorama.name}`, 120, 480);
          ctx.fillStyle = '#cbd5e1';
          ctx.font = '24px Plus Jakarta Sans, sans-serif';
          ctx.fillText(`URL: ${currentPanorama.url}`, 120, 530);
        }
        const canvasTexture = new THREE.CanvasTexture(canvas);
        canvasTexture.colorSpace = THREE.SRGBColorSpace;
        if (sphereRef.current) {
          const material = sphereRef.current.material as THREE.MeshBasicMaterial;
          if (material.map) material.map.dispose();
          material.map = canvasTexture;
          material.needsUpdate = true;
        }
        setIsLoadingTexture(false);
      }
    );
  }, [currentPanoId, currentPanorama.url]);

  const handleApplyPannellumJson = (jsonText: string) => {
    try {
      const parsed = JSON.parse(jsonText);
      const panoUrl = parsed.panorama;
      if (!panoUrl) {
        setUrlLoadError("El objeto JSON debe contener una propiedad 'panorama' con la URL de la imagen.");
        return;
      }

      // Translate Pannellum hotspots to ViREALTY hotspots
      const mappedHotspots: Hotspot[] = Array.isArray(parsed.hotspots)
        ? parsed.hotspots.map((h: any, idx: number) => {
            const isScene = h.type === 'scene';
            return {
              id: `custom-hs-${idx}`,
              targetPanoramaId: h.sceneId || (isScene ? property.panoramas[1]?.id : undefined),
              label: h.text || (isScene ? 'Ir a escena' : 'Punto de Interés'),
              type: (isScene ? 'navigation' : 'info') as 'navigation' | 'info',
              pitch: typeof h.pitch === 'number' ? h.pitch : 0,
              yaw: typeof h.yaw === 'number' ? h.yaw : 0,
              info: h.info || h.text || undefined
            };
          })
        : [];

      setCustomHotspots(mappedHotspots);
      setCustomPanoramaUrl(panoUrl);
      setShowCustomUrlModal(false);
      setUrlLoadError(null);
    } catch (err: any) {
      setUrlLoadError(`Error al analizar JSON de Pannellum: ${err.message || 'Formato no válido'}`);
    }
  };

  const handleApplyCustomUrl = (urlToApply: string) => {
    if (!urlToApply.trim()) return;
    setCustomHotspots([
      {
        id: 'default-custom-hs',
        label: 'Ir a la Cocina',
        targetPanoramaId: property.panoramas[1]?.id || 'pano-2',
        type: 'navigation',
        pitch: -10,
        yaw: 120
      }
    ]);
    setCustomPanoramaUrl(urlToApply.trim());
    setShowCustomUrlModal(false);
    setUrlLoadError(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setCustomPanoramaUrl(event.target.result as string);
        setShowCustomUrlModal(false);
        setUrlLoadError(null);
      }
    };
    reader.readAsDataURL(file);
  };

  // Pointer Interaction Handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    if (isMeasureMode) {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      const newPt = { x: e.clientX - rect.left, y: e.clientY - rect.top };
      if (measurePoints.length === 0) {
        setMeasurePoints([newPt]);
        setMeasuredDistance(null);
      } else if (measurePoints.length === 1) {
        const p1 = measurePoints[0];
        const distPx = Math.hypot(newPt.x - p1.x, newPt.y - p1.y);
        // Estimate approx room meters based on FOV
        const estimatedMeters = (distPx * 0.012 + 1.2).toFixed(2);
        setMeasurePoints([p1, newPt]);
        setMeasuredDistance(`${estimatedMeters} m`);
      } else {
        setMeasurePoints([newPt]);
        setMeasuredDistance(null);
      }
      return;
    }

    isUserInteractingRef.current = true;
    onPointerDownPointerXRef.current = e.clientX;
    onPointerDownPointerYRef.current = e.clientY;
    onPointerDownLonRef.current = lonRef.current;
    onPointerDownLatRef.current = latRef.current;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isUserInteractingRef.current || isMeasureMode) return;
    lonRef.current = (onPointerDownPointerXRef.current - e.clientX) * 0.15 + onPointerDownLonRef.current;
    latRef.current = (e.clientY - onPointerDownPointerYRef.current) * 0.15 + onPointerDownLatRef.current;
  };

  const handlePointerUp = () => {
    isUserInteractingRef.current = false;
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (!cameraRef.current) return;
    cameraRef.current.fov = Math.max(35, Math.min(95, cameraRef.current.fov + e.deltaY * 0.05));
    cameraRef.current.updateProjectionMatrix();
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  const handleHotspotClick = (hs: Hotspot) => {
    if (hs.type === 'navigation' && hs.targetPanoramaId) {
      setCurrentPanoId(hs.targetPanoramaId);
      setActiveTooltip(null);
    } else if (hs.type === 'info') {
      setActiveTooltip(activeTooltip?.id === hs.id ? null : hs);
    }
  };

  return (
    <div 
      id="virtual-tour-modal"
      className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col overflow-hidden select-none"
    >
      {/* TOP HEADER BAR */}
      <div className="h-16 px-4 sm:px-6 bg-[#0B0F19]/90 border-b border-slate-800 flex items-center justify-between z-20">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#06B6D4] to-[#D946EF] flex items-center justify-center font-bold text-white shadow-md shadow-cyan-500/20 text-base">
            3D
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-white font-bold text-sm sm:text-base leading-tight truncate max-w-[200px] sm:max-w-md">
                {property.title}
              </h2>
              <span className="bg-[#06B6D4]/20 border border-[#06B6D4]/40 text-[#06B6D4] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                Tour Activo
              </span>
            </div>
            <p className="text-slate-400 text-xs flex items-center gap-1">
              <MapPin className="w-3 h-3 text-[#D946EF]" />
              {property.zone}, {property.city} • <span className="text-[#06B6D4] font-semibold">{currentPanorama.name}</span>
            </p>
          </div>
        </div>

        {/* Quick Toolbar */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Custom 360 / Equirectangular URL button */}
          <button
            id="tour-modal-custom-url-btn"
            onClick={() => setShowCustomUrlModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-[#06B6D4] text-xs font-semibold border border-[#06B6D4]/30 hover:border-[#06B6D4] transition-all cursor-pointer"
            title="Cargar URL 360° / Pannellum"
          >
            <Link2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Cargar URL 360°</span>
          </button>

          {/* Live Tour CTA */}
          <button
            id="tour-modal-live-btn"
            onClick={() => onOpenLiveTour(property)}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#06B6D4] to-[#D946EF] text-white text-xs font-bold hover:opacity-90 transition-all glow-effect cursor-pointer"
          >
            <Video className="w-3.5 h-3.5" />
            Asesor en Vivo
          </button>

          {/* Share/Copy link */}
          <button
            id="tour-modal-copy-link"
            onClick={() => {
              navigator.clipboard?.writeText(window.location.href);
              setCopiedLink(true);
              setTimeout(() => setCopiedLink(false), 2000);
            }}
            className="hidden md:flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs transition-all border border-slate-700"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Sparkles className="w-3.5 h-3.5 text-[#06B6D4]" />}
            {copiedLink ? 'Enlace Copiado' : 'Compartir 3D'}
          </button>

          {/* Close button */}
          <button
            id="tour-modal-close-btn"
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all border border-slate-700 cursor-pointer"
            title="Cerrar Visor 3D"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* CUSTOM URL ACTIVE BANNER / ERROR BANNER */}
      {customPanoramaUrl && (
        <div className="bg-[#06B6D4]/10 border-b border-[#06B6D4]/30 px-4 py-2 flex items-center justify-between text-xs z-20">
          <div className="flex items-center gap-2 text-cyan-200">
            <Globe className="w-4 h-4 text-[#06B6D4] shrink-0" />
            <span className="truncate max-w-[280px] sm:max-w-xl">
              <strong className="text-white">Panorama Equirectangular Activo:</strong> {customPanoramaUrl}
            </span>
          </div>
          <button
            id="tour-restore-default-pano"
            onClick={() => {
              setCustomPanoramaUrl(null);
              setUrlLoadError(null);
            }}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium text-[11px] border border-slate-600 shrink-0 ml-2"
          >
            Restablecer Inmueble
          </button>
        </div>
      )}

      {urlLoadError && !customPanoramaUrl && (
        <div className="bg-amber-500/10 border-b border-amber-500/30 px-4 py-1.5 flex items-center gap-2 text-amber-300 text-xs z-20">
          <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
          <span>{urlLoadError}</span>
        </div>
      )}

      {/* 3D CANVAS & INTERACTION STAGE */}
      <div 
        ref={containerRef}
        className={`relative flex-1 bg-black overflow-hidden cursor-grab active:cursor-grabbing ${isVrMode ? 'grid grid-cols-2 gap-2' : ''}`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onWheel={handleWheel}
      >
        {/* Loading overlay */}
        {isLoadingTexture && (
          <div className="absolute inset-0 z-30 bg-[#0B0F19]/80 backdrop-blur-md flex flex-col items-center justify-center gap-3">
            <div className="w-12 h-12 rounded-full border-4 border-[#06B6D4]/20 border-t-[#06B6D4] animate-spin"></div>
            <p className="text-sm font-semibold text-slate-300">Cargando render fotorrealista 360°...</p>
          </div>
        )}

        {/* PROJECTED HOTSPOTS */}
        {projectedHotspots.map(({ hotspot, x, y, visible }) => {
          if (!visible) return null;
          return (
            <div
              key={hotspot.id}
              style={{
                left: `${x}px`,
                top: `${y}px`,
                transform: 'translate(-50%, -50%)',
              }}
              className="absolute z-20 pointer-events-auto"
            >
              <button
                id={`hotspot-${hotspot.id}`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleHotspotClick(hotspot);
                }}
                className="group relative flex items-center justify-center cursor-pointer"
              >
                {/* Glowing Pulse Ring */}
                <span className="absolute w-10 h-10 rounded-full bg-[#06B6D4]/30 animate-ping"></span>
                <span className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#06B6D4] to-[#D946EF] flex items-center justify-center text-white text-xs shadow-lg shadow-cyan-500/50 border-2 border-white/80 transition-transform group-hover:scale-125">
                  {hotspot.type === 'navigation' ? (
                    <ChevronRight className="w-4 h-4" />
                  ) : (
                    <Info className="w-4 h-4" />
                  )}
                </span>
                
                {/* Hotspot Label Pill */}
                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 whitespace-nowrap bg-slate-900/90 text-white text-xs font-semibold px-3 py-1 rounded-full border border-slate-700 shadow-xl backdrop-blur-md opacity-90 group-hover:opacity-100 transition-all flex items-center gap-1.5">
                  <span>{hotspot.label}</span>
                </div>
              </button>

              {/* Info popup modal if clicked */}
              {activeTooltip?.id === hotspot.id && hotspot.info && (
                <div 
                  className="absolute top-12 left-1/2 -translate-x-1/2 w-64 p-3.5 rounded-xl bg-[#111827]/95 border border-[#06B6D4]/40 backdrop-blur-xl text-white shadow-2xl text-xs z-30"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-slate-800">
                    <span className="font-bold text-[#06B6D4] flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" /> Detalle Arquitectónico
                    </span>
                    <button 
                      onClick={() => setActiveTooltip(null)} 
                      className="text-slate-400 hover:text-white"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-slate-300 leading-relaxed">{hotspot.info}</p>
                </div>
              )}
            </div>
          );
        })}

        {/* MEASUREMENT TOOL OVERLAY (SVG line) */}
        {isMeasureMode && (
          <div className="absolute inset-0 pointer-events-none z-20">
            <svg className="w-full h-full">
              {measurePoints.length === 2 && (
                <>
                  <line
                    x1={measurePoints[0].x}
                    y1={measurePoints[0].y}
                    x2={measurePoints[1].x}
                    y2={measurePoints[1].y}
                    stroke="#D946EF"
                    strokeWidth="3"
                    strokeDasharray="6 4"
                  />
                  <circle cx={measurePoints[0].x} cy={measurePoints[0].y} r="6" fill="#06B6D4" />
                  <circle cx={measurePoints[1].x} cy={measurePoints[1].y} r="6" fill="#D946EF" />
                </>
              )}
              {measurePoints.length === 1 && (
                <circle cx={measurePoints[0].x} cy={measurePoints[0].y} r="6" fill="#06B6D4" />
              )}
            </svg>

            {measuredDistance && measurePoints.length === 2 && (
              <div 
                style={{
                  left: `${(measurePoints[0].x + measurePoints[1].x) / 2}px`,
                  top: `${(measurePoints[0].y + measurePoints[1].y) / 2 - 20}px`,
                }}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 bg-slate-900/95 border border-[#D946EF] text-white text-xs font-bold px-3 py-1 rounded-full shadow-xl pointer-events-auto flex items-center gap-1.5"
              >
                <Ruler className="w-3.5 h-3.5 text-[#D946EF]" />
                <span>Distancia estimada: {measuredDistance}</span>
              </div>
            )}
          </div>
        )}

        {/* FLOATING CONTROLS (Top Right of Canvas) */}
        <div className="absolute top-4 right-4 z-20 flex flex-col gap-2 pointer-events-auto">
          {/* Auto-rotation toggle */}
          <button
            id="tour-btn-autorotate"
            onClick={() => setIsAutoRotating(!isAutoRotating)}
            className={`p-2.5 rounded-xl backdrop-blur-md border transition-all ${
              isAutoRotating 
                ? 'bg-[#06B6D4]/30 border-[#06B6D4] text-[#06B6D4]' 
                : 'bg-slate-900/80 border-slate-700 text-slate-300 hover:bg-slate-800'
            }`}
            title={isAutoRotating ? 'Pausar Giro Automático' : 'Activar Giro Automático'}
          >
            <RotateCw className={`w-4 h-4 ${isAutoRotating ? 'animate-spin' : ''}`} />
          </button>

          {/* Measurement ruler toggle */}
          <button
            id="tour-btn-measure"
            onClick={() => {
              setIsMeasureMode(!isMeasureMode);
              setMeasurePoints([]);
              setMeasuredDistance(null);
            }}
            className={`p-2.5 rounded-xl backdrop-blur-md border transition-all ${
              isMeasureMode 
                ? 'bg-[#D946EF]/30 border-[#D946EF] text-[#D946EF]' 
                : 'bg-slate-900/80 border-slate-700 text-slate-300 hover:bg-slate-800'
            }`}
            title="Herramienta de Medición Láser 3D"
          >
            <Ruler className="w-4 h-4" />
          </button>

          {/* Floorplan Drawer Toggle */}
          <button
            id="tour-btn-floorplan"
            onClick={() => setShowFloorplan(!showFloorplan)}
            className={`p-2.5 rounded-xl backdrop-blur-md border transition-all ${
              showFloorplan 
                ? 'bg-[#8B5CF6]/30 border-[#8B5CF6] text-[#8B5CF6]' 
                : 'bg-slate-900/80 border-slate-700 text-slate-300 hover:bg-slate-800'
            }`}
            title="Plano / Dollhouse 2D"
          >
            <Layers className="w-4 h-4" />
          </button>

          {/* VR Mode */}
          <button
            id="tour-btn-vr"
            onClick={() => setIsVrMode(!isVrMode)}
            className={`p-2.5 rounded-xl backdrop-blur-md border transition-all ${
              isVrMode 
                ? 'bg-[#06B6D4]/30 border-[#06B6D4] text-[#06B6D4]' 
                : 'bg-slate-900/80 border-slate-700 text-slate-300 hover:bg-slate-800'
            }`}
            title="Modo VR Gafas Estereoscópicas"
          >
            <Glasses className="w-4 h-4" />
          </button>

          {/* Fullscreen Toggle */}
          <button
            id="tour-btn-fullscreen"
            onClick={toggleFullscreen}
            className="p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-700 backdrop-blur-md transition-all"
            title="Pantalla Completa"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>

        {/* MEASURE MODE HELPER BANNER */}
        {isMeasureMode && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 bg-slate-900/90 border border-[#D946EF]/50 text-white text-xs px-4 py-2 rounded-full shadow-2xl backdrop-blur-md flex items-center gap-2">
            <Ruler className="w-4 h-4 text-[#D946EF]" />
            <span>Haz clic en dos puntos del espacio para medir la distancia láser en metros.</span>
          </div>
        )}

        {/* 2D DOLLHOUSE / FLOORPLAN OVERLAY */}
        {showFloorplan && (
          <div 
            className="absolute top-16 left-4 z-20 w-72 sm:w-80 bg-[#111827]/95 border border-slate-700 rounded-2xl p-4 shadow-2xl backdrop-blur-xl text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
              <span className="font-bold text-xs uppercase text-[#06B6D4] flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5" /> Plano Arquitectónico ({property.area} m²)
              </span>
              <button onClick={() => setShowFloorplan(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Stylized Floorplan Graphic */}
            <div className="relative h-44 bg-slate-950/80 rounded-xl border border-slate-800 p-2 overflow-hidden flex items-center justify-center">
              <div className="grid grid-cols-2 grid-rows-2 gap-2 w-full h-full p-2 border border-dashed border-slate-700 rounded-lg">
                <button
                  onClick={() => setCurrentPanoId(property.panoramas[0]?.id || '')}
                  className={`p-2 rounded border text-left text-[11px] font-semibold transition-all ${
                    currentPanoId === property.panoramas[0]?.id
                      ? 'bg-[#06B6D4]/30 border-[#06B6D4] text-[#06B6D4]'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  Sala & Comedor
                </button>
                <button
                  onClick={() => setCurrentPanoId(property.panoramas[1]?.id || property.panoramas[0]?.id)}
                  className={`p-2 rounded border text-left text-[11px] font-semibold transition-all ${
                    currentPanoId === property.panoramas[1]?.id
                      ? 'bg-[#06B6D4]/30 border-[#06B6D4] text-[#06B6D4]'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  Cocina
                </button>
                <button
                  onClick={() => setCurrentPanoId(property.panoramas[2]?.id || property.panoramas[0]?.id)}
                  className={`p-2 rounded border text-left text-[11px] font-semibold transition-all ${
                    currentPanoId === property.panoramas[2]?.id
                      ? 'bg-[#06B6D4]/30 border-[#06B6D4] text-[#06B6D4]'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  Balcón / Terraza
                </button>
                <button
                  onClick={() => setCurrentPanoId(property.panoramas[3]?.id || property.panoramas[0]?.id)}
                  className={`p-2 rounded border text-left text-[11px] font-semibold transition-all ${
                    currentPanoId === property.panoramas[3]?.id
                      ? 'bg-[#06B6D4]/30 border-[#06B6D4] text-[#06B6D4]'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  Habitación King
                </button>
              </div>
            </div>
            <p className="text-[10px] text-slate-400 mt-2 text-center">
              Haz clic en cualquier ambiente para transportarte de inmediato.
            </p>
          </div>
        )}
      </div>

      {/* BOTTOM ROOM NAVIGATION CAROUSEL */}
      <div className="bg-[#0B0F19]/95 border-t border-slate-800 p-3 sm:p-4 z-20">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Room Thumbnails */}
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
            {property.panoramas.map((pano, idx) => {
              const isActive = pano.id === currentPanoId && !customPanoramaUrl;
              return (
                <button
                  key={pano.id}
                  id={`room-btn-${pano.id}`}
                  onClick={() => {
                    setCustomPanoramaUrl(null);
                    setCurrentPanoId(pano.id);
                  }}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-[#06B6D4]/20 to-[#D946EF]/20 border-[#06B6D4] text-white shadow-lg shadow-cyan-500/10'
                      : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-[#06B6D4] animate-pulse' : 'bg-slate-600'}`} />
                  <span>{pano.name}</span>
                </button>
              );
            })}

            {/* Custom equirectangular room button */}
            <button
              id="room-btn-custom-url"
              onClick={() => setShowCustomUrlModal(true)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border shrink-0 cursor-pointer ${
                customPanoramaUrl
                  ? 'bg-gradient-to-r from-[#06B6D4]/30 to-[#D946EF]/30 border-[#06B6D4] text-cyan-200 shadow-lg shadow-cyan-500/20'
                  : 'bg-slate-900/60 border-dashed border-slate-700 text-[#06B6D4] hover:bg-slate-800'
              }`}
            >
              <Link2 className="w-3 h-3" />
              <span>{customPanoramaUrl ? '360° Personalizado' : '+ Cargar 360'}</span>
            </button>
          </div>

          {/* Quick Price & Action */}
          <div className="flex items-center justify-between w-full sm:w-auto gap-4">
            <div className="text-left sm:text-right">
              <div className="text-[#D946EF] font-extrabold text-base sm:text-lg leading-tight">
                {formatPrice(property.price, currency)}
              </div>
              <div className="text-slate-400 text-[11px]">
                {property.area} m² • {property.bedrooms} Hab • {property.bathrooms} Baños
              </div>
            </div>

            <button
              id="tour-modal-reserve-btn"
              onClick={() => onOpenLiveTour(property)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#06B6D4] to-[#D946EF] text-white font-bold text-xs hover:opacity-90 transition-all glow-effect flex items-center gap-1.5 cursor-pointer"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Contactar Asesor</span>
            </button>
          </div>
        </div>
      </div>

      {/* CUSTOM URL & PANNELLUM EQUIRECTANGULAR MODAL */}
      {showCustomUrlModal && (
        <div 
          id="custom-url-modal"
          className="fixed inset-0 z-60 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setShowCustomUrlModal(false)}
        >
          <div 
            className="w-full max-w-lg bg-[#111827] border border-slate-700 rounded-2xl p-6 shadow-2xl text-white relative animate-in fade-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#06B6D4]/20 border border-[#06B6D4]/40 flex items-center justify-center text-[#06B6D4]">
                  <Link2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white">Cargar Panorama 360° Equirectangular</h3>
                  <p className="text-[11px] text-slate-400">Compatible con Pannellum, Matterport y fotos 360</p>
                </div>
              </div>
              <button 
                onClick={() => setShowCustomUrlModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Config Mode Tabs */}
            <div className="flex border-b border-slate-800 mb-4">
              <button
                onClick={() => setActiveTabConfig('pannellum_json')}
                className={`flex-1 pb-2.5 text-xs font-bold transition-all border-b-2 cursor-pointer ${
                  activeTabConfig === 'pannellum_json'
                    ? 'border-[#06B6D4] text-[#06B6D4]'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Pannellum JSON Config (Hotspots & Escenas)
              </button>
              <button
                onClick={() => setActiveTabConfig('url')}
                className={`flex-1 pb-2.5 text-xs font-bold transition-all border-b-2 cursor-pointer ${
                  activeTabConfig === 'url'
                    ? 'border-[#06B6D4] text-[#06B6D4]'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                URL Directa / Archivo Local
              </button>
            </div>

            {/* TAB 1: PANNELLUM JSON CONFIG */}
            {activeTabConfig === 'pannellum_json' && (
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-slate-300">
                      Pega tu configuración <span className="text-[#06B6D4] font-mono">pannellum.viewer</span>:
                    </label>
                    <button
                      onClick={() => {
                        const example = `{
  "type": "equirectangular",
  "panorama": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=80",
  "autoLoad": true,
  "hotspots": [
    {
      "pitch": -10,
      "yaw": 120,
      "type": "scene",
      "text": "Ir a la Cocina",
      "sceneId": "pano-2"
    },
    {
      "pitch": 5,
      "yaw": -30,
      "type": "info",
      "text": "Ventanales con vista a la cordillera"
    }
  ]
}`;
                        setPannellumJsonInput(example);
                      }}
                      className="text-[11px] text-[#06B6D4] hover:underline"
                    >
                      Cargar Ejemplo con Cocina
                    </button>
                  </div>
                  <textarea
                    id="pannellum-json-editor"
                    rows={8}
                    value={pannellumJsonInput}
                    onChange={(e) => setPannellumJsonInput(e.target.value)}
                    placeholder='{"type": "equirectangular", "panorama": "sala.jpg", "hotspots": [{"pitch": -10, "yaw": 120, "type": "scene", "text": "Ir a la Cocina", "sceneId": "cocina"}]}'
                    className="w-full bg-slate-950 border border-slate-700 focus:border-[#06B6D4] rounded-xl p-3 text-xs font-mono text-cyan-200 placeholder-slate-600 focus:outline-none leading-relaxed"
                  />
                </div>

                <div className="flex items-center justify-between gap-3 pt-1">
                  <span className="text-[11px] text-slate-400">
                    Soporta pitch, yaw, sceneId, type y text.
                  </span>
                  <button
                    id="run-pannellum-json-btn"
                    onClick={() => handleApplyPannellumJson(pannellumJsonInput)}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#06B6D4] to-[#D946EF] text-white text-xs font-bold hover:opacity-90 transition-all cursor-pointer shadow-lg shadow-cyan-500/20"
                  >
                    Ejecutar Tour Pannellum
                  </button>
                </div>
              </div>
            )}

            {/* TAB 2: SIMPLE URL / UPLOAD */}
            {activeTabConfig === 'url' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    URL del Panorama Equirectangular (JPG / PNG):
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      id="custom-panorama-url-input"
                      value={customUrlInput}
                      onChange={(e) => setCustomUrlInput(e.target.value)}
                      placeholder="https://tu-servidor.com/fotos/apartamento-101-sala.jpg"
                      className="flex-1 bg-slate-900 border border-slate-700 focus:border-[#06B6D4] rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none"
                    />
                    <button
                      id="custom-panorama-submit-btn"
                      onClick={() => handleApplyCustomUrl(customUrlInput)}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#06B6D4] to-[#D946EF] text-white text-xs font-bold hover:opacity-90 transition-all shrink-0 cursor-pointer"
                    >
                      Visualizar
                    </button>
                  </div>
                </div>

                {/* Local File Upload */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    O sube una imagen 360° desde tu equipo:
                  </label>
                  <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-700 hover:border-[#06B6D4] rounded-xl p-3 bg-slate-900/50 cursor-pointer transition-colors group">
                    <Upload className="w-5 h-5 text-slate-400 group-hover:text-[#06B6D4] mb-1" />
                    <span className="text-xs text-slate-300 group-hover:text-white">Seleccionar archivo 360° local</span>
                    <span className="text-[10px] text-slate-500">Proyección equirectangular 2:1 recomendada</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Presets */}
                <div>
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                    Ejemplos & Presets de Prueba:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        const url = 'https://pannellum.org/images/alma.jpg';
                        setCustomUrlInput(url);
                        handleApplyCustomUrl(url);
                      }}
                      className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-left text-xs text-slate-300 hover:border-[#06B6D4]/50 transition-all flex items-center justify-between"
                    >
                      <div>
                        <strong className="text-white block text-[11px]">Pannellum Alma Demo</strong>
                        <span className="text-[10px] text-slate-500">pannellum.org/images/alma.jpg</span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-[#06B6D4]" />
                    </button>

                    <button
                      onClick={() => {
                        const url = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=80';
                        setCustomUrlInput(url);
                        handleApplyCustomUrl(url);
                      }}
                      className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-left text-xs text-slate-300 hover:border-[#06B6D4]/50 transition-all flex items-center justify-between"
                    >
                      <div>
                        <strong className="text-white block text-[11px]">Sala Penthouse ViREALTY</strong>
                        <span className="text-[10px] text-slate-500">Render Alta Definición</span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-[#06B6D4]" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
