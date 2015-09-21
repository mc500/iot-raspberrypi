/*******************************************************************************
* Copyright (c) 2015 IBM Corporation and other Contributors.
*
* All rights reserved. This program and the accompanying materials
* are made available under the terms of the Eclipse Public License v1.0
* which accompanies this distribution, and is available at
* http://www.eclipse.org/legal/epl-v10.html
*
* Contributors:
*   JeongSeok Hong - Initial Contribution
*******************************************************************************/

/*
 * IBM IoT Starter Main 
 */

var PI = Math.PI,
	MIN_VALUE = -1.0,
    MAX_VALUE = 1.0;

var configFile = '/etc/iotsample-raspberrypi/device.cfg',
	publishTopic = 'iot-2/evt/status/fmt/json',
	subscribeTopic = 'iot-2/cmd/reboot/fmt/json',
	certFile = './IotFoundation.pem';

var fs = require('fs'),
	properties = require('properties'),
	mqtt = require('mqtt'),
	cpustat = require('./cpustat'),
	IoT = require('./ibm-iot');

console.info('**** IoT Raspberry Pi Sample has started ****');

//read the config file, to decide whether to goto quickstart or registered mode of operation
get_config(configFile, function(config) {

	var isRegistered = config ? true : false,
		msproxyUrl,
		username,
		passwd;

	if (isRegistered) {
		console.log(JSON.stringify(config));
		console.info('Running in Registered mode\n');

		msproxyUrl = 'ssl://' + config.org + '.messaging.internetofthings.ibmcloud.com:8883';

		if (config['auth-method'] !== 'token') {
			console.error('Detected that auth-method is not token. Currently other authentication mechanisms are not supported, IoT process will exit.');
			console.info('**** IoT Raspberry Pi Sample has ended ****');
			process.exit(1);
			return;
		} else {
			username = "use-token-auth";
			passwd = config['auth-token'];
		}
	} else {
		console.info('Running in Quickstart mode\n');
		msproxyUrl = "tcp://quickstart.messaging.internetofthings.ibmcloud.com:1883";
	}

	// read the events
	require('getmac').getMac(function(error, mac_address) {

		if (error) {
			console.error('Error on getting MAC address as this device ID');
			process.exit(1);
			return;
		}

		// normalize
		mac_address = mac_address.toLowerCase().split(':').join('');
		var clientId = getClientId(config, mac_address);

		//the timeout between the connection retry
		var connDelayTimeout = 1;	// default sleep for 1 sec
		var retryAttempt = 0;

		// initialize the MQTT connection
		var options = {
			'clientId': clientId,
			'reconnectPeriod': 3000, // default 1000ms
		};

		//only when in registered mode, set the username/passwd and enable TLS
		if (isRegistered) {
			options.username = username;
			options.password = passwd;

			// MQTT over TLS
			//options['protocol'] = 'mqtts';
			options.ca = [fs.readFileSync(certFile)];
			options.rejectUnauthorized = false; // for Selfsigned Certificates
		}

		// Connect to server
		var client = mqtt.connect(msproxyUrl, options);

		client.on('connect', function() {
			console.log('CONNECT');

			//subscribe for commands - only on registered mode
			if (isRegistered) {
				client.subscribe(subscribeTopic);
			}

			// count for the sine wave
			var count = 1;
			var sleepTimeout = IoT.EVENTS_INTERVAL;

			// Repeat
			setInterval(function() {				
				client.publish(publishTopic, JSON.stringify({
					'd': { 
						'myName': IoT.DEVICE_NAME,
						'cputemp': cpustat.getCPUTemp(), 
						'cpuload': cpustat.getCPULoad(),
						'sine': sineVal(MIN_VALUE, MAX_VALUE, 16, count)
					}
				}));

			}, 1000); // run it every 1 second
		});

		client.on('message', function(topic, message) {
			console.log('MESSAGE');
		});

		client.on('error', function(error) {
			console.error(error);
			process.exit(1);
		});

		// resetting the counters
		// connDelayTimeout = 1;
		// retryAttempt = 0;

	});

});

//This generates the clientID based on the tenant_prefix and mac_address(external Id)
function getClientId(config, mac_address) {

	var orgId,
		typeId,
		deviceId;

	if (config) {
		orgId = config.org;
		typeId = config.type;
		deviceId = config.id;
	} else {
		orgId = "quickstart";
		typeId = "iotsample-raspberrypi";
		deviceId = mac_address;
	}

	return 'd:' + orgId + ':' + typeId + ':' + deviceId;
	// return TENANT_PREFIX + ':' + mac_address;
}

function sineVal(minValue, maxValue, duration, count) {
	var sineValue = Math.sin(2.0 * Math.PI * count / duration) * (maxValue - minValue) / 2.0;
	console.log('sineValue: ' + sineValue);
	return sineValue;
}

// This is the function to read the config from the device.cfg file
function get_config(filename, callback) {

	properties.parse(filename, {'path':true}, function(error, data) {
			if (error) {
				console.info('Config file not found. Going to Quickstart mode\n');
				callback();
			} else {
				callback(data);
			}
		});
}