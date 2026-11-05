"use client"

import { Calendar, CalendarDays, Sparkles, Users, Award, Bell } from "lucide-react"
import { useEffect, useState } from "react"

// Estructura adaptada al JSON del endpoint Fechas_Eventos
type FechasEventosData = {
    Conmemoracion?: string
    "Visita Super."?: string
    "Asamblea Circuito-1"?: string
    "Asamblea Circuito-2"?: string
    "Asamblea Regional"?: string
    "Visita del Repre."?: string
    "Reunion Anual de Precu."?: string
    [key: string]: string | undefined
}

// Diccionario de nombres personalizados para mostrar en la interfaz
const MAPEO_NOMBRES: Record<string, string> = {
    "Conmemoracion": "Conmemoración",
    "Visita Super.": "Visita del Superintendente",
    "Asamblea Circuito-1": "Asamblea de Circuito (con el superintendente de Circuito)",
    "Asamblea Circuito-2": "Asamblea de Circuito (con representante de la sucursal)",
    "Asamblea Regional": "Asamblea Regional",
    "Visita del Repre.": "Visita del Representante de la Sucursal",
    "Reunion Anual de Precu.": "Reunión Anual de Precursores",
}

// Mapeo de íconos según el nombre del evento
const getEventoIcon = (nombre: string) => {
    const key = nombre.toLowerCase()
    if (key.includes("conmemoracion")) return <Sparkles className="w-5 h-5 text-amber-500" />
    if (key.includes("super") || key.includes("repre")) return <Users className="w-5 h-5 text-indigo-500" />
    if (key.includes("asamblea")) return <Award className="w-5 h-5 text-emerald-500" />
    if (key.includes("precu")) return <CalendarDays className="w-5 h-5 text-blue-500" />
    return <Bell className="w-5 h-5 text-indigo-400" />
}

export default function FechasEventos() {
    const [eventos, setEventos] = useState<FechasEventosData | null>(null)
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

                const data: FechasEventosData[] = await res.json()

                if (data && data.length > 0) {
                    setEventos(data[0])
                }
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

    if (!eventos || Object.keys(eventos).length === 0) {
        return (
            <div className="text-center py-12 px-4">
                <p className="text-xs text-slate-500 dark:text-zinc-400">
                    No hay fechas de eventos registradas en este momento.
                </p>
            </div>
        )
    }

    // Convertir el objeto de eventos en un array filtrando los que tengan fecha
    const listaEventos = Object.entries(eventos).filter(
        ([_, fecha]) => fecha && fecha.trim() !== ""
    )

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
                {listaEventos.map(([claveOriginal, fecha], idx) => {
                    // Nombre personalizado definido en MAPEO_NOMBRES, o fallback a la clave original
                    const nombrePersonalizado = MAPEO_NOMBRES[claveOriginal] || claveOriginal

                    return (
                        <div
                            key={idx}
                            className="rounded-2xl bg-white dark:bg-zinc-900/60 border border-slate-200/80 dark:border-zinc-800/80 shadow-md overflow-hidden transition-all hover:border-indigo-500/40 p-4 sm:p-5 flex items-center justify-between gap-4"
                        >
                            {/* Información del Evento */}
                            <div className="flex items-center gap-3.5">
                                <div className="p-3 rounded-xl bg-indigo-500/10 dark:bg-indigo-500/20 shrink-0">
                                    {getEventoIcon(claveOriginal)}
                                </div>
                                <div>
                                    <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-zinc-100 tracking-tight">
                                        {nombrePersonalizado}
                                    </h3>
                                    <span className="text-[11px] font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-wider block">
                                        Evento Programado
                                    </span>
                                </div>
                            </div>

                            {/* Badge de la Fecha */}
                            <div className="shrink-0 text-right">
                                <span className="inline-block text-xs sm:text-sm font-black px-3 py-1.5 rounded-xl bg-indigo-600 text-white shadow-sm">
                                    {fecha}
                                </span>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}