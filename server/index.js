const express = require("express"); //Libreria del servidor
const app = express(); //Ejecutar el server y crear el objeto app
const http = require("http");
const server = http.createServer(app);
const io = require("socket.io")(server, {cors: {origin: "*"}});
const cors = require('cors')


app.use(cors());

io.on("connection", function (socket) {
  console.log("a user connected");
});

//Comunicación serial

const { SerialPort, ReadlineParser } = require("serialport"); //Librerias para el serialport
const parser = new ReadlineParser(); //Objeto del serial port

let port;
const setConectionPort = (newPort) => {
  port = new SerialPort({ path: newPort, baudRate: 9600 });
  port.pipe(parser);
};

setConectionPort("COM7");

// midleware
app.use(express.static("static")); //Usar la carpeta static
app.use("/static", express.static("static"));

parser.on("open", function () {
  console.log("connection is openned");
});

parser.on("data", (data) => {
  let temp = parseFloat(data, 10);
  console.log(temp);
  io.emit("temp", data);
});

parser.on("error", function () {
  console.log(err);
});

app.get("/Motor", (req, res) => {
  port.write('1')
  res.send('hilo1') 
});

app.get("/Servo", (req, res) => {
  port.write('2');
  res.send('hilo2')
});

app.get("/Stop", (req, res) => {
  port.write('3');
  res.send('hilo3')
});


server.listen(3001, () => {
  console.log("Server is running on port 3001");
});


