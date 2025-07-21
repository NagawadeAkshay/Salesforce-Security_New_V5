var j$ = jQuery.noConflict();
jQuery(".dropbtn").click(function() {
	jQuery(".bottomMenu-body").slideToggle(300);
	 j$(this).find('i').toggleClass('fa fa-chevron-up fa fa-chevron-down')
});
		
j$("#setupClick").click(function() {
	var adminFlag = j$(this).text();
	if (adminFlag == 'Enable GovGrants Setup') {
		createCookie();
		j$(this).text('Refreshing Page...');
		document.body.style.cursor = 'wait';
		document.getElementById('setupClick').style.cursor = 'wait';
		window.location.reload();
	} else if (adminFlag == 'Disable GovGrants Setup') {
		var result = deleteCookie();
		if (result == true) {
			j$(this).text('Refreshing Page...');
			document.body.style.cursor = 'wait';
			document.getElementById('setupClick').style.cursor = 'wait';
			window.location.reload();
		}
	}
});

function getGGSystemAlerts() {
	Visualforce.remoting.Manager.invokeAction(
		_RemotingStickyBottomMenuActions.getSystemAlerts, function(result, event) {
			var result_str = JSON.stringify(result);
			var alert_message = JSON.stringify(result[	"helpList"]);
			var help_text = JSON.stringify(result["helpList"][0][namespace + "HelpText__c"]);
			var help_content = JSON.stringify(result["helpList"][0][namespace + "HelpContent__c"]);
			if(help_text != undefined)
				help_text = help_text.replace(/^"(.+(?="$))"$/, '$1');
			if(help_content != undefined)
				help_content = help_content.replace(/^"(.+(?="$))"$/, '$1');
			if(help_content != undefined && help_text != undefined){
				document.getElementById('alerts').textContent = "<span style = 'float:left' >" + help_text + "</span><br /><span style = 'float:left' >" + help_content + "</span>";
			}else if(help_content != undefined && help_text == undefined){
				document.getElementById('alerts').textContent = "<span style = 'float:left' >" + help_content + "</span>";
			}else if(help_content == undefined && help_text != undefined){
				document.getElementById('alerts').textContent = "<span style = 'float:left' >" + help_text + "</span>";
			}else{
				document.getElementById('alerts').textContent = "<span style = 'float:left' >No data to display</span>";
			}
			if (event.status) {
			} else if (event.type === 'exception') {
				log.info('Error while getting system alert');
			}

		}, {
			escape: false
		}
	);
	
	j$('#systenAlertDivBox').modal();
}
function createCookie() {
	j$.cookie('setup', 'present', {
		path: '/'
	});
	return true;
}

function deleteCookie() {
	j$.removeCookie('setup', {
		path: '/'
	});
	return true;
}
j$(document).ready(function() {
	changeLabel();
})

function changeLabel() {
	var text = j$("#setupClick").text();
	if (j$.cookie('setup') == 'present') {
		j$("#setupClick").text("Disable GovGrants Setup");
	} else if (j$.cookie('setup') != 'present') {
		j$("#setupClick").text("Enable GovGrants Setup");
	}
}

var submitSuccess = '<div id="feedback-submit-success"><div class="feedback-logo">Feedback</div><p>Thank you for your feedback. We value every piece of feedback we receive.</p><p>We cannot respond individually to every one, but we will use your comments as we strive to improve your experience.</p><button class="feedback-close-btn feedback-btn-blue">OK</button><div class="feedback-wizard-close"></div></div>';
var submitError = '<div id="feedback-submit-error"><div class="feedback-logo">Feedback</div><p>Sadly an error occured while sending your feedback. Please try again.</p><button class="feedback-close-btn feedback-btn-blue">OK</button><div class="feedback-wizard-close"></div></div>';

function sendData(data) {
	var str=data;
	var chunks=[];
	var chunksize=100000;

	while(str){
		if(str.length<chunksize){
			chunks.push(str);
			break;
			//console.log('chunk1');
			//console.log('str1',str);

		}
		else{
			chunks.push(str.substr(0,chunksize));
			str=str.substr(chunksize);
			//console.log('chunk2');
			//console.log('chunk21',chunks);
			//console.log('chunklenghtg1',chunks.length);
			//console.log('str',str);
		}
	}
	sendData1(chunks,0,'');
	
			
}
function sendData1(chunks, positionIndex, ParentId ) {
	var isFirst=false;
	var isFinal=false;
	if(positionIndex==0){
		isFirst=true;
	}
	
	
	if(positionIndex==chunks.length-1){
		isFinal=true;
	}
	

	if(positionIndex < chunks.length){
		//console.log('senddata1');
	Visualforce.remoting.Manager.invokeAction(
			_RemotingStickyBottomMenuActions.getImageData,
			chunks[positionIndex],isFirst,isFinal,ParentId,
			function(sideBarMenuResult, event) {
				j$('#dvLoading').hide();			
				if (event.status) {
					if(isFinal==true){
						j$('#feedback-module').append(submitSuccess);
					}
					sendData1(chunks,positionIndex+1,sideBarMenuResult);
				} else if (event.type === 'exception') {
					j$('#feedback-module').append(submitError);
				}
	
			}, {
				escape: false
			}
		);
	}
	
}

