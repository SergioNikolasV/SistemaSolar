"use client";

import SolarSystem from "@/components/SolarSystem";
import PlanetForm from "@/components/PlanetForm";
import PlanetList from "@/components/PlanetList";
import { useState, useEffect } from "react";
import { usePlanetList } from "@/hooks/usePlanetList";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/lib/supabaseClient";

interface DailyReport {
  dia: number;
  clima: string;
}

export default function Home() {
  const [day, setDay] = useState(0);
  const [timePer, setTimePer] = useState(100); // ms
  const [onGo, setOnGo] = useState(false);
  
  const [simulationKey, setSimulationKey] = useState(0);
  const [requiresRestart, setRequiresRestart] = useState(false);

  //Base de datos
  const [showSaveForm, setShowSaveForm] = useState(false);
  const [userName, setUserName] = useState("");
  const [userPlanet, setUserPlanet] = useState("");
  const [startDay, setStartDay] = useState(0);
  const [onSave, setOnSave] = useState(false);
  const [dailyReports, setDailyReports] = useState<DailyReport[]>([]);
  const [climateCounts, setClimateCounts] = useState<{ sequia: number | "N/A"; optimo: number | "N/A"; lluvia: number | "N/A"; normal: number | "N/A" }>({
    sequia: 0, optimo: 0, lluvia: 0, normal: 0
  });

  const { planets, addPlanet, removePlanet, resetToBase, isBaseCase, version } = usePlanetList();

  // when planet configuration changes (version) we must pause, reset day and mark restart required
  useEffect(() => {
    if (version === 0) return;
    setOnGo(false);
    setDay(0);
    setSimulationKey(k => k + 1);
    setRequiresRestart(true);
    if (!isBaseCase) {
      setClimateCounts({ sequia: "N/A" as any, optimo: "N/A" as any, lluvia: "N/A" as any, normal: "N/A" as any });
    } else {
      setClimateCounts({ sequia: 0, optimo: 0, lluvia: 0, normal: 0 });
    }
  }, [version]);

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
    setShowSaveForm(false);
    setSimulationKey(prevKey => prevKey + 1);
  };

  const handleShowSaveForm = () => {
    setOnGo(false);
    setStartDay(day);
    setShowSaveForm(true);
  };

  const handleToggleSave = async () => {
    if (!userName || !userPlanet) {
      alert("Por favor, introduce tu nombre y elige un planeta.");
      return;
    }
    // prevent saving when counts are N/A (custom config)
    if (Object.values(climateCounts).some(v => v === "N/A")) {
      alert("No es posible guardar una simulación con configuracion personalizada. Reinicia a caso base para generar reportes.");
      return;
    }
    setOnSave(true);

    try {
      const { data: simData, error: simError } = await supabase
        .from('simulaciones')
        .insert({
          dia_inicio: startDay,
          dia_fin: day,
          veces_sequia: climateCounts.sequia,
          veces_optimas: climateCounts.optimo,
          veces_lluvia: climateCounts.lluvia,
          veces_normales: climateCounts.normal,
        })
        .select()
        .single();

      if (simError) throw simError;

      const reportsToInsert = dailyReports.map(report => ({
        ...report,
        simulacion_id: simData.id,
      }));

      const { error: daysError } = await supabase
        .from('dias')
        .insert(reportsToInsert);
      if (daysError) throw daysError;

      const { error: userError } = await supabase
        .from('usuarios')
        .insert({
          nombre: userName,
          planeta: userPlanet,
          simulacion_id: simData.id,
        });

      if (userError) throw userError;

      alert("¡Simulación guardada con éxito!");
      setShowSaveForm(false);

    } catch (error: any) {
      console.error("Error al guardar en Supabase:", error);
      alert(`Error al guardar: ${error.message}`);
    } finally {
      setOnGo(true);
      setOnSave(false);
    }
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
            <SolarSystem day={day} key={simulationKey} planets={planets} isBaseCase={isBaseCase} onClimateUpdate={setClimateCounts} onDayReport={(report) => setDailyReports(prev => [...prev, report])}/>
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
            {!isBaseCase && requiresRestart && (
              <div className="w-4/5 mt-2 text-center p-2 bg-amber-900 rounded">
                <p className="text-sm">Configuración personalizada aplicada. La simulación está pausada y requiere reinicio desde 0 para aplicar los contadores.</p>
                <Button className="mt-2" onClick={() => { setRequiresRestart(false); setDay(0); }}>Reiniciar desde 0</Button>
              </div>
            )}
            <Button onClick={handleShowSaveForm} className="mt-4 w-4/5" disabled={showSaveForm}>
              Guardar Simulación
            </Button>
            <div className="w-4/5 mt-4">
              <PlanetForm existing={planets} onCreate={addPlanet} />
            </div>
            <div className="w-4/5 mt-4">
              <PlanetList planets={planets} onRemove={removePlanet} onReset={() => resetToBase()} isBaseCase={isBaseCase} />
            </div>
            {showSaveForm && (
              <div className="w-4/5 mt-4 p-4 border rounded-lg bg-slate-800 flex flex-col gap-4">
                <h3 className="font-bold text-center">Guardar Reporte</h3>
                <Input 
                  placeholder="Tu nombre" 
                  value={userName} 
                  onChange={(e) => setUserName(e.target.value)} 
                />
                <Select onValueChange={setUserPlanet} value={userPlanet}>
                  <SelectTrigger>
                    <SelectValue placeholder="Elige tu planeta" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Ferengi">Ferengi</SelectItem>
                    <SelectItem value="Vulcano">Vulcano</SelectItem>
                    <SelectItem value="Betazoide">Betazoide</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={handleToggleSave} disabled={onSave}>
                  {onSave ? "Guardando..." : "Confirmar Guardado"}
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}