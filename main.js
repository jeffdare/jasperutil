var basicCSV = require("basic-csv");
var iotf = require("ibmiotf");
var fs = require("fs");
var propReader = require('properties-reader');

var creds_file_path = "./creds.prop";
var devices_file_path = "./devices.csv";
var created_files_path = "./createdDevices.csv";


var properties = propReader(creds_file_path);
var appClientConfig = {
		"org" : properties.get('org'),
		"id" : properties.get('id'),
		"auth-key" : properties.get('auth-key'),
		"auth-token" : properties.get('auth-token')
};


var appClient = new iotf.IotfApplication(appClientConfig);

basicCSV.readCSV(devices_file_path, {
  parseNumbers: false
}, function (error, rows) {
  console.log(rows); 
  for(var i in rows) {
  	var deviceRow = rows[i];
  	
  	(function(typeId, deviceId, iccid) {
	  	appClient.getDevice(typeId, deviceId).then(function onSuccess (response) {
	            console.log("Success :: "+iccid);

	            var extensions = {
	            	'jasper' : {
	            		'iccid' : iccid
	            	}
	            };
	            
	            appClient.updateDevice(typeId, deviceId, undefined, undefined, undefined, (extensions)).then(function onSuccess (response) {
	            	console.log("Successfully updated for : "+deviceId);
	            	console.log(response);
	            } , function onError (error) {
	            	console.log("Fail on Update");
	            	console.log(error);
	            });
	    }, function onError (error) {
	            if(error.status === 404) {
	            	console.log("Device Not found. Creating : "+deviceId);
	            	var extensions = {
		            	'jasper' : {
		            		'iccid' : iccid
		            	}
		            };
	            	appClient.registerDevice(typeId, deviceId, undefined, undefined, undefined, undefined).then(function onSuccess (response) {
		            	console.log("Successfully Created for : "+deviceId);
		            	//write the passwords to a file named createdDevices.csv
		            	var data = typeId+','+deviceId+','+response.authToken+"\n";
		            	fs.appendFile(created_files_path,data , function (err) {
						  if (err) throw err;
						  console.log('The "data to append" was appended to file!');
						});
		            	var extensions = {
			            	'jasper' : {
			            		'iccid' : iccid
			            	}
			            };
			            
			            appClient.updateDevice(typeId, deviceId, undefined, undefined, undefined, (extensions)).then(function onSuccess (response) {
			            	console.log("Successfully updated for : "+deviceId);
			            	console.log(response);
			            } , function onError (error) {
			            	console.log("Fail on Update");
			            	console.log(error);
			            });
		            } , function onError (error) {
		            	console.log("Fail on Register");
		            	console.log(error);
		            });
	            } else {
	            	console.log("Get Failed for device : "+deviceId);
	            	console.log(error);
	            }
	    });
  })(deviceRow[0], deviceRow[1],deviceRow[2]);
  }
});