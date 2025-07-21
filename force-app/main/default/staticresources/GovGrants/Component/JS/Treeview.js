var accountPage = angular.module('accountTree',[]);
    accountPage.directive("tree1", function($compile,$parse, $timeout,$q){ 
    var  getTreeTemplate= function(accountHierarchy){
        var template = '';
        template = '<ul class=\'acc-hierarchy collapse in \'>'+
                      '<li ng-repeat="node in accountHierarchy" >'+                  
                            '<span ng-if="node.hasChildren">'+
                                '<span data-toggle="collapse" ng-click="toggleMapvalue(node.Id)"  ng-class="{\'fa fa-minus-square fa-5x\':!toggleIconMap[node.Id],\'fa fa-plus-square fa-5x\':toggleIconMap[node.Id]}"  href="#{{node.Id}}" >'+
                                '</span>'+
                            '</span>'+                           
                              '<span ng-if="!node.hasChildren" class="fa fa-square">'+      
                              '</span>'+
                              '<span class="acc-row">{{node.text}}   <a href="/{{node.Id}}" target="_blank" class="fa fa-eye fa-1x"></a>'+
                              '</span>'+                             
                            '<div id="{{node.Id}}" class="repeatAcc collapse in" ng-if="node.hasChildren">'+
                                '<tree1 list="node.nodes" level="level+1"/>'+
                            '</div>'+
                      '</li>'+                        
                    '</ul>';
        //console.log('nodes:=',accountHierarchy);
        return template;                             
   }

   var linker = function(scope, element, attrs){
            //console.log('colParamMap:==',colParamMap);
            scope.toggleMapvalue =function(targetId){
               scope.toggleIconMap[targetId] = !scope.toggleIconMap[targetId]; 
            }    
            scope.getAccountHierarchy = function(){ 
                scope.level = 0;                              
                Visualforce.remoting.Manager.invokeAction(
                    _RemotingAccountActions.GetAccountHierarchy,colParamMap,                  
                    function(accountHierarchy, event){                        
                        if (event.status) {
                        scope.$apply(function(){                                                     
                            scope.accountHierarchy = accountHierarchy.AccountHierarchy; 
                            scope.toggleIconMap =  accountHierarchy.ToggleIconMap;                       
                            var template = getTreeTemplate(scope.accountHierarchy);
                            element.html(template).show();
                            $compile(element.contents())(scope);
                                                                                                                                                           
                            });
                        }                         
                    }, 
                    { buffer: false, escape: false}
                );                
            };
            
            if(scope.accountHierarchy == undefined){
                scope.getAccountHierarchy();
                 
            }else{
                //Commenting out $eval function for security review if in future it does not work then we will check out for the replacement of $eval function.
                //  scope.accountHierarchy = scope.$eval(attrs.list);
                //  scope.level= scope.$eval(attrs.level);                        
                 var template = getTreeTemplate(scope.accountHierarchy);
                 element.html(template).show();
                 $compile(element.contents())(scope);                 
            }
             
                
                                                                    
        }              
    return {                
        restrict: 'E',                                                                                              
        link: linker,
   }   
  });
  angular.element(document).ready(function() {
            angular.bootstrap(document.getElementById('accountTree'), ['accountTree']);
  });    