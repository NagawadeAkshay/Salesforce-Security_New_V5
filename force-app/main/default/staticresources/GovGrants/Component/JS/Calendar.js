var j$ = jQuery.noConflict();
var tooltipContent;
var elementContent;
var tooltipContainer = {};
var objCollection = [];
var colorCodes = [];
var objColorCollection = {};
var checkSpanExist ={};
var color = ['#76cda1','#ef8279','#71b6e6','#f7da67','#808000','#50D0D0','#F4A460','#FFB6C1','#D3D3D3','#E0FFFF','#D8BFD8'];
var legendSpan = '';

function getFieldValue(sobj, fldName) {

	if(fldName == null || fldName == undefined)
		return '';
	var value = undefined;
	if(fldName.indexOf('.') != -1) {
		var relationsArray = fldName.split('.');
		var i = 0, temp = undefined;
		for(i = 0; i < relationsArray.length-1; i++){
			var singleField = relationsArray[i];                                                 
            if(temp == undefined || temp == null){
                temp = sobj[singleField];
            }
            if(temp == undefined || temp == null) {
            	return '';
            }   
        } 
        if(temp != null && temp != undefined && temp[relationsArray[i]] != undefined){
            value = temp[relationsArray[i]];
        }

	} else {
		value = sobj[fldName];
	}
	if(value == null || value == undefined)
		value = '';
	return value;
}

function replaceMergeField(stringToReplace, SObj, mergeField){
	//var fieldName = mergeField.replace('{!','').replace('}','');
	var value = getFieldValue(SObj, mergeField[1]);
	stringToReplace = stringToReplace.replace(mergeField[0], value);
	return stringToReplace;
}

function extractAndReplaceMergeFields(stringToReplace, sobject) {
	if(stringToReplace == null || stringToReplace == undefined)
		return stringToReplace;

	var mergeFieldRegex = /\{!(.*?)\}/g;
	var match = null;

	match = mergeFieldRegex.exec(stringToReplace);
	while (match != null) {
		stringToReplace = replaceMergeField(stringToReplace, sobject, match);
	  	match = mergeFieldRegex.exec(stringToReplace);
	}
	return stringToReplace;
}

function initCalendar(result,event){
	evt = result;
	var width = j$(window).width();
	var height = j$(window).height();
	var windowX = window.scrollX;
	var windowY = window.scrollY;
    j$('#calendar').fullCalendar({ // html element and library name
		buttonText: {
		today:    'Today',
		month:    'Month',
		week:     'Week',
		day:      'Day'
		},
		header: {
			left: 'today', 
			center: 'prev,   ,title,   ,next',
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
		eventMouseover: function(eventData, event, view) {
			event.preventDefault();
				if((tooltipContainer[j$(this)] == undefined) && (tooltipContainer[eventData.elementId] == undefined)){
					showToolTip(eventData, event, view, j$(this),width,height);
				}else if((tooltipContainer[j$(this)] == true) && (tooltipContainer[eventData.elementId] == undefined)){
					showToolTip(eventData, event, view, j$(this),width,height);
				}
				else if((tooltipContainer[eventData.elementId] == true) && (tooltipContainer[j$(this)] == true)){
					j$(this).tooltipster('show');
				}
				
			 
		},
		eventMouseout: function(eventData, event, view){
			j$(this).tooltipster('hide');
		}
		, // close of event click
		eventRender: function(event, element, view) {			
			setColorCoding(event, element, view);
		},
		viewRender: function (view, element) {
			tooltipContainer = {};
		},
		windowResize: function(view) {
		},
		eventClick: function(event, originEvent) {
			originEvent.preventDefault();

			j$('.calendarEvent').remove();

			if(event.url != undefined && event.url) {
				event.url = extractAndReplaceMergeFields(event.url, event.eventSobject);
				switch(event.eventViewBehaviour) {
					case "Open in overlay" : {
	            		j$('#calendarEventiframeContentId').attr('src', event.url);
	            		j$('#calendarEventModalDiv').modal();
					} break;				
					case "Open in new window" : {
						window.open(event.url);
					} break;
					default: {
						//window.open(event.url);
						if(event.ActivityDate != undefined){
							//let startDate = new Date(event.ActivityDate + (new Date().getTimezoneOffset() * 60000)+ timeOffset).dateFormat("m/d/Y h:i"); User Story 152761: Internal : Calendar issues (Outlook Export)
							let offset;
							if(new Date().getTimezoneOffset() > 0){
                              offset = event.ActivityDate + new Date().getTimezoneOffset() * 60000;
                            }else{
                                offset = event.ActivityDate - new Date().getTimezoneOffset() * 60000;
                            }
							let startDate = new Date(offset).dateFormat("m/d/Y h:i");
							event.Description = event.Description != undefined ? event.Description : '';	
							event.Subject = event.Subject != undefined ? event.Subject : '';
							var taskJson = {"_start":startDate, "_end":"", "_summary":event.Subject, "_description":event.Description, "_location":"", "_organizer":event.OwnerName, "_organizer_email":event.OwnerEmail, "_all_day_event":event._allDay,"_date_format":"MM/DD/YYYY"}				
					j$(this).parents('#calendar').append('<div class="calendarEvent"><a href="#" title="Add to Calendar" class="addeventatc">'+
						'<span class="_start">'+taskJson._start+'</span>'+
						'<span class="_end"></span>'+
						'<span class="_zonecode">'+15+'</span>'+
						'<span class="_summary">'+taskJson._summary+'</span>'+
						'<span class="_description">'+taskJson._description+'</span>'+
						'<span class="_location">'+taskJson._location+'</span>'+
						'<span class="_organizer">'+taskJson._organizer+'</span>'+
						'<span class="_organizer_email">'+taskJson._organizer_email+'</span>'+
						'<span class="_all_day_event">'+taskJson._all_day_event+'</span>'+
						'<span class="_date_format">'+taskJson._date_format+'</span>'+
					'</a></div>');
						
					addeventatc.refresh();
	
							if(j$(this).parents('.fc-more-popover').length > 0 && clicked == true) {
							} else {
								clicked = false;
							}
							j$('.calendarEvent').find('.addeventatc').trigger('click');
							var myid = j$('.calendarEvent').find('.addeventatc_dropdown').prop('id');
							j$('#'+myid).css({"left": originEvent.clientX+'px', "top": originEvent.clientY+'px'});
							j$('#'+myid).append('<a href="'+event.url+'" target="_blank" class="taskViewOption"><i class="fa fa-eye"></i>View</a>');
						}else{
							window.open(event.url);
						}
					} break;
				}
			}
			
			j$(".taskViewOption").on('click', function(e) {
				//alert('hi')
				e.stopPropagation()
			})

			j$(document).mouseup(function (e) {
				var container = j$(".fc-event"); // YOUR CONTAINER SELECTOR
				var container1 = j$(".addeventatc_dropdown");
				if (container1.is(e.target)) // if the target of the click isn't the container...  // ... nor a descendant of the container
				{
					setTimeout(function(){ 
						j$('.calendarEvent').remove();
						// j$('.addthisevent').remove();
						// j$('.addthisevent-drop').remove();
						// j$('.addthisevent_dropdown').remove();
					}, 1000);
					
				}
				else if (!container.is(e.target) // if the target of the click isn't the container...
					&& container.has(e.target).length === 0) // ... nor a descendant of the container
				{
					setTimeout(function(){ 
						j$('.calendarEvent').remove();
					}, 500);
					
				}
			});
		}
	}); //close of full calendar
}


var clicked = false;
j$(document).on('click', '.fc-more', function(){
	clicked = true;
});


 /*to show event detail tooltip*/
function showToolTip(eventData,event,view,element,width,height){

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
			minWidth: width/13,
			autoClose: true,
			trigger:'click',
			functionInit: function(origin, content) {
			// when the request has finished loading, we will change the tooltip's content
			Visualforce.remoting.Manager.invokeAction(
			_RemotingCalendarActions.getLayout, eventData.id,
			function(result, event) {
				//console.log("in else result=="+result);
				if (event.status) {
					
					if(!jQuery.isEmptyObject(result)){
						tooltipContent =  '<div class="tooltipWrapper" >';
						tooltipContent = structureMiniLayout(result,origin,tooltipContent);
						tooltipContent +='</div>';									
						origin.tooltipster('content', tooltipContent );	
					}else{
						j$('#'+thisVal.id).tooltipster('hide');								
					}					
					
				}
			   });
		   },
	});	
	element.tooltipster('show');
	var left = j$('.tooltipster-base').position().left;
	var top = j$('.tooltipster-base').position().top;
//	console.log('-- left -- ' + left + ' -- top -- ' + top);
	var bottom = top + j$('.tooltipster-base').outerHeight();
	var right = left + j$('.tooltipster-base').outerWidth();
//	console.log('-- bottom -- ' + bottom + ' -- right --' + right);
//	console.log('-- width -- ' + width + ' -- height --' + height);
	if ((right > (width - 100)) || (bottom > (height - 100))) {
	//	console.log('In top');
		element.tooltipster('hide');
		var str = JSON.stringify(tooltip);
		str = JSON.stringify(tooltip, null, 4); // (Optional) beautiful indented
												// output.
		element.tooltipster('destroy');
		var tooltip1 = element
				.tooltipster({
					theme : 'tooltipster-shadow',
					content : 'Loading...',
					contentAsHTML : true,
					updateAnimation : false,
					multiple : true,
					position : 'top',
					contentAsHTML : true,
					minWidth : width / 13,
					autoClose : true,
					trigger : 'click',
					functionInit : function(origin, content) {
						// when the request has finished loading, we will change
						// the tooltip's content
						Visualforce.remoting.Manager
								.invokeAction(
										_RemotingCalendarActions.getLayout,
										eventData.id,
										function(result, event) {
											if (event.status) {

												if(!jQuery.isEmptyObject(result)){
													tooltipContent =  '<div class="tooltipWrapper" >';
													tooltipContent = structureMiniLayout(result,origin,tooltipContent);
													tooltipContent +='</div>';	
													origin.tooltipster('content', tooltipContent );	
												}else{
													j$('#'+thisVal.id).tooltipster('hide');								
												}
												
											}
										});

					},
				});
	}
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
	element.css('background-color',event.colorCode);  
		for(var key in objColorCollection){	
			//console(key+"======"+objColorCollection[key]);
			if(key == event.objLabel){				
				
				if(checkSpanExist[event.objLabel] == undefined){
					legendSpan += '<span class="legend" style="background-color:'+objColorCollection[key]+';"></span><span class="leftSpan">'+ event.objLabel +'</span>';
					checkSpanExist[event.objLabel] = true;
				}
			}
		}
		document.getElementById("legendClass").textContent = legendSpan;
	}

 /*
	method returns the events to be displayed on calendar 
*/
 function getCalendarEvents() {
	var param ={};
	param['configNames']= configNames;
	param['recordId']= escape(recordId);	
	param['keyValueMap'] = CalkeyValueMap;
	var date;
	//records are retrieved from soql database
	Visualforce.remoting.Manager.invokeAction(
		_RemotingCalendarActions.getCalendarEvents,param, // controller and method names
		function(result, event) {			

				var tempObjLabel= new Map();		
			for (var i = 0; i < result.length; i++) {
				//console.log('===> i :'+i);
			var finalOffset = result[i].start + result[i].offset;
			var date = new Date(result[i].start + result[i].offset);
				var colorCode = result[i].colorCode;
				//console.log('@@@result[i].colorCode',colorCode);
				
			result[i].elementId = (result[i].elementId).concat(i);
				
				if(result[i].objLabel != tempObjLabel.get(result[i].objLabel) ){
			   objCollection.push(result[i].objLabel);
					colorCodes.push(result[i].colorCode);
					//tempObjLabel=result[i].objLabel;
					tempObjLabel.set(result[i].objLabel,result[i].objLabel);
					
			}			

			}
			setObjColorCode(objCollection,colorCodes);
			if (event.status) {
				initCalendar(result,event);
			} else if (event.type === 'exception') {
				//console.log(event.message);
			} else {
				//console.log(event.message);
			}
		}, {
			escape: false
		}); 
		//close of eventData remote function

 } //close of getEventData() 

function uniques(arr) {
	var a = [];
	//console.log('===> arr : ',JSON.stringify(arr));
	for (var i=0, l=arr.length; i<l; i++){
		if (a.indexOf(arr[i]) === -1 && arr[i] !== '')
			a.push(arr[i]);
	}
	return a;
}


/*  to set random colr for object */
function setObjColorCode(objCollection,colorCode) {	
	for(i=0; i < objCollection.length ;i++){
		objColorCollection[objCollection[i]] = colorCode[i];
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
j$(document).on('click', '.close1', function(event) {
	elementContent.tooltipster('hide');
 });


j$("#calendar").on("contextmenu",function(e){
		if (e.button === 2) {
			return false;    
		}
	});

j$(document).ready(function() {
	getCalendarEvents();
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