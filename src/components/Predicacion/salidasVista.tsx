"use client";

import { useState } from "react";
import PorCongre from "./Salidas/por-congre";
import PorGrupo from "./Salidas/por-grupo";

export default function SalidasVista() {
    const [vista, setVista] = useState<"congre" | "grupo">("congre");

    return (
        <div className="space-y-6 w-full">
        {/* BANNER A ANCHO COMPLETO (ANCHO 100% DE PANTALLA Y ALTO ADAPTATIVO EN MÓVILES) */}
        <div className="relative w-full h-64 sm:h-80 md:h-96 lg:h-[620px] overflow-hidden bg-zinc-900">
            <img
            src="/predi.jpg"
            alt="Imagen de Predicación"
            className="w-full h-full object-cover object-center block"            
            />
            {/* Sombra de degradado para mejor visibilidad */}
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/70 via-transparent to-transparent pointer-events-none" />
        </div>

        {/* CONTENIDO DE PESTAÑAS Y TABLAS CON PADDING ADECUADO */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-6">
            <div className="inline-flex gap-1 p-1 rounded-xl bg-slate-100 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700">
            <button
                onClick={() => setVista("congre")}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                vista === "congre"
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                    : "text-slate-600 dark:text-zinc-300 hover:bg-white dark:hover:bg-zinc-700/50"
                }`}
            >
                Congregacional
            </button>
            <button
                onClick={() => setVista("grupo")}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                vista === "grupo"
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                    : "text-slate-600 dark:text-zinc-300 hover:bg-white dark:hover:bg-zinc-700/50"
                }`}
            >
                Por Grupo
            </button>
            </div>

            <div>
            {vista === "congre" && <PorCongre />}
            {vista === "grupo" && <PorGrupo />}
            </div>
        </div>
        </div>
    );
    }