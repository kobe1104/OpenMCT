/**
 * Basic implementation of a history and realtime server.
 */

var Spacecraft = require("./spacecraft");
var RealtimeServer = require("./realtime-server");
var HistoryServer = require("./history-server");
var StaticServer = require("./static-server");

var expressWs = require("express-ws");
var app = require("express")();
expressWs(app);

var spacecraft = new Spacecraft();
var realtimeServer = new RealtimeServer(spacecraft);
var historyServer = new HistoryServer(spacecraft);
var staticServer = new StaticServer();

app.use("/realtime", realtimeServer);
app.use("/history", historyServer);
app.use("/", staticServer);
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:8081");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin,X-Requested-With, Content-Type, Accept"
  );
  next();
});

var port = process.env.PORT || 8080;

// spacecraft.generateTelemetry();
app.listen(port, function () {
  console.log("Open MCT hosted at http://localhost:" + port);
  console.log("History hosted at http://localhost:" + port + "/history");
  console.log("Realtime hosted at ws://localhost:" + port + "/realtime");
});
