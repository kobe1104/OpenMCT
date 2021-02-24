(function (root, factory) {
  if (typeof define === "function" && define.amd) {
    define(factory);
  } else if (typeof exports === "object") {
    module.exports = factory;
  } else {
    root.historicalTele = factory(root);
  }
})(this, function (root) {
  "use strict";

  var exports = {};
  exports.getHistoricalTelemetry = function () {
    // Returns the telemetry data from the last 15 mins
    // get current time and time 15 mins before
    let todayDate = new Date().getTime();
    let startTime = todayDate - 15 * 60 * 1000;
    let endTime = todayDate;
    let promises = [];
    for (let type of types) {
      promises.push(
        new Promise((resolve, reject) => {
          const url =
            "/history/" + type + "?start=" + startTime + "&end=" + endTime;
          http.get(url).then(function (resp) {
            currentData.push(...resp.data);
            resolve(currentData);
          });
        })
      );
    }
    return promises;
  };
  return exports;
});
