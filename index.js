var types = ["pwr.c", "pwr.v"];
var order = "latest";
var currentData = [];
var socket;

// start the program
runProgram();
function runProgram() {
  // populate table with 15 mins history
  Promise.all(getHistoricalTelemetry())
    .then((res) => {
      // sort data from oldest to latest
      sortData();
    })
    .then((res) => {
      //   map timestamp
      currentData.forEach((data) => mapTime(data));
    })
    .then((res) => {
      //   populate table, depends on the order
      currentData.forEach((point) => {
        insertData(point);
      });
    })
    .then((res) => {
      //   call websocket & subscribe the selected types
      subscribe();
    });
}

function getHistoricalTelemetry() {
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
}

function sortData() {
  if (!currentData.length) return currentData;
  currentData.sort((d1, d2) => {
    if (d1.timestamp > d2.timestamp) return 1;
    if (d1.timestamp < d2.timestamp) return -1;
    return 0;
  });
  return currentData;
}

function mapTime(data) {
  // convert time in miliseconds to readible fromat
  let newFormat = new Date(data.timestamp).toLocaleString();
  data.timestamp = newFormat;
}

function insertData(data) {
  let tbodyRef = document
    .querySelector(".table")
    .getElementsByTagName("tbody")[0];
  // insert a data to the table
  let newRow;
  if (order === "oldest") {
    //   oldest will be on top
    newRow = tbodyRef.insertRow();
  } else {
    // latest will be on top
    newRow = tbodyRef.insertRow(1);
  }
  // for each column, insert new cell to the row for
  let keys = ["id", "timestamp", "value"];
  for (let key of keys) {
    let newCell = newRow.insertCell();
    let newText = document.createTextNode(data[key]);
    newCell.appendChild(newText);
  }
}

function subscribe() {
  socket = new WebSocket(location.origin.replace(/^http/, "ws") + "/realtime/");

  socket.onopen = function () {
    console.log("Connection established");

    for (let type of types) {
      socket.send("subscribe " + type);
    }
  };

  socket.onmessage = function (event) {
    point = JSON.parse(event.data);
    // insert new point to table and add to currentData
    mapTime(point);
    currentData.push(point);
    insertData(point);
  };
}
function unsubscribe() {
  socket.send("unsubscribe " + "pwr.c");
  socket.send("unsubscribe " + "pwr.v");
}

function switchType(event) {
  let currentSelection = event.currentTarget.value;
  if (currentSelection === "pwr.v" || currentSelection === "pwr.c") {
    types = [currentSelection];
  } else {
    //   both
    types = ["pwr.c", "pwr.v"];
  }
  console.log(types);

  //   unsubscribe both types first
  unsubscribe();
  clearTable(runProgram);
}

function switchOrder(event) {
  let currentSelection = event.currentTarget.value;
  order = currentSelection;
  //   console.log(types);
  clearTable(runProgram);
}

function clearTable(callback) {
  // clear table an currentData
  currentData = [];
  let table = document.querySelector(".table");
  table.innerHTML = `
    <tr class="colnum_names">
    <th>ID</th>
    <th>Timestamp</th>
    <th>Value</th>
  </tr>
    `;
  callback();
}
