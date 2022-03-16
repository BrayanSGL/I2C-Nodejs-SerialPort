import './temperatura.css';
import React from "react";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);


const TemperaturaView = () => {
  const data = {
    labels: ["Jun", "Jul", "Aug"],
    datasets: [
      {
        label: "Temperatura",
        data: [5, 6, 7],
      }
    ],
  };

  return (
    <>
      <header>
        <h2>ELVIS COCHO</h2>
      </header>
      <div>
        <section >
          grafica
          <Line data={data} className="grafica"/>
        </section>
        <div>
          <button>Ventilador</button>
          <button>Esclusa</button>
        </div>
      </div>
    </>
  );
};

export default TemperaturaView;
