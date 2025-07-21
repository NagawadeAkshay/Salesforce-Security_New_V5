var j$ = jQuery.noConflict();
j$(document).ready(function(){
	adjustChevronWidth();	
	Visualforce.remoting.Manager.invokeAction(
		_RemotingApprovalProcessChevronActions.generateApprovalSteps, 
		recordId,
		function(result, event) {
			if(event.type === 'exception') {
				//console.log("The following exception has occured: " +  event);
			}
			else if (event.status) {
				//console.log('approval chevron result:<<<', result);
				if(result != null) {
					drawChevron(result);
				}
				else{
					//console.log("No Record Available");
				}
			}
		}
	);
});

function adjustChevronWidth(){
	j$("ul.chevron").each(function(){
		j$(this).attr("data-chevron-steps", j$(this).children("li").length);
	});
}

function drawChevron(result) {
	//console.log('result:<<<', result);
	var chevronStr = "<ul class=\"chevron\">";
	result.forEach( function (obj) {
		if(obj.color === 0){
			chevronStr += "<li><a class=\"pending\">" + obj.label + "<i class=\"fa fa-minus\"></i></a></li>";
		}
		else if(obj.color === 1) {
			chevronStr += "<li><a class=\"approved\">" + obj.label + "<i class=\"fa fa-check\"></i></a></li>";
		}
		else if(obj.color === 2) {
			chevronStr += "<li><a class=\"rejected\">" + obj.label + "<i class=\"fa fa-times\"></i></a></li>";
		}
	});
	chevronStr += "</ul>";
	chevronStr += "<ul class=\"chevron\">";
	result.forEach( function (obj) {
		if(obj.color === 0){ 
			chevronStr += "<li><a class=\"actor\">";
			if(typeof obj.actorName != 'undefined'){
				chevronStr += "<span>" + obj.actorName + "</span>";
			}else
				chevronStr += "<span class='hidden508'>N/A</span>";
			chevronStr += "</a></li>";
		}
		else if(obj.color === 1) {
			chevronStr += "<li><a class=\"actor\">";
			if(typeof obj.actorName != 'undefined'){
				chevronStr += "<span>" + obj.actorName + "</span>";
			}else
				chevronStr += "<span class='hidden508'>N/A</span>";
			chevronStr += "</a></li>";
		}
		else if(obj.color === 2) {
			chevronStr += "<li><a class=\"actor\">";
			if(typeof obj.actorName != 'undefined'){
				chevronStr += "<span>" + obj.actorName + "</span>";
			}else
				chevronStr += "<span class='hidden508'>N/A</span>";
			chevronStr += "</a></li>";
		}
	});
	chevronStr += "</ul>";
	//console.log('chevronStr:<<<', chevronStr);
	j$("#chevronBarId").html(chevronStr);
	adjustChevronWidth();
}