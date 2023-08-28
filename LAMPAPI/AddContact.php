<?php
    $inData = getRequestInfo();

    $firstName = $inData["firstName"];
    $lastName = $inData["lastName"];
    $phoneNumber = $inData["phoneNumber"];

    $conn = new mysqli("localhost", "root", "SmallGroupProjectCOP4331C", "COP4331");
    if($conn->connect_error){
        returnWithError($conn->connect_error);
    }else{
        $stmt = $conn->prepare("INSERT into Contacts (Firstname, Lastname, Phonenumber) values(?,?,?)");
        $stmt->bind_param("sss", $firstName, $lastName, $phoneNumber);
        $stmt->execute();
        $stmt->close();
        $conn->close();
        returnWithError("");
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