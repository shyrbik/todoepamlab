@IsTest
global with sharing class ToDoCalloutMock implements HttpCalloutMock{

    global HttpResponse respond(HttpRequest request)
    {
        HttpResponse response = new HttpResponse();
        response.setHeader('Content-Type', 'application/json');
        response.setBody('{"name":"Test Name","Description":"Test Description"}');
        response.setStatusCode(200);
        return response;
    }
}