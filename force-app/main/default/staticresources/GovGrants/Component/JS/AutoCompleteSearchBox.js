var j$ = jQuery.noConflict();
var filterValue;
j$(document).ready(function() {
	if(filterCriteria) {
		filterValue = filterCriteria;
	} else {
		filterValue = '';
	}
	j$('.select2-choice').click( function() {
		j$(this).next().toggleClass('active');
	});
	j$('#Select2Input'+selectIdentifier).keyup( function(e) {
		if(j$(this).val().length > 1) {
			j$('.select2SearchResults').empty();
			j$('.select2SearchResults').append('<li class="select2-result"><span>No Results</span></li>');
			getObjects();
		} else {
			j$('.select2SearchResults').empty();
		}
	});
	var getObjects = function() {
		j$('.select2SearchResults').empty();
		j$('.select2SearchResults').append('<li class="select2-result"><span>Loading Results</span></li>');
		Visualforce.remoting.Manager.invokeAction(
			_RemotingAutoCompleteSearchBoxActions.getObjects,
			Sobject,
			labelField,
			valueField,
			filterValue,
			j$('#Select2Input'+selectIdentifier).val(),
			function(result,event) {
				if (event.status) {
					//console.log(result);
					if (result.length > 0) {
						var html = '';
						var lower = j$('#Select2Input'+selectIdentifier).val().toLowerCase();
						var upper = j$('#Select2Input'+selectIdentifier).val().toUpperCase();
						result.forEach( function(item) {
							html += '<li class="select2-result select2-result-selectable"><div class="select2-result-label"><a href="#!"';
							html += ' onclick="setValue(\'';
							html += item.text;
							html += '\',\'';
							html += item.id;
							html += '\');">';
							html += item.text.replace(lower, '<span class="select2-match">' + lower + '</span>').replace(upper, '<span class="select2-match">' + upper + '</span>');
							html += '</a></div></li>'
						});
						j$('.select2SearchResults').empty();
						j$('.select2SearchResults').append(html);
					} else {
						j$('.select2SearchResults').empty();
						j$('.select2SearchResults').append('<li class="select2-result"><span>No Results</span></li>');
					}
				}
			}, {escape: false,buffer:false}
		);
	}
});
var setValue = function(Name, Id) {
	alert('alsjdf;laj');
	j$('.hiddenDiv').removeClass('active');
	j$('.select2-chosen').text(Name);
	j$('.select2-chosen').focus();
	j$('.select2SearchResults').empty();
	j$('#Select2Input{!selectIdentifier}').val('');
}