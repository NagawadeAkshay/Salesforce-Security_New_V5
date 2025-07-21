/*
Utility Service for all common services used throughout the Grids.
*/
var utility = angular.module('utilityServices',[]);
utility.service('MessageService', function(){ 
    
    this.message = function(type,message){
        switch(type){
            case 'danger':
                return { 
                    'type' : 'danger',
                    'message': message,
                    'icon' : '<i class="fa fa-times-circle" aria-hidden="true"></i>',
                    'class' : 'alert alert-danger',
                    'color' : '#a94442'
                }
            case 'warning':
                return {
                    'type' : 'warning', 
                    'message' : message,
                    'icon' : '<i class="fa fa-exclamation-triangle" aria-hidden="true"></i>', 
                    'class' : 'alert alert-warning', 
                    'color' : '#8a6d3b' 
                }
            case 'info':
                return {
                    'type' : 'info', 
                    'message' : message,
                    'icon' : '<i class="fa fa-info-circle" aria-hidden="true"></i>', 
                    'class' : 'alert alert-info',
                    'color' : '#31708f'
                }
            case 'success':
                return {
                    'type' : 'success', 
                    'message' : message,
                    'icon' : '<i class="fa fa-check-circle" aria-hidden="true"></i>',
                    'class' : 'alert alert-success',
                    'color' : '#3c763d'    
                }
        }
    }

     this.library = {
        'InitSuccess' : this.message('success','Init Config Success'),
        'InitPageRecordSuccess' : this.message('success','Init Page Records Success'),
        'RecordsCountSuccess' : this.message('success','Total Count Success'),
        'AllRecordsSuccess' : this.message('success','All Records Success'),
        'ParentTargetLookup' : this.message('danger','Parent Target Lookup Field not Populated'),
        'OnlyOneMasterList' : this.message('warning','Two Master List Views are not allowed'),
        'MustOneMasterList' : this.message('warning','Atleast one list view should be marked as a Master List View'),
        'filterClauseMust' : this.message('warning','Active list view must have a Filter Criteria'),
        'filterClauseMustForMaster' : this.message('warning','Master list view must have a Filter Criteria'),
        'SelectOneRecord' : this.message('warning','Select At Least One Record'),
        'noListView' : this.message('warning','All Active List views must have filter criteria. Among all, one list view should be Active and marked as a Master List View')
       
    };

    this.push = function(type,messages,message){
        if(this.library[message] != undefined){
            messages.push(this.library[message]);    
        }else{
            messages.push(this.message(type,message));
        }
       
        console.log('----scope.messages----',messages);
    }
    
});

utility.service('ConsoleLogger', function(){ 
    this.log = function(message){
			console.log(message);  
    }
	this.log = function(info,message){
			console.log(info,message); 
    }
});

utility.service('ToolTipHelper', function(){ 
    this.show = function(thisVal,thm,id){
        j$('#'+id+'FlexGridtooltip').tooltipster({ 
            theme: thm,                     
            multiple: true,
            position : 'bottom',
            animation :'fade',          
			
            contentAsHTML: true,    
            content : '<span>'+ thisVal + '</span>'
        });    
        j$('#'+id+'FlexGridtooltip').tooltipster('show');  
    }
    this.hide = function(thisVal,thm,id){
        j$('#'+id+'FlexGridtooltip').tooltipster('hide');
    }
});