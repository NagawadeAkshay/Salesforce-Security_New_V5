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

j$.feedback({
	html2canvasURL: stickyBottomMenu_html2canvas
});

var submitSuccess = '<div id="feedback-submit-success"><div class="feedback-logo">Feedback</div><p>Thank you for your feedback. We value every piece of feedback we receive.</p><p>We cannot respond individually to every one, but we will use your comments as we strive to improve your experience.</p><button class="feedback-close-btn feedback-btn-blue">OK</button><div class="feedback-wizard-close"></div></div>';
var submitError = '<div id="feedback-submit-error"><div class="feedback-logo">Feedback</div><p>Sadly an error occured while sending your feedback. Please try again.</p><button class="feedback-close-btn feedback-btn-blue">OK</button><div class="feedback-wizard-close"></div></div>';

function sendData(data) {
	j$('#dvLoading').show();	
	Visualforce.remoting.Manager.invokeAction(
		_RemotingStickyBottomMenuActions.getImageData,
		data,
		function(sideBarMenuResult, event) {
			j$('#dvLoading').hide();			
			if (event.status) {
				j$('#feedback-module').append(submitSuccess);
			} else if (event.type === 'exception') {
				j$('#feedback-module').append(submitError);
			}

		}, {
			escape: false
		}
	);
}