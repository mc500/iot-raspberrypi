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
 * IBM IoT Module
 */

// Default Constants
var MSPROXY_URL = 'tcp://46.16.189.243:1883',
	MSPROXY_URL_SSL = 'ssl://46.16.189.242:8883',
	EVENTS_INTERVAL = 1,
	DEVICE_NAME = 'myPi';

module.exports = {
	EVENTS_INTERVAL: EVENTS_INTERVAL,
	DEVICE_NAME: DEVICE_NAME
};