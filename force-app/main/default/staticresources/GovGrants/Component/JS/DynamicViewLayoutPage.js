j$(document).ready(function(){    
	ShowReadMore();
});

function ShowReadMore(){
	var maxChars = dynamicViewLayoutPage_expandTextCharSize;
	var ellipsis = "";
	//console.log('===article===', j$(".article") );
	j$(".article").each(function() {
		var text = j$(this).find(".text-full").text();
		var html = j$(this).find(".text-full").html(); 
		if(text.length > maxChars) {         // htmlSubstring  
			//var shortHtml = html.substring(0, maxChars - 3) + "<span class='ellipsis'>" + ellipsis + "</span>";
			var shortHtml = htmlSubstring(html, maxChars - 3) + "<span class='ellipsis'>" + ellipsis + "</span>";
		 
							 
		  j$(this).find(".text-short").html(shortHtml);
			j$(this).find(".text-full").hide();
			j$(this).find(".text-short").show();
			j$(this).find(".read-more").show();
			j$(this).find(".read-less").hide();
						
		} else {
			j$(this).find(".text-full").show();
		}
	});
	j$(".read-more").click(function(){ 
	//console.log('========read-more=======');       
		//var readMoreText = "more";               
		//var readLessText = "less";        
		var $shortElem = j$(this).parent().find(".text-short");
		var $fullElem = j$(this).parent().find(".text-full");   
			 
		//console.log('========shortElem=======',$shortElem); 
		//console.log('========fullElem=======',$fullElem); 
		if($shortElem.is(":visible")) { 
		
		//console.log('========shortElem.is=======');           
			$shortElem.hide();
			$fullElem.show();
			j$(this).parent().find(".read-more").hide();
			j$(this).parent().find(".read-less").show();
			//j$(this).text(readLessText);
		}    
	});
	j$(".read-less").click(function(){        
		var $shortElem = j$(this).parent().find(".text-short");
		var $fullElem = j$(this).parent().find(".text-full");        
		
		if($shortElem.is(":visible")) {           
		} else {
			$shortElem.show();
			$fullElem.hide();
			j$(this).parent().find(".read-more").show();
			j$(this).parent().find(".read-less").hide();
		}       
	});
}

function htmlSubstring(s, n) {
	var m, r = /<([^>\s]*)[^>]*>/g,
		stack = [],
		lasti = 0,
		result = '';

	//for each tag, while we don't have enough characters
	while ((m = r.exec(s)) && n) {
		//get the text substring between the last tag and this one
		var temp = s.substring(lasti, m.index).substr(0, n);
		//append to the result and count the number of characters added
		result += temp;
		n -= temp.length;
		lasti = r.lastIndex;

		if (n) {
			result += m[0];
			if (m[1].indexOf('/') === 0) {
				//if this is a closing tag, than pop the stack (does not account for bad html)
				stack.pop();
			} else if (m[1].lastIndexOf('/') !== m[1].length - 1) {
				//if this is not a self closing tag than push it in the stack
				stack.push(m[1]);
			}
		}
	}

	//add the remainder of the string, if needed (there are no more tags in here)
	result += s.substr(lasti, n);

	//fix the unclosed tags
	while (stack.length) {
		var popStr = stack.pop();
		//console.log('popStr=======', popStr);
		if(popStr != 'br'){
			result += '</' + popStr + '>';
		}
	}
	return result;
}