flexGrid.directive('helpicon',function($compile,ToolTipHelper){
    var template =  '<span ng-if="helpText != undefined" >'+
                     
						 '<a  id="{{helpTextId}}FlexGridtooltip" href="#" aria-describedby="tooltip-info">'+
                               '<span tabindex="0" class="fa fa-info helpIcon" id="{{helpTextId}}FlexGridtooltip"   '+
                            'ng-mouseover="showHelpTooltip(helpText,\'tooltipster-noir\',helpTextId);"'+
                            'ng-focus="showHelpTooltip(helpText,\'tooltipster-noir\',helpTextId);" '+
                          'ng-blur="hideHelpTooltip(helpText,\'tooltipster-noir\',helpTextId);"'+
                          'ng-mouseleave="hideHelpTooltip(helpText,\'tooltipster-noir\',helpTextId);" >'+
                              '</span>'+ 
                        '</a>' +
                    '</span>';
    var linker = function(scope,element,attrs){
        scope.helpTextId = scope.helpTextId.replace(/[.]/g,'');
        scope.showHelpTooltip =function(thisVal,thm,id) {                        
            ToolTipHelper.show(thisVal,thm,id);
        }
        scope.hideHelpTooltip =function(thisVal,thm,id) {                              
            ToolTipHelper.hide(thisVal,thm,id);   
        }
        element.html(template).show();
        $compile(element.contents())(scope);
    }
    return {
            restrict : 'E',
            scope :{     
                helpText : '=',
                helpTextId : '='               
            },            
            link: linker,
    }
});

j$(document).ready(function(){
	j$(window).on( 'scroll', function(){
		if(j$(".tooltipster-base").length > 0){
		   j$(".tooltipster-base").hide();
		}	
				
    });
    j$(window).on( 'scroll', function(){
		if(j$(".xdsoft_datetimepicker").length > 0){
		   j$(".xdsoft_datetimepicker ").hide();
		}	
				
	});
});