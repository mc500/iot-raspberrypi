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

var fs = require('fs'),
	syslog = require('node-syslog');

syslog.init("iot", syslog.LOG_PID | syslog.LOG_CONS, syslog.LOG_USER);

syslog.log(syslog.LOG_INFO, "**** IoT Raspberry Pi Sample has started ****");

syslog.close();
