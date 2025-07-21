var j$ = jQuery.noConflict();
j$(document).ready(function(){
	adjustProgressbarWidth();
	Visualforce.remoting.Manager.invokeAction(
		_RemotingStepProgressbarActions.fetchorderedList, 
		stepProgressbar_sObjectName, stepProgressbar_groupName, stepProgressbar_recordId,
		function(result, event) {
			if(event.type === 'exception') {
				//console.log("The following exception has occured: <<<" +  event);
			}
			else if (event.status) {
				if(result != null) {
					progressbar(result);
				}
				else{					
					j$('#legendsId').hide();
					j$('#progressBarId').hide();
				}
			}
		}
	);
});

function adjustProgressbarWidth(){
	j$("ol.progtrckr").each(function(){
		j$(this).attr("data-progtrckr-steps", j$(this).children("li").length);
	});
}

function progressbar(result) {
	try{		
		var completeClr = result['color'][0][stepProgressbar_nameSpace + 'CompleteColor__c'];
		var incompleteClr = result['color'][0][stepProgressbar_nameSpace + 'IncompleteColor__c'];
		var rejectClr = result['color'][0][stepProgressbar_nameSpace + 'RejectColor__c'];
		var showLegend = result['showLegend'][0];		
		var legendStr = '';
		if(showLegend == true) {
			legendStr += "<ul class=\"legends\">" + 
							/*
							"<fieldset>" +
							"<legend>Legends</legend>" +
							*/
								"<li><span style=\"background: " + incompleteClr + "\"></span>Incomplete</li>" +
								"<li><span style=\"background: " + completeClr + "\";></span>Complete</li>" + 
								"<li><span style=\"background: " + rejectClr + "\"></span>Reject</li>" +
							/*
							"</fieldset>" +
							*/
							"</ul>";
		}
		var progressBarStr = "<ol class=\"progtrckr\" style=\"padding-left: 0px\";>";
		result['resultList'].forEach( function (obj) {
			if(obj.clrCode === 0){
				progressBarStr += "<li class=\"progtrckr-todo\"><div class=\"mask-before-todo\"></div><div class=\"mask-after-todo\"></div>" + obj.displayName + "<span id="+ obj.displayName +" class=\"hidden508 skipNavSectionItem\">" + obj.displayName + "</span></li>"
			}
			else if(obj.clrCode === 1){
				progressBarStr += "<li class=\"progtrckr-done\"><div class=\"mask-before-done\"></div><div class=\"mask-after-done\"></div>" + obj.displayName + "<span id="+ obj.displayName +" class=\"hidden508 skipNavSectionItem\">" + obj.displayName + "</span></li>"
			}
			
			else if(obj.clrCode === 2){
				progressBarStr += "<li class=\"progtrckr-done\"><div class=\"mask-before-done\"></div><div class=\"mask-after-done\"></div>" + obj.displayName + "<span id="+ obj.displayName +" class=\"hidden508 skipNavSectionItem\">" + obj.displayName + "</span></li>"
			}
			else if(obj.clrCode === 3) {
				progressBarStr += "<li class=\"progtrckr-reject\"><div class=\"mask-before-reject\"></div><div class=\"mask-after-todo\"></div>" + obj.displayName + "<span id="+ obj.displayName +" class=\"hidden508 skipNavSectionItem\">" + obj.displayName + "</span></li>"
			}
		});
		progressBarStr += "</ol>";
		//console.log(legendStr);
		//console.log(progressBarStr);
		j$("#legendsId").html(legendStr);
		j$("#progressBarId").html(progressBarStr);
		adjustProgressbarWidth();
		setColor(incompleteClr, completeClr, rejectClr);
	}
	catch(e){
		//console.log(e);
	}           
}

function setColor(incompleteClr, completeClr, rejectClr) {
	j$("ol.progtrckr li.progtrckr-done").css("color", completeClr);
	j$("ol.progtrckr li.progtrckr-todo").css("color", incompleteClr);
	j$("ol.progtrckr li.progtrckr-reject").css("color", rejectClr);
	
	j$("head").append("<style>ol.progtrckr li.progtrckr-todo:before{color:" + incompleteClr + ";}</style>");
	j$("head").append("<style>ol.progtrckr li.progtrckr-done:before{background-color:" + completeClr + ";}</style>");
	j$("head").append("<style>ol.progtrckr li.progtrckr-reject:before{background-color:" + rejectClr + ";}</style>");
	
	j$("ol.progtrckr li > .mask-before-todo").css("background-color", incompleteClr);
	j$("ol.progtrckr li > .mask-before-done").css("background-color", completeClr);
	j$("ol.progtrckr li > .mask-before-reject").css("background-color", rejectClr);
	
	j$("ol.progtrckr li > .mask-after-todo").css("background-color", incompleteClr);
	j$("ol.progtrckr li > .mask-after-done").css("background-color", completeClr);
	j$("ol.progtrckr li > .mask-after-reject").css("background-color", rejectClr);
	
	//j$("ol.progtrckr li:last-child > .mask-after-todo").css("background-color", "#fff");
	//j$("ol.progtrckr li:last-child > .mask-after-done").css("background-color", "#fff");
	//j$("ol.progtrckr li:last-child > .mask-after-reject").css("background-color", "#fff");
	
	//j$("ol.progtrckr li:first-child > .mask-before-todo").css("background-color", "#fff");
	//j$("ol.progtrckr li:first-child > .mask-before-done").css("background-color", "#fff");
	//j$("ol.progtrckr li:first-child > .mask-before-reject").css("background-color", "#fff");
	
	j$("ol.progtrckr li:last-child > .mask-after-todo").css("background-color", "inherit");
	j$("ol.progtrckr li:last-child > .mask-after-done").css("background-color", "inherit");
	j$("ol.progtrckr li:last-child > .mask-after-reject").css("background-color", "inherit");
	
	j$("ol.progtrckr li:first-child > .mask-before-todo").css("background-color", "inherit");
	j$("ol.progtrckr li:first-child > .mask-before-done").css("background-color", "inherit");
	j$("ol.progtrckr li:first-child > .mask-before-reject").css("background-color", "inherit");
}       