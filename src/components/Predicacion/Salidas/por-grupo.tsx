    "use client"

    import { DIAS_DE_SEMANA } from "@/src/hooks/datos"
import { Calendar } from "lucide-react"
    import { useEffect, useState } from "react"

    // Tipo de dato según las columnas de la hoja Tabla_Grupo
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


    export default function PorGrupo() {
    const [salidas, setSalidas] = useState<SalidaGrupo[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const cargarDatos = async () => {
        try {
            setLoading(true)
            setError(null)

            const url = `https://opensheet.elk.sh/122SwD53EyAELMR6x-dD86eRVIW4Uva-9W8yOtpred9k/Tabla_Grupo`
            const res = await fetch(url)
            if (!res.ok) throw new Error("No se encontraron datos")

            const data: SalidaGrupo[] = await res.json()

            // Filtrar solo los días válidos
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

    if (loading) {
        return (
        <p className="text-xm text-white dark:text-zinc-400 p-4">
            Cargando la Base de Datos...
        </p>
        )
    }

    if (error) {
        return (
        <p className="text-xs text-red-500 p-4">
            {error}
        </p>
        )
    }

    if (salidas.length === 0) {
        return (
        <p className="text-xs text-slate-500 dark:text-zinc-400 p-4">
            No hay ningún programa activo para esta semana.
        </p>
        )
    }

  return (
  <div className="space-y-4">
    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-sm font-semibold text-slate-800 dark:text-zinc-100 shadow-sm">
      <Calendar className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
      {new Date().toLocaleDateString("es-AR", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })}
    </div>

    {/* Grid de tarjetas */}
    <div className="grid gap-4 sm:grid-cols-2" id="contenedor_salidas_grupales">
      {salidas.map((element, idx) => (
        <div
          key={idx}
          className="rounded-xl bg-slate-50 dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-700 overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-indigo-500/10 border-b border-indigo-500/20">
            <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide">
              {element.Dia || ""}
            </span>
            <span className="text-sm font-semibold text-slate-700 dark:text-zinc-200">
              {element.Hora || ""}
            </span>
          </div>

          {/* Cuerpo */}
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
              <a
                href={element.Link_del_Terrirotorio || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
              >
                {element.Territorio || ""}
              </a>
            </p>
            <p>
              <strong className="font-bold text-slate-900 dark:text-zinc-100">Territorio Secundario:</strong>{" "}
              {element.Territorio_Secundario || ""}
            </p>
          </div>

          {/* Footer (solo si hay Zoom) */}
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