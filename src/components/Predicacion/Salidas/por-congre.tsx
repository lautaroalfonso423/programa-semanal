"use client"

import { DIAS_DE_SEMANA } from "@/src/hooks/datos"
import { Calendar, MapPin } from "lucide-react"
import { useEffect, useState } from "react"

type Salida = {
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

export default function PorCongre() {
    const [salidas, setSalidas] = useState<Salida[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // Arranca en null para evitar carga innecesaria de entrada
    const [mapUrl, setMapUrl] = useState<string | null>(null)

    useEffect(() => {
        const cargarDatos = async () => {
            try {
                setLoading(true)
                setError(null)

                const url = `https://opensheet.elk.sh/122SwD53EyAELMR6x-dD86eRVIW4Uva-9W8yOtpred9k/Tabla_General`
                const res = await fetch(url)
                if (!res.ok) throw new Error("No se encontraron datos")

                const data: Salida[] = await res.json()

                const filtradas = data.filter((item) =>
                    DIAS_DE_SEMANA.includes(item.Dia)
                )

                setSalidas(filtradas)
            } catch (err: any) {
                setError(err.message || "Error al cargar el programa.")
            } finally {
                setLoading(false)
            }
        }

        cargarDatos()
    }, [])

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
        return <p className="text-xm text-white dark:text-zinc-400 p-4">Cargando la Base de Datos...</p>
    }

    if (error) {
        return <p className="text-xs text-red-500 p-4">{error}</p>
    }

    if (salidas.length === 0) {
        return <p className="text-xs text-slate-500 dark:text-zinc-400 p-4">No hay ningún programa activo para esta semana.</p>
    }

    return (
        <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-sm font-semibold text-slate-800 dark:text-zinc-100 shadow-sm">
                <Calendar className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                {new Date().toLocaleDateString("es-AR", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                })}
            </div>
            
            <div id="visualizador-mapa" className="w-full rounded-xl overflow-hidden border border-slate-200 dark:border-zinc-700 shadow-md bg-white dark:bg-zinc-900 scroll-mt-4">
                <div className="p-3 bg-indigo-500/10 border-b border-indigo-500/20 text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
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
                        <div className="px-3.5 py-4 bg-amber-500/10 border-t border-amber-500/20 text-sm sm:text-sm text-amber-900 dark:text-amber-200 space-y-1.5 rounded-b-xl">
                            <p className="flex items-start sm:items-center gap-2">
                                <span className="text-sm shrink-0">💡</span> 
                                <span>Usa <strong>dos dedos</strong> para mover o hacer zoom en el mapa.</span>
                            </p>
                            <p className="flex items-start sm:items-center gap-2">
                                <span className="text-sm shrink-0">📌</span> 
                                <span>Toca el <strong>bloque de color</strong> para ver el número del territorio.</span>
                            </p>
                        </div>
                        
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center p-12 text-center text-slate-500 dark:text-zinc-400 space-y-2">
                        <MapPin className="w-10 h-10 text-indigo-500/40 animate-bounce" />
                        <p className="text-base font-medium text-slate-700 dark:text-zinc-200">
                            Toca un territorio en la lista de abajo para empezar a visualizarlo aquí.
                        </p>
                        <p className="text-xs text-slate-400 dark:text-zinc-500">
                            El mapa se cargará en este espacio de manera interactiva.
                        </p>
                    </div>
                )}
            </div>

            <div className="space-y-4" id="contenedor_salidas_generales">
                {salidas.map((element, idx) => (
                    <div
                        key={idx}
                        className="rounded-xl bg-slate-50 dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-700 overflow-hidden"
                    >
                        <div className="flex items-center justify-between px-4 py-3 bg-indigo-500/10 border-b border-indigo-500/20">
                            <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide">
                                {element.Dia || ""}
                            </span>
                            <span className="text-sm font-semibold text-slate-700 dark:text-zinc-200">
                                {element.Hora || ""}
                            </span>
                        </div>

                        <div className="p-4 space-y-2 text-base text-slate-700 dark:text-zinc-200 leading-relaxed">
                            <p>
                                <strong className="font-bold text-slate-900 dark:text-zinc-100">Ubicación:</strong>{" "}
                                <a
                                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                                        element.Ubicacion || ""
                                    )}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
                                >
                                    {element.Ubicacion || ""}
                                </a>
                            </p>
                            <p>
                                <strong className="font-bold text-slate-900 dark:text-zinc-100">Información:</strong>{" "}
                                {element.Dato_Adicional || ""}
                            </p>
                            <p>
                                <strong className="font-bold text-slate-900 dark:text-zinc-100">Conductor:</strong>{" "}
                                {element.Conductor || ""}
                            </p>
                            <p>
                                <strong className="font-bold text-slate-900 dark:text-zinc-100">Territorio Principal:</strong>{" "}
                                <button
                                    onClick={() => handleSelectTerritory(element.Territorio, element.Link_del_Terrirotorio)}
                                    className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium bg-transparent border-none p-0 cursor-pointer text-left inline"
                                >
                                    {element.Territorio || "Ver Territorio"}
                                </button>
                            </p>
                            <p>
                                <strong className="font-bold text-slate-900 dark:text-zinc-100">Territorio Secundario:</strong>{" "}
                                {element.Territorio_Secundario || ""}
                            </p>
                        </div>

                        {element.Link_de_Zoom && (
                            <div className="px-4 pb-4">
                                <a
                                    href={element.Link_de_Zoom}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex w-full items-center justify-center py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-base font-semibold transition-colors"
                                >
                                    Unirse a Zoom
                                </a>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}