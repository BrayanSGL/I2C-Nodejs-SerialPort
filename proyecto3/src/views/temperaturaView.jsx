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
  const [temperaturaActual, setTemperatura] = useState();

  useEffect(() => {
    let alfa = [];
    const socket = socketIOClient(ENDPOINT);
    socket.on("temp", (data) => {
      if (alfa.length > 10) {
        alfa = alfa.slice(1);
      }
      alfa = [
        ...alfa,
        {
          temperatura: parseFloat(data),
          time: new Date().toLocaleTimeString(),
        },
      ];
      console.log(alfa);
      setTemperatura(parseFloat(data));
      if (dataSource.length > 10) {
        // setDataSource(dataSource.slice(1));
      }
      setDataSource(alfa);
    });
  }, []);

  return (
    <>
      {/* <header>
        <h2>EMPRESA DE ELVIS COCHO</h2>
      </header> */}
      <div>
        <section className="container_graf">
          <div className="indicador">
            <h2>La temperatura del ambiente es: {temperaturaActual} </h2>
          </div>
          <Chart
            palette="Dark Violet"
            //title="La Temperatura del AMBIENTE"
            dataSource={dataSource}
          >
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
        <div className="container_btn">
          <button className="btn">Ventilador</button>
          <button className="btn">Esclusa</button>
          <button className="btn">Detener</button>
        </div>
      </div>
    </>
  );
};

export default TemperaturaView;
