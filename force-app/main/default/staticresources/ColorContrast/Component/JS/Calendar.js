var j$ = jQuery.noConflict();
var tooltipContent;
var elementContent;
var tooltipContainer = {};
//var tooltipContainer = [][];
var objCollection = [];
var objColorCollection = {};
var checkSpanExist ={};
var color = ['#76cda1','#ef8279','#71b6e6','#f7da67','#808000','#50D0D0','#F4A460','#FFB6C1','#D3D3D3','#E0FFFF','#D8BFD8'];
var legendSpan = '';
function initCalendar(result,event){
	evt = result;
	j$('#calendar').fullCalendar({ // html element and library name
		buttonText: {
		today:    'Today',
		month:    'Month',
		week:     'Week',
		day:      'Day'
		},
		header: {
			left: 'prev,next',
			center: 'title',
			right: 'month,agendaWeek,agendaDay'
		},
		allDayText: 'All Day',
		eventLimit: {
			'agenda': 3, // adjust to 6 only for agendaWeek/agendaDay
			'month': 3, // adjust to 4 only for months

		},
		editable: false,
		ignoreTimezone:false,
		selectable: true,
		allDay: true,
		eventTextColor: '#000000',
		weekMode: 'fixed',
		slotEventOverlap:false,
		selectHelper: true,
		timeFormat: 'h:mm' ,
		select: function(date, start, end, allDay) {
			var eventDate = date.format();
			j$('#createEventModal #eventDate').val(eventDate);
			j$('#createEventModal').modal('show');
		},
		droppable: true,
		events: evt,
		eventClick: function(eventData, event, view) {
			event.preventDefault();
			   /* if(tooltipContainer[eventData.elementId] == undefined){
					//console.log('@@@ undefined loop--',tooltipContainer[eventData.elementId]);
					showToolTip(eventData, event, view, j$(this));
				}else if(tooltipContainer[eventData.elementId] == true){
					//console.log('@@@ defined loop--',tooltipContainer[eventData.elementId]);
					j$(this).tooltipster('show');
				} */
				if((tooltipContainer[j$(this)] == undefined) && (tooltipContainer[eventData.elementId] == undefined)){
					showToolTip(eventData, event, view, j$(this));
				}else if((tooltipContainer[j$(this)] == true) && (tooltipContainer[eventData.elementId] == undefined)){
					showToolTip(eventData, event, view, j$(this));
				}
				else if((tooltipContainer[eventData.elementId] == true) && (tooltipContainer[j$(this)] == true)){
					j$(this).tooltipster('show');
				}
				
			 
		}, // close of event click
		eventRender: function(event, element, view) {			
			setColorCoding(event, element, view);
		},
		viewRender: function (view, element) {
			tooltipContainer = {};
		},
		windowResize: function(view) {
		},
		eventMouseover: function(event, jsEvent, view) {
             j$(jsEvent.target).attr('title', event.title);
        },
        /*eventAfterRender: function(event, element, view){
		//console.log('view'+view);
		if (view.name == "agendaDay"){
				//console.log('viewDay'+view);
				var width = j$(element).width();
				//console.log('width -----'+width);
			   // width = (width / 4) * numEvents(event.start); // Where 4 is the maximum events allowed at that time.
			   //$(element).css('width', width + 'px');
			   //width = numEvents(event.start);
			   ////console.log('width_1 -----'+width);
			   j$(element).css('width', '100px');
		  }
		},*/
		/*viewDisplay: function(view) {
		//console.log('viewDisplay',view);    
		//parent.setIframeHeight(iframeActionModalIdViewLayout);
		}*/
	}); //close of full calendar
}

 /*to show event detail tooltip*/
function showToolTip(eventData,event,view,element){
	event.preventDefault();
	elementContent = element;	
	var tooltip = element.tooltipster({
			theme: 'tooltipster-shadow',
			content: 'Loading...',
			contentAsHTML: true,
			updateAnimation: false,
			multiple: true,
			position: 'right',
			contentAsHTML: true,
			minWidth: 300,
			autoClose: true,
			trigger:'click',
			functionInit: function(origin, content) {
			// when the request has finished loading, we will change the tooltip's content
			Visualforce.remoting.Manager.invokeAction(
			_RemotingCalendarActions.getLayout, eventData.id,
			function(result, event) {
				if (event.status) {
					//console.log('result', result);
					if(result.Tab != undefined){							
						tooltipContent = '<div class="container-fluid">'+'<div class="panel border-ext">';
						tooltipContent = getContent(result, origin, eventData.id,element);
						tooltipContent += '</div></div>';							
						origin.tooltipster('content', tooltipContent);
					}
					else{
						//origin.tooltipster('content', 'Sorry!!! Minipage layout is not configured. Please contact to administrator.');
						tooltipContent = '<div class="container-fluid">'+'<div class="panel border-ext">';
						tooltipContent = getContentMiniLayout(result, origin, eventData.id,element);
						tooltipContent += '</div></div>';							
						origin.tooltipster('content', tooltipContent);
					}
				}
			   });
		   },
	});	
	element.tooltipster('show');
	tooltipContainer[element] = true;
	tooltipContainer[eventData.elementId] = true;	
}

/*
	to add color code to events
*/
function setColorCoding(event, element,view){ 
	var todaysDate = new Date();
	var eventDate = new Date(event.start).toISOString().slice(0, 10);
	var todaysEvent = new Date(todaysDate).toISOString().slice(0, 10);
	if(event.objName != 'Task'){	
		for(var key in objColorCollection){	
			if(key == event.objLabel){				
				element.css('background-color',objColorCollection[key]);  
				if(checkSpanExist[event.objLabel] == undefined){
					legendSpan += '<span class="legend" style="background-color:'+objColorCollection[key]+';"></span><span class="leftSpan">'+ event.objLabel +'</span>';
					checkSpanExist[event.objLabel] = true;
				}
			}
		}
		document.getElementById("legendClass").innerHTML = legendSpan;
	}
	else{
		legendSpan = '';
		if(eventDate == todaysEvent && event.objFields.Status != 'Completed'){
			 element.css('background-color', '#f3cc2d');                 // yellow : todays event
		}
		else if((event.objFields.Status == 'Completed')) {
			element.css('background-color', '#76cda1');                 // green  : past events which are completed
		} else if (event.objFields.Status != 'Completed' && event.start < todaysDate) {
			element.css('background-color', '#ef8279');                 // red    : past events which are not completed
		} else if (event.objFields.Status != 'Completed' && event.start > todaysDate) {
			element.css('background-color', '#71b6e6');                 // blue    : future events
		} 
		legendSpan += '<span class="legend green"></span><span class="leftSpan">Completed</span><span class="legend red"></span><span class="leftSpan">Overdue</span><span class="legend blue"></span><span class="leftSpan">Upcoming</span><span class="legend yellow"></span><span class="leftSpan">Today’s</span>';
		document.getElementById("legendClass").innerHTML = legendSpan;
    }	
}

 /*
	method returns the events to be displayed on calendar 
*/
 function getEventData() {
	var param ={};
	param['configName']= configName;
	param['recordId']= recordId;	
	var date;
	//records are retrieved from soql database
	Visualforce.remoting.Manager.invokeAction(
		_RemotingCalendarActions.getEventData,param, // controller and method names
		function(result, event) {			
			for (var i = 0; i < result.length; i++) {
			var finalOffset = result[i].start + result[i].offset;
			var date = new Date(result[i].start + result[i].offset);
			//result[i].start = date;
			//console.log('@@@result[i].start',result[i].start);
			//console.log('@@@Date',date);
			//console.log('@@@finalOffset',finalOffset);
			result[i].elementId = (result[i].elementId).concat(i);
			if(result[i].objName != 'Task'){
			   objCollection.push(result[i].objLabel);
			}			
			}
			//console.log('@@@@ objCollection',objCollection);
			objCollection = uniques(objCollection);
			setObjColorCode(objCollection);
			//console.log('@@@@ objCollection222',objCollection);
			if (event.status) {
				initCalendar(result,event);
			} else if (event.type === 'exception') {
				//console.log(event.message);
			} else {
				//console.log(event.message);
			}
		}, {
			escape: false
		}); //close of eventData remote function
 } //close of getEventData() 

function uniques(arr) {
	var a = [];
	for (var i=0, l=arr.length; i<l; i++)
		if (a.indexOf(arr[i]) === -1 && arr[i] !== '')
			a.push(arr[i]);
	return a;
}


/*  to set random colr for object */
function setObjColorCode(objCollection) {	
	 for(i=0; i < objCollection.length ;i++){
		objColorCollection[objCollection[i]] = color[i];
	 }	 
}

/*fun to get number of events*/
function numEvents(date){
	totalEvents = j$('#calendar').fullCalendar('eventData').length;
	var count = 0;
	for (i = 0; i < totalEvents; i++){
		if (j$('#calendar').fullCalendar('eventData')[i].start.getTime() == date.getTime()){
			count++;
		}
	}
	return count;
}

function getMiniLayoutContent(result,origin){
		var tooltip = tooltipContent;
		//console.log('RESULT',result);
		var tab = result.Tab;
		var record = result.Record;                           
		j$.each(result.Tab, function(i, tabVal) { 
		  j$.each(tabVal.pageBlocks, function(j, pageBlockVal) {  
			  tooltip +='<p class="tooltip-title">'+record ['Name']+'</p>';   
			  tooltip +='<div id="TooltipBody" class="panel-body">';
			  tooltip +='<form class="form-horizontal" role="form">'
			  j$.each(pageBlockVal.fields, function(k, field) {   
					if(field.hideField != 'true')   {                     
						tooltip += '<div class="form-group border-ext ">';
						tooltip += ' <div class="row">';                                   
							tooltip += ' <div class="col-md-4 col-xs-4 col-sm-4">';
							tooltip += field.fieldLabel;
							tooltip += '</div>';
					  
							var fieldVal =  j$('<span/>').html(record [field.fieldAPIName]).text();  
							if(field.dataType == 'CURRENCY'){
								fieldVal = '$' + fieldVal;
							}
							//console.log('[-----',fieldVal );                                   
							tooltip += ' <div class="col-md-8 col-xs-8 col-sm-8" style="word-wrap:break-word; font-weight: bold;">';
							tooltip += decodeURI(fieldVal);     
							tooltip += '</div>';                                                                                     
						tooltip += '</div>';
						tooltip += '</div>';
						tooltip +='<br/>';
					}   
																		 
			  })
		  })
		})
		tooltip +='</form>';
		tooltip +='</div>';             
		return tooltip;
	}

 function getContentMiniLayout(result, origin, recordId,element) {
	var tooltip = tooltipContent;
	var record = result.Record;
	//console.log('getContentMiniLayout Called');	
	//console.log('If tab is null');
	//console.log('record id tab is null:' ,record);
	tooltip +='<p class="tooltip-title">'+record['Name']+'</p>';
	tooltip +='<div id="TooltipBody" class="panel-body">';
	tooltip +='<form class="form-horizontal" role="form">';
	tooltip += '<div class="form-group border-ext ">';
	tooltip += ' <div class="row">';                                   
	tooltip += ' <div class="col-md-4 col-xs-4 col-sm-4">';
	tooltip += 'Name';
	tooltip += '</div>';				
	tooltip += ' <div class="col-md-8 col-xs-8 col-sm-8" style="word-wrap:break-word; font-weight: bold;">';
	tooltip += record['Name'];     
	tooltip += '</div>';   
	tooltip += '</div>';
	tooltip += '</div>';
	tooltip +='</form>';
	tooltip += '</div>';
	//console.log('tooltip in else part: ',tooltip);
	return tooltip;
 }
/* to get content of tooltip */
 function getContent(result, origin, recordId,element) {
	var tooltip = tooltipContent;
	//console.log('@@element',element);
	//console.log('RESULT', result);
	var tab = result.Tab;
	var ActionURL = result.ActionURL;
	//console.log('tab ----', tab);
	//console.log('ActionURL  ----', ActionURL);
	var record = result.Record;
	//console.log('record -----', record);
	j$.each(result.Tab, function(i, tabVal) {
		j$.each(tabVal.pageBlocks, function(j, pageBlockVal) {
			if(pageBlockVal.title == undefined){
			tooltip += '<p class="tooltip-title"><b>Details</b>';
			}
			else{
			tooltip +='<p class="tooltip-title"><b>'+ pageBlockVal.title;    
			}
			j$.each(result.ActionURL, function(l, actionVal) {
				//tooltip += '</b><a href="#" class="pointer-base btnStyle btn btn-info btn-sm"  onclick="actionEventData(\'' + recordId + '\',\'' + actionVal.Name + '\')">';
				tooltip += '</b><a href="#" class="pointer-base btnStyle custombtn btn-info btn-sm"  onclick="actionEventData(\'' + recordId + '\',\'' + actionVal.Name + '\')">';
				var fieldVal = j$('<span/>').html(actionVal.Name).text();
				tooltip += decodeURI(fieldVal);
				tooltip += '</a>';
			});
		   
			tooltip += '<span class="close1 pointer-base">X</span></p>';
			 tooltip +='<div id="TooltipBody" class="panel-body">';
			tooltip +='<form class="form-horizontal" role="form">'
			j$.each(pageBlockVal.fields, function(k, field) {
				if (field.hideField != 'true') {
					tooltip += '<div class="form-group border-ext ">';
					tooltip += ' <div class="row">';                                   
					tooltip += ' <div class="col-md-4 col-xs-4 col-sm-4">';
					tooltip += field.fieldLabel;
					tooltip += '</div>';
					
					
					var fieldVal =  j$('<span/>').html(record [field.fieldAPIName]).text();  
					if (field.dataType == 'CURRENCY') {
							fieldVal = '$' + fieldVal;
					}
					//console.log('[-----', fieldVal);
					tooltip += ' <div class="col-md-8 col-xs-8 col-sm-8" style="word-wrap:break-word; font-weight: bold;">';
					tooltip += decodeURI(fieldVal);
					tooltip += '</div>';                                                                                     
					tooltip += '</div>';
					tooltip += '</div>';
					tooltip +='<br/>';
				}
			})
		})
	})
			//tooltip += '</div>';
	tooltip += '</form>';
	tooltip += '</div>';
	return tooltip;
};

j$(document).on('click', '.close1', function(event) {
	elementContent.tooltipster('hide');
 });


j$("#calendar").on("contextmenu",function(e){
		if (e.button === 2) {
			return false;    
		}
	});

j$(document).ready(function() {
	getEventData();
	j$('#calendar').fullCalendar('render');
	j$('button[data-toggle="tab"]').on('shown.bs.tab', function (e) {
		j$('#calendar').fullCalendar('render');
	});
	j$('#modalBody').on('shown.bs.modal', function (e) {
		j$("#calendar").fullCalendar('render');
	});  
});

/* update , delete, view action */
function actionEventData(recordId,actionName){
	//console.log('@@@RecordId',recordId);
	//console.log('@@@Name',actionName);  
	if(actionName == 'View'){
	   window.open('/apex/TaskReviewRedirect?id='+recordId); 
	}
	else{
		Visualforce.remoting.Manager.invokeAction(
		_RemotingCalendarActions.executeEventAction,recordId,actionName,
		function(result, event) {
		 elementContent.tooltipster('hide');
		 j$('#calendar').fullCalendar('removeEvents', recordId);
		});  
	}
};