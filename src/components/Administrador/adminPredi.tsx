    "use client"

    import { useState } from "react"
    import {
    BookOpen,
    Calendar,
    ShoppingCart,
    Users,
    ChevronRight,
    Lock,
    Settings,
    Carton,
    Table,
    Briefcase,
    Presentation,
    } from "lucide-react"

    type Seccion = {
    id: "salidas-generales" | "salidas-grupales" | "carritos"
    titulo: string
    descripcion: string
    icono: React.ElementType
    ruta: string
    }

    const SECCIONES: Seccion[] = [
    {
        id: "salidas-generales",
        titulo: "Salidas Generales",
        descripcion: "Gestiona las salidas de predicación generales de la congregación.",
        icono: BookOpen,
        ruta: "/admin/predicacion/salidas-generales",
    },
    {
        id: "salidas-grupales",
        titulo: "Salidas Grupales",
        descripcion: "Administra las salidas de predicación por grupo.",
        icono: Users,
        ruta: "/admin/predicacion/salidas-grupales",
    },
    {
        id: "carritos",
        titulo: "Carritos",
        descripcion: "Controla los carritos de predicación y su asignación.",
        icono: Presentation,
        ruta: "../view/homeView",
    },
    ]

    export default function AdminPredi() {
    // Estado por sección (todas en false por defecto)
    const [activas, setActivas] = useState<Record<Seccion["id"], boolean>>({
        "salidas-generales": false,
        "salidas-grupales": false,
        carritos: false,
    })

    // Simula una acción al hacer clic (por ahora solo activa la sección)
    const handleSeleccionar = (id: Seccion["id"]) => {
        setActivas((prev) => ({ ...prev, [id]: !prev[id] }))
        // Aquí luego conectas tu router (ej: router.push(ruta))
    }

    return (
        <div className="w-full py-8 sm:py-12">
        <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 space-y-6">

            {/* ============================ */}
            {/* ENCABEZADO                    */}
            {/* ============================ */}
            <div className="text-center space-y-3 pb-2">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-600 text-white shadow-lg shadow-indigo-600/25">
                <Settings className="w-4 h-4" />
                <span className="text-sm font-bold tracking-wide">
                Panel de Predicación
                </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white dark:text-zinc-100">
                Predicación
            </h1>
            <p className="text-sm text-slate-500 dark:text-zinc-400 max-w-md mx-auto">
                Selecciona una sección para administrar los datos de predicación.
            </p>
            </div>

            {/* ============================ */}
            {/* SECCIONES                     */}
            {/* ============================ */}
            <div className="space-y-4">
            {SECCIONES.map((s) => {
                const Icono = s.icono
                const activa = activas[s.id]

                return (
                <button
                    key={s.id}
                    onClick={() => handleSeleccionar(s.id)}
                    className={`w-full text-left rounded-2xl border p-5 transition-all group
                    ${
                        activa
                        ? "bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-600/25"
                        : "bg-white dark:bg-zinc-800/60 border-slate-200 dark:border-zinc-700 hover:border-indigo-400 dark:hover:border-indigo-500 hover:shadow-md"
                    }
                    `}
                >
                    <div className="flex items-center gap-4">
                    {/* Icono */}
                    <div
                        className={`p-3 rounded-xl shrink-0 transition-colors
                        ${
                            activa
                            ? "bg-white/20 text-white"
                            : "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
                        }
                        `}
                    >
                        <Icono className="w-6 h-6" />
                    </div>

                    {/* Texto */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                        <h3
                            className={`text-base font-extrabold
                            ${activa ? "text-white" : "text-slate-900 dark:text-zinc-100"}
                            `}
                        >
                            {s.titulo}
                        </h3>
                        {!activa && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 dark:bg-zinc-700 text-[10px] font-bold uppercase tracking-wide text-slate-500 dark:text-zinc-400">
                            <Lock className="w-3 h-3" />
                            Inactivo
                            </span>
                        )}
                        </div>
                        <p
                        className={`text-sm mt-0.5
                            ${activa ? "text-white/80" : "text-slate-500 dark:text-zinc-400"}
                        `}
                        >
                        {s.descripcion}
                        </p>
                    </div>

                    {/* Flecha */}
                    <ChevronRight
                        className={`w-5 h-5 shrink-0 transition-transform group-hover:translate-x-1
                        ${activa ? "text-white" : "text-slate-400"}
                        `}
                    />
                    </div>
                </button>
                )
            })}
            </div>

            {/* ============================ */}
            {/* NOTA AL PIE                   */}
            {/* ============================ */}
            <p className="text-center text-xs text-slate-400 dark:text-zinc-500 pt-2">
            Los datos quedan guardados en las Hojas de Calculo de Microsoft Excel
            </p>

        </div>
        </div>
    )
    }