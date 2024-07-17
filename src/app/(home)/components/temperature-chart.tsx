"use client"
import ApexCharts from "react-apexcharts";

const options = {
  colors: ["#20E647"],
  plotOptions: {
    radialBar: {
      startAngle: -90,
      endAngle: 90,
      track: {
        background: '#333',
        startAngle: -90,
        endAngle: 90,

      },
      dataLabels: {
        name: {
          show: false,
        },
        value: {
          fontSize: "14px",
          show: false,
          formatter: function (value: number) {

            if (value >= -100 && value <= 100) {
              const valueInPercent = ((value + 100) / 200) * 100
              return valueInPercent + "%"
            } else {
              return "Número fora do intervalor de -100 a 100"
            }
          },

          color: "#fff",

        },

      },

    }
  },
  fill: {
    type: "gradient",
    gradient: {
      shade: "dark",
      type: "horizontal",
      gradientToColors: ["#87D4F9"],
      stops: [0, 100]
    }
  },

};




export function TemperatureChart() {

  return (
    <div className="border rounded-md p-2">
      <div className="flex flex-col">
        <strong className="font-normal text-xl text-center">Camara 01</strong>
        <div className="h-[10rem]">
          <ApexCharts
            type="radialBar"
            series={[20]}
            width={
              330
            }
            options={
              options
            }
          />
        </div>
        <p className="text-center mt-[-3.8rem]">10 ºC</p>
      </div>
      <div className="flex justify-between p-2">
        <span className="font-normal text-sm flex items-center justify-center gap-3" >DEGE. <div className="w-3 h-3 rounded-full bg-zinc-400" /> </span>
        <span className="font-normal text-sm flex items-center justify-center gap-3" >VENT. <div className="w-3 h-3 rounded-full bg-zinc-400" /> </span>
        <span className="font-normal text-sm flex items-center justify-center gap-3" >COMP. <div className="w-3 h-3 rounded-full bg-zinc-400" /> </span>
        <span className="font-normal text-sm flex items-center justify-center gap-3" >PORT. <div className="w-3 h-3 rounded-full bg-zinc-400" /> </span>
      </div>
    </div>
  )
}







