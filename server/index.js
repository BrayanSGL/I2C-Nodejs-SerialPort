const express = require("express"); //Libreria del servidor
const app = express(); //Ejecutar el server y crear el objeto app

const { SerialPort, ReadlineParser } = require("serialport"); //Librerias para el serialport
const parser = new ReadlineParser(); //Objeto del serial port

let port;

const setConectionPort = (newPort) => {
  port = new SerialPort({ path: newPort, baudRate: 9600 });
  port.pipe(parser);
};

setConectionPort("COM3");

// midleware

app.use(express.static("static")); //Usar la carpeta static
app.use("/static", express.static("static"));

parser.on("data", (data) => {
  console.log("data", data);
});

app.get("/", (req, res) => {
  res.sendFile(__dirname+"/index.html");
});

app.get("/rojo", (req, res) => {
  port.write("1");
});

app.get("/verde", (req, res) => {
  port.write("0");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
