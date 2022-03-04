const express = require("express");
const app = express();

const { SerialPort, ReadlineParser } = require("serialport");
const parser = new ReadlineParser();

const port = new SerialPort({ path: "COM3", baudRate: 9600 });
port.pipe(parser);

parser.on("data", (data) => {
  console.log("data", data);
});

app.get('/rojo', (req, res) => {
  port.write("1");
});

app.get('/verde', (req, res) => {
  port.write("0");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
