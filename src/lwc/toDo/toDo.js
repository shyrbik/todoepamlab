import { LightningElement, api, wire } from 'lwc';
import { createRecord } from 'lightning/uiRecordApi';
import ToDo from '@salesforce/apex/ToDoController.uncompletedToDo';
import TODO_OBJECT from '@salesforce/schema/Todo__c';
import TODO_NAME from '@salesforce/schema/Todo__c.Name';
import TODO_DESCRIPTION from '@salesforce/schema/Todo__c.Description__c';
import TODO_CLOSEDATE from '@salesforce/schema/Todo__c.Close_Date__c';
import TODO_PRIORITY from '@salesforce/schema/Todo__c.Priority__c'
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import RECORD_ID from '@salesforce/schema/Todo__c.RecordTypeId';


export default class toDo extends LightningElement {
//fields for add
//
       toDoName = '';
       toDoDesccription = '';
       toDoCloseDate = '';
       toDoId;
//     descToDo;
//     priority;
     uncompletedToDoList;
     @api recordId;
     @api ToDoApiName;

     editFields = [TODO_NAME, TODO_DESCRIPTION, TODO_CLOSEDATE];
     todoName = TODO_NAME;
//    RECORD_ID = Schema.SObjectType.Todo__c.getRecordTypeInfosByName()


    //UNCOMPLETED TODO LIST
    connectedCallback() {
        this.loadToDo();
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

    uncomplete(){

    }

    saveCreatedToDo() {
        const fields = {}
        fields[TODO_NAME.fieldApiName] = this.toDoName,
        fields[TODO_DESCRIPTION.fieldApiName] = this.toDoDesccription,
        fields[TODO_PRIORITY.fieldApiName] = 'Low priority',
        fields[TODO_CLOSEDATE.fieldApiName] = this.toDoCloseDate;
        const recordInput = {apiName: TODO_OBJECT.objectApiName, fields};
        console.log(recordInput);
        createRecord(recordInput).then((todo) => {
            this.toDoId = todo.id;
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

    loadToDo() {
        ToDo().then(result => {
            this.uncompletedToDoList = result;
            });
    }
}