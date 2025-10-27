import { useState, useEffect } from "react";

export function useLocalStorage<T>(key: string, initial: T) {
  // Siempre empezar con el valor inicial para evitar diferencias SSR/CSR
  const [state, setState] = useState<T>(initial);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // Solo después de la hidratación, cargar desde localStorage
    try {
      const raw = localStorage.getItem(key);
      if (raw) {
        const parsed = JSON.parse(raw) as T;
        setState(parsed);
      }
    } catch (e) {
      // Si hay error, mantener el valor inicial
    }
    setIsHydrated(true);
  }, [key]);

  useEffect(() => {
    // Solo guardar en localStorage después de la hidratación
    if (isHydrated) {
      try {
        localStorage.setItem(key, JSON.stringify(state));
      } catch (e) {
        // ignore
      }
    }
  }, [key, state, isHydrated]);

  return [state, setState] as const;
}
