/*
   Service used to make VF Remoting call 
*/
var vfEngine = angular.module('vfEngineServices',[]);
vfEngine.service('VisualForce', function(){ 
    this.invoke = function(){
        var onSuccessMethod = arguments[arguments.length - 2];
        var onFailureMethod = arguments[arguments.length - 1];

        arguments[arguments.length - 2] = function (result, event) {
            if (event.status)
                onSuccessMethod.apply(this, arguments);
            else
                onFailureMethod.apply(this, arguments);
        };

        arguments[arguments.length - 1] = function (result, event) {
            onFailureMethod.apply(this, event);
        };

        arguments[arguments.length] = { buffer: false, escape: false,timeout: 120000};
        ++arguments.length;

        Visualforce.remoting.Manager.invokeAction.apply(Visualforce.remoting.Manager, arguments);        
    }
});