/**
**/
global with sharing class MassEditableGridExportCtrl {

    public transient String mode{get;set;}
    public transient String recordLayoutId{get;set;}
    public String grid{get;set;}
    public Component.Apex.OutputPanel getDataTable() {
        return new Component.Apex.OutputPanel();
    }
        
    
}