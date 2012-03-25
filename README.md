This is a function to generate a bounce easing function.

Usage : 

	$.extend($.easing, {
		customBounceEase : makeBounceFunction(.5)
	});
	
	$("#foo").animate({
		top : 400
	}, 400, 'customBounceEase');
