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
	subscribeTopic = 'iot-2/cmd/reboot/fmt/json';

var fs = require('fs'),
	properties = require('properties');

console.info('**** IoT Raspberry Pi Sample has started ****');

//read the config file, to decide whether to goto quickstart or registered mode of operation
get_config(configFile, function(config) {

	if (config) {
		console.log(JSON.stringify(config));
		console.info('Running in Registered mode\n');

		var msproxyUrl = 'ssl://' + config.org + '.messaging.internetofthings.ibmcloud.com:8883';

		if (config['auth-method'] !== 'token') {
			console.error('Detected that auth-method is not token. Currently other authentication mechanisms are not supported, IoT process will exit.');
			console.info('**** IoT Raspberry Pi Sample has ended ****');
			process.exit(1);
		} else {
			var username = "use-token-auth";
			var passwd = config['auth-token'];
		}
	} else {
		console.info('Running in Quickstart mode\n');
		var msproxyUrl = "tcp://quickstart.messaging.internetofthings.ibmcloud.com:1883";
	}

	// read the events
	require('getmac').getMac(function(error, mac_address) {

		console.log(JSON.stringify(getClientId(config, mac_address)));
		//the timeout between the connection retry
		var connDelayTimeout = 1;	// default sleep for 1 sec
		var retryAttempt = 0;

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

	return orgId + ':' + typeId + ':' + deviceId;
	// return TENANT_PREFIX + ':' + mac_address;
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