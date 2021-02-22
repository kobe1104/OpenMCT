# OpenMCT
NASA OpenMCT coding challenge

Instructions:
1. Please clone the code by running "git clone git@github.com:kobe1104/OpenMCT.git"
2. Navigate to the folder(OpenMCT) on terminal and run npm install
3. Run npm start to start the server
4. On a browser, go to http://localhost:8080/ 

Features:
1. The table shows both pwr.c and pwr.v type of data from 15 minutes ago to current time. And it will keep adding new data.
2. Users are able to change the type to only pwr.c, pwr.v or both.
3. Users can change the orders by selecting from the "Order" drop down menu. It can either show the oldest or latest data from top.
Notice if "oldest" is selected, incoming data will be added to the bottom of the table.

Working process:
1. My general strategy is to load a set of data within the 15 minutes time frame and then enable the websockt to update the table.
2. First I fetch the initial data (first 15 minutes) with a http request. I have the method "getHistoricalTelemetry" return up to
   2 promises(1 for each data type) so I can move on when the data are fetched. Then I store the data in a variable "currentData".
3. I sort "currentData" to make sure it's in the order from oldest to latest (oldest on top).
4. Depending on the current sorting method, I either insert each data to the top or the bottom of the table.
5. I enable the websocket connection by calling the "subscribe" function. It will subscribe for the selected data type(pwr.c, pwr.v or both).
   Whenever it gets any data it will insert either to the top or the bottom of the table depends on the sorting method.
6. When selecting a different data type with the drop down menu, the "type" variable which contains the current data type will be updated.
   Then it will clear the table by calling the "clearTable" method. After that, it will run "runProgram" again to restart the process.
7. Similar to changing data type, changing order will update the value of "order" and follow the same process of clearing table and
   restart the program.


To improve:
If I have more time I will work on the following to improve this application.
1. I will work on removing the data that's older than 15 minutes.
2. I observed a bug when I switched the data type and order multiple times, wrong type of data started showing.
   I think this might be caused by "runProgram" starting running before "type" is updated. This can be resolved by creating
   a chain of callback functions or setting up a promise if it's the case.
3. Update the timestamp format to the same format as given on the instructions.
4. Split up the functions into several modules so it looks cleaner. Right now all the code lives in "index.js"
5. Go through the code and make sure they follow the clean code guide (ex: naming convention)
6. Write unit tests for each function I created.
7. Figure out a better way to store the data instead of using the "currentData" variable. I would probably make something similar to
   a Vuex store.
8. Come up with a more efficient way to update the table.

Thanks for reviewing the code.

Henry



