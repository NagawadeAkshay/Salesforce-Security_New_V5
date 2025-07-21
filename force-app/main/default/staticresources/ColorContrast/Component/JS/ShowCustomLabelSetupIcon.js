var j$ = jQuery.noConflict();
var setupCookiePresent = (j$.cookie('setup') == 'present');
if(setupCookiePresent == true) {
	var spanElement = document.createElement("span");
	spanElement.setAttribute("class","fa fa-cog cursorpointer customLabelSetup"+showCustomLabelSetupIcon_labelName);
	spanElement.setAttribute("title","Update Label");
	document.getElementById("setupIconSpan"+showCustomLabelSetupIcon_labelName).appendChild(spanElement);
}
/*var urlPathName = window.location.pathname;
var urlSearch = window.location.search;
var fullURLName = urlPathName + urlSearch;
alert(fullURLName);
if(fullURLName == '/apex/CommunitySelfRegistration?flg=true&isdtp=vw') {
  alert('works');
}*/
var dialog;
dialog = j$( "#dialogForm" ).dialog({
  autoOpen: false,
  height: 300,
  width: 350,
  modal: true,
});

j$(".customLabelSetup"+showCustomLabelSetupIcon_labelName).click(function(){
	 dialog.dialog( "open" );
});

function updateForm() {
  var updatedLabel = document.getElementById("updateValue"+showCustomLabelSetupIcon_labelName).value;
  var existingLabel = showCustomLabelSetupIcon_pre+"UserRegNDAAcceptBtn";  
  alert(updatedLabel);
  Visualforce.remoting.Manager.invokeAction(
  _RemotingShowCustomLabelSetupIconActions.updateCustomLabelTranslation,
	 updatedLabel,existingLabel,
	function(result, event) {
	  if(event.type === 'exception') {
		//console.log("exception");
		//console.log(event);
	  } else if (event.status) {
		//console.log(result);

		if(result == 'Success') {
			window.location.reload();
		} else {
		  alert(result);
		}
	  } else {
		//console.log(event.message);
	  }
	}
  );
  alert(showCustomLabelSetupIcon_langCode);
}