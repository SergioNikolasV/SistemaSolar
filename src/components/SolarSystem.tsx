"use client";
import { useState, useEffect, useRef } from "react";
import { Planet as PlanetType, BASE_PLANETS } from "@/lib/planets";
import { 
  SVG_SIZE, 
  PlanetPosition, 
  calculatePlanetPositions, 
  arePlanetsAlignedWithSun, 
  arePlanetsAligned as checkPlanetsAligned, 
  isSunInTriangle, 
  calculateTrianglePerimeter 
} from "@/lib/planetUtils";

interface SolarSystemProps {
  day: number;
  onClimateUpdate: (counts: { sequia: number | "N/A"; optimo: number | "N/A"; lluvia: number | "N/A"; normal: number | "N/A" }) => void;
  onDayReport: (report: { dia: number; clima: string }) => void;
  planets?: PlanetType[];
  isBaseCase?: boolean;
}

let lineColor: string;

export default function SolarSystem({ day, onClimateUpdate, onDayReport, planets = BASE_PLANETS, isBaseCase = true}: SolarSystemProps) {
  
  const [alignSunT, setAlignSun] = useState(0);
  const [alignT, setAlign] = useState(0);
  const [sunInT, setSunInT] = useState(0);
  const [sunOutT, setSunOutT] = useState(0);

  // Usar las funciones utilitarias para cálculos dinámicos
  const planetPositions = calculatePlanetPositions(planets, day);
  const arePlanetsAlignedSun = arePlanetsAlignedWithSun(planetPositions);
  const arePlanetsAligned = checkPlanetsAligned(planetPositions);
  const isSunInT = isSunInTriangle(planetPositions);
  const perimeter = calculateTrianglePerimeter(planetPositions);

  const onDrought = useRef(arePlanetsAlignedSun);
  const onRain = useRef(isSunInT);
  const onOptimum = useRef(arePlanetsAligned);
  const onNormal = useRef(!arePlanetsAlignedSun && !arePlanetsAligned && !isSunInT);
  
  useEffect(() => {
    // If not base case, do not update climate counters or reports; rely on parent to set N/A
    if (!isBaseCase) return;

    if (arePlanetsAlignedSun && onDrought.current) {
      setAlignSun(prevCount => prevCount + 1);
      onDayReport({ dia: day, clima: "Sequia" })
      onDrought.current = false;
      onRain.current = true;
      onNormal.current = true;
      onNormal.current = true;
    } else if (arePlanetsAligned && onOptimum.current) {
      setAlign(prevCount => prevCount + 1);
      onDayReport({ dia: day, clima: "Optimo" })
      onOptimum.current = false;
      onRain.current = true;
      onNormal.current = true;
      onDrought.current = true;
    } else if (isSunInT && onRain.current && !arePlanetsAlignedSun) {
      setSunInT(prevCount => prevCount + 1);
      onDayReport({ dia: day, clima: "Tormenta" })
      onRain.current = false;
      onNormal.current = true;
      onDrought.current = true;
      onOptimum.current = true;
    } else if (!isSunInT && onNormal.current && !arePlanetsAligned && !arePlanetsAlignedSun) {
      setSunOutT(prevCount => prevCount + 1);
      onDayReport({ dia: day, clima: "Normal" })
      onNormal.current = false;
      onDrought.current = true;
      onOptimum.current = true;
      onRain.current = true;
    }
    onClimateUpdate({
      sequia: alignSunT,
      optimo: alignT,
      lluvia: sunInT,
      normal: sunOutT,
    });
  }, [day, arePlanetsAligned, arePlanetsAlignedSun, isSunInT, isBaseCase]);

  if (isBaseCase) {
    if (arePlanetsAlignedSun) {
      lineColor = "hsl(48, 100%, 50%)";
    } else if (arePlanetsAligned) {
      lineColor = "hsla(133, 81%, 56%, 1.00)";
    } else if (isSunInT) {
      lineColor = "hsla(216, 76%, 53%, 1.00)";
    } else {
      lineColor = "hsla(214, 34%, 73%, 1.00)";  
    }
  } else {
    lineColor = "hsla(214, 34%, 73%, 1.00)"; // Color por defecto para configuraciones personalizadas
  }

  

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold text-center mb-4">Simulación del Sistema Solar</h2>
      
      {/*Visualización*/}
      <div className="border rounded-lg bg-gray-900 overflow-hidden">
        <svg viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`} className="w-full h-auto">
          {/*Órbitas*/}
          {planets.map(p => (
            <circle key={`orbit-${p.name}`} cx={SVG_SIZE / 2} cy={SVG_SIZE / 2} r={p.radius} fill="none" stroke="hsl(215 27.9% 16.9%)" strokeWidth="5" />
          ))}
          
          {/*Sol*/}
          <circle cx={SVG_SIZE / 2} cy={SVG_SIZE / 2} r={250} fill="yellow" />

          {/*LineasSol*/}
          {isBaseCase && planetPositions.map(p => (
            <line
              key={`line-${p.name}`}
              x1={SVG_SIZE / 2}
              y1={SVG_SIZE / 2}
              x2={p.x}
              y2={p.y}
              stroke={lineColor}
              strokeWidth="2"
            />
          ))}

          {/*Planetas*/}
          {planetPositions.map(p => (
            <circle key={p.name} cx={p.x} cy={p.y} r={80} fill={p.color} />
          ))}

          {/*LineasTriangulo*/}
          {isBaseCase && planetPositions.length >= 3 && (
            <>
              <line
                key={`lineTriangle1-${planetPositions[0].name}-${planetPositions[1].name}`}
                x1= {planetPositions[0].x}
                y1= {planetPositions[0].y}
                x2= {planetPositions[1].x}
                y2= {planetPositions[1].y}
                stroke={lineColor}
                strokeWidth="5"
              />
              <line
                key={`lineTriangle2-${planetPositions[1].name}-${planetPositions[2].name}`}
                x1= {planetPositions[1].x}
                y1= {planetPositions[1].y}
                x2= {planetPositions[2].x}
                y2= {planetPositions[2].y}
                stroke={lineColor}
                strokeWidth="5"
              />
              <line
                key={`lineTriangle3-${planetPositions[2].name}-${planetPositions[0].name}`}
                x1= {planetPositions[2].x}
                y1= {planetPositions[2].y}
                x2= {planetPositions[0].x}
                y2= {planetPositions[0].y}
                stroke={lineColor}
                strokeWidth="5"
              />
            </>
          )}
        </svg>
      </div>

      {/*Datos mostrados*/}
      <div className="mt-4 p-4 border rounded-lg bg-gray-800 font-mono text-sm text-white">
        <p><strong>Día:</strong> {day}</p>
        <ul>
          {planetPositions.map(p => (
            <li key={`data-${p.name}`}>
              <strong>{p.name}:</strong> Posición (x: {p.x.toFixed(1)}, y: {p.y.toFixed(1)})
            </li>
          ))}
        </ul>
        {isBaseCase && arePlanetsAlignedSun && (
          <p className="mt-2 text-yellow-400 font-bold">
            Clima: ¡Alineación planetaria con el Sol! Sequia por <strong>{alignSunT}</strong> vez.
          </p>
        )}
        {isBaseCase && (arePlanetsAligned && !arePlanetsAlignedSun) &&(
          <p className="mt-2 text-green-400 font-bold">
            Clima: ¡Alineación planetaria sin el Sol! Buen clima <strong>{alignT}</strong> vez.
          </p>
        )}
        {isBaseCase && (isSunInT && !arePlanetsAlignedSun)&& (
          <p className="mt-2 text-blue-400 font-bold">
            Clima: ¡Sol dentro de triangulo! Tormentas por <strong>{sunInT}</strong> vez de magnitud <strong>{perimeter}</strong> .
          </p>
        )}
        {isBaseCase && (!isSunInT && !arePlanetsAlignedSun && !arePlanetsAligned) &&(
          <p className="mt-2 text-gray-400 font-bold">
            Clima: ¡Sol fuera de triangulo! Normalidad de presion y temperatura por <strong>{sunOutT}</strong> vez .
          </p>
        )}
      </div>
    </div>
  );
}