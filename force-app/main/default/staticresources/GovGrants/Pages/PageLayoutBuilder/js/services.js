/*
Created by: Prem
Purpose: All services shared across various modules
*/

var sharedServicesModule = angular.module('sharedServices',[]);


sharedServicesModule.service('NotificationService', function(){	
    this.showNotification = function(text,type){
		new Noty({
            type: type,
            layout: 'topCenter',
            text: text,
            progressBar:false,
            timeout: false,
            closeWith: ['click', 'button'],            
        }).show();
	};

    this.showNotification = function(text,type,layout,timeout){        
        new Noty({
            type: type,
            layout: layout,
            text: text,
            progressBar:true,
            timeout: timeout,
            closeWith: ['click', 'button'],            
        }).show();
    };

    this.showNotification = function(text,type,layout){ 
        new Noty({
            type: type,
            layout: layout,
            text: text,
            progressBar:true,
            timeout: 5000,
            closeWith: ['click', 'button'],
        }).show();
    }
});

sharedServicesModule.service('VisualForce', function(){ 
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

        arguments[arguments.length] = { buffer: false, escape: false};
        ++arguments.length;

        Visualforce.remoting.Manager.invokeAction.apply(Visualforce.remoting.Manager, arguments);        
    }
});

sharedServicesModule.service('EverydayUtils', function($sce){ 
    this.trustSrcHTML == function(src) {
        return $sce.trustAsHtml(src);
    };    
    this.openLink = function(recordId){
        window.open('/'+escape(recordId),'_self');
    }    
});

sharedServicesModule.service('WaitService', function($sce){ 
    $ = jQuery.noConflict();
    this.start = function(message) {
        var options = {
             theme:"sk-cube-grid",
             message:message,
             backgroundColor:"#1847B1",
             textColor:"white"
        };
        HoldOn.open(options);
    };    
    this.end = function(){
        HoldOn.close();
    }    
});