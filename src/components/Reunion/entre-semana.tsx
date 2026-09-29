"use client"

import { useEffect, useState } from "react"
import { Calendar, BookOpen, Users, Heart } from "lucide-react"

    type Semana = {
    Semana: string
    Permisos: string
    }

    type Tesoro = {
    Fecha_Tesoros: string
    Presidente: string
    Presidente_Sala_B: string
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
    Fecha_Maestros: string
    Titulo: string
    Tiempo: string
    Asignados_SalaA: string
    Asignados_SalaB: string
    }

    type VidaCristiana = {
    Fecha_Vida_Cristiana: string
    Cantico_Intermedio: string
    Primer_Discurso: string
    Discursante_Primer_Discurso: string
    Segundo_Discurso: string
    Discursante_Segundo_Discurso: string
    Tercer_Discurso: string
    Discursante_Tercer_Discurso: string
    Estudio_Biblico: string
    Conductor_Lector: string
    Cantico_Oracion: string
    Limpieza_Encargado: string
    }

    export default function EntreSemana() {
    const [tesoros, setTesoros] = useState<Tesoro[]>([])
    const [maestros, setMaestros] = useState<Maestro[]>([])
    const [vida, setVida] = useState<VidaCristiana[]>([])
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

            const [programa, tesorosData, maestrosData, vidaData] = await Promise.all([
            fetchTabla("Tabla_Principal"),
            fetchTabla("Tesoros"),
            fetchTabla("3"),
            fetchTabla("4"),
            ])

            const semanaActiva = programa.find((e: Semana) => e.Permisos === "active")

            if (!semanaActiva) {
            setError("No hay un programa activo asignado para esta semana.")
            return
            }

            const fechaActual = semanaActiva.Semana

            setTesoros(tesorosData.filter((e: Tesoro) => e.Fecha_Tesoros === fechaActual))
            setMaestros(maestrosData.filter((e: Maestro) => e.Fecha_Maestros === fechaActual))
            setVida(vidaData.filter((e: VidaCristiana) => e.Fecha_Vida_Cristiana === fechaActual))
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


 return (
    <div className="w-full py-6 sm:py-12">
        <div className="w-full max-w-3xl mx-auto">

        {/* ============================ */}
        {/* FECHA DESTACADA             */}
        {/* ============================ */}
        {(tesoros.length > 0 || maestros.length > 0 || vida.length > 0) && (
            <div className="flex justify-center px-4 sm:px-0">
            <div className="inline-flex items-center gap-3 px-3 py-3 rounded bg-indigo-600 text-white shadow-lg">
                <Calendar className="w-5 h-5" />
                <span className="text-ls font-bold tracking-wide">
                Semana: {tesoros[0]?.Fecha_Tesoros || maestros[0]?.Fecha_Maestros || vida[0]?.Fecha_Vida_Cristiana || "-"}
                </span>
            </div>
            </div>
        )}

        {/* ============================ */}
        {/* TESOROS DE LA BIBLIA         */}
        {/* ============================ */}
        {tesoros.length > 0 && (
            <section className="w-full rounded-none bg-white border-y sm:border border-slate-200 shadow-none sm:shadow-lg sm:shadow-slate-900/5 p-4 sm:p-8 transition-all hover:shadow-xl mt-6">
            <header className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-200">
                <BookOpen className="w-6 h-6 text-indigo-600 shrink-0" />
                <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 uppercase tracking-wide">
                Tesoros de la Biblia
                </h3>
            </header>

            <div className="space-y-5">
                {tesoros.map((t, i) => (
                <div key={i} className="space-y-4">

                    <h4 className="text-lg sm:text-xl font-extrabold text-slate-900">
                    Presidente: <span className="text-indigo-700">{t.Presidente || "-"}</span>
                    </h4>

                    <div>
                    <div className="flex justify-between items-center gap-4 py-3 border-b border-slate-100 text-sm sm:text-base">
                        <span className="font-semibold text-slate-600">Sala B:</span>
                        <span className="font-bold text-slate-900">{t.Presidente_Sala_B || "-"}</span>
                    </div>
                    <div className="flex justify-between items-center gap-4 py-3 border-b border-slate-100 text-sm sm:text-base">
                        <span className="font-semibold text-slate-600">Cántico:</span>
                        <span className="font-bold text-slate-900">Canción {t.Cantico || "-"}</span>
                    </div>
                    <div className="flex justify-between items-center gap-4 py-3 border-b border-slate-100 text-sm sm:text-base">
                        <span className="font-semibold text-slate-600">Oración:</span>
                        <span className="font-bold text-slate-900">{t.Oracion || "-"}</span>
                    </div>
                    </div>

                    <div className="space-y-3 pt-2">
                    <div className="flex flex-col items-center gap-1.5 py-4 border-b border-slate-100">
                        <span className="text-sm sm:text-base font-semibold text-slate-600 text-center">
                        1. {t.Titulo_Tesoros || "-"}{" "}
                        <span className="text-xs sm:text-sm text-slate-400">(10 mins.)</span>
                        </span>
                        <span className="text-base sm:text-lg font-bold text-slate-900 text-center">
                        {t.Discursante || "-"}
                        </span>
                    </div>

                    <div className="flex flex-col items-center gap-1.5 py-4 border-b border-slate-100">
                        <span className="text-sm sm:text-base font-semibold text-slate-600 text-center">
                        2. Busquemos perlas escondidas{" "}
                        <span className="text-xs sm:text-sm text-slate-400">(10 mins.)</span>
                        </span>
                        <span className="text-base sm:text-lg font-bold text-slate-900 text-center">
                        {t.Conductor_Perlas || "-"}
                        </span>
                    </div>

                    <div className="flex flex-col items-center gap-1.5 py-4">
                        <span className="text-sm sm:text-base font-semibold text-slate-600 text-center">
                        3. Lectura de la Biblia:{" "}
                        <span className="text-slate-800 font-bold">{t.Lectura_Biblia || "-"}</span>{" "}
                        <span className="text-xs sm:text-sm text-slate-400">(4 mins.)</span>
                        </span>
                        <div className="flex flex-wrap justify-center gap-x-6 gap-y-1 text-sm sm:text-base">
                        <span className="text-slate-600">
                            Sala A: <span className="font-bold text-slate-900">{t.Lector_A || "-"}</span>
                        </span>
                        <span className="text-slate-600">
                            Sala B: <span className="font-bold text-slate-900">{t.Lector_B || "-"}</span>
                        </span>
                        </div>
                    </div>
                    </div>
                </div>
                ))}
            </div>
            </section>
        )}

        {/* ============================ */}
        {/* MEJORES MAESTROS             */}
        {/* ============================ */}
        {maestros.length > 0 && (
            <section className="w-full rounded-none bg-white border-y sm:border border-slate-200 shadow-none sm:shadow-lg sm:shadow-slate-900/5 p-4 sm:p-8 transition-all hover:shadow-xl">
            <header className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-200">
                <Users className="w-6 h-6 text-indigo-600 shrink-0" />
                <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 uppercase tracking-wide">
                Mejores Maestros
                </h3>
            </header>

            <div className="space-y-3">
                {maestros.map((m, i) => (
                <div key={i} className="rounded-xl sm:rounded-2xl bg-indigo-50/50 border border-indigo-100 p-4 space-y-2">
                    <p className="text-sm sm:text-base font-extrabold text-slate-900">
                    {m.Titulo || "-"}{" "}
                    <span className="text-xs sm:text-sm font-normal text-slate-400">({m.Tiempo || "-"} mins.)</span>
                    </p>
                    <div className="space-y-1 text-sm sm:text-base">
                    <p className="text-slate-600">
                        Sala A: <span className="font-bold text-slate-900">{m.Asignados_SalaA || "-"}</span>
                    </p>
                    <p className="text-slate-600">
                        Sala B: <span className="font-bold text-slate-900">{m.Asignados_SalaB || "-"}</span>
                    </p>
                    </div>
                </div>
                ))}
            </div>
            </section>
        )}

        {/* ============================ */}
        {/* NUESTRA VIDA CRISTIANA       */}
        {/* ============================ */}
        {vida.length > 0 && (
             <section className="w-full rounded-none bg-white border-y sm:border border-slate-200 shadow-none sm:shadow-lg sm:shadow-slate-900/5 p-4 sm:p-8 transition-all hover:shadow-xl">
            <header className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-200">
                <Heart className="w-6 h-6 text-indigo-600 shrink-0" />
                <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 uppercase tracking-wide">
                Nuestra Vida Cristiana
                </h3>
            </header>

            <div className="space-y-5">
                {vida.map((v, i) => (
                <div key={i} className="space-y-4">
                    <div className="flex justify-between items-center gap-4 py-3 border-b border-slate-100 text-sm sm:text-base">
                    <span className="font-semibold text-slate-600">Cántico intermedio:</span>
                    <span className="font-bold text-slate-900">Canción {v.Cantico_Intermedio || "-"}</span>
                    </div>

                    <div className="space-y-3 pt-2">
                    {v.Primer_Discurso && (
                        <div className="flex flex-col items-center gap-1.5 py-4 border-b border-slate-100">
                        <span className="text-sm sm:text-base font-semibold text-slate-600 text-center">
                            {v.Primer_Discurso}
                        </span>
                        <span className="text-base sm:text-lg font-bold text-slate-900 text-center">
                            {v.Discursante_Primer_Discurso || "-"}
                        </span>
                        </div>
                    )}
                    {v.Segundo_Discurso && (
                        <div className="flex flex-col items-center gap-1.5 py-4 border-b border-slate-100">
                        <span className="text-sm sm:text-base font-semibold text-slate-600 text-center">
                            {v.Segundo_Discurso}
                        </span>
                        <span className="text-base sm:text-lg font-bold text-slate-900 text-center">
                            {v.Discursante_Segundo_Discurso || "-"}
                        </span>
                        </div>
                    )}
                    {v.Tercer_Discurso && (
                        <div className="flex flex-col items-center gap-1.5 py-4 border-b border-slate-100">
                        <span className="text-sm sm:text-base font-semibold text-slate-600 text-center">
                            {v.Tercer_Discurso}
                        </span>
                        <span className="text-base sm:text-lg font-bold text-slate-900 text-center">
                            {v.Discursante_Tercer_Discurso || "-"}
                        </span>
                        </div>
                    )}
                    {v.Estudio_Biblico && (
                        <div>
                        <div className="flex flex-col items-center gap-1.5 py-4 border-b border-slate-100">
                        <span className="text-sm sm:text-base font-semibold text-slate-600 text-center">
                            {v.Estudio_Biblico}
                        </span>
                        </div>
                        <div className="flex justify-between items-center gap-4 text-sm py-3 border-b border-slate-100">
                        <span className="font-semibold text-slate-600">Conductor y Lector:</span>
                        <span className="font-bold text-slate-900">{v.Conductor_Lector || "-"}</span>
                        </div>
                        </div>
                    )}
                    </div>

                    <div className="pt-2 text-sm sm:text-base">
                    <div className="flex justify-between items-center gap-4 py-3 border-b border-slate-100">
                        <span className="font-semibold text-slate-600">Cántico y Oración:</span>
                        <span className="font-bold text-slate-900">{v.Cantico_Oracion || "-"}</span>
                    </div>
                    <div className="flex justify-between items-center gap-4 py-3">
                        <span className="font-semibold text-slate-600">Limpieza y Capitán:</span>
                        <span className="font-bold text-slate-900">{v.Limpieza_Encargado || "-"}</span>
                    </div>
                    </div>
                </div>
                ))}
            </div>
            </section>
        )}

        </div>
    </div>
    )
}