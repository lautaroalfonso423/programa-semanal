"use client"

import { Calendar, CalendarDays, Sparkles, Users, Award, Bell, Clock, Info } from "lucide-react"
import { useEffect, useState } from "react"

// Estructura basada en el nuevo array de eventos
type FechasEventosItem = {
    Evento: string
    Fecha: string
    Horario?: string
    Informacion_Adicional?: string
}

// Mapeo de íconos según el nombre del evento
const getEventoIcon = (nombre: string) => {
    const key = (nombre || "").toLowerCase()
    if (key.includes("conmemoracion")) return <Sparkles className="w-5 h-5 text-amber-500" />
    if (key.includes("superintendente") || key.includes("siervos") || key.includes("ancianos") || key.includes("repre")) return <Users className="w-5 h-5 text-indigo-500" />
    if (key.includes("asamblea") || key.includes("escuela")) return <Award className="w-5 h-5 text-emerald-500" />
    if (key.includes("precursor")) return <CalendarDays className="w-5 h-5 text-blue-500" />
    return <Bell className="w-5 h-5 text-indigo-400" />
}

export default function FechasEventos() {
    const [eventos, setEventos] = useState<FechasEventosItem[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const cargarDatos = async () => {
            try {
                setLoading(true)
                setError(null)

                const url = `https://opensheet.elk.sh/1nI54IwM1Fa_uyQwgyuSoBnrp8whplw2HbQTOc2C8V5U/Fechas_Eventos`
                const res = await fetch(url)
                if (!res.ok) throw new Error("No se encontraron datos de eventos")

                const data: FechasEventosItem[] = await res.json()
                setEventos(data || [])
            } catch (err: any) {
                setError(err.message || "Error al cargar las fechas de eventos.")
            } finally {
                setLoading(false)
            }
        }

        cargarDatos()
    }, [])

    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <p className="text-sm text-slate-500 dark:text-zinc-400 animate-pulse">
                    Cargando fechas de eventos...
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

    // Filtrar solo los que tengan Fecha asignada
    const listaEventos = eventos.filter((item) => item.Fecha && item.Fecha.trim() !== "")

    if (listaEventos.length === 0) {
        return (
            <div className="text-center py-12 px-4">
                <p className="text-xs text-slate-500 dark:text-zinc-400">
                    No hay fechas de eventos registradas en este momento.
                </p>
            </div>
        )
    }

    return (
        <div className="max-w-2xl mx-auto px-3 sm:px-6 py-6 space-y-6">
            {/* Cabecera Principal */}
            <div className="flex justify-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-zinc-800/80 border border-slate-200 dark:border-zinc-700/80 text-xs sm:text-sm font-semibold text-slate-800 dark:text-zinc-100 shadow-sm backdrop-blur-sm">
                    <Calendar className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                    <span>Fechas de Eventos Especiales</span>
                </div>
            </div>

            {/* Listado de Tarjetas de Eventos */}
            <div className="space-y-4">
                {listaEventos.map((item, idx) => (
                    <div
                        key={idx}
                        className="rounded-2xl bg-white dark:bg-zinc-900/60 border border-slate-200/80 dark:border-zinc-800/80 shadow-md overflow-hidden transition-all hover:border-indigo-500/40 p-4 sm:p-5 space-y-3"
                    >
                        {/* Título Principal del Evento */}
                        <div className="flex items-start gap-3.5">
                            <div className="p-3 rounded-xl bg-indigo-500/10 dark:bg-indigo-500/20 shrink-0 mt-0.5">
                                {getEventoIcon(item.Evento)}
                            </div>
                            <div className="flex-1">
                                <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-zinc-100 tracking-tight leading-snug">
                                    {item.Evento}
                                </h3>
                                <span className="text-[11px] font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-wider block mt-0.5">
                                    Evento Programado
                                </span>
                            </div>
                        </div>

                        {/* Datos Secundarios (Fecha, Horario e Información Adicional) */}
                        <div className="pt-2 border-t border-slate-100 dark:border-zinc-800/80 flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm">
                            {item.Informacion_Adicional && item.Informacion_Adicional.trim() !== "" && (
                                <div className="w-full flex items-start gap-1.5 text-sm font-medium text-slate-600 dark:text-zinc-300 pt-1">
                                    <Info className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-500" />
                                    <span>{item.Informacion_Adicional}</span>
                                </div>
                            )}
                            <div className="flex flex-wrap items-center gap-2">
                                {/* Badge de Fecha */}
                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 text-white font-black shadow-sm">
                                    <Calendar className="w-3.5 h-3.5" />
                                    {item.Fecha}
                                </span>

                                {/* Badge de Horario si existe */}
                                {item.Horario && item.Horario.trim() !== "" && (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold border border-indigo-500/20">
                                        <Clock className="w-3.5 h-3.5 shrink-0" />
                                        {item.Horario} hs.
                                    </span>
                                )}
                            </div>

                            {/* Información Adicional si existe */}
                        
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )

}