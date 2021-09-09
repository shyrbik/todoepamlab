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
}