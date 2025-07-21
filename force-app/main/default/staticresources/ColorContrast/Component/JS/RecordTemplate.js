var toggleFlag = recordTemplate_hideSidebar;
var j$ = jQuery.noConflict();      
j$(document).ready(function(){        
	//tabPageInit();          
	handleDatePicker(); 
	// handleDateTimePicker(); 	  
	handleRichTextArea();				 
});       

/* UI-Shrawan-10092015  Moved sidebar expand/collapse logic to PageTemplate */

//Date Picker
var handleDatePicker = function(){
	var input = j$("[class$='datepicker']");
	input.datepicker().on('changeDate', function(ev){
		input.datepicker('hide');
	});  
	j$('.dateFormat').hide();
}     

 var handleDateTimePicker = function(){			 
	 var input = j$("[id$='datetimepickerid']").datetimepicker();
	  input.datetimepicker().on('changeDate', function(ev){
		input.datetimepicker('hide'); 
	});    
	j$('.dateTimeFormat').hide(); 

}       	
 var handleRichTextArea = function() { 
	var richText = j$("[class$='RichTextInput']");
	var richTextId = j$(richText).attr('id');	
	var richTextCKeditor = CKEDITOR.replace(richTextId,{
	toolbar: [
			{ name: 'document', items: [ '-', 'NewPage', 'Preview', '-', 'Templates' ] },	// Defines toolbar group with name (used to create voice label) and items in 3 subgroups.
			[ 'Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord', '-', 'Undo', 'Redo' ],			// Defines toolbar group without name.
			'/',																					// Line break - next group will be placed in new line.
			{ name: 'basicstyles', items: [ 'Bold', 'Italic' ] }, 
			 { name: 'editing', items : [ 'Find','Replace','-','SelectAll','-','SpellChecker', 'Scayt' ] }
		] 
	});     	
	richTextCKeditor.on("instanceReady", function(){
		this.document.on("keyup", countCharactersRemaining);
		this.document.on("paste", countCharactersRemaining); 
	}); 
 }      
 
 function countCharactersRemaining()  {    
		var totallength = 1024;			    	    
		var richText = j$("[class$='RichTextInput']"); 		
		var richTextId = j$(richText).attr('id');			      
		var len = CKEDITOR.instances[richTextId].getData().replace(/<("[^"]*"|'[^']*'|[^'">])*>/gi, '').replace(/^\s+|\s+$/g, '');
		j$("#charcountId").text(totallength - len.length + ' characters left');   		 
		var val = j$("[class$='RichTextInput']");				 
		//var newContent = j$("[class$='cke_editable']").html(); 
		////console.log('tnewContent 		',CKEDITOR.instances[richTextId].getData()); 
		//j$('#'+val).val(CKEDITOR.instances[richTextId].getData()); 
		////console.log(' The new content is ',val.val()); 
} 
