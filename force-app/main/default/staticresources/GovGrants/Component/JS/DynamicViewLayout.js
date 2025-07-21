var j$ = jQuery.noConflict();
var setupCookiePresent = (j$.cookie('setup') == 'present');
//j$(document).tooltip();
var labelsWithHelp = document.getElementsByClassName("labelHelpTooltip");
for (i = 0; i < labelsWithHelp.length; i++) {
	j$(labelsWithHelp[i]).tooltip();
}
j$('.fa.fa-info.helpIcon').click(function() {    
	if(setupCookiePresent) {
		j$('.fieldApiNameDisplay').removeClass('active');
		j$(this).parent().nextAll('.fieldApiNameDisplay').addClass('active');
	}
});
j$('body').click(function(e) {
	if(j$(e.target).closest('.fieldApiNameDisplay').length < 1 && !(j$(e.target).hasClass('helpIcon'))){
		j$('.fieldApiNameDisplay').removeClass('active');
	}
});