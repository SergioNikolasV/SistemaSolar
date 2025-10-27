export type Planet = {
  name: string;
  radius: number;
  speed: number;
  color: string;
};

export const BASE_PLANETS: Planet[] = [
  { name: "Ferengi", radius: 500, speed: -1, color: "hsl(215 20.2% 65.1%)" },
  { name: "Vulcano", radius: 1000, speed: 5, color: "hsl(24.6 95% 53.1%)" },
  { name: "Betazoide", radius: 2000, speed: -3, color: "hsl(142.1 70.6% 45.3%)" },
];
