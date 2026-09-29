
"use client"

import { useEffect, useState } from "react"
import { Calendar, Mic2, BookOpen, Users } from "lucide-react"

type Atalaya = {
  Estado: string
  Fecha: string
  Presidente_FDS: string
  Cantico_inicio: string
  Titulo_Discurso: string
  Discursante_FDS: string
  Congregacion: string
  Cantico_intermedio: string
  Conductor_atalaya: string
  Lector_atalaya: string
  Cantico_final: string
  Oracion_final: string
  Grupo_limpieza: string
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

        const url = `https://opensheet.elk.sh/1El5IpY30c734DF97SVZRC0S5cgLCXyc5oTUXCsg08fg/Tabla_Atalaya`
        const res = await fetch(url)
        if (!res.ok) throw new Error("No se encontraron datos")

        const rows: Atalaya[] = await res.json()
        const activo = rows.find((e) => e.Estado === "active")

        if (!activo) {
          setError("No hay un programa activo asignado para esta semana.")
          return
        }

        setData(activo)
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
      <p className="text-center text-sm text-slate-500 py-8">
        Cargando la Base de Datos...
      </p>
    )
  }

  if (error) {
    return (
      <p className="text-center text-sm text-red-500 py-8">
        {error}
      </p>
    )
  }

  if (!data) return null

  return (
    <div className="w-full py-6 sm:py-12">
      <div className="w-full max-w-3xl mx-auto space-y-6">

        {/* ============================ */}
        {/* TARJETA PRINCIPAL             */}
        {/* ============================ */}
        <section className="w-full rounded-none bg-white border-y sm:border border-slate-200 shadow-none sm:shadow-lg sm:shadow-slate-900/5 p-4 sm:p-8 transition-all hover:shadow-xl">

          {/* ============ ENCABEZADO ============ */}
          <div className="space-y-4 pb-6 border-b border-slate-200">

            {/* Fecha destacada */}
            <div className="flex justify-center">
              <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-indigo-600 text-white shadow-lg shadow-indigo-600/25">
                <Calendar className="w-5 h-5" />
                <span className="text-base font-bold tracking-wide">
                  Fecha: {data.Fecha || "-"}
                </span>
              </div>
            </div>

            {/* Presidente */}
            <h4 className="text-lg sm:text-xl font-extrabold text-slate-900 text-center">
              Presidente: <span className="text-indigo-700">{data.Presidente_FDS || "-"}</span>
            </h4>

            {/* Cántico de inicio */}
            <div className="flex justify-between items-center gap-4 py-3 border-b border-slate-100 text-sm sm:text-base">
              <span className="font-semibold text-slate-600">Cántico de Inicio:</span>
              <span className="font-bold text-slate-900">Canción {data.Cantico_inicio || "-"}</span>
            </div>
          </div>

          {/* ============ DISCURSO PÚBLICO ============ */}
          <div className="pt-6">
            <header className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-200">
              <Mic2 className="w-6 h-6 text-indigo-600 shrink-0" />
              <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 uppercase tracking-wide">
                Discurso Público
              </h3>
            </header>

            <div className="rounded-xl sm:rounded-2xl bg-indigo-50/50 border border-indigo-100 p-4 space-y-3">
              <p className="text-base sm:text-lg font-extrabold text-slate-900 text-center">
                {data.Titulo_Discurso || "-"}{" "}
                <span className="text-xs sm:text-sm font-normal text-slate-400">(30 mins.)</span>
              </p>
              <div className="space-y-1 text-sm sm:text-base">
                <p className="text-slate-600 text-center">
                  <span className="font-semibold">Orador:</span>{" "}
                  <span className="font-bold text-slate-900">{data.Discursante_FDS || "-"}</span>
                </p>
                <p className="text-slate-600 text-center">
                  <span className="font-semibold">Congregación:</span>{" "}
                  <span className="font-bold text-slate-900">{data.Congregacion || "-"}</span>
                </p>
              </div>
            </div>
          </div>

          {/* ============ ESTUDIO DE LA ATALAYA ============ */}
          <div className="pt-6">
            <header className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-200">
              <BookOpen className="w-6 h-6 text-indigo-600 shrink-0" />
              <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 uppercase tracking-wide">
                Estudio de la Atalaya
              </h3>
            </header>

            {/* Cántico intermedio */}
            <div className="flex justify-between items-center gap-4 py-3 border-b border-slate-100 text-sm sm:text-base">
              <span className="font-semibold text-slate-600">Cántico Intermedio:</span>
              <span className="font-bold text-slate-900">Canción {data.Cantico_intermedio || "-"}</span>
            </div>

            {/* Conductor y Lector */}
            <div className="space-y-3 pt-4">
              <div className="rounded-xl sm:rounded-2xl bg-indigo-50/50 border border-indigo-100 p-4 space-y-2">
                <div className="flex justify-between items-center gap-4 text-sm sm:text-base">
                  <span className="font-semibold text-slate-600">Conductor:</span>
                  <span className="font-bold text-slate-900">{data.Conductor_atalaya || "-"}</span>
                </div>
                <div className="flex justify-between items-center gap-4 text-sm sm:text-base">
                  <span className="font-semibold text-slate-600">Lector:</span>
                  <span className="font-bold text-slate-900">{data.Lector_atalaya || "-"}</span>
                </div>
              </div>
            </div>

            {/* Cierre de la reunión */}
            <div className="pt-4 mt-4 border-t border-slate-200 space-y-0">
              <div className="flex justify-between items-center gap-4 py-3 border-b border-slate-100 text-sm sm:text-base">
                <span className="font-semibold text-slate-600">Cántico Final:</span>
                <span className="font-bold text-slate-900">Canción {data.Cantico_final || "-"}</span>
              </div>
              <div className="flex justify-between items-center gap-4 py-3 border-b border-slate-100 text-sm sm:text-base">
                <span className="font-semibold text-slate-600">Oración Final:</span>
                <span className="font-bold text-slate-900">{data.Oracion_final || "-"}</span>
              </div>
              <div className="flex justify-between items-center gap-4 py-3 text-sm sm:text-base">
                <span className="font-semibold text-slate-600">Grupo de Limpieza:</span>
                <span className="font-bold text-indigo-700">{data.Grupo_limpieza || "-"}</span>
              </div>
            </div>
          </div>

        </section>

      </div>
    </div>
  )
}