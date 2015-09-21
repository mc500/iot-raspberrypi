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

var fs = require('fs');

console.info('**** IoT Raspberry Pi Sample has started ****');
