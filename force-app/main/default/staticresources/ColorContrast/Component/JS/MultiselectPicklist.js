if (!buildOutputString) {
	// Create a string from the content of a listbox
	var buildOutputString = function(listBox, hiddenInput) {
		var str = '';
		for ( var x = 0; x < listBox.options.length; x++) {
			str += encodeURIComponent(listBox.options[x].value) + '&'
			+ encodeURIComponent(listBox.options[x].text) + '&';
		}
		str.length--;
		hiddenInput.value = str.slice(0, -1);
	}
}

if (!moveSelectedOptions) {
  // Move the selected options in the idFrom listbox to the idTo
  // listbox, updating the corresponding strings in idHdnFrom and
  // idHdnTo
  var moveSelectedOptions = function(idFrom, idTo, idHdnFrom, idHdnTo) {
	listFrom = document.getElementById(idFrom);
	listTo = document.getElementById(idTo);
	for ( var x = 0; x < listTo.options.length; x++) {
	  listTo.options[x].selected = false;
	}
	for ( var x = 0; x < listFrom.options.length; x++) {
	  if (listFrom.options[x].selected == true) {
		listTo.appendChild(listFrom.options[x]);
		x--;
	  }
	}
	listTo.focus();
	buildOutputString(listFrom, document.getElementById(idHdnFrom));
	buildOutputString(listTo, document.getElementById(idHdnTo));
  }
}
if (!slideSelectedOptionsUp) {
  // Slide the selected options in the idList listbox up by one position,
  // updating the corresponding string in idHidden
  var slideSelectedOptionsUp = function(idList, idHidden) {
	listBox = document.getElementById(idList);
	var len = listBox.options.length;
	if (len > 0 && listBox.options[0].selected == true) {
	  return;
	}
	for ( var x = 1; x < len; x++) {
	  if (listBox.options[x].selected == true) {
		listBox.insertBefore(listBox.options[x],
			listBox.options[x - 1]);
	  }
	}
	listBox.focus();
	buildOutputString(listBox, document.getElementById(idHidden));
  }
}

if (!slideSelectedOptionsDown) {
  // Slide the selected options in the idList listbox down by one position,
  // updating the corresponding string in idHidden
  var slideSelectedOptionsDown = function(idList, idHidden) {
	listBox = document.getElementById(idList);
	var len = listBox.options.length;
	if (len > 0 && listBox.options[len - 1].selected == true) {
	  return;
	}
	for ( var x = listBox.options.length - 2; x >= 0; x--) {
	  if (listBox.options[x].selected == true) {
		listBox.insertBefore(listBox.options[x + 1],
			listBox.options[x]);
	  }
	}
	listBox.focus();
	buildOutputString(listBox, document.getElementById(idHidden));
  }
}

// initialize the string representations
buildOutputString(document.getElementById(multiselectPicklist_multiselectPanel+':leftList'), 
	document.getElementById(multiselectPicklist_leftHidden));
buildOutputString(document.getElementById(multiselectPicklist_multiselectPanel+':rightList'), 
	document.getElementById(multiselectPicklist_rightHidden));
	
var j$ = jQuery.noConflict();
}else{	
if(multiselectPicklist_disableAddRemove == 'true'){	
	j$('#'+multiselectPicklist_multiselectPanel+':leftList').attr('disabled', 'disabled');
	j$('#'+multiselectPicklist_multiselectPanel+':leftList').removeAttr('disabled');
}