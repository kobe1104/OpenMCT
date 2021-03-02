var types = ["pwr.c", "pwr.v"];
var order = "latest";
var currentData = [];
var socket;

// start the program
runProgram();
function runProgram() {
	// populate table with 15 mins history
	Promise.all(historicalTele.getHistoricalTelemetry())
		.then((res) => {
			// sort data from oldest to latest
			util.sortData();
		})
		.then((res) => {
			//   map timestamp
			currentData.forEach((data) => util.mapTime(data));
		})
		.then((res) => {
			//   populate table, depends on the order
			currentData.forEach((point) => {
				util.insertData(point);
			});
		})
		.then((res) => {
			//   call websocket & subscribe the selected types
			subscription.subscribe();
		});

	// clean old data every second
	setInterval(() => {
		util.removeOldData();
	}, 1000);
}
