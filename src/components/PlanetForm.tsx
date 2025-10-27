"use client";
import { useState } from "react";
import { Planet } from "@/lib/planets";
import { isValidName, clampRadius, clampSpeed, RADIUS_MIN, RADIUS_MAX, SPEED_MIN, SPEED_MAX } from "@/lib/planetUtils";

interface Props {
  existing: Planet[];
  onCreate: (p: Planet) => void;
}

export default function PlanetForm({ existing, onCreate }: Props) {
  const [name, setName] = useState("");
  const [radius, setRadius] = useState(500);
  const [speed, setSpeed] = useState(1);
  const [color, setColor] = useState("#888888");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!isValidName(name, existing)) {
      setError("Nombre inválido o ya existe en la lista");
      return;
    }
    const p: Planet = {
      name: name.trim(),
      radius: clampRadius(radius),
      speed: clampSpeed(speed),
      color,
    };
    onCreate(p);
    setName("");
    setRadius(500);
    setSpeed(1);
    setColor("#888888");
  };

  return (
    <form onSubmit={handleSubmit} className="w-full p-4 border rounded-lg bg-slate-800 flex flex-col gap-2">
      <h3 className="font-bold">Añadir planeta personalizado</h3>
      <input placeholder="Nombre" value={name} onChange={(e) => setName(e.target.value)} className="p-2 rounded" />
      <label>Radio ({RADIUS_MIN} - {RADIUS_MAX})</label>
      <input type="number" value={radius} onChange={(e) => setRadius(Number(e.target.value))} className="p-2 rounded" />
      <label>Velocidad ({SPEED_MIN} - {SPEED_MAX})</label>
      <input type="number" value={speed} onChange={(e) => setSpeed(Number(e.target.value))} className="p-2 rounded" />
      <label>Color</label>
      <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-12 h-8 p-0" />
      {error && <p className="text-sm text-red-400">{error}</p>}
      <div className="flex gap-2 mt-2">
        <button type="submit" className="px-3 py-1 bg-indigo-600 rounded">Añadir</button>
      </div>
    </form>
  );
}
