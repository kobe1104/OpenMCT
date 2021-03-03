describe("Test for sortData method", () => {
	var currentData = [];
	function sortData() {
		if (!currentData.length) return currentData;
		currentData.sort((d1, d2) => {
			if (d1.timestamp > d2.timestamp) return 1;
			if (d1.timestamp < d2.timestamp) return -1;
			return 0;
		});
		return currentData;
	}
	beforeEach(() => {
		// reset currentData
		currentData = [];
	});

	it("Returns empty array if input is empty", () => {
		expect(sortData()).toEqual([]);
	});

	it("Sort from oldest to latest", () => {
		currentData = [
			{ timestamp: 1614784198000 },
			{ timestamp: 1614784197000 },
			{ timestamp: 1614784199000 },
			{ timestamp: 1614784196000 },
			{ timestamp: 1614784198000 },
		];
		expect(sortData()).toEqual([
			{ timestamp: 1614784196000 },
			{ timestamp: 1614784197000 },
			{ timestamp: 1614784198000 },
			{ timestamp: 1614784198000 },
			{ timestamp: 1614784199000 },
		]);
	});
});
