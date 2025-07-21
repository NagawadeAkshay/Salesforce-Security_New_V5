var profiles = [];
var j$ = jQuery.noConflict();
j$(document).ready(function() {
	if(!Array.prototype.indexOf) {
		Array.prototype.indexOf = function(needle) {
			for(var i = 0; i < this.length; i++) {
				if(this[i] === needle) {
					return i;
				}
			}
			return -1;
		};
	}
	if(assignProfiles_profiles) {
		var tmpProfiles = assignProfiles_profiles;
		tmpProfiles.split(';').forEach(function(profile) {
			profiles.push(decodeURI(profile));
		});
		//console.log(profiles);
	}
	Visualforce.remoting.Manager.invokeAction(
		_RemotingAssignProfilesActions.getProfiles,
		function(result,event){
			result.forEach(function(profile) {
				//console.log(profile);
				html = '<option value="' + profile.Name;
				html += '">' + profile.Name;
				html += '</option>';
				if (profiles.indexOf(profile.Name) > -1) {
					j$('#RightList').append(html);
				} else {
					j$('#LeftList').append(html);
				}
			});
		}, {escape:false,buffer:false}
	);
	j$('#SaveButton').on('click', function(e) {
		Visualforce.remoting.Manager.invokeAction(
			_RemotingAssignProfilesActions.saveProfiles,
			assignProfiles_fieldName,
			assignProfiles_sObjectName,
			assignProfiles_sObjectId,
			profiles,
			function(result,event){
				if(result == 'success') {
					window.location = '/'+assignProfiles_sObjectId+'?nooverride';
				} else {
					alert(result);
				}
			}, {escape:false,buffer:false}
		);
	});
});

var moveSelectedOptions = function(idFrom, idTo) {	
	listFrom = document.getElementById(idFrom);
	listTo = document.getElementById(idTo);
	for ( var x = 0; x < listTo.options.length; x++) {
		listTo.options[x].selected = false;
	}
	for ( var x = 0; x < listFrom.options.length; x++) {
		if (listFrom.options[x].selected == true) {
			if (idTo == 'RightList') {				
				profiles.push(listFrom.options[x].value);
			} else {				
				var location = profiles.indexOf(listFrom.options[x].value);				
				profiles.splice(location, location + 1);
			}
			listTo.appendChild(listFrom.options[x]);
			x--;
		}
	}
	listTo.focus();	
	return false;
}