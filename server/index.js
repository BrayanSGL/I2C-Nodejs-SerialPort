const express = require("express"); //Libreria del servidor
const app = express(); //Ejecutar el server y crear el objeto app
const server = require("http").Server(app);
const io = require("socket.io")(server);

//const http = require("http");
//const socketIO = require("socket.io");

/*server.listen(3000, function () {
  console.log("server listening on port", 3000);
});*/

io.on("connection", function () {
  console.log("Nuevo cliente conectado");
  socket.emit("mensaje", "Bienvenido");
});

//Comunicación serial

const { SerialPort, ReadlineParser } = require("serialport"); //Librerias para el serialport
const parser = new ReadlineParser(); //Objeto del serial port

const setConectionPort = (newPort) => {
  let port;
  port = new SerialPort({ path: newPort, baudRate: 9600 });
  port.pipe(parser);
};

setConectionPort("COM3");

// midleware

app.use(express.static("static")); //Usar la carpeta static
app.use("/static", express.static("static"));

parser.on("open", function () {
  console.log("connection is openned");
});

parser.on("data", (data) => {
  let temp = parseInt(data, 10) + " °C";
  console.log(temp);
  io.emit("temp", data);
});

parser.on("error", function () {
  console.log(err);
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
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
