import { LightningElement, api, wire } from 'lwc';
import { createRecord } from 'lightning/uiRecordApi';
import ToDo from '@salesforce/apex/ToDoController.uncompletedToDo';
import RECORD_ID from '@salesforce/schema/Todo__c.RecordTypeId';


export default class toDo extends LightningElement {
//fields for add
//
//     toDoNAme;
//     descToDo;
//     priority;
     uncompletedToDoList;
//    RECORD_ID = Schema.SObjectType.Todo__c.getRecordTypeInfosByName()


    //UNCOMPLETED TODO LIST
    connectedCallback() {
        this.loadToDo();
    }



    loadToDo() {
        ToDo().then(result => {
            this.uncompletedToDoList = result;
            });
    }


}