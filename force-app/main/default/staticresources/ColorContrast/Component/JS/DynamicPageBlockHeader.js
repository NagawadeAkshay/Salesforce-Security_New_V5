var j$= jQuery.noConflict();
if(j$.cookie('setup') == 'present' && dynamicPageBlockHeader_EnableAdminSetup) {
	j$(".pbSetup").show();
}
else {
	j$(".pbSetup").hide();
}
