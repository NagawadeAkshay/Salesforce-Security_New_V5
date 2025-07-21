var j$ = jQuery.noConflict();
var defaultPhase = chartPreferenceEdit_phaseName;
var initialNode;
var parentNodeVar;
var prevPhase;
setDefaultTab(defaultPhase);

function fetchChartsJS(phase){
	//initialNode.style.backgroundColor = '#FFFFFF';
	//initialNode.style.color = '#428BCA';
	setDefaultTab(phase);
	//initialNode = document.getElementById(phase+'-id');	
	j$("#"+prevPhase+"-id").parents().removeClass('active');
	j$("#"+phase+"-id").parents().addClass('active');
	prevPhase = phase;
	fetchChartNamesJS(phase);
}
function fetchPhasesJS(){
   // var app = document.getElementById('appId').value;
	fetchPhases();
}

function setDefaultTab(defPhase){	
	initialNode = document.getElementById(defPhase+'-id');
	parentNodeVar = initialNode.parentNode;	
	if(prevPhase != undefined && prevPhase != ''){
		j$("#"+prevPhase+"-id").parents().removeClass('active');
	}
	j$("#"+defPhase+"-id").parents().addClass('active');
	prevPhase = defPhase;
}

var phaseNameFromURL = chartPreferenceEdit_phaseName;
if(phaseNameFromURL != undefined && phaseNameFromURL != null && phaseNameFromURL != ''){
	fetchChartsJS(phaseNameFromURL);
}
function RefreshParent() {
	if (window.opener != null && !window.opener.closed) {
		window.opener.location.reload();
	}
}
window.onbeforeunload = RefreshParent;
/*var ChartPreferenceApp = angular.module('ChartPreferenceApp', ['ui.bootstrap']);
ChartPreferenceApp.controller('ChartPreferenceController',function ($scope, $q) {
});
angular.element(document).ready(function() {            
	angular.bootstrap(document.getElementById("ChartPreferenceApp"),['ChartPreferenceApp']); 
});*/