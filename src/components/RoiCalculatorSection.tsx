import React, { useState } from 'react';
import { Property } from '../types';
import { formatCOP } from '../utils/formatters';

interface RoiCalculatorSectionProps {
  properties?: Property[];
  currency?: 'COP' | 'USD';
  onSelectPropertyForTour?: (p: Property) => void;
}

export const RoiCalculatorSection: React.FC<RoiCalculatorSectionProps> = () => {
  const [precio, setPrecio] = useState<number>(300000000);
  const [cuotaInicial, setCuotaInicial] = useState<number>(30); // 30%
  const [plazoAnios, setPlazoAnios] = useState<number>(20); // 20 Años

  // Tasa efectiva anual de referencia (11.5% E.A.)
  const tasaEA = 0.115;
  const tasaMensual = Math.pow(1 + tasaEA, 1 / 12) - 1;
  const totalMeses = plazoAnios * 12;

  const montoCuotaInicial = (precio * cuotaInicial) / 100;
  const montoCredito = precio - montoCuotaInicial;

  // Cuota mensual aproximada francesa
  const cuotaMensual = montoCredito > 0 
    ? (montoCredito * tasaMensual * Math.pow(1 + tasaMensual, totalMeses)) / (Math.pow(1 + tasaMensual, totalMeses) - 1)
    : 0;

  // Renta estimada proyectada (Airbnb / Larga estancia ~0.8% del valor del inmueble mensual)
  const rentaEstimada = precio * 0.008;

  return (
    <section id="calculadora" className="py-16 bg-slate-950/60 border-t border-slate-800">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 text-center">
          Calculadora de Inversión y Cuota
        </h2>
        <p className="text-slate-400 text-xs text-center mb-8">
          Estima tu pago mensual y el retorno bruto proyectado.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-[#111827] p-6 rounded-3xl border border-slate-800 shadow-2xl">
          {/* Controles / Sliders */}
          <div className="space-y-4">
            <div>
              <label className="text-xs text-slate-400 block mb-1">
                Valor Inmueble (COP):{' '}
                <span id="val-inmueble-txt" className="text-[#06B6D4] font-bold">
                  {formatCOP(precio)}
                </span>
              </label>
              <input 
                type="range" 
                id="input-precio" 
                min="100000000" 
                max="1000000000" 
                step="10000000" 
                value={precio} 
                onChange={(e) => setPrecio(Number(e.target.value))} 
                className="w-full accent-[#06B6D4] cursor-pointer h-2 bg-slate-800 rounded-lg appearance-none" 
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">
                Cuota Inicial (%):{' '}
                <span id="val-cuota-txt" className="text-[#06B6D4] font-bold">
                  {cuotaInicial}%
                </span>
              </label>
              <input 
                type="range" 
                id="input-cuota" 
                min="10" 
                max="50" 
                step="5" 
                value={cuotaInicial} 
                onChange={(e) => setCuotaInicial(Number(e.target.value))} 
                className="w-full accent-[#06B6D4] cursor-pointer h-2 bg-slate-800 rounded-lg appearance-none" 
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">
                Plazo Crédito (Años):{' '}
                <span id="val-plazo-txt" className="text-[#06B6D4] font-bold">
                  {plazoAnios} Años
                </span>
              </label>
              <input 
                type="range" 
                id="input-plazo" 
                min="5" 
                max="30" 
                step="5" 
                value={plazoAnios} 
                onChange={(e) => setPlazoAnios(Number(e.target.value))} 
                className="w-full accent-[#06B6D4] cursor-pointer h-2 bg-slate-800 rounded-lg appearance-none" 
              />
            </div>
          </div>

          {/* Resultados de la Simulación */}
          <div className="bg-slate-900/90 p-6 rounded-2xl border border-slate-800 flex flex-col justify-center gap-4">
            <div>
              <span className="text-slate-400 text-xs block mb-1">Cuota Mensual Estimada:</span>
              <span id="res-cuota-mensual" className="text-2xl font-black text-[#06B6D4]">
                {formatCOP(Math.round(cuotaMensual))} COP
              </span>
            </div>
            <div className="pt-4 border-t border-slate-800">
              <span className="text-slate-400 text-xs block mb-1">Renta Estimada Proyectada (Airbnb / Larga estancia):</span>
              <span id="res-renta-estimada" className="text-xl font-bold text-[#D946EF]">
                {formatCOP(Math.round(rentaEstimada))} COP/mes
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
