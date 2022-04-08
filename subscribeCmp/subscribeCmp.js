import { LightningElement, wire ,track} from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';
import { registerListener, unregisterAllListeners } from 'c/pubsub';
import getAccountRating from '@salesforce/apex/getAccountdata.getAccountRating';
import { updateRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';


export default class SubscribeCmp extends LightningElement {
    strCapturedText = '';
    strCapturedHot =false;
    strCapturedWarm =false;
    strCapturedCold =false;
    @track accData;
    @track errorAccData;     
    
   

    @track columnTable =[
        {label:'Name',fieldName:'Name',type:'text' , editable: true},
        {label:'BillingCity',fieldName:'BillingCity',type:'text' , editable: true},
        {label:'BillingState',fieldName:'BillingState',type:'text' , editable: true},
        {label:'Rating',fieldName:'Rating',type:'text' , editable: true},
      //  {label:'Icone',fieldName:'Icone',cellAttributes: { iconName: { fieldName: 'action:close' } }},
        {label:'Status__c',fieldName:'Status__c'},
         
    ];

    @wire(CurrentPageReference) pageRef;
     connectedCallback(){
        registerListener('RatingValue', this.setCaptureText, this);
    }

    // This method will run once the component is removed from DOM.
    disconnectedCallback(){
        unregisterAllListeners(this);
    }

    // This method will update the value once event is captured.
    setCaptureText(objPayload){
       
        this.strCapturedText = objPayload;
        if(this.strCapturedText == 'Hot'){
            this.strCapturedHot=true;
            this.strCapturedCold=false;
            this.strCapturedWarm=false;
        }else if(this.strCapturedText == 'Cold'){
            this.strCapturedCold=true;
            this.strCapturedWarm=false;
            this.strCapturedHot=false;
        }else if(this.strCapturedText == 'Warm'){
            this.strCapturedCold=false;
            this.strCapturedWarm=true;
            this.strCapturedHot=false;
        }

    }

    @wire(getAccountRating, { searchKey: '$strCapturedText' }) wiredLeads(result) {
        if (result.data) {
            console.log('Chart',result.data);
           this.accData = result.data;
         
           
        } else if (result.error) {

        }
    }

    saveHandleAction(event) {
        this.fldsItemValues = event.detail.draftValues;
        const inputsItems = this.fldsItemValues.slice().map(draft => {
            const fields = Object.assign({}, draft);
            return { fields };
        });

       
        const promises = inputsItems.map(recordInput => updateRecord(recordInput));
        Promise.all(promises).then(res => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: 'Records Updated Successfully!!',
                    variant: 'success'
                })
            );
            this.fldsItemValues = [];
            return this.refresh();
        }).catch(error => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error',
                    message: 'An Error Occured!!',
                    variant: 'error'
                })
            );
        }).finally(() => {
            this.fldsItemValues = [];
        });
    }

   
    async refresh() {
        await refreshApex(this.accObj);
    }


}





