export default function Carritos() {
  return (
    <div className="flex items-center justify-center min-h-[60vh] p-6">
      <div className="text-center space-y-4">
        {/* Título */}
        <h2 className="text-2xl font-bold text-slate-800 dark:text-zinc-100">
          Próximamente
        </h2>
        {/* Línea decorativa */}
        <div className="w-16 h-1 mx-auto rounded-full bg-indigo-600/40" />
      </div>
    </div>
  )
}