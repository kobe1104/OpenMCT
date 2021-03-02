(function (root, factory) {
	if (typeof define === "function" && define.amd) {
		define(factory);
	} else if (typeof exports === "object") {
		module.exports = factory;
	} else {
		root.util = factory(root);
	}
})(this, function (root) {
	"use strict";

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

	var exports = {};

	exports.mapTime = function (data) {
		// convert time in miliseconds to readible fromat
		let newFormat = new Date(data.timestamp).toLocaleString();
		data.timestamp = newFormat;
	};

	exports.sortData = function () {
		if (!currentData.length) return currentData;
		currentData.sort((d1, d2) => {
			if (d1.timestamp > d2.timestamp) return 1;
			if (d1.timestamp < d2.timestamp) return -1;
			return 0;
		});
		return currentData;
	};

	exports.insertData = function (data) {
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
		// add time stamp as class name
		newRow.classList.add(Date.parse(data.timestamp));
		// for each column, insert new cell to the row for
		let keys = ["id", "timestamp", "value"];
		for (let key of keys) {
			let newCell = newRow.insertCell();
			let newText = document.createTextNode(data[key]);
			newCell.appendChild(newText);
		}
	};

	exports.switchType = function (event) {
		let currentSelection = event.currentTarget.value;
		if (currentSelection === "pwr.v" || currentSelection === "pwr.c") {
			types = [currentSelection];
		} else {
			//   get both
			types = ["pwr.c", "pwr.v"];
		}
		//   unsubscribe both types first
		subscription.unsubscribe();
		clearTable(runProgram);
	};

	exports.switchOrder = function (event) {
		let currentSelection = event.currentTarget.value;
		order = currentSelection;
		clearTable(runProgram);
	};

	exports.removeOldData = function () {
		// if order = oldest: remove from top else remove from bottom
		// find rows with current time stamp.
		// remove all el's below or above depends on order
		const todayDate = new Date(),
			currentTimeStamp = parseInt(Date.parse(todayDate) - 60 * 15 * 1000);
		// console.log(currentTimeStamp);
		let children = document.querySelector("tbody").children;
		if (order === "oldest") {
			// check from top
			for (let i = 1; i < children.length; i++) {
				let dataTimeStamp = parseInt(children[i].className);
				if (dataTimeStamp < currentTimeStamp) {
					// remove row and currentData
					children[i].remove();
					currentData.shift();
				} else {
					break;
				}
			}
		} else {
			// check from bottom
			for (let i = children.length - 1; i > 1; i--) {
				let dataTimeStamp = parseInt(children[i].className);
				if (dataTimeStamp < currentTimeStamp) {
					// remove row and currentData
					children[i].remove();
					currentData.pop();
				} else {
					break;
				}
			}
		}
	};

	return exports;
});
