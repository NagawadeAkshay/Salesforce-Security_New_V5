flexGrid.directive('ngEnter', function ($parse) {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                   $parse(attrs.ngEnter)(scope);
                });
 
                event.preventDefault();
            }
        });
    };
});