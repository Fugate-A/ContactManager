<?php
    $inData = getRequestInfo();

    $firstName = $inData["firstName"];
    $lastName = $inData["lastName"];
    $phoneNumber = $inData["phoneNumber"];
    $email = $inData["email"];
    $userID = $inData["userID"];

    $conn = new mysqli("localhost", "TheBeast", "SmallGroupProjectCOP4331C", "COP4331");
    if($conn->connect_error){
        returnWithError($conn->connect_error);
    }else{
        $stmt = $conn->prepare("INSERT into Contacts (Firstname, Lastname, Phone, Email, UserID) values(?,?,?,?,?)");
        $stmt->bind_param("sssss", $firstName, $lastName, $phoneNumber, $email, $userID);
        $stmt->execute();
        $stmt->close();
        $conn->close();
        returnWithError("Contact added!");
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