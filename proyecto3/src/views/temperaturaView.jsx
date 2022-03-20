import "./temperatura.css";
import React, { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";

import {
  Chart,
  Series,
  ArgumentAxis,
  CommonSeriesSettings,
  Margin,
  Export,
  Legend,
} from "devextreme-react/chart";
//Los datos
const ENDPOINT = "http://127.0.0.1:3001";
// const dataSource = [
//   {
//     time: "1",
//     temperatura: 22.5,
//   },
//   {
//     time: "2",
//     temperatura: 27.5,
//   },
//   {
//     time: "3",
//     temperatura: 24.5,
//   },
// ];

const TemperaturaView = () => {
  const [dataSource, setDataSource] = useState([]);
  const [temperatura, setTemperatura] = useState();

  useEffect(() => {
    const socket = socketIOClient(ENDPOINT);
    socket.on("temp", (data) => {
      console.log(dataSource)
      // setTemperatura(parseFloat(data));
      if (dataSource.length > 10) {
        // setDataSource(dataSource.slice(1));
      }
      setDataSource(dataSource => [...dataSource, {
        temperatura: parseFloat(data.slice(1)),
        time: new Date().toLocaleTimeString(),
      }]);
    });
  }, []);

  return (
    <>
      <header>
        <h2>ELVIS COCHO</h2>
      </header>
      <div>
        <section>
          grafica
          <Chart
            palette="Dark Violet"
            title="La Temperatura del AMBIENTE"
            dataSource={dataSource}>
            <CommonSeriesSettings
              argumentField="time"
              type={"stackedsplinearea"}
            />
            <Series valueField="temperatura" name="Temperatura"></Series>
            <ArgumentAxis valueMarginsEnabled={false} />
            <Legend verticalAlignment="bottom" horizontalAlignment="center" />
            <Margin bottom={20} />
            <Export enabled={false} />
          </Chart>
        </section>
        <div>
        {temperatura}
          <button>Ventilador</button>
          <button>Esclusa</button>
        </div>
      </div>
    </>
  );
};

export default TemperaturaView;
