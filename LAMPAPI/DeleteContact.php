<?php
    $inData = getRequestInfo();

    $firstName = $inData["firstName"];
    $lastName = $inData["lastName"];
    $phoneNumber = $inData["phoneNumber"];
    $userID = $inData["userID"];

    $conn = new mysqli("localhost", "TheBeast", "SmallGroupProjectCOP4331C", "COP4331");
    if($conn->connect_error){
        returnWithError($conn->connect_error);
    }else{
        $stmt = $conn->prepare("DELETE from Contacts WHERE FirstName = ? AND LastName = ? AND Phone = ? AND UserID = ?");
        $stmt->bind_param("ssss", $firstName, $lastName, $phoneNumber, $userID);
        $stmt->execute();
        $stmt->close();
        $conn->close();
        returnWithError("Contact removed!");
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

?>