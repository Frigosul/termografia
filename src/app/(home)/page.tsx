
import { SideBar } from "./components/sidebar";
// import { TemperatureChart } from "./components/temperature-chart";
import dynamic from "next/dynamic";
const TemperatureChart = dynamic(() => import("@/app/(home)/components/temperature-chart"), { ssr: false });
export default function Home() {
  return (
    <div className="flex items-start">
      <SideBar />
      <main className="p-4  grid grid-cols-home flex-1 gap-2  mt-14 items-start justify-center">
        <TemperatureChart />
        <TemperatureChart />
        <TemperatureChart />
        <TemperatureChart />
        <TemperatureChart />
        <TemperatureChart />
        <TemperatureChart />
        <TemperatureChart />
        <TemperatureChart />
        <TemperatureChart />
        <TemperatureChart />
        <TemperatureChart />
        <TemperatureChart />
        <TemperatureChart />

      </main>
    </div>
  );
}
