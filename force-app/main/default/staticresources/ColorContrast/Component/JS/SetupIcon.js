var j$ = jQuery.noConflict();
j$("#setupClick").click(function(){
	var adminFlag = j$(this).text();
	if(adminFlag == 'Enable GovGrants Setup') {
		createCookie();
		j$(this).text('Refreshing Page...');
		document.body.style.cursor='wait';
		document.getElementById('setupClick').style.cursor='wait';
		window.location.reload();
	}
	else if(adminFlag == 'Disable GovGrants Setup') {
		var result = deleteCookie();
		if(result == true) {
			j$(this).text('Refreshing Page...');
			document.body.style.cursor='wait';
			document.getElementById('setupClick').style.cursor='wait';
			window.location.reload();
		}
	}
});
function createCookie() {
	j$.cookie('setup','present',{ path: '/' });
	return true;
}
function deleteCookie() {
	j$.removeCookie('setup', { path: '/'});
	return true;
}
j$(document).ready(function(){
	changeLabel();
})
function changeLabel() {
	var text = j$("#setupClick").text();
	if(j$.cookie('setup') == 'present') {
		j$("#setupClick").text("Disable GovGrants Setup");
	}
	else if (j$.cookie('setup') != 'present') {
		j$("#setupClick").text("Enable GovGrants Setup");
	}
}