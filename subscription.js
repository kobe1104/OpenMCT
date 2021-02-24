(function (root, factory) {
  if (typeof define === "function" && define.amd) {
    define(factory);
  } else if (typeof exports === "object") {
    module.exports = factory;
  } else {
    root.subscription = factory(root);
  }
})(this, function (root) {
  "use strict";

  var exports = {};
  exports.subscribe = function () {
    socket = new WebSocket(
      location.origin.replace(/^http/, "ws") + "/realtime/"
    );

    socket.onopen = function () {
      console.log("Connection established");

      for (let type of types) {
        socket.send("subscribe " + type);
      }
    };

    socket.onmessage = function (event) {
      let point = JSON.parse(event.data);
      // insert new point to table and add to currentData
      util.mapTime(point);
      currentData.push(point);
      util.insertData(point);
    };
  };
  exports.unsubscribe = function () {
    socket.send("unsubscribe " + "pwr.c");
    socket.send("unsubscribe " + "pwr.v");
  };
  return exports;
});
