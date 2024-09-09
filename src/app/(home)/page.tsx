
// import { TemperatureChart } from "./components/temperature-chart";
import dynamic from "next/dynamic";
const TemperatureChart = dynamic(() => import("@/app/(home)/components/temperature-chart"), { ssr: false });
export default function Home() {
  return (


    <main className="mt-4 grid grid-cols-home  gap-2  items-start justify-center overflow-x-scroll">

      {Array.from({ length: 60 }).map((i, item) => {
        console.log(item)
        return (
          <TemperatureChart key={item} />
        )
      })}

    </main>

  );
}
