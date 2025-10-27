"use client";
import { useCallback, useMemo, useState } from "react";
import { Planet, BASE_PLANETS } from "@/lib/planets";
import { useLocalStorage } from "./useLocalStorage";
import { isBaseCase as detectBase, clampRadius, clampSpeed } from "@/lib/planetUtils";

export function usePlanetList() {
  const [stored, setStored] = useLocalStorage<Planet[]>("planet_list", BASE_PLANETS);
  const [version, setVersion] = useState(0);

  const planets = useMemo(() => stored, [stored]);

  const isBaseCase = useMemo(() => detectBase(planets), [planets]);

  const addPlanet = useCallback((p: Planet) => {
    const newP = { ...p, radius: clampRadius(p.radius), speed: clampSpeed(p.speed) };
    setStored(prev => {
      const list = [...prev, newP];
      return list;
    });
    setVersion(v => v + 1);
  }, [setStored]);

  const removePlanet = useCallback((index: number) => {
    setStored(prev => {
      // Solo proteger si queda 1 planeta
      if (prev.length <= 1) return prev;
      const list = prev.filter((_, i) => i !== index);
      return list.length === 0 ? BASE_PLANETS : list;
    });
    setVersion(v => v + 1);
  }, [setStored]);

  const resetToBase = useCallback(() => {
    setStored(BASE_PLANETS);
    setVersion(v => v + 1);
  }, [setStored]);

  const replaceAll = useCallback((list: Planet[]) => {
    setStored(list && list.length ? list : BASE_PLANETS);
    setVersion(v => v + 1);
  }, [setStored]);

  return {
    planets,
    addPlanet,
    removePlanet,
    resetToBase,
    replaceAll,
    isBaseCase,
    version,
  } as const;
}
