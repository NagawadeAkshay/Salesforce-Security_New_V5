pageLayoutBuilderApp.controller('SortableCtrl', function($q, $scope, $timeout, $window, $sce) {
    
});
pageLayoutBuilderApp.directive("sortable", function($compile, $parse) {
    var linker = function(scope, element, attrs) {                
        element.sortable({
            connectWith: ".connectedSortable",
            // helper: function() { 
            //         console.log('----this---',j$(this));
            //         return j$('<div id="dragdrophelper" style="padding: 5px;background-color: #ddd;height: 30px;width:80px;">asdsada</div>');
            // },
            helper:"clone",
            items: "li:not(.disabled-li)",
            cancel: ".disabled-li",
            placeholder: "sortable-placeholder",                
            receive: function(event, ui) {      
                //console.log('receive----');                                       
                if(j$(event.target).hasClass('selected-fields')){                                                       
                    scope.handler.moveToSelectedFields(j$(event.target).attr('name'),ui);
                }else if(j$(event.target).hasClass('available-fields')){                                                      
                    scope.handler.moveToAvailableFields(j$(event.target).attr('name'),ui);                             
                }                                                                                          
            },
            start: function( event, ui ) { 
                console.log('----start---',j$(ui.item).attr('label')); 
                var fieldLabel = j$(ui.item).attr('label');                                                                                          
                if(j$(ui.item).hasClass('avail-li')){                                                                      
                    scope.handler.moveFromAvailableFields(j$(ui.item).attr('name'));
                }else if(j$(ui.item).hasClass('sel-li')){                                                 
                    scope.handler.moveFromSelectedFields(j$(ui.item).attr('parentname'),j$(ui.item).attr('name'));
                }
                j$(ui.helper).css('width','150px');
                j$(ui.helper).css('height','30px');
                j$(ui.helper).html('<span style="padding: 5px;background-color: #ddd;height: 30px;width:100%;">'+fieldLabel+'</span>');                
            },                    
            stop: function( event, ui ) { 
                //console.log('stop----'); 
                if(j$(ui.item).hasClass('avail-li')){    
                    j$(this).sortable('cancel');           
                }else if(j$(ui.item).hasClass('sel-li')){                                                       
                    scope.handler.moveToSelectedFields(j$(event.target).attr('name'),ui);
                }                                              
                scope.handler.clearDraggedFields();
            },
            over: function( event, ui ) {                        
            }
        }).disableSelection();
    }
    return {
        restrict: 'A',
        controller: 'SortableCtrl',
        scope: {
            handler:'=',
            helper:'@'
        },
        link: linker
    };
});