import { LightningElement, api, track, wire} from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { deleteRecord } from 'lightning/uiRecordApi';
import { createRecord } from 'lightning/uiRecordApi';
import { updateRecord } from 'lightning/uiRecordApi';
import { reduceErrors } from 'c/ldsUtils';
import setRecordTypeId from '@salesforce/apex/ToDoControllerSecond.setRecordTypeId';
import getUncompletedToDo from '@salesforce/apex/ToDoControllerSecond.getUncompletedToDo';
import getCompletedToDo from '@salesforce/apex/ToDoControllerSecond.getCompletedToDo';
import TODO_OBJECT from '@salesforce/schema/Todo__c';
import TODO_ID from '@salesforce/schema/Todo__c.Id';
import TODO_NAME from '@salesforce/schema/Todo__c.Name';
import TODO_DESCRIPTION from '@salesforce/schema/Todo__c.Description__c';
import TODO_CLOSEDATE from '@salesforce/schema/Todo__c.Close_Date__c';
import TODO_PRIORITY from '@salesforce/schema/Todo__c.Priority__c';
import TODO_RECORD_TYPE_ID from '@salesforce/schema/Todo__c.RecordTypeId';
import TODO_RECORD_TYPE_NAME from '@salesforce/schema/Todo__c.RecordTypeName__c';
import TODO_STATUS from '@salesforce/schema/Todo__c.Status__c';
import SUBTODO_STATUS from '@salesforce/schema/Sub_ToDo__c.Status__c';
import SUBTODO_ID from '@salesforce/schema/Sub_ToDo__c.Id';

export default class toDo extends LightningElement {

    @api recordId;
    @api objectApiName;
    @track uncompletedToDoList;
    @track completedToDoList;
    //VARIABLES FOR TODO CREATION
    toDoName;
    toDoDesccription;
    toDoCloseDate;
    priority = 'Low priority';
    jsonMapRecIdRecName;
    currentRecTypeId = '0125g000000RK9tAAG';
    @track recordType;
    //complete / oncomplete
    @track status = false;
    error;
    @track defaultSubToDoName='';
    @track statusToDO = TODO_PRIORITY;
    @track nameToDo = TODO_NAME;
    @track descriptionToDo = TODO_DESCRIPTION;
    @track closeDateToDo = TODO_CLOSEDATE;
    @track priorityToDo = TODO_PRIORITY;



//CONNECTED CALLBACK FOR APEX FUNCTION
    connectedCallback(){
        //RETURN MAP <RECORD TYPE ID, RECORD TYPE NAME>
        setRecordTypeId()
            .then(result => {
                this.jsonMapRecIdRecName = result;
                console.log('!!!!!jsonMapRecIdRecName!!!!! = ' + result)
                this.error = undefined;
            })
            .catch(error => {
                    this.error = error;
                    this.jsonMapRecIdRecName = undefined;
                }
            );

        //RENDER TO DO AND SUBTODO ITEMS FOR UNCOMPLETE LIST TASK
        getUncompletedToDo()
            .then(result => {
                this.uncompletedToDoList = result;
                this.error = undefined;
            })
            .catch(error => {
                this.error = error;
                this.uncompletedToDoList = undefined;
            });
        //RENDER TO DO AND SUBTODO ITEMS FOR COMPLETE LIST TASK
        getCompletedToDo()
            .then(result => {
                this.completedToDoList = result;
                this.error = undefined;
            })
            .catch(error => {
                    this.error = error;
                    this.completedToDoList = undefined;
                }
            );

        console.log('Connected callback finished');
    }


///////////////////////START BLOCK HANDLE CREATE SUB TO DO ///////////////////////////////////////////////////////

    createNewSubToDo(){
    this.defaultSubToDoName = '';
    }


    handleAddSubToDoSuccess() {
        this.defaultSubToDoName = '';
        //REFRESH TODOLISTS ADD ON CLOSING MODAL SCREEN
        this.refreshToDoList();
        this.dispatchEvent(
            new ShowToastEvent(
                {
                    title: 'Success',
                    message: 'SubToDo is created!',
                    variant: 'success'
                })
        );
        /*
        const inputFields = this.template.querySelectorAll(
            'lightning-input-field'
        );
        if (inputFields) {
            inputFields.forEach(field => {
                field.reset();
            });
        }*/
    }

////////////////////////////END BLOCK HANDLES CREATING SUB TO DO ///////////////////////////////////////////////////////

///////////////////////////START OPEN / CLOSE TO DO BLOCK ////////////////////////////////////////////////////////////////////////


    closeToDo(event){
        console.log("ID OF COMPLETED TODO = " + event.target.dataset.recordid);
        const fields = {};
        fields[TODO_STATUS.fieldApiName] = true;
        fields[TODO_ID.fieldApiName] =  event.target.dataset.recordid;
        const recordInput = { fields };
        console.log('updateToDoStatus / recordInput = ' + recordInput);
        updateRecord(recordInput)
            .then(() => {
                console.log("!!!!Updating UncompletedToDo list after complete!!!")
                this.refreshToDoList();
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'ToDo Completed and moved in Completed ToDo list',
                        variant: 'success'
                    })
                );
                // Display fresh data in the form
            })
            .catch(error => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error creating record',
                        message: error.body.message,
                        variant: 'error'
                    })
                );
            });
    }

    reopenToDo(event){
        console.log("ID OF REOPEN TODO = " + event.target.dataset.recordid);
        const fields = {};
        fields[TODO_STATUS.fieldApiName] = false;
        fields[TODO_ID.fieldApiName] =  event.target.dataset.recordid;
        const recordInput = { fields };
        console.log('REOPEN TODO / recordInput = ' + recordInput);
        updateRecord(recordInput)
            .then(() => {
                console.log("!!!!Updating CompletedToDo list after reopen ToDo!!!")
                this.refreshToDoList();
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'ToDo Completed and moved in Completed ToDo list',
                        variant: 'success'
                    })
                );
                // Display fresh data in the form
            })
            .catch(error => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error creating record',
                        message: error.body.message,
                        variant: 'error'
                    })
                );
            });
    }
////////////////////////////END UPDATING TO DO STATUS //////////////////////////////////////////////////////////////////

///////////////////////////START DELETE RECORDS ////////////////////////////////////////////////////////////////////////
    deleteToDo(event) {
        const recordId = event.target.dataset.recordid;
        console.log('!!!!!!!ID DELETING RECORD!!!!! = ' + recordId);
        deleteRecord(recordId)
            .then(() => {
                this.dispatchEvent(
                    new ShowToastEvent(
                        {
                            title: 'Success',
                            message: 'ToDo was successfully deleted',
                            variant: 'success'
                        })
                );
                //REFRESH APEX LISTS
                this.refreshToDoList();
            })
            .catch((error) => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error deleting record',
                        message: reduceErrors(error).join(', '),
                        variant: 'error'
                    })
                );
            });
    }

////////////////////////END DELETE BLOCK///////////////////////////////////////////////////////////////////////////////




/////////////////////////START EDIT TO DO BLOCK/////////////////////////////////////////////////////////////////////////
    @track editToDoForm = '"slds-is-expanded slds-hide slds-hidden"';
    handleToDoEditSuccess(){
        this.refreshToDoList();
        console.log("!!!!!handleToDoEditSuccess")
    }


    submitUpdateSuccess(){
        this.dispatchEvent(
            new ShowToastEvent(
                {
                    title: 'Success',
                    message: 'ToDo is updated!',
                    variant: 'success'
                })
        );
        this.editToDoForm = '"slds-is-expanded slds-hide slds-hidden"';
        console.log("Update complete");
    }

    handleSetActiveSectionEdit() {
        this.editToDoForm ='""';
    }

    handleUpdateToDoSuccess(){
        this.refreshToDoList();
        this.dispatchEvent(
            new ShowToastEvent(
                {
                    title: 'Success',
                    message: 'ToDo is updated!',
                    variant: 'success'
                })
        );

        console.log("Update complete");
    }

///////////////////////CHANGE SUB TO DO STATUS//////////////////////////////////////////////////////////////////////////

    handleChangeUncompleteStatus(event){
        console.log("ID OF COMPLETED SUBTODO = " + event.target.dataset.recordid);
        const fields = {};
        fields[SUBTODO_STATUS.fieldApiName] = true;
        fields[SUBTODO_ID.fieldApiName] =  event.target.dataset.recordid;
        const recordInput = { fields };
        updateRecord(recordInput)
            .then(() => {
                console.log("!!!!Updating Uncompleted !!!SUBTODO!!! list after complete!!!")

                this.refreshToDoList();
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'SubToDo Completed',
                        variant: 'success'
                    })
                );
            })
            .catch(error => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error creating record',
                        message: error.body.message,
                        variant: 'error'
                    })
                );
            });
    }

    handleChangeCompleteStatus(event){
        console.log("ID OF REOPEN SUBTODO = " + event.target.dataset.recordid);
        const fields = {};
        fields[SUBTODO_STATUS.fieldApiName] = false;
        fields[SUBTODO_ID.fieldApiName] =  event.target.dataset.recordid;
        const recordInput = { fields };
        updateRecord(recordInput)
            .then(() => {
                console.log("!!!!REOPEN !!!SUBTODO!!! ID = " +  event.target.dataset.recordid);
                this.refreshToDoList();
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'SubToDo Reopen',
                        variant: 'success'
                    })
                );
            })
            .catch(error => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error creating record',
                        message: error.body.message,
                        variant: 'error'
                    })
                );
            });
    }

///////////////////////END EDIT TO DO BLOCK/////////////////////////////////////////////////////////////////////////////


////////////////START TO DO CREATION BLOCK///////////////////////////////////////////////////////////////////////////////
    //VALUE FOR PICK LISTS IN RECORD CREATE
    get optionsPriority() {
        return [
            { label: 'Low priority', value: 'Low priority' },
            { label: 'Normal priority', value: 'Normal priority' },
            { label: 'High priority', value: 'High priority' },
        ];
    }
    get optionsRecordId() {
        return [
            { label: 'Programming', value: 'Programming' },
            { label: 'Testing', value: 'Testing' },
            { label: 'Design', value: 'Design' },
            { label: 'Other', value: 'Other' },
        ];
    }
    //  jsonmap = '{"0125g000000RK9tAAG" : "Programming", "0125g000000RKA3AAO" : "Design", "0125g000000RKADAA4" : "Testing", "0125g000000RLWRAA4" : "Other"}';
    //RECORD CREATION HANDLERS
    handleChangeRecordType(event){
        this.recordType = event.target.value;
        console.log('!!!!!CURRENT RECORD TYPE NAME' + this.recordType);
        console.log('!!!!!CURRENT RECORD TYPE ' + JSON.parse(this.jsonMapRecIdRecName));
        let myMap = new Map(Object.entries(JSON.parse(this.jsonMapRecIdRecName)));
        this.currentRecTypeId = myMap.get(this.recordType);
        console.log('!!!!!CURRENT RECORD ID ' + this.currentRecTypeId)
    }

    handleChangePriority(event){
        this.priority = event.target.value;
    }

    handleChangeName(event){
        this.toDoName = event.target.value;
    }

    handleChangeDescription(event){
        this.toDoDesccription = event.target.value;
    }

    handleChangeDateClose(event){
        this.toDoCloseDate = event.target.value;
    }

    saveCreatedToDo() {
        const fields = {}
        fields[TODO_NAME.fieldApiName] = this.toDoName,
            fields[TODO_DESCRIPTION.fieldApiName] = this.toDoDesccription,
            fields[TODO_PRIORITY.fieldApiName] = this.priority,
            fields[TODO_CLOSEDATE.fieldApiName] = this.toDoCloseDate,
            fields[TODO_RECORD_TYPE_NAME.fieldApiName] = this.recordType,
            fields[TODO_RECORD_TYPE_ID.fieldApiName] = this.currentRecTypeId;
        console.log('!!!!!CURRENT RECORD TYPE NAME IN SAVE  RECORD' + this.recordType);

        const recordInput = {apiName: TODO_OBJECT.objectApiName, fields};
        console.log(recordInput);
        createRecord(recordInput).then((todo) => {
            //REFRESH TO DO LISTS ADD ON CLOSING MODAL SCREEN

            this.refreshToDoList();
            this.openModal = false;

            this.dispatchEvent(
                new ShowToastEvent(
                    {
                        title: 'Success',
                        message: 'ToDo created with name: ' + this.toDoName,
                        variant: 'success'
                    })
            );
        })
            .catch((error) =>{
                console.log(JSON.stringify(error));
            });
    }
///////////////////////////END CREATION BLOCK///////////////////////////////////////////////////////////////////////////

////////////////////////////MODAL SCREEN ///////////////////////////////////////////////////////////////////////////////

    @track openModal = false;
    @track openUpdateModal = false;

    showModal() {
        this.openModal = true;
    }

    showUpdateModal() {
        this.openUpdateModal = true;
    }

    closeModal() {
        this.openModal = false;
        this.openUpdateModal = false;
    }

////////////////////////////////REFRESH APEX///////////////////////////////////////////////////////////////////////////
    refreshToDoList(){
        //RETURN MAP <RECORD TYPE ID, RECORD TYPE NAME>
        setRecordTypeId()
            .then(result => {
                this.jsonMapRecIdRecName = result;
                console.log('!!!!!jsonMapRecIdRecName!!!!! = ' + result)
                this.error = undefined;
            })
            .catch(error => {
                    this.error = error;
                    this.jsonMapRecIdRecName = undefined;
                }
            );

        //RENDER TO DO AND SUBTODO ITEMS FOR UNCOMPLETE LIST TASK
        getUncompletedToDo()
            .then(result => {
                this.uncompletedToDoList = result;
                this.error = undefined;
            })
            .catch(error => {
                this.error = error;
                this.uncompletedToDoList = undefined;
            });
        //RENDER TO DO AND SUBTODO ITEMS FOR COMPLETE LIST TASK
        getCompletedToDo()
            .then(result => {
                this.completedToDoList = result;
                this.error = undefined;
            })
            .catch(error => {
                    this.error = error;
                    this.completedToDoList = undefined;
                }
            );

        console.log('Refresh lists finished!');
    }




}
