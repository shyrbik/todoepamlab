/**
 * Created by  on .
 */

public with sharing class QueueTriggerHandlerHelper {
    public static void assignmentQueue(List<Todo__c> todos) {
        List<Group> queues = [SELECT Id, Name FROM Group WHERE Type = 'Queue'];
        List<RecordType> recTypes = [SELECT Id, Name FROM RecordType LIMIT 3];

        for (Todo__c todo : todos) {
            String recordtypeName =
                    Schema.SObjectType.ToDo__c.getRecordTypeInfosById().get(todo.RecordTypeId).getName();

            if (recordtypeName == 'Tomorrow') {
                for (Group Queue : queues) {
                    if (Queue.Name == 'Tomorrow ToDos' && todo.OwnerId != Queue.Id) {
                        todo.OwnerId = Queue.Id;
                    }
                }
            }
            else if (recordtypeName == 'Later') {
                for (Group Queue : queues) {
                    if (Queue.Name == 'Later ToDos' && todo.OwnerId != Queue.Id) {
                        todo.OwnerId = Queue.Id;
                    }
                }
            } else {
                for (Group Queue : queues) {
                    if (Queue.Name == 'Today ToDos' && todo.OwnerId != Queue.Id) {
                        todo.OwnerId = Queue.Id;
                    }
                }
            }

        }
    }

    @Future(Callout = true)
    public static void insertToOtherOrg(Set<Id> todoIds)
    {
        List<Todo__c> todos = [SELECT Name, Description__c FROM Todo__c WHERE Id IN: todoIds];
        for(Todo__c todo : todos){
            ConnectToOrg.makePostCallout(getRequestBody(todo, true));
        }
    }

    @Future(Callout = true)
    public static void deleteToOtherOrg(Set<Id> todoIds)
    {
        for(Id todo : todoIds)
        {
            ConnectToOrg.makeDeleteCallout('' + todo);
        }
    }

    @Future(Callout = true)
    public static void updateToOtherOrg(Set<Id> todoIds)
    {
        List<Todo__c> todos = [SELECT Name, Description__c FROM Todo__c WHERE Id IN: todoIds];
        for(Todo__c todo : todos){
            ConnectToOrg.makePatchCallout('' + todo.Id, getRequestBody(todo, false));
        }
    }

    public static String getRequestBody(Todo__c todo, Boolean operation)
    {
        String requestBody;
        if(operation)
        {
            requestBody = '{"name":"' + todo.Name + '","Description":"' + todo.Description__c + '","externalId":"' + todo.Id + '"}';
        } else {
            requestBody = '{"Name":"' + todo.Name + '","Description__c":"' + todo.Description__c + '"}';
        }
        return requestBody;
    }
}