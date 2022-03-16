const express = require("express"); //Libreria del servidor
const app = express(); //Ejecutar el server y crear el objeto app
const http = require("http");
const server = http.createServer(app);
const io = require("socket.io")(server);


io.on("connection", function (socket) {
  console.log("a user connected");
});

//Comunicación serial

const { SerialPort, ReadlineParser } = require("serialport"); //Librerias para el serialport
const parser = new ReadlineParser(); //Objeto del serial port

const setConectionPort = (newPort) => {
  let port;
  port = new SerialPort({ path: newPort, baudRate: 9600 });
  port.pipe(parser);
};

setConectionPort("COM5");

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

server.listen(3001, () => {
  console.log("Server is running on port 3000");
});


