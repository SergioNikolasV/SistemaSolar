"use client";

import SolarSystem from "@/components/SolarSystem";
import { useState, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [day, setDay] = useState(0);
  const [timePer, setTimePer] = useState(100); // ms
  const [onGo, setOnGo] = useState(false);
  const [onSave, setOnSave] = useState(true);
  const [simulationKey, setSimulationKey] = useState(0);

  useEffect(() => {
    if (onGo) {
      const interval = setInterval(() => {
        setDay(prevDay => prevDay + 1);
      }, timePer);
      return () => clearInterval(interval);
    }
  }, [timePer, onGo]);

  const handleToggleSimulation = () => {
    setOnGo(prevOnGo => !prevOnGo);
  };

  const handleToggleRestart = () => {
    setDay(0);
    setOnSave(true);
    setSimulationKey(prevKey => prevKey + 1);
  };

  const handleToggleSave = () => {
    setOnSave(prevOnSave => !prevOnSave);
  };

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 bg-slate-950 text-slate-200">
      <main className="flex flex-col gap-[32px] row-start-2 items-center w-full">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-center">
          Bienvenido a{" Solar System Analizer "}
        </h1>
        <p className="text-lg sm:text-xl text-center max-w-2xl">
          Esta es una aplicacion web que permite simular un sistema solar determinado junto con las variaciones en el clima de cada planeta prodcuto de su posicion con respecto a los demas planetas del sitema.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full items-center">
          <div className="md:col-span-2">
            <SolarSystem day={day} key={simulationKey}/>
          </div>
          <div className="flex flex-col gap-4 items-center justify-center">
            <Button onClick={handleToggleSimulation} className="mt-4 w-4/5">
              {onGo ? "Simular" : "Reanudar"}
            </Button>
            <label htmlFor="timePer" className="mb-2">Velocidad de simulación (ms por día)</label>
            <Slider
                id="timePer"
                min={1}
                max={1000}
                step={10}
                value={[timePer]}
                onValueChange={(value) => setTimePer(value[0])}
                className="w-4/5"
              />
            <span className="mt-2 text-sm">{timePer} ms</span>
            <Button onClick={handleToggleRestart} className="mt-4 w-4/5">
              {"Reiniciar desde el día 0"}
            </Button>
            <Button onClick={handleToggleSave} className="mt-4 w-4/5">
              {onSave ? "Empiece a guardar desde el día actual": "Guardando..."}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}