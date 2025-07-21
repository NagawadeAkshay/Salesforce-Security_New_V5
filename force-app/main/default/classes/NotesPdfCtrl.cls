/**
**/
public with sharing class NotesPdfCtrl {
    public NotesPdfCtrl (){                    
    }
     public Id parentObjectId {get;set;}
    public  transient String titleValue {get;set;}
}