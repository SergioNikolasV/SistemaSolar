"use client";

import SolarSystem from "@/components/SolarSystem";
import { useState, useEffect } from "react";
import { Slider } from "@/components/ui/slider";

export default function Home() {
  const [day, setDay] = useState(0);
  const [timePer, setTimePer] = useState(100); // ms

  useEffect(() => {
    const interval = setInterval(() => {
      setDay(prevDay => prevDay + 1);
    }, timePer);

    return () => clearInterval(interval);
  }, [timePer]);

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 bg-slate-950 text-slate-200">
      <main className="flex flex-col gap-[32px] row-start-2 items-center w-full">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-center">
          Welcome to{" Solar System Analizer"}
        </h1>
        <p className="text-lg sm:text-xl text-center max-w-2xl">
          This is a web application that allows you to analyze and visualize a particular Solar System.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full items-center">
          <div className="md:col-span-2">
            <SolarSystem day={day} />
          </div>
          <div className="flex flex-col gap-4 items-center justify-center">
            <label htmlFor="timePer" className="mb-2">Velocidad de simulación (ms por día)</label>
            <Slider
                id="timePer"
                min={10}
                max={1000}
                step={10}
                value={[timePer]}
                onValueChange={(value) => setTimePer(value[0])}
                className="w-4/5"
              />
            <span className="mt-2 text-sm">{timePer} ms</span>
          </div>

        </div>
      </main>
    </div>
  );
}