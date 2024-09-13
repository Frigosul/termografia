
// import { TemperatureChart } from "./components/temperature-chart";
import dynamic from "next/dynamic";
const TemperatureChart = dynamic(() => import("@/app/(home)/components/temperature-chart"), { ssr: false });
export default function Home() {
  return (


    <main className=" grid grid-cols-home  gap-2 h-[calc(100vh_-_7.5rem)] py-4 items-start justify-center  overflow-y-scroll">

      {Array.from({ length: 60 }).map((i, item) => {

        return (
          <TemperatureChart key={item} />
        )
      })}

    </main>

  );
}
