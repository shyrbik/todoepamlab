import { LightningElement, api, track, wire} from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';
import { deleteRecord } from 'lightning/uiRecordApi';
import { reduceErrors } from 'c/ldsUtils';
import uncompletedToDo from '@salesforce/apex/ToDoControllerSecond.uncompletedToDo';
import completedToDo from '@salesforce/apex/ToDoControllerSecond.completedToDo';
import allToDo from '@salesforce/apex/ToDoControllerSecond.allToDo';

import getSingleToDo from '@salesforce/apex/ToDoControllerSecond.getSingleToDo';
import getSingleSubToDo from '@salesforce/apex/ToDoControllerSecond.getSingleSubToDo';

export default class toDo extends LightningElement {

    error;
    //todos for updating
    singleToDo;
    singleSubToDo;

    uncompletedToDoList;
    completedToDoList;
    //спросить ка рефрешнуть весь апекс
    refreshToDoList =[];
    allToDoList;

 /*   connectedCallback(){
    uncompletedToDo().then(resp=>{
        this.uncompletedToDoList = resp.data;
    }).catch(err => console.log(err))
    console.log('Connected');
}*/
//call apex methods
    connectedCallback(){
        uncompletedToDo()
            .then(result => {
                this.uncompletedToDoList = result;
                this.error = undefined;
            })
            .catch(error => {
                this.error = error;
                this.uncompletedToDoList = undefined;
            });

        completedToDo()
            .then(result => {
                this.completedToDoList = result;
                this.error = undefined;
            })
            .catch(error => {
                this.error = error;
                this.completedToDoList = undefined;
            });

//наверное не нужен для каждого листа свой надо будет делать
        allToDo()
            .then(result => {
                this.allToDoList = result;
                this.error = undefined;
            })
            .catch(error => {
                this.error = error;
                this.allToDoList = undefined;
            });


        console.log('Connected');
    }



    //delete uncompleted record

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
                return refreshApex(this.uncompletedToDoList);
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
