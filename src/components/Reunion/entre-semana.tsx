"use client"

import { useEffect, useState } from "react"
import { Calendar, BookOpen, Users, Heart } from "lucide-react"

type TablaPrincipal = {
  Miercoles: string
  Permisos_Reunion_Entre_Semana: string
  Domingo: string
  Permisos_Reunion_Fin_Semana: string
}

type Tesoro = {
  Dia_Tesoros: string
  Presidente: string
  "Sala B": string
  Cantico: string
  Oracion: string
  Titulo_Tesoros: string
  Discursante: string
  Conductor_Perlas: string
  Lectura_Biblia: string
  Lector_A: string
  Lector_B: string
}

type Maestro = {
  Dia_Mejores_Maestros: string
  Titulo: string
  Tiempo: string
  Asignados_Sala_A: string
  Asignados_Sala_B: string
}

type VidaCristiana = {
  Dia_Vida_Cristiana: string
  Cantico_Intermedio: string
  Primer_Discurso: string
  Tiempo_P: string
  Discursante_Primer_Discurso: string
  Segundo_Discurso: string
  Tiempo_S:string
  Discursante_Segundo_Discurso: string
  Numero_Estudio_Biblico?: string
  Conductor_Lector: string
  Cantico_Final: string
  Oracion_Final: string
  Grupo_Limpieza: string
  Encargado: string
}

export default function EntreSemana() {
  const [tesoros, setTesoros] = useState<Tesoro[]>([])
  const [maestros, setMaestros] = useState<Maestro[]>([])
  const [vida, setVida] = useState<VidaCristiana[]>([])
  const [fechaActiva, setFechaActiva] = useState<string>("")
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

       // 1. Consultamos la Tabla_Principal del mismo archivo para ver el estado active
        const controlData: TablaPrincipal[] = await fetchTabla("Tabla_Principal")

        // 2. Buscamos la fila con el permiso activo de entre semana
        const semanaActiva = controlData.find((e) => e.Permisos_Reunion_Entre_Semana === "active")

        if (!semanaActiva || !semanaActiva.Miercoles) {
          setError("No hay ninguna reunión entre semana activa en este momento.")
          return
        }
        const fechaActual = semanaActiva.Miercoles.trim()
        setFechaActiva(fechaActual)

        // Traemos las tablas de contenido de la reunión
        const [tesorosData, maestrosData, vidaData] = await Promise.all([
          fetchTabla("Tesoros"),
          fetchTabla("3"),
          fetchTabla("4"),
        ])

        setTesoros(tesorosData.filter((e: Tesoro) => e.Dia_Tesoros?.trim() === fechaActual))
        setMaestros(maestrosData.filter((e: Maestro) => e.Dia_Mejores_Maestros?.trim() === fechaActual))
        setVida(vidaData.filter((e: VidaCristiana) => e.Dia_Vida_Cristiana?.trim() === fechaActual))
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
      <div className="flex justify-center items-center py-12">
        <p className="text-sm text-zinc-400 animate-pulse">
          Cargando la Reunión Entre Semana...
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

return (
    <div className="w-full space-y-2 pb-10">

      {/* FECHA DESTACADA */}
      {fechaActiva && (
        <div className="flex justify-center py-5">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white shadow-md text-base font-black tracking-wide">
            <Calendar className="w-5 h-5 shrink-0" />
            <span>Miércoles: {fechaActiva}</span>
          </div>
        </div>
      )}

      {/* TESOROS DE LA BIBLIA */}
      {tesoros.length > 0 && (
        <section className="w-full bg-white dark:bg-zinc-900 border-y border-zinc-200 dark:border-zinc-800 p-4 space-y-4 shadow-sm">
          <header className="flex items-center gap-2.5 pb-3 border-b border-zinc-200 dark:border-zinc-800">
            <BookOpen className="w-6 h-6 text-indigo-600 dark:text-indigo-400 shrink-0" />
            <h3 className="text-lg sm:text-xl font-black text-zinc-900 dark:text-zinc-100 uppercase tracking-wide">
              Tesoros de la Biblia
            </h3>
          </header>

          <div className="space-y-4">
            {tesoros.map((t, i) => (
              <div key={i} className="space-y-3.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 bg-indigo-500/15 p-3.5 rounded-xl">
                  <span className="text-xs font-bold text-zinc-600 dark:text-zinc-400 uppercase">Presidente:</span>
                  <span className="text-base sm:text-lg font-black text-indigo-600 dark:text-indigo-400">{t.Presidente || "—"}</span>
                </div>

                <div className="space-y-2 text-sm sm:text-base text-zinc-800 dark:text-zinc-200 px-1">
                  <div className="flex justify-between py-1.5 border-b border-zinc-100 dark:border-zinc-800/80">
                    <span className="font-semibold text-zinc-500 dark:text-zinc-400">Sala B:</span>
                    <strong className="text-zinc-900 dark:text-zinc-100 font-extrabold">{t["Sala B"] || "—"}</strong>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-zinc-100 dark:border-zinc-800/80">
                    <span className="font-semibold text-zinc-500 dark:text-zinc-400">Cántico:</span>
                    <strong className="text-zinc-900 dark:text-zinc-100 font-extrabold">Canción {t.Cantico || "—"}</strong>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="font-semibold text-zinc-500 dark:text-zinc-400">Oración:</span>
                    <strong className="text-zinc-900 dark:text-zinc-100 font-extrabold">{t.Oracion || "—"}</strong>
                  </div>
                </div>

                <div className="space-y-3 pt-1">
                  <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/60 space-y-2.5">
                    <p className="text-sm sm:text-base font-black text-indigo-600 dark:text-indigo-400 flex justify-between items-center gap-2">
                      <span>1. {t.Titulo_Tesoros || "—"}</span>
                      <span className="text-xs sm:text-sm font-bold text-zinc-500 dark:text-zinc-400 bg-zinc-200 dark:bg-zinc-900 px-2.5 py-1 rounded-lg shrink-0">(10 mins.)</span>
                    </p>
                    <p className="text-sm sm:text-base font-extrabold text-zinc-900 dark:text-zinc-100 pt-1">
                      Discursante: <span className="font-normal">{t.Discursante || "—"}</span>
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/60 space-y-2.5">
                    <p className="text-sm sm:text-base font-black text-indigo-600 dark:text-indigo-400 flex justify-between items-center gap-2">
                      <span>2. Busquemos perlas escondidas</span>
                      <span className="text-xs sm:text-sm font-bold text-zinc-500 dark:text-zinc-400 bg-zinc-200 dark:bg-zinc-900 px-2.5 py-1 rounded-lg shrink-0">(10 mins.)</span>
                    </p>
                    <p className="text-sm sm:text-base font-extrabold text-zinc-900 dark:text-zinc-100 pt-1">
                      Conductor: <span className="font-normal">{t.Conductor_Perlas || "—"}</span>
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/60 space-y-2.5">
                    <div className="flex justify-between items-center gap-2">
                      <p className="text-sm sm:text-base font-black text-indigo-600 dark:text-indigo-400">
                        3. Lectura de la Biblia
                      </p>
                      <span className="text-xs sm:text-sm font-bold text-zinc-500 dark:text-zinc-400 bg-zinc-200 dark:bg-zinc-900 px-2.5 py-1 rounded-lg shrink-0">(4 mins.)</span>
                    </div>

                    {t.Lectura_Biblia && (
                      <p className="text-sm font-extrabold text-zinc-800 dark:text-zinc-200">
                        Lectura Semanal: <span className="font-normal">{t.Lectura_Biblia}</span>
                      </p>
                    )}

                    <div className="grid grid-cols-2 gap-2 pt-1 text-sm sm:text-base border-t border-zinc-200 dark:border-zinc-700/40 mt-2">
                      <p className="font-bold text-zinc-900 dark:text-zinc-100 pt-1">Lector Sala A: <span className="font-normal">{t.Lector_A || "—"}</span></p>
                      <p className="font-bold text-zinc-900 dark:text-zinc-100 pt-1">Lector Sala B: <span className="font-normal">{t.Lector_B || "—"}</span></p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* MEJORES MAESTROS */}
      {maestros.length > 0 && (
        <section className="w-full bg-white dark:bg-zinc-900 border-y border-zinc-200 dark:border-zinc-800 p-4 space-y-4 shadow-sm">
          <header className="flex items-center gap-2.5 pb-3 border-b border-zinc-200 dark:border-zinc-800">
            <Users className="w-6 h-6 text-indigo-600 dark:text-indigo-400 shrink-0" />
            <h3 className="text-lg sm:text-xl font-black text-zinc-900 dark:text-zinc-100 uppercase tracking-wide">
              Seamos Mejores Maestros
            </h3>
          </header>

          <div className="space-y-3">
            {maestros.map((m, i) => (
              <div key={i} className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/60 space-y-2.5">
                <p className="text-sm sm:text-base font-black text-indigo-600 dark:text-indigo-400 flex justify-between items-center">
                  <span>{m.Titulo || "—"}</span>
                  <span className="text-xs sm:text-sm font-bold text-zinc-500 dark:text-zinc-400 bg-zinc-200 dark:bg-zinc-900 px-2.5 py-1 rounded-lg">({m.Tiempo || "—"} mins.)</span>
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-sm sm:text-base pt-1">
                  <p className="font-bold text-zinc-900 dark:text-zinc-100">Sala A: <span className="font-normal">{m.Asignados_Sala_A || "—"}</span></p>
                  <p className="font-bold text-zinc-900 dark:text-zinc-100">Sala B: <span className="font-normal">{m.Asignados_Sala_B || "—"}</span></p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* NUESTRA VIDA CRISTIANA */}
      {vida.length > 0 && (
        <section className="w-full bg-white dark:bg-zinc-900 border-y border-zinc-200 dark:border-zinc-800 p-4 space-y-4 shadow-sm">
          <header className="flex items-center gap-2.5 pb-3 border-b border-zinc-200 dark:border-zinc-800">
            <Heart className="w-6 h-6 text-indigo-600 dark:text-indigo-400 shrink-0" />
            <h3 className="text-lg sm:text-xl font-black text-zinc-900 dark:text-zinc-100 uppercase tracking-wide">
              Nuestra Vida Cristiana
            </h3>
          </header>

          <div className="space-y-4">
            {vida.map((v, i) => (
              <div key={i} className="space-y-3.5">
                <div className="flex justify-between py-2 border-b border-zinc-100 dark:border-zinc-800 text-sm sm:text-base">
                  <span className="font-bold text-zinc-500 dark:text-zinc-400">Cántico intermedio:</span>
                  <strong className="text-zinc-900 dark:text-zinc-100 font-black">Canción {v.Cantico_Intermedio || "—"}</strong>
                </div>

                <div className="space-y-3 pt-1">
                {v.Primer_Discurso && (
                    <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/60 space-y-2.5">
                      <p className="text-sm sm:text-base font-black text-indigo-600 dark:text-indigo-400 flex justify-between items-center gap-2">
                        <span>{v.Primer_Discurso}</span>
                        <span className="text-xs sm:text-sm font-bold text-zinc-500 dark:text-zinc-400 bg-zinc-200 dark:bg-zinc-900 px-2.5 py-1 rounded-lg shrink-0">({v.Tiempo_S} mins.)</span>
                      </p>
                      <p className="text-sm sm:text-base font-extrabold text-zinc-900 dark:text-zinc-100 pt-1">
                        Discursante: <span className="font-normal">{v.Discursante_Primer_Discurso || "—"}</span>
                      </p>
                    </div>
                  )}

                  {v.Segundo_Discurso && (
                    <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/60 space-y-2.5">
                      <p className="text-sm sm:text-base font-black text-indigo-600 dark:text-indigo-400 flex justify-between items-center gap-2">
                        <span>{v.Segundo_Discurso}</span>
                        <span className="text-xs sm:text-sm font-bold text-zinc-500 dark:text-zinc-400 bg-zinc-200 dark:bg-zinc-900 px-2.5 py-1 rounded-lg shrink-0">({v.Tiempo_S} mins.)</span>
                      </p>
                      <p className="text-sm sm:text-base font-extrabold text-zinc-900 dark:text-zinc-100 pt-1">
                        Discursante: <span className="font-normal">{v.Discursante_Segundo_Discurso || "—"}</span>
                      </p>
                    </div>
                  )}

                  {v.Conductor_Lector && (
                    <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/60 space-y-2.5">
                      <p className="text-sm sm:text-base font-black text-indigo-600 dark:text-indigo-400 flex justify-between items-center">
                        <span>{v.Numero_Estudio_Biblico ? `${v.Numero_Estudio_Biblico}. ` : ""}Estudio Bíblico de la Congregación</span>
                        <span className="text-xs sm:text-sm font-bold text-zinc-500 dark:text-zinc-400 bg-zinc-200 dark:bg-zinc-900 px-2.5 py-1 rounded-lg">(30 mins.)</span>
                      </p>
                      <p className="text-sm sm:text-base font-extrabold text-zinc-900 dark:text-zinc-100 pt-1">
                        Conductor y Lector: <span className="font-normal">{v.Conductor_Lector}</span>
                      </p>
                    </div>
                  )}
                </div>

                <div className="pt-3 mt-2 border-t border-zinc-200 dark:border-zinc-800 space-y-3 text-sm sm:text-base">
                  <div className="flex justify-between py-1.5">
                    <span className="font-bold text-zinc-500 dark:text-zinc-400">Cántico Final y Oración:</span>
                    <strong className="text-zinc-900 dark:text-zinc-100 font-black">{v.Cantico_Final ? `Canción ${v.Cantico_Final} / ${v.Oracion_Final || ''}` : "—"}</strong>
                  </div>
                  {v.Grupo_Limpieza && (
                    <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                      <span className="text-xs sm:text-sm font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Limpieza del Salón</span>
                      <span className="text-sm sm:text-base font-black text-zinc-900 dark:text-zinc-100">
                        {v.Grupo_Limpieza} {v.Encargado ? `(${v.Encargado})` : ''}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

    </div>
  )
}