"use client"

import { useEffect, useState } from "react"
import { Calendar, Mic2, BookOpen } from "lucide-react"

type ControlAtalaya = {
  Miercoles?: string
  Permisos_Reunion_Entre_Semana?: string
  Domingo?: string
  Permisos_Reunion_Fin_Semana?: string
}

type Atalaya = {
  Dia_Fin_Semana: string
  Presidente: string
  Cantico_inicio: string
  Titulo_Discurso: string
  Discursante: string
  Congregacion: string
  Cantico_intermedio: string
  Conductor_Atalaya: string
  Lector_atalaya: string
  Cantico_final: string
  Oracion_Final: string
  Grupo_Limpieza: string
  Encargado: string
}

// Función auxiliar para normalizar fechas
const normalizarFecha = (fecha: string) => {
  if (!fecha) return ""
  return fecha
    .trim()
    .split("/")
    .map((parte) => parseInt(parte, 10).toString())
    .join("/")
}

export default function FinDeSemana() {
  const [data, setData] = useState<Atalaya | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true)
        setError(null)

        const fetchTabla = async (nombre: string) => {
          const url = `https://opensheet.elk.sh/1uLNHtuM2fcaaCaIXh5lGy-Im5vou6uItiM8YjgiLmL4/${nombre}`
          const res = await fetch(url)
          if (!res.ok) throw new Error(`No se encontraron datos en ${nombre}`)
          return await res.json()
        }

        // 1. Consultamos Tabla_Principal para buscar qué fecha de fin de semana está activa
        const controlData: ControlAtalaya[] = await fetchTabla("Tabla_Principal")
        const semanaActiva = controlData.find((e) => e.Permisos_Reunion_Fin_Semana === "active")

        if (!semanaActiva || !semanaActiva.Domingo) {
          setError("No hay ninguna reunión de fin de semana activa en este momento.")
          return
        }

        const fechaActivaNormalizada = normalizarFecha(semanaActiva.Domingo)

        // 2. Consultamos la tabla de contenido de la Atalaya
        const atalayaRows: Atalaya[] = await fetchTabla("Tabla_Atalaya")

        // 3. Buscamos la fila que coincida con la fecha activa
        const activo = atalayaRows.find(
          (e) => normalizarFecha(e.Dia_Fin_Semana) === fechaActivaNormalizada
        )

        if (!activo) {
          setError(`El control está activo para el "${semanaActiva.Domingo}", pero no se encontró un programa de Atalaya con esa misma fecha exacta.`)
          return
        }

        setData(activo)
      } catch (err: any) {
        setError(err.message || "Error al cargar el programa de fin de semana.")
      } finally {
        setLoading(false)
      }
    }

    cargarDatos()
  }, [])

   if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <p className="text-sm text-zinc-400 animate-pulse">
          Cargando la Reunión del Fin de Semana...
        </p>
      </div>
    )
  }
  if (error) {
    return (
      <div className="mx-4 mt-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-center">
        <p className="text-sm text-red-400 font-bold">{error}</p>
      </div>
    )
  }

  if (!data) return null

  return (
    <div className="w-full space-y-2 pb-10">

      {/* ============================ */}
      {/* TARJETA PRINCIPAL             */}
      {/* ============================ */}
      <section className="w-full bg-white dark:bg-zinc-900 border-y border-zinc-200 dark:border-zinc-800 p-4 space-y-5 shadow-sm">

        {/* ============ ENCABEZADO ============ */}
        <div className="space-y-4 pb-5 border-zinc-200 dark:border-zinc-800">

          {/* Fecha destacada */}
          <div className="flex justify-center py-1">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white shadow-md text-base font-black tracking-wide">
              <Calendar className="w-5 h-5 shrink-0" />
              <span>Domingo: {data.Dia_Fin_Semana || "-"}</span>
            </div>
          </div>

          {/* Presidente */}
          <h4 className="text-base sm:text-lg font-black text-zinc-900 dark:text-zinc-100 text-center uppercase tracking-wide">
            Presidente: <span className="text-indigo-600 dark:text-indigo-400">{data.Presidente || "-"}</span>
          </h4>

          {/* Cántico de inicio */}
          <div className="flex justify-between items-center gap-4 border-zinc-100 dark:border-zinc-800/80 text-sm sm:text-base">
            <span className="font-bold text-zinc-500 dark:text-zinc-400">Cántico de Inicio:</span>
            <span className="font-black text-zinc-900 dark:text-zinc-100">Canción {data.Cantico_inicio || "-"}</span>
          </div>
        </div>

        {/* ============ DISCURSO PÚBLICO ============ */}
        <div className="space-y-3">
          <header className="flex items-center gap-2.5 pb-3 border-b border-zinc-200 dark:border-zinc-800">
            <Mic2 className="w-6 h-6 text-indigo-600 dark:text-indigo-400 shrink-0" />
            <h3 className="text-lg sm:text-xl font-black text-zinc-900 dark:text-zinc-100 uppercase tracking-wide">
              Discurso Público
            </h3>
          </header>

          <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/60 space-y-3">
            <p className="text-sm sm:text-base font-black text-indigo-600 dark:text-indigo-400 flex justify-between items-center gap-2">
              <span>{data.Titulo_Discurso || "-"}</span>
              <span className="text-xs sm:text-sm font-bold text-zinc-500 dark:text-zinc-400 bg-zinc-200 dark:bg-zinc-900 px-2.5 py-1 rounded-lg shrink-0">(30 mins.)</span>
            </p>
            <div className="space-y-1.5 text-sm sm:text-base pt-1">
              <p className="font-extrabold text-zinc-900 dark:text-zinc-100">
                Orador: <span className="font-normal">{data.Discursante || "-"}</span>
              </p>
              <p className="font-extrabold text-zinc-900 dark:text-zinc-100">
                Congregación: <span className="font-normal">{data.Congregacion || "-"}</span>
              </p>
            </div>
          </div>
        </div>

        {/* ============ ESTUDIO DE LA ATALAYA ============ */}
        <div className="space-y-3 pt-2">
          <header className="flex items-center gap-2.5 pb-3 border-b border-zinc-200 dark:border-zinc-800">
            <BookOpen className="w-6 h-6 text-indigo-600 dark:text-indigo-400 shrink-0" />
            <h3 className="text-lg sm:text-xl font-black text-zinc-900 dark:text-zinc-100 uppercase tracking-wide">
              Estudio de la Atalaya
            </h3>
          </header>

          {/* Cántico intermedio */}
          <div className="flex justify-between items-center gap-4 py-2  border-zinc-100 dark:border-zinc-800/80 text-sm sm:text-base">
            <span className="font-bold text-zinc-500 dark:text-zinc-400">Cántico Intermedio:</span>
            <span className="font-black text-zinc-900 dark:text-zinc-100">Canción {data.Cantico_intermedio || "-"}</span>
          </div>

          {/* Conductor y Lector */}
          <div className="space-y-2 pt-1">
            <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/60 space-y-2 text-sm sm:text-base">
              <div className="flex justify-between items-center gap-4">
                <span className="font-extrabold text-zinc-500 dark:text-zinc-400">Conductor:</span>
                <span className="font-black text-zinc-900 dark:text-zinc-100">{data.Conductor_Atalaya || "-"}</span>
              </div>
              <div className="flex justify-between items-center gap-4 pt-1 border-t border-zinc-200 dark:border-zinc-700/40">
                <span className="font-extrabold text-zinc-500 dark:text-zinc-400">Lector:</span>
                <span className="font-black text-zinc-900 dark:text-zinc-100">{data.Lector_atalaya || "-"}</span>
              </div>
            </div>
          </div>

          {/* Cierre de la reunión */}
          <div className="pt-3 mt-3 border-t border-zinc-200 dark:border-zinc-800 space-y-2">
            <div className="flex justify-between items-center gap-4 py-2 border-zinc-100 dark:border-zinc-800/80 text-sm sm:text-base">
              <span className="font-bold text-zinc-500 dark:text-zinc-400">Cántico Final:</span>
              <span className="font-black text-zinc-900 dark:text-zinc-100">Canción {data.Cantico_final || "-"}</span>
            </div>
            <div className="flex justify-between items-center gap-4 py-2 border-b border-zinc-100 dark:border-zinc-800/80 text-sm sm:text-base">
              <span className="font-bold text-zinc-500 dark:text-zinc-400">Oración Final:</span>
              <span className="font-black text-zinc-900 dark:text-zinc-100">{data.Oracion_Final || "-"}</span>
            </div>
            
            {/* Grupo de Limpieza */}
            {data.Grupo_Limpieza && (
              <div className="p-3.5 mt-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <span className="text-xs sm:text-sm font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Limpieza del Salón</span>
                <span className="text-sm sm:text-base font-black text-zinc-900 dark:text-zinc-100">
                  {data.Grupo_Limpieza} {data.Encargado ? `(${data.Encargado})` : ''}
                </span>
              </div>
            )}
          </div>
        </div>

      </section>

    </div>
  )
}