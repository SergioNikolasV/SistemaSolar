"use client";

import SolarSystem from "@/components/SolarSystem";

export default function Home() {
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        
        <h1 className="text-4xl sm:text-5xl font-extrabold text-center sm:text-left">
          Welcome to{" Solar System Analizer"}
        </h1>
        <p className="text-lg sm:text-xl text-center sm:text-left max-w-2xl">
          This is a web application that allows you to analyze and visualize a particular Solar System.
        </p>
        <SolarSystem />
      </main>
    </div>
  );
}
