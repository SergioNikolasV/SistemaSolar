"use client";
import { useState, useEffect, useRef } from "react";

const planets = [
  { name: "Ferengi", radius: 500, speed: -1, color: "hsl(215 20.2% 65.1%)" },
  { name: "Vulcano", radius: 1000, speed: 5, color: "hsl(24.6 95% 53.1%)" },
  { name: "Betazoide", radius: 2000, speed: -3, color: "hsl(142.1 70.6% 45.3%)" },
];
const SVG_SIZE = 5000;

interface PlanetPosition {
  name: string;
  radius: number;
  speed: number;
  color: string;
  x: number;
  y: number;
  angleRad: number;
}

interface rect {
  x1: number;
  x2: number
}

interface SolarSystemProps {
  day: number;
}

let lineColor: string;

export default function SolarSystem({ day }: SolarSystemProps) {
  
  const [alignSunT, setAlignSun] = useState(0);
  const [alignT, setAlign] = useState(0);
  const [sunInT, setSunInT] = useState(0);
  const [sunOutT, setSunOutT] = useState(0);

  const planetPositions: PlanetPosition[] = planets.map(planet => {
    const angle = ((day * planet.speed * Math.PI) / 180);
    const angleRad = Math.abs((angle)%(Math.PI));
    const x = SVG_SIZE / 2 + planet.radius * Math.cos(angle);
    const y = SVG_SIZE / 2 + planet.radius * Math.sin(angle);
    return { ...planet, x, y, angleRad};
  });

  const arePlanetsAlignedSun  = 
    Math.abs(planetPositions[0].angleRad - planetPositions[1].angleRad) < 0.05 &&
    Math.abs(planetPositions[1].angleRad - planetPositions[2].angleRad) < 0.05;

  {/*
  const pend1 = (planetPositions[2].y - planetPositions[0].y) / (planetPositions[2].x - planetPositions[0].x);
  const pend2 = (planetPositions[1].y - planetPositions[0].y) / (planetPositions[1].x - planetPositions[0].x);
  const arePlanetsAligned: boolean = Math.abs(pend1 - pend2) < 0.2 && !arePlanetsAlignedSun;
  */}

  const aSide = Math.sqrt(Math.pow((planetPositions[0].x)-(planetPositions[1].x), 2) + Math.pow((planetPositions[0].y)-(planetPositions[1].y), 2))
  const bSide = Math.sqrt(Math.pow((planetPositions[1].x)-(planetPositions[2].x), 2) + Math.pow((planetPositions[1].y)-(planetPositions[2].y), 2))
  const cSide = Math.sqrt(Math.pow((planetPositions[2].x)-(planetPositions[0].x), 2) + Math.pow((planetPositions[2].y)-(planetPositions[0].y), 2))
  const perimeter = (aSide + bSide + cSide);
  const s = (perimeter/2)

  const arePlanetsAligned: boolean = Math.sqrt((s)*(s-aSide)*(s-bSide)*(s-cSide)) < 50000 && !arePlanetsAlignedSun;

  const sign = (p: {x: number, y: number}, pA: PlanetPosition, pB: PlanetPosition) => {
    return (pB.x - pA.x) * (p.y - pA.y) - (pB.y - pA.y) * (p.x - pA.x);
  };
  

  const d1 = sign({x: SVG_SIZE / 2, y: SVG_SIZE / 2}, planetPositions[0], planetPositions[1]);
  const d2 = sign({x: SVG_SIZE / 2, y: SVG_SIZE / 2}, planetPositions[1], planetPositions[2]);
  const d3 = sign({x: SVG_SIZE / 2, y: SVG_SIZE / 2}, planetPositions[2], planetPositions[0]);

  const negativeT= (d1 < 0) || (d2 < 0) || (d3 < 0);
  const positiveT= (d1 > 0) || (d2 > 0) || (d3 > 0);


  const isSunInT = !( negativeT && positiveT );

  const onDrought = useRef(arePlanetsAlignedSun);
  const onRain = useRef(isSunInT);
  const onOptimum = useRef(arePlanetsAligned);
  const onNormal = useRef(!arePlanetsAlignedSun && !arePlanetsAligned && !isSunInT);
  
  useEffect(() => {
    if (arePlanetsAlignedSun && onDrought.current) {
      setAlignSun(prevCount => prevCount + 1);
      onDrought.current = false;
      onRain.current = true;
      onNormal.current = true;
      onNormal.current = true;
    } else if (arePlanetsAligned && onOptimum.current) {
      setAlign(prevCount => prevCount + 1);
      onOptimum.current = false;
      onRain.current = true;
      onNormal.current = true;
      onDrought.current = true;
    } else if (isSunInT && onRain.current && !arePlanetsAlignedSun) {
      setSunInT(prevCount => prevCount + 1);
      onRain.current = false;
      onNormal.current = true;
      onDrought.current = true;
      onOptimum.current = true;
    } else if (!isSunInT && onNormal.current && !arePlanetsAligned && !arePlanetsAlignedSun) {
      setSunOutT(prevCount => prevCount + 1);
      onNormal.current = false;
      onDrought.current = true;
      onOptimum.current = true;
      onRain.current = true;
    }
  }, [day, arePlanetsAligned, arePlanetsAlignedSun, isSunInT]);

  if (arePlanetsAlignedSun) {
    lineColor = "hsl(48, 100%, 50%)";
  } else if (arePlanetsAligned) {
    lineColor = "hsla(133, 81%, 56%, 1.00)";
  } else if (isSunInT) {
    lineColor = "hsla(216, 76%, 53%, 1.00)";
  } else {
    lineColor = "hsla(214, 34%, 73%, 1.00)";  
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
          {planetPositions.map(p => (
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
          <line
            key={`lineTriangle1-${planetPositions[0].name} ${planetPositions[1].name}`}
            x1= {planetPositions[0].x}
            y1= {planetPositions[0].y}
            x2= {planetPositions[1].x}
            y2= {planetPositions[1].y}
            stroke={lineColor}
            strokeWidth="5"
          />
          <line
            key={`lineTriangle2-${planetPositions[1].name} ${planetPositions[2].name}`}
            x1= {planetPositions[1].x}
            y1= {planetPositions[1].y}
            x2= {planetPositions[2].x}
            y2= {planetPositions[2].y}
            stroke={lineColor}
            strokeWidth="5"
          />
          <line
            key={`lineTriangle3-${planetPositions[2].name} ${planetPositions[0].name}`}
            x1= {planetPositions[2].x}
            y1= {planetPositions[2].y}
            x2= {planetPositions[0].x}
            y2= {planetPositions[0].y}
            stroke={lineColor}
            strokeWidth="5"
          />
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
        {arePlanetsAlignedSun && (
          <p className="mt-2 text-yellow-400 font-bold">
            Clima: ¡Alineación planetaria con el Sol! Sequia por <strong>{alignSunT}</strong> vez.
          </p>
        )}
        {(arePlanetsAligned && !arePlanetsAlignedSun) &&(
          <p className="mt-2 text-green-400 font-bold">
            Clima: ¡Alineación planetaria sin el Sol! Buen clima <strong>{alignT}</strong> vez.
          </p>
        )}
        {(isSunInT && !arePlanetsAlignedSun)&& (
          <p className="mt-2 text-blue-400 font-bold">
            Clima: ¡Sol dentro de triangulo! Tormentas por <strong>{sunInT}</strong> vez de magnitud <strong>{perimeter}</strong> .
          </p>
        )}
        {(!isSunInT && !arePlanetsAlignedSun && !arePlanetsAligned) &&(
          <p className="mt-2 text-gray-400 font-bold">
            Clima: ¡Sol fuera de triangulo! Normalidad de presion y temperatura por <strong>{sunOutT}</strong> vez .
          </p>
        )}
      </div>
    </div>
  );
}