const sockets = io();

sockets.on("temp", function (data) {
  console.log(data);
});
