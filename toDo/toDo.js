import { LightningElement, api, track, wire} from 'lwc';
import { refreshApex } from '@salesforce/apex';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { deleteRecord } from 'lightning/uiRecordApi';
import { createRecord } from 'lightning/uiRecordApi';
import { reduceErrors } from 'c/ldsUtils';
import getUncompletedToDo from '@salesforce/apex/ToDoControllerSecond.getUncompletedToDo';
import getCompletedToDo from '@salesforce/apex/ToDoControllerSecond.getCompletedToDo';
import refreshLists from '@salesforce/apex/ToDoControllerSecond.refreshLists';
import getAllToDo from '@salesforce/apex/ToDoControllerSecond.getAllToDo';
import getAllSubToDo from '@salesforce/apex/ToDoControllerSecond.getAllSubToDo';
import TODO_OBJECT from '@salesforce/schema/Todo__c';
import TODO_NAME from '@salesforce/schema/Todo__c.Name';
import TODO_DESCRIPTION from '@salesforce/schema/Todo__c.Description__c';
import TODO_CLOSEDATE from '@salesforce/schema/Todo__c.Close_Date__c';
import TODO_PRIORITY from '@salesforce/schema/Todo__c.Priority__c';
import TODO_STATUS from '@salesforce/schema/Todo__c.Status__c';
import SUBTODO_OBJECT from '@salesforce/schema/Sub_ToDo__c';
import SUBTODO_NAME from '@salesforce/schema/Sub_ToDo__c.Name';
import SUBTODO_PARENTTID from '@salesforce/schema/Sub_ToDo__c.Parent_ToDo__c';

//import getSingleToDo from '@salesforce/apex/ToDoControllerSecond.getSingleToDo';
//import getSingleSubToDo from '@salesforce/apex/ToDoControllerSecond.getSingleSubToDo';


export default class toDo extends LightningElement {

    //list todos
    @api recordId;
    @api objectApiName;
    @track uncompletedToDoList;
    @track completedToDoList;
    allToDoList;
    allSubToDoList;

    //
    toDoName = '';
    toDoDesccription = '';
    toDoCloseDate = '';
    toDoId;
    priority = 'Low priority';

    error;

    subTodoName;
    subTodoParentID;

    nameToDo = TODO_NAME;
    descriptionToDo = TODO_DESCRIPTION;
    closeDateToDo = TODO_CLOSEDATE;
    priorityToDo = TODO_PRIORITY;




    //todos for updating
    singleToDo;

    //complete / oncomplete
    status;

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
            { label: 'Programming', value: 'Normal priority' },
            { label: 'Testing', value: 'Testing' },
            { label: 'Design', value: 'High priority' },
            { label: 'Other', value: 'Other' },
        ];
    }


    handleChangePriority(event){
        this.priority = event.target.value;
    }

    handleSubmit(event) {
        console.log('onsubmit event recordEditForm'+ event.detail.fields);
    }
    handleAddSubToDoSuccess() {

        this.dispatchEvent(
            new ShowToastEvent(
                {
                    title: 'Success',
                    message: 'SubToDo is created!',
                    variant: 'success'
                })
        );
    }

    handleUpdateToDoSuccess(){
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

    handleChangeStatus(event){
        this.status = event.target.checked;

    }

    handlerChangeSubTodoName(event){
        this.subTodoName = event.target.value;
    }
    handlerParentToDoId(event){
        this.subTodoParentID = event.target.value;
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



    //delete for all records
    deleteToDo(event) {
        const recordId = event.target.dataset.recordid;
        deleteRecord(recordId)
            .then(() => {
                //refreshLists();
               getUncompletedToDo();
               getCompletedToDo();//not working
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

    //create todo


    //рефрешать через this.getToDoList();

    connectedCallback(){

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



    @track openModal = false;
    showModal() {
        this.openModal = true;
    }
    closeModal() {
        this.openModal = false;
    }





}
