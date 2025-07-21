var j$ = jQuery.noConflict();
var taskSummaryApp= angular.module('taskSummaryDiv', ['ui.bootstrap']);
taskSummaryApp.controller('TaskSummaryCtrl', function ($q,$scope) {
  $scope.phaseCount={}; 
  $scope.LateTasks = {};
  $scope.DueComingMonth= {};
  $scope.DueIn7Days= {};
  $scope.DueIn30Days= {};
  $scope.HidePhaseChartConfig= hideByphase;
  $scope.HideDuedateChartConfig= hideByDuedate;

  $scope.getPhaseCount = function(){
	  var deferred = $q.defer();
	  Visualforce.remoting.Manager.invokeAction(
			   _RemotingTaskSummary.fetchTasksByPhase,
				function(executeClassResult, event){
					if (event.status) {
						$scope.$apply(function () {
							deferred.resolve(executeClassResult);
							$scope.phaseCount = executeClassResult.PhaseCount;							
						});
					}
				},
				{ buffer: false, escape: false, timeout: 30000 }
			);
	  }
	  $scope.fetchLateTasks= function(){
	  var deferred = $q.defer();
	  Visualforce.remoting.Manager.invokeAction(
			   _RemotingTaskSummary.fetchLateTasks,
				function(executeClassResult, event){
					if (event.status) {
						$scope.$apply(function () {
							deferred.resolve(executeClassResult);
							$scope.LateTasks= executeClassResult.LateTasks;							
						});
					}
				},
				{ buffer: false, escape: false, timeout: 30000 }
			);
	  }
	  $scope.fetchComingMonthsTask= function(){
	  var deferred = $q.defer();
	  Visualforce.remoting.Manager.invokeAction(
			   _RemotingTaskSummary.fetchComingMonthTasks,
				function(executeClassResult, event){
					if (event.status) {
						$scope.$apply(function () {
							deferred.resolve(executeClassResult);
							$scope.DueComingMonth= executeClassResult.DueComingMonthsTask;							
						});
					}
				},
				{ buffer: false, escape: false, timeout: 30000 }
			);
	  }
	  $scope.fetchDueIn30DaysTasks = function(){
	  var deferred = $q.defer();
	  Visualforce.remoting.Manager.invokeAction(
			   _RemotingTaskSummary.fetchDueIn30DaysTasks,
				function(executeClassResult, event){
					if (event.status) {
						$scope.$apply(function () {
							deferred.resolve(executeClassResult);
							$scope.DueIn30Days= executeClassResult.DueIn30Days;							
						});
					}
				},
				{ buffer: false, escape: false, timeout: 30000 }
			);
	  }
	  $scope.fetchDueIn7DaysTasks = function(){
	  var deferred = $q.defer();
	  Visualforce.remoting.Manager.invokeAction(
			   _RemotingTaskSummary.fetchDueIn7DaysTasks,
				function(executeClassResult, event){
					if (event.status) {
						$scope.$apply(function () {
							deferred.resolve(executeClassResult);
							$scope.DueIn7Days= executeClassResult.DueIn7Days;							
						});
					}
				},
				{ buffer: false, escape: false, timeout: 30000 }
			);
	  }
	  $scope.fetchDueIn7DaysTasks();
	  $scope.fetchDueIn30DaysTasks();
	  $scope.fetchComingMonthsTask();
	  $scope.getPhaseCount();
	  $scope.fetchLateTasks();
});
taskSummaryApp.filter('orderObjectBy', function() {
	return function(items, field, reverse) {
		var filtered = [];
		angular.forEach(items, function(item) {
			filtered.push(item);
		});
		filtered.sort(function (a, b) {
			return (a[field] > b[field]) ? 1 : ((a[field] < b[field]) ? -1 : 0);
		});
		if(reverse) filtered.reverse();
			return filtered;
	};
	});
angular.element(document).ready(function() {
	angular.bootstrap(document.getElementById("taskSummaryDiv"),['taskSummaryDiv']);          
});