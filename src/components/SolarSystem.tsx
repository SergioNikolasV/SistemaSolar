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
}

interface SolarSystemProps {
  day: number;
}

export default function SolarSystem({ day }: SolarSystemProps) {
  // Posicion (x,y). 
  const planetPositions: PlanetPosition[] = planets.map(planet => {
    const angleRad = (day * planet.speed * Math.PI) / 180;
    const x = SVG_SIZE / 2 + planet.radius * Math.cos(angleRad);
    const y = SVG_SIZE / 2 + planet.radius * Math.sin(angleRad);
    return { ...planet, x, y };
  });

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

          {/*Planetas*/}
          {planetPositions.map(p => (
            <circle key={p.name} cx={p.x} cy={p.y} r={80} fill={p.color} />
          ))}
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
      </div>
    </div>
  );
}