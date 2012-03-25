/**
* Creates a bounce easing function to be used with animation.
* @param {Number} timeBetweenBounces This parameter specifies how long it takes between when the object hits the 'ground' and bounces back up to its apex. It needs to be between 0 and 1, but keep in mind that as the number approaches 1, the number of bounces required to smoothly animate the object to a stop will increase, and thus the function will take longer to calculate. A value of .5 will return the same function that Robert Penner uses.
* @param {Number} bounceBackThreshold The value at which the function will consider the object to be at rest. I.E. a value of .5 would mean that the object will be considered at rest if its last bounce put it at .5 of its total 'height'. The lower this number, the more times the easing function will bounce the object, even if its not visually distinguishable.
* @returns An easing function that takes a value representing how far into the animation, and returns the easing value.
* @type Function
*/

function makeBounceFunction(timeBetweenBounces, bounceBackThreshold) {
	"use strict";
	var numberOfBounces, howFarUpItWillBounce, i, totalTime,
		timeBreakPoints, timeHalfwayPoints, normalisingFactors, normalisingConstants, lastBreakPoint, timeHalf;
	//Set to .5 if timeBetweenBounces is not specified or is greater than or equal to 1
	//If timeBetweenBounces is greater than or equal to 1, then it would actually mean that the object is bouncing 'higher', and thus will never come to a rest.
	if (timeBetweenBounces === undefined || typeof timeBetweenBounces !== "number" || timeBetweenBounces >= 1) {
		timeBetweenBounces = 0.5;
	} else if (timeBetweenBounces < 0) {
		timeBetweenBounces = 0;
	}

	//Sets the default bounceBackThreshold
	if (!bounceBackThreshold || typeof timeBetweenBounces !== "number") {
		bounceBackThreshold = 0.01;
	}
	//Figuring out how many bounces are necessary for it to come to a stop
	howFarUpItWillBounce = 1;
	i = 0;
	while (howFarUpItWillBounce > bounceBackThreshold) {
		howFarUpItWillBounce = Math.pow(timeBetweenBounces, 2 * i);
		i += 1;
	}
	numberOfBounces = i;

	//Figuring out what the total portion of time is.
	totalTime = 1;
	for (i = 1; i <= numberOfBounces; i += 1) {
		totalTime += Math.pow(timeBetweenBounces, i) * 2;
	}

	//Precalculating values needed in the easing function
	timeBreakPoints = [1 / totalTime];
	timeHalfwayPoints = [0];
	normalisingFactors = [1 / ((1 / totalTime) * (1 / totalTime))];
	normalisingConstants = [0];
	lastBreakPoint = timeBreakPoints[0];
	for (i = 1; i <= numberOfBounces; i += 1) {
		lastBreakPoint += Math.pow(timeBetweenBounces, i) / totalTime * 2;
		timeBreakPoints.push(lastBreakPoint);
		timeHalf = (lastBreakPoint - timeBreakPoints[i - 1]) / 2;
		timeHalfwayPoints.push(timeHalf + timeBreakPoints[i - 1]);
		normalisingConstants.push(1 - Math.pow(timeBetweenBounces, 2 * i));
		normalisingFactors.push((1 - normalisingConstants[i]) / (timeHalf * timeHalf));
	}

	//The easing function. x is a value between 0 and 1 representing how far into the animation it is.
	return function (x) {
		var i;
		if (x === 1) {
			return 1;
		}
		for (i = 0; i <= numberOfBounces; i += 1) {
			if (x < timeBreakPoints[i]) {
				return normalisingFactors[i] * (x -= timeHalfwayPoints[i]) * x + normalisingConstants[i];
			}
		}
	};
}