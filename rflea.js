///////////////////////////////////////////////////////////////////////////////
// GLOBAL SETTINGS
///////////////////////////////////////////////////////////////////////////////

var rFleaMAC1 = 59555, // enter your rFlea MAC address here if you want to pair to a specific one(e.g. 47740). Set to 0 for connecting to any in vicinity.
    rFleaMAC2=8266, //Add as much as 8 ID you would like to connect to
    frequency1 = 8, // use higher frequency for better response. Default value is 8, higher frequencies use more batteries
    frequency2 = 8, // use higher frequency for better response. Default value is 8, higher frequencies use more batteries
    
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
/**
 * Override in your app to receive "range" messages, e.g. sb.onRangeMessage = yourRangeFunction
 * @param  {String} name  Name of incoming route
 * @param  {Number} value The data being provided
 * @memberOf Spacebrew.Client
 * @public
 */
onrFleaMessage = function( rFleaData ){};


///////////////////////////////////////////////////////////////////////////////
// SETUP
///////////////////////////////////////////////////////////////////////////////

var ChannelConnected=false;

while (AntInterface.isAntReady()==false){//try 3 times until get connection. 
   
}

ChannelConnected = AntInterface.addNewChannel(false, rFleaMAC1, frequency1); //false means we are opening a Slave master
if(ChannelConnected==true)
	AndroidInterface.showToast("rFlea with ID "+rFleaMAC1+" is set up");
else
	AndroidInterface.showToast("rFlea with ID "+rFleaMAC1+" could not be set up");

		//Connect to as much rFlea as you wish (MAXIMUM 8)
//ChannelConnected=AntInterface.addNewChannel(false, rFleaMAC2, frequency2); //open a second channel
//if(ChannelConnected==true)
	//AndroidInterface.showToast("rFlea with ID "+rFleaMAC2+" is set up");
//else
	//AndroidInterface.showToast("rFlea with ID "+rFleaMAC2+" could not be set up");



var packagesReceived = 0; //counter

if (debug) AndroidInterface.showToast("Ant connected " + antConnected);

///////////////////////////////////////////////////////////////////////////////
// ANT MESSAGE HANDLING
///////////////////////////////////////////////////////////////////////////////
function onMessage(data) {
	packagesReceived++;
	
	var rFleaData = parseRflea(data);
	
	this.onrFleaMessage(rFleaData);

	//user code
	theMagic(rFleaData);
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
		MAC: (parseInt(data[8]) << 8 | parseInt(data[9])),
	};
}

function toHex(val) {
	var result = parseInt(val).toString(16);
	if (result.length == 1) {
		result = "0" + result;
	}
	return result;
}

function rFleaSend(data0,data1,data2,data3,data4,data5,data6,data7){
	var tx_message = toString(data0,data1,data2,data3,data4,data5,data6,data7);
	var tx_successful = AntInterface.send(tx_message); //returns true if format is correct
	if (true) AndroidInterface.showToast(tx_message, tx_successful);
}
function rFleaSend(data0,data1,data2,data3,data4,data5,data6,data7,ID){ //This is the multichannel function
	var tx_message = toString(data0,data1,data2,data3,data4,data5,data6,data7);
	var tx_successful = AntInterface.send(tx_message,ID); //returns true if format is correct
	if (true) AndroidInterface.showToast(tx_message, tx_successful);
}

function toString(a,b,c,d,e,f,g,h){
	return (a+":"+b+":"+c+":"+d+":"+e+":"+f+":"+g+":"+h);
}
