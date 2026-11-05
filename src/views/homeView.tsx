'use client';

import { useState } from 'react';
import {
  Calendar,
  BookOpen,
  X,
  PanelLeftOpen,
  CalendarDays,
  UserCircle2,

} from 'lucide-react';
import SalidasVista from '../components/Predicacion/salidasVista';
import Carritos from '../components/Predicacion/carritos';
import EntreSemana from '../components/Reunion/entre-semana';
import FinDeSemana from '../components/Reunion/fin-semana';
import Asignaciones from '../components/Reunion/asignaciones';

type datosPredi = 'salidas' | 'carrito';
type datosReunion = 'entre_semana' | 'fin_semana' | "fecha_eventos" | "asignaciones";

export default function HomeView() {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'reading' | 'tasks'>('reading');
  const [isDarkMode] = useState(true);

  const [vistaActiva, setVistaActiva] = useState<datosPredi | null>('salidas');
  const [vistaReu, setVistaReu] = useState<datosReunion | null>(null);

  const seleccionarPredicacion = (vista: datosPredi) => {
    setVistaActiva(vista);
    setVistaReu(null);
  };

  const seleccionarReunion = (vista: datosReunion) => {
    setVistaReu(vista);
    setVistaActiva(null);
  };

  return (
    <div
    className={`min-h-screen w-full ${
      isDarkMode ? 'dark bg-[var(--background)] text-[var(--foreground)]' : 'bg-slate-50 text-slate-900'
    } transition-colors duration-300 flex overflow-x-hidden font-sans relative`}
    >
    {/* OVERLAY PARA MÓVILES */}
    {isPanelOpen && (
      <div
      onClick={() => setIsPanelOpen(false)}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity"
      />
    )}

    {/* PANEL DESPLEGABLE LATERAL */}
    <aside
    className={`
      fixed top-0 left-0 h-full z-50
      w-[280px] sm:w-[320px] lg:w-[360px]
      bg-white dark:bg-zinc-900
      border-r border-slate-200 dark:border-zinc-800
      shadow-2xl
      transform transition-transform duration-300 ease-in-out flex flex-col
      ${isPanelOpen ? 'translate-x-0' : '-translate-x-full'}
      `}
      >
      {/* Header del Panel */}
      <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-zinc-800 flex items-center justify-between bg-slate-50/50 dark:bg-zinc-900/80">
      <div className="flex items-center gap-2.5">
      <div className="p-2 rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-500/20">
      <Calendar className="w-5 h-5" />
      </div>
      <div>
      <h2 className="font-bold text-sm sm:text-base text-slate-900 dark:text-zinc-100">
      Programas Semanales
      </h2>
      <p className="text-[11px] text-slate-500 dark:text-zinc-400">Cong. Sur Barranqueras</p>
      </div>
      </div>

      <button
      onClick={() => setIsPanelOpen(false)}
      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
      title="Cerrar Panel"
      >
      <X className="w-5 h-5" />
      </button>
      </div>

      {/* Pestañas de Navegación del Sidebar (Solo Predicación y Reunión) */}
      <div className="flex border-b border-slate-200 dark:border-zinc-800 px-3 pt-2 gap-1 bg-slate-50/30 dark:bg-zinc-900/50">

      <button
      onClick={() => setActiveTab('reading')}
      className={`flex-1 py-2 text-xs font-semibold rounded-t-lg transition-colors flex items-center justify-center gap-1 border-b-2 ${
        activeTab === 'reading'
        ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 bg-white dark:bg-zinc-800/80'
        : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-zinc-400 dark:hover:text-zinc-200'
      }`}
      >
      <BookOpen className="w-4 h-4" />
      <span>Predicación</span>
      </button>

      <button
      onClick={() => setActiveTab('tasks')}
      className={`flex-1 py-2 text-xs font-semibold rounded-t-lg transition-colors flex items-center justify-center gap-1 border-b-2 ${
        activeTab === 'tasks'
        ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 bg-white dark:bg-zinc-800/80'
        : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-zinc-400 dark:hover:text-zinc-200'
      }`}
      >
      <UserCircle2 className="w-4 h-4" />
      <span>Reunión</span>
      </button>
      </div>

      {/* Contenido Dinámico del Sidebar */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {activeTab === 'reading' && (
        <div className="space-y-2">
        <button
        onClick={() => seleccionarPredicacion('salidas')}
        className={`w-full py-3 px-4 rounded-lg text-xs font-semibold transition-all flex items-center gap-3 border-l-4 ${
          vistaActiva === 'salidas'
          ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300'
          : 'border-slate-300 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800/40 text-slate-600 dark:text-zinc-300 hover:border-indigo-500 hover:bg-slate-100 dark:hover:bg-zinc-800'
        }`}
        >
        <BookOpen className="w-4 h-4" />
        <span className="flex-1 text-left">Salidas de Predicación</span>
        <span className="text-[10px] opacity-60">→</span>
        </button>

        <button
        onClick={() => seleccionarPredicacion('carrito')}
        className={`w-full py-3 px-4 rounded-lg text-xs font-semibold transition-all flex items-center gap-3 border-l-4 ${
          vistaActiva === 'carrito'
          ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300'
          : 'border-slate-300 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800/40 text-slate-600 dark:text-zinc-300 hover:border-indigo-500 hover:bg-slate-100 dark:hover:bg-zinc-800'
        }`}
        >
        <Calendar className="w-4 h-4" />
        <span className="flex-1 text-left">Carritos</span>
        <span className="text-[10px] opacity-60">→</span>
        </button>
        </div>
      )}

      {activeTab === 'tasks' && (
        <div className="space-y-2">
        <button
        onClick={() => seleccionarReunion('entre_semana')}
        className={`w-full py-3 px-4 rounded-lg text-xs font-semibold transition-all flex items-center gap-3 border-l-4 ${
          vistaReu === 'entre_semana'
          ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300'
          : 'border-slate-300 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800/40 text-slate-600 dark:text-zinc-300 hover:border-indigo-500 hover:bg-slate-100 dark:hover:bg-zinc-800'
        }`}
        >
        <BookOpen className="w-4 h-4" />
        <span className="flex-1 text-left">Entre Semana</span>
        <span className="text-[10px] opacity-60">→</span>
        </button>

        <button
        onClick={() => seleccionarReunion('fin_semana')}
        className={`w-full py-3 px-4 rounded-lg text-xs font-semibold transition-all flex items-center gap-3 border-l-4 ${
          vistaReu === 'fin_semana'
          ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300'
          : 'border-slate-300 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800/40 text-slate-600 dark:text-zinc-300 hover:border-indigo-500 hover:bg-slate-100 dark:hover:bg-zinc-800'
        }`}
        >
        <CalendarDays className="w-4 h-4" />
        <span className="flex-1 text-left">Fin de Semana</span>
        <span className="text-[10px] opacity-60">→</span>
        </button>
        <button
        onClick={() => seleccionarReunion('asignaciones')}
        className={`w-full py-3 px-4 rounded-lg text-xs font-semibold transition-all flex items-center gap-3 border-l-4 ${vistaReu === 'asignaciones'
          ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-300'
          : 'border-slate-300 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800/40 text-slate-600 dark:text-zinc-300 hover:border-indigo-500 hover:bg-slate-100 dark:hover:bg-zinc-800'
        }`}
        >
        <UserCircle2 className="w-4 h-4 shrink-0" />
        <span className="flex-1 text-left">Asignaciones</span>
        <span className="text-[10px] opacity-60">→</span>
        </button>

        {/* Botón Fechas de Eventos */}
        <button
        onClick={() => seleccionarReunion("fecha_eventos")}
        className={`w-full py-3 px-4 rounded-lg text-xs font-semibold transition-all flex items-center gap-3 border-l-4 ${vistaReu === 'fecha_eventos'
          ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-300'
          : 'border-slate-300 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800/40 text-slate-600 dark:text-zinc-300 hover:border-indigo-500 hover:bg-slate-100 dark:hover:bg-zinc-800'
        }`}
        >
        <CalendarDays className="w-4 h-4 shrink-0" />
        <span className="flex-1 text-left">Fechas de Eventos</span>
        <span className="text-[10px] opacity-60">→</span>
        </button>


        </div>
      )}
      </div>

      <div className="p-4 border-t border-slate-200 dark:border-zinc-800 text-center text-[11px] text-slate-400 dark:text-zinc-500">
      Cong. Sur Barranqueras • Edición 2026
      </div>
      </aside>

      {/* ÁREA PRINCIPAL DE CONTENIDO */}
      <main
      className={`
        flex-1 min-h-screen transition-all duration-300 w-full
        ${isPanelOpen ? 'lg:pl-[360px]' : 'pl-0'}
        `}
        >
        <header className="sticky top-0 z-30 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-slate-200 dark:border-zinc-800 px-4 py-3 flex items-center gap-3">
        {!isPanelOpen && (
          <button
          onClick={() => setIsPanelOpen(true)}
          className="p-2 rounded-xl bg-white dark:bg-zinc-800 text-slate-700 dark:text-zinc-200 hover:bg-indigo-50 dark:hover:bg-indigo-950 hover:text-indigo-600 transition-all flex items-center gap-2 text-xs font-semibold shadow-sm border border-slate-200 dark:border-zinc-700 shrink-0"
          title="Abrir Panel"
          >
          <PanelLeftOpen className="w-4 h-4" />
          <span className="hidden sm:inline">Menú</span>
          </button>
        )}

        <h1 className="text-sm sm:text-base font-semibold text-slate-700 dark:text-zinc-200">
        {vistaActiva === 'salidas' && 'Salidas de Predicación'}
        {vistaActiva === 'carrito' && 'Carrito de Predicación'}
        {vistaReu === 'entre_semana' && 'Reunión Entre Semana'}
        {vistaReu === 'fin_semana' && 'Reunión de Fin de Semana'}
        {vistaReu === "fecha_eventos" && 'Fecha de Eventos'}
        {vistaReu === "asignaciones" && 'Asignaciones'}
        {!vistaActiva && !vistaReu && 'Inicio'}
        </h1>
        </header>

        <div className="w-full pb-10">
        {vistaActiva === 'salidas' && <SalidasVista />}
        {vistaActiva === 'carrito' && (
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
          <Carritos />
          </div>
        )}
        {vistaReu === 'entre_semana' && <EntreSemana />}
        {vistaReu === 'fin_semana' && <FinDeSemana />}
        {vistaReu === "fecha_eventos" && <EntreSemana />}
        {vistaReu === "asignaciones" && <Asignaciones/>}

        {!vistaActiva && !vistaReu && (
          <div className="flex items-center justify-center min-h-[60vh] text-slate-400 dark:text-zinc-500 text-sm">
          Selecciona una opción del panel para comenzar.
          </div>
        )}
        </div>
        </main>
        </div>
  );
}
