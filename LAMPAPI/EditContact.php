<?php
    $inData = getRequestInfo();

    $firstName = $inData["firstName"];
    $lastName = $inData["lastName"];
    $phoneNumber = $inData["phoneNumber"];
    $email = $inData["email"];
    $contactID = $inData["contactID"];

    $conn = new mysqli("localhost", "TheBeast", "SmallGroupProjectCOP4331C", "COP4331");
    if($conn->connect_error){
        returnWithError($conn->connect_error);
    } else {
        $stmt = $conn->prepare("UPDATE Contacts SET FirstName = ? , LastName = ? , Email = ? , Phone = ? WHERE ID = $contactID");
        $stmt->bind_param("ssss", $firstName, $lastName, $email, $phoneNumber);
        $stmt->execute();
        $stmt->close();
        $conn->close();
    
        returnWithSuccess("Contact updated!");
        
    }

    function getRequestInfo()
    {
        return json_decode(file_get_contents('php://input'), true);
    }

    function sendResultInfoAsJson( $obj )
    {
        header('Content-type: application/json');
        echo $obj;
    }

    function returnWithError( $err )
    {
        $retValue = '{"error":"' . $err . '"}';
        sendResultInfoAsJson( $retValue );
    }

    function returnWithSuccess($message){
        $retValue = '{"success":true,"message":"' . $message . '"}';
        sendResultInfoAsJson($retValue);
    }

?>