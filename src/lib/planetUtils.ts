import { Planet, BASE_PLANETS } from "./planets";

export const SVG_SIZE = 5000;

export const SPEED_MIN = -20;
export const SPEED_MAX = 20;

export const RADIUS_MIN = 50; // visual minimum
export const RADIUS_MAX = SVG_SIZE / 2 - 300; // leave space for sun and viewbox

export function isValidName(name: string, list: Planet[]) {
  if (!name || name.trim().length === 0) return false;
  const lower = name.trim().toLowerCase();
  return !list.some(p => p.name.trim().toLowerCase() === lower);
}

export function clampSpeed(v: number) {
  return Math.max(SPEED_MIN, Math.min(SPEED_MAX, Math.round(v)));
}

export function clampRadius(v: number) {
  return Math.max(RADIUS_MIN, Math.min(RADIUS_MAX, Math.round(v)));
}

export function isBaseCase(list: Planet[]) {
  if (!Array.isArray(list)) return false;
  if (list.length !== BASE_PLANETS.length) return false;
  for (let i = 0; i < BASE_PLANETS.length; i++) {
    const a = BASE_PLANETS[i];
    const b = list[i];
    if (!b) return false;
    if (a.name !== b.name || a.radius !== b.radius || a.speed !== b.speed || a.color !== b.color) return false;
  }
  return true;
}

// Tipos para cálculos climáticos
export interface PlanetPosition {
  name: string;
  radius: number;
  speed: number;
  color: string;
  x: number;
  y: number;
  angleRad: number;
}

// Funciones para cálculos climáticos dinámicos
export function calculatePlanetPositions(planets: Planet[], day: number): PlanetPosition[] {
  return planets.map(planet => {
    const angle = ((day * planet.speed * Math.PI) / 180);
    const angleRad = Math.abs((angle) % (Math.PI));
    const x = SVG_SIZE / 2 + planet.radius * Math.cos(angle);
    const y = SVG_SIZE / 2 + planet.radius * Math.sin(angle);
    return { ...planet, x, y, angleRad };
  });
}

export function arePlanetsAlignedWithSun(planetPositions: PlanetPosition[]): boolean {
  if (planetPositions.length < 2) return false;
  
  // Verificar si todos los planetas están alineados con el sol
  const tolerance = 0.05;
  for (let i = 1; i < planetPositions.length; i++) {
    if (Math.abs(planetPositions[0].angleRad - planetPositions[i].angleRad) > tolerance) {
      return false;
    }
  }
  return true;
}

export function arePlanetsAligned(planetPositions: PlanetPosition[]): boolean {
  if (planetPositions.length < 3) return false;
  
  // Calcular el área del triángulo formado por los primeros 3 planetas
  const p1 = planetPositions[0];
  const p2 = planetPositions[1];
  const p3 = planetPositions[2];
  
  const aSide = Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
  const bSide = Math.sqrt(Math.pow(p2.x - p3.x, 2) + Math.pow(p2.y - p3.y, 2));
  const cSide = Math.sqrt(Math.pow(p3.x - p1.x, 2) + Math.pow(p3.y - p1.y, 2));
  const perimeter = aSide + bSide + cSide;
  const s = perimeter / 2;
  
  const area = Math.sqrt(s * (s - aSide) * (s - bSide) * (s - cSide));
  return area < 50000;
}

export function isSunInTriangle(planetPositions: PlanetPosition[]): boolean {
  if (planetPositions.length < 3) return false;
  
  const sunX = SVG_SIZE / 2;
  const sunY = SVG_SIZE / 2;
  
  const sign = (p: {x: number, y: number}, pA: PlanetPosition, pB: PlanetPosition) => {
    return (pB.x - pA.x) * (p.y - pA.y) - (pB.y - pA.y) * (p.x - pA.x);
  };
  
  const p1 = planetPositions[0];
  const p2 = planetPositions[1];
  const p3 = planetPositions[2];
  
  const d1 = sign({x: sunX, y: sunY}, p1, p2);
  const d2 = sign({x: sunX, y: sunY}, p2, p3);
  const d3 = sign({x: sunX, y: sunY}, p3, p1);
  
  const negativeT = (d1 < 0) || (d2 < 0) || (d3 < 0);
  const positiveT = (d1 > 0) || (d2 > 0) || (d3 > 0);
  
  return !(negativeT && positiveT);
}

export function calculateTrianglePerimeter(planetPositions: PlanetPosition[]): number {
  if (planetPositions.length < 3) return 0;
  
  const p1 = planetPositions[0];
  const p2 = planetPositions[1];
  const p3 = planetPositions[2];
  
  const aSide = Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
  const bSide = Math.sqrt(Math.pow(p2.x - p3.x, 2) + Math.pow(p2.y - p3.y, 2));
  const cSide = Math.sqrt(Math.pow(p3.x - p1.x, 2) + Math.pow(p3.y - p1.y, 2));
  
  return aSide + bSide + cSide;
}
