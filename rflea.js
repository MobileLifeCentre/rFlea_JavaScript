///////////////////////////////////////////////////////////////////////////////
// GLOBAL SETTINGS
///////////////////////////////////////////////////////////////////////////////

var rFleaMAC = 0, // enter your rFlea MAC address here if you want to pair to a specific one(e.g. 47740). Set to 0 for connecting to any in vicinity.
    frequency = 8, // use higher frequency for better response. Default value is 8, higher frequencies use more batteries
    debug = false, // outputs debug messages on the phone. Set to true if something doesn't work out
    verbose = false, // outputs even more debug messages (use with care!)
    showData = true; // outputs the data received from rFlea on the phone screen. All you need is a div with the ID "rFlea" in your html

///////////////////////////////////////////////////////////////////////////////
// HERE'S WHERE THE MAGIC HAPPENS
///////////////////////////////////////////////////////////////////////////////

function theMagic(data) {
	// put your code here. This function will work as a synch, once connected to an rFlea, this funciton will be called
	// every time an rFlea send a package, this will happen depending your frequency parameter. Even when rFlea has no new
	// data to send, you should know that it will keep sending the last package, so the sync is not lost. Remember that,
	//in case you want to distiguish between new and re-sent packages, you should add a counter in some of the data fields
	// from your rFlea Arduino code.
	
	//data.message -> array containing the 8 fields of data sent from the rFlea
	//data.MAC -> array containing 2 hex numbers with the ID of the rFlea. In case we are paired, it is the same as rFleaMAC.
	
	
	
	
}

///////////////////////////////////////////////////////////////////////////////
// SETUP
///////////////////////////////////////////////////////////////////////////////

var antConnected=false;

while (antConnected==false){//try 3 times until get connection. 
antConnected = AntInterface.addNewChannel(false, rFleaMAC, frequency); //false means we are opening a Slave master
}
var packagesReceived = 0; //counter

if (debug) AndroidInterface.showToast("Ant connected " + antConnected);

///////////////////////////////////////////////////////////////////////////////
// ANT MESSAGE HANDLING
///////////////////////////////////////////////////////////////////////////////
function onMessage(data) {
	packagesReceived++;
	var rFleaData = parseRflea(data);

	outputData(rFleaData);

	//user code
	theMagic(rFleaData);

	var tx_message = toString(LED_value,1,2,3,4,5,6,7);
	var tx_successful = AntInterface.send(tx_message); //returns true if format is correct
	if (debug && verbose) AndroidInterface.showToast(tx_message, tx_successful);
}

function onPaired() {
	if (debug) AndroidInterface.showToast("Paired with rFlea");
}

function onSearching() {
	if (debug) AndroidInterface.showToast("Searching for rFlea…");
}

///////////////////////////////////////////////////////////////////////////////
// HELPER METHODS
///////////////////////////////////////////////////////////////////////////////

function parseRflea(data) {
	var data = data.split(",");
	return {
		message: [
			parseInt(data[0]),
			parseInt(data[1]),
			parseInt(data[2]),
			parseInt(data[3]),
			parseInt(data[4]),
			parseInt(data[5]),
			parseInt(data[6]),
			parseInt(data[7])
		],
		MAC: toHex(data[8]) + ":" +toHex(data[9]),
	};
}

function toHex(val) {
	var result = parseInt(val).toString(16);
	if (result.length == 1) {
		result = "0" + result;
	}
	return result;
}

function toString(a,b,c,d,e,f,g,h){
	return (a+":"+b+":"+c+":"+d+":"+e+":"+f+":"+g+":"+h);
}

function outputData(data) {
	var output = "Data package #" + packagesReceived + " received from rFlea #" + rFleaMAC + ": <br/>";
	for (var i = 0; i < data.message.length; i++) {
		output += "data" + i + ": " + data.message[i] + "<br/>";
	}

	$("#rFlea").html(output);
}
