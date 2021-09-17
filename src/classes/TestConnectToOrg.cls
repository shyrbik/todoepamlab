@IsTest
private with sharing class TestConnectToOrg {

    static final String TEST_REQUEST_BODY = '{"name":"Test Name","Description":"Test Description"}';
    static final String END_POINT = 'callout:Other_Org/services/apexrest/ToDo__c/';
    static final String SUB_END_POINT = 'callout:Other_Org/services/apexrest/SubToDo__c/';
    static final String TEST_ID = '0015g00000MLd3EAAT';

    @IsTest
    static void testPostCallout()
    {
        Test.setMock(HttpCalloutMock.class, new ToDoCalloutMock());
        HttpResponse response = ConnectToOrg.makePostCallout(TEST_REQUEST_BODY, END_POINT);
        String contentType = response.getHeader('Content-Type');
        System.assert(contentType=='application/json');
        String actualValue = response.getBody();
        String expectedValue = TEST_REQUEST_BODY;
        System.assertEquals(actualValue, expectedValue, 'The value is not expected');
        System.assertEquals(200, response.getStatusCode(), 'The status code is not 200.');

    }

    @IsTest
    static void testDeleteCallout()
    {
        Test.setMock(HttpCalloutMock.class, new ToDoCalloutMock());
        HttpResponse response = ConnectToOrg.makeDeleteCallout(TEST_ID, END_POINT);
        String contentType = response.getHeader('Content-Type');
        System.assert(contentType=='application/json');
        String actualValue = response.getBody();
        String expectedValue = TEST_REQUEST_BODY;
        System.assertEquals(actualValue, expectedValue, 'The value is not expected');
        System.assertEquals(200, response.getStatusCode(), 'The status code is not 200.');
    }

    @IsTest
    static void testPatchCallout()
    {
        Test.setMock(HttpCalloutMock.class, new ToDoCalloutMock());
        HttpResponse response = ConnectToOrg.makePatchCallout(TEST_ID, TEST_REQUEST_BODY, END_POINT);
        String contentType = response.getHeader('Content-Type');
        System.assert(contentType=='application/json');
        String actualValue = response.getBody();
        String expectedValue = TEST_REQUEST_BODY;
        System.assertEquals(actualValue, expectedValue, 'The value is not expected');
        System.assertEquals(200, response.getStatusCode(), 'The status code is not 200.');
    }

}