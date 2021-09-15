import {LightningElement, api, track, wire} from 'lwc';
import {reduceErrors} from 'c/ldsUtils';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';
import {createRecord, deleteRecord, updateRecord} from 'lightning/uiRecordApi';
import setRecordTypeId from '@salesforce/apex/ToDoControllerSecond.setRecordTypeId';
import getUncompletedToDo from '@salesforce/apex/ToDoControllerSecond.getUncompletedToDo';
import getCompletedToDo from '@salesforce/apex/ToDoController.getCompletedToDo';
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
    //ALL VARIABLES
    @api recordId;
    //LISTS VARIABLES
    @track uncompletedToDoList;
    @track completedToDoList;
    //VARIABLES FOR TO DO
    toDoName;
    toDoDesccription;
    toDoCloseDate;
    priority = 'Low priority'; //default value for priority picklist
    jsonMapRecIdRecName;
    currentRecTypeId = '0125g000000RK9tAAG';
    recordType = 'Programming'; //default value for record type name picklist
    @track statusToDO = TODO_PRIORITY;
    @track nameToDo = TODO_NAME;
    @track descriptionToDo = TODO_DESCRIPTION;
    @track closeDateToDo = TODO_CLOSEDATE;
    @track priorityToDo = TODO_PRIORITY;
    //complete / oncomplete
    @track status = false;
    //modal variables
    @track openModal = false;
    @track openUpdateModal = false;
    //ERROR VARIABLE
    error;
    //VARIABLE FOR SHOWING TO DO EDIT BLOCK
    @track editToDoForm = '"slds-is-expanded slds-hide slds-hidden"';

    //CONNECTED CALLBACK FOR APEX FUNCTION
    connectedCallback() {
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
        //RETURN MAP <RECORD TYPE ID, RECORD TYPE NAME>
        setRecordTypeId()
            .then(result => {
                this.jsonMapRecIdRecName = result;
                this.error = undefined;
            })
            .catch(error => {
                    this.error = error;
                    this.jsonMapRecIdRecName = undefined;
                }
            );
        console.log('Connected callback finished');
    }

///////////////////////START BLOCK HANDLE CREATE SUB TO DO ///////////////////////////////////////////////////////
    handleAddSubToDoSuccess() {
        //REFRESH TODOLISTS ADD ON CLOSING MODAL SCREEN

        /*const inputFields = this.template.querySelectorAll(
            'lightning-input-field'
        );
        if (inputFields) {
            inputFields.forEach(field => {
                field.reset();
            });
        }*/
        this.refreshToDoList();
    }
////////////////////////////END BLOCK HANDLES CREATING SUB TO DO ///////////////////////////////////////////////////////

///////////////////////////START OPEN / CLOSE TO DO BLOCK //////////////////////////////////////////////////////////////
    closeToDo(event) {
        console.log("ID OF COMPLETED TODO = " + event.target.dataset.recordid);
        const fields = {};
        fields[TODO_STATUS.fieldApiName] = true;
        console.log("complete todo, update status");
        fields[TODO_ID.fieldApiName] = event.target.dataset.recordid;
        const recordInput = {fields};
        console.log('updateToDoStatus / recordInput = ' + recordInput);
        updateRecord(recordInput)
            .then(() => {
                console.log("!!!!Updating UncompletedToDo list after complete!!!")
                this.refreshToDoList();
                this.showToast('Success', "ToDo Completed and moved in Completed ToDo list",
                    "success");
            })
            .catch(error => {
                this.showToast('Error with completing ToDo ', error.body.message, "error")
                  });
    }

    reopenToDo(event) {
        console.log("ID OF REOPEN TODO = " + event.target.dataset.recordid);
        const fields = {};
        fields[TODO_STATUS.fieldApiName] = false;
        fields[TODO_ID.fieldApiName] = event.target.dataset.recordid;
        const recordInput = {fields};
        console.log('REOPEN TODO / recordInput = ' + recordInput);
        updateRecord(recordInput)
            .then(() => {
                console.log("!!!!Updating CompletedToDo list after reopen ToDo!!!")
                this.refreshToDoList();
                this.showToast('Success', "ToDo was successfully reopened", "success")
            })
            .catch(error => {
                this.showToast('Error with reopen todo', reduceErrors(error).join(', '), "error")});
    }
////////////////////////////END UPDATING TO DO STATUS //////////////////////////////////////////////////////////////////

///////////////////////////START DELETE TO DO SUB TO DO RECORDS//////////////////////////////////////////////////////////
    deleteToDo(event) {
        const recordToDoId = event.target.dataset.recordid;
        console.log('!!!!!!!ID DELETING TODO!!!!! = ' + recordToDoId);
        deleteRecord(recordToDoId)
            .then(() => {
                this.showToast('Success', "ToDo was successfully deleted", "success")
                this.refreshToDoList();
            })
            .catch((error) => {
                this.showToast('Error with deleting todo', reduceErrors(error).join(', '), "error")
            });
    }
    deleteSubToDo(event) {
        const recordSubToDoId = event.target.dataset.recordid;
        console.log('!!!!!!!ID DELETING SUBTODO!!!!! = ' + recordSubToDoId);
        deleteRecord(recordSubToDoId)
            .then(() => {
                this.refreshToDoList();
            })
            .catch((error) => {
                this.showToast('Error with deleting subTodo', reduceErrors(error).join(', '), "error")
            });
    }
////////////////////////END DELETE TO DO SUB TO DO BLOCK////////////////////////////////////////////////////////////////

/////////////////////////START EDIT TO DO BLOCK/////////////////////////////////////////////////////////////////////////
    handleToDoEditSuccess() {
        this.refreshToDoList();
        console.log("!!!!!handleToDoEditSuccess")
    }
    submitUpdateSuccess() {
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
        this.editToDoForm = '""';
    }
    handleUpdateToDoSuccess() {
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
    handleChangeUncompleteStatus(event) {
        console.log("ID OF COMPLETED SUBTODO = " + event.target.dataset.recordid);
        const fields = {};
        fields[SUBTODO_STATUS.fieldApiName] = true;
        fields[SUBTODO_ID.fieldApiName] = event.target.dataset.recordid;
        const recordInput = {fields};
        updateRecord(recordInput)
            .then(() => {
                console.log("!!!!Updating Uncompleted !!!SUBTODO!!! list after complete!!!")
                this.refreshToDoList();
            })
            .catch(error => {
                this.showToast('Error with completed SubToDo', reduceErrors(error).join(', '), "error")
            });
    }

  /*  handleChangeCompleteStatus(event) {
        console.log("ID OF REOPEN SUBTODO = " + event.target.dataset.recordid);
        const fields = {};
        fields[SUBTODO_STATUS.fieldApiName] = false;
        fields[SUBTODO_ID.fieldApiName] = event.target.dataset.recordid;
        const recordInput = {fields};
        updateRecord(recordInput)
            .then(() => {
                console.log("!!!!REOPEN !!!SUBTODO!!! ID = " + event.target.dataset.recordid);
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
    }*/
///////////////////////END EDIT TO DO BLOCK/////////////////////////////////////////////////////////////////////////////

////////////////START TO DO CREATION BLOCK///////////////////////////////////////////////////////////////////////////////
    //VALUE FOR PICK LISTS IN RECORD CREATE
    get optionsPriority() {
        return [
            {label: 'Low priority', value: 'Low priority'},
            {label: 'Normal priority', value: 'Normal priority'},
            {label: 'High priority', value: 'High priority'},
        ];
    }
    get optionsRecordId() {
        return [
            {label: 'Programming', value: 'Programming'},
            {label: 'Testing', value: 'Testing'},
            {label: 'Design', value: 'Design'},
            {label: 'Other', value: 'Other'},
        ];
    }
    //  jsonmap = '{"0125g000000RK9tAAG" : "Programming", "0125g000000RKA3AAO" : "Design", "0125g000000RKADAA4" : "Testing", "0125g000000RLWRAA4" : "Other"}';
    //RECORD CREATION HANDLERS
    handleChangeRecordType(event) {
        this.recordType = event.target.value;
        console.log('!!!!!CURRENT RECORD TYPE NAME' + this.recordType);
        let myMap = new Map(Object.entries(JSON.parse(this.jsonMapRecIdRecName)));
        this.currentRecTypeId = myMap.get(this.recordType);
        console.log('!!!!!CURRENT RECORD ID ' + this.currentRecTypeId)
    }
    handleChangePriority(event) {
        this.priority = event.target.value;
    }
    handleChangeName(event) {
        this.toDoName = event.target.value;
    }
    handleChangeDescription(event) {
        this.toDoDesccription = event.target.value;
    }
    handleChangeDateClose(event) {
        this.toDoCloseDate = event.target.value;
    }
    saveCreatedToDo() {
        //validation block
        /* let fnameCmp = this.template.querySelector(".nametodo");
         let fdateCmp = this.template.querySelector(".datetodo");
         let fnamevalue = fnameCmp.value;
         let fdatevalue = fdateCmp.value;
         let today = new Date();
         let todayDate = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
          console.log('fdatevalue!!!! = ' + fdatevalue);
          console.log('todayDate!!!! = ' + todayDate);
          console.log('!!cececceecececce' + fdatevalue === todayDate);
         let sucsMessage = true;*/

        const fields = {}
        fields[TODO_NAME.fieldApiName] = this.toDoName,
            fields[TODO_DESCRIPTION.fieldApiName] = this.toDoDesccription,
            fields[TODO_PRIORITY.fieldApiName] = this.priority,
            fields[TODO_CLOSEDATE.fieldApiName] = this.toDoCloseDate,
            fields[TODO_RECORD_TYPE_NAME.fieldApiName] = this.recordType,
            fields[TODO_RECORD_TYPE_ID.fieldApiName] = this.currentRecTypeId;
        console.log('!!!!!CURRENT RECORD TYPE NAME IN SAVE  RECORD' + this.recordType);

        const recordInput = {apiName: TODO_OBJECT.objectApiName, fields};
        console.log("!!!!recordInput!!!" + recordInput);
        createRecord(recordInput).then((todo) => {
            this.refreshToDoList();
            this.openModal = false;
            this.showToast('Success', "ToDo with name: " + this.toDoName + "was successfully created", "success");
        })
            .catch((error) => {
                this.showToast('Error with creating todo', reduceErrors(error).join(', '), "error");
                console.log(JSON.stringify(error));
            });
    }
///////////////////////////END CREATION BLOCK///////////////////////////////////////////////////////////////////////////

////////////////////////////MODAL SCREEN ///////////////////////////////////////////////////////////////////////////////
    showModal() {
        this.openModal = true;
    }

    closeModal() {
        this.openModal = false;
        this.openUpdateModal = false;
    }

////////////////////////MESSAGE FUNCTIONS///////////////////////////////////////////////////////////////////////////////
    showToast(title, message, variant) {
        this.dispatchEvent(
            new ShowToastEvent(
                {
                    title: title,
                    message: message,
                    variant: variant
                })
        );
    }
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////REFRESH APEX///////////////////////////////////////////////////////////////////////////
    refreshToDoList() {
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
