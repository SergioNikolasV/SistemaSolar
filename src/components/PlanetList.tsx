"use client";
import { Planet } from "@/lib/planets";

interface Props {
  planets: Planet[];
  onRemove: (index: number) => void;
  onReset: () => void;
  isBaseCase: boolean;
}

export default function PlanetList({ planets, onRemove, onReset, isBaseCase }: Props) {
  return (
    <div className="w-full p-4 border rounded-lg bg-slate-800">
      <h3 className="font-bold mb-2">Planetas actuales</h3>
      <ul className="space-y-2">
        {planets.map((p, i) => (
          <li key={p.name} className="flex items-center justify-between">
            <div>
              <strong>{p.name}</strong> <span className="text-sm text-gray-400">r:{p.radius} s:{p.speed}</span>
              {i === 0 && <span className="ml-2 text-xs text-yellow-300">(Caso base)</span>}
            </div>
            <div className="flex gap-2">
              <button onClick={() => onRemove(i)} disabled={planets.length <= 1} className="px-2 py-1 bg-red-600 rounded disabled:opacity-40">Eliminar</button>
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-4">
        <button onClick={onReset} className="px-3 py-1 bg-yellow-600 rounded">Limpiar a caso base</button>
      </div>
      {!isBaseCase && (
        <p className="mt-2 text-sm text-gray-300">Modo personalizado: las aristas y contadores mostrarán N/A hasta reiniciar desde 0</p>
      )}
    </div>
  );
}
