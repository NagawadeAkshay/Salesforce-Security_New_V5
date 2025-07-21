flexGrid.directive('message',function($compile,$sce){
var template =  '<div class="col-md-12">'+
                    '<div class="{{message.class}} displayFlexOnly alertMessage" ng-repeat="message in messages" >'+
                        '<span ng-bind-html="trustSrcHTML(message.icon)" class="messageIcon"/>'+
                        '<span ng-bind-html="trustSrcHTML(message.message)" tabindex="0" />'+
                        '<i class="fa fa-times flexEnd" ng-click="removeMessage($index)" tabindex="0" aria-label="Close"></></i>'+
                    '</div>'+
                '</div>';

    var linker = function(scope,element,attrs){
        element.html(template).show();
        $compile(element.contents())(scope);

         // Code related to message component
        scope.removeMessage = function(index){
            scope.messages.splice(index, 1);
        }

        //General methods
        scope.trustSrcHTML = function(src) {
            return $sce.trustAsHtml(src);
        };
   
    }

    return {
            restrict : 'E',           
            link: linker,
            scope : {
                messages : '='
            }
    }
});
