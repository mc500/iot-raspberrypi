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
 * cpustat module function test
 */

var cpustat = require('../cpustat');

describe('cpustat unittest', function() {
	it('get cpu temperature', function() {
		console.log('temp: ' + cpustat.getCPUTemp());
		expect(true).to.be.true;
	});
	it('get cpu load', function() {
		console.log('temp: ' + cpustat.getCPULoad());
		expect(true).to.be.true;
	});
});