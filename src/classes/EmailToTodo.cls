/**
 * Created by Me on 9/7/2021.
 */

global with sharing class EmailToTodo implements Messaging.InboundEmailHandler {
    global Messaging.InboundEmailResult handleInboundEmail(Messaging.InboundEmail email,
            Messaging.InboundEnvelope env) {
        // Create an InboundEmailResult object for returning the result of the
        // Apex Email Service
        Messaging.InboundEmailResult result = new Messaging.InboundEmailResult();

        String myPlainText = '';
        // Add the email plain text into the local variable
        myPlainText = email.plainTextBody;

        // New Task object to be created
        Todo__c[] newTask = new Todo__c[0];

        //-----
        try {
            User owner = [
                    SELECT Id, Name, Email
                    FROM User
                    WHERE Email = :email.fromAddress
                    LIMIT 1
            ];

            // Add a new Task to the contact record we just found above.
            newTask.add(new Todo__c(Description__c = myPlainText,
                    Priority__c = 'Normal',
                    Status__c = false,
                    Name = email.subject,
                    RecordTypeId = 'Today', /*IsReminderSet = true,*/
                    Creation_Date__c = System.now() + 1
                    /*,Owner = (Group) owner.Id*/ ));

            // Insert the new Task
            insert newTask;

            System.debug('New ToDo Task: ' + newTask);
        }
        // If an exception occurs when the query accesses
        // the contact record, a QueryException is called.
        // The exception is written to the Apex debug log.
        catch (QueryException e) {
            System.debug('Query Issue: ' + e);
        }

// Set the result to true. No need to send an email back to the user
// with an error message
        result.success = true;

// Return the result for the Apex Email Service
        return result;
    }

}