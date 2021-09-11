@IsTest
private class BatchOldTodoTest {
    static void setup() {
        Date dt = Date.today() - 95;
        ToDo__c todo = new ToDo__c(Name = 'Test01');
        insert todo;
        Test.setCreatedDate(todo.Id, dt);
        update todo;
    }

    @IsTest
    static void testExecute() {
        Test.startTest();
        Integer daysAgo = Integer.valueOf(  [SELECT Days_before_deletion__c FROM ToDo_deletion_settings__mdt][0].Days_before_deletion__c  );
        String q = 'SELECT Id, Name FROM Todo__c WHERE Status__c = TRUE' +
                'AND CreatedDate < :Date.today().addDays(-'+ daysAgo + ')' +
                'LIMIT 100';
        BatchOldTodo batch = new BatchOldTodo(q);
        Id batchId = Database.executeBatch(batch);
        Test.stopTest();
        List<Todo__c> oldTodos = [SELECT Id from Todo__c where CreatedDate = last_90_days];
        System.assertEquals(0, oldTodos.size());
    }
}