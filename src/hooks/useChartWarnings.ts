import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { ChartData } from "../../types/chart";

export function useChartWarnings(data: ChartData) {
  const lastWarning = useRef<string | null>(null);
  const { name, type, temperature, pressure, maxValue, minValue } = data;

  const value = type === "press" ? pressure : temperature;
  const valueInPercent = Math.min(
    Math.max(((value - minValue) / (maxValue - minValue)) * 100, 0),
    100
  );

  useEffect(() => {
    function showWarning(id: string, message: string) {
      toast.warning(message, {
        id,
        position: "bottom-right",
        closeButton: true,
        duration: 10000,
      });
    }

    if (valueInPercent <= 10 && lastWarning.current !== "low") {
      showWarning(
        name,
        `${type === "press" ? "Pressão" : "Temperatura"} em ${name}, próxima do mínimo permitido`
      );
      lastWarning.current = "low";
    } else if (valueInPercent >= 90 && lastWarning.current !== "high") {
      showWarning(
        name,
        `${type === "press" ? "Pressão" : "Temperatura"} em ${name}, próxima do máximo permitido`
      );
      lastWarning.current = "high";
    } else if (
      valueInPercent > 10 &&
      valueInPercent < 90 &&
      lastWarning.current !== null
    ) {
      lastWarning.current = null;
    }
  }, [valueInPercent, name, type]);
}
