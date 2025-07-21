var j$ = jQuery.noConflict();
j$(document).ready(function(){
	adjustProgressbarWidth();

});

function adjustProgressbarWidth(){
	j$("ol.progtrckr").each(function(){
		j$(this).attr("data-progtrckr-steps", j$(this).children("li").length);
	});
}
function toUTCDate(date){
	var _utc = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(),  date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
	return _utc;
}
function progressbar(result) {
	try{		
		var completeClr = result['color'][0][stepProgressbar_nameSpace + 'CompleteColor__c'];
		var incompleteClr = result['color'][0][stepProgressbar_nameSpace + 'IncompleteColor__c'];
		var rejectClr = result['color'][0][stepProgressbar_nameSpace + 'RejectColor__c'];
		var showLegend = result['showLegend'][0];		
		var legendStr = '';
		var currentStatusValue = result['currentStatus'][0];
		
		/*for history of status field  : AJ*/
		var htmlString = '';
		var username;
		var mydate;
		var result_str = JSON.stringify(result['history']);
		//console.log('===> history '+result_str); // Logs output to dev tools console.
		
		/*********************/
		
		if(showLegend == true) {
			legendStr += "<ul class=\"legends\">" + 
								"<li><span style=\"background: " + incompleteClr + "\"></span>Incomplete</li>" +
								"<li><span style=\"background: " + completeClr + "\";></span>Complete</li>" + 
								"<li><span style=\"background: " + rejectClr + "\"></span>Reject</li>" +
							"</ul>";
		}
		var progressBarStr = '<ol class="progtrckr ';
			progressBarStr += enhancedProgressBarEnabled ? 'progressBar">' : '">';

		result['resultList'].forEach( function (obj) {
			var result_str1 = JSON.stringify(result['history'][0][obj.displayName]);
			//console.log('===> result_str1 '+result_str1);	
			if(result_str1 != undefined){
				username = result['history'][0][obj.displayName]['CreatedBy'];
				username = trustSrcHTML(username.toLocaleString());
				var dateoffset = result['history'][0][obj.displayName]['CreatedDate'];
				dateoffset = dateoffset + stepProgressbar_timeOffset;
				mydate = new Date(dateoffset);
				var dateByUTC = new Date(mydate.getUTCFullYear(), mydate.getUTCMonth(), mydate.getUTCDate(),  mydate.getUTCHours(), mydate.getUTCMinutes(), mydate.getUTCSeconds());
				var hours = dateByUTC.getHours();
				var minutes = dateByUTC.getMinutes();
				if (minutes < 10) {
					minutes = "0" + minutes;
				}
				var suffix = "AM";
				if (hours >= 12) {
					suffix = "PM";
					hours = hours - 12;
				}
				if (hours == 0) {
					hours = 12;
				}

				var timeString = hours + ":" + minutes + " " + suffix;
				mydate = mydate.toLocaleDateString().slice(0, 10);
				htmlString = 'By : '+ username + '<br />Date : '+mydate + ' ' +timeString;
			}else{
				
			}
			if(obj.clrCode === 0){
				progressBarStr += "<li class=\"progtrckr-todo\"><div class=\"mask-before-todo\"></div><div class=\"mask-after-todo\"></div><span class=\"progressStatusText\">" + obj.displayName + "</span><span id="+ obj.displayName +" class=\"hidden508 skipNavSectionItem\">" + obj.displayName + "</span></li>";
			}

			else if(obj.clrCode === 1){				
				progressBarStr += "<li class=\"progtrckr-done\"><div class=\"mask-before-done\"></div><div class=\"mask-after-done\"></div><span  tabIndex=\"0\" id = "+ obj.displayName.replaceAll(' ','') + obj.sequence +" onmouseover=\"showHelpTooltip1('" + htmlString +"',\'tooltipster-noir\',this.id);\" onfocus=\"showHelpTooltip1('" + htmlString +"',\'tooltipster-noir\',this.id);\" onblur=\"hideHelpTooltip1('" + htmlString +"',\'tooltipster-noir\',this.id);\"><span class=\"progressStatusText\">" + obj.displayName + "</span><span id="+ obj.displayName +" class=\"hidden508 skipNavSectionItem\">" + htmlString + "</span></span></li>";
				
			}
			
			else if(obj.clrCode === 2){
				progressBarStr += "<li class=\"progtrckr-done\"><div class=\"mask-before-done\"></div><div class=\"mask-after-done\"></div><span tabIndex=\"0\" id = "+ obj.displayName.replaceAll(' ','') + obj.sequence +"  onmouseover=\"showHelpTooltip1('" + htmlString +"',\'tooltipster-noir\',this.id);\" onfocus=\"showHelpTooltip1('" + htmlString +"',\'tooltipster-noir\',this.id);\" onblur=\"hideHelpTooltip1('" + htmlString +"',\'tooltipster-noir\',this.id);\"><span class=\"progressStatusText\">" + obj.displayName + "</span><span id="+ obj.displayName +" class=\"hidden508 skipNavSectionItem\">" + htmlString + "</span></span></li>";
			}
			else if(obj.clrCode === 3) {
				progressBarStr += "<li class=\"progtrckr-reject\"><div class=\"mask-before-reject\"></div><div class=\"mask-after-todo\"></div><span class=\"progressStatusText\">" + obj.displayName + "</span><span id="+ obj.displayName.replaceAll(' ','') +" class=\"hidden508 skipNavSectionItem\">" + obj.displayName + "</span></li>";
			}
		});
		progressBarStr += "</ol>";
		j$("#legendsId").html(legendStr);
		j$("#progressBarId").html(progressBarStr);		
		j$("#Step_ProgressBar_CurrentStatus")[0].textContent = 'Current progress: '+currentStatusValue;		
		adjustProgressbarWidth();
		setColor(incompleteClr, completeClr, rejectClr);
	}
	catch(e){
		//console.log(e);
	}           
}

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement); //False +ve for non literal regex used for sanitization, as we are not using for sanitization purpose
};

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
	
	j$("ol.progtrckr li:last-child > .mask-after-todo").css("background-color", "inherit");
	j$("ol.progtrckr li:last-child > .mask-after-done").css("background-color", "inherit");
	j$("ol.progtrckr li:last-child > .mask-after-reject").css("background-color", "inherit");
	
	j$("ol.progtrckr li:first-child > .mask-before-todo").css("background-color", "inherit");
	j$("ol.progtrckr li:first-child > .mask-before-done").css("background-color", "inherit");
	j$("ol.progtrckr li:first-child > .mask-before-reject").css("background-color", "inherit");
}

function showHelpTooltip1(thisVal,thm,id) {		                  
	//console.log('===>thisVal '+id);
	if(thisVal != ''){  
	j$('#'+id).tooltipster({ 
		 theme: thm,                     
		 multiple: true,
		 position : 'right',
		 animation :'fade',          
		 contentAsHTML: true, 
		 offset: {
	            // this is the distance between the bottom side of the origin and the top of the document
	            bottom: 0,
	            left: 0,
	            // this is the distance between the right side of the origin and the left of the document
	            right: 0,
	            top: 0
	        },
		 content : '<span>'+trustSrcHTML(thisVal)+'</span>'
	 });    
	  j$('#'+id).tooltipster('show');
	}
}
function hideHelpTooltip1(thisVal,thm,id) {
	j$('#'+id).tooltipster('hide');
	
}

function trustSrcHTML(src) {
	if(src?.includes("<meta")){
		if(src.includes("no-referrer")){
			src = src.replaceAll("no-referrer", "origin");
			src = src.replaceAll("<", "&lt;");
			src = src.replaceAll(">", "&gt;");
		}			
	}
	return  DOMPurify.sanitize(src);
}