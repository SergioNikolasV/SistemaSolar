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
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-center sm:text-left">
          Welcome to{" Solar System Analizer"}
        </h1>
        <p className="text-lg sm:text-xl text-center sm:text-left max-w-2xl">
          This is a web application that allows you to analyze and visualize a particular Solar System.
        </p>
        <div className="grid grid-cols-2 gap-8 w-full">
          <div className="flex flex-col gap-4 items-center">
            <Slider
                id="timePer"
                min={10}
                max={1000}
                step={10}
                value={[timePer]}
                onValueChange={(value) => setTimePer(value[0])}
              />
              <span className="mt-2 text-sm">{timePer} ms</span>
          </div>  
          <div className="flex flex-col justify-center">
            <SolarSystem day={day} />
            <label htmlFor="timePer" className="mb-2">Velocidad de simulación (ms por día)</label>
          </div>
        </div>
      </main>
    </div>
  );
}
