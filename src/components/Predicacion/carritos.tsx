"use client"

import { Calendar, Filter, ShoppingBag, Sun, Sunset, MapPin } from "lucide-react"
import { useEffect, useState, useMemo } from "react"

// Estructura adaptada al JSON real
type ItemCarrito = {
    Semana: string
    Dia: string
    Fecha: string
    // Barranqueras
    Barranqueras?: string
    "Carrito 1 Maña."?: string
    "Carrito 2 Maña."?: string
    "Carrito 3 Maña."?: string
    "Carrito 1 Tarde"?: string
    "Carrito 2 Tarde"?: string
    "Carrito 3 Tarde"?: string
    // Vilelas
    Vilelas?: string
    "Carrito 1 Mañana"?: string
    "Carrito 1 Tarde_Vile."?: string
}

export default function Carritos() {
    const [carritos, setCarritos] = useState<ItemCarrito[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // Filtros
    const [filtroSemana, setFiltroSemana] = useState<string>("TODOS")
    const [filtroDia, setFiltroDia] = useState<string>("TODOS")

    useEffect(() => {
        const cargarDatos = async () => {
            try {
                setLoading(true)
                setError(null)

                const url = `https://opensheet.elk.sh/122SwD53EyAELMR6x-dD86eRVIW4Uva-9W8yOtpred9k/Carritos`
                const res = await fetch(url)
                if (!res.ok) throw new Error("No se encontraron datos")

                const data: ItemCarrito[] = await res.json()

                // Filtrar registros válidos con Semana y Día
                const filtradas = data.filter(
                    (item) => item.Semana && item.Semana.trim() !== "" && item.Dia && item.Dia.trim() !== ""
                )

                setCarritos(filtradas)
            } catch (err: any) {
                setError(err.message || "Error al cargar los datos de carritos.")
            } finally {
                setLoading(false)
            }
        }

        cargarDatos()
    }, [])

    const semanasDisponibles = useMemo(() => {
        const setSemanas = new Set(carritos.map((c) => c.Semana?.trim()).filter(Boolean))
        return Array.from(setSemanas)
    }, [carritos])

    const diasDisponibles = useMemo(() => {
        const setDias = new Set(carritos.map((c) => c.Dia?.trim()).filter(Boolean))
        return Array.from(setDias)
    }, [carritos])

    const carritosFiltrados = useMemo(() => {
        return carritos.filter((item) => {
            const coincideSemana = filtroSemana === "TODOS" || item.Semana?.trim() === filtroSemana
            const coincideDia = filtroDia === "TODOS" || item.Dia?.trim().toLowerCase() === filtroDia.toLowerCase()
            return coincideSemana && coincideDia
        })
    }, [carritos, filtroSemana, filtroDia])

    // Agrupar por Semana
    const carritosPorSemana = useMemo(() => {
        return carritosFiltrados.reduce((acc, item) => {
            const sem = item.Semana.trim()
            if (!acc[sem]) {
                acc[sem] = []
            }
            acc[sem].push(item)
            return acc
        }, {} as Record<string, ItemCarrito[]>)
    }, [carritosFiltrados])

    if (loading) {
        return (
            <p className="text-base text-slate-600 dark:text-slate-400 p-6 font-medium text-center animate-pulse">
                Cargando programa de Carritos...
            </p>
        )
    }

    if (error) {
        return (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-center max-w-md mx-auto my-4">
                <p className="text-base text-red-500 font-medium">{error}</p>
            </div>
        )
    }

    return (
        <div className="space-y-8 max-w-4xl mx-auto px-2 sm:px-4 py-4">
            {/* Cabecera y Filtros */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="inline-flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white dark:bg-[#182030] border border-slate-200 dark:border-slate-800 text-base font-semibold text-slate-800 dark:text-slate-100 shadow-sm">
                    <ShoppingBag className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                    <span>Predicación Pública con Carritos</span>
                </div>

                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                    <div className="flex items-center gap-2 bg-white dark:bg-[#182030] border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 shadow-sm flex-1 md:flex-initial">
                        <Filter className="w-4 h-4 text-slate-400 shrink-0" />
                        <select
                            value={filtroSemana}
                            onChange={(e) => setFiltroSemana(e.target.value)}
                            className="text-sm md:text-base bg-transparent text-slate-700 dark:text-slate-200 font-medium focus:outline-none w-full cursor-pointer"
                        >
                            <option value="TODOS" className="dark:bg-[#182030]">🗓️ Todas las semanas</option>
                            {semanasDisponibles.map((sem) => (
                                <option key={sem} value={sem} className="dark:bg-[#182030]">
                                    {sem}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex items-center gap-2 bg-white dark:bg-[#182030] border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 shadow-sm flex-1 md:flex-initial">
                        <select
                            value={filtroDia}
                            onChange={(e) => setFiltroDia(e.target.value)}
                            className="text-sm md:text-base bg-transparent text-slate-700 dark:text-slate-200 font-medium focus:outline-none w-full cursor-pointer"
                        >
                            <option value="TODOS" className="dark:bg-[#182030]">📅 Todos los días</option>
                            {diasDisponibles.map((dia) => (
                                <option key={dia} value={dia} className="dark:bg-[#182030]">
                                    {dia}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Renderizado de semanas */}
            {Object.keys(carritosPorSemana).length === 0 ? (
                <div className="p-8 text-center bg-slate-50 dark:bg-[#182030]/40 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800">
                    <p className="text-base text-slate-500 dark:text-slate-400">
                        No hay turnos registrados que coincidan con los filtros seleccionados.
                    </p>
                </div>
            ) : (
                Object.entries(carritosPorSemana).map(([semana, diasList]) => (
                    <div key={semana} className="space-y-6">
                        {/* Título de la Semana */}
                        <div className="border-b-2 border-indigo-500/30 pb-2 pt-2">
                            <h2 className="text-lg sm:text-xl font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-wider flex items-center gap-2">
                                <Calendar className="w-5 h-5" />
                                {semana}
                            </h2>
                        </div>

                        {/* Tarjetas diarias */}
                        <div className="space-y-6">
                            {diasList.map((element, idx) => {
                                const tieneBarranqueras =
                                    element["Carrito 1 Maña."] ||
                                    element["Carrito 2 Maña."] ||
                                    element["Carrito 3 Maña."] ||
                                    element["Carrito 1 Tarde"] ||
                                    element["Carrito 2 Tarde"] ||
                                    element["Carrito 3 Tarde"]

                                const tieneVilelas =
                                    element["Carrito 1 Mañana"] ||
                                    element["Carrito 1 Tarde_Vile."]

                                return (
                                    <div
                                        key={idx}
                                        className="rounded-2xl bg-white dark:bg-[#182030]/60 border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-sm space-y-4"
                                    >
                                        {/* Header Día y Fecha */}
                                        <div className="flex items-center justify-between px-5 py-3.5 bg-indigo-500/10 border-b border-indigo-500/20">
                                            <span className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100 uppercase">
                                                {element.Dia || ""}
                                            </span>
                                            {element.Fecha && (
                                                <span className="text-sm sm:text-base font-bold px-3 py-1 rounded-full bg-indigo-600 text-white shadow-sm">
                                                    {element.Fecha}
                                                </span>
                                            )}
                                        </div>

                                        <div className="p-4 sm:p-5 space-y-6">
                                            {/* BLOQUE BARRANQUERAS */}
                                            <div className="space-y-4">
                                                <div className="flex items-center gap-2 pb-1.5 border-b text-slate font-bold text-base uppercase">
                                                    <MapPin className="w-4 h-4" />
                                                    <span>Barranqueras (PLAZA DE LA INTEGRACIÓN  "REGIMIENTO")</span>
                                                </div>

                                                {!tieneBarranqueras ? (
                                                    <p className="text-xs sm:text-sm text-slate-400 dark:text-zinc-500 italic pl-2">
                                                        Sin asignaciones programadas.
                                                    </p>
                                                ) : (
                                                    <div className="space-y-4">
                                                        {/* Turno Mañana Barranqueras */}
                                                        {(element["Carrito 1 Maña."] || element["Carrito 2 Maña."] || element["Carrito 3 Maña."]) && (
                                                            <div className="space-y-2">
                                                                <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1">
                                                                    <Sun className="w-3.5 h-3.5" /> Turno Mañana
                                                                </span>
                                                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                                                                    {element["Carrito 1 Maña."] && (
                                                                        <div className="p-3 rounded-xl bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/20">
                                                                            <span className="text-[11px] font-bold text-amber-700 dark:text-amber-300 uppercase block">Carrito 1</span>
                                                                            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{element["Carrito 1 Maña."]}</p>
                                                                        </div>
                                                                    )}
                                                                    {element["Carrito 2 Maña."] && (
                                                                        <div className="p-3 rounded-xl bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/20">
                                                                            <span className="text-[11px] font-bold text-amber-700 dark:text-amber-300 uppercase block">Carrito 2</span>
                                                                            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{element["Carrito 2 Maña."]}</p>
                                                                        </div>
                                                                    )}
                                                                    {element["Carrito 3 Maña."] && (
                                                                        <div className="p-3 rounded-xl bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/20">
                                                                            <span className="text-[11px] font-bold text-amber-700 dark:text-amber-300 uppercase block">Carrito 3</span>
                                                                            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{element["Carrito 3 Maña."]}</p>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        )}

                                                        {/* Turno Tarde Barranqueras */}
                                                        {(element["Carrito 1 Tarde"] || element["Carrito 2 Tarde"] || element["Carrito 3 Tarde"]) && (
                                                            <div className="space-y-2">
                                                                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider flex items-center gap-1">
                                                                    <Sunset className="w-3.5 h-3.5" /> Turno Tarde
                                                                </span>
                                                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                                                                    {element["Carrito 1 Tarde"] && (
                                                                        <div className="p-3 rounded-xl bg-indigo-500/5 dark:bg-indigo-500/10 border border-indigo-500/20">
                                                                            <span className="text-[11px] font-bold text-indigo-700 dark:text-indigo-300 uppercase block">Carrito 1</span>
                                                                            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{element["Carrito 1 Tarde"]}</p>
                                                                        </div>
                                                                    )}
                                                                    {element["Carrito 2 Tarde"] && (
                                                                        <div className="p-3 rounded-xl bg-indigo-500/5 dark:bg-indigo-500/10 border border-indigo-500/20">
                                                                            <span className="text-[11px] font-bold text-indigo-700 dark:text-indigo-300 uppercase block">Carrito 2</span>
                                                                            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{element["Carrito 2 Tarde"]}</p>
                                                                        </div>
                                                                    )}
                                                                    {element["Carrito 3 Tarde"] && (
                                                                        <div className="p-3 rounded-xl bg-indigo-500/5 dark:bg-indigo-500/10 border border-indigo-500/20">
                                                                            <span className="text-[11px] font-bold text-indigo-700 dark:text-indigo-300 uppercase block">Carrito 3</span>
                                                                            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{element["Carrito 3 Tarde"]}</p>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>

                                            {/* BLOQUE VILELAS */}
                                            <div className="space-y-4 pt-2 border-slate-100 dark:border-slate-800">
                                                <div className="flex items-center gap-2 pb-1.5 border-b text-slate font-bold text-base uppercase">
                                                    <MapPin className="w-4 h-4" />
                                                    <span>Vilelas</span>
                                                </div>

                                                {!tieneVilelas ? (
                                                    <p className="text-xs sm:text-sm text-slate-400 dark:text-zinc-500 italic pl-2">
                                                        Sin asignaciones programadas.
                                                    </p>
                                                ) : (
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                        {element["Carrito 1 Mañana"] && (
                                                            <div className="p-3 rounded-xl bg-yellow-500/5 dark:bg-yellow-500/10 border border-yellow-500/20 space-y-1">
                                                                <span className="text-[11px] font-bold text-yellow-700 dark:text-yellow-300 uppercase flex items-center gap-1">
                                                                    <Sun className="w-3 h-3" /> Turno Mañana
                                                                </span>
                                                                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{element["Carrito 1 Mañana"]}</p>
                                                            </div>
                                                        )}

                                                        {element["Carrito 1 Tarde_Vile."] && (
                                                            <div className="p-3 rounded-xl bg-emerald-500/5 dark:bg-indigo-500/10 border border-indigo-500/20 space-y-1">
                                                                <span className="text-[11px] font-bold text-indigo-700 dark:text-indigo-300 uppercase flex items-center gap-1">
                                                                    <Sunset className="w-3 h-3" /> Turno Tarde
                                                                </span>
                                                                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{element["Carrito 1 Tarde_Vile."]}</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                ))
            )}
        </div>
    )
}