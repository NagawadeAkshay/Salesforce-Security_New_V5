/*
    ****************************************************************************************
    Audit History
    ****************************************************************************************
    08-01-2022      Tejashreee D        1. added with sharing for SF security review,
    CustomAppConfig__c, Custom App Public R/W
    ****************************************************************************************
*/
global with sharing class CreateStandardPackage {

     @RemoteAction
    global static List<Map<String, String>> getAppTypes() {
        List<Map<String, String>> returnList = new List<Map<String, String>>();
        return returnList;
    }
     
    global static List<Map<String, String>> getPackageTypes() {
        return null;
    }
    @RemoteAction
    global static List<Map<String, String>> getPackageTypes(String selectedAppId) {
        List<Map<String, String>> returnList = new List<Map<String, String>>();
        return returnList;         
    }
    
    global static List<Map<String, Object>> getFormList1(String packageId, String submissionType) {
        return null;
    }
    
    @RemoteAction
    global static List<Map<String, Object>> getFormList1(String packageId, String submissionType,String selectedAppId) {
        List<Map<String, Object>> returnList = new List<Map<String, Object>>();
         return returnList; 
    }
    
    global static Map<String, Object> getPackageDetails(String packageId) {
        return null;
    }
    @RemoteAction
    global static Map<String, Object> getPackageDetails(String packageId,String selectedAppId) {
        Map<String, Object> returnMap = new Map<String, Object>();
        return returnMap;
    }
    
    @RemoteAction
    global static void upsertStandardPackage(String pkgId, Map<String, Object> paramMap) {
        
    }

    private static Integer getMaxVersionNo(String submissionType,String selectedAppId){
        return 0;
    }

    public string getKeyValueMap(){
        return '';  
    }
    @TestVisible 
     public with sharing class PackageWrapper{
        @AuraEnabled
        public list<sObject> ObjectList {get;set;}
        @AuraEnabled
        public Map<String, String> fieldKeyMap {get;set;}
        @AuraEnabled
        public Map<String, String> fieldDataMap {get;set;}
        @AuraEnabled
        public Map<String, Integer> scale {get;set;}
        @AuraEnabled
        public String timelol {get;set;}   
        @AuraEnabled
         public String userLol {get;set;}
        @AuraEnabled
        public String field {get;set;}
         @AuraEnabled
        public String requiredfield {get;set;}
         @AuraEnabled
        public String testrequired {get;set;}
         @AuraEnabled
        public String fieldlabel {get;set;}
         @AuraEnabled
        public String key {get;set;}
         

        public PackageWrapper(list<sObject> sObjectList, Map<String, String> fieldLableMap,Map<String, String> fieldDataTypeMap,Map<String, Integer> scaleMap,String label){
            this.ObjectList = sObjectList;
            this.fieldKeyMap = fieldLableMap;
            this.fieldDataMap = fieldDataTypeMap;
            this.scale = scaleMap;
            this.timelol = (UserInfo.getTimeZone()).toString();
            this.userLol =UserInfo.getLocale();
            this.field = label;
            this.requiredfield = label;
            this.testrequired = label;
            this.fieldlabel = label;
            this.key  = label;
        }
    }
}