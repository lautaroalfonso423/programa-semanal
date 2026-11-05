"use client"

import { LISTA_NOMBRES } from "@/src/hooks/datos";
import { Calendar, Sparkles, UserCheck, Mic, Video, Search } from "lucide-react"
import { useEffect, useState, useMemo } from "react"

type AsignacionItem = {
    Mes: string
    Dia: string
    Fecha: string
    "Acom. Puerta": string
    "Acom. Estacionamiento": string
    "Acom. Auditorio": string
    Audio: string
    Video: string
    Plataforma: string
    "Micro. 1": string
    "Micro. 2": string
    Limpieza: string
    Grupo: string
}



export default function Asignaciones() {
    const [asignaciones, setAsignaciones] = useState<AsignacionItem[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // Estados para los filtros
    const [filtroFecha, setFiltroFecha] = useState<string>("")
    const [filtroDia, setFiltroDia] = useState<string>("")
    const [filtroPersona, setFiltroPersona] = useState<string>("")

    useEffect(() => {
        const cargarDatos = async () => {
            try {
                setLoading(true)
                setError(null)

                const url = `https://opensheet.elk.sh/1nI54IwM1Fa_uyQwgyuSoBnrp8whplw2HbQTOc2C8V5U/Asignaciones`
                const res = await fetch(url)
                if (!res.ok) throw new Error("No se encontraron datos")

                const data: AsignacionItem[] = await res.json()

                const filtradas = data.filter(
                    (item) => item.Mes && item.Mes.trim() !== "" && item.Fecha && item.Fecha.trim() !== ""
                )

                setAsignaciones(filtradas)
            } catch (err: any) {
                setError(err.message || "Error al cargar las asignaciones.")
            } finally {
                setLoading(false)
            }
        }

        cargarDatos()
    }, [])

    // Obtener listas únicas de Fechas y Días para los dropdowns
    const fechasUnicas = useMemo(() => {
        const setFechas = new Set(asignaciones.map((a) => a.Fecha?.trim()).filter(Boolean))
        return Array.from(setFechas)
    }, [asignaciones])

    const diasUnicos = useMemo(() => {
        const setDias = new Set(asignaciones.map((a) => a.Dia?.trim()).filter(Boolean))
        return Array.from(setDias)
    }, [asignaciones])

    // Aplicar filtros
    const asignacionesFiltradas = useMemo(() => {
        return asignaciones.filter((item) => {
            // Filtro Fecha
            if (filtroFecha && item.Fecha?.trim() !== filtroFecha) return false

            // Filtro Día
            if (filtroDia && item.Dia?.trim().toLowerCase() !== filtroDia.toLowerCase()) return false

            // Filtro Persona (Revisa en todos los campos de asignación)
            if (filtroPersona) {
                const query = filtroPersona.toLowerCase().trim()
                const campos = [
                    item["Acom. Puerta"],
                    item["Acom. Estacionamiento"],
                    item["Acom. Auditorio"],
                    item.Audio,
                    item.Video,
                    item.Plataforma,
                    item["Micro. 1"],
                    item["Micro. 2"],
                    item.Limpieza
                ]
                const coincide = campos.some((val) => val && val.toLowerCase().includes(query))
                if (!coincide) return false
            }

            return true
        })
    }, [asignaciones, filtroFecha, filtroDia, filtroPersona])

    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <p className="text-sm text-slate-500 dark:text-zinc-400 animate-pulse">
                    Cargando las Asignaciones...
                </p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="max-w-md mx-auto mt-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-center">
                <p className="text-xs text-red-500 font-medium">{error}</p>
            </div>
        )
    }

    if (asignaciones.length === 0) {
        return (
            <div className="text-center py-12 px-4">
                <p className="text-xs text-slate-500 dark:text-zinc-400">
                    No hay asignaciones disponibles en este momento.
                </p>
            </div>
        )
    }

    const asignacionesPorMes = asignacionesFiltradas.reduce((acc, item) => {
        const mes = item.Mes.trim()
        if (!acc[mes]) {
            acc[mes] = []
        }
        acc[mes].push(item)
        return acc
    }, {} as Record<string, AsignacionItem[]>)

    return (
        <div className="max-w-2xl mx-auto px-3 sm:px-6 py-6 space-y-6">
            {/* Cabecera Principal */}
            <div className="flex justify-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-zinc-800/80 border border-slate-200 dark:border-zinc-700/80 text-ls sm:text-sm font-semibold text-slate-800 dark:text-zinc-100 shadow-sm backdrop-blur-sm">
                    <Calendar className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                    <span>Programa de Asignaciones</span>
                </div>
            </div>

            {/* SECCIÓN DE FILTROS */}
            <div className="bg-white dark:bg-zinc-900/80 border border-slate-200/80 dark:border-zinc-800 p-4 sm:p-5 rounded-2xl shadow-md space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Filtro por Fecha */}
                    <div className="text-center">
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-1.5 text-center">
                            Filtrar por Fecha
                        </label>
                        <select
                            value={filtroFecha}
                            onChange={(e) => setFiltroFecha(e.target.value)}
                            className="w-full bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 border border-slate-300 dark:border-zinc-700 rounded-xl text-sm sm:text-base py-3 px-3 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 text-center cursor-pointer appearance-none text-center-last"
                        >
                            <option value="" className="text-center">📅 Todas las fechas</option>
                            {fechasUnicas.map((fecha) => (
                                <option key={fecha} value={fecha} className="text-center">
                                    {fecha}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Filtro por Día */}
                    <div className="text-center">
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-1.5 text-center">
                            Filtrar por Día
                        </label>
                        <select
                            value={filtroDia}
                            onChange={(e) => setFiltroDia(e.target.value)}
                            className="w-full bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 border border-slate-300 dark:border-zinc-700 rounded-xl text-sm sm:text-base py-3 px-3 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 text-center cursor-pointer appearance-none text-center-last"
                        >
                            <option value="" className="text-center">🗓️ Todos los días</option>
                            {diasUnicos.map((dia) => (
                                <option key={dia} value={dia} className="text-center">
                                    {dia}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Buscador de Persona con datalist sugerido */}
                <div className="text-center">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-1.5 text-center">
                        Buscar por Nombre / Hermano
                    </label>
                    <div className="relative flex items-center justify-center">
                        <Search className="w-5 h-5 text-slate-400 dark:text-zinc-500 absolute left-3 pointer-events-none" />
                        <input
                            type="text"
                            list="lista-hermanos"
                            placeholder="Escribe o selecciona un nombre..."
                            value={filtroPersona}
                            onChange={(e) => setFiltroPersona(e.target.value)}
                            className="w-full bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 border border-slate-300 dark:border-zinc-700 rounded-xl text-sm sm:text-base py-3 pl-10 pr-4 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400 dark:placeholder:text-zinc-500 text-center"
                        />
                        <datalist id="lista-hermanos">
                            {LISTA_NOMBRES.map((nombre) => (
                                <option key={nombre} value={nombre} />
                            ))}
                        </datalist>
                    </div>
                </div>

                {/* Botón para limpiar filtros si hay alguno activo */}
                {(filtroFecha || filtroDia || filtroPersona) && (
                    <div className="flex justify-center pt-1">
                        <button
                            onClick={() => {
                                setFiltroFecha("")
                                setFiltroDia("")
                                setFiltroPersona("")
                            }}
                            className="text-xs sm:text-sm text-indigo-600 dark:text-indigo-400 font-bold hover:underline py-1.5 px-3 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/50"
                        >
                            ✕ Limpiar todos los filtros
                        </button>
                    </div>
                )}
            </div>

            {/* Listado agrupado por Mes */}
            {Object.keys(asignacionesPorMes).length === 0 ? (
                <div className="text-center py-8 bg-slate-50 dark:bg-zinc-900/40 rounded-2xl border border-dashed border-slate-300 dark:border-zinc-800">
                    <p className="text-ls sm:text-sm text-slate-500 dark:text-zinc-400">
                        No se encontraron asignaciones que coincidan con la búsqueda.
                    </p>
                </div>
            ) : (
                Object.entries(asignacionesPorMes).map(([mes, items]) => (
                    <div key={mes} className="space-y-4">
                        {/* Título de Mes centrado y elegante */}
                        <div className="flex items-center gap-3 pt-2">
                            <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                                <Sparkles className="w-4 h-4" />
                            </div>
                            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-zinc-100 uppercase tracking-wider">
                                {mes}
                            </h2>
                            <div className="flex-1 h-px bg-slate-200 dark:bg-zinc-800" />
                        </div>

                        {/* Tarjetas de Asignación */}
                        <div className="space-y-4">
                            {items.map((element, idx) => (
                                <div
                                    key={idx}
                                    className="rounded-2xl bg-white dark:bg-zinc-900/60 border border-slate-200/80 dark:border-zinc-800/80 shadow-md overflow-hidden transition-all hover:border-indigo-500/40"
                                >
                                    {/* Header de la Fecha */}
                                    <div className="flex items-center justify-between px-4 py-3.5 bg-gradient-to-r from-indigo-500/15 via-indigo-500/5 to-transparent border-b border-slate-200/60 dark:border-zinc-800">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-xl bg-indigo-600 text-white shadow-sm">
                                                <CalendarDaysIcon className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <span className="text-base sm:text-lg font-black text-indigo-950 dark:text-indigo-200 tracking-tight block">
                                                    {element.Fecha || ""}
                                                </span>
                                            </div>
                                        </div>
                                        <span className="text-base font-bold px-3 py-1 rounded-full bg-indigo-600 text-white shadow-sm">
                                            {element.Dia}
                                        </span>
                                    </div>

                                    {/* Cuerpo de Asignaciones */}
                                    <div className="p-4 sm:p-5 space-y-3.5 text-ls sm:text-sm">
                                        {/* Acomodadores */}
                                        <div className="space-y-1">
                                            <span className="text-[14px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                                                <UserCheck className="w-3.5 h-3.5" /> Acomodadores
                                            </span>
                                            <div className="pl-5 space-y-1 text-slate-700 dark:text-zinc-300">
                                                <p><span className="text-slate-400 dark:text-zinc-500">Puerta:</span> <strong className="text-slate-900 dark:text-zinc-100 font-bold text-ls sm:text-sm">{element["Acom. Puerta"] || "—"}</strong></p>
                                                <p><span className="text-slate-400 dark:text-zinc-500">Estacionamiento:</span> <strong className="text-slate-900 dark:text-zinc-100 font-bold text-ls sm:text-sm">{element["Acom. Estacionamiento"] || "—"}</strong></p>
                                                <p><span className="text-slate-400 dark:text-zinc-500">Auditorio:</span> <strong className="text-slate-900 dark:text-zinc-100 font-bold text-ls sm:text-sm">{element["Acom. Auditorio"] || "—"}</strong></p>
                                            </div>
                                        </div>

                                        {/* Audio y Video */}
                                        <div className="space-y-1 pt-1.5 border-t border-slate-100 dark:border-zinc-800/60">
                                            <span className="text-[14px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                                                <Video className="w-3.5 h-3.5" /> Audio y Video
                                            </span>
                                            <div className="pl-5 grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-slate-700 dark:text-zinc-300">
                                                <p><span className="text-slate-400 dark:text-zinc-500">Audio:</span> <strong className="text-slate-900 dark:text-zinc-100 font-bold text-ls sm:text-sm">{element.Audio || "—"}</strong></p>
                                                <p><span className="text-slate-400 dark:text-zinc-500">Video:</span> <strong className="text-slate-900 dark:text-zinc-100 font-bold text-ls sm:text-sm">{element.Video || "—"}</strong></p>
                                            </div>
                                        </div>

                                        {/* Plataforma y Micrófonos */}
                                        <div className="space-y-1 pt-1.5 border-t border-slate-100 dark:border-zinc-800/60">
                                            <span className="text-[14px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                                                <Mic className="w-3.5 h-3.5" /> Plataforma y Micrófonos
                                            </span>
                                            <div className="pl-5 space-y-1 text-slate-700 dark:text-zinc-300">
                                                <p><span className="text-slate-400 dark:text-zinc-500">Plataforma:</span> <strong className="text-slate-900 dark:text-zinc-100 font-bold text-ls sm:text-sm">{element.Plataforma || "—"}</strong></p>
                                                <div className="grid grid-cols-2 gap-1 pt-0.5">
                                                    <p><span className="text-slate-400 dark:text-zinc-500">Microfono 1:</span> <strong className="text-slate-900 dark:text-zinc-100 font-bold text-ls sm:text-sm">{element["Micro. 1"] || "—"}</strong></p>
                                                    <p><span className="text-slate-400 dark:text-zinc-500">Microfono 2:</span> <strong className="text-slate-900 dark:text-zinc-100 font-bold text-ls sm:text-sm">{element["Micro. 2"] || "—"}</strong></p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Limpieza (y Grupo) */}
                                        {element.Limpieza && element.Limpieza.trim() !== "" && (
                                            <div className="pt-2.5 mt-2.5 border-t border-slate-100 dark:border-zinc-800/60 flex items-center justify-between">
                                                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">Limpieza</span>
                                                <span className="text-ls font-bold px-3 py-1 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                                                    {element.Limpieza}
                                                </span>

                                                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">Grupo</span>
                                                <span className="text-ls font-bold px-3 py-1 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                                                    {element.Grupo}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))
            )}
        </div>
    )
}

function CalendarDaysIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
            <line x1="16" x2="16" y1="2" y2="6" />
            <line x1="8" x2="8" y1="2" y2="6" />
            <line x1="3" x2="21" y1="10" y2="10" />
            <path d="M8 14h.01" />
            <path d="M12 14h.01" />
            <path d="M16 14h.01" />
            <path d="M8 18h.01" />
            <path d="M12 18h.01" />
            <path d="M16 18h.01" />
        </svg>
    )
}