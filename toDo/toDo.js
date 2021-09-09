import { LightningElement, api, track, wire} from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';
import { deleteRecord } from 'lightning/uiRecordApi';
import { reduceErrors } from 'c/ldsUtils';
import getUncompletedToDo from '@salesforce/apex/ToDoControllerSecond.getUncompletedToDo';
import getCompletedToDo from '@salesforce/apex/ToDoControllerSecond.getCompletedToDo';
import getAllToDo from '@salesforce/apex/ToDoControllerSecond.getAllToDo';
//import completedToDo from '@salesforce/apex/ToDoControllerSecond.getCompletedToDo';
//import {getSObjectValue} from "@salesforce/apex";
//import uncompletedSubToDo from '@salesforce/apex/ToDoControllerSecond.uncompletedSubToDo';
//import completedSubToDo from '@salesforce/apex/ToDoControllerSecond.completedSubToDo';


import getSingleToDo from '@salesforce/apex/ToDoControllerSecond.getSingleToDo';
import getSingleSubToDo from '@salesforce/apex/ToDoControllerSecond.getSingleSubToDo';

import ToDo from '@salesforce/apex/ToDoController.uncompletedToDo';
import TODO_OBJECT from '@salesforce/schema/Todo__c';
import TODO_NAME from '@salesforce/schema/Todo__c.Name';
import TODO_DESCRIPTION from '@salesforce/schema/Todo__c.Description__c';
import TODO_CLOSEDATE from '@salesforce/schema/Todo__c.Close_Date__c';
import TODO_PRIORITY from '@salesforce/schema/Todo__c.Priority__c';
import TODO_STATUS from '@salesforce/schema/Todo__c.Status__c';


export default class toDo extends LightningElement {

    subToDo;
    error;
    //todos for updating
    singleToDo;
    singleSubToDo;
    subToDoList;
    status;

    uncompletedToDoList;
    completedToDoList;
    allToDoList;

    allSubToDoList;
    uncompletedSubToDoList;
    completedToSubDoList;




    handleChange(event) {
        this.status = event.target.checked;
    }


//call apex methods


    handleChangeStatus(event){
        this.status = event.target.checked;

    }


    //рефрешать через this.getToDoList();

    connectedCallback(){
        getAllToDo()
            .then(result => {
                this.allToDoList = result;
                this.error = undefined;
            })
            .catch(error => {
                this.error = error;
                this.allToDoList = undefined;
            });

        getUncompletedToDo()
            .then(result => {
                this.uncompletedToDoList = result;
                this.error = undefined;
            })
            .catch(error => {
                this.error = error;
                this.uncompletedToDoList = undefined;
            });

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

        console.log('Connected');
    }



    deleteToDo(event) {
        const recordId = event.target.dataset.recordid;
        deleteRecord(recordId)
            .then(() => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Account deleted',
                        variant: 'success'
                    })
                );
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




    /*
    deleteCompletedToDo(event) {
        const recordId = event.target.dataset.recordid;
        event.target.accessKeyLabel
        deleteRecord(recordId)
            .then(() => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Account deleted',
                        variant: 'success'
                    })
                );
                return refreshApex(this.completedToDoList);
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




    /*   @wire(allToDo)
  wiredAllToDo(result) {
      this.allToDoList = result;
      if (result.data) {
          this.todoData = result.data;
          this.error = undefined;
      } else if (result.error) {
          this.error = result.error;
          this.todoData = undefined;
      }
  }

 @wire(uncompletedToDo)
  wiredUncompletedToDo(result) {
  console.log(result, 'result');
      this.uncompletedToDoList = result;
      console.log(result.data);
      if (result.data) {
          this.todoData = result.data;
          this.error = undefined;
      } else if (result.error) {
          this.error = result.error;
          this.todoData = undefined;
      }
  }*/



}
