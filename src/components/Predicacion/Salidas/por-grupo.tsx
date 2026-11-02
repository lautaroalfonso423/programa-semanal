"use client"

import { DIAS_DE_SEMANA } from "@/src/hooks/datos"
import { Calendar, Filter, MapPin } from "lucide-react"
import { useEffect, useMemo, useState } from "react"

type SalidaGrupo = {
    Dia: string
    Hora: string
    Ubicacion: string
    Dato_Adicional: string
    Conductor: string
    Territorio: string
    Link_del_Terrirotorio: string
    Territorio_Secundario: string
    Link_de_Zoom: string
}

const MAP_ID = "12e40jLmRQSPotpgZ-W8V77N3fp_YH6k"

export default function PorGrupo() {
    const [salidas, setSalidas] = useState<SalidaGrupo[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [mapUrl, setMapUrl] = useState<string | null>(null)

    const [filtroDia, setFiltroDia] = useState<string>("TODOS")
    const [filtroGrupo, setFiltroGrupo] = useState<string>("TODOS")

    useEffect(() => {
        const cargarDatos = async () => {
            try {
                setLoading(true)
                setError(null)

                const url = `https://opensheet.elk.sh/122SwD53EyAELMR6x-dD86eRVIW4Uva-9W8yOtpred9k/Tabla_Grupo`
                const res = await fetch(url)
                if (!res.ok) throw new Error("No se encontraron datos")

                const data: SalidaGrupo[] = await res.json()
                const filtradas = data.filter((item) => DIAS_DE_SEMANA.includes(item.Dia))

                setSalidas(filtradas)
            } catch (err: any) {
                setError(err.message || "Error al cargar el programa.")
            } finally {
                setLoading(false)
            }
        }

        cargarDatos()
    }, [])

    const diasDisponibles = useMemo(() => {
        const setDías = new Set(salidas.map((s) => s.Dia).filter(Boolean))
        return Array.from(setDías)
    }, [salidas])

    const gruposDisponibles = useMemo(() => {
        const setGrupos = new Set(salidas.map((s) => s.Dato_Adicional).filter(Boolean))
        return Array.from(setGrupos)
    }, [salidas])

    const salidasFiltradas = useMemo(() => {
        return salidas.filter((item) => {
            const coincideDia = filtroDia === "TODOS" || item.Dia === filtroDia
            const coincideGrupo = filtroGrupo === "TODOS" || item.Dato_Adicional === filtroGrupo
            return coincideDia && coincideGrupo
        })
    }, [salidas, filtroDia, filtroGrupo])

    const handleSelectTerritory = (territorioVal: string, linkVal: string) => {
        const rawLink = (linkVal || "").trim()
        const rawTerritorio = (territorioVal || "").trim()

        let newUrl = `https://www.google.com/maps/d/embed?mid=${MAP_ID}&ehbc=2E312F`

        if (rawLink.includes(",") && !isNaN(parseFloat(rawLink.split(",")[0]))) {
            const coords = rawLink.replace(/\s+/g, "")
            newUrl = `https://www.google.com/maps/d/embed?mid=${MAP_ID}&ll=${coords}&z=17`
        } else if (rawTerritorio) {
            newUrl = `https://www.google.com/maps/d/embed?mid=${MAP_ID}&q=${encodeURIComponent(rawTerritorio)}`
        }

        setMapUrl(newUrl)

        const mapaElement = document.getElementById("visualizador-mapa")
        if (mapaElement) {
            mapaElement.scrollIntoView({ behavior: "smooth", block: "start" })
        }
    }

    if (loading) {
        return <p className="text-base text-slate-600 dark:text-slate-400 p-6 font-medium">Cargando la Base de Datos...</p>
    }

    if (error) {
        return <p className="text-base text-red-500 p-6 font-medium">{error}</p>
    }

    return (
        <div className="space-y-6">
            {/* Cabecera adaptada y limpia sin fondo pesado */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 py-2">
                <div className="inline-flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white dark:bg-[#182030] border border-slate-200 dark:border-slate-800 text-base font-semibold text-slate-800 dark:text-slate-100 shadow-sm">
                    <Calendar className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                    <span>
                        {new Date().toLocaleDateString("es-AR", {
                            weekday: "long",
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                        })}
                    </span>
                </div>

                {/* Filtros espaciados */}
                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                    <div className="flex items-center gap-2 bg-white dark:bg-[#182030] border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 shadow-sm flex-1 md:flex-initial">
                        <Filter className="w-4 h-4 text-slate-400 shrink-0" />
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

                    <div className="flex items-center gap-2 bg-white dark:bg-[#182030] border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 shadow-sm flex-1 md:flex-initial">
                        <select
                            value={filtroGrupo}
                            onChange={(e) => setFiltroGrupo(e.target.value)}
                            className="text-sm md:text-base bg-transparent text-slate-700 dark:text-slate-200 font-medium focus:outline-none w-full cursor-pointer"
                        >
                            <option value="TODOS" className="dark:bg-[#182030]">👥 Todos los grupos</option>
                            {gruposDisponibles.map((grupo) => (
                                <option key={grupo} value={grupo} className="dark:bg-[#182030]">
                                    {grupo}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Visualizador de Territorio */}
            <div id="visualizador-mapa" className="w-full rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-md bg-white dark:bg-[#182030] scroll-mt-4">
                <div className="p-4 bg-indigo-500/10 border-b border-indigo-500/20 text-base font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2.5">
                    <MapPin className="w-5 h-5" />
                    <span>Visualizador de Territorio en Vivo</span>
                </div>

                {mapUrl ? (
                    <>
                        <iframe
                            src={mapUrl}
                            width="100%"
                            height="550"
                            className="w-full border-0"
                            allowFullScreen
                            loading="lazy"
                        ></iframe>
                        <div className="px-4 py-4 bg-amber-500/10 border-t border-amber-500/20 text-base text-amber-900 dark:text-amber-200 space-y-2 rounded-b-2xl">
                            <p className="flex items-center gap-2.5">
                                <span className="text-base shrink-0">💡</span>
                                <span>Usa <strong>dos dedos</strong> para mover o hacer zoom en el mapa.</span>
                            </p>
                            <p className="flex items-center gap-2.5">
                                <span className="text-base shrink-0">📌</span>
                                <span>Toca el <strong>bloque de color</strong> para ver el número del territorio.</span>
                            </p>
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center p-12 text-center text-slate-500 dark:text-slate-400 space-y-3">
                        <MapPin className="w-12 h-12 text-indigo-500/40 animate-bounce" />
                        <p className="text-lg font-semibold text-slate-700 dark:text-slate-200">
                            Toca un territorio en la lista de abajo para empezar a visualizarlo aquí.
                        </p>
                        <p className="text-sm text-slate-400 dark:text-slate-500">
                            El mapa se cargará en este espacio de manera interactiva.
                        </p>
                    </div>
                )}
            </div>

            {/* Listado de Salidas Grupales */}
            <div className="grid gap-5 sm:grid-cols-2" id="contenedor_salidas_grupales">
                {salidasFiltradas.length === 0 ? (
                    <p className="text-base text-slate-500 dark:text-slate-400 p-6 col-span-full text-center">
                        No hay salidas que coincidan con los filtros seleccionados.
                    </p>
                ) : (
                    salidasFiltradas.map((element, idx) => (
                        <div
                            key={idx}
                            className="rounded-2xl bg-slate-50 dark:bg-[#182030]/50 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm flex flex-col justify-between"
                        >
                            <div>
                                <div className="flex items-center justify-between px-5 py-3.5 bg-indigo-500/10 border-b border-indigo-500/20">
                                    <span className="text-base font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide">
                                        {element.Dia || ""}
                                    </span>
                                    <span className="text-base font-bold text-slate-700 dark:text-slate-200">
                                        {element.Hora || ""}
                                    </span>
                                </div>

                                <div className="p-5 space-y-3 text-lg text-slate-700 dark:text-slate-200 leading-relaxed">
                                    <p>
                                        <strong className="font-bold text-slate-900 dark:text-slate-100">Ubicación:</strong>{" "}
                                        <a
                                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                                                element.Ubicacion || ""
                                            )}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold"
                                        >
                                            {element.Ubicacion || ""}
                                        </a>
                                    </p>
                                    <p>
                                        <strong className="font-bold text-slate-900 dark:text-slate-100">Información:</strong>{" "}
                                        <span className="text-base">{element.Dato_Adicional || ""}</span>
                                    </p>
                                    <p>
                                        <strong className="font-bold text-slate-900 dark:text-slate-100">Conductor:</strong>{" "}
                                        {element.Conductor || ""}
                                    </p>
                                    <p>
                                        <strong className="font-bold text-slate-900 dark:text-slate-100">Territorio Principal:</strong>{" "}
                                        <button
                                            onClick={() => handleSelectTerritory(element.Territorio, element.Link_del_Terrirotorio)}
                                            className="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold bg-transparent border-none p-0 cursor-pointer text-left inline"
                                        >
                                            {element.Territorio || "Ver Territorio"}
                                        </button>
                                    </p>
                                </div>
                            </div>

                            {element.Link_de_Zoom && (
                                <div className="px-5 pb-5 pt-2">
                                    <a
                                        href={element.Link_de_Zoom}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex w-full items-center justify-center py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-lg font-bold transition-colors shadow"
                                    >
                                        Unirse a Zoom
                                    </a>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}