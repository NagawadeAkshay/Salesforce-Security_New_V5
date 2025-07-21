pageLayoutBuilderApp.directive("pbsortable", function($compile, $parse) {
    var linker = function(scope, element, attrs) {                
        element.sortable({
            connectWith: ".connectedPageBlockSortable",
            helper: "original",
            placeholder: "sortable-placeholder",                
            receive: function(event, ui) {      
                console.log('receive----');                                                                                                                                                   
            },
            start: function( event, ui ) {                                                                                            
                console.log('start----');
                //scope.handler.pageBlocksStart(ui);
            },                    
            stop: function( event, ui ) { 
                console.log('stop----');
                //console.log('event----',ui.helper);
                console.log(j$(ui.placeholder).index());  
                scope.handler.movePageBlock(j$(ui.item).attr('parentname'),j$(ui.item).attr('index'),ui.item.index());                       
            },
            over: function( event, ui ) {
                console.log('over----');                        
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