/**
**/
global with sharing class FormController {

    global String orgNameSpace{get;set;}
    public static String formIdVal{get;set;}
    public String packageIdVal{get;set;}
    public String recordIdVal{get;set;}
    public String type{get;set;}
    public Boolean isModalVal{get;set;}
    public PageReference savePage {get;set;}
    public PageReference cancelPage {get;set;}

    global FormController(){

    }

    global void convertDateVal(String sectionId, Date dateVal,CaptureItem__c cpItemObj){
        
    }

    @RemoteAction
    global static String getlocaleDateFormat(){
        return '';
    }
}