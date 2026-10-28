"use client";

import { useState } from "react";
import PorCongre from "./Salidas/por-congre";
import PorGrupo from "./Salidas/por-grupo";

export default function SalidasVista() {
    const [vista, setVista] = useState<"congre" | "grupo">("congre");

    return (
        <div className="space-y-6 w-full">
            {/* BANNER A ANCHO COMPLETO */}
            <div className="relative w-full h-64 sm:h-80 md:h-96 lg:h-[620px] overflow-hidden bg-slate-900 dark:bg-[#0d121c]">
                <img
                    src="/predi.jpg"
                    alt="Imagen de Predicación"
                    className="w-full h-full object-cover object-center block"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* CONTENIDO DE PESTAÑAS Y TABLAS */}
            <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-6">
                <div className="inline-flex gap-1 p-1 rounded-xl bg-slate-100 dark:bg-[#182030] border border-slate-200 dark:border-slate-800">
                    <button
                        onClick={() => setVista("congre")}
                        className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                            vista === "congre"
                                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                                : "text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800/60"
                        }`}
                    >
                        Congregacional
                    </button>
                    <button
                        onClick={() => setVista("grupo")}
                        className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                            vista === "grupo"
                                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                                : "text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800/60"
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