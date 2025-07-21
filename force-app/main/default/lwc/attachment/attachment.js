import { LightningElement ,wire,track,api} from 'lwc';
import deleteAttchment from '@salesforce/apex/AttachmentsCtrl.deleteAttchment';
import fetchAttachments from '@salesforce/apex/AttachmentsCtrl.fetchAttachments1';
import ExternalLibNew from '@salesforce/resourceUrl/ExternalLibNew';
import { loadStyle } from 'lightning/platformResourceLoader';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';
import {refreshApex} from '@salesforce/apex';
import geticons from '@salesforce/apex/AppUtils.getIcons';

export default class Attachment extends LightningElement {
    records;
    sortedColumn;
    sortedDirection = 'asc';
    initialRecords;
    @api parentId;
    @api pblockId;    
    isView = true;
    loadConfigData = true;
    isDigiSign = false;
    isHistory = false;
    @track dateFormat;
    @track totalRecords;
    @track isCollapsed =false;
    @track isModalOpen = false;
    @track isAddModalOpen = false;
    workspaceEnable = false;
    @track collapsedicon = 'utility:up';   
    @track wiredAttachemntList 
    title;
    disableRowActions;
    hideRowActions;
    actionConfig
    hideDeleteAction;
    hideEditAction;
    hideCreateAction;
    editUrl;
    attachmentId;
    openConfirmmodel=false;
    deleteRecordId;
    saveAndClose;
    save;
    deleteAlert = false;
    showLoadingIcon = false;
    govGrantPleaseWaitIcon;
    isLoading = true;
	showParentLoadingIcon = false;

    @api
    get pbTitle() {
        return this.title;
    }

    set pbTitle(value) {
        this.title = value != ''? value : 'Attachments';
    }
    connectedCallback(){
        geticons({strResourceName : 'govGrantPleaseWaitIcon'}).then(result=>{        
            if(result){
                this.govGrantPleaseWaitIcon = result;
                this.showLoadingIcon = true;
                this.fetchRecords();
                setTimeout(() => {
                    this.showLoadingIcon = false;
                },1000);
            }else{
                this.fetchRecords();
            }        
        }).catch(error => {    
            this.error = error.message;           
            this.isLoading = false;       
        });
		 this.showParentLoadingIcon = true;
        loadStyle(this, ExternalLibNew + '/FontAwesome/css/font-awesome.min.css').then(() => {
        });
        this.fetchRecords();
       
        setTimeout(() => {
        this.showParentLoadingIcon = false;
         },1000);
        
    }
    handleCollapsed(){
        this.isCollapsed = !this.isCollapsed;
        if(this.isCollapsed){
            this.collapsedicon = 'utility:down';
        }else{
            this.collapsedicon = 'utility:up';            
        }
    }
    editAttachment(event){
        
        this.attachmentId = event.target.dataset.id;
        this.isModalOpen = true;
		this.showLoadingIcon = true;
    }
    addAttachment(event){
        
        this.isAddModalOpen = true;
		this.showLoadingIcon = true;
    }

    confirmAndDelete(event){
        this.openConfirmmodel=true;
        this.deleteRecordId=event.target.dataset.id;  
    }
    deleteRecord(event){
        this.showParentLoadingIcon = true;
        this.deleteAttchment1(this.deleteRecordId);
        
        this.deleteAlert = true;
        setTimeout(() => { 

            this.fetchRecords();
            this.deleteAlert = false;
             this.showParentLoadingIcon = false;
         },1000);
         this.openConfirmmodel=false;
		 
            return refreshApex(this.records);
        
    }
    deleteAttchment1(attachemntId){	
        var attachemntId1  = attachemntId;	 
        deleteAttchment({attachmentId:attachemntId1})
            .then(result => {
                if(result.Success){
                    return result.Success;
                 }                
            })
            .catch(error => {
                this.error = error;
            });
    }
    
    closeModal() {        
        this.isModalOpen = false;        
    }
    closeAddModal(){
        this.isAddModalOpen =false;
    }
    closeConfirmationModal() {        
        this.openConfirmmodel = false;        
    }
    saveCloseModal(event) {
      this.template.querySelector("c-attachment-edit").updateAttachment1();

      setTimeout(() => { 
      this.fetchRecords();
      this.isModalOpen = false;
        },2000);         
        event.preventDefault(); 
    }    
    saveDetails(event) {
        this.template.querySelector("c-attachment-edit").updateAttachment1();
        setTimeout(() => { 
        this.fetchRecords();
        },2000); 
       
        event.preventDefault();
    }

    addSaveCloseModal(event) {
      this.template.querySelector("c-attachment-add").addAttachment();
      setTimeout(() => { 
          this.fetchRecords();
        this.isAddModalOpen = false;
      },2000);        
        event.preventDefault();     
    }
    
    addSaveDetails(event) {
       
        this.template.querySelector("c-attachment-add").addAttachment();
        setTimeout(() => {
            this.fetchRecords();
        },2000); 
        event.preventDefault();
    }
    addfromWorkspace(){
		this.showLoadingIcon=true;
        this.template.querySelector("c-attachment-add").processSelected();
        setTimeout(() => { 
            this.fetchRecords();
			this.showLoadingIcon=false;
        },2000);      
      
    }
    editfromWorkspace(){
        this.template.querySelector("c-attachment-edit").processSelected();
        setTimeout(() => { 
            this.fetchRecords();
        },2000); 
    }

    closeMessage(){
        this.deleteAlert = false;
    }
    fetchRecords(){
                     
        fetchAttachments({parentObjectIds:this.parentId,pblockId:this.pblockId,isView:this.isView,loadConfigData:this.loadConfigData,isDigiSign:this.isDigiSign,isHistory:this.isHistory})
        .then(result => {
            let tempRows = JSON.parse( JSON.stringify( result.AttachmentList ) );
            this.disableRowActions = (result.HideDisableRowActions=='Disable' || result.HideDisableRowActions== undefined || result.HideDisableRowActions== '') ? true : false;
            this.hideRowActions = result.HideDisableRowActions=='Hide'  ? true : false;
            this.actionConfig = result.ActionConfig;
            this.saveAndClose = result.saveBehaviour == 'Save and Close Modal'? true : false;
            this.save = this.saveAndClose ? false : true;
            if(result.saveBehaviour == 'Save and Save and Close Modal'){
                this.saveAndClose = true;
                this.save = true;
            }
            for(var action in result.ActionConfig){
                if(action=='Edit'){
                    this.hideEditAction = result.ActionConfig[action].hideAction;
                }else
                if(action=='Delete'){
                    this.hideDeleteAction = result.ActionConfig[action].hideAction;  
                }else
                if(action=='Create' ){
                    this.hideCreateAction = result.ActionConfig[action].hideAction;
                }
            }
            let rows = [];
            for ( let i = 0; i <tempRows.length; i++ ) {               
                let row = tempRows[ i ];
                row.hrefVal = "/servlet/servlet.FileDownload?file=" +tempRows[i].attachmentId;                               
                rows.push( row );
            }
            this.records = rows;
            this.initialRecords = rows;
            this.totalRecords = rows.length;
            if(this.totalRecords === 0){
                this.totalRecords = 'No Records Found';
            }else{
                this.totalRecords = 'Total Records : '+rows.length;
            }
            this.error = undefined;
            this.isLoading = false;
        })
        .catch(error => {
            this.error = error;
            this.isLoading = false;
        });
    }
    tabHandler(event){
        this.workspaceEnable = event.detail;
    }
	
	 handleModalLoad(event){
        this.showLoadingIcon=event.detail;
    }

    handleModalLoad1(event){
        this.showLoadingIcon=event.detail;
    }
	
	
}